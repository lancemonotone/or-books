"use strict";
(self["webpackChunkbigcommerce_cornerstone"] = self["webpackChunkbigcommerce_cornerstone"] || []).push([["assets_js_theme_common_collapsible_js-assets_js_theme_common_product-details-base_js-assets_j-734af2"],{

/***/ "./assets/js/theme/common/aria/constants.js":
/*!**************************************************!*\
  !*** ./assets/js/theme/common/aria/constants.js ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ariaKeyCodes: () => (/* binding */ ariaKeyCodes)
/* harmony export */ });
var ariaKeyCodes = {
  RETURN: 13,
  SPACE: 32,
  LEFT: 37,
  UP: 38,
  RIGHT: 39,
  DOWN: 40
};

/***/ }),

/***/ "./assets/js/theme/common/aria/index.js":
/*!**********************************************!*\
  !*** ./assets/js/theme/common/aria/index.js ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   initRadioOptions: () => (/* reexport safe */ _radioOptions__WEBPACK_IMPORTED_MODULE_0__["default"])
/* harmony export */ });
/* harmony import */ var _radioOptions__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./radioOptions */ "./assets/js/theme/common/aria/radioOptions.js");


/***/ }),

/***/ "./assets/js/theme/common/aria/radioOptions.js":
/*!*****************************************************!*\
  !*** ./assets/js/theme/common/aria/radioOptions.js ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./constants */ "./assets/js/theme/common/aria/constants.js");
/* provided dependency */ var $ = __webpack_require__(/*! jquery */ "./node_modules/jquery/dist/jquery.min.js");

var setCheckedRadioItem = function setCheckedRadioItem(itemCollection, itemIdx) {
  itemCollection.each(function (idx, item) {
    var $item = $(item);
    if (idx !== itemIdx) {
      $item.attr('aria-checked', false).prop('checked', false);
      return;
    }
    $item.attr('aria-checked', true).prop('checked', true).focus();
    $item.trigger('change');
  });
};
var calculateTargetItemPosition = function calculateTargetItemPosition(lastItemIdx, currentIdx) {
  switch (true) {
    case currentIdx > lastItemIdx:
      return 0;
    case currentIdx < 0:
      return lastItemIdx;
    default:
      return currentIdx;
  }
};
var handleItemKeyDown = function handleItemKeyDown(itemCollection) {
  return function (e) {
    var keyCode = e.keyCode;
    var itemIdx = itemCollection.index(e.currentTarget);
    var lastCollectionItemIdx = itemCollection.length - 1;
    if (Object.values(_constants__WEBPACK_IMPORTED_MODULE_0__.ariaKeyCodes).includes(keyCode)) {
      e.preventDefault();
      e.stopPropagation();
    }
    switch (keyCode) {
      case _constants__WEBPACK_IMPORTED_MODULE_0__.ariaKeyCodes.LEFT:
      case _constants__WEBPACK_IMPORTED_MODULE_0__.ariaKeyCodes.UP:
        {
          var prevItemIdx = calculateTargetItemPosition(lastCollectionItemIdx, itemIdx - 1);
          itemCollection.get(prevItemIdx).focus();
          setCheckedRadioItem(itemCollection, itemIdx - 1);
          break;
        }
      case _constants__WEBPACK_IMPORTED_MODULE_0__.ariaKeyCodes.RIGHT:
      case _constants__WEBPACK_IMPORTED_MODULE_0__.ariaKeyCodes.DOWN:
        {
          var nextItemIdx = calculateTargetItemPosition(lastCollectionItemIdx, itemIdx + 1);
          itemCollection.get(nextItemIdx).focus();
          setCheckedRadioItem(itemCollection, itemIdx + 1);
          break;
        }
      default:
        break;
    }
  };
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (function ($container, itemSelector) {
  var $itemCollection = $container.find(itemSelector);
  $container.on('keydown', itemSelector, handleItemKeyDown($itemCollection));
});

/***/ }),

/***/ "./assets/js/theme/common/collapsible.js":
/*!***********************************************!*\
  !*** ./assets/js/theme/common/collapsible.js ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Collapsible: () => (/* binding */ Collapsible),
/* harmony export */   CollapsibleEvents: () => (/* binding */ CollapsibleEvents),
/* harmony export */   "default": () => (/* binding */ collapsibleFactory)
/* harmony export */ });
/* harmony import */ var lodash_extend__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! lodash/extend */ "./node_modules/lodash/extend.js");
/* harmony import */ var lodash_extend__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lodash_extend__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _media_query_list__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./media-query-list */ "./assets/js/theme/common/media-query-list.js");
/* provided dependency */ var $ = __webpack_require__(/*! jquery */ "./node_modules/jquery/dist/jquery.min.js");

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return typeof key === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (typeof input !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (typeof res !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }

var PLUGIN_KEY = 'collapsible';
var CollapsibleEvents = {
  open: 'open.collapsible',
  close: 'close.collapsible',
  toggle: 'toggle.collapsible',
  click: 'click.collapsible'
};
var CollapsibleState = {
  closed: 'closed',
  open: 'open'
};
function prependHash(id) {
  if (id && id.indexOf('#') === 0) {
    return id;
  }
  return "#" + id;
}
function optionsFromData($element) {
  return {
    disabledBreakpoint: $element.data(PLUGIN_KEY + "DisabledBreakpoint"),
    disabledState: $element.data(PLUGIN_KEY + "DisabledState"),
    enabledState: $element.data(PLUGIN_KEY + "EnabledState"),
    openClassName: $element.data(PLUGIN_KEY + "OpenClassName")
  };
}

/**
 * Collapse/Expand toggle
 */
var Collapsible = /*#__PURE__*/function () {
  /**
   * @param {jQuery} $toggle - Trigger button
   * @param {jQuery} $target - Content to collapse / expand
   * @param {Object} [options] - Configurable options
   * @param {Object} [options.$context]
   * @param {String} [options.disabledBreakpoint]
   * @param {Object} [options.disabledState]
   * @param {Object} [options.enabledState]
   * @param {String} [options.openClassName]
   * @example
   *
   * <button id="#more">Collapse</button>
   * <div id="content">...</div>
   *
   * new Collapsible($('#more'), $('#content'));
   */
  function Collapsible($toggle, $target, _temp) {
    var _ref = _temp === void 0 ? {} : _temp,
      disabledBreakpoint = _ref.disabledBreakpoint,
      disabledState = _ref.disabledState,
      enabledState = _ref.enabledState,
      _ref$openClassName = _ref.openClassName,
      openClassName = _ref$openClassName === void 0 ? 'is-open' : _ref$openClassName;
    this.$toggle = $toggle;
    this.$target = $target;
    this.targetId = $target.attr('id');
    this.openClassName = openClassName;
    this.disabledState = disabledState;
    this.enabledState = enabledState;
    if (disabledBreakpoint) {
      this.disabledMediaQueryList = (0,_media_query_list__WEBPACK_IMPORTED_MODULE_1__["default"])(disabledBreakpoint);
    }
    if (this.disabledMediaQueryList) {
      this.disabled = this.disabledMediaQueryList.matches;
    } else {
      this.disabled = false;
    }

    // Auto-bind
    this.onClicked = this.onClicked.bind(this);
    this.onDisabledMediaQueryListMatch = this.onDisabledMediaQueryListMatch.bind(this);

    // Assign DOM attributes
    this.$target.attr('aria-hidden', this.isCollapsed);
    this.$toggle.attr('aria-label', this._getToggleAriaLabelText($toggle)).attr('aria-controls', $target.attr('id')).attr('aria-expanded', this.isOpen);

    // Listen
    this.bindEvents();
  }
  var _proto = Collapsible.prototype;
  _proto._getToggleAriaLabelText = function _getToggleAriaLabelText($toggle) {
    var $textToggleChildren = $toggle.children().filter(function (__, child) {
      return $(child).text().trim();
    });
    var $ariaLabelTarget = $textToggleChildren.length ? $textToggleChildren.first() : $toggle;
    return $($ariaLabelTarget).text().trim();
  };
  _proto.open = function open(_temp2) {
    var _ref2 = _temp2 === void 0 ? {} : _temp2,
      _ref2$notify = _ref2.notify,
      notify = _ref2$notify === void 0 ? true : _ref2$notify;
    this.$toggle.addClass(this.openClassName).attr('aria-expanded', true);
    this.$target.addClass(this.openClassName).attr('aria-hidden', false);
    if (notify) {
      this.$toggle.trigger(CollapsibleEvents.open, [this]);
      this.$toggle.trigger(CollapsibleEvents.toggle, [this]);
    }
  };
  _proto.close = function close(_temp3) {
    var _ref3 = _temp3 === void 0 ? {} : _temp3,
      _ref3$notify = _ref3.notify,
      notify = _ref3$notify === void 0 ? true : _ref3$notify;
    this.$toggle.removeClass(this.openClassName).attr('aria-expanded', false);
    this.$target.removeClass(this.openClassName).attr('aria-hidden', true);
    if (notify) {
      this.$toggle.trigger(CollapsibleEvents.close, [this]);
      this.$toggle.trigger(CollapsibleEvents.toggle, [this]);
    }
  };
  _proto.toggle = function toggle() {
    if (this.isCollapsed) {
      this.open();
    } else {
      this.close();
    }
  };
  _proto.toggleByState = function toggleByState(state) {
    for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }
    switch (state) {
      case CollapsibleState.open:
        return this.open.apply(this, args);
      case CollapsibleState.closed:
        return this.close.apply(this, args);
      default:
        return undefined;
    }
  };
  _proto.hasCollapsible = function hasCollapsible(collapsibleInstance) {
    return $.contains(this.$target.get(0), collapsibleInstance.$target.get(0));
  };
  _proto.bindEvents = function bindEvents() {
    this.$toggle.on(CollapsibleEvents.click, this.onClicked);
    if (this.disabledMediaQueryList && this.disabledMediaQueryList.addListener) {
      this.disabledMediaQueryList.addListener(this.onDisabledMediaQueryListMatch);
    }
  };
  _proto.unbindEvents = function unbindEvents() {
    this.$toggle.off(CollapsibleEvents.click, this.onClicked);
    if (this.disabledMediaQueryList && this.disabledMediaQueryList.removeListener) {
      this.disabledMediaQueryList.removeListener(this.onDisabledMediaQueryListMatch);
    }
  };
  _proto.onClicked = function onClicked(event) {
    if (this.disabled) {
      return;
    }
    event.preventDefault();
    this.toggle();
  };
  _proto.onDisabledMediaQueryListMatch = function onDisabledMediaQueryListMatch(media) {
    this.disabled = media.matches;
  };
  _createClass(Collapsible, [{
    key: "isCollapsed",
    get: function get() {
      return this.$target.is(':hidden') && !this.$target.hasClass(this.openClassName);
    }
  }, {
    key: "isOpen",
    get: function get() {
      return !this.isCollapsed;
    }
  }, {
    key: "disabled",
    get: function get() {
      return this._disabled;
    },
    set: function set(disabled) {
      this._disabled = disabled;
      if (disabled) {
        this.toggleByState(this.disabledState);
      } else {
        this.toggleByState(this.enabledState);
      }
    }
  }]);
  return Collapsible;
}();

/**
 * Convenience method for constructing Collapsible instance
 *
 * @param {string} [selector]
 * @param {Object} [overrideOptions]
 * @param {Object} [overrideOptions.$context]
 * @param {String} [overrideOptions.disabledBreakpoint]
 * @param {Object} [overrideOptions.disabledState]
 * @param {Object} [overrideOptions.enabledState]
 * @param {String} [overrideOptions.openClassName]
 * @return {Array} array of Collapsible instances
 *
 * @example
 * <a href="#content" data-collapsible>Collapse</a>
 * <div id="content">...</div>
 *
 * collapsibleFactory();
 */
function collapsibleFactory(selector, overrideOptions) {
  if (selector === void 0) {
    selector = "[data-" + PLUGIN_KEY + "]";
  }
  if (overrideOptions === void 0) {
    overrideOptions = {};
  }
  var $collapsibles = $(selector, overrideOptions.$context);
  return $collapsibles.map(function (index, element) {
    var $toggle = $(element);
    var instanceKey = PLUGIN_KEY + "Instance";
    var cachedCollapsible = $toggle.data(instanceKey);
    if (cachedCollapsible instanceof Collapsible) {
      return cachedCollapsible;
    }
    var targetId = prependHash($toggle.data(PLUGIN_KEY) || $toggle.data(PLUGIN_KEY + "Target") || $toggle.attr('href'));
    var options = lodash_extend__WEBPACK_IMPORTED_MODULE_0___default()(optionsFromData($toggle), overrideOptions);
    var collapsible = new Collapsible($toggle, $(targetId, overrideOptions.$context), options);
    $toggle.data(instanceKey, collapsible);
    return collapsible;
  }).toArray();
}

/***/ }),

/***/ "./assets/js/theme/common/media-query-list.js":
/*!****************************************************!*\
  !*** ./assets/js/theme/common/media-query-list.js ***!
  \****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ mediaQueryListFactory)
/* harmony export */ });
/*
 * Remember to update /assets/scss/settings/global/screensizes/screensizes.scss
 * if you decide to change breakpoint values
 */
var breakpointSizes = {
  large: 1261,
  medium: 801,
  small: 551
};

/**
 * Create MediaQueryList using breakpoint name
 * @param {string} breakpointName
 * @return {MediaQueryList|null}
 */
function mediaQueryListFactory(breakpointName) {
  if (!breakpointName || !window.matchMedia) {
    return null;
  }
  var breakpoint = breakpointSizes[breakpointName];
  var mediaQuery = "(min-width: " + breakpoint + "px)";
  var mediaQueryList = window.matchMedia(mediaQuery);
  return mediaQueryList;
}

/***/ }),

/***/ "./assets/js/theme/common/product-details-base.js":
/*!********************************************************!*\
  !*** ./assets/js/theme/common/product-details-base.js ***!
  \********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ ProductDetailsBase),
/* harmony export */   optionChangeDecorator: () => (/* binding */ optionChangeDecorator)
/* harmony export */ });
/* harmony import */ var _wishlist__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../wishlist */ "./assets/js/theme/wishlist.js");
/* harmony import */ var _aria__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./aria */ "./assets/js/theme/common/aria/index.js");
/* provided dependency */ var $ = __webpack_require__(/*! jquery */ "./node_modules/jquery/dist/jquery.min.js");


