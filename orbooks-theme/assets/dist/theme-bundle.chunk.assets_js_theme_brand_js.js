"use strict";
(self["webpackChunkbigcommerce_cornerstone"] = self["webpackChunkbigcommerce_cornerstone"] || []).push([["assets_js_theme_brand_js"],{

/***/ "./assets/js/theme/brand.js":
/*!**********************************!*\
  !*** ./assets/js/theme/brand.js ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Brand)
/* harmony export */ });
/* harmony import */ var _bigcommerce_stencil_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @bigcommerce/stencil-utils */ "./node_modules/@bigcommerce/stencil-utils/src/main.js");
/* harmony import */ var _catalog__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./catalog */ "./assets/js/theme/catalog.js");
/* harmony import */ var _global_compare_products__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./global/compare-products */ "./assets/js/theme/global/compare-products.js");
/* harmony import */ var _common_faceted_search__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./common/faceted-search */ "./assets/js/theme/common/faceted-search.js");
/* harmony import */ var _theme_common_utils_translations_utils__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../theme/common/utils/translations-utils */ "./assets/js/theme/common/utils/translations-utils.js");
/* provided dependency */ var $ = __webpack_require__(/*! jquery */ "./node_modules/jquery/dist/jquery.min.js");
function _inheritsLoose(t, o) { t.prototype = Object.create(o.prototype), t.prototype.constructor = t, _setPrototypeOf(t, o); }
function _setPrototypeOf(t, e) { return _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) { return t.__proto__ = e, t; }, _setPrototypeOf(t, e); }





var Brand = /*#__PURE__*/function (_CatalogPage) {
  function Brand(context) {
    var _this;
    _this = _CatalogPage.call(this, context) || this;
    _this.validationDictionary = (0,_theme_common_utils_translations_utils__WEBPACK_IMPORTED_MODULE_4__.createTranslationDictionary)(context);
    return _this;
  }
  _inheritsLoose(Brand, _CatalogPage);
  var _proto = Brand.prototype;
  _proto.onReady = function onReady() {
    (0,_global_compare_products__WEBPACK_IMPORTED_MODULE_2__["default"])(this.context);
    if ($('#facetedSearch').length > 0) {
      this.initFacetedSearch();
    } else {
      this.onSortBySubmit = this.onSortBySubmit.bind(this);
      _bigcommerce_stencil_utils__WEBPACK_IMPORTED_MODULE_0__.hooks.on('sortBy-submitted', this.onSortBySubmit);
    }
  };
  _proto.initFacetedSearch = function initFacetedSearch() {
    var _this$validationDicti = this.validationDictionary,
      onMinPriceError = _this$validationDicti.price_min_evaluation,
      onMaxPriceError = _this$validationDicti.price_max_evaluation,
      minPriceNotEntered = _this$validationDicti.price_min_not_entered,
      maxPriceNotEntered = _this$validationDicti.price_max_not_entered,
      onInvalidPrice = _this$validationDicti.price_invalid_value;
    var $productListingContainer = $('#product-listing-container');
    var $facetedSearchContainer = $('#faceted-search-container');
    var productsPerPage = this.context.brandProductsPerPage;
    var requestOptions = {
      template: {
        productListing: 'brand/product-listing',
        sidebar: 'brand/sidebar'
      },
      config: {
        shop_by_brand: true,
        brand: {
          products: {
            limit: productsPerPage
          }
        }
      },
      showMore: 'brand/show-more'
    };
    this.facetedSearch = new _common_faceted_search__WEBPACK_IMPORTED_MODULE_3__["default"](requestOptions, function (content) {
      $productListingContainer.html(content.productListing);
      $facetedSearchContainer.html(content.sidebar);
      $('body').triggerHandler('compareReset');
      $('html, body').animate({
        scrollTop: 0
      }, 100);
    }, {
      validationErrorMessages: {
        onMinPriceError: onMinPriceError,
        onMaxPriceError: onMaxPriceError,
        minPriceNotEntered: minPriceNotEntered,
        maxPriceNotEntered: maxPriceNotEntered,
        onInvalidPrice: onInvalidPrice
      }
    });
  };
  return Brand;
}(_catalog__WEBPACK_IMPORTED_MODULE_1__["default"]);


