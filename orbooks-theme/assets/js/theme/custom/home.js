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
      $('.video-home .videomain').html($('.video-page', $(data)).html());
    },
    complete: function () {
      $(".video-home.main-loader").removeClass('main-loader')
      $(".video-home").children(".waviy").remove();
      $(".video-home .videomain .video-card:nth-child(n+5)").remove();
      $('.video-home .videomain').slick({
        infinite: true,
        slidesToShow: 1,
        centerMode: false,
        slidesToScroll: 1,
        adaptiveHeight: true,
        arrows: true,
        dots: false
      });
    }
  });
  if ($('.home-new.new-product[data-or-slider-ajax="new"]').length) {
    
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

                      const $section = $('.home-new.new-product[data-or-slider-ajax="new"]');
                      // Contract: slick root is direct sibling of .or-section-head (no inner wrappers)
                      $section.append(response);
                      $section.find('.newprd .product:nth-child(n+30)').remove();
                      const newUrl = $section.find('[data-category-url]').last().attr('data-category-url');
                      orSetSectionHeadHref($section, newUrl);
                      const $newCarousel = $section.find('.newprd').not('.slick-initialized');
                      $newCarousel.slick(orProductCarouselSettings({ adaptiveHeight: true }));
                      return;
                    })
                  }
                })
              datacount++;              
          }
            if(datacount == 0){
              $('.home-new.new-product[data-or-slider-ajax="new"]').hide();
        }
      } 

    })
  }

  // Home bestsellers (or-section) or Catalog page host (.sale-product-section)
  const $saleSliderHost = $('.home-new.best-seller-product[data-or-slider-ajax="sale"]').length
    ? $('.home-new.best-seller-product[data-or-slider-ajax="sale"]')
    : $('.sale-product-section');

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

                      // Contract: append ul.newprd directly (no sale-innersection wrapper)
                      $saleSliderHost.append(response);
                      $saleSliderHost.find('.newprd .product:nth-child(n+30)').remove();
                      const saleUrl = $saleSliderHost.find('[data-category-url]').last().attr('data-category-url');
                      orSetSectionHeadHref($('.home-new.best-seller-product'), saleUrl);
                      const $saleCarousel = $saleSliderHost.find('.newprd').not('.slick-initialized');
                      $saleCarousel.slick(orProductCarouselSettings());
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

  var viewportWidth = $(window).width();
  var Rows = 1;
  if (viewportWidth > 1000) {
    Rows = 2;
  }
  $(document).ready(function () {
    $('.newprd').each(function () {
      const $carousel = $(this);
      if ($carousel.hasClass('slick-initialized')) return;
      $carousel.slick(orProductCarouselSettings({ rows: Rows }));
    });

    $('.newprd-sale').each(function () {
      const $carousel = $(this);
      if ($carousel.hasClass('slick-initialized')) return;
      $carousel.slick(orProductCarouselSettings());
    });
   
    $('.singleprd').each(function () {
      const $carousel = $(this);
      if ($carousel.hasClass('slick-initialized')) return;
      $carousel.slick(orProductCarouselSettings());
    });
    setTimeout(() => {
      $(".recent-main.main-loader").removeClass('main-loader');
      $(".recent-main").children(".waviy").remove();
      $('.recent-slide').each(function () {
        const $carousel = $(this);
        if ($carousel.hasClass('slick-initialized')) return;
        $carousel.slick({
          dots: false,
          arrows: true,
          infinite: true,
          slidesToShow: 1,
          slidesToScroll: 1,
          responsive: [
            {
              breakpoint: 769,
              settings: {
                arrows: false,
              }
            }
          ]
        });
      });
    }, 100);

    setTimeout(() => {

      $(".home-video-main.main-loader").removeClass('main-loader');
      $(".home-video-main").children(".waviy").remove();
      $('.video-slide').each(function () {
        const $carousel = $(this);
        if ($carousel.hasClass('slick-initialized')) return;
        $carousel.slick({
          dots: false,
          arrows: true,
          infinite: true,
          slidesToShow: 1,
          slidesToScroll: 1,
          responsive: [
            {
              breakpoint: 769,
              settings: {
                arrows: false,
              }
            }
          ]
        });
      });
    }, 100);
    $('.blog-cont').each(function () {
      const $carousel = $(this);
      if ($carousel.hasClass('slick-initialized')) return;
      $carousel.slick({
        dots: false,
        arrows: true,
        infinite: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        adaptiveHeight: true
      });
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

    // PDP related sidebar (.stickthis-pdp): no sticky / inner scroll — full list scrolls with page
    // Home/category .stickthis: no sticky / inner scroll — sidebar scrolls with page

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
});