var optionsTypesMap = {
  INPUT_FILE: 'input-file',
  INPUT_TEXT: 'input-text',
  INPUT_NUMBER: 'input-number',
  INPUT_CHECKBOX: 'input-checkbox',
  TEXTAREA: 'textarea',
  DATE: 'date',
  SET_SELECT: 'set-select',
  SET_RECTANGLE: 'set-rectangle',
  SET_RADIO: 'set-radio',
  SWATCH: 'swatch',
  PRODUCT_LIST: 'product-list'
};
function optionChangeDecorator(areDefaultOtionsSet) {
  var _this = this;
  return function (err, response) {
    var attributesData = response.data || {};
    var attributesContent = response.content || {};
    _this.updateProductAttributes(attributesData);
    if (areDefaultOtionsSet) {
      _this.updateView(attributesData, attributesContent);
    } else {
      _this.updateDefaultAttributesForOOS(attributesData);
    }
  };
}
var ProductDetailsBase = /*#__PURE__*/function () {
  function ProductDetailsBase($scope, context) {
    var _this2 = this;
    this.$scope = $scope;
    this.context = context;
    this.initRadioAttributes();
    _wishlist__WEBPACK_IMPORTED_MODULE_0__["default"].load(this.context);
    this.getTabRequests();
    $('[data-product-attribute]').each(function (__, value) {
      var type = value.getAttribute('data-product-attribute');
      _this2._makeProductVariantAccessible(value, type);
    });
  }
  var _proto = ProductDetailsBase.prototype;
  _proto._makeProductVariantAccessible = function _makeProductVariantAccessible(variantDomNode, variantType) {
    switch (variantType) {
      case optionsTypesMap.SET_RADIO:
      case optionsTypesMap.SWATCH:
        {
          (0,_aria__WEBPACK_IMPORTED_MODULE_1__.initRadioOptions)($(variantDomNode), '[type=radio]');
          break;
        }
      default:
        break;
    }
  }

  /**
   * Allow radio buttons to get deselected
   */;
  _proto.initRadioAttributes = function initRadioAttributes() {
    var _this3 = this;
    $('[data-product-attribute] input[type="radio"]', this.$scope).each(function (i, radio) {
      var $radio = $(radio);

      // Only bind to click once
      if ($radio.attr('data-state') !== undefined) {
        $radio.on('click', function () {
          if ($radio.data('state') === true) {
            $radio.prop('checked', false);
            $radio.data('state', false);
            $radio.trigger('change');
          } else {
            $radio.data('state', true);
          }
          _this3.initRadioAttributes();
        });
      }
      $radio.attr('data-state', $radio.prop('checked'));
    });
  }

  /**
   * Hide or mark as unavailable out of stock attributes if enabled
   * @param  {Object} data Product attribute data
   */;
  _proto.updateProductAttributes = function updateProductAttributes(data) {
    var _this4 = this;
    var behavior = data.out_of_stock_behavior;
    var inStockIds = data.in_stock_attributes;
    var outOfStockDefaultMessage = this.context.outOfStockDefaultMessage;
    var outOfStockMessage = data.out_of_stock_message;
    if (behavior !== 'hide_option' && behavior !== 'label_option') {
      return;
    }
    if (outOfStockMessage) {
      outOfStockMessage = " (" + outOfStockMessage + ")";
    } else {
      outOfStockMessage = " (" + outOfStockDefaultMessage + ")";
    }
    $('[data-product-attribute-value]', this.$scope).each(function (i, attribute) {
      var $attribute = $(attribute);
      var attrId = parseInt($attribute.data('productAttributeValue'), 10);
      if (inStockIds.indexOf(attrId) !== -1) {
        _this4.enableAttribute($attribute, behavior, outOfStockMessage);
      } else {
        _this4.disableAttribute($attribute, behavior, outOfStockMessage);
      }
    });
  }

  /**
   * Check for fragment identifier in URL requesting a specific tab
   */;
  _proto.getTabRequests = function getTabRequests() {
    if (window.location.hash && window.location.hash.indexOf('#tab-') === 0) {
      var $activeTab = $('.tabs').has("[href='" + window.location.hash + "']");
      var $tabContent = $("" + window.location.hash);
      if ($activeTab.length > 0) {
        $activeTab.find('.tab').removeClass('is-active').has("[href='" + window.location.hash + "']").addClass('is-active');
        $tabContent.addClass('is-active').siblings().removeClass('is-active');
      }
    }
  }

  /**
   * Since $productView can be dynamically inserted using render_with,
   * We have to retrieve the respective elements
   *
   * @param $scope
   */;
  _proto.getViewModel = function getViewModel($scope) {
    return {
      $priceWithTax: $('[data-product-price-with-tax]', $scope),
      $priceWithoutTax: $('[data-product-price-without-tax]', $scope),
      rrpWithTax: {
        $div: $('.rrp-price--withTax', $scope),
        $span: $('[data-product-rrp-with-tax]', $scope)
      },
      rrpWithoutTax: {
        $div: $('.rrp-price--withoutTax', $scope),
        $span: $('[data-product-rrp-price-without-tax]', $scope)
      },
      nonSaleWithTax: {
        $div: $('.non-sale-price--withTax', $scope),
        $span: $('[data-product-non-sale-price-with-tax]', $scope)
      },
      nonSaleWithoutTax: {
        $div: $('.non-sale-price--withoutTax', $scope),
        $span: $('[data-product-non-sale-price-without-tax]', $scope)
      },
      priceSaved: {
        $div: $('.price-section--saving', $scope),
        $span: $('[data-product-price-saved]', $scope)
      },
      priceNowLabel: {
        $span: $('.price-now-label', $scope)
      },
      priceLabel: {
        $span: $('.price-label', $scope)
      },
      $weight: $('.productView-info [data-product-weight]', $scope),
      $increments: $('.form-field--increments :input', $scope),
      $addToCart: $('#form-action-addToCart', $scope),
      $wishlistVariation: $('[data-wishlist-add] [name="variation_id"]', $scope),
      stock: {
        $container: $('.form-field--stock', $scope),
        $input: $('[data-product-stock]', $scope)
      },
      sku: {
        $label: $('dt.sku-label', $scope),
        $value: $('[data-product-sku]', $scope)
      },
      upc: {
        $label: $('dt.upc-label', $scope),
        $value: $('[data-product-upc]', $scope)
      },
      quantity: {
        $text: $('.incrementTotal', $scope),
        $input: $('[name=qty\\[\\]]', $scope)
      },
      $bulkPricing: $('.productView-info-bulkPricing', $scope),
      $walletButtons: $('[data-add-to-cart-wallet-buttons]', $scope)
    };
  }

  /**
   * Hide the pricing elements that will show up only when the price exists in API
   * @param viewModel
   */;
  _proto.clearPricingNotFound = function clearPricingNotFound(viewModel) {
    viewModel.rrpWithTax.$div.hide();
    viewModel.rrpWithoutTax.$div.hide();
    viewModel.nonSaleWithTax.$div.hide();
    viewModel.nonSaleWithoutTax.$div.hide();
    viewModel.priceSaved.$div.hide();
    viewModel.priceNowLabel.$span.hide();
    viewModel.priceLabel.$span.hide();
  }

  /**
   * Update the view of price, messages, SKU and stock options when a product option changes
   * @param  {Object} data Product attribute data
   */;
  _proto.updateView = function updateView(data, content) {
    if (content === void 0) {
      content = null;
    }
    var viewModel = this.getViewModel(this.$scope);
    this.showMessageBox(data.stock_message || data.purchasing_message);
    if (data.price instanceof Object) {
      this.updatePriceView(viewModel, data.price);
    }
    if (data.weight instanceof Object) {
      viewModel.$weight.html(data.weight.formatted);
    }

    // Set variation_id if it exists for adding to wishlist
    if (data.variantId) {
      viewModel.$wishlistVariation.val(data.variantId);
    }

    // If SKU is available
    if (data.sku) {
      viewModel.sku.$value.text(data.sku);
      viewModel.sku.$label.show();
    } else {
      viewModel.sku.$label.hide();
      viewModel.sku.$value.text('');
    }

    // If UPC is available
    if (data.upc) {
      viewModel.upc.$value.text(data.upc);
      viewModel.upc.$label.show();
    } else {
      viewModel.upc.$label.hide();
      viewModel.upc.$value.text('');
    }

    // if stock view is on (CP settings)
    if (viewModel.stock.$container.length && typeof data.stock === 'number') {
      // if the stock container is hidden, show
      viewModel.stock.$container.removeClass('u-hiddenVisually');
      viewModel.stock.$input.text(data.stock);
    } else {
      viewModel.stock.$container.addClass('u-hiddenVisually');
      viewModel.stock.$input.text(data.stock);
    }
    this.updateDefaultAttributesForOOS(data);
    this.updateWalletButtonsView(data);

    // If Bulk Pricing rendered HTML is available
    if (data.bulk_discount_rates && content) {
      viewModel.$bulkPricing.html(content);
    } else if (typeof data.bulk_discount_rates !== 'undefined') {
      viewModel.$bulkPricing.html('');
    }
    var addToCartWrapper = $('#add-to-cart-wrapper');
    if (addToCartWrapper.is(':hidden') && data.purchasable) {
      addToCartWrapper.show();
    }
  }

  /**
   * Update the view of price, messages, SKU and stock options when a product option changes
   * @param  {Object} data Product attribute data
   */;
  _proto.updatePriceView = function updatePriceView(viewModel, price) {
    this.clearPricingNotFound(viewModel);
    if (price.with_tax) {
      var updatedPrice = price.price_range ? price.price_range.min.with_tax.formatted + " - " + price.price_range.max.with_tax.formatted : price.with_tax.formatted;
      viewModel.priceLabel.$span.show();
      viewModel.$priceWithTax.html(updatedPrice);
    }
    if (price.without_tax) {
      var _updatedPrice = price.price_range ? price.price_range.min.without_tax.formatted + " - " + price.price_range.max.without_tax.formatted : price.without_tax.formatted;
      viewModel.priceLabel.$span.show();
      viewModel.$priceWithoutTax.html(_updatedPrice);
    }
    if (price.rrp_with_tax) {
      viewModel.rrpWithTax.$div.show();
      viewModel.rrpWithTax.$span.html(price.rrp_with_tax.formatted);
    }
    if (price.rrp_without_tax) {
      viewModel.rrpWithoutTax.$div.show();
      viewModel.rrpWithoutTax.$span.html(price.rrp_without_tax.formatted);
    }
    if (price.saved) {
      viewModel.priceSaved.$div.show();
      viewModel.priceSaved.$span.html(price.saved.formatted);
    }
    if (price.non_sale_price_with_tax) {
      viewModel.priceLabel.$span.hide();
      viewModel.nonSaleWithTax.$div.show();
      viewModel.priceNowLabel.$span.show();
      viewModel.nonSaleWithTax.$span.html(price.non_sale_price_with_tax.formatted);
    }
    if (price.non_sale_price_without_tax) {
      viewModel.priceLabel.$span.hide();
      viewModel.nonSaleWithoutTax.$div.show();
      viewModel.priceNowLabel.$span.show();
      viewModel.nonSaleWithoutTax.$span.html(price.non_sale_price_without_tax.formatted);
    }
  }

  /**
   * Show an message box if a message is passed
   * Hide the box if the message is empty
   * @param  {String} message
   */;
  _proto.showMessageBox = function showMessageBox(message) {
    var $messageBox = $('.productAttributes-message');
    if (message) {
      $('.alertBox-message', $messageBox).text(message);
      $messageBox.show();
    } else {
      $messageBox.hide();
    }
  };
  _proto.updateDefaultAttributesForOOS = function updateDefaultAttributesForOOS(data) {
    var viewModel = this.getViewModel(this.$scope);
    if (!data.purchasable || !data.instock) {
      viewModel.$addToCart.prop('disabled', true);
      viewModel.$increments.prop('disabled', true);
    } else {
      viewModel.$addToCart.prop('disabled', false);
      viewModel.$increments.prop('disabled', false);
    }
  };
  _proto.updateWalletButtonsView = function updateWalletButtonsView(data) {
    this.toggleWalletButtonsVisibility(data.purchasable && data.instock);
  };
  _proto.toggleWalletButtonsVisibility = function toggleWalletButtonsVisibility(shouldShow) {
    var viewModel = this.getViewModel(this.$scope);
    if (shouldShow) {
      viewModel.$walletButtons.show();
    } else {
      viewModel.$walletButtons.hide();
    }
  };
  _proto.enableAttribute = function enableAttribute($attribute, behavior, outOfStockMessage) {
    if (this.getAttributeType($attribute) === 'set-select') {
      return this.enableSelectOptionAttribute($attribute, behavior, outOfStockMessage);
    }
    if (behavior === 'hide_option') {
      $attribute.show();
    } else {
      $attribute.removeClass('unavailable');
    }
  };
  _proto.disableAttribute = function disableAttribute($attribute, behavior, outOfStockMessage) {
    if (this.getAttributeType($attribute) === 'set-select') {
      return this.disableSelectOptionAttribute($attribute, behavior, outOfStockMessage);
    }
    if (behavior === 'hide_option') {
      $attribute.hide(0);
    } else {
      $attribute.addClass('unavailable');
    }
  };
  _proto.getAttributeType = function getAttributeType($attribute) {
    var $parent = $attribute.closest('[data-product-attribute]');
    return $parent ? $parent.data('productAttribute') : null;
  };
  _proto.disableSelectOptionAttribute = function disableSelectOptionAttribute($attribute, behavior, outOfStockMessage) {
    var $select = $attribute.parent();
    if (behavior === 'hide_option') {
      $attribute.toggleOption(false);
      // If the attribute is the selected option in a select dropdown, select the first option (MERC-639)
      if ($select.val() === $attribute.attr('value')) {
        $select[0].selectedIndex = 0;
      }
    } else {
      $attribute.html($attribute.html().replace(outOfStockMessage, '') + outOfStockMessage);
    }
  };
  _proto.enableSelectOptionAttribute = function enableSelectOptionAttribute($attribute, behavior, outOfStockMessage) {
    if (behavior === 'hide_option') {
      $attribute.toggleOption(true);
    } else {
      $attribute.html($attribute.html().replace(outOfStockMessage, ''));
    }
  };
  return ProductDetailsBase;
}();


/***/ }),

/***/ "./assets/js/theme/common/utils/ie-helpers.js":
/*!****************************************************!*\
  !*** ./assets/js/theme/common/utils/ie-helpers.js ***!
  \****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   convertIntoArray: () => (/* binding */ convertIntoArray),
/* harmony export */   isBrowserIE: () => (/* binding */ isBrowserIE)
/* harmony export */ });
var isBrowserIE = !!document.documentMode;
var convertIntoArray = function convertIntoArray(collection) {
  return Array.prototype.slice.call(collection);
};

/***/ }),

/***/ "./assets/js/theme/common/utils/pagination-utils.js":
/*!**********************************************************!*\
  !*** ./assets/js/theme/common/utils/pagination-utils.js ***!
  \**********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   wishlistPaginatorHelper: () => (/* binding */ wishlistPaginatorHelper)
/* harmony export */ });
/* provided dependency */ var $ = __webpack_require__(/*! jquery */ "./node_modules/jquery/dist/jquery.min.js");
var changeWishlistPaginationLinks = function changeWishlistPaginationLinks(wishlistUrl) {
  for (var _len = arguments.length, paginationItems = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    paginationItems[_key - 1] = arguments[_key];
  }
  return $.each(paginationItems, function (_, $item) {
    var paginationLink = $item.children('.pagination-link');
    if ($item.length && !paginationLink.attr('href').includes('page=')) {
      var pageNumber = paginationLink.attr('href');
      paginationLink.attr('href', wishlistUrl + "page=" + pageNumber);
    }
  });
};

/**
 * helps to withdraw differences in structures around the stencil resource pagination
 */
var wishlistPaginatorHelper = function wishlistPaginatorHelper() {
  var $paginationList = $('.pagination-list');
  if (!$paginationList.length) return;
  var $nextItem = $('.pagination-item--next', $paginationList);
  var $prevItem = $('.pagination-item--previous', $paginationList);
  var currentHref = $('[data-pagination-current-page-link]').attr('href');
  var partialPaginationUrl = currentHref.split('page=').shift();
  changeWishlistPaginationLinks(partialPaginationUrl, $prevItem, $nextItem);
};

/***/ }),

/***/ "./assets/js/theme/wishlist.js":
/*!*************************************!*\
  !*** ./assets/js/theme/wishlist.js ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ WishList)
/* harmony export */ });
/* harmony import */ var foundation_sites_js_foundation_foundation__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! foundation-sites/js/foundation/foundation */ "./node_modules/foundation-sites/js/foundation/foundation.js");
/* harmony import */ var foundation_sites_js_foundation_foundation__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(foundation_sites_js_foundation_foundation__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var foundation_sites_js_foundation_foundation_reveal__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! foundation-sites/js/foundation/foundation.reveal */ "./node_modules/foundation-sites/js/foundation/foundation.reveal.js");
/* harmony import */ var foundation_sites_js_foundation_foundation_reveal__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(foundation_sites_js_foundation_foundation_reveal__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _common_nod__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./common/nod */ "./assets/js/theme/common/nod.js");
/* harmony import */ var _page_manager__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./page-manager */ "./assets/js/theme/page-manager.js");
/* harmony import */ var _common_utils_pagination_utils__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./common/utils/pagination-utils */ "./assets/js/theme/common/utils/pagination-utils.js");
/* harmony import */ var _common_utils_form_utils__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./common/utils/form-utils */ "./assets/js/theme/common/utils/form-utils.js");
/* provided dependency */ var $ = __webpack_require__(/*! jquery */ "./node_modules/jquery/dist/jquery.min.js");
function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }
function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }






