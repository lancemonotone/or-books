import 'focus-within-polyfill';

import './global/jquery-migrate';
import './common/select-option-plugin';
import PageManager from './page-manager';
import quickSearch from './global/quick-search';
import currencySelector from './global/currency-selector';
import mobileMenuToggle from './global/mobile-menu-toggle';
import menu from './global/menu';
import foundation from './global/foundation';
import quickView from './global/quick-view';
import cartPreview from './global/cart-preview';
import privacyCookieNotification from './global/cookieNotification';
import carousel from './common/carousel';
import svgInjector from './global/svg-injector';
import custom from './custom/custom';
import { graphcat } from './custom/custom';
import { pricecat } from './custom/custom';
import { graphcatquick } from './custom/custom';
import home from './custom/home';
import custom_pagination from './custom/custom-pagination';
import blog from './custom/blog';

export default class Global extends PageManager {
    onReady() {
        let rels = setInterval(() => {
            // if (document.querySelector('.home-page')) {

            //     // let release_prd = document.querySelector('.innersection');
            //     clearInterval(rels)
            //     // $('.card-figcaption-button.quickview').click(function(e) {
            //     //     console.log("in click event");
            //     //     quickview_interval();
            //     // })
            //      $('.button.button--primary.quickview').click(function(e) {
            //         quickview_interval();
            //     })
            //     // if (release_prd != null) {
                   
            //     // }   
            // }else {
                clearInterval(rels);
                // $('.card-figcaption-button.quickview').click(function(e) {
                //     quickview_interval();
                // })
                $(document).on('click', '.button.button--primary.quickview', function() {
                    quickview_interval();
                })
            // }
        }, 100);
        
        let quickview_interval = () =>{
            let quickinit = setInterval(() => {
                let quick_view_pdp = document.querySelector('.productView--quickView')
                if (quick_view_pdp != null) {
                    graphcatquick(this.context , parseInt(quick_view_pdp.getAttribute('product-id')))
                    clearInterval(quickinit);
                }
            }, 100);
        };
        

        const { cartId, secureBaseUrl } = this.context;
        cartPreview(secureBaseUrl, cartId);
        quickSearch(this.context);
        currencySelector(cartId);
        foundation($(document));
        quickView(this.context);
        carousel(this.context);
        menu();
        mobileMenuToggle();
        privacyCookieNotification();
        svgInjector();
        custom(this.context);
        custom_pagination(this.context);
        home(this.context);
        blog(this.context);
        if($('.product-page .pdp-js').length > 0){
            graphcat(this.context)
        };
        if($('.product-page .default-price-pdp').length > 0){
            pricecat(this.context)
        };
    }
}
