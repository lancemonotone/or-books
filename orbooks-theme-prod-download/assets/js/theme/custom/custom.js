import $ from 'jquery';
import ProductDetails from '../common/product-details';
import utils from '@bigcommerce/stencil-utils';
import { async } from 'regenerator-runtime';

// import { Fancybox } from "@fancyapps/ui";
// import "@fancyapps/ui/dist/fancybox/fancybox.css";

export default (function (context) {
  // sidebar category toggle start
  // function categoryLength(params) {
  //     var subjectcategory = $(".subject-category")
  // }

  // Function to run when GeoTargetly has loaded




  $(document).on('click', '.navlist-show-btn', function (e) {
    e.preventDefault();
    $(this).addClass('showless');
    $(this)
      .parents('.sidebarBlock')
      .find('.navList-item.navlist-hidden')
      .removeClass('navlist-hidden')
      .addClass('hiddenremove');
    $(this).text('View Less');
  });
  $(document).on('click', '.navlist-show-btn.showless', function (e) {
    e.preventDefault();
    $(this).removeClass('showless');
    $(this)
      .parents('.sidebarBlock')
      .find('.navList-item.hiddenremove')
      .addClass('navlist-hidden')
      .removeClass('hiddenremove');
    $(this).text('View All');
  });
  // sidebar category toggle end

  // in the media hide if no blog
  setTimeout(function () {
    console.log($('.blog-list .blog').children().length);
    if ($('.blog-list .blog').children().length < 1) {
      $('.blog-list').parents('.accordion-tab').css('display', 'none');
    }
  }, 2500);
  function searchresultclose() {
    $('.form-close').click(function () {
      $('.search-input').val('');
      //   $(".search-div .form-input").val("");
      $('.quick-results').html('');
      $('.dropdown--quickSearch').removeClass('is-open');
      $('body').removeClass('search-open');
    });
  }
  $('.navUser-action--quickSearch').click(function () {
    $('body').addClass('search-open');
  });
  searchresultclose();

  $(document).on('click', '.share-btn .share-icon', function () {
    $(this).siblings('.share-list').toggle('slow');
  });

  $('.accordion-custom-tabs .accordion-title').click(function () {
    $(this).toggleClass('is-open');
    $(this).next().slideToggle(350);
  });

  $('.listItem').each(function () {
    var pid = $(this).attr('data-entity-id');
    if (pid != undefined) {
      utils.api.product.getById(
        pid,
        { template: 'orbooks/warranty' },
        (err, response) => {
          $(this).parent().find('.card-warranty').html(response)[0];
          if (err) {
          }
        }
      );
    }
  });

  $('.card').each(function () {
    var sale = $(this)
      .find('.card-body .card-text .sale_price')
      .text()
      .replace(/[^0-9\.]+/g, '');
    var actual = $(this)
      .find('.card-body .card-text .actual_price')
      .text()
      .replace(/[^0-9\.]+/g, '');
    var discount_price = actual - sale;
    var discount = (discount_price * 100) / actual;
    var discount_round = discount.toPrecision(2);
    if (sale == 0 || actual == 0) {
    } else {
      $(this)
        .find('.discount_off')
        .html('<span>' + discount_round + '% off</span>');
    }
  });
  // if ($('.accordion-desc .blog').length > 2) {
  //     $('.accordion-desc .blog:nth-child(n+3)').remove();
  // }

  // pagination of video/event page
  $(document).ready(function () {
    var event_Per_Page = context.ShowEventsPage;
    var show_per_page = event_Per_Page;

    var number_of_items = $('.custom-page-data').children().length;
    var number_of_pages = Math.ceil(number_of_items / show_per_page);
    $('.current_page').val(0);
    $('.show_per_page').val(show_per_page);
    var navigation_html =
      '<li class="deactive-arrow pagination-item pagination-item--previous"><a class="pagination-link previous_link arrow" ><i class="icon"><svg><use href="#icon-arrow-left"></use></svg></i> Prev</a></li>';
    var current_link = 0;
    while (number_of_pages > current_link) {
      navigation_html +=
        '<li class="pagination-number-item pagination-item page_link" longdesc="' +
        current_link +
        '"><a class="pagination-link pagination-number-link"  >' +
        (current_link + 1) +
        '</a></li>';
      current_link++;
    }
    navigation_html +=
      '<li class="pagination-item pagination-item--next"><a class="pagination-link next_link arrow" ">Next <i class="icon"><svg><use href="#icon-arrow-right"></use></use></svg></i></a></li>';
    $('.page_navigation').html(navigation_html);
    $('.page_navigation .page_link:first').addClass('active_page');
    $('.page_navigation .page_link:first').addClass('pagination-item--current');
    $('.custom-page-data').children().css('display', 'none');
    $('.custom-page-data')
      .children()
      .slice(0, show_per_page)
      .css('display', 'block');
    var total_page = $('.pagination-number-item').length - 1;
    if (total_page < 1) {
      $('.pagination-custom').css('display', 'none');
    }
  });
  $(document).on('click', '.previous_link', function () {
    var new_page = parseInt($('.current_page').val()) - 1;
    if ($('.pagination-item--current').prev('.page_link').length == true) {
      go_to_page(new_page);
      $('.pagination-item--next').removeClass('deactive-arrow');
    }
    if (new_page < 1) {
      $('.pagination-item--previous').addClass('deactive-arrow');
    }
  });
  $(document).on('click', '.next_link', function () {
    var new_page = parseInt($('.current_page').val()) + 1;
    if ($('.pagination-item--current').next('.page_link').length == true) {
      go_to_page(new_page);
      $('.pagination-item--previous').removeClass('deactive-arrow');
    }
    var abc = $('.pagination-number-item').length - 1;
    if (abc == new_page) {
      $('.pagination-item--next').addClass('deactive-arrow');
    }
  });
  $(document).on('click', '.pagination-number-link', function () {
    var page_num = $(this).parent('.page_link').attr('longdesc');
    var show_per_page = parseInt($('.show_per_page').val());
    var start_from = page_num * show_per_page;
    var end_on = start_from + show_per_page;
    $('.custom-page-data')
      .children()
      .css('display', 'none')
      .slice(start_from, end_on)
      .css('display', 'block');
    $('.pagination-number-item[longdesc=' + page_num + ']')
      .addClass('pagination-item--current')
      .siblings('.pagination-item--current')
      .removeClass('pagination-item--current');
    $('.current_page').val(page_num);

    if (page_num < 1) {
      $('.pagination-item--previous').addClass('deactive-arrow');
    } else {
      $('.pagination-item--previous').removeClass('deactive-arrow');
    }
    var abc_per_page = $('.pagination-number-item').length - 1;
    if (abc_per_page == page_num) {
      $('.pagination-item--next').addClass('deactive-arrow');
    } else {
      $('.pagination-item--next').removeClass('deactive-arrow');
    }
  });
  function go_to_page(page_num) {
    var show_per_page = parseInt($('.show_per_page').val());
    var start_from = page_num * show_per_page;
    var end_on = start_from + show_per_page;
    $('.custom-page-data')
      .children()
      .css('display', 'none')
      .slice(start_from, end_on)
      .css('display', 'block');
    $('.pagination-number-item[longdesc=' + page_num + ']')
      .addClass('pagination-item--current')
      .siblings('.pagination-item--current')
      .removeClass('pagination-item--current');
    $('.current_page').val(page_num);
  }

  // author pagination

  $(document).ready(function () {
    var author_current_page = context.AuthorPerPage;
    var author_show_per_page = author_current_page;

    var author_number_of_items = $('.author-page-data').children().length;
    var author_number_of_pages = Math.ceil(
      author_number_of_items / author_show_per_page
    );

    $('.author_current_page').val(0);
    $('.author_show_per_page').val(author_show_per_page);

    var author_navigation_html =
      '<li class=" deactive-arrow author-pagination-item author-pagination-item--previous"><a class="author-pagination-link author_previous_link arrow" ><i class="icon"><svg><use href="#icon-arrow-left"></use></svg></i> Prev</a></li>';
    var author_current_link = 0;

    while (author_number_of_pages > author_current_link) {
      author_navigation_html +=
        '<li class="author-pagination-number-item author-pagination-item author_page_link" longdesc="' +
        author_current_link +
        '"><a class="author-pagination-link author-pagination-number-link"  >' +
        (author_current_link + 1) +
        '</a></li>';
      author_current_link++;
    }
    author_navigation_html +=
      '<li class="author-pagination-item author-pagination-item--next"><a class="author-pagination-link author_next_link arrow" ">Next <i class="icon"><svg><use href="#icon-arrow-right"></use></use></svg></i></a></li>';

    $('.author_page_navigation').html(author_navigation_html);
    $('.author_page_navigation .author_page_link:first').addClass(
      'author-active_page'
    );
    $('.author_page_navigation .author_page_link:first').addClass(
      'author-pagination-item--current'
    );
    $('.author-page-data').children().css('display', 'none');
    $('.author-page-data')
      .children()
      .slice(0, author_show_per_page)
      .css('display', 'block');

    var author_total_page = $('.author-pagination-number-item').length - 1;

    if (author_total_page < 1) {
      $('.pagination-author').css('display', 'none');
    }
  });
  $(document).on('click', '.author_previous_link', function () {
    var author_new_page = parseInt($('.author_current_page').val()) - 1;

    if (
      $('.author-pagination-item--current').prev('.author_page_link').length ==
      true
    ) {
      author_go_to_page(author_new_page);
      $('.author-pagination-item--next').removeClass('deactive-arrow');
    }
    if (author_new_page < 1) {
      $('.author-pagination-item--previous').addClass('deactive-arrow');
    }
  });
  $(document).on('click', '.author_next_link', function () {
    var author_new_page = parseInt($('.author_current_page').val()) + 1;

    if (
      $('.author-pagination-item--current').next('.author_page_link').length ==
      true
    ) {
      author_go_to_page(author_new_page);
      $('.author-pagination-item--previous').removeClass('deactive-arrow');
    }
    var author_abc = $('.author-pagination-number-item').length - 1;
    if (author_abc == author_new_page) {
      $('.author-pagination-item--next').addClass('deactive-arrow');
    }
  });
  $(document).on('click', '.author-pagination-number-link', function () {
    var author_page_num = $(this).parent('.author_page_link').attr('longdesc');
    var author_show_per_page = parseInt($('.author_show_per_page').val());
    var author_start_from = author_page_num * author_show_per_page;
    var author_end_on = author_start_from + author_show_per_page;

    $('.author-page-data')
      .children()
      .css('display', 'none')
      .slice(author_start_from, author_end_on)
      .css('display', 'block');
    $('.author-pagination-number-item[longdesc=' + author_page_num + ']')
      .addClass('author-pagination-item--current')
      .siblings('.author-pagination-item--current')
      .removeClass('author-pagination-item--current');
    $('.author_current_page').val(author_page_num);

    if (author_page_num < 1) {
      $('.author-pagination-item--previous').addClass('deactive-arrow');
    } else {
      $('.author-pagination-item--previous').removeClass('deactive-arrow');
    }
    var author_abc_per_page = $('.author-pagination-number-item').length - 1;
    if (author_abc_per_page == author_page_num) {
      $('.author-pagination-item--next').addClass('deactive-arrow');
    } else {
      $('.author-pagination-item--next').removeClass('deactive-arrow');
    }
  });
  function author_go_to_page(author_page_num) {
    var author_show_per_page = parseInt($('.author_show_per_page').val());
    var author_start_from = author_page_num * author_show_per_page;
    var author_end_on = author_start_from + author_show_per_page;

    $('.author-page-data')
      .children()
      .css('display', 'none')
      .slice(author_start_from, author_end_on)
      .css('display', 'block');
    $('.author-pagination-number-item[longdesc=' + author_page_num + ']')
      .addClass('author-pagination-item--current')
      .siblings('.author-pagination-item--current')
      .removeClass('author-pagination-item--current');
    $('.author_current_page').val(author_page_num);
  }
})

      function onGeoLoaded() {
        if (
          typeof window.geotargetly_country_name === 'function' &&
          typeof window.geotargetly_country_code === 'function'
        ) {
          var country_name = window.geotargetly_country_name();

          return country_name;
        } else {
          return null;
        }
      }


