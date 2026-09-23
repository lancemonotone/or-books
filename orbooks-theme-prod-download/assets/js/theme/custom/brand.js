
export default (function (context, searchTerm, limit, page) {
  let brandsData = ""
  const graphql = (endcursor) => {
    var bearerToken = context.bearerToken;
    var query =
      `query {
                site {
                  brands(first: 50, after: "`+ endcursor + `") {
                    pageInfo {
                      hasNextPage 
                      endCursor
                    }
                    edges {
                      node {
                        id 
                        name
                        path
                        defaultImage {
                          urlOriginal
                        }
                      }
                    }
                  }
                }
              }
        `
    var graphql_query_result = $.ajax({
      url: "/graphql",
      contentType: "application/json",
      type: 'POST',
      async: false,
      headers: {
        'Authorization': 'Bearer ' + bearerToken
      },
      data: JSON.stringify({ query: query }),
      success: function (productSlickData) {
        brandsData = productSlickData.data.site.brands.edges
        if (productSlickData.data.site.brands.pageInfo.hasNextPage) {
          var endcursor = productSlickData.data.site.brands.pageInfo.endCursor;
          console.log('endcursor',endcursor);
          graphql(endcursor);
        }
      }
    })
  }

  graphql(null)
  const absArry = ['all', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z']
  let notAvl = []
  absArry.map((txt) => {
    if (txt !== 'all') {
      const avl = brandsData.filter(str => str?.node.name.charAt(0).toLowerCase() === txt.toLowerCase())
      if (avl.length == 0) {
        notAvl.push(txt)
      }
    }
  })
  document.querySelectorAll('.authorbuttons button').forEach((itm) => {
    var test = $(itm).attr('id');
    const avl = notAvl.filter(str => str.charAt(0).toLowerCase() === test.toLowerCase())
    if (avl.length > 0) {
      $(itm).addClass("in-active")
    }
  })
  const brand_paginator = () => {
    $(document).ready(function () {
      var Author_Per_Page = context.AuthorPerPage
      var show_per_page = Author_Per_Page;
      var number_of_items = $('.custom-brand-data').children().length;
      var number_of_pages = Math.ceil(number_of_items / show_per_page);
      $('.current_brand_page').val(0);
      $('.show_brand_per_page').val(show_per_page);

      var navigation_html = '<li class="deactive-arrow pagination-item pagination-item--previous"><a class="pagination-link previous_link arrow" ><i class="icon"><svg><use href="#icon-arrow-left"></use></svg></i> Prev</a></li>';
      var current_link = 0;

      while (number_of_pages > current_link) {
        navigation_html += '<li class="pagination-number-item pagination-item page_link" longdesc="' + current_link + '"><a class="pagination-link pagination-number-link"  >' + (current_link + 1) + '</a></li>';
        current_link++;
      }

      navigation_html += '<li class="pagination-item pagination-item--next"><a class="pagination-link next_link arrow" ">Next <i class="icon"><svg><use href="#icon-arrow-right"></use></use></svg></i></a></li>';

      var yest = $('.pagination-brand-custom .page_navigation').html(navigation_html);

      $('.page_navigation .page_link:first').addClass('active_page');
      $('.page_navigation .page_link:first').addClass('pagination-item--current');
      $('.custom-brand-data').children().css('display', 'none');
      $('.custom-brand-data').children().slice(0, show_per_page).css('display', 'block');

      var total_page = $('.pagination-number-item').length - 1;

      if (total_page < 1) {
        $('.pagination-brand-custom').css('display', 'none')
      } else {
        $('.pagination-brand-custom').css('display', 'block')
      }
    })
    $(document).on('click', '.previous_link', function () {
      var new_page = parseInt($('.current_brand_page').val()) - 1;
      if ($('.pagination-item--current').prev('.page_link').length == true) {
        go_to_page(new_page);
        $('.pagination-item--next').removeClass('deactive-arrow');
      }
      if (new_page < 1) {
        $('.pagination-item--previous').addClass('deactive-arrow');
      }
    })

    $(document).on('click', '.next_link', function () {
      var new_page = parseInt($('.current_brand_page').val()) + 1;
      if ($('.pagination-item--current').next('.page_link').length == true) {
        go_to_page(new_page);
        $('.pagination-item--previous').removeClass('deactive-arrow');
      }
      var abc = $('.pagination-number-item').length - 1;
      if (abc == new_page) {
        $('.pagination-item--next').addClass('deactive-arrow');
      }
    })

    $(document).on('click', '.pagination-number-link', function () {
      var page_num = $(this).parent(".page_link").attr('longdesc');
      var show_per_page = parseInt($('.show_brand_per_page').val());
      var start_from = page_num * show_per_page;
      var end_on = start_from + show_per_page;
      $('.custom-brand-data').children().css('display', 'none').slice(start_from, end_on).css('display', 'block');
      $('.pagination-number-item[longdesc=' + page_num + ']').addClass('pagination-item--current').siblings('.pagination-item--current').removeClass('pagination-item--current');
      $('.current_brand_page').val(page_num);

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
    })

    function go_to_page(page_num) {
      var show_per_page = parseInt($('.show_brand_per_page').val());
      var start_from = page_num * show_per_page;
      var end_on = start_from + show_per_page;
      $('.custom-brand-data').children().css('display', 'none').slice(start_from, end_on).css('display', 'block');
      $('.pagination-number-item[longdesc=' + page_num + ']').addClass('pagination-item--current').siblings('.pagination-item--current').removeClass('pagination-item--current');
      $('.current_brand_page').val(page_num);
    }
  }

  let filteredStrings = brandsData

  if (searchTerm != "All") {
    filteredStrings = brandsData.filter(str => str?.node.name.charAt(0).toLowerCase() === searchTerm.toLowerCase());
  }
  let author_data = ''
  filteredStrings.forEach((value, index) => {
    author_data += '<li class="brand">'
    author_data += '<article class="card ">'
    author_data += '<figure class="card-figure">'
    author_data += '<a class="card-figure__link" aria-label="' + value.node.name + '" href="' + value.node.path + '">'
    author_data += '<div class="card-img-container">'
    if (value.node.defaultImage != null) {
      author_data += '<img class="card-image lazyautosizes lazyloaded" src=' + value.node.defaultImage.urlOriginal + '>'
    }else {
      author_data += '<img class="card-image lazyautosizes lazyloaded" src="../img/ProductDefault.gif">'
    }
    author_data += '</div>'
    author_data += '</a>'
    author_data += '</figure>'
    author_data += '<div class="card-body">'
    author_data += '<h3 class="card-title">'
    author_data += '<a href="' + value.node.path + '">'
    author_data += '' + value.node.name + ''
    author_data += '</a>'
    author_data += '</h3>'
    author_data += '</div>'
    author_data += '</article>'
    author_data += '</li>'
  });
  var abc = $('.brandGrid-ql')[0].innerHTML = author_data;
  brand_paginator()

  $('.authorbuttons .btn').click(function () {
    var test = $(this).attr('id');
    if (test) {

      let filteredStrings = brandsData

      if (test != "all") {
        filteredStrings = brandsData.filter(str => str?.node.name.charAt(0).toLowerCase() === test.toLowerCase());
      }
      let author_data = ''
      filteredStrings.forEach((value, index) => {
        author_data += '<li class="brand">'
        author_data += '<article class="card ">'
        author_data += '<figure class="card-figure">'
        author_data += '<a class="card-figure__link" aria-label="' + value.node.name + '" href="' + value.node.path + '">'
        author_data += '<div class="card-img-container">'
        if (value.node.defaultImage != null) {
          author_data += '<img class="card-image lazyautosizes lazyloaded" src=' + value.node.defaultImage.urlOriginal + '>'
        }else {
          author_data += '<img class="card-image lazyautosizes lazyloaded" src="../img/ProductDefault.gif">'
        }
        author_data += '</div>'
        author_data += '</a>'
        author_data += '</figure>'
        author_data += '<div class="card-body">'
        author_data += '<h3 class="card-title">'
        author_data += '<a href="' + value.node.path + '">'
        author_data += '' + value.node.name + ''
        author_data += '</a>'
        author_data += '</h3>'
        author_data += '</div>'
        author_data += '</article>'
        author_data += '</li>'
      });
      var abc = $('.brandGrid-ql')[0].innerHTML = author_data;

      var Author_Per_Page = context.AuthorPerPage
      var show_per_page = Author_Per_Page;
      var number_of_items = $('.custom-brand-data').children().length;
      var number_of_pages = Math.ceil(number_of_items / show_per_page);
      $('.current_brand_page').val(0);
      $('.show_brand_per_page').val(show_per_page);

      var navigation_html = '<li class="deactive-arrow pagination-item pagination-item--previous"><a class="pagination-link previous_link arrow" ><i class="icon"><svg><use href="#icon-arrow-left"></use></svg></i> Prev</a></li>';
      var current_link = 0;

      while (number_of_pages > current_link) {
        navigation_html += '<li class="pagination-number-item pagination-item page_link" longdesc="' + current_link + '"><a class="pagination-link pagination-number-link"  >' + (current_link + 1) + '</a></li>';
        current_link++;
      }

      navigation_html += '<li class="pagination-item pagination-item--next"><a class="pagination-link next_link arrow" ">Next <i class="icon"><svg><use href="#icon-arrow-right"></use></use></svg></i></a></li>';

      $(document).ready(function () {

      })
      var yest = $('.pagination-brand-custom .page_navigation').html(navigation_html);

      $('.page_navigation .page_link:first').addClass('active_page');
      $('.page_navigation .page_link:first').addClass('pagination-item--current');
      $('.custom-brand-data').children().css('display', 'none');
      $('.custom-brand-data').children().slice(0, show_per_page).css('display', 'block');

      var total_page = $('.pagination-number-item').length - 1;

      if (total_page < 1) {
        $('.pagination-brand-custom').css('display', 'none')
      } else {
        $('.pagination-brand-custom').css('display', 'block')
      }

      $(document).on('click', '.previous_link', function () {
        var new_page = parseInt($('.current_brand_page').val()) - 1;
        if ($('.pagination-item--current').prev('.page_link').length == true) {
          go_to_page(new_page);
          $('.pagination-item--next').removeClass('deactive-arrow');
        }
        if (new_page < 1) {
          $('.pagination-item--previous').addClass('deactive-arrow');
        }
      })

      $(document).on('click', '.next_link', function () {
        var new_page = parseInt($('.current_brand_page').val()) + 1;
        if ($('.pagination-item--current').next('.page_link').length == true) {
          go_to_page(new_page);
          $('.pagination-item--previous').removeClass('deactive-arrow');
        }
        var abc = $('.pagination-number-item').length - 1;
        if (abc == new_page) {
          $('.pagination-item--next').addClass('deactive-arrow');
        }
      })

      $(document).on('click', '.pagination-number-link', function () {
        var page_num = $(this).parent(".page_link").attr('longdesc');
        var show_per_page = parseInt($('.show_brand_per_page').val());
        var start_from = page_num * show_per_page;
        var end_on = start_from + show_per_page;
        $('.custom-brand-data').children().css('display', 'none').slice(start_from, end_on).css('display', 'block');
        $('.pagination-number-item[longdesc=' + page_num + ']').addClass('pagination-item--current').siblings('.pagination-item--current').removeClass('pagination-item--current');
        $('.current_brand_page').val(page_num);

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
      })

      function go_to_page(page_num) {
        var show_per_page = parseInt($('.show_brand_per_page').val());
        var start_from = page_num * show_per_page;
        var end_on = start_from + show_per_page;
        $('.custom-brand-data').children().css('display', 'none').slice(start_from, end_on).css('display', 'block');
        $('.pagination-number-item[longdesc=' + page_num + ']').addClass('pagination-item--current').siblings('.pagination-item--current').removeClass('pagination-item--current');
        $('.current_brand_page').val(page_num);
      }
    }
  })

});



export function graphcat(context) {
  var currencyCode = context.currency_code;
  var bearerToken = context.bearerToken;
  const productid = context.productId;
  
  var query =
      `query {
      site {
          product(entityId:${productid}) {
          customFields{
              edges {
                  node {
                      value
                      name
                  }
              }
          }
           variants{
              pageInfo{
                  hasNextPage
                  hasPreviousPage
                  endCursor
                  }
                  edges {
                      cursor
                      node {
                      entityId                              
                      sku
                      prices (includeTax:true, currencyCode:USD) {
                          salePrice {
                          value
                          currencyCode
                          }
                          price {
                          value
                          currencyCode
                          }
                          basePrice {
                          value
                          currencyCode
                          }
                          retailPrice {
                          value
                          currencyCode
                          }
                          
                      }
                      options
                      {
                          edges
                          {
                          node
                          {
                              values{
                              edges
                              {
                                  node
                                  {
                                  entityId
                                  label
                                  }
                              }
                              }
                              displayName
                          }
                          }
                      }
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
  var query_2 =
    `query {
    site {
        product(entityId:${productid}) {
         variants{
            pageInfo{
                hasNextPage
                hasPreviousPage
                endCursor
                }
                edges {
                    cursor
                    node {
                    entityId                              
                    sku
                    prices (includeTax:true, currencyCode:GBP) {
                        salePrice {
                        value
                        currencyCode
                        }
                        price {
                        value
                        currencyCode
                        }
                        basePrice {
                        value
                        currencyCode
                        }
                        retailPrice {
                        value
                        currencyCode
                        }
                        
                    }
                    options
                    {
                        edges
                        {
                        node
                        {
                            values{
                            edges
                            {
                                node
                                {
                                entityId
                                label
                                }
                            }
                            }
                            displayName
                        }
                        }
                    }
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
  var graphql_query_result_2 = $.ajax({
      url: "/graphql",
      contentType: "application/json",
      type: 'POST',
      async: false,
      headers: {
          'Authorization': 'Bearer ' + bearerToken
      },
      data: JSON.stringify({ query: query_2 }),
      success: function (productvariationdata) {
      }
  });
      var data = graphql_query_result.responseJSON.data.site.product.variants.edges;
      var data_currency = graphql_query_result.responseJSON.data.site.currency.display;

      var data_2 = graphql_query_result_2.responseJSON.data.site.product.variants.edges;
      var data_currency_2 = graphql_query_result_2.responseJSON.data.site.currency.display;

      var data_custom = graphql_query_result.responseJSON.data.site.product.customFields.edges;
      
  //radio-group-label-173
  let a=[]
  for (let i = 0; i <  graphql_query_result.responseJSON.data.site.product.variants.edges.length; i++) {
      const element =  graphql_query_result.responseJSON.data.site.product.variants.edges[i];
      a.push(document.querySelector("input[value='"+element.node.options.edges[0]?.node.values.edges[0]?.node.entityId+"']"))
  }

  let r_count=0;        

  for (let j = 0; j < a.length; j++) {
      const element = a[j];
      var variation = ``

      if (data.length > 0) {

          for (let i = j; i < data.length; i++) {
              const value = data[i];
              variation += '<div class="variation-price">'
              if (value.node.prices.salePrice != null) {
                  variation += '<div class="sale-price">'+ data_currency.symbol +value.node.prices.salePrice.value + data_currency.decimalToken + data_currency.decimalPlaces + data_currency.decimalPlaces +'</div>'
                  // variation += '<div class="base-price">'+ data_currency +value.node.prices.basePrice.value+'</div>'
              } else {
                  variation += '<div class="sale-price">'+ data_currency.symbol +value.node.prices.basePrice.value+ data_currency.decimalToken + data_currency.decimalPlaces + data_currency.decimalPlaces +'</div>'
              }
              variation += '</div>'
              if (element && element.parentNode) {
                  element.parentNode.querySelector('.form-label-main').querySelector('.price-section-gpQL').innerHTML+=variation;   
              }
              break;

          }
      }

      if (data_2.length > 0) {
          var variation_2 = ``;
          for (let i = j; i < data_2.length; i++) {
              const value = data_2[i];
              variation_2 += '<div class="variation-price">'
              if (value.node.prices.salePrice != null) {
                  variation_2 += '<div class="sale-price">'+ data_currency_2.symbol +value.node.prices.salePrice.value + data_currency.decimalToken + data_currency.decimalPlaces + data_currency.decimalPlaces +'</div>'
                  // variation += '<div class="base-price">'+ data_currency +value.node.prices.basePrice.value+'</div>'
              } else {
                  variation_2 += '<div class="sale-price">'+ data_currency_2.symbol +value.node.prices.basePrice.value+ data_currency.decimalToken + data_currency.decimalPlaces + data_currency.decimalPlaces +'</div>'
              }
              variation_2 += '</div>'
              element.parentNode.querySelector('.form-label-main').querySelector('.price-section-gpQL').innerHTML+=variation_2;
              break;

          }
      }

      if (data_custom.length > 0) {
          var variation_3 = ``;
          for (let i = r_count; i < data_custom.length; i++) {

              const value = data_custom[i];

              if (value.node.name == '₹') {
                  r_count=i+1;
                  variation_3 += '<div class="variation-price">'
                  variation_3 += '<div class="sale-price"> ₹'+value.node.value+ data_currency.decimalToken + data_currency.decimalPlaces + data_currency.decimalPlaces +'</div>'
                  variation_3 += '</div>'
                  element.parentNode.querySelector('.form-label-main').querySelector('.price-section-gpQL').innerHTML+=variation_3;
                  break;
              }
          }
      }
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


  if (gbp_price != null) {
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
