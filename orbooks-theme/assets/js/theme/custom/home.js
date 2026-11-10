import utils from '@bigcommerce/stencil-utils';
import $ from 'jquery';
export default (function (context) {

  /** Set pending See all href after AJAX category URL resolves. */
  function orSetSectionHeadHref($section, url) {
    if (!url) return;
    $section
      .find('.or-section-head-cta')
      .attr('href', url)
      .removeAttr('data-or-section-head-pending');
  }

  /** Init Slick once. Shared entry for section sliders. */
  function orInitSlick($carousel, settings) {
    if (!$carousel || !$carousel.length || $carousel.hasClass('slick-initialized')) {
      return;
    }
    $carousel.slick(settings);
  }

  /** One-slide section sliders (news, events, videos, recent). */
  function orSingleSlideSettings(extra) {
    return Object.assign({
      dots: false,
      arrows: true,
      infinite: true,
      slidesToShow: 1,
      slidesToScroll: 1,
    }, extra || {});
  }

  /**
   * Product carousel: advance a full page (slidesToScroll === slidesToShow)
   * at each breakpoint. Pass extra keys (e.g. rows, adaptiveHeight) as needed.
   */
  function orProductCarouselSettings(extra) {
    const settings = Object.assign({
      dots: false,
      arrows: true,
      infinite: true,
      slidesToShow: 3,
      slidesToScroll: 3,
      responsive: [
        {
          breakpoint: 1000,
          settings: {
            slidesToShow: 3,
            slidesToScroll: 3,
          },
        },
        {
          breakpoint: 600,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 2,
          },
        },
        {
          breakpoint: 500,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1,
          },
        },
      ],
    }, extra || {});

    return settings;
  }

  /** Product root: prefer .productCarousel; legacy .newprd* / .singleprd still match. */
  function orProductCarouselExtra($carousel) {
    const extra = {};
    if ($carousel.closest('[data-or-slider-ajax="new"]').length) {
      extra.adaptiveHeight = true;
    } else if ($carousel.hasClass('newprd') && !$carousel.hasClass('newprd-sale')) {
      const rows = $(window).width() > 1000 ? 2 : 1;
      extra.rows = rows;
    }
    return extra;
  }

  if ($(".top-product").length) {
    var product_id = context.SidebarProductId

    var product_top = product_id;

    utils.api.product.getById(product_top, { template: 'orbookshome/home-product' }, (err, resp) => {
      if (err) return;
      if (resp) {
        $(".top-product").append(resp);
        $(".top-product").children(".waviy").remove();
        $(".top-product.main-loader").removeClass('main-loader');
      }
    });
  };
  
  $.ajax({
    url: "/videos",
    success: function (data) {
      const $videoRail = $('.video-home .videomain');
      $videoRail.html($('.video-page', $(data)).html());
      // Page grid is div > article; section slider contract is ul > li > article.
      $videoRail.children('.listing-card').wrap('<li></li>');
    },
    complete: function () {
      $(".video-home.main-loader").removeClass('main-loader')
      $(".video-home").children(".waviy").remove();
      $('.video-home .videomain').children('li:nth-child(n+5)').remove();
      orInitSlick(
        $('.video-home .videomain'),
        orSingleSlideSettings({ centerMode: false, adaptiveHeight: true })
      );
    }
  });
  if ($('.or-section--slider[data-or-slider-ajax="new"]').length) {
    
    var product_viewidss = [];
    product_viewidss.push(context.new_category_id);
    var product_viewidsssplit = product_viewidss.toString().split(','); 
    
    product_viewidsssplit.forEach( async(items, i) => {

        if (items.length > 0) {

          let datacount = 0;
          if (items != '' && items != undefined) {
    
            fetch(`/categories.php?category=${items}`)
                .then(response => {
                  if (response.status === 404) {
                    
                  } else {
                    
                    utils.api.getPage(`/categories.php?category=${items}`, { template: 'orbooks/categoty-products' }, (err, response) => {
                      
                      if (err) return;

                      const $section = $('.or-section--slider[data-or-slider-ajax="new"]');
                      // Contract: slick root is direct sibling of .or-section-head (no inner wrappers)
                      $section.append(response);
                      $section.find('.productCarousel .product:nth-child(n+30)').remove();
                      const newUrl = $section.find('[data-category-url]').last().attr('data-category-url');
                      orSetSectionHeadHref($section, newUrl);
                      orInitSlick(
                        $section.find('.productCarousel').not('.slick-initialized'),
                        orProductCarouselSettings({ adaptiveHeight: true })
                      );
                      return;
                    })
                  }
                })
              datacount++;              
          }
            if(datacount == 0){
              $('.or-section--slider[data-or-slider-ajax="new"]').hide();
        }
      } 

    })
  }

  // Home or Catalog bestsellers (same .or-section--slider host)
  const $saleSliderHost = $('.or-section--slider[data-or-slider-ajax="sale"]');

  if ($saleSliderHost.length) {
    
    var product_viewidss = [];
    product_viewidss.push(context.sale_category_id);
    var product_viewidsssplit = product_viewidss.toString().split(','); 
    
    product_viewidsssplit.forEach( async(items, i) => {

        if (items.length > 0) {

          let datacount = 0;
          if (items != '' && items != undefined) {
    
            fetch(`/categories.php?category=${items}`)
                .then(response => {
                  if (response.status === 404) {
                    
                  } else {
                    
                    utils.api.getPage(`/categories.php?category=${items}`, { template: 'orbooks/categoty-products' }, (err, response) => {
                      
                      if (err) return;

                      // Contract: append productCarousel ul directly (no sale-innersection wrapper)
                      $saleSliderHost.append(response);
                      $saleSliderHost.find('.productCarousel .product:nth-child(n+30)').remove();
                      const saleUrl = $saleSliderHost.find('[data-category-url]').last().attr('data-category-url');
                      orSetSectionHeadHref($saleSliderHost, saleUrl);
                      orInitSlick(
                        $saleSliderHost.find('.productCarousel').not('.slick-initialized'),
                        orProductCarouselSettings()
                      );
                      return;
                    })
                  }
                })
              datacount++;
          }
            if(datacount == 0){
              $saleSliderHost.hide();
        }
      } 

    })
  }

  $(document).ready(function () {
    // Prefer .productCarousel; legacy newprd / newprd-sale / singleprd still covered.
    $('.productCarousel, .newprd, .newprd-sale, .singleprd').each(function () {
      orInitSlick($(this), orProductCarouselSettings(orProductCarouselExtra($(this))));
    });

    const singleSlideHideArrowsBelow769 = {
      responsive: [
        {
          breakpoint: 769,
          settings: {
            arrows: false,
          },
        },
      ],
    };

    setTimeout(() => {
      $(".recent-main.main-loader").removeClass('main-loader');
      $(".recent-main").children(".waviy").remove();
      $('.recent-slide').each(function () {
        orInitSlick($(this), orSingleSlideSettings(singleSlideHideArrowsBelow769));
      });
    }, 100);

    setTimeout(() => {
      $(".home-video-main.main-loader").removeClass('main-loader');
      $(".home-video-main").children(".waviy").remove();
      $('.video-slide').each(function () {
        orInitSlick($(this), orSingleSlideSettings(singleSlideHideArrowsBelow769));
      });
    }, 100);

    $('.blog-cont').each(function () {
      orInitSlick($(this), orSingleSlideSettings({ adaptiveHeight: true }));
    });
    $('.author-banner-main').slick({
      dots: false,
      arrows: true,
      infinite: true,
      slidesToShow: 1,
      slidesToScroll: 1
    });
    $('.pageslideriframe').slick({
      dots: false,
      arrows: true,
      infinite: true,
      slidesToShow: 1,
      slidesToScroll: 1
    });
    $('.cntslider').slick({
      dots: false,
      arrows: true,
      infinite: true,
      slidesToShow: 1,
      slidesToScroll: 1
    });

    setTimeout(() => {
      if ($(".author-banner-main ").length) {
          $(".author-banner").removeClass('is-loader');
          $(".author-banner .author-banner-main").css('display', 'block');
      }
    }, 100);

    if ($(window).width() > 1024) {
      $('.navPages-container .navPages-list .navPages-item').mouseover(function () {
        $(this).children('.navPages-container  a.navPages-action.has-subMenu').addClass('is-open');
        $(this).children('.navPages-container  div.navPage-subMenu').addClass('is-open');
        $(this).append('<div class="cross-hover"></div>');
      });
      $('.navPages-container .navPages-list .navPages-item').mouseleave(function () {
        $(this).children('.navPages-container  a.navPages-action.has-subMenu').removeClass('is-open');
        $(this).children('.navPages-container  div.navPage-subMenu').removeClass('is-open');
        $('.cross-hover').remove();
      });
      $(".navPage-subMenu-list .navPage-subMenu-item-child").mouseover(function () {
        $(this).children('.navPages-container  a.navPages-action.has-subMenu').addClass('is-open');
        $(this).children('.navPages-container  div.navPage-subMenu').addClass('is-open');
      });
      $(".navPage-subMenu-list .navPage-subMenu-item-child").mouseleave(function () {
        $(this).children('.navPages-container  a.navPages-action.has-subMenu').removeClass('is-open');
        $(this).children('.navPages-container  div.navPage-subMenu').removeClass('is-open');
      });
    }
  });

  $('.brnd-blog .page-subheading').click(function(e) {
  	e.preventDefault();
    let $this = $(this);
    if ($this.next().hasClass('show')) {
        $this.next().removeClass('show');
        $this.next().slideUp(350);
        $this.parent().parent().find('.brnd-blog .page-subheading').removeClass('icon-open');
    } else {
        $this.parent().parent().find('.brnd-blog .blog-list').removeClass('show');
        $this.parent().parent().find('.brnd-blog .blog-list').slideUp(350);
        $this.next().toggleClass('show');
        $this.next().slideToggle(350);
        $this.parent().parent().find('.brnd-blog .page-subheading').addClass('icon-open');
    }
  });

  var $boxes = $('#brandlist > .brand');

  var $btns = $('.btn').click(function () {
    var id = this.id;
    if (id == 'all') {
      $boxes.fadeIn(450);
    } else {
      $boxes.fadeOut(450).filter(function () {
        var re = new RegExp('^' + id, 'i');
        return re.test($(this).text().trim());
      }).stop(true).fadeIn(450);
    }
    $btns.removeClass('active');
    $(this).addClass('active');
  })
  const $eventSlider = $('.slider-inner');
  if ($eventSlider.length) {
    const slideCount = $eventSlider.children().length;
    $eventSlider.slick({
      dots: slideCount > 1,
      arrows: false,
      infinite: slideCount > 1,
      slidesToShow: 1,
      centerMode: false,
      slidesToScroll: 1,
      adaptiveHeight: true,
    });
  }
  if ($('.upcoming-events').children().length) {
  $('.upcoming-events').slick({
    dots: false,
    arrows: true,
    infinite: true,
    slidesToShow: 2,
    centerMode: false,
    slidesToScroll: 1,
    adaptiveHeight: true,
    responsive: [
      {
        breakpoint: 567,
        settings: {
          slidesToShow: 1,
        }
      }
    ]

  });
  }

  // Catalog subjects: trim top N wherever data-or-subjects-popular is set
  // (home + non–Catalog-tree category sidebars; Catalog tree keeps full SSR)
  orRankSubjectsByBestsellers(context);
});