export async function graphcat(context, product_id = 0) {

    var currencyCode = context.currency_code;
    var bearerToken = context.bearerToken;
    var productid = product_id == 0? context.productId : product_id ;
    var sku = context.sku;

   let product_variables = ['Paperback Product ID','Hardback Product ID', 'Ebooks Product ID', 'Ebooks+paperback Product ID',  'Audiobook Product ID'];
    var query = `query {
        site {
          product (entityId:${productid}){
            sku
            customFields {
              edges {
                node {
                  name
                  value
                  entityId
                }
              }
            }
          }
        }
      }`
    var graphql_query_result = $.ajax({
        url: "/graphql",
        contentType: "application/json",
        type: 'POST',
        async: false,
        headers: {
            'Authorization': 'Bearer ' + bearerToken
        },
        data: JSON.stringify({ query: query }),
        success: function (productvariationdata) {
        }
    });
    var data = graphql_query_result.responseJSON.data.site.product.customFields.edges;

    let productids = [], rs_prices = []
    const customSortFunctionForId = (a, b) => {
        const indexOfA = product_variables.indexOf(a.node['name']);
        const indexOfB = product_variables.indexOf(b.node['name']);
      
        return indexOfA - indexOfB;
      };
    const sortedArrayId = data.slice().sort(customSortFunctionForId);

    // console.log("sortedArrayId",sortedArrayId);
    let overThirty = sortedArrayId.filter(item =>{ 
        if(product_variables.includes(item.node.name)) {
            productids.push(parseInt(item.node.value));      
    } });    
    let rs_amt = data.filter(item =>{ 
        if(item.node.name == "₹") {
            rs_prices.push(item.node.name + item.node.value);
    } });

    if (productids.length > 0) {
        document.getElementById("custom-add-to-cart").style.display="block";
        document.getElementById("default-add-to-cart").style.display="none";
        let prod = await getproducts(productids, bearerToken)
        const customSortFunction = (a, b) => {
            const indexOfA = productids.indexOf(a['entityId']);
            const indexOfB = productids.indexOf(b['entityId']);
            return indexOfA - indexOfB;
          };
          
          // Sort the array using the custom comparison function
        const sortedArray = prod.slice().sort(customSortFunction);
        let product_list_view = document.getElementById('prod_list');
        
        document.getElementById('prod_list').classList.remove('pdp-loader');

        let html = '';
        for (let index = 0; index < sortedArray.length; index++) {
            const element = sortedArray[index];//.products.edges[index].node;
            
            if (element.prices == null) {
                html += `
                <div class="redio-select ${index == 0?'active':''}" >
                    <div class="form-label-main">
                        <input type="radio" name="abc" ${index == 0?'checked':''} class="form-radio custom-radio" id="${element.id}_test" sku="${element.sku}" value="${element.entityId}">
                        <label class="form-label form-label-text" for="${element.id}_test">${element.name}</label>
                        <span class="colon">:</span>
                        <div class="price-section-gpQL">
                        <div class="variation-price"><div class="sale-price">${element.availabilityV2.message == null? '' : element.availabilityV2.message}</div></div>
                        </div>
                    </div>
                </div>
                `
                continue;
            }
            let sale_price = element.prices.salePrice == null?element.prices.price.value:element.prices.salePrice.value;
            sale_price = sale_price.toFixed(element.usd_prices.decimalPlaces)
            let usd_sale_price = element.usd_prices.salePrice == null?element.usd_prices.price.value:element.usd_prices.salePrice.value;
            usd_sale_price = usd_sale_price.toFixed(element.usd_prices.decimalPlaces)
            let productName = ""
            let indexOfDash = element.name.indexOf("-");
            if (indexOfDash !== -1) {
                // Agar "-" hai toh uske baad ka hissa nikale
                let substringAfterDash = element.name.substring(indexOfDash + 1).trim();
                productName = substringAfterDash
            } else {
                productName = element.name
            }
            html += `
            <div class="redio-select ${index == 0?'active':''}" >
                <div class="form-label-main">
                    <input type="radio" name="abc" ${index == 0?'checked':''} class="form-radio custom-radio" id="${element.id}_test" sku="${element.sku}" value="${element.entityId}">
                    <label class="form-label form-label-text" for="${element.id}_test">${productName}</label>
                    <span class="colon">:</span>
                    <div class="price-section-gpQL">
                        <div class="variation-price"><div class="sale-price">${element.usd_prices.symbol}${usd_sale_price}</div></div>
                        <div class="variation-price"><div class="sale-price">${element.prices.symbol}${sale_price}</div></div>
                        ${rs_prices[index]!=undefined ? `<div class="variation-price"><div class="sale-price">${rs_prices[index]}</div></div>` : `` }
                    </div>
                </div>
            </div>
            `
        }
        product_list_view.innerHTML = html
        const checkedRadioButton = document.querySelector('input[name="abc"]:checked');
        let select_entityid = 0 , minPurchaseQuantity = 0 , maxPurchaseQuantity = 0;
        let select_sku = '';
        let add_active = document.querySelectorAll('input[name="abc"]');
        
        let add_to_cart_text = 'Add to Cart'
        let pointer_diplay = 'all';
        let preorder_text = '';
        let default_data = prod.filter(item => item.entityId == checkedRadioButton.value)
        
        if (default_data[0].availabilityV2.status == 'Preorder') {
            pointer_diplay = "all";
            add_to_cart_text = 'Pre-Order Now';
            preorder_text =  default_data[0].availabilityV2?.message
            document.getElementById('add-to-cart-custom').classList.remove('not-availavle');
            if (default_data[0].availabilityV2.message == null) {
                document.getElementById('preorder_text').classList.remove('availavle')
            }else {
                document.getElementById('preorder_text').classList.add('availavle')
            }


        }else if(default_data[0].availabilityV2.status == 'Unavailable'){
            pointer_diplay = "none";
            add_to_cart_text = 'not purchase';
            preorder_text = 'This product is not purchasable'
            document.getElementById('preorder_text').classList.add('availavle');
            document.getElementById('add-to-cart-custom').classList.add('not-availavle');
        }else {
            if (default_data[0].inventory.isInStock == true) {
                pointer_diplay = "all";
                add_to_cart_text = ' add to cart'
                preorder_text = ''
                document.getElementById('preorder_text').classList.remove('availavle');
                document.getElementById('add-to-cart-custom').classList.remove('not-availavle');
                
            } else {
                pointer_diplay = "none";
                add_to_cart_text = 'out of stock'
                preorder_text = 'out of stock'
                document.getElementById('preorder_text').classList.add('availavle');
                document.getElementById('add-to-cart-custom').classList.add('not-availavle');
            }
        }
        document.getElementById('form-action-addToCart-custom').style.pointerEvents = pointer_diplay;
        document.getElementById('cart-btn-txt').innerHTML = add_to_cart_text;
        document.getElementById('preorder_text').innerHTML = preorder_text ;


        select_entityid = default_data[0].entityId;
        sku = default_data[0].sku;
        minPurchaseQuantity = default_data[0].minPurchaseQuantity
        maxPurchaseQuantity = default_data[0].maxPurchaseQuantity
        

        etst(minPurchaseQuantity, maxPurchaseQuantity);
        document.getElementById('btn-dec').classList.add('de-active');        
        $('.custom-radio[name="abc"]').change(function(e) {
        
            add_active.forEach(element => {
                if (element.value != e.currentTarget.value) {
                    element.parentElement.parentElement.classList.remove('active');
                }else {
                    element.parentElement.parentElement.classList.add('active');
                }
            });
            let selected_data = prod.filter(item => item.entityId == e.currentTarget.value)
            
            if (selected_data[0].availabilityV2.status == 'Preorder') {
                pointer_diplay = "all";
                add_to_cart_text = 'Pre-Order Now';
                preorder_text =  selected_data[0].availabilityV2?.message
                document.getElementById('add-to-cart-custom').classList.remove('not-availavle');

                if (selected_data[0].availabilityV2.message == null) {
                    document.getElementById('preorder_text').classList.remove('availavle')
                }else {
                    document.getElementById('preorder_text').classList.add('availavle')
                }

            }else if(selected_data[0].availabilityV2.status == 'Unavailable'){
                pointer_diplay = "none";
                add_to_cart_text = 'Not Purchasable'
                preorder_text = 'This product is Not Purchasable';
                document.getElementById('preorder_text').classList.add('availavle');
                document.getElementById('add-to-cart-custom').classList.add('not-availavle');
            }else {
                if (selected_data[0].inventory.isInStock == true) {
                    pointer_diplay = "all";
                    add_to_cart_text = 'Add to Cart';
                    preorder_text = '';
                    document.getElementById('add-to-cart-custom').classList.remove('not-availavle');
                    document.getElementById('preorder_text').classList.remove('availavle');
                } else {
                    pointer_diplay = "none";
                    add_to_cart_text = 'Out of Stock'
                    preorder_text = 'This product is Out of Stock';
                    document.getElementById('preorder_text').classList.add('availavle');
                    document.getElementById('add-to-cart-custom').classList.add('not-availavle');
                }
            }
            document.getElementById('form-action-addToCart-custom').style.pointerEvents = pointer_diplay;
            document.getElementById('cart-btn-txt').innerHTML = add_to_cart_text;
            document.getElementById('preorder_text').innerHTML = preorder_text ;
            select_entityid = selected_data[0].entityId;
            sku = selected_data[0].sku;
            minPurchaseQuantity = selected_data[0].minPurchaseQuantity
            maxPurchaseQuantity = selected_data[0].maxPurchaseQuantity
            // console.log(selected_data[0],"this is select data");
            
            etst(minPurchaseQuantity, maxPurchaseQuantity);
            document.getElementById('btn-dec').classList.add('de-active');
        })
        $("#form-action-addToCart-custom").click(async function() {
            let qty_btn = document.getElementById('qty-custom');
            

            const getCountry = await onGeoLoaded();

            if(getCountry == "India" && rs_prices.length > 0){
               window.open(
                 'https://orbookscom.mybigcommerce.com/cart.php?action=add&product_id=' +
                   select_entityid +
                   '&sku=' +
                   sku +
                   '&qty=' +
                   qty_btn.value,
                 '_blank'
               );

            }else{
                window.location.href = '/cart.php?action=add&product_id='+select_entityid+'&qty='+qty_btn.value
            }


            
            
            // return $.get('/cart.php?action=add&product_id='+select_entityid)
            // .done(function(data, status, xhr) {
            //     window.location.href = '/cart.php'
            // })
        })

        document.querySelector('#btn-inc').addEventListener('click', function(e){
            if (minPurchaseQuantity == null) {
                minPurchaseQuantity = 1;
            }
            document.getElementById('btn-dec').classList.remove('de-active');
            const inc =  document.getElementById('qty-custom');


            if (maxPurchaseQuantity <= parseInt(inc.value) && maxPurchaseQuantity != null) {
                document.getElementById('form-action-addToCart-custom').style.pointerEvents = "none";
                document.getElementById('cart-btn-txt').innerHTML = 'Out of max'


            }else {
                e.currentTarget.classList.remove('de-active')
                inc.value =  parseInt(inc.value) + 1;

                if (maxPurchaseQuantity == parseInt(inc.value) && maxPurchaseQuantity != null) {
                    e.currentTarget.classList.add('de-active')
                }else {
                    e.currentTarget.classList.remove('de-active')
                }

                // e.currentTarget.value = inc.value;
                document.getElementById('form-action-addToCart-custom').style.pointerEvents = pointer_diplay;
                document.getElementById('cart-btn-txt').innerHTML = add_to_cart_text;
            }
        })
        $("#btn-dec").click(function(){
            if (minPurchaseQuantity == null) {
                minPurchaseQuantity = 1;
            }
            
            document.getElementById('btn-inc').classList.remove('de-active');
            let dec =  document.getElementById('qty-custom');

            if (minPurchaseQuantity >= parseInt(dec.value)) {

                document.getElementById('form-action-addToCart-custom').style.pointerEvents = "none";
                document.getElementById('cart-btn-txt').innerHTML = 'Out of min';

            }else {
                if (parseInt(dec.value) > 1) {
                    dec.value = parseInt(dec.value) - 1;

                    if (minPurchaseQuantity == parseInt(dec.value)) {
                        document.getElementById('btn-dec').classList.add('de-active');
                    }
                    document.getElementById('form-action-addToCart-custom').style.pointerEvents = pointer_diplay;
                    document.getElementById('cart-btn-txt').innerHTML = add_to_cart_text;
                }
            }  

        })
        $('#qty-custom').on('change',function(e){
            if (minPurchaseQuantity == null) {
                minPurchaseQuantity = 1;
            }
            
            let val_print = e.currentTarget.value
            if (val_print == '') {
                return true;
            }else if (maxPurchaseQuantity < parseInt(val_print) && maxPurchaseQuantity != null){
                document.getElementById('form-action-addToCart-custom').style.pointerEvents = "none";
                document.getElementById('cart-btn-txt').innerHTML = 'Out of max'
                document.getElementById('btn-inc').classList.add('de-active');
            }else if (minPurchaseQuantity > parseInt(val_print)) {
                document.getElementById('form-action-addToCart-custom').style.pointerEvents = "none";
                document.getElementById('cart-btn-txt').innerHTML = 'Out of min'
                document.getElementById('btn-dec').classList.add('de-active');
            }else {
                document.getElementById('form-action-addToCart-custom').style.pointerEvents = pointer_diplay;
                document.getElementById('cart-btn-txt').innerHTML = add_to_cart_text;
                document.getElementById('btn-dec').classList.remove('de-active');
                document.getElementById('btn-inc').classList.remove('de-active');
            }

        })

        function etst(minPurchaseQuantity, maxPurchaseQuantity) {

            if (minPurchaseQuantity == null) {
                minPurchaseQuantity = 1;
            }
            
            document.getElementById('qty-custom').value = minPurchaseQuantity
            let val_print_input = document.getElementById('qty-custom').value;
            if (val_print_input == '') {
                return true;
            }else if (maxPurchaseQuantity < parseInt(val_print_input) && maxPurchaseQuantity != null){
                document.getElementById('form-action-addToCart-custom').style.pointerEvents = "none";
                document.getElementById('cart-btn-txt').innerHTML = 'Out of max'
                document.getElementById('btn-inc').classList.add('de-active');
            }else if (minPurchaseQuantity > parseInt(val_print_input)) {
                document.getElementById('form-action-addToCart-custom').style.pointerEvents = "none";
                document.getElementById('cart-btn-txt').innerHTML = 'Out of min'
                document.getElementById('btn-dec').classList.add('de-active');
            }else {
                document.getElementById('form-action-addToCart-custom').style.pointerEvents = pointer_diplay;
                document.getElementById('cart-btn-txt').innerHTML = add_to_cart_text;
                document.getElementById('btn-dec').classList.remove('de-active');
                document.getElementById('btn-inc').classList.remove('de-active');
            }
        }
    }else{
        document.getElementById("custom-add-to-cart").style.display="none";
        document.getElementById("default-add-to-cart").style.display="block";
        document.getElementById('prod_list').classList.remove('pdp-loader');
    }
}