var WishList = /*#__PURE__*/function (_PageManager) {
  _inheritsLoose(WishList, _PageManager);
  function WishList(context) {
    var _this;
    _this = _PageManager.call(this, context) || this;
    _this.options = {
      template: 'account/add-wishlist'
    };
    return _assertThisInitialized(_this) || _assertThisInitialized(_this);
  }

  /**
   * Creates a confirm box before deleting all wish lists
   */
  var _proto = WishList.prototype;
  _proto.wishlistDeleteConfirm = function wishlistDeleteConfirm() {
    var _this2 = this;
    $('body').on('click', '[data-wishlist-delete]', function (event) {
      var confirmed = window.confirm(_this2.context.wishlistDelete);
      if (confirmed) {
        return true;
      }
      event.preventDefault();
    });
  };
  _proto.registerAddWishListValidation = function registerAddWishListValidation($addWishlistForm) {
    var _this3 = this;
    this.addWishlistValidator = (0,_common_nod__WEBPACK_IMPORTED_MODULE_2__["default"])({
      submit: '.wishlist-form input[type="submit"]',
      tap: _common_utils_form_utils__WEBPACK_IMPORTED_MODULE_5__.announceInputErrorMessage
    });
    this.addWishlistValidator.add([{
      selector: '.wishlist-form input[name="wishlistname"]',
      validate: function validate(cb, val) {
        var result = val.length > 0;
        cb(result);
      },
      errorMessage: this.context.enterWishlistNameError
    }]);
    $addWishlistForm.on('submit', function (event) {
      _this3.addWishlistValidator.performCheck();
      if (_this3.addWishlistValidator.areAll('valid')) {
        return;
      }
      event.preventDefault();
    });
  };
  _proto.onReady = function onReady() {
    var $addWishListForm = $('.wishlist-form');
    if ($('[data-pagination-wishlist]').length) {
      (0,_common_utils_pagination_utils__WEBPACK_IMPORTED_MODULE_4__.wishlistPaginatorHelper)();
    }
    if ($addWishListForm.length) {
      this.registerAddWishListValidation($addWishListForm);
    }
    this.wishlistDeleteConfirm();
  };
  return WishList;
}(_page_manager__WEBPACK_IMPORTED_MODULE_3__["default"]);


