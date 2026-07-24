import $ from 'jquery';
import ProductDetails from '../common/product-details';
import utils from '@bigcommerce/stencil-utils';

export default (function (context) {

    //  for reading list
    $(document).ready(function () {
        var reading_current_page = context.ReadingListPerPage;
        var reading_show_per_page = reading_current_page;
        
        var reading_number_of_items = $('.reading-page-data').children().length;
        var reading_number_of_pages = Math.ceil(reading_number_of_items/reading_show_per_page);
        
        $('.reading_current_page').val(0);
        $('.reading_show_per_page').val(reading_show_per_page);
        
        var reading_navigation_html = '<li class=" deactive-arrow reading-pagination-item reading-pagination-item--previous"><a class="reading-pagination-link reading_previous_link arrow" ><i class="icon"><svg><use href="#icon-arrow-left"></use></svg></i> Prev</a></li>';
        var reading_current_link = 0;
        
        while(reading_number_of_pages > reading_current_link){
            reading_navigation_html += '<li class="reading-pagination-number-item reading-pagination-item reading_page_link" longdesc="' + reading_current_link +'"><a class="reading-pagination-link reading-pagination-number-link"  >'+ (reading_current_link + 1) +'</a></li>';
            reading_current_link++;
        }
        reading_navigation_html += '<li class="reading-pagination-item reading-pagination-item--next"><a class="reading-pagination-link reading_next_link arrow" ">Next <i class="icon"><svg><use href="#icon-arrow-right"></use></use></svg></i></a></li>';
        
        $('.reading_page_navigation').html(reading_navigation_html);
        $('.reading_page_navigation .reading_page_link:first').addClass('reading-active_page');
        $('.reading_page_navigation .reading_page_link:first').addClass('reading-pagination-item--current');
        $('.reading-page-data').children().css('display', 'none');
        $('.reading-page-data').children().slice(0, reading_show_per_page).css('display', 'block');
        
        var reading_total_page = $('.reading-pagination-number-item').length - 1;
        
        if (reading_total_page < 1) {
            $('.pagination-reading').css('display','none')
        }
    })
    $(document).on('click', '.reading_previous_link', function () {
        var reading_new_page = parseInt($('.reading_current_page').val()) - 1;
        
        if($('.reading-pagination-item--current').prev('.reading_page_link').length==true){
            reading_go_to_page(reading_new_page);
            $('.reading-pagination-item--next').removeClass('deactive-arrow');
        }
        if (reading_new_page < 1) {
            $('.reading-pagination-item--previous').addClass('deactive-arrow');
        }
        window.scrollTo({ top: 0, behavior: 'smooth' });
    })
    $(document).on('click', '.reading_next_link', function (){
        var reading_new_page = parseInt($('.reading_current_page').val()) + 1;

        if($('.reading-pagination-item--current').next('.reading_page_link').length==true){
            reading_go_to_page(reading_new_page);
            $('.reading-pagination-item--previous').removeClass('deactive-arrow');
        }
        var reading_abc = $('.reading-pagination-number-item').length - 1;
        if (reading_abc == reading_new_page) {
            $('.reading-pagination-item--next').addClass('deactive-arrow');
        }
        window.scrollTo({ top: 0, behavior: 'smooth' });
    })
    $(document).on('click', '.reading-pagination-number-link', function (){ 
        var reading_page_num = $(this).parent(".reading_page_link").attr('longdesc');
        var reading_show_per_page = parseInt($('.reading_show_per_page').val());
        var reading_start_from = reading_page_num * reading_show_per_page;
        var reading_end_on = reading_start_from + reading_show_per_page;

        $('.reading-page-data').children().css('display', 'none').slice(reading_start_from, reading_end_on).css('display', 'block');
        $('.reading-pagination-number-item[longdesc=' + reading_page_num +']').addClass('reading-pagination-item--current').siblings('.reading-pagination-item--current').removeClass('reading-pagination-item--current');
        $('.reading_current_page').val(reading_page_num);

        if (reading_page_num < 1) {
            $('.reading-pagination-item--previous').addClass('deactive-arrow');
        }else {
            $('.reading-pagination-item--previous').removeClass('deactive-arrow');
        }
        var reading_abc_per_page = $('.reading-pagination-number-item').length - 1;
        if (reading_abc_per_page == reading_page_num) {
            $('.reading-pagination-item--next').addClass('deactive-arrow');
        }else {
            $('.reading-pagination-item--next').removeClass('deactive-arrow');
        }
        window.scrollTo({ top: 0, behavior: 'smooth' });
    })
    function reading_go_to_page(reading_page_num){
        var reading_show_per_page = parseInt($('.reading_show_per_page').val());
        var reading_start_from = reading_page_num * reading_show_per_page;
        var reading_end_on = reading_start_from + reading_show_per_page;

        $('.reading-page-data').children().css('display', 'none').slice(reading_start_from, reading_end_on).css('display', 'block');
        $('.reading-pagination-number-item[longdesc=' + reading_page_num +']').addClass('reading-pagination-item--current').siblings('.reading-pagination-item--current').removeClass('reading-pagination-item--current');
        $('.reading_current_page').val(reading_page_num);
    }
    $(document).on('click', '.pagination-link ', function (){
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    
})  