/***/ }),

/***/ "./assets/js/theme/common/utils/translations-utils.js":
/*!************************************************************!*\
  !*** ./assets/js/theme/common/utils/translations-utils.js ***!
  \************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   createTranslationDictionary: () => (/* binding */ createTranslationDictionary)
/* harmony export */ });
var TRANSLATIONS = 'translations';
var isTranslationDictionaryNotEmpty = function isTranslationDictionaryNotEmpty(dictionary) {
  return !!Object.keys(dictionary[TRANSLATIONS]).length;
};
var chooseActiveDictionary = function chooseActiveDictionary() {
  for (var i = 0; i < arguments.length; i++) {
    var dictionary = JSON.parse(i < 0 || arguments.length <= i ? undefined : arguments[i]);
    if (isTranslationDictionaryNotEmpty(dictionary)) {
      return dictionary;
    }
  }
};

/**
 * defines Translation Dictionary to use
 * @param context provides access to 3 validation JSONs from en.json:
 * validation_messages, validation_fallback_messages and default_messages
 * @returns {Object}
 */
var createTranslationDictionary = function createTranslationDictionary(context) {
  var validationDictionaryJSON = context.validationDictionaryJSON,
    validationFallbackDictionaryJSON = context.validationFallbackDictionaryJSON,
    validationDefaultDictionaryJSON = context.validationDefaultDictionaryJSON;
  var activeDictionary = chooseActiveDictionary(validationDictionaryJSON, validationFallbackDictionaryJSON, validationDefaultDictionaryJSON);
  var localizations = Object.values(activeDictionary[TRANSLATIONS]);
  var translationKeys = Object.keys(activeDictionary[TRANSLATIONS]).map(function (key) {
    return key.split('.').pop();
  });
  return translationKeys.reduce(function (acc, key, i) {
    acc[key] = localizations[i];
    return acc;
  }, {});
};