async function getproducts(ids, bearerToken) {

    try {
        var query = `query {
            site {
                products(entityIds:[${ids}]) {
                  edges {
                    node {
                      id
                      sku
                      entityId
                      name
                      addToCartUrl
                      availabilityV2 {
                        ... on ProductAvailable {
                          __typename
                          status
                        }
                        ... on ProductUnavailable {
                          status
                          message
                        }
                        ... on ProductPreOrder {
                          status
                          message
                        }
                      }
                      inventory {
                        aggregated {
                          availableToSell
                          warningLevel
                        }
                        isInStock
                      }
                      minPurchaseQuantity
                      maxPurchaseQuantity
                      prices (currencyCode: GBP){
                        basePrice {
                          value
                        }
                        price {
                          value
                        }
                        salePrice {
                          value
                        }
                      }
                      defaultImage {
                        urlOriginal
                      }
                    }
                  }
                }
                currency(currencyCode: GBP) {
                    code
                    isActive
                    display {
                        symbol
                        decimalToken
                        decimalPlaces
                        thousandsToken
                    }
                }
              }
          }`
        var query_2 = `query {
            site {
                products(entityIds:[${ids}]) {
                  edges {
                    node {
                      id
                      name
                      addToCartUrl
                      prices (currencyCode: USD){
                        basePrice {
                          value
                        }
                        price {
                          value
                        }
                        salePrice {
                          value
                        }
                      }
                      defaultImage {
                        urlOriginal
                      }
                    }
                  }
                }
                currency(currencyCode: USD) {
                    code
                    isActive
                    display {
                        symbol
                        decimalToken
                        decimalPlaces
                        thousandsToken
                    }
                }
              }
          }`
        let graphql_query = await $.ajax({
            url: "/graphql",
            contentType: "application/json",
            type: 'POST',
            async: false,
            headers: {
                'Authorization': 'Bearer ' + bearerToken
            },
            data: JSON.stringify({ query: query }),
            success: function (productvariationdata) {
                
            }
        });
        let graphql_query_usd = await $.ajax({
            url: "/graphql",
            contentType: "application/json",
            type: 'POST',
            async: false,
            headers: {
                'Authorization': 'Bearer ' + bearerToken
            },
            data: JSON.stringify({ query: query_2 }),
            success: function (productvariationdata2) {
            }
        });

        let usd_data = graphql_query_usd.data.site.products.edges;
        let new_obj = [];
        for (let index = 0; index < graphql_query.data.site.products.edges.length; index++) {
            const element_2 = graphql_query.data.site.products.edges[index].node;
            
            // if (element_2.availabilityV2.status == 'Unavailable') {
            //     continue;
            // }
            let usd_price= usd_data.filter(item =>{ if(item.node.id == element_2.id){
                if (item.node.prices == null) {
                    return null;
                }
                item.node.prices.symbol = graphql_query_usd.data.site.currency.display.symbol
                item.node.prices.decimalToken = graphql_query_usd.data.site.currency.display.decimalToken
                item.node.prices.decimalPlaces = graphql_query_usd.data.site.currency.display.decimalPlaces
                return item.node.prices;
            } })

            element_2.usd_prices = usd_price.length > 0? usd_price[0].node.prices : null
            if (element_2.prices != null) {
                element_2.prices.symbol = graphql_query.data.site.currency.display.symbol
            }
            new_obj.push(
                element_2
            )
        }

        return new_obj;
    } catch (error) {
    }
}