/***/ })

}]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGhlbWUtYnVuZGxlLmNodW5rLmFzc2V0c19qc190aGVtZV9jb21tb25fY29sbGFwc2libGVfanMtYXNzZXRzX2pzX3RoZW1lX2NvbW1vbl9wcm9kdWN0LWRldGFpbHMtYmFzZV9qcy1hc3NldHNfai03MzRhZjIuanMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztBQUFPLElBQU1BLFlBQVksR0FBRztFQUN4QkMsTUFBTSxFQUFFLEVBQUU7RUFDVkMsS0FBSyxFQUFFLEVBQUU7RUFDVEMsSUFBSSxFQUFFLEVBQUU7RUFDUkMsRUFBRSxFQUFFLEVBQUU7RUFDTkMsS0FBSyxFQUFFLEVBQUU7RUFDVEMsSUFBSSxFQUFFO0FBQ1YsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ1AwQztBQUUzQyxJQUFNQyxtQkFBbUIsR0FBRyxTQUF0QkEsbUJBQW1CQSxDQUFJQyxjQUFjLEVBQUVDLE9BQU8sRUFBSztFQUNyREQsY0FBYyxDQUFDRSxJQUFJLENBQUMsVUFBQ0MsR0FBRyxFQUFFQyxJQUFJLEVBQUs7SUFDL0IsSUFBTUMsS0FBSyxHQUFHQyxDQUFDLENBQUNGLElBQUksQ0FBQztJQUNyQixJQUFJRCxHQUFHLEtBQUtGLE9BQU8sRUFBRTtNQUNqQkksS0FBSyxDQUFDRSxJQUFJLENBQUMsY0FBYyxFQUFFLEtBQUssQ0FBQyxDQUFDQyxJQUFJLENBQUMsU0FBUyxFQUFFLEtBQUssQ0FBQztNQUN4RDtJQUNKO0lBRUFILEtBQUssQ0FBQ0UsSUFBSSxDQUFDLGNBQWMsRUFBRSxJQUFJLENBQUMsQ0FBQ0MsSUFBSSxDQUFDLFNBQVMsRUFBRSxJQUFJLENBQUMsQ0FBQ0MsS0FBSyxDQUFDLENBQUM7SUFDOURKLEtBQUssQ0FBQ0ssT0FBTyxDQUFDLFFBQVEsQ0FBQztFQUMzQixDQUFDLENBQUM7QUFDTixDQUFDO0FBRUQsSUFBTUMsMkJBQTJCLEdBQUcsU0FBOUJBLDJCQUEyQkEsQ0FBSUMsV0FBVyxFQUFFQyxVQUFVLEVBQUs7RUFDN0QsUUFBUSxJQUFJ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S0FBSyxFQUFJO01BQ25DcUUsTUFBSSxDQUFDa0ksb0JBQW9CLENBQUNTLFlBQVksQ0FBQyxDQUFDO01BRXhDLElBQUkzSSxNQUFJLENBQUNrSSxvQkFBb0IsQ0FBQ1UsTUFBTSxDQUFDLE9BQU8sQ0FBQyxFQUFFO1FBQzNDO01BQ0o7TUFFQWpOLEtBQUssQ0FBQ2xGLGNBQWMsQ0FBQyxDQUFDO0lBQzFCLENBQUMsQ0FBQztFQUNOLENBQUM7RUFBQThDLE1BQUEsQ0FFRHNQLE9BQU8sR0FBUCxTQUFBQSxRQUFBLEVBQVU7SUFDTixJQUFNQyxnQkFBZ0IsR0FBR3ZULENBQUMsQ0FBQyxnQkFBZ0IsQ0FBQztJQUU1QyxJQUFJQSxDQUFDLENBQUMsNEJBQTRCLENBQUMsQ0FBQ2MsTUFBTSxFQUFFO01BQ3hDdVEsdUZBQXVCLENBQUMsQ0FBQztJQUM3QjtJQUVBLElBQUlrQyxnQkFBZ0IsQ0FBQ3pTLE1BQU0sRUFBRTtNQUN6QixJQUFJLENBQUMyUiw2QkFBNkIsQ0FBQ2MsZ0JBQWdCLENBQUM7SUFDeEQ7SUFFQSxJQUFJLENBQUNsQixxQkFBcUIsQ0FBQyxDQUFDO0VBQ2hDLENBQUM7RUFBQSxPQUFBTCxRQUFBO0FBQUEsRUFuRWlDRixxREFBVyIsInNvdXJjZXMiOlsid2VicGFjazovL2JpZ2NvbW1lcmNlLWNvcm5lcnN0b25lLy4vYXNzZXRzL2pzL3RoZW1lL2NvbW1vbi9hcmlhL2NvbnN0YW50cy5qcyIsIndlYnBhY2s6Ly9iaWdjb21tZXJjZS1jb3JuZXJzdG9uZS8uL2Fzc2V0cy9qcy90aGVtZS9jb21tb24vYXJpYS9yYWRpb09wdGlvbnMuanMiLCJ3ZWJwYWNrOi8vYmlnY29tbWVyY2UtY29ybmVyc3RvbmUvLi9hc3NldHMvanMvdGhlbWUvY29tbW9uL2NvbGxhcHNpYmxlLmpzIiwid2VicGFjazovL2JpZ2NvbW1lcmNlLWNvcm5lcnN0b25lLy4vYXNzZXRzL2pzL3RoZW1lL2NvbW1vbi9tZWRpYS1xdWVyeS1saXN0LmpzIiwid2VicGFjazovL2JpZ2NvbW1lcmNlLWNvcm5lcnN0b25lLy4vYXNzZXRzL2pzL3RoZW1lL2NvbW1vbi9wcm9kdWN0LWRldGFpbHMtYmFzZS5qcyIsIndlYnBhY2s6Ly9iaWdjb21tZXJjZS1jb3JuZXJzdG9uZS8uL2Fzc2V0cy9qcy90aGVtZS9jb21tb24vdXRpbHMvaWUtaGVscGVycy5qcyIsIndlYnBhY2s6Ly9iaWdjb21tZXJjZS1jb3JuZXJzdG9uZS8uL2Fzc2V0cy9qcy90aGVtZS9jb21tb24vdXRpbHMvcGFnaW5hdGlvbi11dGlscy5qcyIsIndlYnBhY2s6Ly9iaWdjb21tZXJjZS1jb3JuZXJzdG9uZS8uL2Fzc2V0cy9qcy90aGVtZS93aXNobGlzdC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgY29uc3QgYXJpYUtleUNvZGVzID0ge1xuICAgIFJFVFVSTjogMTMsXG4gICAgU1BBQ0U6IDMyLFxuICAgIExFRlQ6IDM3LFxuICAgIFVQOiAzOCxcbiAgICBSSUdIVDogMzksXG4gICAgRE9XTjogNDAsXG59O1xuIiwiaW1wb3J0IHsgYXJpYUtleUNvZGVzIH0gZnJvbSAnLi9jb25zdGFudHMnO1xuXG5jb25zdCBzZXRDaGVja2VkUmFkaW9JdGVtID0gKGl0ZW1Db2xsZWN0aW9uLCBpdGVtSWR4KSA9PiB7XG4gICAgaXRlbUNvbGxlY3Rpb24uZWFjaCgoaWR4LCBpdGVtKSA9PiB7XG4gICAgICAgIGNvbnN0ICRpdGVtID0gJChpdGVtKTtcbiAgICAgICAgaWYgKGlkeCAhPT0gaXRlbUlkeCkge1xuICAgICAgICAgICAgJGl0ZW0uYXR0cignYXJpYS1jaGVja2VkJywgZmFsc2UpLnByb3AoJ2NoZWNrZWQnLCBmYWxzZSk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICAkaXRlbS5hdHRyKCdhcmlhLWNoZWNrZWQnLCB0cnVlKS5wcm9wKCdjaGVja2VkJywgdHJ1ZSkuZm9jdXMoKTtcbiAgICAgICAgJGl0ZW0udHJpZ2dlcignY2hhbmdlJyk7XG4gICAgfSk7XG59O1xuXG5jb25zdCBjYWxjdWxhdGVUYXJnZXRJdGVtUG9zaXRpb24gPSAobGFzdEl0ZW1JZHgsIGN1cnJlbnRJZHgpID0+IHtcbiAgICBzd2l0Y2ggKHRydWUpIHtcbiAgICBjYXNlIGN1cnJlbnRJZHggPiBsYXN0SXRlbUlkeDogcmV0dXJuIDA7XG4gICAgY2FzZSBjdXJyZW50SWR4IDwgMDogcmV0dXJuIGxhc3RJdGVtSWR4O1xuICAgIGRlZmF1bHQ6IHJldHVybiBjdXJyZW50SWR4O1xuICAgIH1cbn07XG5cbmNvbnN0IGhhbmRsZUl0ZW1LZXlEb3duID0gaXRlbUNvbGxlY3Rpb24gPT4gZSA9PiB7XG4gICAgY29uc3QgeyBrZXlDb2RlIH0gPSBlO1xuICAgIGNvbnN0IGl0ZW1JZHggPSBpdGVtQ29sbGVjdGlvbi5pbmRleChlLmN1cnJlbnRUYXJnZXQpO1xuICAgIGNvbnN0IGxhc3RDb2xsZWN0aW9uSXRlbUlkeCA9IGl0ZW1Db2xsZWN0aW9uLmxlbmd0aCAtIDE7XG5cbiAgICBpZiAoT2JqZWN0LnZhbHVlcyhhcmlhS2V5Q29kZXMpLmluY2x1ZGVzKGtleUNvZGUpKSB7XG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICB9XG5cbiAgICBzd2l0Y2ggKGtleUNvZGUpIHtcbiAgICBjYXNlIGFyaWFLZXlDb2Rlcy5MRUZUOlxuICAgIGNhc2UgYXJpYUtleUNvZGVzLlVQOiB7XG4gICAgICAgIGNvbnN0IHByZXZJdGVtSWR4ID0gY2FsY3VsYXRlVGFyZ2V0SXRlbVBvc2l0aW9uKGxhc3RDb2xsZWN0aW9uSXRlbUlkeCwgaXRlbUlkeCAtIDEpO1xuICAgICAgICBpdGVtQ29sbGVjdGlvbi5nZXQocHJldkl0ZW1JZHgpLmZvY3VzKCk7XG4gICAgICAgIHNldENoZWNrZWRSYWRpb0l0ZW0oaXRlbUNvbGxlY3Rpb24sIGl0ZW1JZHggLSAxKTtcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuICAgIGNhc2UgYXJpYUtleUNvZGVzLlJJR0hUOlxuICAgIGNhc2UgYXJpYUtleUNvZGVzLkRPV046IHtcbiAgICAgICAgY29uc3QgbmV4dEl0ZW1JZHggPSBjYWxjdWxhdGVUYXJnZXRJdGVtUG9zaXRpb24obGFzdENvbGxlY3Rpb25JdGVtSWR4LCBpdGVtSWR4ICsgMSk7XG4gICAgICAgIGl0ZW1Db2xsZWN0aW9uLmdldChuZXh0SXRlbUlkeCkuZm9jdXMoKTtcbiAgICAgICAgc2V0Q2hlY2tlZFJhZGlvSXRlbShpdGVtQ29sbGVjdGlvbiwgaXRlbUlkeCArIDEpO1xuICAgICAgICBicmVhaztcbiAgICB9XG5cbiAgICBkZWZhdWx0OiBicmVhaztcbiAgICB9XG59O1xuXG5leHBvcnQgZGVmYXVsdCAoJGNvbnRhaW5lciwgaXRlbVNlbGVjdG9yKSA9PiB7XG4gICAgY29uc3QgJGl0ZW1Db2xsZWN0aW9uID0gJGNvbnRhaW5lci5maW5kKGl0ZW1TZWxlY3Rvcik7XG5cbiAgICAkY29udGFpbmVyLm9uKCdrZXlkb3duJywgaXRlbVNlbGVjdG9yLCBoYW5kbGVJdGVtS2V5RG93bigkaXRlbUNvbGxlY3Rpb24pKTtcbn07XG4iLCJpbXBvcnQgXyBmcm9tICdsb2Rhc2gnO1xuaW1wb3J0IG1lZGlhUXVlcnlMaXN0RmFjdG9yeSBmcm9tICcuL21lZGlhLXF1ZXJ5LWxpc3QnO1xuXG5jb25zdCBQTFVHSU5fS0VZID0gJ2NvbGxhcHNpYmxlJztcblxuZXhwb3J0IGNvbnN0IENvbGxhcHNpYmxlRXZlbnRzID0ge1xuICAgIG9wZW46ICdvcGVuLmNvbGxhcHNpYmxlJyxcbiAgICBjbG9zZTogJ2Nsb3NlLmNvbGxhcHNpYmxlJyxcbiAgICB0b2dnbGU6ICd0b2dnbGUuY29sbGFwc2libGUnLFxuICAgIGNsaWNrOiAnY2xpY2suY29sbGFwc2libGUnLFxufTtcblxuY29uc3QgQ29sbGFwc2libGVTdGF0ZSA9IHtcbiAgICBjbG9zZWQ6ICdjbG9zZWQnLFxuICAgIG9wZW46ICdvcGVuJyxcbn07XG5cbmZ1bmN0aW9uIHByZXBlbmRIYXNoKGlkKSB7XG4gICAgaWYgKGlkICYmIGlkLmluZGV4T2YoJyMnKSA9PT0gMCkge1xuICAgICAgICByZXR1cm4gaWQ7XG4gICAgfVxuXG4gICAgcmV0dXJuIGAjJHtpZH1gO1xufVxuXG5mdW5jdGlvbiBvcHRpb25zRnJvbURhdGEoJGVsZW1lbnQpIHtcbiAgICByZXR1cm4ge1xuICAgICAgICBkaXNhYmxlZEJyZWFrcG9pbnQ6ICRlbGVtZW50LmRhdGEoYCR7UExVR0lOX0tFWX1EaXNhYmxlZEJyZWFrcG9pbnRgKSxcbiAgICAgICAgZGlzYWJsZWRTdGF0ZTogJGVsZW1lbnQuZGF0YShgJHtQTFVHSU5fS0VZfURpc2FibGVkU3RhdGVgKSxcbiAgICAgICAgZW5hYmxlZFN0YXRlOiAkZWxlbWVudC5kYXRhKGAke1BMVUdJTl9LRVl9RW5hYmxlZFN0YXRlYCksXG4gICAgICAgIG9wZW5DbGFzc05hbWU6ICRlbGVtZW50LmRhdGEoYCR7UExVR0lOX0tFWX1PcGVuQ2xhc3NOYW1lYCksXG4gICAgfTtcbn1cblxuLyoqXG4gKiBDb2xsYXBzZS9FeHBhbmQgdG9nZ2xlXG4gKi9cbmV4cG9ydCBjbGFzcyBDb2xsYXBzaWJsZSB7XG4gICAgLyoqXG4gICAgICogQHBhcmFtIHtqUXVlcnl9ICR0b2dnbGUgLSBUcmlnZ2VyIGJ1dHRvblxuICAgICAqIEBwYXJhbSB7alF1ZXJ5fSAkdGFyZ2V0IC0gQ29udGVudCB0byBjb2xsYXBzZSAvIGV4cGFuZFxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9uc10gLSBDb25maWd1cmFibGUgb3B0aW9uc1xuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9ucy4kY29udGV4dF1cbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gW29wdGlvbnMuZGlzYWJsZWRCcmVha3BvaW50XVxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9ucy5kaXNhYmxlZFN0YXRlXVxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9ucy5lbmFibGVkU3RhdGVdXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IFtvcHRpb25zLm9wZW5DbGFzc05hbWVdXG4gICAgICogQGV4YW1wbGVcbiAgICAgKlxuICAgICAqIDxidXR0b24gaWQ9XCIjbW9yZVwiPkNvbGxhcHNlPC9idXR0b24+XG4gICAgICogPGRpdiBpZD1cImNvbnRlbnRcIj4uLi48L2Rpdj5cbiAgICAgKlxuICAgICAqIG5ldyBDb2xsYXBzaWJsZSgkKCcjbW9yZScpLCAkKCcjY29udGVudCcpKTtcbiAgICAgKi9cbiAgICBjb25zdHJ1Y3RvcigkdG9nZ2xlLCAkdGFyZ2V0LCB7XG4gICAgICAgIGRpc2FibGVkQnJlYWtwb2ludCxcbiAgICAgICAgZGlzYWJsZWRTdGF0ZSxcbiAgICAgICAgZW5hYmxlZFN0YXRlLFxuICAgICAgICBvcGVuQ2xhc3NOYW1lID0gJ2lzLW9wZW4nLFxuICAgIH0gPSB7fSkge1xuICAgICAgICB0aGlzLiR0b2dnbGUgPSAkdG9nZ2xlO1xuICAgICAgICB0aGlzLiR0YXJnZXQgPSAkdGFyZ2V0O1xuICAgICAgICB0aGlzLnRhcmdldElkID0gJHRhcmdldC5hdHRyKCdpZCcpO1xuICAgICAgICB0aGlzLm9wZW5DbGFzc05hbWUgPSBvcGVuQ2xhc3NOYW1lO1xuICAgICAgICB0aGlzLmRpc2FibGVkU3RhdGUgPSBkaXNhYmxlZFN0YXRlO1xuICAgICAgICB0aGlzLmVuYWJsZWRTdGF0ZSA9IGVuYWJsZWRTdGF0ZTtcblxuICAgICAgICBpZiAoZGlzYWJsZWRCcmVha3BvaW50KSB7XG4gICAgICAgICAgICB0aGlzLmRpc2FibGVkTWVkaWFRdWVyeUxpc3QgPSBtZWRpYVF1ZXJ5TGlzdEZhY3RvcnkoZGlzYWJsZWRCcmVha3BvaW50KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLmRpc2FibGVkTWVkaWFRdWVyeUxpc3QpIHtcbiAgICAgICAgICAgIHRoaXMuZGlzYWJsZWQgPSB0aGlzLmRpc2FibGVkTWVkaWFRdWVyeUxpc3QubWF0Y2hlcztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuZGlzYWJsZWQgPSBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIEF1dG8tYmluZFxuICAgICAgICB0aGlzLm9uQ2xpY2tlZCA9IHRoaXMub25DbGlja2VkLmJpbmQodGhpcyk7XG4gICAgICAgIHRoaXMub25EaXNhYmxlZE1lZGlhUXVlcnlMaXN0TWF0Y2ggPSB0aGlzLm9uRGlzYWJsZWRNZWRpYVF1ZXJ5TGlzdE1hdGNoLmJpbmQodGhpcyk7XG5cbiAgICAgICAgLy8gQXNzaWduIERPTSBhdHRyaWJ1dGVzXG4gICAgICAgIHRoaXMuJHRhcmdldC5hdHRyKCdhcmlhLWhpZGRlbicsIHRoaXMuaXNDb2xsYXBzZWQpO1xuICAgICAgICB0aGlzLiR0b2dnbGVcbiAgICAgICAgICAgIC5hdHRyKCdhcmlhLWxhYmVsJywgdGhpcy5fZ2V0VG9nZ2xlQXJpYUxhYmVsVGV4dCgkdG9nZ2xlKSlcbiAgICAgICAgICAgIC5hdHRyKCdhcmlhLWNvbnRyb2xzJywgJHRhcmdldC5hdHRyKCdpZCcpKVxuICAgICAgICAgICAgLmF0dHIoJ2FyaWEtZXhwYW5kZWQnLCB0aGlzLmlzT3Blbik7XG5cbiAgICAgICAgLy8gTGlzdGVuXG4gICAgICAgIHRoaXMuYmluZEV2ZW50cygpO1xuICAgIH1cblxuICAgIGdldCBpc0NvbGxhcHNlZCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuJHRhcmdldC5pcygnOmhpZGRlbicpICYmICF0aGlzLiR0YXJnZXQuaGFzQ2xhc3ModGhpcy5vcGVuQ2xhc3NOYW1lKTtcbiAgICB9XG5cbiAgICBnZXQgaXNPcGVuKCkge1xuICAgICAgICByZXR1cm4gIXRoaXMuaXNDb2xsYXBzZWQ7XG4gICAgfVxuXG4gICAgc2V0IGRpc2FibGVkKGRpc2FibGVkKSB7XG4gICAgICAgIHRoaXMuX2Rpc2FibGVkID0gZGlzYWJsZWQ7XG5cbiAgICAgICAgaWYgKGRpc2FibGVkKSB7XG4gICAgICAgICAgICB0aGlzLnRvZ2dsZUJ5U3RhdGUodGhpcy5kaXNhYmxlZFN0YXRlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMudG9nZ2xlQnlTdGF0ZSh0aGlzLmVuYWJsZWRTdGF0ZSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBnZXQgZGlzYWJsZWQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9kaXNhYmxlZDtcbiAgICB9XG5cbiAgICBfZ2V0VG9nZ2xlQXJpYUxhYmVsVGV4dCgkdG9nZ2xlKSB7XG4gICAgICAgIGNvbnN0ICR0ZXh0VG9nZ2xlQ2hpbGRyZW4gPSAkdG9nZ2xlLmNoaWxkcmVuKCkuZmlsdGVyKChfXywgY2hpbGQpID0+ICQoY2hpbGQpLnRleHQoKS50cmltKCkpO1xuICAgICAgICBjb25zdCAkYXJpYUxhYmVsVGFyZ2V0ID0gJHRleHRUb2dnbGVDaGlsZHJlbi5sZW5ndGggPyAkdGV4dFRvZ2dsZUNoaWxkcmVuLmZpcnN0KCkgOiAkdG9nZ2xlO1xuXG4gICAgICAgIHJldHVybiAkKCRhcmlhTGFiZWxUYXJnZXQpLnRleHQoKS50cmltKCk7XG4gICAgfVxuXG4gICAgb3Blbih7IG5vdGlmeSA9IHRydWUgfSA9IHt9KSB7XG4gICAgICAgIHRoaXMuJHRvZ2dsZVxuICAgICAgICAgICAgLmFkZENsYXNzKHRoaXMub3BlbkNsYXNzTmFtZSlcbiAgICAgICAgICAgIC5hdHRyKCdhcmlhLWV4cGFuZGVkJywgdHJ1ZSk7XG5cbiAgICAgICAgdGhpcy4kdGFyZ2V0XG4gICAgICAgICAgICAuYWRkQ2xhc3ModGhpcy5vcGVuQ2xhc3NOYW1lKVxuICAgICAgICAgICAgLmF0dHIoJ2FyaWEtaGlkZGVuJywgZmFsc2UpO1xuXG4gICAgICAgIGlmIChub3RpZnkpIHtcbiAgICAgICAgICAgIHRoaXMuJHRvZ2dsZS50cmlnZ2VyKENvbGxhcHNpYmxlRXZlbnRzLm9wZW4sIFt0aGlzXSk7XG4gICAgICAgICAgICB0aGlzLiR0b2dnbGUudHJpZ2dlcihDb2xsYXBzaWJsZUV2ZW50cy50b2dnbGUsIFt0aGlzXSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBjbG9zZSh7IG5vdGlmeSA9IHRydWUgfSA9IHt9KSB7XG4gICAgICAgIHRoaXMuJHRvZ2dsZVxuICAgICAgICAgICAgLnJlbW92ZUNsYXNzKHRoaXMub3BlbkNsYXNzTmFtZSlcbiAgICAgICAgICAgIC5hdHRyKCdhcmlhLWV4cGFuZGVkJywgZmFsc2UpO1xuXG4gICAgICAgIHRoaXMuJHRhcmdldFxuICAgICAgICAgICAgLnJlbW92ZUNsYXNzKHRoaXMub3BlbkNsYXNzTmFtZSlcbiAgICAgICAgICAgIC5hdHRyKCdhcmlhLWhpZGRlbicsIHRydWUpO1xuXG4gICAgICAgIGlmIChub3RpZnkpIHtcbiAgICAgICAgICAgIHRoaXMuJHRvZ2dsZS50cmlnZ2VyKENvbGxhcHNpYmxlRXZlbnRzLmNsb3NlLCBbdGhpc10pO1xuICAgICAgICAgICAgdGhpcy4kdG9nZ2xlLnRyaWdnZXIoQ29sbGFwc2libGVFdmVudHMudG9nZ2xlLCBbdGhpc10pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgdG9nZ2xlKCkge1xuICAgICAgICBpZiAodGhpcy5pc0NvbGxhcHNlZCkge1xuICAgICAgICAgICAgdGhpcy5vcGVuKCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmNsb3NlKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB0b2dnbGVCeVN0YXRlKHN0YXRlLCAuLi5hcmdzKSB7XG4gICAgICAgIHN3aXRjaCAoc3RhdGUpIHtcbiAgICAgICAgY2FzZSBDb2xsYXBzaWJsZVN0YXRlLm9wZW46XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5vcGVuLmFwcGx5KHRoaXMsIGFyZ3MpO1xuXG4gICAgICAgIGNhc2UgQ29sbGFwc2libGVTdGF0ZS5jbG9zZWQ6XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5jbG9zZS5hcHBseSh0aGlzLCBhcmdzKTtcblxuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGhhc0NvbGxhcHNpYmxlKGNvbGxhcHNpYmxlSW5zdGFuY2UpIHtcbiAgICAgICAgcmV0dXJuICQuY29udGFpbnModGhpcy4kdGFyZ2V0LmdldCgwKSwgY29sbGFwc2libGVJbnN0YW5jZS4kdGFyZ2V0LmdldCgwKSk7XG4gICAgfVxuXG4gICAgYmluZEV2ZW50cygpIHtcbiAgICAgICAgdGhpcy4kdG9nZ2xlLm9uKENvbGxhcHNpYmxlRXZlbnRzLmNsaWNrLCB0aGlzLm9uQ2xpY2tlZCk7XG5cbiAgICAgICAgaWYgKHRoaXMuZGlzYWJsZWRNZWRpYVF1ZXJ5TGlzdCAmJiB0aGlzLmRpc2FibGVkTWVkaWFRdWVyeUxpc3QuYWRkTGlzdGVuZXIpIHtcbiAgICAgICAgICAgIHRoaXMuZGlzYWJsZWRNZWRpYVF1ZXJ5TGlzdC5hZGRMaXN0ZW5lcih0aGlzLm9uRGlzYWJsZWRNZWRpYVF1ZXJ5TGlzdE1hdGNoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHVuYmluZEV2ZW50cygpIHtcbiAgICAgICAgdGhpcy4kdG9nZ2xlLm9mZihDb2xsYXBzaWJsZUV2ZW50cy5jbGljaywgdGhpcy5vbkNsaWNrZWQpO1xuXG4gICAgICAgIGlmICh0aGlzLmRpc2FibGVkTWVkaWFRdWVyeUxpc3QgJiYgdGhpcy5kaXNhYmxlZE1lZGlhUXVlcnlMaXN0LnJlbW92ZUxpc3RlbmVyKSB7XG4gICAgICAgICAgICB0aGlzLmRpc2FibGVkTWVkaWFRdWVyeUxpc3QucmVtb3ZlTGlzdGVuZXIodGhpcy5vbkRpc2FibGVkTWVkaWFRdWVyeUxpc3RNYXRjaCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBvbkNsaWNrZWQoZXZlbnQpIHtcbiAgICAgICAgaWYgKHRoaXMuZGlzYWJsZWQpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgdGhpcy50b2dnbGUoKTtcbiAgICB9XG5cbiAgICBvbkRpc2FibGVkTWVkaWFRdWVyeUxpc3RNYXRjaChtZWRpYSkge1xuICAgICAgICB0aGlzLmRpc2FibGVkID0gbWVkaWEubWF0Y2hlcztcbiAgICB9XG59XG5cbi8qKlxuICogQ29udmVuaWVuY2UgbWV0aG9kIGZvciBjb25zdHJ1Y3RpbmcgQ29sbGFwc2libGUgaW5zdGFuY2VcbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gW3NlbGVjdG9yXVxuICogQHBhcmFtIHtPYmplY3R9IFtvdmVycmlkZU9wdGlvbnNdXG4gKiBAcGFyYW0ge09iamVjdH0gW292ZXJyaWRlT3B0aW9ucy4kY29udGV4dF1cbiAqIEBwYXJhbSB7U3RyaW5nfSBbb3ZlcnJpZGVPcHRpb25zLmRpc2FibGVkQnJlYWtwb2ludF1cbiAqIEBwYXJhbSB7T2JqZWN0fSBbb3ZlcnJpZGVPcHRpb25zLmRpc2FibGVkU3RhdGVdXG4gKiBAcGFyYW0ge09iamVjdH0gW292ZXJyaWRlT3B0aW9ucy5lbmFibGVkU3RhdGVdXG4gKiBAcGFyYW0ge1N0cmluZ30gW292ZXJyaWRlT3B0aW9ucy5vcGVuQ2xhc3NOYW1lXVxuICogQHJldHVybiB7QXJyYXl9IGFycmF5IG9mIENvbGxhcHNpYmxlIGluc3RhbmNlc1xuICpcbiAqIEBleGFtcGxlXG4gKiA8YSBocmVmPVwiI2NvbnRlbnRcIiBkYXRhLWNvbGxhcHNpYmxlPkNvbGxhcHNlPC9hPlxuICogPGRpdiBpZD1cImNvbnRlbnRcIj4uLi48L2Rpdj5cbiAqXG4gKiBjb2xsYXBzaWJsZUZhY3RvcnkoKTtcbiAqL1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gY29sbGFwc2libGVGYWN0b3J5KHNlbGVjdG9yID0gYFtkYXRhLSR7UExVR0lOX0tFWX1dYCwgb3ZlcnJpZGVPcHRpb25zID0ge30pIHtcbiAgICBjb25zdCAkY29sbGFwc2libGVzID0gJChzZWxlY3Rvciwgb3ZlcnJpZGVPcHRpb25zLiRjb250ZXh0KTtcblxuICAgIHJldHVybiAkY29sbGFwc2libGVzLm1hcCgoaW5kZXgsIGVsZW1lbnQpID0+IHtcbiAgICAgICAgY29uc3QgJHRvZ2dsZSA9ICQoZWxlbWVudCk7XG4gICAgICAgIGNvbnN0IGluc3RhbmNlS2V5ID0gYCR7UExVR0lOX0tFWX1JbnN0YW5jZWA7XG4gICAgICAgIGNvbnN0IGNhY2hlZENvbGxhcHNpYmxlID0gJHRvZ2dsZS5kYXRhKGluc3RhbmNlS2V5KTtcblxuICAgICAgICBpZiAoY2FjaGVkQ29sbGFwc2libGUgaW5zdGFuY2VvZiBDb2xsYXBzaWJsZSkge1xuICAgICAgICAgICAgcmV0dXJuIGNhY2hlZENvbGxhcHNpYmxlO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgdGFyZ2V0SWQgPSBwcmVwZW5kSGFzaCgkdG9nZ2xlLmRhdGEoUExVR0lOX0tFWSkgfHxcbiAgICAgICAgICAgICR0b2dnbGUuZGF0YShgJHtQTFVHSU5fS0VZfVRhcmdldGApIHx8XG4gICAgICAgICAgICAkdG9nZ2xlLmF0dHIoJ2hyZWYnKSk7XG4gICAgICAgIGNvbnN0IG9wdGlvbnMgPSBfLmV4dGVuZChvcHRpb25zRnJvbURhdGEoJHRvZ2dsZSksIG92ZXJyaWRlT3B0aW9ucyk7XG4gICAgICAgIGNvbnN0IGNvbGxhcHNpYmxlID0gbmV3IENvbGxhcHNpYmxlKCR0b2dnbGUsICQodGFyZ2V0SWQsIG92ZXJyaWRlT3B0aW9ucy4kY29udGV4dCksIG9wdGlvbnMpO1xuXG4gICAgICAgICR0b2dnbGUuZGF0YShpbnN0YW5jZUtleSwgY29sbGFwc2libGUpO1xuXG4gICAgICAgIHJldHVybiBjb2xsYXBzaWJsZTtcbiAgICB9KS50b0FycmF5KCk7XG59XG4iLCIvKlxuICogUmVtZW1iZXIgdG8gdXBkYXRlIC9hc3NldHMvc2Nzcy9zZXR0aW5ncy9nbG9iYWwvc2NyZWVuc2l6ZXMvc2NyZWVuc2l6ZXMuc2Nzc1xuICogaWYgeW91IGRlY2lkZSB0byBjaGFuZ2UgYnJlYWtwb2ludCB2YWx1ZXNcbiAqL1xuY29uc3QgYnJlYWtwb2ludFNpemVzID0ge1xuICAgIGxhcmdlOiAxMjYxLFxuICAgIG1lZGl1bTogODAxLFxuICAgIHNtYWxsOiA1NTEsXG59O1xuXG4vKipcbiAqIENyZWF0ZSBNZWRpYVF1ZXJ5TGlzdCB1c2luZyBicmVha3BvaW50IG5hbWVcbiAqIEBwYXJhbSB7c3RyaW5nfSBicmVha3BvaW50TmFtZVxuICogQHJldHVybiB7TWVkaWFRdWVyeUxpc3R8bnVsbH1cbiAqL1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gbWVkaWFRdWVyeUxpc3RGYWN0b3J5KGJyZWFrcG9pbnROYW1lKSB7XG4gICAgaWYgKCFicmVha3BvaW50TmFtZSB8fCAhd2luZG93Lm1hdGNoTWVkaWEpIHtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgY29uc3QgYnJlYWtwb2ludCA9IGJyZWFrcG9pbnRTaXplc1ticmVha3BvaW50TmFtZV07XG4gICAgY29uc3QgbWVkaWFRdWVyeSA9IGAobWluLXdpZHRoOiAke2JyZWFrcG9pbnR9cHgpYDtcbiAgICBjb25zdCBtZWRpYVF1ZXJ5TGlzdCA9IHdpbmRvdy5tYXRjaE1lZGlhKG1lZGlhUXVlcnkpO1xuXG4gICAgcmV0dXJuIG1lZGlhUXVlcnlMaXN0O1xufVxuIiwiaW1wb3J0IFdpc2hsaXN0IGZyb20gJy4uL3dpc2hsaXN0JztcbmltcG9ydCB7IGluaXRSYWRpb09wdGlvbnMgfSBmcm9tICcuL2FyaWEnO1xuXG5jb25zdCBvcHRpb25zVHlwZXNNYXAgPSB7XG4gICAgSU5QVVRfRklMRTogJ2lucHV0LWZpbGUnLFxuICAgIElOUFVUX1RFWFQ6ICdpbnB1dC10ZXh0JyxcbiAgICBJTlBVVF9OVU1CRVI6ICdpbnB1dC1udW1iZXInLFxuICAgIElOUFVUX0NIRUNLQk9YOiAnaW5wdXQtY2hlY2tib3gnLFxuICAgIFRFWFRBUkVBOiAndGV4dGFyZWEnLFxuICAgIERBVEU6ICdkYXRlJyxcbiAgICBTRVRfU0VMRUNUOiAnc2V0LXNlbGVjdCcsXG4gICAgU0VUX1JFQ1RBTkdMRTogJ3NldC1yZWN0YW5nbGUnLFxuICAgIFNFVF9SQURJTzogJ3NldC1yYWRpbycsXG4gICAgU1dBVENIOiAnc3dhdGNoJyxcbiAgICBQUk9EVUNUX0xJU1Q6ICdwcm9kdWN0LWxpc3QnLFxufTtcblxuZXhwb3J0IGZ1bmN0aW9uIG9wdGlvbkNoYW5nZURlY29yYXRvcihhcmVEZWZhdWx0T3Rpb25zU2V0KSB7XG4gICAgcmV0dXJuIChlcnIsIHJlc3BvbnNlKSA9PiB7XG4gICAgICAgIGNvbnN0IGF0dHJpYnV0ZXNEYXRhID0gcmVzcG9uc2UuZGF0YSB8fCB7fTtcbiAgICAgICAgY29uc3QgYXR0cmlidXRlc0NvbnRlbnQgPSByZXNwb25zZS5jb250ZW50IHx8IHt9O1xuXG4gICAgICAgIHRoaXMudXBkYXRlUHJvZHVjdEF0dHJpYnV0ZXMoYXR0cmlidXRlc0RhdGEpO1xuICAgICAgICBpZiAoYXJlRGVmYXVsdE90aW9uc1NldCkge1xuICAgICAgICAgICAgdGhpcy51cGRhdGVWaWV3KGF0dHJpYnV0ZXNEYXRhLCBhdHRyaWJ1dGVzQ29udGVudCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnVwZGF0ZURlZmF1bHRBdHRyaWJ1dGVzRm9yT09TKGF0dHJpYnV0ZXNEYXRhKTtcbiAgICAgICAgfVxuICAgIH07XG59XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFByb2R1Y3REZXRhaWxzQmFzZSB7XG4gICAgY29uc3RydWN0b3IoJHNjb3BlLCBjb250ZXh0KSB7XG4gICAgICAgIHRoaXMuJHNjb3BlID0gJHNjb3BlO1xuICAgICAgICB0aGlzLmNvbnRleHQgPSBjb250ZXh0O1xuICAgICAgICB0aGlzLmluaXRSYWRpb0F0dHJpYnV0ZXMoKTtcbiAgICAgICAgV2lzaGxpc3QubG9hZCh0aGlzLmNvbnRleHQpO1xuICAgICAgICB0aGlzLmdldFRhYlJlcXVlc3RzKCk7XG5cbiAgICAgICAgJCgnW2RhdGEtcHJvZHVjdC1hdHRyaWJ1dGVdJykuZWFjaCgoX18sIHZhbHVlKSA9PiB7XG4gICAgICAgICAgICBjb25zdCB0eXBlID0gdmFsdWUuZ2V0QXR0cmlidXRlKCdkYXRhLXByb2R1Y3QtYXR0cmlidXRlJyk7XG5cbiAgICAgICAgICAgIHRoaXMuX21ha2VQcm9kdWN0VmFyaWFudEFjY2Vzc2libGUodmFsdWUsIHR5cGUpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBfbWFrZVByb2R1Y3RWYXJpYW50QWNjZXNzaWJsZSh2YXJpYW50RG9tTm9kZSwgdmFyaWFudFR5cGUpIHtcbiAgICAgICAgc3dpdGNoICh2YXJpYW50VHlwZSkge1xuICAgICAgICBjYXNlIG9wdGlvbnNUeXBlc01hcC5TRVRfUkFESU86XG4gICAgICAgIGNhc2Ugb3B0aW9uc1R5cGVzTWFwLlNXQVRDSDoge1xuICAgICAgICAgICAgaW5pdFJhZGlvT3B0aW9ucygkKHZhcmlhbnREb21Ob2RlKSwgJ1t0eXBlPXJhZGlvXScpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cblxuICAgICAgICBkZWZhdWx0OiBicmVhaztcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEFsbG93IHJhZGlvIGJ1dHRvbnMgdG8gZ2V0IGRlc2VsZWN0ZWRcbiAgICAgKi9cbiAgICBpbml0UmFkaW9BdHRyaWJ1dGVzKCkge1xuICAgICAgICAkKCdbZGF0YS1wcm9kdWN0LWF0dHJpYnV0ZV0gaW5wdXRbdHlwZT1cInJhZGlvXCJdJywgdGhpcy4kc2NvcGUpLmVhY2goKGksIHJhZGlvKSA9PiB7XG4gICAgICAgICAgICBjb25zdCAkcmFkaW8gPSAkKHJhZGlvKTtcblxuICAgICAgICAgICAgLy8gT25seSBiaW5kIHRvIGNsaWNrIG9uY2VcbiAgICAgICAgICAgIGlmICgkcmFkaW8uYXR0cignZGF0YS1zdGF0ZScpICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAkcmFkaW8ub24oJ2NsaWNrJywgKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBpZiAoJHJhZGlvLmRhdGEoJ3N0YXRlJykgPT09IHRydWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICRyYWRpby5wcm9wKCdjaGVja2VkJywgZmFsc2UpO1xuICAgICAgICAgICAgICAgICAgICAgICAgJHJhZGlvLmRhdGEoJ3N0YXRlJywgZmFsc2UpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAkcmFkaW8udHJpZ2dlcignY2hhbmdlJyk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAkcmFkaW8uZGF0YSgnc3RhdGUnLCB0cnVlKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaW5pdFJhZGlvQXR0cmlidXRlcygpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAkcmFkaW8uYXR0cignZGF0YS1zdGF0ZScsICRyYWRpby5wcm9wKCdjaGVja2VkJykpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBIaWRlIG9yIG1hcmsgYXMgdW5hdmFpbGFibGUgb3V0IG9mIHN0b2NrIGF0dHJpYnV0ZXMgaWYgZW5hYmxlZFxuICAgICAqIEBwYXJhbSAge09iamVjdH0gZGF0YSBQcm9kdWN0IGF0dHJpYnV0ZSBkYXRhXG4gICAgICovXG4gICAgdXBkYXRlUHJvZHVjdEF0dHJpYnV0ZXMoZGF0YSkge1xuICAgICAgICBjb25zdCBiZWhhdmlvciA9IGRhdGEub3V0X29mX3N0b2NrX2JlaGF2aW9yO1xuICAgICAgICBjb25zdCBpblN0b2NrSWRzID0gZGF0YS5pbl9zdG9ja19hdHRyaWJ1dGVzO1xuICAgICAgICBjb25zdCBvdXRPZlN0b2NrRGVmYXVsdE1lc3NhZ2UgPSB0aGlzLmNvbnRleHQub3V0T2ZTdG9ja0RlZmF1bHRNZXNzYWdlO1xuICAgICAgICBsZXQgb3V0T2ZTdG9ja01lc3NhZ2UgPSBkYXRhLm91dF9vZl9zdG9ja19tZXNzYWdlO1xuXG4gICAgICAgIGlmIChiZWhhdmlvciAhPT0gJ2hpZGVfb3B0aW9uJyAmJiBiZWhhdmlvciAhPT0gJ2xhYmVsX29wdGlvbicpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChvdXRPZlN0b2NrTWVzc2FnZSkge1xuICAgICAgICAgICAgb3V0T2ZTdG9ja01lc3NhZ2UgPSBgICgke291dE9mU3RvY2tNZXNzYWdlfSlgO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgb3V0T2ZTdG9ja01lc3NhZ2UgPSBgICgke291dE9mU3RvY2tEZWZhdWx0TWVzc2FnZX0pYDtcbiAgICAgICAgfVxuXG4gICAgICAgICQoJ1tkYXRhLXByb2R1Y3QtYXR0cmlidXRlLXZhbHVlXScsIHRoaXMuJHNjb3BlKS5lYWNoKChpLCBhdHRyaWJ1dGUpID0+IHtcbiAgICAgICAgICAgIGNvbnN0ICRhdHRyaWJ1dGUgPSAkKGF0dHJpYnV0ZSk7XG4gICAgICAgICAgICBjb25zdCBhdHRySWQgPSBwYXJzZUludCgkYXR0cmlidXRlLmRhdGEoJ3Byb2R1Y3RBdHRyaWJ1dGVWYWx1ZScpLCAxMCk7XG5cblxuICAgICAgICAgICAgaWYgKGluU3RvY2tJZHMuaW5kZXhPZihhdHRySWQpICE9PSAtMSkge1xuICAgICAgICAgICAgICAgIHRoaXMuZW5hYmxlQXR0cmlidXRlKCRhdHRyaWJ1dGUsIGJlaGF2aW9yLCBvdXRPZlN0b2NrTWVzc2FnZSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuZGlzYWJsZUF0dHJpYnV0ZSgkYXR0cmlidXRlLCBiZWhhdmlvciwgb3V0T2ZTdG9ja01lc3NhZ2UpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDaGVjayBmb3IgZnJhZ21lbnQgaWRlbnRpZmllciBpbiBVUkwgcmVxdWVzdGluZyBhIHNwZWNpZmljIHRhYlxuICAgICAqL1xuICAgIGdldFRhYlJlcXVlc3RzKCkge1xuICAgICAgICBpZiAod2luZG93LmxvY2F0aW9uLmhhc2ggJiYgd2luZG93LmxvY2F0aW9uLmhhc2guaW5kZXhPZignI3RhYi0nKSA9PT0gMCkge1xuICAgICAgICAgICAgY29uc3QgJGFjdGl2ZVRhYiA9ICQoJy50YWJzJykuaGFzKGBbaHJlZj0nJHt3aW5kb3cubG9jYXRpb24uaGFzaH0nXWApO1xuICAgICAgICAgICAgY29uc3QgJHRhYkNvbnRlbnQgPSAkKGAke3dpbmRvdy5sb2NhdGlvbi5oYXNofWApO1xuXG4gICAgICAgICAgICBpZiAoJGFjdGl2ZVRhYi5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgJGFjdGl2ZVRhYi5maW5kKCcudGFiJylcbiAgICAgICAgICAgICAgICAgICAgLnJlbW92ZUNsYXNzKCdpcy1hY3RpdmUnKVxuICAgICAgICAgICAgICAgICAgICAuaGFzKGBbaHJlZj0nJHt3aW5kb3cubG9jYXRpb24uaGFzaH0nXWApXG4gICAgICAgICAgICAgICAgICAgIC5hZGRDbGFzcygnaXMtYWN0aXZlJyk7XG5cbiAgICAgICAgICAgICAgICAkdGFiQ29udGVudC5hZGRDbGFzcygnaXMtYWN0aXZlJylcbiAgICAgICAgICAgICAgICAgICAgLnNpYmxpbmdzKClcbiAgICAgICAgICAgICAgICAgICAgLnJlbW92ZUNsYXNzKCdpcy1hY3RpdmUnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFNpbmNlICRwcm9kdWN0VmlldyBjYW4gYmUgZHluYW1pY2FsbHkgaW5zZXJ0ZWQgdXNpbmcgcmVuZGVyX3dpdGgsXG4gICAgICogV2UgaGF2ZSB0byByZXRyaWV2ZSB0aGUgcmVzcGVjdGl2ZSBlbGVtZW50c1xuICAgICAqXG4gICAgICogQHBhcmFtICRzY29wZVxuICAgICAqL1xuICAgIGdldFZpZXdNb2RlbCgkc2NvcGUpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICRwcmljZVdpdGhUYXg6ICQoJ1tkYXRhLXByb2R1Y3QtcHJpY2Utd2l0aC10YXhdJywgJHNjb3BlKSxcbiAgICAgICAgICAgICRwcmljZVdpdGhvdXRUYXg6ICQoJ1tkYXRhLXByb2R1Y3QtcHJpY2Utd2l0aG91dC10YXhdJywgJHNjb3BlKSxcbiAgICAgICAgICAgIHJycFdpdGhUYXg6IHtcbiAgICAgICAgICAgICAgICAkZGl2OiAkKCcucnJwLXByaWNlLS13aXRoVGF4JywgJHNjb3BlKSxcbiAgICAgICAgICAgICAgICAkc3BhbjogJCgnW2RhdGEtcHJvZHVjdC1ycnAtd2l0aC10YXhdJywgJHNjb3BlKSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBycnBXaXRob3V0VGF4OiB7XG4gICAgICAgICAgICAgICAgJGRpdjogJCgnLnJycC1wcmljZS0td2l0aG91dFRheCcsICRzY29wZSksXG4gICAgICAgICAgICAgICAgJHNwYW46ICQoJ1tkYXRhLXByb2R1Y3QtcnJwLXByaWNlLXdpdGhvdXQtdGF4XScsICRzY29wZSksXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgbm9uU2FsZVdpdGhUYXg6IHtcbiAgICAgICAgICAgICAgICAkZGl2OiAkKCcubm9uLXNhbGUtcHJpY2UtLXdpdGhUYXgnLCAkc2NvcGUpLFxuICAgICAgICAgICAgICAgICRzcGFuOiAkKCdbZGF0YS1wcm9kdWN0LW5vbi1zYWxlLXByaWNlLXdpdGgtdGF4XScsICRzY29wZSksXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgbm9uU2FsZVdpdGhvdXRUYXg6IHtcbiAgICAgICAgICAgICAgICAkZGl2OiAkKCcubm9uLXNhbGUtcHJpY2UtLXdpdGhvdXRUYXgnLCAkc2NvcGUpLFxuICAgICAgICAgICAgICAgICRzcGFuOiAkKCdbZGF0YS1wcm9kdWN0LW5vbi1zYWxlLXByaWNlLXdpdGhvdXQtdGF4XScsICRzY29wZSksXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgcHJpY2VTYXZlZDoge1xuICAgICAgICAgICAgICAgICRkaXY6ICQoJy5wcmljZS1zZWN0aW9uLS1zYXZpbmcnLCAkc2NvcGUpLFxuICAgICAgICAgICAgICAgICRzcGFuOiAkKCdbZGF0YS1wcm9kdWN0LXByaWNlLXNhdmVkXScsICRzY29wZSksXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgcHJpY2VOb3dMYWJlbDoge1xuICAgICAgICAgICAgICAgICRzcGFuOiAkKCcucHJpY2Utbm93LWxhYmVsJywgJHNjb3BlKSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBwcmljZUxhYmVsOiB7XG4gICAgICAgICAgICAgICAgJHNwYW46ICQoJy5wcmljZS1sYWJlbCcsICRzY29wZSksXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgJHdlaWdodDogJCgnLnByb2R1Y3RWaWV3LWluZm8gW2RhdGEtcHJvZHVjdC13ZWlnaHRdJywgJHNjb3BlKSxcbiAgICAgICAgICAgICRpbmNyZW1lbnRzOiAkKCcuZm9ybS1maWVsZC0taW5jcmVtZW50cyA6aW5wdXQnLCAkc2NvcGUpLFxuICAgICAgICAgICAgJGFkZFRvQ2FydDogJCgnI2Zvcm0tYWN0aW9uLWFkZFRvQ2FydCcsICRzY29wZSksXG4gICAgICAgICAgICAkd2lzaGxpc3RWYXJpYXRpb246ICQoJ1tkYXRhLXdpc2hsaXN0LWFkZF0gW25hbWU9XCJ2YXJpYXRpb25faWRcIl0nLCAkc2NvcGUpLFxuICAgICAgICAgICAgc3RvY2s6IHtcbiAgICAgICAgICAgICAgICAkY29udGFpbmVyOiAkKCcuZm9ybS1maWVsZC0tc3RvY2snLCAkc2NvcGUpLFxuICAgICAgICAgICAgICAgICRpbnB1dDogJCgnW2RhdGEtcHJvZHVjdC1zdG9ja10nLCAkc2NvcGUpLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHNrdToge1xuICAgICAgICAgICAgICAgICRsYWJlbDogJCgnZHQuc2t1LWxhYmVsJywgJHNjb3BlKSxcbiAgICAgICAgICAgICAgICAkdmFsdWU6ICQoJ1tkYXRhLXByb2R1Y3Qtc2t1XScsICRzY29wZSksXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgdXBjOiB7XG4gICAgICAgICAgICAgICAgJGxhYmVsOiAkKCdkdC51cGMtbGFiZWwnLCAkc2NvcGUpLFxuICAgICAgICAgICAgICAgICR2YWx1ZTogJCgnW2RhdGEtcHJvZHVjdC11cGNdJywgJHNjb3BlKSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBxdWFudGl0eToge1xuICAgICAgICAgICAgICAgICR0ZXh0OiAkKCcuaW5jcmVtZW50VG90YWwnLCAkc2NvcGUpLFxuICAgICAgICAgICAgICAgICRpbnB1dDogJCgnW25hbWU9cXR5XFxcXFtcXFxcXV0nLCAkc2NvcGUpLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICRidWxrUHJpY2luZzogJCgnLnByb2R1Y3RWaWV3LWluZm8tYnVsa1ByaWNpbmcnLCAkc2NvcGUpLFxuICAgICAgICAgICAgJHdhbGxldEJ1dHRvbnM6ICQoJ1tkYXRhLWFkZC10by1jYXJ0LXdhbGxldC1idXR0b25zXScsICRzY29wZSksXG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogSGlkZSB0aGUgcHJpY2luZyBlbGVtZW50cyB0aGF0IHdpbGwgc2hvdyB1cCBvbmx5IHdoZW4gdGhlIHByaWNlIGV4aXN0cyBpbiBBUElcbiAgICAgKiBAcGFyYW0gdmlld01vZGVsXG4gICAgICovXG4gICAgY2xlYXJQcmljaW5nTm90Rm91bmQodmlld01vZGVsKSB7XG4gICAgICAgIHZpZXdNb2RlbC5ycnBXaXRoVGF4LiRkaXYuaGlkZSgpO1xuICAgICAgICB2aWV3TW9kZWwucnJwV2l0aG91dFRheC4kZGl2LmhpZGUoKTtcbiAgICAgICAgdmlld01vZGVsLm5vblNhbGVXaXRoVGF4LiRkaXYuaGlkZSgpO1xuICAgICAgICB2aWV3TW9kZWwubm9uU2FsZVdpdGhvdXRUYXguJGRpdi5oaWRlKCk7XG4gICAgICAgIHZpZXdNb2RlbC5wcmljZVNhdmVkLiRkaXYuaGlkZSgpO1xuICAgICAgICB2aWV3TW9kZWwucHJpY2VOb3dMYWJlbC4kc3Bhbi5oaWRlKCk7XG4gICAgICAgIHZpZXdNb2RlbC5wcmljZUxhYmVsLiRzcGFuLmhpZGUoKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBVcGRhdGUgdGhlIHZpZXcgb2YgcHJpY2UsIG1lc3NhZ2VzLCBTS1UgYW5kIHN0b2NrIG9wdGlvbnMgd2hlbiBhIHByb2R1Y3Qgb3B0aW9uIGNoYW5nZXNcbiAgICAgKiBAcGFyYW0gIHtPYmplY3R9IGRhdGEgUHJvZHVjdCBhdHRyaWJ1dGUgZGF0YVxuICAgICAqL1xuICAgIHVwZGF0ZVZpZXcoZGF0YSwgY29udGVudCA9IG51bGwpIHtcbiAgICAgICAgY29uc3Qgdmlld01vZGVsID0gdGhpcy5nZXRWaWV3TW9kZWwodGhpcy4kc2NvcGUpO1xuXG4gICAgICAgIHRoaXMuc2hvd01lc3NhZ2VCb3goZGF0YS5zdG9ja19tZXNzYWdlIHx8IGRhdGEucHVyY2hhc2luZ19tZXNzYWdlKTtcblxuICAgICAgICBpZiAoZGF0YS5wcmljZSBpbnN0YW5jZW9mIE9iamVjdCkge1xuICAgICAgICAgICAgdGhpcy51cGRhdGVQcmljZVZpZXcodmlld01vZGVsLCBkYXRhLnByaWNlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChkYXRhLndlaWdodCBpbnN0YW5jZW9mIE9iamVjdCkge1xuICAgICAgICAgICAgdmlld01vZGVsLiR3ZWlnaHQuaHRtbChkYXRhLndlaWdodC5mb3JtYXR0ZWQpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gU2V0IHZhcmlhdGlvbl9pZCBpZiBpdCBleGlzdHMgZm9yIGFkZGluZyB0byB3aXNobGlzdFxuICAgICAgICBpZiAoZGF0YS52YXJpYW50SWQpIHtcbiAgICAgICAgICAgIHZpZXdNb2RlbC4kd2lzaGxpc3RWYXJpYXRpb24udmFsKGRhdGEudmFyaWFudElkKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIElmIFNLVSBpcyBhdmFpbGFibGVcbiAgICAgICAgaWYgKGRhdGEuc2t1KSB7XG4gICAgICAgICAgICB2aWV3TW9kZWwuc2t1LiR2YWx1ZS50ZXh0KGRhdGEuc2t1KTtcbiAgICAgICAgICAgIHZpZXdNb2RlbC5za3UuJGxhYmVsLnNob3coKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHZpZXdNb2RlbC5za3UuJGxhYmVsLmhpZGUoKTtcbiAgICAgICAgICAgIHZpZXdNb2RlbC5za3UuJHZhbHVlLnRleHQoJycpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gSWYgVVBDIGlzIGF2YWlsYWJsZVxuICAgICAgICBpZiAoZGF0YS51cGMpIHtcbiAgICAgICAgICAgIHZpZXdNb2RlbC51cGMuJHZhbHVlLnRleHQoZGF0YS51cGMpO1xuICAgICAgICAgICAgdmlld01vZGVsLnVwYy4kbGFiZWwuc2hvdygpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdmlld01vZGVsLnVwYy4kbGFiZWwuaGlkZSgpO1xuICAgICAgICAgICAgdmlld01vZGVsLnVwYy4kdmFsdWUudGV4dCgnJyk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBpZiBzdG9jayB2aWV3IGlzIG9uIChDUCBzZXR0aW5ncylcbiAgICAgICAgaWYgKHZpZXdNb2RlbC5zdG9jay4kY29udGFpbmVyLmxlbmd0aCAmJiB0eXBlb2YgZGF0YS5zdG9jayA9PT0gJ251bWJlcicpIHtcbiAgICAgICAgICAgIC8vIGlmIHRoZSBzdG9jayBjb250YWluZXIgaXMgaGlkZGVuLCBzaG93XG4gICAgICAgICAgICB2aWV3TW9kZWwuc3RvY2suJGNvbnRhaW5lci5yZW1vdmVDbGFzcygndS1oaWRkZW5WaXN1YWxseScpO1xuXG4gICAgICAgICAgICB2aWV3TW9kZWwuc3RvY2suJGlucHV0LnRleHQoZGF0YS5zdG9jayk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB2aWV3TW9kZWwuc3RvY2suJGNvbnRhaW5lci5hZGRDbGFzcygndS1oaWRkZW5WaXN1YWxseScpO1xuICAgICAgICAgICAgdmlld01vZGVsLnN0b2NrLiRpbnB1dC50ZXh0KGRhdGEuc3RvY2spO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy51cGRhdGVEZWZhdWx0QXR0cmlidXRlc0Zvck9PUyhkYXRhKTtcbiAgICAgICAgdGhpcy51cGRhdGVXYWxsZXRCdXR0b25zVmlldyhkYXRhKTtcblxuICAgICAgICAvLyBJZiBCdWxrIFByaWNpbmcgcmVuZGVyZWQgSFRNTCBpcyBhdmFpbGFibGVcbiAgICAgICAgaWYgKGRhdGEuYnVsa19kaXNjb3VudF9yYXRlcyAmJiBjb250ZW50KSB7XG4gICAgICAgICAgICB2aWV3TW9kZWwuJGJ1bGtQcmljaW5nLmh0bWwoY29udGVudCk7XG4gICAgICAgIH0gZWxzZSBpZiAodHlwZW9mIChkYXRhLmJ1bGtfZGlzY291bnRfcmF0ZXMpICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgdmlld01vZGVsLiRidWxrUHJpY2luZy5odG1sKCcnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGFkZFRvQ2FydFdyYXBwZXIgPSAkKCcjYWRkLXRvLWNhcnQtd3JhcHBlcicpO1xuXG4gICAgICAgIGlmIChhZGRUb0NhcnRXcmFwcGVyLmlzKCc6aGlkZGVuJykgJiYgZGF0YS5wdXJjaGFzYWJsZSkge1xuICAgICAgICAgICAgYWRkVG9DYXJ0V3JhcHBlci5zaG93KCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBVcGRhdGUgdGhlIHZpZXcgb2YgcHJpY2UsIG1lc3NhZ2VzLCBTS1UgYW5kIHN0b2NrIG9wdGlvbnMgd2hlbiBhIHByb2R1Y3Qgb3B0aW9uIGNoYW5nZXNcbiAgICAgKiBAcGFyYW0gIHtPYmplY3R9IGRhdGEgUHJvZHVjdCBhdHRyaWJ1dGUgZGF0YVxuICAgICAqL1xuICAgIHVwZGF0ZVByaWNlVmlldyh2aWV3TW9kZWwsIHByaWNlKSB7XG4gICAgICAgIHRoaXMuY2xlYXJQcmljaW5nTm90Rm91bmQodmlld01vZGVsKTtcblxuICAgICAgICBpZiAocHJpY2Uud2l0aF90YXgpIHtcbiAgICAgICAgICAgIGNvbnN0IHVwZGF0ZWRQcmljZSA9IHByaWNlLnByaWNlX3JhbmdlID9cbiAgICAgICAgICAgICAgICBgJHtwcmljZS5wcmljZV9yYW5nZS5taW4ud2l0aF90YXguZm9ybWF0dGVkfSAtICR7cHJpY2UucHJpY2VfcmFuZ2UubWF4LndpdGhfdGF4LmZvcm1hdHRlZH1gXG4gICAgICAgICAgICAgICAgOiBwcmljZS53aXRoX3RheC5mb3JtYXR0ZWQ7XG4gICAgICAgICAgICB2aWV3TW9kZWwucHJpY2VMYWJlbC4kc3Bhbi5zaG93KCk7XG4gICAgICAgICAgICB2aWV3TW9kZWwuJHByaWNlV2l0aFRheC5odG1sKHVwZGF0ZWRQcmljZSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAocHJpY2Uud2l0aG91dF90YXgpIHtcbiAgICAgICAgICAgIGNvbnN0IHVwZGF0ZWRQcmljZSA9IHByaWNlLnByaWNlX3JhbmdlID9cbiAgICAgICAgICAgICAgICBgJHtwcmljZS5wcmljZV9yYW5nZS5taW4ud2l0aG91dF90YXguZm9ybWF0dGVkfSAtICR7cHJpY2UucHJpY2VfcmFuZ2UubWF4LndpdGhvdXRfdGF4LmZvcm1hdHRlZH1gXG4gICAgICAgICAgICAgICAgOiBwcmljZS53aXRob3V0X3RheC5mb3JtYXR0ZWQ7XG4gICAgICAgICAgICB2aWV3TW9kZWwucHJpY2VMYWJlbC4kc3Bhbi5zaG93KCk7XG4gICAgICAgICAgICB2aWV3TW9kZWwuJHByaWNlV2l0aG91dFRheC5odG1sKHVwZGF0ZWRQcmljZSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAocHJpY2UucnJwX3dpdGhfdGF4KSB7XG4gICAgICAgICAgICB2aWV3TW9kZWwucnJwV2l0aFRheC4kZGl2LnNob3coKTtcbiAgICAgICAgICAgIHZpZXdNb2RlbC5ycnBXaXRoVGF4LiRzcGFuLmh0bWwocHJpY2UucnJwX3dpdGhfdGF4LmZvcm1hdHRlZCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAocHJpY2UucnJwX3dpdGhvdXRfdGF4KSB7XG4gICAgICAgICAgICB2aWV3TW9kZWwucnJwV2l0aG91dFRheC4kZGl2LnNob3coKTtcbiAgICAgICAgICAgIHZpZXdNb2RlbC5ycnBXaXRob3V0VGF4LiRzcGFuLmh0bWwocHJpY2UucnJwX3dpdGhvdXRfdGF4LmZvcm1hdHRlZCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAocHJpY2Uuc2F2ZWQpIHtcbiAgICAgICAgICAgIHZpZXdNb2RlbC5wcmljZVNhdmVkLiRkaXYuc2hvdygpO1xuICAgICAgICAgICAgdmlld01vZGVsLnByaWNlU2F2ZWQuJHNwYW4uaHRtbChwcmljZS5zYXZlZC5mb3JtYXR0ZWQpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHByaWNlLm5vbl9zYWxlX3ByaWNlX3dpdGhfdGF4KSB7XG4gICAgICAgICAgICB2aWV3TW9kZWwucHJpY2VMYWJlbC4kc3Bhbi5oaWRlKCk7XG4gICAgICAgICAgICB2aWV3TW9kZWwubm9uU2FsZVdpdGhUYXguJGRpdi5zaG93KCk7XG4gICAgICAgICAgICB2aWV3TW9kZWwucHJpY2VOb3dMYWJlbC4kc3Bhbi5zaG93KCk7XG4gICAgICAgICAgICB2aWV3TW9kZWwubm9uU2FsZVdpdGhUYXguJHNwYW4uaHRtbChwcmljZS5ub25fc2FsZV9wcmljZV93aXRoX3RheC5mb3JtYXR0ZWQpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHByaWNlLm5vbl9zYWxlX3ByaWNlX3dpdGhvdXRfdGF4KSB7XG4gICAgICAgICAgICB2aWV3TW9kZWwucHJpY2VMYWJlbC4kc3Bhbi5oaWRlKCk7XG4gICAgICAgICAgICB2aWV3TW9kZWwubm9uU2FsZVdpdGhvdXRUYXguJGRpdi5zaG93KCk7XG4gICAgICAgICAgICB2aWV3TW9kZWwucHJpY2VOb3dMYWJlbC4kc3Bhbi5zaG93KCk7XG4gICAgICAgICAgICB2aWV3TW9kZWwubm9uU2FsZVdpdGhvdXRUYXguJHNwYW4uaHRtbChwcmljZS5ub25fc2FsZV9wcmljZV93aXRob3V0X3RheC5mb3JtYXR0ZWQpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogU2hvdyBhbiBtZXNzYWdlIGJveCBpZiBhIG1lc3NhZ2UgaXMgcGFzc2VkXG4gICAgICogSGlkZSB0aGUgYm94IGlmIHRoZSBtZXNzYWdlIGlzIGVtcHR5XG4gICAgICogQHBhcmFtICB7U3RyaW5nfSBtZXNzYWdlXG4gICAgICovXG4gICAgc2hvd01lc3NhZ2VCb3gobWVzc2FnZSkge1xuICAgICAgICBjb25zdCAkbWVzc2FnZUJveCA9ICQoJy5wcm9kdWN0QXR0cmlidXRlcy1tZXNzYWdlJyk7XG5cbiAgICAgICAgaWYgKG1lc3NhZ2UpIHtcbiAgICAgICAgICAgICQoJy5hbGVydEJveC1tZXNzYWdlJywgJG1lc3NhZ2VCb3gpLnRleHQobWVzc2FnZSk7XG4gICAgICAgICAgICAkbWVzc2FnZUJveC5zaG93KCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAkbWVzc2FnZUJveC5oaWRlKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB1cGRhdGVEZWZhdWx0QXR0cmlidXRlc0Zvck9PUyhkYXRhKSB7XG4gICAgICAgIGNvbnN0IHZpZXdNb2RlbCA9IHRoaXMuZ2V0Vmlld01vZGVsKHRoaXMuJHNjb3BlKTtcbiAgICAgICAgaWYgKCFkYXRhLnB1cmNoYXNhYmxlIHx8ICFkYXRhLmluc3RvY2spIHtcbiAgICAgICAgICAgIHZpZXdNb2RlbC4kYWRkVG9DYXJ0LnByb3AoJ2Rpc2FibGVkJywgdHJ1ZSk7XG4gICAgICAgICAgICB2aWV3TW9kZWwuJGluY3JlbWVudHMucHJvcCgnZGlzYWJsZWQnLCB0cnVlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHZpZXdNb2RlbC4kYWRkVG9DYXJ0LnByb3AoJ2Rpc2FibGVkJywgZmFsc2UpO1xuICAgICAgICAgICAgdmlld01vZGVsLiRpbmNyZW1lbnRzLnByb3AoJ2Rpc2FibGVkJywgZmFsc2UpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgdXBkYXRlV2FsbGV0QnV0dG9uc1ZpZXcoZGF0YSkge1xuICAgICAgICB0aGlzLnRvZ2dsZVdhbGxldEJ1dHRvbnNWaXNpYmlsaXR5KGRhdGEucHVyY2hhc2FibGUgJiYgZGF0YS5pbnN0b2NrKTtcbiAgICB9XG5cbiAgICB0b2dnbGVXYWxsZXRCdXR0b25zVmlzaWJpbGl0eShzaG91bGRTaG93KSB7XG4gICAgICAgIGNvbnN0IHZpZXdNb2RlbCA9IHRoaXMuZ2V0Vmlld01vZGVsKHRoaXMuJHNjb3BlKTtcblxuICAgICAgICBpZiAoc2hvdWxkU2hvdykge1xuICAgICAgICAgICAgdmlld01vZGVsLiR3YWxsZXRCdXR0b25zLnNob3coKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHZpZXdNb2RlbC4kd2FsbGV0QnV0dG9ucy5oaWRlKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBlbmFibGVBdHRyaWJ1dGUoJGF0dHJpYnV0ZSwgYmVoYXZpb3IsIG91dE9mU3RvY2tNZXNzYWdlKSB7XG4gICAgICAgIGlmICh0aGlzLmdldEF0dHJpYnV0ZVR5cGUoJGF0dHJpYnV0ZSkgPT09ICdzZXQtc2VsZWN0Jykge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZW5hYmxlU2VsZWN0T3B0aW9uQXR0cmlidXRlKCRhdHRyaWJ1dGUsIGJlaGF2aW9yLCBvdXRPZlN0b2NrTWVzc2FnZSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoYmVoYXZpb3IgPT09ICdoaWRlX29wdGlvbicpIHtcbiAgICAgICAgICAgICRhdHRyaWJ1dGUuc2hvdygpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgJGF0dHJpYnV0ZS5yZW1vdmVDbGFzcygndW5hdmFpbGFibGUnKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGRpc2FibGVBdHRyaWJ1dGUoJGF0dHJpYnV0ZSwgYmVoYXZpb3IsIG91dE9mU3RvY2tNZXNzYWdlKSB7XG4gICAgICAgIGlmICh0aGlzLmdldEF0dHJpYnV0ZVR5cGUoJGF0dHJpYnV0ZSkgPT09ICdzZXQtc2VsZWN0Jykge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZGlzYWJsZVNlbGVjdE9wdGlvbkF0dHJpYnV0ZSgkYXR0cmlidXRlLCBiZWhhdmlvciwgb3V0T2ZTdG9ja01lc3NhZ2UpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGJlaGF2aW9yID09PSAnaGlkZV9vcHRpb24nKSB7XG4gICAgICAgICAgICAkYXR0cmlidXRlLmhpZGUoMCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAkYXR0cmlidXRlLmFkZENsYXNzKCd1bmF2YWlsYWJsZScpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZ2V0QXR0cmlidXRlVHlwZSgkYXR0cmlidXRlKSB7XG4gICAgICAgIGNvbnN0ICRwYXJlbnQgPSAkYXR0cmlidXRlLmNsb3Nlc3QoJ1tkYXRhLXByb2R1Y3QtYXR0cmlidXRlXScpO1xuXG4gICAgICAgIHJldHVybiAkcGFyZW50ID8gJHBhcmVudC5kYXRhKCdwcm9kdWN0QXR0cmlidXRlJykgOiBudWxsO1xuICAgIH1cblxuICAgIGRpc2FibGVTZWxlY3RPcHRpb25BdHRyaWJ1dGUoJGF0dHJpYnV0ZSwgYmVoYXZpb3IsIG91dE9mU3RvY2tNZXNzYWdlKSB7XG4gICAgICAgIGNvbnN0ICRzZWxlY3QgPSAkYXR0cmlidXRlLnBhcmVudCgpO1xuXG4gICAgICAgIGlmIChiZWhhdmlvciA9PT0gJ2hpZGVfb3B0aW9uJykge1xuICAgICAgICAgICAgJGF0dHJpYnV0ZS50b2dnbGVPcHRpb24oZmFsc2UpO1xuICAgICAgICAgICAgLy8gSWYgdGhlIGF0dHJpYnV0ZSBpcyB0aGUgc2VsZWN0ZWQgb3B0aW9uIGluIGEgc2VsZWN0IGRyb3Bkb3duLCBzZWxlY3QgdGhlIGZpcnN0IG9wdGlvbiAoTUVSQy02MzkpXG4gICAgICAgICAgICBpZiAoJHNlbGVjdC52YWwoKSA9PT0gJGF0dHJpYnV0ZS5hdHRyKCd2YWx1ZScpKSB7XG4gICAgICAgICAgICAgICAgJHNlbGVjdFswXS5zZWxlY3RlZEluZGV4ID0gMDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICRhdHRyaWJ1dGUuaHRtbCgkYXR0cmlidXRlLmh0bWwoKS5yZXBsYWNlKG91dE9mU3RvY2tNZXNzYWdlLCAnJykgKyBvdXRPZlN0b2NrTWVzc2FnZSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBlbmFibGVTZWxlY3RPcHRpb25BdHRyaWJ1dGUoJGF0dHJpYnV0ZSwgYmVoYXZpb3IsIG91dE9mU3RvY2tNZXNzYWdlKSB7XG4gICAgICAgIGlmIChiZWhhdmlvciA9PT0gJ2hpZGVfb3B0aW9uJykge1xuICAgICAgICAgICAgJGF0dHJpYnV0ZS50b2dnbGVPcHRpb24odHJ1ZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAkYXR0cmlidXRlLmh0bWwoJGF0dHJpYnV0ZS5odG1sKCkucmVwbGFjZShvdXRPZlN0b2NrTWVzc2FnZSwgJycpKTtcbiAgICAgICAgfVxuICAgIH1cbn1cbiIsImV4cG9ydCBjb25zdCBpc0Jyb3dzZXJJRSA9ICEhZG9jdW1lbnQuZG9jdW1lbnRNb2RlO1xuXG5leHBvcnQgY29uc3QgY29udmVydEludG9BcnJheSA9IGNvbGxlY3Rpb24gPT4gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoY29sbGVjdGlvbik7XG4iLCJjb25zdCBjaGFuZ2VXaXNobGlzdFBhZ2luYXRpb25MaW5rcyA9ICh3aXNobGlzdFVybCwgLi4ucGFnaW5hdGlvbkl0ZW1zKSA9PiAkLmVhY2gocGFnaW5hdGlvbkl0ZW1zLCAoXywgJGl0ZW0pID0+IHtcbiAgICBjb25zdCBwYWdpbmF0aW9uTGluayA9ICRpdGVtLmNoaWxkcmVuKCcucGFnaW5hdGlvbi1saW5rJyk7XG5cbiAgICBpZiAoJGl0ZW0ubGVuZ3RoICYmICFwYWdpbmF0aW9uTGluay5hdHRyKCdocmVmJykuaW5jbHVkZXMoJ3BhZ2U9JykpIHtcbiAgICAgICAgY29uc3QgcGFnZU51bWJlciA9IHBhZ2luYXRpb25MaW5rLmF0dHIoJ2hyZWYnKTtcbiAgICAgICAgcGFnaW5hdGlvbkxpbmsuYXR0cignaHJlZicsIGAke3dpc2hsaXN0VXJsfXBhZ2U9JHtwYWdlTnVtYmVyfWApO1xuICAgIH1cbn0pO1xuXG4vKipcbiAqIGhlbHBzIHRvIHdpdGhkcmF3IGRpZmZlcmVuY2VzIGluIHN0cnVjdHVyZXMgYXJvdW5kIHRoZSBzdGVuY2lsIHJlc291cmNlIHBhZ2luYXRpb25cbiAqL1xuZXhwb3J0IGNvbnN0IHdpc2hsaXN0UGFnaW5hdG9ySGVscGVyID0gKCkgPT4ge1xuICAgIGNvbnN0ICRwYWdpbmF0aW9uTGlzdCA9ICQoJy5wYWdpbmF0aW9uLWxpc3QnKTtcblxuICAgIGlmICghJHBhZ2luYXRpb25MaXN0Lmxlbmd0aCkgcmV0dXJuO1xuXG4gICAgY29uc3QgJG5leHRJdGVtID0gJCgnLnBhZ2luYXRpb24taXRlbS0tbmV4dCcsICRwYWdpbmF0aW9uTGlzdCk7XG4gICAgY29uc3QgJHByZXZJdGVtID0gJCgnLnBhZ2luYXRpb24taXRlbS0tcHJldmlvdXMnLCAkcGFnaW5hdGlvbkxpc3QpO1xuICAgIGNvbnN0IGN1cnJlbnRIcmVmID0gJCgnW2RhdGEtcGFnaW5hdGlvbi1jdXJyZW50LXBhZ2UtbGlua10nKS5hdHRyKCdocmVmJyk7XG4gICAgY29uc3QgcGFydGlhbFBhZ2luYXRpb25VcmwgPSBjdXJyZW50SHJlZi5zcGxpdCgncGFnZT0nKS5zaGlmdCgpO1xuXG4gICAgY2hhbmdlV2lzaGxpc3RQYWdpbmF0aW9uTGlua3MocGFydGlhbFBhZ2luYXRpb25VcmwsICRwcmV2SXRlbSwgJG5leHRJdGVtKTtcbn07XG4iLCJpbXBvcnQgJ2ZvdW5kYXRpb24tc2l0ZXMvanMvZm91bmRhdGlvbi9mb3VuZGF0aW9uJztcbmltcG9ydCAnZm91bmRhdGlvbi1zaXRlcy9qcy9mb3VuZGF0aW9uL2ZvdW5kYXRpb24ucmV2ZWFsJztcbmltcG9ydCBub2QgZnJvbSAnLi9jb21tb24vbm9kJztcbmltcG9ydCBQYWdlTWFuYWdlciBmcm9tICcuL3BhZ2UtbWFuYWdlcic7XG5pbXBvcnQgeyB3aXNobGlzdFBhZ2luYXRvckhlbHBlciB9IGZyb20gJy4vY29tbW9uL3V0aWxzL3BhZ2luYXRpb24tdXRpbHMnO1xuaW1wb3J0IHsgYW5ub3VuY2VJbnB1dEVycm9yTWVzc2FnZSB9IGZyb20gJy4vY29tbW9uL3V0aWxzL2Zvcm0tdXRpbHMnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBXaXNoTGlzdCBleHRlbmRzIFBhZ2VNYW5hZ2VyIHtcbiAgICBjb25zdHJ1Y3Rvcihjb250ZXh0KSB7XG4gICAgICAgIHN1cGVyKGNvbnRleHQpO1xuXG4gICAgICAgIHRoaXMub3B0aW9ucyA9IHtcbiAgICAgICAgICAgIHRlbXBsYXRlOiAnYWNjb3VudC9hZGQtd2lzaGxpc3QnLFxuICAgICAgICB9O1xuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENyZWF0ZXMgYSBjb25maXJtIGJveCBiZWZvcmUgZGVsZXRpbmcgYWxsIHdpc2ggbGlzdHNcbiAgICAgKi9cbiAgICB3aXNobGlzdERlbGV0ZUNvbmZpcm0oKSB7XG4gICAgICAgICQoJ2JvZHknKS5vbignY2xpY2snLCAnW2RhdGEtd2lzaGxpc3QtZGVsZXRlXScsIGV2ZW50ID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGNvbmZpcm1lZCA9IHdpbmRvdy5jb25maXJtKHRoaXMuY29udGV4dC53aXNobGlzdERlbGV0ZSk7XG5cbiAgICAgICAgICAgIGlmIChjb25maXJtZWQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcmVnaXN0ZXJBZGRXaXNoTGlzdFZhbGlkYXRpb24oJGFkZFdpc2hsaXN0Rm9ybSkge1xuICAgICAgICB0aGlzLmFkZFdpc2hsaXN0VmFsaWRhdG9yID0gbm9kKHtcbiAgICAgICAgICAgIHN1Ym1pdDogJy53aXNobGlzdC1mb3JtIGlucHV0W3R5cGU9XCJzdWJtaXRcIl0nLFxuICAgICAgICAgICAgdGFwOiBhbm5vdW5jZUlucHV0RXJyb3JNZXNzYWdlLFxuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLmFkZFdpc2hsaXN0VmFsaWRhdG9yLmFkZChbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgc2VsZWN0b3I6ICcud2lzaGxpc3QtZm9ybSBpbnB1dFtuYW1lPVwid2lzaGxpc3RuYW1lXCJdJyxcbiAgICAgICAgICAgICAgICB2YWxpZGF0ZTogKGNiLCB2YWwpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgcmVzdWx0ID0gdmFsLmxlbmd0aCA+IDA7XG5cbiAgICAgICAgICAgICAgICAgICAgY2IocmVzdWx0KTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGVycm9yTWVzc2FnZTogdGhpcy5jb250ZXh0LmVudGVyV2lzaGxpc3ROYW1lRXJyb3IsXG4gICAgICAgICAgICB9LFxuICAgICAgICBdKTtcblxuICAgICAgICAkYWRkV2lzaGxpc3RGb3JtLm9uKCdzdWJtaXQnLCBldmVudCA9PiB7XG4gICAgICAgICAgICB0aGlzLmFkZFdpc2hsaXN0VmFsaWRhdG9yLnBlcmZvcm1DaGVjaygpO1xuXG4gICAgICAgICAgICBpZiAodGhpcy5hZGRXaXNobGlzdFZhbGlkYXRvci5hcmVBbGwoJ3ZhbGlkJykpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIG9uUmVhZHkoKSB7XG4gICAgICAgIGNvbnN0ICRhZGRXaXNoTGlzdEZvcm0gPSAkKCcud2lzaGxpc3QtZm9ybScpO1xuXG4gICAgICAgIGlmICgkKCdbZGF0YS1wYWdpbmF0aW9uLXdpc2hsaXN0XScpLmxlbmd0aCkge1xuICAgICAgICAgICAgd2lzaGxpc3RQYWdpbmF0b3JIZWxwZXIoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICgkYWRkV2lzaExpc3RGb3JtLmxlbmd0aCkge1xuICAgICAgICAgICAgdGhpcy5yZWdpc3RlckFkZFdpc2hMaXN0VmFsaWRhdGlvbigkYWRkV2lzaExpc3RGb3JtKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMud2lzaGxpc3REZWxldGVDb25maXJtKCk7XG4gICAgfVxufVxuIl0sIm5hbWVzIjpbImFyaWFLZXlDb2RlcyIsIlJFVFVSTiIsIlNQQUNFIiwiTEVGVCIsIlVQIiwiUklHSFQiLCJET1dOIiwic2V0Q2hlY2tlZFJhZGlvSXRlbSIsIml0ZW1Db2xsZWN0aW9uIiwiaXRlbUlkeCIsImVhY2giLCJpZHgiLCJpdGVtIiwiJGl0ZW0iLCIkIiwiYXR0ciIsInByb3AiLCJmb2N1cyIsInRyaWdnZXIiLCJjYWxjdWxhdGVUYXJnZXRJdGVtUG9zaXRpb24iLCJsYXN0SXRlbUlkeCIsImN1cnJlbnRJZHgiLCJoYW5kbGVJdGVtS2V5RG93biIsImUiLCJrZXlDb2RlIiwiaW5kZXgiLCJjdXJyZW50VGFyZ2V0IiwibGFzdENvbGxlY3Rpb25JdGVtSWR4IiwibGVuZ3RoIiwiT2JqZWN0IiwidmFsdWVzIiwiaW5jbHVkZXMiLCJwcmV2ZW50RGVmYXVsdCIsInN0b3BQcm9wYWdhdGlvbiIsInByZXZJdGVtSWR4IiwiZ2V0IiwibmV4dEl0ZW1JZHgiLCIkY29udGFpbmVyIiwiaXRlbVNlbGVjdG9yIiwiJGl0ZW1Db2xsZWN0aW9uIiwiZmluZCIsIm9uIiwibWVkaWFRdWVyeUxpc3RGYWN0b3J5IiwiUExVR0lOX0tFWSIsIkNvbGxhcHNpYmxlRXZlbnRzIiwib3BlbiIsImNsb3NlIiwidG9nZ2xlIiwiY2xpY2siLCJDb2xsYXBzaWJsZVN0YXRlIiwiY2xvc2VkIiwicHJlcGVuZEhhc2giLCJpZCIsImluZGV4T2YiLCJvcHRpb25zRnJvbURhdGEiLCIkZWxlbWVudCIsImRpc2FibGVkQnJlYWtwb2ludCIsImRhdGEiLCJkaXNhYmxlZFN0YXRlIiwiZW5hYmxlZFN0YXRlIiwib3BlbkNsYXNzTmFtZSIsIkNvbGxhcHNpYmxlIiwiJHRvZ2dsZSIsIiR0YXJnZXQiLCJfdGVtcCIsIl9yZWYiLCJfcmVmJG9wZW5DbGFzc05hbWUiLCJ0YXJnZXRJZCIsImRpc2FibGVkTWVkaWFRdWVyeUxpc3QiLCJkaXNhYmxlZCIsIm1hdGNoZXMiLCJvbkNsaWNrZWQiLCJiaW5kIiwib25EaXNhYmxlZE1lZGlhUXVlcnlMaXN0TWF0Y2giLCJpc0NvbGxhcHNlZCIsIl9nZXRUb2dnbGVBcmlhTGFiZWxUZXh0IiwiaXNPcGVuIiwiYmluZEV2ZW50cyIsIl9wcm90byIsInByb3RvdHlwZSIsIiR0ZXh0VG9nZ2xlQ2hpbGRyZW4iLCJjaGlsZHJlbiIsImZpbHRlciIsIl9fIiwiY2hpbGQiLCJ0ZXh0IiwidHJpbSIsIiRhcmlhTGFiZWxUYXJnZXQiLCJmaXJzdCIsIl90ZW1wMiIsIl9yZWYyIiwiX3JlZjIkbm90aWZ5Iiwibm90aWZ5IiwiYWRkQ2xhc3MiLCJfdGVtcDMiLCJfcmVmMyIsIl9yZWYzJG5vdGlmeSIsInJlbW92ZUNsYXNzIiwidG9nZ2xlQnlTdGF0ZSIsInN0YXRlIiwiX2xlbiIsImFyZ3VtZW50cyIsImFyZ3MiLCJBcnJheSIsIl9rZXkiLCJhcHBseSIsInVuZGVmaW5lZCIsImhhc0NvbGxhcHNpYmxlIiwiY29sbGFwc2libGVJbnN0YW5jZSIsImNvbnRhaW5zIiwiYWRkTGlzdGVuZXIiLCJ1bmJpbmRFdmVudHMiLCJvZmYiLCJyZW1vdmVMaXN0ZW5lciIsImV2ZW50IiwibWVkaWEiLCJfY3JlYXRlQ2xhc3MiLCJrZXkiLCJpcyIsImhhc0NsYXNzIiwiX2Rpc2FibGVkIiwic2V0IiwiY29sbGFwc2libGVGYWN0b3J5Iiwic2VsZWN0b3IiLCJvdmVycmlkZU9wdGlvbnMiLCIkY29sbGFwc2libGVzIiwiJGNvbnRleHQiLCJtYXAiLCJlbGVtZW50IiwiaW5zdGFuY2VLZXkiLCJjYWNoZWRDb2xsYXBzaWJsZSIsIm9wdGlvbnMiLCJfZXh0ZW5kIiwiY29sbGFwc2libGUiLCJ0b0FycmF5IiwiYnJlYWtwb2ludFNpemVzIiwibGFyZ2UiLCJtZWRpdW0iLCJzbWFsbCIsImJyZWFrcG9pbnROYW1lIiwid2luZG93IiwibWF0Y2hNZWRpYSIsImJyZWFrcG9pbnQiLCJtZWRpYVF1ZXJ5IiwibWVkaWFRdWVyeUxpc3QiLCJXaXNobGlzdCIsImluaXRSYWRpb09wdGlvbnMiLCJvcHRpb25zVHlwZXNNYXAiLCJJTlBVVF9GSUxFIiwiSU5QVVRfVEVYVCIsIklOUFVUX05VTUJFUiIsIklOUFVUX0NIRUNLQk9YIiwiVEVYVEFSRUEiLCJEQVRFIiwiU0VUX1NFTEVDVCIsIlNFVF9SRUNUQU5HTEUiLCJTRVRfUkFESU8iLCJTV0FUQ0giLCJQUk9EVUNUX0xJU1QiLCJvcHRpb25DaGFuZ2VEZWNvcmF0b3IiLCJhcmVEZWZhdWx0T3Rpb25zU2V0IiwiX3RoaXMiLCJlcnIiLCJyZXNwb25zZSIsImF0dHJpYnV0ZXNEYXRhIiwiYXR0cmlidXRlc0NvbnRlbnQiLCJjb250ZW50IiwidXBkYXRlUHJvZHVjdEF0dHJpYnV0ZXMiLCJ1cGRhdGVWaWV3IiwidXBkYXRlRGVmYXVsdEF0dHJpYnV0ZXNGb3JPT1MiLCJQcm9kdWN0RGV0YWlsc0Jhc2UiLCIkc2NvcGUiLCJjb250ZXh0IiwiX3RoaXMyIiwiaW5pdFJhZGlvQXR0cmlidXRlcyIsImxvYWQiLCJnZXRUYWJSZXF1ZXN0cyIsInZhbHVlIiwidHlwZSIsImdldEF0dHJpYnV0ZSIsIl9tYWtlUHJvZHVjdFZhcmlhbnRBY2Nlc3NpYmxlIiwidmFyaWFudERvbU5vZGUiLCJ2YXJpYW50VHlwZSIsIl90aGlzMyIsImkiLCJyYWRpbyIsIiRyYWRpbyIsIl90aGlzNCIsImJlaGF2aW9yIiwib3V0X29mX3N0b2NrX2JlaGF2aW9yIiwiaW5TdG9ja0lkcyIsImluX3N0b2NrX2F0dHJpYnV0ZXMiLCJvdXRPZlN0b2NrRGVmYXVsdE1lc3NhZ2UiLCJvdXRPZlN0b2NrTWVzc2FnZSIsIm91dF9vZl9zdG9ja19tZXNzYWdlIiwiYXR0cmlidXRlIiwiJGF0dHJpYnV0ZSIsImF0dHJJZCIsInBhcnNlSW50IiwiZW5hYmxlQXR0cmlidXRlIiwiZGlzYWJsZUF0dHJpYnV0ZSIsImxvY2F0aW9uIiwiaGFzaCIsIiRhY3RpdmVUYWIiLCJoYXMiLCIkdGFiQ29udGVudCIsInNpYmxpbmdzIiwiZ2V0Vmlld01vZGVsIiwiJHByaWNlV2l0aFRheCIsIiRwcmljZVdpdGhvdXRUYXgiLCJycnBXaXRoVGF4IiwiJGRpdiIsIiRzcGFuIiwicnJwV2l0aG91dFRheCIsIm5vblNhbGVXaXRoVGF4Iiwibm9uU2FsZVdpdGhvdXRUYXgiLCJwcmljZVNhdmVkIiwicHJpY2VOb3dMYWJlbCIsInByaWNlTGFiZWwiLCIkd2VpZ2h0IiwiJGluY3JlbWVudHMiLCIkYWRkVG9DYXJ0IiwiJHdpc2hsaXN0VmFyaWF0aW9uIiwic3RvY2siLCIkaW5wdXQiLCJza3UiLCIkbGFiZWwiLCIkdmFsdWUiLCJ1cGMiLCJxdWFudGl0eSIsIiR0ZXh0IiwiJGJ1bGtQcmljaW5nIiwiJHdhbGxldEJ1dHRvbnMiLCJjbGVhclByaWNpbmdOb3RGb3VuZCIsInZpZXdNb2RlbCIsImhpZGUiLCJzaG93TWVzc2FnZUJveCIsInN0b2NrX21lc3NhZ2UiLCJwdXJjaGFzaW5nX21lc3NhZ2UiLCJwcmljZSIsInVwZGF0ZVByaWNlVmlldyIsIndlaWdodCIsImh0bWwiLCJmb3JtYXR0ZWQiLCJ2YXJpYW50SWQiLCJ2YWwiLCJzaG93IiwidXBkYXRlV2FsbGV0QnV0dG9uc1ZpZXciLCJidWxrX2Rpc2NvdW50X3JhdGVzIiwiYWRkVG9DYXJ0V3JhcHBlciIsInB1cmNoYXNhYmxlIiwid2l0aF90YXgiLCJ1cGRhdGVkUHJpY2UiLCJwcmljZV9yYW5nZSIsIm1pbiIsIm1heCIsIndpdGhvdXRfdGF4IiwicnJwX3dpdGhfdGF4IiwicnJwX3dpdGhvdXRfdGF4Iiwic2F2ZWQiLCJub25fc2FsZV9wcmljZV93aXRoX3RheCIsIm5vbl9zYWxlX3ByaWNlX3dpdGhvdXRfdGF4IiwibWVzc2FnZSIsIiRtZXNzYWdlQm94IiwiaW5zdG9jayIsInRvZ2dsZVdhbGxldEJ1dHRvbnNWaXNpYmlsaXR5Iiwic2hvdWxkU2hvdyIsImdldEF0dHJpYnV0ZVR5cGUiLCJlbmFibGVTZWxlY3RPcHRpb25BdHRyaWJ1dGUiLCJkaXNhYmxlU2VsZWN0T3B0aW9uQXR0cmlidXRlIiwiJHBhcmVudCIsImNsb3Nlc3QiLCIkc2VsZWN0IiwicGFyZW50IiwidG9nZ2xlT3B0aW9uIiwic2VsZWN0ZWRJbmRleCIsInJlcGxhY2UiLCJkZWZhdWx0IiwiaXNCcm93c2VySUUiLCJkb2N1bWVudCIsImRvY3VtZW50TW9kZSIsImNvbnZlcnRJbnRvQXJyYXkiLCJjb2xsZWN0aW9uIiwic2xpY2UiLCJjYWxsIiwiY2hhbmdlV2lzaGxpc3RQYWdpbmF0aW9uTGlua3MiLCJ3aXNobGlzdFVybCIsInBhZ2luYXRpb25JdGVtcyIsIl8iLCJwYWdpbmF0aW9uTGluayIsInBhZ2VOdW1iZXIiLCJ3aXNobGlzdFBhZ2luYXRvckhlbHBlciIsIiRwYWdpbmF0aW9uTGlzdCIsIiRuZXh0SXRlbSIsIiRwcmV2SXRlbSIsImN1cnJlbnRIcmVmIiwicGFydGlhbFBhZ2luYXRpb25VcmwiLCJzcGxpdCIsInNoaWZ0Iiwibm9kIiwiUGFnZU1hbmFnZXIiLCJhbm5vdW5jZUlucHV0RXJyb3JNZXNzYWdlIiwiV2lzaExpc3QiLCJfUGFnZU1hbmFnZXIiLCJfaW5oZXJpdHNMb29zZSIsInRlbXBsYXRlIiwiX2Fzc2VydFRoaXNJbml0aWFsaXplZCIsIndpc2hsaXN0RGVsZXRlQ29uZmlybSIsImNvbmZpcm1lZCIsImNvbmZpcm0iLCJ3aXNobGlzdERlbGV0ZSIsInJlZ2lzdGVyQWRkV2lzaExpc3RWYWxpZGF0aW9uIiwiJGFkZFdpc2hsaXN0Rm9ybSIsImFkZFdpc2hsaXN0VmFsaWRhdG9yIiwic3VibWl0IiwidGFwIiwiYWRkIiwidmFsaWRhdGUiLCJjYiIsInJlc3VsdCIsImVycm9yTWVzc2FnZSIsImVudGVyV2lzaGxpc3ROYW1lRXJyb3IiLCJwZXJmb3JtQ2hlY2siLCJhcmVBbGwiLCJvblJlYWR5IiwiJGFkZFdpc2hMaXN0Rm9ybSJdLCJzb3VyY2VSb290IjoiIn0=