/***/ })

}]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGhlbWUtYnVuZGxlLmNodW5rLmFzc2V0c19qc190aGVtZV9icmFuZF9qcy5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBbUQ7QUFDZjtBQUNvQjtBQUNKO0FBQ21DO0FBQUEsSUFFbEVLLEtBQUssMEJBQUFDLFlBQUE7RUFDdEIsU0FBQUQsTUFBWUUsT0FBTyxFQUFFO0lBQUEsSUFBQUMsS0FBQTtJQUNqQkEsS0FBQSxHQUFBRixZQUFBLENBQUFHLElBQUEsT0FBTUYsT0FBTyxDQUFDO0lBQ2RDLEtBQUEsQ0FBS0Usb0JBQW9CLEdBQUdOLG1HQUEyQixDQUFDRyxPQUFPLENBQUM7SUFBQyxPQUFBQyxLQUFBO0VBQ3JFO0VBQUNHLGNBQUEsQ0FBQU4sS0FBQSxFQUFBQyxZQUFBO0VBQUEsSUFBQU0sTUFBQSxHQUFBUCxLQUFBLENBQUFRLFNBQUE7RUFBQUQsTUFBQSxDQUVERSxPQUFPLEdBQVAsU0FBQUEsT0FBT0EsQ0FBQSxFQUFHO0lBQ05aLG9FQUFlLENBQUMsSUFBSSxDQUFDSyxPQUFPLENBQUM7SUFFN0IsSUFBSVEsQ0FBQyxDQUFDLGdCQUFnQixDQUFDLENBQUNDLE1BQU0sR0FBRyxDQUFDLEVBQUU7TUFDaEMsSUFBSSxDQUFDQyxpQkFBaUIsQ0FBQyxDQUFDO0lBQzVCLENBQUMsTUFBTTtNQUNILElBQUksQ0FBQ0MsY0FBYyxHQUFHLElBQUksQ0FBQ0EsY0FBYyxDQUFDQyxJQUFJLENBQUMsSUFBSSxDQUFDO01BQ3BEbkIsNkRBQUssQ0FBQ29CLEVBQUUsQ0FBQyxrQkFBa0IsRUFBRSxJQUFJLENBQUNGLGNBQWMsQ0FBQztJQUNyRDtFQUNKLENBQUM7RUFBQU4sTUFBQSxDQUVESyxpQkFBaUIsR0FBakIsU0FBQUEsaUJBQWlCQSxDQUFBLEVBQUc7SUFDaEIsSUFBQUkscUJBQUEsR0FNSSxJQUFJLENBQUNYLG9CQUFvQjtNQUxIWSxlQUFlLEdBQUFELHFCQUFBLENBQXJDRSxvQkFBb0I7TUFDRUMsZUFBZSxHQUFBSCxxQkFBQSxD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R1Qsc0JBQXNCLENBQUNNLHdCQUF3QixFQUFFQyxnQ0FBZ0MsRUFBRUMsK0JBQStCLENBQUM7RUFDNUksSUFBTUUsYUFBYSxHQUFHWixNQUFNLENBQUNhLE1BQU0sQ0FBQ0YsZ0JBQWdCLENBQUNkLFlBQVksQ0FBQyxDQUFDO0VBQ25FLElBQU1pQixlQUFlLEdBQUdkLE1BQU0sQ0FBQ0MsSUFBSSxDQUFDVSxnQkFBZ0IsQ0FBQ2QsWUFBWSxDQUFDLENBQUMsQ0FBQ2tCLEdBQUcsQ0FBQyxVQUFBQyxHQUFHO0lBQUEsT0FBSUEsR0FBRyxDQUFDQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUNDLEdBQUcsQ0FBQyxDQUFDO0VBQUEsRUFBQztFQUVwRyxPQUFPSixlQUFlLENBQUNLLE1BQU0sQ0FBQyxVQUFDQyxHQUFHLEVBQUVKLEdBQUcsRUFBRWIsQ0FBQyxFQUFLO0lBQzNDaUIsR0FBRyxDQUFDSixHQUFHLENBQUMsR0FBR0osYUFBYSxDQUFDVCxDQUFDLENBQUM7SUFDM0IsT0FBT2lCLEdBQUc7RUFDZCxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDVixDQUFDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vYmlnY29tbWVyY2UtY29ybmVyc3RvbmUvLi9hc3NldHMvanMvdGhlbWUvYnJhbmQuanMiLCJ3ZWJwYWNrOi8vYmlnY29tbWVyY2UtY29ybmVyc3RvbmUvLi9hc3NldHMvanMvdGhlbWUvY29tbW9uL3V0aWxzL3RyYW5zbGF0aW9ucy11dGlscy5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBob29rcyB9IGZyb20gJ0BiaWdjb21tZXJjZS9zdGVuY2lsLXV0aWxzJztcclxuaW1wb3J0IENhdGFsb2dQYWdlIGZyb20gJy4vY2F0YWxvZyc7XHJcbmltcG9ydCBjb21wYXJlUHJvZHVjdHMgZnJvbSAnLi9nbG9iYWwvY29tcGFyZS1wcm9kdWN0cyc7XHJcbmltcG9ydCBGYWNldGVkU2VhcmNoIGZyb20gJy4vY29tbW9uL2ZhY2V0ZWQtc2VhcmNoJztcclxuaW1wb3J0IHsgY3JlYXRlVHJhbnNsYXRpb25EaWN0aW9uYXJ5IH0gZnJvbSAnLi4vdGhlbWUvY29tbW9uL3V0aWxzL3RyYW5zbGF0aW9ucy11dGlscyc7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBCcmFuZCBleHRlbmRzIENhdGFsb2dQYWdlIHtcclxuICAgIGNvbnN0cnVjdG9yKGNvbnRleHQpIHtcclxuICAgICAgICBzdXBlcihjb250ZXh0KTtcclxuICAgICAgICB0aGlzLnZhbGlkYXRpb25EaWN0aW9uYXJ5ID0gY3JlYXRlVHJhbnNsYXRpb25EaWN0aW9uYXJ5KGNvbnRleHQpO1xyXG4gICAgfVxyXG5cclxuICAgIG9uUmVhZHkoKSB7XHJcbiAgICAgICAgY29tcGFyZVByb2R1Y3RzKHRoaXMuY29udGV4dCk7XHJcblxyXG4gICAgICAgIGlmICgkKCcjZmFjZXRlZFNlYXJjaCcpLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgdGhpcy5pbml0RmFjZXRlZFNlYXJjaCgpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMub25Tb3J0QnlTdWJtaXQgPSB0aGlzLm9uU29ydEJ5U3VibWl0LmJpbmQodGhpcyk7XHJcbiAgICAgICAgICAgIGhvb2tzLm9uKCdzb3J0Qnktc3VibWl0dGVkJywgdGhpcy5vblNvcnRCeVN1Ym1pdCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGluaXRGYWNldGVkU2VhcmNoKCkge1xyXG4gICAgICAgIGNvbnN0IHtcclxuICAgICAgICAgICAgcHJpY2VfbWluX2V2YWx1YXRpb246IG9uTWluUHJpY2VFcnJvcixcclxuICAgICAgICAgICAgcHJpY2VfbWF4X2V2YWx1YXRpb246IG9uTWF4UHJpY2VFcnJvcixcclxuICAgICAgICAgICAgcHJpY2VfbWluX25vdF9lbnRlcmVkOiBtaW5QcmljZU5vdEVudGVyZWQsXHJcbiAgICAgICAgICAgIHByaWNlX21heF9ub3RfZW50ZXJlZDogbWF4UHJpY2VOb3RFbnRlcmVkLFxyXG4gICAgICAgICAgICBwcmljZV9pbnZhbGlkX3ZhbHVlOiBvbkludmFsaWRQcmljZSxcclxuICAgICAgICB9ID0gdGhpcy52YWxpZGF0aW9uRGljdGlvbmFyeTtcclxuICAgICAgICBjb25zdCAkcHJvZHVjdExpc3RpbmdDb250YWluZXIgPSAkKCcjcHJvZHVjdC1saXN0aW5nLWNvbnRhaW5lcicpO1xyXG4gICAgICAgIGNvbnN0ICRmYWNldGVkU2VhcmNoQ29udGFpbmVyID0gJCgnI2ZhY2V0ZWQtc2VhcmNoLWNvbnRhaW5lcicpO1xyXG4gICAgICAgIGNvbnN0IHByb2R1Y3RzUGVyUGFnZSA9IHRoaXMuY29udGV4dC5icmFuZFByb2R1Y3RzUGVyUGFnZTtcclxuICAgICAgICBjb25zdCByZXF1ZXN0T3B0aW9ucyA9IHtcclxuICAgICAgICAgICAgdGVtcGxhdGU6IHtcclxuICAgICAgICAgICAgICAgIHByb2R1Y3RMaXN0aW5nOiAnYnJhbmQvcHJvZHVjdC1saXN0aW5nJyxcclxuICAgICAgICAgICAgICAgIHNpZGViYXI6ICdicmFuZC9zaWRlYmFyJyxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgY29uZmlnOiB7XHJcbiAgICAgICAgICAgICAgICBzaG9wX2J5X2JyYW5kOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgYnJhbmQ6IHtcclxuICAgICAgICAgICAgICAgICAgICBwcm9kdWN0czoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsaW1pdDogcHJvZHVjdHNQZXJQYWdlLFxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBzaG93TW9yZTogJ2JyYW5kL3Nob3ctbW9yZScsXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdGhpcy5mYWNldGVkU2VhcmNoID0gbmV3IEZhY2V0ZWRTZWFyY2gocmVxdWVzdE9wdGlvbnMsIChjb250ZW50KSA9PiB7XHJcbiAgICAgICAgICAgICRwcm9kdWN0TGlzdGluZ0NvbnRhaW5lci5odG1sKGNvbnRlbnQucHJvZHVjdExpc3RpbmcpO1xyXG4gICAgICAgICAgICAkZmFjZXRlZFNlYXJjaENvbnRhaW5lci5odG1sKGNvbnRlbnQuc2lkZWJhcik7XHJcblxyXG4gICAgICAgICAgICAkKCdib2R5JykudHJpZ2dlckhhbmRsZXIoJ2NvbXBhcmVSZXNldCcpO1xyXG5cclxuICAgICAgICAgICAgJCgnaHRtbCwgYm9keScpLmFuaW1hdGUoe1xyXG4gICAgICAgICAgICAgICAgc2Nyb2xsVG9wOiAwLFxyXG4gICAgICAgICAgICB9LCAxMDApO1xyXG4gICAgICAgIH0sIHtcclxuICAgICAgICAgICAgdmFsaWRhdGlvbkVycm9yTWVzc2FnZXM6IHtcclxuICAgICAgICAgICAgICAgIG9uTWluUHJpY2VFcnJvcixcclxuICAgICAgICAgICAgICAgIG9uTWF4UHJpY2VFcnJvcixcclxuICAgICAgICAgICAgICAgIG1pblByaWNlTm90RW50ZXJlZCxcclxuICAgICAgICAgICAgICAgIG1heFByaWNlTm90RW50ZXJlZCxcclxuICAgICAgICAgICAgICAgIG9uSW52YWxpZFByaWNlLFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG59XHJcbiIsImNvbnN0IFRSQU5TTEFUSU9OUyA9ICd0cmFuc2xhdGlvbnMnO1xyXG5jb25zdCBpc1RyYW5zbGF0aW9uRGljdGlvbmFyeU5vdEVtcHR5ID0gKGRpY3Rpb25hcnkpID0+ICEhT2JqZWN0LmtleXMoZGljdGlvbmFyeVtUUkFOU0xBVElPTlNdKS5sZW5ndGg7XHJcbmNvbnN0IGNob29zZUFjdGl2ZURpY3Rpb25hcnkgPSAoLi4uZGljdGlvbmFyeUpzb25MaXN0KSA9PiB7XHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGRpY3Rpb25hcnlKc29uTGlzdC5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIGNvbnN0IGRpY3Rpb25hcnkgPSBKU09OLnBhcnNlKGRpY3Rpb25hcnlKc29uTGlzdFtpXSk7XHJcbiAgICAgICAgaWYgKGlzVHJhbnNsYXRpb25EaWN0aW9uYXJ5Tm90RW1wdHkoZGljdGlvbmFyeSkpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGRpY3Rpb25hcnk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59O1xyXG5cclxuLyoqXHJcbiAqIGRlZmluZXMgVHJhbnNsYXRpb24gRGljdGlvbmFyeSB0byB1c2VcclxuICogQHBhcmFtIGNvbnRleHQgcHJvdmlkZXMgYWNjZXNzIHRvIDMgdmFsaWRhdGlvbiBKU09OcyBmcm9tIGVuLmpzb246XHJcbiAqIHZhbGlkYXRpb25fbWVzc2FnZXMsIHZhbGlkYXRpb25fZmFsbGJhY2tfbWVzc2FnZXMgYW5kIGRlZmF1bHRfbWVzc2FnZXNcclxuICogQHJldHVybnMge09iamVjdH1cclxuICovXHJcbmV4cG9ydCBjb25zdCBjcmVhdGVUcmFuc2xhdGlvbkRpY3Rpb25hcnkgPSAoY29udGV4dCkgPT4ge1xyXG4gICAgY29uc3QgeyB2YWxpZGF0aW9uRGljdGlvbmFyeUpTT04sIHZhbGlkYXRpb25GYWxsYmFja0RpY3Rpb25hcnlKU09OLCB2YWxpZGF0aW9uRGVmYXVsdERpY3Rpb25hcnlKU09OIH0gPSBjb250ZXh0O1xyXG4gICAgY29uc3QgYWN0aXZlRGljdGlvbmFyeSA9IGNob29zZUFjdGl2ZURpY3Rpb25hcnkodmFsaWRhdGlvbkRpY3Rpb25hcnlKU09OLCB2YWxpZGF0aW9uRmFsbGJhY2tEaWN0aW9uYXJ5SlNPTiwgdmFsaWRhdGlvbkRlZmF1bHREaWN0aW9uYXJ5SlNPTik7XHJcbiAgICBjb25zdCBsb2NhbGl6YXRpb25zID0gT2JqZWN0LnZhbHVlcyhhY3RpdmVEaWN0aW9uYXJ5W1RSQU5TTEFUSU9OU10pO1xyXG4gICAgY29uc3QgdHJhbnNsYXRpb25LZXlzID0gT2JqZWN0LmtleXMoYWN0aXZlRGljdGlvbmFyeVtUUkFOU0xBVElPTlNdKS5tYXAoa2V5ID0+IGtleS5zcGxpdCgnLicpLnBvcCgpKTtcclxuXHJcbiAgICByZXR1cm4gdHJhbnNsYXRpb25LZXlzLnJlZHVjZSgoYWNjLCBrZXksIGkpID0+IHtcclxuICAgICAgICBhY2Nba2V5XSA9IGxvY2FsaXphdGlvbnNbaV07XHJcbiAgICAgICAgcmV0dXJuIGFjYztcclxuICAgIH0sIHt9KTtcclxufTtcclxuIl0sIm5hbWVzIjpbImhvb2tzIiwiQ2F0YWxvZ1BhZ2UiLCJjb21wYXJlUHJvZHVjdHMiLCJGYWNldGVkU2VhcmNoIiwiY3JlYXRlVHJhbnNsYXRpb25EaWN0aW9uYXJ5IiwiQnJhbmQiLCJfQ2F0YWxvZ1BhZ2UiLCJjb250ZXh0IiwiX3RoaXMiLCJjYWxsIiwidmFsaWRhdGlvbkRpY3Rpb25hcnkiLCJfaW5oZXJpdHNMb29zZSIsIl9wcm90byIsInByb3RvdHlwZSIsIm9uUmVhZHkiLCIkIiwibGVuZ3RoIiwiaW5pdEZhY2V0ZWRTZWFyY2giLCJvblNvcnRCeVN1Ym1pdCIsImJpbmQiLCJvbiIsIl90aGlzJHZhbGlkYXRpb25EaWN0aSIsIm9uTWluUHJpY2VFcnJvciIsInByaWNlX21pbl9ldmFsdWF0aW9uIiwib25NYXhQcmljZUVycm9yIiwicHJpY2VfbWF4X2V2YWx1YXRpb24iLCJtaW5QcmljZU5vdEVudGVyZWQiLCJwcmljZV9taW5fbm90X2VudGVyZWQiLCJtYXhQcmljZU5vdEVudGVyZWQiLCJwcmljZV9tYXhfbm90X2VudGVyZWQiLCJvbkludmFsaWRQcmljZSIsInByaWNlX2ludmFsaWRfdmFsdWUiLCIkcHJvZHVjdExpc3RpbmdDb250YWluZXIiLCIkZmFjZXRlZFNlYXJjaENvbnRhaW5lciIsInByb2R1Y3RzUGVyUGFnZSIsImJyYW5kUHJvZHVjdHNQZXJQYWdlIiwicmVxdWVzdE9wdGlvbnMiLCJ0ZW1wbGF0ZSIsInByb2R1Y3RMaXN0aW5nIiwic2lkZWJhciIsImNvbmZpZyIsInNob3BfYnlfYnJhbmQiLCJicmFuZCIsInByb2R1Y3RzIiwibGltaXQiLCJzaG93TW9yZSIsImZhY2V0ZWRTZWFyY2giLCJjb250ZW50IiwiaHRtbCIsInRyaWdnZXJIYW5kbGVyIiwiYW5pbWF0ZSIsInNjcm9sbFRvcCIsInZhbGlkYXRpb25FcnJvck1lc3NhZ2VzIiwiZGVmYXVsdCIsIlRSQU5TTEFUSU9OUyIsImlzVHJhbnNsYXRpb25EaWN0aW9uYXJ5Tm90RW1wdHkiLCJkaWN0aW9uYXJ5IiwiT2JqZWN0Iiwia2V5cyIsImNob29zZUFjdGl2ZURpY3Rpb25hcnkiLCJpIiwiYXJndW1lbnRzIiwiSlNPTiIsInBhcnNlIiwidW5kZWZpbmVkIiwidmFsaWRhdGlvbkRpY3Rpb25hcnlKU09OIiwidmFsaWRhdGlvbkZhbGxiYWNrRGljdGlvbmFyeUpTT04iLCJ2YWxpZGF0aW9uRGVmYXVsdERpY3Rpb25hcnlKU09OIiwiYWN0aXZlRGljdGlvbmFyeSIsImxvY2FsaXphdGlvbnMiLCJ2YWx1ZXMiLCJ0cmFuc2xhdGlvbktleXMiLCJtYXAiLCJrZXkiLCJzcGxpdCIsInBvcCIsInJlZHVjZSIsImFjYyJdLCJzb3VyY2VSb290IjoiIn0=