export function pricecat(context) {
    var currencyCode = context.currency_code;
    var bearerToken = context.bearerToken;
    const product_price_id = context.productId;
  
    var gbp_price_query = `
    query {
        site {
            product(entityId:${product_price_id}) {
                prices (includeTax:true , currencyCode:GBP) {
                    price {
                        value
                        currencyCode
                    }
                    salePrice {
                        value
                        currencyCode
                    }
                    retailPrice {
                        value
                        currencyCode
                    }
                    basePrice {
                        value
                        currencyCode
                    }
                }
            }
            currency(currencyCode: GBP) {
                code
                isActive
                display {
                    symbol
                    decimalToken
                    decimalPlaces
                    thousandsToken
                }
            }
        }
    }`
    var gbp_price_query_results = $.ajax({
        url: "/graphql",
        contentType: "application/json",
        type: 'POST',
        async: false,
        headers: {
            'Authorization': 'Bearer ' + bearerToken
        },
        data: JSON.stringify({ query: gbp_price_query }),
        success: function ( ) {
        }
    });
    var gbp_price =  gbp_price_query_results.responseJSON.data.site.product.prices;
    var gbp_symbole = gbp_price_query_results.responseJSON.data.site.currency.display;
  
    // sale_price = sale_price.toFixed(element.usd_prices.decimalPlaces)
    // usd_sale_price = usd_sale_price.toFixed(element.usd_prices.decimalPlaces)
    console.log("gbp" , gbp_price_query_results.responseJSON.data.site);
    if (gbp_price != null) {
        console.log("gbp" , gbp_price_query_results.responseJSON.data.site);
        var  price_html = ``
        price_html += '<div class="price-by-country-code gbp">'
        if (gbp_price.salePrice != null) {
            price_html += '<div class="sale-price">'+ gbp_symbole.symbol + gbp_price.salePrice.value + gbp_symbole.decimalToken + gbp_symbole.decimalPlaces + gbp_symbole.decimalPlaces  +'</div>'
        } else if (gbp_price.retailPrice != null){
            price_html += '<div class="sale-price">'+ gbp_symbole.symbol + gbp_price.retailPrice.value + gbp_symbole.decimalToken + gbp_symbole.decimalPlaces + gbp_symbole.decimalPlaces  +'</div>'
        } else {
            price_html += '<div class="sale-price">'+ gbp_symbole.symbol + gbp_price.basePrice.value + gbp_symbole.decimalToken + gbp_symbole.decimalPlaces + gbp_symbole.decimalPlaces  +'</div>'
        }
        price_html += '</div>'
  
        // var test = $('.price_by_country').innerHTML = price_html;
        var test = $(".price_by_country").append(price_html);
    }
  
    var usd_price_query = `
    query {
        site {
            product(entityId:${product_price_id}) {
                prices (includeTax:true , currencyCode:USD) {
                    price {
                        value
                        currencyCode
                    }
                    salePrice {
                        value
                        currencyCode
                    }
                    retailPrice {
                        value
                        currencyCode
                    }
                    basePrice {
                        value
                        currencyCode
                    }
                }
            }
            currency(currencyCode: USD) {
                code
                isActive
                display {
                    symbol
                    decimalToken
                    decimalPlaces
                    thousandsToken
                }
            }
        }
    }`
    var usd_price_query_results = $.ajax({
        url: "/graphql",
        contentType: "application/json",
        type: 'POST',
        async: false,
        headers: {
            'Authorization': 'Bearer ' + bearerToken
        },
        data: JSON.stringify({ query: usd_price_query }),
        success: function ( ) {
        }
    });
  
    var usd_price =  usd_price_query_results.responseJSON.data.site.product.prices;
    var usd_symbole = usd_price_query_results.responseJSON.data.site.currency.display;
    if (usd_price != null) {
        var  usd_price_html = ``
        usd_price_html += '<div class="price-by-country-code usd">'
        if (usd_price.salePrice != null) {
            usd_price_html += '<div class="sale-price">'+ usd_symbole.symbol + usd_price.salePrice.value + usd_symbole.decimalToken + usd_symbole.decimalPlaces + usd_symbole.decimalPlaces +'</div>'
        } else if (usd_price.retailPrice != null){
            usd_price_html += '<div class="sale-price">'+ usd_symbole.symbol + usd_price.retailPrice.value + usd_symbole.decimalToken + usd_symbole.decimalPlaces + usd_symbole.decimalPlaces +'</div>'
        } else {
            usd_price_html += '<div class="sale-price">'+ usd_symbole.symbol + usd_price.basePrice.value + usd_symbole.decimalToken + usd_symbole.decimalPlaces + usd_symbole.decimalPlaces +'</div>'
        }
        usd_price_html += '</div>'
        var test = $(".price_by_country").append(usd_price_html);
    }
  }

