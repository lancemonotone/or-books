import _ from 'lodash';
import utils from '@bigcommerce/stencil-utils';
import StencilDropDown from './stencil-dropdown';
import { graphcat } from '../custom/custom';
import { graphcatquick } from '../custom/custom';
import { async } from 'regenerator-runtime';
// import { quickview_interval } from '../global';

export default function (context) {
    const TOP_STYLING = 'top: 49px;';
    const $quickSearchResults = $('.quickSearchResults');
    const $quickSearchForms = $('[data-quick-search-form]');
    const $quickSearchExpand = $('#quick-search-expand');
    const $searchQuery = $quickSearchForms.find('[data-search-quick]');
    const stencilDropDownExtendables = {
        hide: () => {
            $quickSearchExpand.attr('aria-expanded', false);
            $searchQuery.trigger('blur');
        },
        show: (event) => {
            $quickSearchExpand.attr('aria-expanded', true);
            $searchQuery.trigger('focus');
            event.stopPropagation();
        },
    };
    const stencilDropDown = new StencilDropDown(stencilDropDownExtendables);
    stencilDropDown.bind($('[data-search="quickSearch"]'), $('#quickSearch'), TOP_STYLING);

    stencilDropDownExtendables.onBodyClick = (e, $container) => {
        // If the target element has this data tag or one of it's parents, do not close the search results
        // We have to specify `.modal-background` because of limitations around Foundation Reveal not allowing
        // any modification to the background element.
        if ($(e.target).closest('[data-prevent-quick-search-close], .modal-background').length === 0) {
            stencilDropDown.hide($container);
        }
    };

    let quickview_interval = () =>{
        let quickinit = setInterval( async () => {
            let quick_view_pdp = document.querySelector('.productView--quickView');

            if (quick_view_pdp != null) {
                await graphcatquick(context , parseInt(quick_view_pdp.getAttribute('product-id')))
                clearInterval(quickinit);
            }
        }, 100);
    };

    // stagger searching for 1200ms after last input
    const debounceWaitTime = 1200;
    const doSearch = _.debounce((searchQuery) => {
        
        utils.api.search.search(searchQuery, { template: 'search/quick-results' }, (err, response) => {
            if (err) {
                return false;
            }
            
            $quickSearchResults.html(response);

            $('.button.button--primary.quickview').click(function(e) {
                quickview_interval();
            })
            const $quickSearchResultsCurrent = $quickSearchResults.filter(':visible');

            const $noResultsMessage = $quickSearchResultsCurrent.find('.quickSearchMessage');
            if ($noResultsMessage.length) {
                $noResultsMessage.attr({
                    role: 'status',
                    'aria-live': 'polite',
                });
            } else {
                const $quickSearchAriaMessage = $quickSearchResultsCurrent.next();
                $quickSearchAriaMessage.addClass('u-hidden');

                const predefinedText = $quickSearchAriaMessage.data('search-aria-message-predefined-text');
                const itemsFoundCount = $quickSearchResultsCurrent.find('.product').length;

                $quickSearchAriaMessage.text(`${itemsFoundCount} ${predefinedText} ${searchQuery}`);

                setTimeout(() => {
                    $quickSearchAriaMessage.removeClass('u-hidden');
                }, 100);
            }
        });
    }, debounceWaitTime);

    utils.hooks.on('search-quick', (event, currentTarget) => {
        const searchQuery = $(currentTarget).val();

        // server will only perform search with at least 3 characters
        if (searchQuery.length < 3) {
            return;
        }

        doSearch(searchQuery);
    });

    // Catch the submission of the quick-search forms
    $quickSearchForms.on('submit', event => {
        event.preventDefault();

        const $target = $(event.currentTarget);
        const searchQuery = $target.find('input').val();
        const searchUrl = $target.data('url');

        if (searchQuery.length === 0) {
            return;
        }

        window.location.href = `${searchUrl}?search_query=${encodeURIComponent(searchQuery)}`;
    });
}