/**
 * Trim `.or-subjects-section[data-or-subjects-popular]` to top categories
 * by bestseller title mix (format SKUs often sit outside subject cats, so we
 * normalize names and score Catalog children). On failure, leave SSR list.
 * Runs from global home.js on any page that includes the molecule.
 */
function orRankSubjectsByBestsellers(context) {
  const root = document.querySelector('.or-subjects-section[data-or-subjects-popular]');
  if (!root || !context.bearerToken) {
    return;
  }

  const limit = parseInt(root.getAttribute('data-or-subjects-popular'), 10) || 10;
  const list = root.querySelector('.or-subjects-list');
  const items = Array.prototype.slice.call(
    root.querySelectorAll('.or-subjects-item[data-category-id]')
  );
  if (!list || !items.length) {
    return;
  }

  function orNormProductName(name) {
    return String(name || '')
      .toLowerCase()
      .replace(/\s*[–—-]\s*(e-?book|paperback|hardback|hardcover|audiobook).*$/i, '')
      .replace(/[^a-z0-9]+/g, ' ')
      .trim();
  }

  function orGraphql(query) {
    return fetch('/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + context.bearerToken,
      },
      credentials: 'same-origin',
      body: JSON.stringify({ query }),
    }).then((res) => res.json());
  }

  const bestQuery = `query OrPopularBestsellers {
    site {
      bestsellers: bestSellingProducts(first: 50) {
        edges { node { name } }
      }
    }
  }`;

  orGraphql(bestQuery)
    .then((bestPayload) => {
      if (
        !bestPayload ||
        bestPayload.errors ||
        !bestPayload.data ||
        !bestPayload.data.site
      ) {
        return null;
      }

      const bestEdges =
        (bestPayload.data.site.bestsellers &&
          bestPayload.data.site.bestsellers.edges) ||
        [];
      const bestNorms = bestEdges
        .map((edge, index) => ({
          norm: orNormProductName(edge.node && edge.node.name),
          weight: bestEdges.length - index,
        }))
        .filter((row) => row.norm);

      if (!bestNorms.length) {
        return null;
      }

      // Keep under Storefront GraphQL complexity budget (~10k): small batches
      const batchSize = 4;
      const batches = [];
      for (let i = 0; i < items.length; i += batchSize) {
        batches.push(items.slice(i, i + batchSize));
      }

      return batches
        .reduce((chain, batch) => {
          return chain.then((counts) => {
            const catFields = batch
              .map((li) => {
                const id = li.getAttribute('data-category-id');
                return (
                  'c' +
                  id +
                  ': category(entityId: ' +
                  id +
                  ') { entityId products(first: 12, sortBy: BEST_SELLING) { edges { node { name } } } }'
                );
              })
              .join('\n');

            const query =
              'query OrPopularSubjectBatch {\n  site {\n' +
              catFields +
              '\n  }\n}';

            return orGraphql(query).then((payload) => {
              if (!payload || payload.errors || !payload.data || !payload.data.site) {
                return counts;
              }
              const site = payload.data.site;
              batch.forEach((li) => {
                const id = li.getAttribute('data-category-id');
                const cat = site['c' + id];
                if (!cat) {
                  return;
                }
                const norms = {};
                ((cat.products && cat.products.edges) || []).forEach((edge) => {
                  const n = orNormProductName(edge.node && edge.node.name);
                  if (n) {
                    norms[n] = true;
                  }
                });
                let score = 0;
                bestNorms.forEach((row) => {
                  if (norms[row.norm]) {
                    score += row.weight;
                  }
                });
                if (score > 0) {
                  counts[id] = score;
                }
              });
              return counts;
            });
          });
        }, Promise.resolve({}))
        .then((counts) => ({ counts }));
    })
    .then((result) => {
      if (!result || !result.counts) {
        return;
      }

      const counts = result.counts;
      const rankedIds = Object.keys(counts).sort(
        (a, b) => counts[b] - counts[a] || Number(a) - Number(b)
      );

      if (!rankedIds.length) {
        return;
      }

      const ordered = rankedIds.slice(0, limit);
      items.forEach((li) => {
        const id = li.getAttribute('data-category-id');
        if (ordered.length < limit && ordered.indexOf(id) === -1) {
          ordered.push(id);
        }
      });

      const byId = {};
      items.forEach((li) => {
        byId[li.getAttribute('data-category-id')] = li;
      });

      ordered.forEach((id) => {
        if (byId[id]) {
          list.appendChild(byId[id]);
        }
      });

      items.forEach((li) => {
        const id = li.getAttribute('data-category-id');
        if (ordered.indexOf(id) === -1) {
          li.parentNode && li.parentNode.removeChild(li);
        }
      });
    })
    .catch(() => {
      // Keep full SSR Catalog children
    });
}
