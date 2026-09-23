import utils from '@bigcommerce/stencil-utils';
import $ from 'jquery';
export default (function (context) {

  function cardheight(){
    if (window.innerWidth > 1023) {
      var cards = $('.productCarousel .card-body');
      var maxHeight = 0;

      // Loop all cards and check height, if bigger than max then save it
      for (var i = 0; i < cards.length; i++) {
        if (maxHeight < $(cards[i]).outerHeight()) {
          maxHeight = $(cards[i]).outerHeight();
        }
      }
      // Set ALL card bodies to this height
      for (var i = 0; i < cards.length; i++) {
        $(cards[i]).height(maxHeight);
      }
    }
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
        adaptiveHeight: true
      });
    }
  });
  if ($('.category-product-section').length) {
    
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

                      $('.category-product-section').append('<div class="innersection custom-list-detail-'+[i]+'">' + response + '</div>');
                      $(".category-product-section .innersection .product:nth-child(n+30)").remove();
                      var viewportWidth = $(window).width();
                      if (viewportWidth > 1000) {
                        var Rows = 2;
                        var Slides = 1;
                      } else if (viewportWidth > 567) {
                        var Rows = 1;
                        var Slides = 1;
                      }
                      $('.innersection .newprd').slick({
                        dots: false,
                        arrows: true,
                        infinite: true,
                        slidesToShow: 3,
                        slidesToScroll: Slides,
                        adaptiveHeight: true,
                        responsive: [
                          {
                            breakpoint: 1000,
                            settings: {
                              slidesToShow: 3
                            }
                          },
                          {
                            breakpoint: 600,
                            settings: {
                              slidesToShow: 2
                            }
                          },
                          {
                            breakpoint: 500,
                            settings: {
                              slidesToShow: 1
                            }
                          }
                        ]
                      });
                      cardheight();
                      return;
                    })
                  }
                })
              datacount++;              
          }
            if(datacount == 0){
              document.querySelectorAll(".category-product-section").style.display = "none";
        }
      } 

    })
  }

  if ($('.sale-product-section').length) {
    
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

                      $('.sale-product-section').append('<div class="sale-innersection custom-list-detail-'+[i]+'">' + response + '</div>');
                      $(".sale-product-section .sale-innersection .product:nth-child(n+30)").remove();
                      var viewportWidth = $(window).width();
                      if (viewportWidth > 1000) {
                        var Rows = 2;
                        var Slides = 1;
                      } else if (viewportWidth > 567) {
                        var Rows = 1;
                        var Slides = 1;
                      }
                      $('.sale-innersection .newprd').slick({
                        dots: false,
                        arrows: true,
                        infinite: true,
                        slidesToShow: 3,
                        slidesToScroll: Slides,
                        responsive: [
                          {
                            breakpoint: 1000,
                            settings: {
                              slidesToShow: 3
                            }
                          },
                          {
                            breakpoint: 600,
                            settings: {
                              slidesToShow: 2
                            }
                          },
                          {
                            breakpoint: 500,
                            settings: {
                              slidesToShow: 1
                            }
                          }
                        ]
                      });

                      return;
                    })
                  }
                })
              datacount++;
          }
            if(datacount == 0){
              document.querySelectorAll(".category-product-section").style.display = "none";
        }
      } 

    })
  }

  var viewportWidth = $(window).width();
  if (viewportWidth > 1000) {
    var Rows = 2;
    var Slides = 1;
  } else if (viewportWidth > 567) {
    var Rows = 1;
    var Slides = 1;
  }
  $(document).ready(function () {
    cardheight();
    
   
    $('.newprd').slick({
      dots: false,
      arrows: true,
      infinite: true,
      slidesToShow: 3,
      slidesToScroll: Slides,
      rows: Rows,
      responsive: [
        {
          breakpoint: 1000,
          settings: {
            slidesToShow: 3
          }
        },
        {
          breakpoint: 600,
          settings: {
            slidesToShow: 2
          }
        },
        {
          breakpoint: 500,
          settings: {
            slidesToShow: 1
          }
        }
      ]
    });
   
    $('.singleprd').slick({
      dots: false,
      arrows: true,
      infinite: true,
      slidesToShow: 3,
      slidesToScroll: 1,
      responsive: [
        {
          breakpoint: 1000,
          settings: {
            slidesToShow: 3
          }
        },
        {
          breakpoint: 600,
          settings: {
            slidesToShow: 2
          }
        },
        {
          breakpoint: 500,
          settings: {
            slidesToShow: 1
          }
        }
      ]
    });
    setTimeout(() => {
      $(".recent-main.main-loader").removeClass('main-loader');
      $(".recent-main").children(".waviy").remove();
      $('.recent-slide').slick({
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
    }, 100);

    setTimeout(() => {

      $(".home-video-main.main-loader").removeClass('main-loader');
      $(".home-video-main").children(".waviy").remove();
      $('.video-slide').slick({
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
    }, 100);
    $('.blog-cont').slick({
      dots: false,
      arrows: true,
      infinite: true,
      slidesToShow: 1,
      slidesToScroll: 1,
      adaptiveHeight: true
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

    if ($(".product-page").length > 0) {
      if ($(window).width() > 1000) {
        var test_length = $(".related-sidebar .card").length;

        if(test_length > 2){

          $(window).scroll(function () {   
            var height_2 = $('.header').height();
            var threshold = height_2 + 250;
       
          if($(window).scrollTop() > threshold) {
             $('.stickthis-pdp').addClass('fixed');
             $('.custom-pdp .custom-sidebar').addClass('fixed');
          }
     
          else if ($(window).scrollTop() <= threshold) {
           $('.stickthis-pdp').removeClass('fixed');
           $('.custom-pdp .custom-sidebar').removeClass('fixed');
          }  
             if ($('.stickthis-pdp').offset().top + $(".stickthis-pdp").height() > $(".footer").offset().top) {
                 $('.stickthis-pdp').css('top',-($(".stickthis-pdp").offset().top + $(".stickthis-pdp").height() - $(".footer").offset().top));
                 $('.stickthis-pdp').addClass('bottom');
             }
         });
        }
      }
    }  else {
      if ($(window).width() > 1000) {
        if ($(".stickthis").length > 0) {

          $(window).scroll(function () {   
              var height_2 = $('.header').height();
            var threshold = height_2 + 50;
        
            if($(window).scrollTop() > threshold) {
              $('.stickthis').addClass('fixed');
            }
      
            else if ($(window).scrollTop() <= 200) {
            $('.stickthis').removeClass('fixed');
            }  
              if ($('.stickthis').offset().top + $(".stickthis").height() > $(".footer").offset().top) {
                  $('.stickthis').css('top',-($(".stickthis").offset().top + $(".stickthis").height() - $(".footer").offset().top));
                  $('.stickthis').addClass('bottom');
              }
          });
        }
      }
    }

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
  $('.slider-inner').slick({
    dots: true,
    arrows: false,
    infinite: true,
    slidesToShow: 1,
    centerMode: false,
    slidesToScroll: 1,
    adaptiveHeight: true
  });
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
});