export async function graphcatquick(context, product_id = 0) {
    var currencyCode = context.currency_code;
    var bearerToken = context.bearerToken;
    var productid = product_id == 0? context.productId : product_id ;
    var sku = context.sku;

    let product_variables = ['Paperback Product ID','Hardback Product ID', 'Ebooks Product ID', 'Ebooks+paperback Product ID',  'Audiobook Product ID'];
    var query = `query {
        site {
          product (entityId:${productid}){
          sku
            customFields {
              edges {
                node {
                  name
                  value
                  entityId
                }
              }
            }
          }
        }
      }`
    var graphql_query_result = $.ajax({
        url: "/graphql",
        contentType: "application/json",
        type: 'POST',
        async: false,
        headers: {
            'Authorization': 'Bearer ' + bearerToken
        },
        data: JSON.stringify({ query: query }),
        success: function (productvariationdata) {
        }
    });
    var data = graphql_query_result.responseJSON.data.site.product.customFields.edges;

    let productids = [], rs_prices = []
    const customSortFunctionForId = (a, b) => {
        const indexOfA = product_variables.indexOf(a.node['name']);
        const indexOfB = product_variables.indexOf(b.node['name']);
      
        return indexOfA - indexOfB;
      };
    const sortedArrayId = data.slice().sort(customSortFunctionForId);

   
    let overThirty = sortedArrayId.filter(item =>{ 
        if(product_variables.includes(item.node.name)) {
            productids.push(parseInt(item.node.value));      
    } });    
    let rs_amt = data.filter(item =>{ 
        if(item.node.name == "₹") {
            rs_prices.push(item.node.name + item.node.value);
    } });

    if (productids.length > 0) {
       
        document.getElementById("custom-quickview").style.display="block";
        document.getElementById("default-quickview").style.display="none";
        let prod = await getproducts(productids, bearerToken)
        const customSortFunction = (a, b) => {
            const indexOfA = productids.indexOf(a['entityId']);
            const indexOfB = productids.indexOf(b['entityId']);
            return indexOfA - indexOfB;
          };
          
          console.log("prod===",prod);
          // Sort the array using the custom comparison function
        const sortedArray = prod.slice().sort(customSortFunction);

        let product_list_view = document.getElementById('prod_list_quickview');

        let html = '';
        for (let index = 0; index < sortedArray.length; index++) {
            let element = sortedArray[index];//.products.edges[index].node;
           
            if (element.prices == null) {
                html += `
                <div class="redio-select ${index == 0?'active':''}" >
                    <div class="form-label-main">
                        <input type="radio" name="xyzquick" ${index == 0?'checked':''} class="form-radio custom-radio-quick" id="${element.id}_testquick" sku="${element.sku}" value="${element.entityId}">
                        <label class="form-label form-label-text" for="${element.id}_testquick">${element.name}</label>
                        <span class="colon">:</span>
                        <div class="price-section-gpQL">
                        <div class="variation-price"><div class="sale-price">${element.availabilityV2.message == null? '' : element.availabilityV2.message}</div></div>
                        </div>
                    </div>
                </div>
                `
                continue;
            }
            let sale_price = element.prices.salePrice == null?element.prices.price.value:element.prices.salePrice.value;
            sale_price = sale_price.toFixed(element.usd_prices.decimalPlaces)    
            let usd_sale_price = element.usd_prices.salePrice == null?element.usd_prices.price.value:element.usd_prices.salePrice.value;
            usd_sale_price = usd_sale_price.toFixed(element.usd_prices.decimalPlaces)
            let productName = ""
            let indexOfDash = element.name.indexOf("-");
            if (indexOfDash !== -1) {
                // Agar "-" hai toh uske baad ka hissa nikale
                let substringAfterDash = element.name.substring(indexOfDash + 1).trim();
                productName = substringAfterDash
            } else {
                productName = element.name
            }
            html += `
            <div class="redio-select ${index == 0?'active':''}" >
                <div class="form-label-main">
                    <input type="radio" name="xyzquick" ${index == 0?'checked':''} class="form-radio custom-radio-quick" id="${element.id}_testquick" sku="${element.sku}" value="${element.entityId}">
                    <label class="form-label form-label-text" for="${element.id}_testquick">${productName}</label>
                    <span class="colon">:</span>
                    <div class="price-section-gpQL">
                        <div class="variation-price"><div class="sale-price">${element.usd_prices.symbol}${usd_sale_price}</div></div>
                        <div class="variation-price"><div class="sale-price">${element.prices.symbol}${sale_price}</div></div>
                        ${rs_prices[index]!=undefined?`<div class="variation-price"><div class="sale-price">${rs_prices[index]}}</div></div>`:""}
                    </div>
                </div>
            </div>
            `
        }
        product_list_view.innerHTML = html

        let checkedRadioButton = document.querySelector('input[name="xyzquick"]:checked');
        let select_entityid = 0 , minPurchaseQuantity = 0 , maxPurchaseQuantity = 0;
        let add_active = document.querySelectorAll('input[name="xyzquick"]');
        
        let add_to_cart_text = 'Add to Cart'
        let pointer_diplay = 'all';
        let preorder_text = '';
        let default_data = prod.filter(item => item.entityId == checkedRadioButton.value)
        
        if (default_data[0].availabilityV2.status == 'Preorder') {
            pointer_diplay = "all";
            add_to_cart_text = 'Pre-Order Now';
            preorder_text =  default_data[0].availabilityV2?.message
            document.getElementById('add-to-cart-custom-quickview').classList.remove('not-availavle');

            if (default_data[0].availabilityV2.message == null) {
                document.getElementById('preorder_text_quickview').classList.remove('availavle')
            }else {
                document.getElementById('preorder_text_quickview').classList.add('availavle')
            }
        }else if(default_data[0].availabilityV2.status == 'Unavailable'){
            pointer_diplay = "none";
            add_to_cart_text = 'not purchase';
            preorder_text = 'This product is not purchasable'
            document.getElementById('add-to-cart-custom-quickview').classList.add('not-availavle');
            document.getElementById('preorder_text_quickview').classList.add('availavle')
        }else {
            if (default_data[0].inventory.isInStock == true) {
                pointer_diplay = "all";
                add_to_cart_text = ' add to cart'
                preorder_text = ''
                document.getElementById('add-to-cart-custom-quickview').classList.remove('not-availavle');
                document.getElementById('preorder_text_quickview').classList.remove('availavle')
            } else {
                pointer_diplay = "none";
                add_to_cart_text = 'out of stock'
                preorder_text = 'This product is out of stock'
                document.getElementById('add-to-cart-custom-quickview').classList.add('not-availavle');
                document.getElementById('preorder_text_quickview').classList.add('availavle')
            }
        }

        document.getElementById('form-action-addToCart-custom-quickview').style.pointerEvents = pointer_diplay;
        document.getElementById('cart-btn-txt-quickview').innerHTML = add_to_cart_text;
        document.getElementById('preorder_text_quickview').innerHTML = preorder_text ;


        select_entityid = default_data[0].entityId;
        sku = default_data[0].sku;
        minPurchaseQuantity = default_data[0].minPurchaseQuantity
        maxPurchaseQuantity = default_data[0].maxPurchaseQuantity
        

        etst(minPurchaseQuantity, maxPurchaseQuantity);
        document.getElementById('btn-dec-quickview').classList.add('de-active');

        const radioButtons = document.querySelectorAll('input[name="xyzquick"]');

        radioButtons.forEach((radioButton) => {
            radioButton.addEventListener('change', async function(e) {
                add_active.forEach(element => {
                    if (element.value != e.currentTarget.value) {
                        element.parentElement.parentElement.classList.remove('active');
                    }else {
                        element.parentElement.parentElement.classList.add('active');
                    }
                });
                let selected_data = prod.filter(item => item.entityId == e.currentTarget.value)
                
                if (selected_data[0].availabilityV2.status == 'Preorder') {
                    pointer_diplay = "all";
                    add_to_cart_text = 'Pre-Order Now';
                    preorder_text =  selected_data[0].availabilityV2?.message

                    document.getElementById('add-to-cart-custom-quickview').classList.remove('not-availavle');
                    if (selected_data[0].availabilityV2.message == null) {
                        document.getElementById('preorder_text_quickview').classList.remove('availavle')
                    }else {
                        document.getElementById('preorder_text_quickview').classList.add('availavle')
                    }
                    
                }else if(selected_data[0].availabilityV2.status == 'Unavailable'){
                    pointer_diplay = "none";
                    add_to_cart_text = 'Not Purchasable'
                    preorder_text = 'This product is Not Purchasable';
                    document.getElementById('add-to-cart-custom-quickview').classList.add('not-availavle');
                    document.getElementById('preorder_text_quickview').classList.add('availavle')
                }else {
                    if (selected_data[0].inventory.isInStock == true) {
                        pointer_diplay = "all";
                        add_to_cart_text = 'Add to Cart';
                        preorder_text = '';
                        document.getElementById('add-to-cart-custom-quickview').classList.remove('not-availavle');
                        document.getElementById('preorder_text_quickview').classList.remove('availavle')
                    } else {
                        pointer_diplay = "none";
                        add_to_cart_text = 'Out of Stock'
                        preorder_text = 'This product is Out of Stock';
                        document.getElementById('add-to-cart-custom-quickview').classList.add('not-availavle');
                        document.getElementById('preorder_text_quickview').classList.add('availavle')
                    }
                }
                document.getElementById('form-action-addToCart-custom-quickview').style.pointerEvents = pointer_diplay;
                document.getElementById('cart-btn-txt-quickview').innerHTML = add_to_cart_text;
                document.getElementById('preorder_text_quickview').innerHTML = preorder_text ;

                select_entityid = selected_data[0].entityId;
                sku = selected_data[0].sku;
                minPurchaseQuantity = selected_data[0].minPurchaseQuantity
                maxPurchaseQuantity = selected_data[0].maxPurchaseQuantity


                etst(minPurchaseQuantity, maxPurchaseQuantity);
                document.getElementById('btn-dec-quickview').classList.add('de-active');
            })
        })

        $("#form-action-addToCart-custom-quickview").click(async function() {
            let qty_btn = document.getElementById('qty-custom-quickview');

            const country = await onGeoLoaded();

            if(country == "India" && rs_prices.length > 0){
               window.open(
  'https://orbookscom.mybigcommerce.com/cart.php?action=add&product_id=' +
    select_entityid +
    '&sku=' +
    sku +
    '&qty=' +
    qty_btn.value,
  '_blank'
);

            }else{
                window.location.href = '/cart.php?action=add&product_id=' + select_entityid + '&sku=' + sku + '&qty=' + qty_btn.value;
            }

            // return $.get('/cart.php?action=add&product_id='+select_entityid)
            // .done(function(data, status, xhr) {
            //     window.location.href = '/cart.php'
            // })
        })

        document.querySelector('#btn-inc-quickview').addEventListener('click', function(e){
            if (minPurchaseQuantity == null) {
                minPurchaseQuantity = 1;
            }
            document.getElementById('btn-dec-quickview').classList.remove('de-active');
            const inc =  document.getElementById('qty-custom-quickview');

            if (maxPurchaseQuantity <= parseInt(inc.value) && maxPurchaseQuantity != null) {
                document.getElementById('form-action-addToCart-custom-quickview').style.pointerEvents = "none";
                document.getElementById('cart-btn-txt-quickview').innerHTML = 'Out of max'

            }else {
                e.currentTarget.classList.remove('de-active')
                inc.value =  parseInt(inc.value) + 1;

                if (maxPurchaseQuantity == parseInt(inc.value) && maxPurchaseQuantity != null) {
                    e.currentTarget.classList.add('de-active')
                }else {
                    e.currentTarget.classList.remove('de-active')
                }

                // e.currentTarget.value = inc.value;
                document.getElementById('form-action-addToCart-custom-quickview').style.pointerEvents = pointer_diplay;
                document.getElementById('cart-btn-txt-quickview').innerHTML = add_to_cart_text;
            }
        })
        $("#btn-dec-quickview").click(function(){
            if (minPurchaseQuantity == null) {
                minPurchaseQuantity = 1;
            }
            
            document.getElementById('btn-inc-quickview').classList.remove('de-active');

            let dec =  document.getElementById('qty-custom-quickview');

            if (minPurchaseQuantity >= parseInt(dec.value)) {

                document.getElementById('form-action-addToCart-custom-quickview').style.pointerEvents = "none";
                document.getElementById('cart-btn-txt-quickview').innerHTML = 'Out of min';

            }else {
                if (parseInt(dec.value) > 1) {
                    dec.value = parseInt(dec.value) - 1;

                    if (minPurchaseQuantity == parseInt(dec.value)) {
                        document.getElementById('btn-dec-quickview').classList.add('de-active');
                    }
                    document.getElementById('form-action-addToCart-custom-quickview').style.pointerEvents = pointer_diplay;
                    document.getElementById('cart-btn-txt-quickview').innerHTML = add_to_cart_text;
                }
            }  
        })
        $('#qty-custom-quickview').on('change',function(e){
            if (minPurchaseQuantity == null) {
                minPurchaseQuantity = 1;
            }        
            let val_print = e.currentTarget.value
            if (val_print == '') {
                return true;
            }else if (maxPurchaseQuantity < parseInt(val_print) && maxPurchaseQuantity != null){
                document.getElementById('form-action-addToCart-custom-quickview').style.pointerEvents = "none";
                document.getElementById('cart-btn-txt-quickview').innerHTML = 'Out of max'
                document.getElementById('btn-inc-quickview').classList.add('de-active');
            }else if (minPurchaseQuantity > parseInt(val_print)) {
                document.getElementById('form-action-addToCart-custom-quickview').style.pointerEvents = "none";
                document.getElementById('cart-btn-txt-quickview').innerHTML = 'Out of min'
                document.getElementById('btn-dec-quickview').classList.add('de-active');
            }else {
                document.getElementById('form-action-addToCart-custom-quickview').style.pointerEvents = pointer_diplay;
                document.getElementById('cart-btn-txt-quickview').innerHTML = add_to_cart_text;
                document.getElementById('btn-dec-quickview').classList.remove('de-active');
                document.getElementById('btn-inc-quickview').classList.remove('de-active');
            }
        })

        function etst(minPurchaseQuantity, maxPurchaseQuantity) {

            if (minPurchaseQuantity == null) {
                minPurchaseQuantity = 1;
            }
            
            document.getElementById('qty-custom-quickview').value = minPurchaseQuantity
            let val_print_input = document.getElementById('qty-custom-quickview').value;

            if (val_print_input == '') {
                return true;
            }else if (maxPurchaseQuantity < parseInt(val_print_input) && maxPurchaseQuantity != null){
                document.getElementById('form-action-addToCart-custom-quickview').style.pointerEvents = "none";
                document.getElementById('cart-btn-txt-quickview').innerHTML = 'Out of max'
                document.getElementById('btn-inc-quickview').classList.add('de-active');
            }else if (minPurchaseQuantity > parseInt(val_print_input)) {
                document.getElementById('form-action-addToCart-custom-quickview').style.pointerEvents = "none";
                document.getElementById('cart-btn-txt-quickview').innerHTML = 'Out of min'
                document.getElementById('btn-dec-quickview').classList.add('de-active');
            }else {
                document.getElementById('form-action-addToCart-custom-quickview').style.pointerEvents = pointer_diplay;
                document.getElementById('cart-btn-txt-quickview').innerHTML = add_to_cart_text;
                document.getElementById('btn-dec-quickview').classList.remove('de-active');
                document.getElementById('btn-inc-quickview').classList.remove('de-active');
            }
        }
    }else{
        document.getElementById("custom-quickview").style.display="none";
        document.getElementById("default-quickview").style.display="block";
        document.getElementById('prod_list').classList.remove('pdp-loader');
    }
}
// Select the blog title element
const blogTitle = document.querySelector('.blog-title a');

// Check if the element exists
if (blogTitle) {
  // Remove all HTML tags while preserving the text
  blogTitle.innerHTML = blogTitle.textContent;
}
// Select all <li> elements inside the <ul>
const listItems = document.querySelectorAll('.blog-list .blog');

// Loop through each <li>
listItems.forEach((li) => {
  // Find the .blog-title element inside the current <li>
  const blogTitle = li.querySelector('.blog-title a');

  // Check if the blog-title exists inside this <li>
  if (blogTitle) {
    // Remove all HTML tags while preserving the text
    blogTitle.innerHTML = blogTitle.textContent;
  }
});

