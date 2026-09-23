"use strict";
(self["webpackChunkbigcommerce_cornerstone"] = self["webpackChunkbigcommerce_cornerstone"] || []).push([["assets_js_theme_global_foundation_js-assets_js_theme_global_modal_js"],{

/***/ "./assets/js/theme/global/foundation.js":
/*!**********************************************!*\
  !*** ./assets/js/theme/global/foundation.js ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var foundation_sites_js_foundation_foundation__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! foundation-sites/js/foundation/foundation */ "./node_modules/foundation-sites/js/foundation/foundation.js");
/* harmony import */ var foundation_sites_js_foundation_foundation__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(foundation_sites_js_foundation_foundation__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var foundation_sites_js_foundation_foundation_dropdown__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! foundation-sites/js/foundation/foundation.dropdown */ "./node_modules/foundation-sites/js/foundation/foundation.dropdown.js");
/* harmony import */ var foundation_sites_js_foundation_foundation_dropdown__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(foundation_sites_js_foundation_foundation_dropdown__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var foundation_sites_js_foundation_foundation_reveal__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! foundation-sites/js/foundation/foundation.reveal */ "./node_modules/foundation-sites/js/foundation/foundation.reveal.js");
/* harmony import */ var foundation_sites_js_foundation_foundation_reveal__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(foundation_sites_js_foundation_foundation_reveal__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var foundation_sites_js_foundation_foundation_tab__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! foundation-sites/js/foundation/foundation.tab */ "./node_modules/foundation-sites/js/foundation/foundation.tab.js");
/* harmony import */ var foundation_sites_js_foundation_foundation_tab__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(foundation_sites_js_foundation_foundation_tab__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _modal__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./modal */ "./assets/js/theme/global/modal.js");
/* harmony import */ var _reveal_close__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./reveal-close */ "./assets/js/theme/global/reveal-close.js");






/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__($element) {
  $element.foundation({
    dropdown: {
      // specify the class used for active dropdowns
      active_class: 'is-open'
    },
    reveal: {
      bg_class: 'modal-background',
      dismiss_modal_class: 'modal-close',
      close_on_background_click: true
    },
    tab: {
      active_class: 'is-active'
    }
  });
  (0,_modal__WEBPACK_IMPORTED_MODULE_4__["default"])('[data-reveal]', {
    $context: $element
  });
  (0,_reveal_close__WEBPACK_IMPORTED_MODULE_5__["default"])('[data-reveal-close]', {
    $context: $element
  });
}

/***/ }),

/***/ "./assets/js/theme/global/modal.js":
/*!*****************************************!*\
  !*** ./assets/js/theme/global/modal.js ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Modal: () => (/* binding */ Modal),
/* harmony export */   ModalEvents: () => (/* binding */ ModalEvents),
/* harmony export */   alertModal: () => (/* binding */ alertModal),
/* harmony export */   "default": () => (/* binding */ modalFactory),
/* harmony export */   defaultModal: () => (/* binding */ defaultModal),
/* harmony export */   showAlertModal: () => (/* binding */ showAlertModal)
/* harmony export */ });
/* harmony import */ var _foundation__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./foundation */ "./assets/js/theme/global/foundation.js");
/* harmony import */ var focus_trap__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! focus-trap */ "./node_modules/focus-trap/dist/focus-trap.esm.js");
/* provided dependency */ var $ = __webpack_require__(/*! jquery */ "./node_modules/jquery/dist/jquery.min.js");
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return typeof key === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (typeof input !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (typeof res !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }


var bodyActiveClass = 'has-activeModal';
var loadingOverlayClass = 'loadingOverlay';
var modalBodyClass = 'modal-body';
var modalContentClass = 'modal-content';
var SizeClasses = {
  small: 'modal--small',
  large: 'modal--large',
  normal: ''
};
var ModalEvents = {
  close: 'close.fndtn.reveal',
  closed: 'closed.fndtn.reveal',
  open: 'open.fndtn.reveal',
  opened: 'opened.fndtn.reveal',
  loaded: 'loaded.data.custom'
};
function getSizeFromModal($modal) {
  if ($modal.hasClass(SizeClasses.small)) {
    return 'small';
  }
  if ($modal.hasClass(SizeClasses.large)) {
    return 'large';
  }
  return 'normal';
}
function getViewportHeight(multipler) {
  if (multipler === void 0) {
    multipler = 1;
  }
  var viewportHeight = $(window).height();
  return viewportHeight * multipler;
}
function wrapModalBody(content) {
  var $modalBody = $('<div>');
  $modalBody.addClass(modalBodyClass).html(content);
  return $modalBody;
}
function restrainContentHeight($content) {
  if ($content.length === 0) return;
  var $body = $("." + modalBodyClass, $content);
  if ($body.length === 0) return;
  var bodyHeight = $body.outerHeight();
  var contentHeight = $content.outerHeight();
  var viewportHeight = getViewportHeight(0.9);
  var maxHeight = viewportHeight - (contentHeight - bodyHeight);
  $body.css('max-height', maxHeight);
}
function createModalContent($modal) {
  var $content = $("." + modalContentClass, $modal);
  if ($content.length === 0) {
    var existingContent = $modal.children();
    $content = $('<div>').addClass(modalContentClass).append(existingContent).appendTo($modal);
  }
  return $content;
}
function createLoadingOverlay($modal) {
  var $loadingOverlay = $("." + loadingOverlayClass, $modal);
  if ($loadingOverlay.length === 0) {
    $loadingOverlay = $('<div>').addClass(loadingOverlayClass).appendTo($modal);
  }
  return $loadingOverlay;
}

/**
 * Require foundation.reveal
 * Decorate foundation.reveal with additional methods
 * @param {jQuery} $modal
 * @param {Object} [options]
 * @param {string} [options.size]
 */
var Modal = /*#__PURE__*/function () {
  function Modal($modal, _temp) {
    var _ref = _temp === void 0 ? {} : _temp,
      _ref$size = _ref.size,
      size = _ref$size === void 0 ? null : _ref$size;
    this.$modal = $modal;
    this.$content = createModalContent(this.$modal);
    this.$overlay = createLoadingOverlay(this.$modal);
    this.defaultSize = size || getSizeFromModal($modal);
    this.size = this.defaultSize;
    this.pending = false;
    this.$preModalFocusedEl = null;
    this.focusTrap = null;
    this.onModalOpen = this.onModalOpen.bind(this);
    this.onModalOpened = this.onModalOpened.bind(this);
    this.onModalClose = this.onModalClose.bind(this);
    this.onModalClosed = this.onModalClosed.bind(this);
    this.bindEvents();

    /* STRF-2471 - Multiple Wish Lists - prevents double-firing
     * of foundation.dropdown click.fndtn.dropdown event */
    this.$modal.on('click', '.dropdown-menu-button', function (e) {
      e.stopPropagation();
    });
  }
  var _proto = Modal.prototype;
  _proto.bindEvents = function bindEvents() {
    this.$modal.on(ModalEvents.close, this.onModalClose);
    this.$modal.on(ModalEvents.closed, this.onModalClosed);
    this.$modal.on(ModalEvents.open, this.onModalOpen);
    this.$modal.on(ModalEvents.opened, this.onModalOpened);
  };
  _proto.open = function open(_temp2) {
    var _ref2 = _temp2 === void 0 ? {} : _temp2,
      size = _ref2.size,
      _ref2$pending = _ref2.pending,
      pending = _ref2$pending === void 0 ? true : _ref2$pending,
      _ref2$clearContent = _ref2.clearContent,
      clearContent = _ref2$clearContent === void 0 ? true : _ref2$clearContent;
    this.pending = pending;
    if (size) {
      this.size = size;
    }
    if (clearContent) {
      this.clearContent();
    }
    this.$modal.foundation('reveal', 'open');
  };
  _proto.close = function close() {
    this.$modal.foundation('reveal', 'close');
  };
  _proto.updateContent = function updateContent(content, _temp3) {
    var _ref3 = _temp3 === void 0 ? {} : _temp3,
      _ref3$wrap = _ref3.wrap,
      wrap = _ref3$wrap === void 0 ? false : _ref3$wrap;
    var $content = $(content);
    if (wrap) {
      $content = wrapModalBody(content);
    }
    this.pending = false;
    this.$content.html($content);
    this.$modal.trigger(ModalEvents.loaded);
    restrainContentHeight(this.$content);
    (0,_foundation__WEBPACK_IMPORTED_MODULE_0__["default"])(this.$content);
  };
  _proto.clearContent = function clearContent() {
    this.$content.html('');
  };
  _proto.setupFocusTrap = function setupFocusTrap() {
    var _this = this;
    if (!this.$preModalFocusedEl) this.$preModalFocusedEl = $(document.activeElement);
    if (!this.focusTrap) {
      this.focusTrap = focus_trap__WEBPACK_IMPORTED_MODULE_1__.createFocusTrap(this.$modal[0], {
        escapeDeactivates: false,
        returnFocusOnDeactivate: false,
        allowOutsideClick: true,
        fallbackFocus: function fallbackFocus() {
          var fallbackNode = _this.$preModalFocusedEl && _this.$preModalFocusedEl.length ? _this.$preModalFocusedEl[0] : $('[data-header-logo-link]')[0];
          return fallbackNode;
        }
      });
    }
    this.focusTrap.deactivate();
    this.focusTrap.activate();
  };
  _proto.onModalClose = function onModalClose() {
    $('body').removeClass(bodyActiveClass);
    this.clearContent();
  };
  _proto.onModalClosed = function onModalClosed() {
    this.size = this.defaultSize;
    if (this.focusTrap) this.focusTrap.deactivate();
    if (this.$preModalFocusedEl) this.$preModalFocusedEl.focus();
    this.$preModalFocusedEl = null;
  };
  _proto.onModalOpen = function onModalOpen() {
    $('body').addClass(bodyActiveClass);
  };
  _proto.onModalOpened = function onModalOpened() {
    var _this2 = this;
    if (this.pending) {
      this.$modal.one(ModalEvents.loaded, function () {
        if (_this2.$modal.hasClass('open')) _this2.setupFocusTrap();
      });
    } else {
      this.setupFocusTrap();
    }
    restrainContentHeight(this.$content);
  };
  _createClass(Modal, [{
    key: "pending",
    get: function get() {
      return this._pending;
    },
    set: function set(pending) {
      this._pending = pending;
      if (pending) {
        this.$overlay.show();
      } else {
        this.$overlay.hide();
      }
    }
  }, {
    key: "size",
    get: function get() {
      return this._size;
    },
    set: function set(size) {
      this._size = size;
      this.$modal.removeClass(SizeClasses.small).removeClass(SizeClasses.large).addClass(SizeClasses[size] || '');
    }
  }]);
  return Modal;
}();

/**
 * Return an array of modals
 * @param {string} selector
 * @param {Object} [options]
 * @param {string} [options.size]
 * @returns {array}
 */
function modalFactory(selector, options) {
  if (selector === void 0) {
    selector = '[data-reveal]';
  }
  if (options === void 0) {
    options = {};
  }
  var $modals = $(selector, options.$context);
  return $modals.map(function (index, element) {
    var $modal = $(element);
    var instanceKey = 'modalInstance';
    var cachedModal = $modal.data(instanceKey);
    if (cachedModal instanceof Modal) {
      return cachedModal;
    }
    var modal = new Modal($modal, options);
    $modal.data(instanceKey, modal);
    return modal;
  }).toArray();
}

/*
 * Return the default page modal
 */
function defaultModal() {
  return modalFactory('#modal')[0];
}

/*
 * Return the default alert modal
 */
function alertModal() {
  return modalFactory('#alert-modal')[0];
}

/*
 * Display the given message in the default alert modal
 */
function showAlertModal(message, options) {
  if (options === void 0) {
    options = {};
  }
  var modal = alertModal();
  var $cancelBtn = modal.$modal.find('.cancel');
  var $confirmBtn = modal.$modal.find('.confirm');
  var _options = options,
    _options$icon = _options.icon,
    icon = _options$icon === void 0 ? 'error' : _options$icon,
    _options$$preModalFoc = _options.$preModalFocusedEl,
    $preModalFocusedEl = _options$$preModalFoc === void 0 ? null : _options$$preModalFoc,
    showCancelButton = _options.showCancelButton,
    onConfirm = _options.onConfirm;
  if ($preModalFocusedEl) {
    modal.$preModalFocusedEl = $preModalFocusedEl;
  }
  modal.open();
  modal.$modal.find('.alert-icon').hide();
  if (icon === 'error') {
    modal.$modal.find('.error-icon').show();
  } else if (icon === 'warning') {
    modal.$modal.find('.warning-icon').show();
  }
  modal.updateContent("<span>" + message + "</span>");
  if (onConfirm) {
    $confirmBtn.on('click', onConfirm);
    modal.$modal.one(ModalEvents.closed, function () {
      $confirmBtn.off('click', onConfirm);
    });
  }
  if (showCancelButton) {
    $cancelBtn.show();
  } else {
    $cancelBtn.hide();
  }
}

/***/ }),

/***/ "./assets/js/theme/global/reveal-close.js":
/*!************************************************!*\
  !*** ./assets/js/theme/global/reveal-close.js ***!
  \************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ revealCloseFactory)
/* harmony export */ });
/* provided dependency */ var $ = __webpack_require__(/*! jquery */ "./node_modules/jquery/dist/jquery.min.js");
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return typeof key === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (typeof input !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (typeof res !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
var revealCloseAttr = 'revealClose';
var revealCloseSelector = "[data-" + revealCloseAttr + "]";
var revealSelector = '[data-reveal]';
var RevealClose = /*#__PURE__*/function () {
  function RevealClose($button) {
    this.$button = $button;
    this.modalId = $button.data(revealCloseAttr);
    this.onClick = this.onClick.bind(this);
    this.bindEvents();
  }
  var _proto = RevealClose.prototype;
  _proto.bindEvents = function bindEvents() {
    this.$button.on('click', this.onClick);
  };
  _proto.unbindEvents = function unbindEvents() {
    this.$button.off('click', this.onClick);
  };
  _proto.onClick = function onClick(event) {
    var modal = this.modal;
    if (modal) {
      event.preventDefault();
      modal.close();
    }
  };
  _createClass(RevealClose, [{
    key: "modal",
    get: function get() {
      var $modal;
      if (this.modalId) {
        $modal = $("#" + this.modalId);
      } else {
        $modal = this.$button.parents(revealSelector).eq(0);
      }
      return $modal.data('modalInstance');
    }
  }]);
  return RevealClose;
}();
/*
 * Extend foundation.reveal with the ability to close a modal by clicking on any of its child element
 * with data-reveal-close attribute.
 *
 * @example
 *
 * <div data-reveal id="helloModal">
 *   <button data-reveal-close>Continue</button>
 * </div>
 *
 * <div data-reveal id="helloModal"></div>
 * <button data-reveal-close="helloModal">Continue</button>
 */
function revealCloseFactory(selector, options) {
  if (selector === void 0) {
    selector = revealCloseSelector;
  }
  if (options === void 0) {
    options = {};
  }
  var $buttons = $(selector, options.$context);
  return $buttons.map(function (index, element) {
    var $button = $(element);
    var instanceKey = revealCloseAttr + "Instance";
    var cachedButton = $button.data(instanceKey);
    if (cachedButton instanceof RevealClose) {
      return cachedButton;
    }
    var button = new RevealClose($button);
    $button.data(instanceKey, button);
    return button;
  }).toArray();
}

/***/ })

}]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGhlbWUtYnVuZGxlLmNodW5rLmFzc2V0c19qc190aGVtZV9nbG9iYWxfZm91bmRhdGlvbl9qcy1hc3NldHNfanNfdGhlbWVfZ2xvYmFsX21vZGFsX2pzLmpzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQW1EO0FBQ1M7QUFDRjtBQUNIO0FBQ3BCO0FBQ2E7QUFFaEQsNkJBQWUsb0NBQVVFLFFBQVEsRUFBRTtFQUMvQkEsUUFBUSxDQUFDQyxVQUFVLENBQUM7SUFDaEJDLFFBQVEsRUFBRTtNQUNOO01BQ0FDLFlBQVksRUFBRTtJQUNsQixDQUFDO0lBQ0RDLE1BQU0sRUFBRTtNQUNKQyxRQUFRLEVBQUUsa0JBQWtCO01BQzVCQyxtQkFBbUIsRUFBRSxhQUFhO01BQ2xDQyx5QkFBeUIsRUFBRTtJQUMvQixDQUFDO0lBQ0RDLEdBQUcsRUFBRTtNQUNETCxZQUFZLEVBQUU7SUFDbEI7RUFDSixDQUFDLENBQUM7RUFFRkwsa0RBQVksQ0FBQyxlQUFlLEVBQUU7SUFBRVcsUUFBUSxFQUFFVDtFQUFTLENBQUMsQ0FBQztFQUNyREQseURBQWtCLENBQUMscUJBQXFCLEVBQUU7SUFBRVUsUUFBUSxFQUFFVDtFQUFTLENBQUMsQ0FBQztBQUNyRTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUN6QnNDO0FBQ0U7QUFFeEMsSUFBTVcsZUFBZSxHQUFHLGlCQUFpQjtBQUN6QyxJQUFNQyxtQkFBbUIsR0FBRyxnQkFBZ0I7QUFDNUMsSUFBTUMsY0FBYyxHQUFHLFlBQVk7QUFDbkMsSUFBTUMsaUJBQWlCLEdBQUcsZUFBZTtBQUV6QyxJQUFNQyxXQUFXLEdBQUc7RUFDaEJDLEtBQUssRUFBRSxjQUFjO0VBQ3JCQyxLQUFLLEVBQUUsY0FBYztFQUNyQkMsTUFBTSxFQUFFO0FBQ1osQ0FBQztBQUVNLElBQU1DLFdBQVcsR0FBRztFQUN2QkMsS0FBSyxFQUFFLG9CQUFvQjtFQUMzQkMsTUFBTSxFQUFFLHFCQUFxQjtFQUM3QkMsSUFBSSxFQUFFLG1CQUFtQjtF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dGhlbWUvZ2xvYmFsL2ZvdW5kYXRpb24uanMiLCJ3ZWJwYWNrOi8vYmlnY29tbWVyY2UtY29ybmVyc3RvbmUvLi9hc3NldHMvanMvdGhlbWUvZ2xvYmFsL21vZGFsLmpzIiwid2VicGFjazovL2JpZ2NvbW1lcmNlLWNvcm5lcnN0b25lLy4vYXNzZXRzL2pzL3RoZW1lL2dsb2JhbC9yZXZlYWwtY2xvc2UuanMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICdmb3VuZGF0aW9uLXNpdGVzL2pzL2ZvdW5kYXRpb24vZm91bmRhdGlvbic7XG5pbXBvcnQgJ2ZvdW5kYXRpb24tc2l0ZXMvanMvZm91bmRhdGlvbi9mb3VuZGF0aW9uLmRyb3Bkb3duJztcbmltcG9ydCAnZm91bmRhdGlvbi1zaXRlcy9qcy9mb3VuZGF0aW9uL2ZvdW5kYXRpb24ucmV2ZWFsJztcbmltcG9ydCAnZm91bmRhdGlvbi1zaXRlcy9qcy9mb3VuZGF0aW9uL2ZvdW5kYXRpb24udGFiJztcbmltcG9ydCBtb2RhbEZhY3RvcnkgZnJvbSAnLi9tb2RhbCc7XG5pbXBvcnQgcmV2ZWFsQ2xvc2VGYWN0b3J5IGZyb20gJy4vcmV2ZWFsLWNsb3NlJztcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gKCRlbGVtZW50KSB7XG4gICAgJGVsZW1lbnQuZm91bmRhdGlvbih7XG4gICAgICAgIGRyb3Bkb3duOiB7XG4gICAgICAgICAgICAvLyBzcGVjaWZ5IHRoZSBjbGFzcyB1c2VkIGZvciBhY3RpdmUgZHJvcGRvd25zXG4gICAgICAgICAgICBhY3RpdmVfY2xhc3M6ICdpcy1vcGVuJyxcbiAgICAgICAgfSxcbiAgICAgICAgcmV2ZWFsOiB7XG4gICAgICAgICAgICBiZ19jbGFzczogJ21vZGFsLWJhY2tncm91bmQnLFxuICAgICAgICAgICAgZGlzbWlzc19tb2RhbF9jbGFzczogJ21vZGFsLWNsb3NlJyxcbiAgICAgICAgICAgIGNsb3NlX29uX2JhY2tncm91bmRfY2xpY2s6IHRydWUsXG4gICAgICAgIH0sXG4gICAgICAgIHRhYjoge1xuICAgICAgICAgICAgYWN0aXZlX2NsYXNzOiAnaXMtYWN0aXZlJyxcbiAgICAgICAgfSxcbiAgICB9KTtcblxuICAgIG1vZGFsRmFjdG9yeSgnW2RhdGEtcmV2ZWFsXScsIHsgJGNvbnRleHQ6ICRlbGVtZW50IH0pO1xuICAgIHJldmVhbENsb3NlRmFjdG9yeSgnW2RhdGEtcmV2ZWFsLWNsb3NlXScsIHsgJGNvbnRleHQ6ICRlbGVtZW50IH0pO1xufVxuIiwiaW1wb3J0IGZvdW5kYXRpb24gZnJvbSAnLi9mb3VuZGF0aW9uJztcbmltcG9ydCAqIGFzIGZvY3VzVHJhcCBmcm9tICdmb2N1cy10cmFwJztcblxuY29uc3QgYm9keUFjdGl2ZUNsYXNzID0gJ2hhcy1hY3RpdmVNb2RhbCc7XG5jb25zdCBsb2FkaW5nT3ZlcmxheUNsYXNzID0gJ2xvYWRpbmdPdmVybGF5JztcbmNvbnN0IG1vZGFsQm9keUNsYXNzID0gJ21vZGFsLWJvZHknO1xuY29uc3QgbW9kYWxDb250ZW50Q2xhc3MgPSAnbW9kYWwtY29udGVudCc7XG5cbmNvbnN0IFNpemVDbGFzc2VzID0ge1xuICAgIHNtYWxsOiAnbW9kYWwtLXNtYWxsJyxcbiAgICBsYXJnZTogJ21vZGFsLS1sYXJnZScsXG4gICAgbm9ybWFsOiAnJyxcbn07XG5cbmV4cG9ydCBjb25zdCBNb2RhbEV2ZW50cyA9IHtcbiAgICBjbG9zZTogJ2Nsb3NlLmZuZHRuLnJldmVhbCcsXG4gICAgY2xvc2VkOiAnY2xvc2VkLmZuZHRuLnJldmVhbCcsXG4gICAgb3BlbjogJ29wZW4uZm5kdG4ucmV2ZWFsJyxcbiAgICBvcGVuZWQ6ICdvcGVuZWQuZm5kdG4ucmV2ZWFsJyxcbiAgICBsb2FkZWQ6ICdsb2FkZWQuZGF0YS5jdXN0b20nLFxufTtcblxuZnVuY3Rpb24gZ2V0U2l6ZUZyb21Nb2RhbCgkbW9kYWwpIHtcbiAgICBpZiAoJG1vZGFsLmhhc0NsYXNzKFNpemVDbGFzc2VzLnNtYWxsKSkge1xuICAgICAgICByZXR1cm4gJ3NtYWxsJztcbiAgICB9XG5cbiAgICBpZiAoJG1vZGFsLmhhc0NsYXNzKFNpemVDbGFzc2VzLmxhcmdlKSkge1xuICAgICAgICByZXR1cm4gJ2xhcmdlJztcbiAgICB9XG5cbiAgICByZXR1cm4gJ25vcm1hbCc7XG59XG5cbmZ1bmN0aW9uIGdldFZpZXdwb3J0SGVpZ2h0KG11bHRpcGxlciA9IDEpIHtcbiAgICBjb25zdCB2aWV3cG9ydEhlaWdodCA9ICQod2luZG93KS5oZWlnaHQoKTtcblxuICAgIHJldHVybiB2aWV3cG9ydEhlaWdodCAqIG11bHRpcGxlcjtcbn1cblxuZnVuY3Rpb24gd3JhcE1vZGFsQm9keShjb250ZW50KSB7XG4gICAgY29uc3QgJG1vZGFsQm9keSA9ICQoJzxkaXY+Jyk7XG5cbiAgICAkbW9kYWxCb2R5XG4gICAgICAgIC5hZGRDbGFzcyhtb2RhbEJvZHlDbGFzcylcbiAgICAgICAgLmh0bWwoY29udGVudCk7XG5cbiAgICByZXR1cm4gJG1vZGFsQm9keTtcbn1cblxuZnVuY3Rpb24gcmVzdHJhaW5Db250ZW50SGVpZ2h0KCRjb250ZW50KSB7XG4gICAgaWYgKCRjb250ZW50Lmxlbmd0aCA9PT0gMCkgcmV0dXJuO1xuXG4gICAgY29uc3QgJGJvZHkgPSAkKGAuJHttb2RhbEJvZHlDbGFzc31gLCAkY29udGVudCk7XG5cbiAgICBpZiAoJGJvZHkubGVuZ3RoID09PSAwKSByZXR1cm47XG5cbiAgICBjb25zdCBib2R5SGVpZ2h0ID0gJGJvZHkub3V0ZXJIZWlnaHQoKTtcbiAgICBjb25zdCBjb250ZW50SGVpZ2h0ID0gJGNvbnRlbnQub3V0ZXJIZWlnaHQoKTtcbiAgICBjb25zdCB2aWV3cG9ydEhlaWdodCA9IGdldFZpZXdwb3J0SGVpZ2h0KDAuOSk7XG4gICAgY29uc3QgbWF4SGVpZ2h0ID0gdmlld3BvcnRIZWlnaHQgLSAoY29udGVudEhlaWdodCAtIGJvZHlIZWlnaHQpO1xuXG4gICAgJGJvZHkuY3NzKCdtYXgtaGVpZ2h0JywgbWF4SGVpZ2h0KTtcbn1cblxuZnVuY3Rpb24gY3JlYXRlTW9kYWxDb250ZW50KCRtb2RhbCkge1xuICAgIGxldCAkY29udGVudCA9ICQoYC4ke21vZGFsQ29udGVudENsYXNzfWAsICRtb2RhbCk7XG5cbiAgICBpZiAoJGNvbnRlbnQubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIGNvbnN0IGV4aXN0aW5nQ29udGVudCA9ICRtb2RhbC5jaGlsZHJlbigpO1xuXG4gICAgICAgICRjb250ZW50ID0gJCgnPGRpdj4nKVxuICAgICAgICAgICAgLmFkZENsYXNzKG1vZGFsQ29udGVudENsYXNzKVxuICAgICAgICAgICAgLmFwcGVuZChleGlzdGluZ0NvbnRlbnQpXG4gICAgICAgICAgICAuYXBwZW5kVG8oJG1vZGFsKTtcbiAgICB9XG5cbiAgICByZXR1cm4gJGNvbnRlbnQ7XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZUxvYWRpbmdPdmVybGF5KCRtb2RhbCkge1xuICAgIGxldCAkbG9hZGluZ092ZXJsYXkgPSAkKGAuJHtsb2FkaW5nT3ZlcmxheUNsYXNzfWAsICRtb2RhbCk7XG5cbiAgICBpZiAoJGxvYWRpbmdPdmVybGF5Lmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAkbG9hZGluZ092ZXJsYXkgPSAkKCc8ZGl2PicpXG4gICAgICAgICAgICAuYWRkQ2xhc3MobG9hZGluZ092ZXJsYXlDbGFzcylcbiAgICAgICAgICAgIC5hcHBlbmRUbygkbW9kYWwpO1xuICAgIH1cblxuICAgIHJldHVybiAkbG9hZGluZ092ZXJsYXk7XG59XG5cbi8qKlxuICogUmVxdWlyZSBmb3VuZGF0aW9uLnJldmVhbFxuICogRGVjb3JhdGUgZm91bmRhdGlvbi5yZXZlYWwgd2l0aCBhZGRpdGlvbmFsIG1ldGhvZHNcbiAqIEBwYXJhbSB7alF1ZXJ5fSAkbW9kYWxcbiAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9uc11cbiAqIEBwYXJhbSB7c3RyaW5nfSBbb3B0aW9ucy5zaXplXVxuICovXG5leHBvcnQgY2xhc3MgTW9kYWwge1xuICAgIGNvbnN0cnVjdG9yKCRtb2RhbCwge1xuICAgICAgICBzaXplID0gbnVsbCxcbiAgICB9ID0ge30pIHtcbiAgICAgICAgdGhpcy4kbW9kYWwgPSAkbW9kYWw7XG4gICAgICAgIHRoaXMuJGNvbnRlbnQgPSBjcmVhdGVNb2RhbENvbnRlbnQodGhpcy4kbW9kYWwpO1xuICAgICAgICB0aGlzLiRvdmVybGF5ID0gY3JlYXRlTG9hZGluZ092ZXJsYXkodGhpcy4kbW9kYWwpO1xuICAgICAgICB0aGlzLmRlZmF1bHRTaXplID0gc2l6ZSB8fCBnZXRTaXplRnJvbU1vZGFsKCRtb2RhbCk7XG4gICAgICAgIHRoaXMuc2l6ZSA9IHRoaXMuZGVmYXVsdFNpemU7XG4gICAgICAgIHRoaXMucGVuZGluZyA9IGZhbHNlO1xuICAgICAgICB0aGlzLiRwcmVNb2RhbEZvY3VzZWRFbCA9IG51bGw7XG4gICAgICAgIHRoaXMuZm9jdXNUcmFwID0gbnVsbDtcblxuICAgICAgICB0aGlzLm9uTW9kYWxPcGVuID0gdGhpcy5vbk1vZGFsT3Blbi5iaW5kKHRoaXMpO1xuICAgICAgICB0aGlzLm9uTW9kYWxPcGVuZWQgPSB0aGlzLm9uTW9kYWxPcGVuZWQuYmluZCh0aGlzKTtcbiAgICAgICAgdGhpcy5vbk1vZGFsQ2xvc2UgPSB0aGlzLm9uTW9kYWxDbG9zZS5iaW5kKHRoaXMpO1xuICAgICAgICB0aGlzLm9uTW9kYWxDbG9zZWQgPSB0aGlzLm9uTW9kYWxDbG9zZWQuYmluZCh0aGlzKTtcblxuICAgICAgICB0aGlzLmJpbmRFdmVudHMoKTtcblxuICAgICAgICAvKiBTVFJGLTI0NzEgLSBNdWx0aXBsZSBXaXNoIExpc3RzIC0gcHJldmVudHMgZG91YmxlLWZpcmluZ1xuICAgICAgICAgKiBvZiBmb3VuZGF0aW9uLmRyb3Bkb3duIGNsaWNrLmZuZHRuLmRyb3Bkb3duIGV2ZW50ICovXG4gICAgICAgIHRoaXMuJG1vZGFsLm9uKCdjbGljaycsICcuZHJvcGRvd24tbWVudS1idXR0b24nLCBlID0+IHtcbiAgICAgICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGdldCBwZW5kaW5nKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fcGVuZGluZztcbiAgICB9XG5cbiAgICBzZXQgcGVuZGluZyhwZW5kaW5nKSB7XG4gICAgICAgIHRoaXMuX3BlbmRpbmcgPSBwZW5kaW5nO1xuXG4gICAgICAgIGlmIChwZW5kaW5nKSB7XG4gICAgICAgICAgICB0aGlzLiRvdmVybGF5LnNob3coKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuJG92ZXJsYXkuaGlkZSgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZ2V0IHNpemUoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9zaXplO1xuICAgIH1cblxuICAgIHNldCBzaXplKHNpemUpIHtcbiAgICAgICAgdGhpcy5fc2l6ZSA9IHNpemU7XG5cbiAgICAgICAgdGhpcy4kbW9kYWxcbiAgICAgICAgICAgIC5yZW1vdmVDbGFzcyhTaXplQ2xhc3Nlcy5zbWFsbClcbiAgICAgICAgICAgIC5yZW1vdmVDbGFzcyhTaXplQ2xhc3Nlcy5sYXJnZSlcbiAgICAgICAgICAgIC5hZGRDbGFzcyhTaXplQ2xhc3Nlc1tzaXplXSB8fCAnJyk7XG4gICAgfVxuXG4gICAgYmluZEV2ZW50cygpIHtcbiAgICAgICAgdGhpcy4kbW9kYWwub24oTW9kYWxFdmVudHMuY2xvc2UsIHRoaXMub25Nb2RhbENsb3NlKTtcbiAgICAgICAgdGhpcy4kbW9kYWwub24oTW9kYWxFdmVudHMuY2xvc2VkLCB0aGlzLm9uTW9kYWxDbG9zZWQpO1xuICAgICAgICB0aGlzLiRtb2RhbC5vbihNb2RhbEV2ZW50cy5vcGVuLCB0aGlzLm9uTW9kYWxPcGVuKTtcbiAgICAgICAgdGhpcy4kbW9kYWwub24oTW9kYWxFdmVudHMub3BlbmVkLCB0aGlzLm9uTW9kYWxPcGVuZWQpO1xuICAgIH1cblxuICAgIG9wZW4oe1xuICAgICAgICBzaXplLFxuICAgICAgICBwZW5kaW5nID0gdHJ1ZSxcbiAgICAgICAgY2xlYXJDb250ZW50ID0gdHJ1ZSxcbiAgICB9ID0ge30pIHtcbiAgICAgICAgdGhpcy5wZW5kaW5nID0gcGVuZGluZztcblxuICAgICAgICBpZiAoc2l6ZSkge1xuICAgICAgICAgICAgdGhpcy5zaXplID0gc2l6ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChjbGVhckNvbnRlbnQpIHtcbiAgICAgICAgICAgIHRoaXMuY2xlYXJDb250ZW50KCk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLiRtb2RhbC5mb3VuZGF0aW9uKCdyZXZlYWwnLCAnb3BlbicpO1xuICAgIH1cblxuICAgIGNsb3NlKCkge1xuICAgICAgICB0aGlzLiRtb2RhbC5mb3VuZGF0aW9uKCdyZXZlYWwnLCAnY2xvc2UnKTtcbiAgICB9XG5cbiAgICB1cGRhdGVDb250ZW50KGNvbnRlbnQsIHsgd3JhcCA9IGZhbHNlIH0gPSB7fSkge1xuICAgICAgICBsZXQgJGNvbnRlbnQgPSAkKGNvbnRlbnQpO1xuXG4gICAgICAgIGlmICh3cmFwKSB7XG4gICAgICAgICAgICAkY29udGVudCA9IHdyYXBNb2RhbEJvZHkoY29udGVudCk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnBlbmRpbmcgPSBmYWxzZTtcbiAgICAgICAgdGhpcy4kY29udGVudC5odG1sKCRjb250ZW50KTtcbiAgICAgICAgdGhpcy4kbW9kYWwudHJpZ2dlcihNb2RhbEV2ZW50cy5sb2FkZWQpO1xuXG4gICAgICAgIHJlc3RyYWluQ29udGVudEhlaWdodCh0aGlzLiRjb250ZW50KTtcbiAgICAgICAgZm91bmRhdGlvbih0aGlzLiRjb250ZW50KTtcbiAgICB9XG5cbiAgICBjbGVhckNvbnRlbnQoKSB7XG4gICAgICAgIHRoaXMuJGNvbnRlbnQuaHRtbCgnJyk7XG4gICAgfVxuXG4gICAgc2V0dXBGb2N1c1RyYXAoKSB7XG4gICAgICAgIGlmICghdGhpcy4kcHJlTW9kYWxGb2N1c2VkRWwpIHRoaXMuJHByZU1vZGFsRm9jdXNlZEVsID0gJChkb2N1bWVudC5hY3RpdmVFbGVtZW50KTtcblxuICAgICAgICBpZiAoIXRoaXMuZm9jdXNUcmFwKSB7XG4gICAgICAgICAgICB0aGlzLmZvY3VzVHJhcCA9IGZvY3VzVHJhcC5jcmVhdGVGb2N1c1RyYXAodGhpcy4kbW9kYWxbMF0sIHtcbiAgICAgICAgICAgICAgICBlc2NhcGVEZWFjdGl2YXRlczogZmFsc2UsXG4gICAgICAgICAgICAgICAgcmV0dXJuRm9jdXNPbkRlYWN0aXZhdGU6IGZhbHNlLFxuICAgICAgICAgICAgICAgIGFsbG93T3V0c2lkZUNsaWNrOiB0cnVlLFxuICAgICAgICAgICAgICAgIGZhbGxiYWNrRm9jdXM6ICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgZmFsbGJhY2tOb2RlID0gdGhpcy4kcHJlTW9kYWxGb2N1c2VkRWwgJiYgdGhpcy4kcHJlTW9kYWxGb2N1c2VkRWwubGVuZ3RoXG4gICAgICAgICAgICAgICAgICAgICAgICA/IHRoaXMuJHByZU1vZGFsRm9jdXNlZEVsWzBdXG4gICAgICAgICAgICAgICAgICAgICAgICA6ICQoJ1tkYXRhLWhlYWRlci1sb2dvLWxpbmtdJylbMF07XG5cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbGxiYWNrTm9kZTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmZvY3VzVHJhcC5kZWFjdGl2YXRlKCk7XG4gICAgICAgIHRoaXMuZm9jdXNUcmFwLmFjdGl2YXRlKCk7XG4gICAgfVxuXG4gICAgb25Nb2RhbENsb3NlKCkge1xuICAgICAgICAkKCdib2R5JykucmVtb3ZlQ2xhc3MoYm9keUFjdGl2ZUNsYXNzKTtcblxuICAgICAgICB0aGlzLmNsZWFyQ29udGVudCgpO1xuICAgIH1cblxuICAgIG9uTW9kYWxDbG9zZWQoKSB7XG4gICAgICAgIHRoaXMuc2l6ZSA9IHRoaXMuZGVmYXVsdFNpemU7XG5cbiAgICAgICAgaWYgKHRoaXMuZm9jdXNUcmFwKSB0aGlzLmZvY3VzVHJhcC5kZWFjdGl2YXRlKCk7XG5cbiAgICAgICAgaWYgKHRoaXMuJHByZU1vZGFsRm9jdXNlZEVsKSB0aGlzLiRwcmVNb2RhbEZvY3VzZWRFbC5mb2N1cygpO1xuXG4gICAgICAgIHRoaXMuJHByZU1vZGFsRm9jdXNlZEVsID0gbnVsbDtcbiAgICB9XG5cbiAgICBvbk1vZGFsT3BlbigpIHtcbiAgICAgICAgJCgnYm9keScpLmFkZENsYXNzKGJvZHlBY3RpdmVDbGFzcyk7XG4gICAgfVxuXG4gICAgb25Nb2RhbE9wZW5lZCgpIHtcbiAgICAgICAgaWYgKHRoaXMucGVuZGluZykge1xuICAgICAgICAgICAgdGhpcy4kbW9kYWwub25lKE1vZGFsRXZlbnRzLmxvYWRlZCwgKCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLiRtb2RhbC5oYXNDbGFzcygnb3BlbicpKSB0aGlzLnNldHVwRm9jdXNUcmFwKCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuc2V0dXBGb2N1c1RyYXAoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJlc3RyYWluQ29udGVudEhlaWdodCh0aGlzLiRjb250ZW50KTtcbiAgICB9XG59XG5cbi8qKlxuICogUmV0dXJuIGFuIGFycmF5IG9mIG1vZGFsc1xuICogQHBhcmFtIHtzdHJpbmd9IHNlbGVjdG9yXG4gKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnNdXG4gKiBAcGFyYW0ge3N0cmluZ30gW29wdGlvbnMuc2l6ZV1cbiAqIEByZXR1cm5zIHthcnJheX1cbiAqL1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gbW9kYWxGYWN0b3J5KHNlbGVjdG9yID0gJ1tkYXRhLXJldmVhbF0nLCBvcHRpb25zID0ge30pIHtcbiAgICBjb25zdCAkbW9kYWxzID0gJChzZWxlY3Rvciwgb3B0aW9ucy4kY29udGV4dCk7XG5cbiAgICByZXR1cm4gJG1vZGFscy5tYXAoKGluZGV4LCBlbGVtZW50KSA9PiB7XG4gICAgICAgIGNvbnN0ICRtb2RhbCA9ICQoZWxlbWVudCk7XG4gICAgICAgIGNvbnN0IGluc3RhbmNlS2V5ID0gJ21vZGFsSW5zdGFuY2UnO1xuICAgICAgICBjb25zdCBjYWNoZWRNb2RhbCA9ICRtb2RhbC5kYXRhKGluc3RhbmNlS2V5KTtcblxuICAgICAgICBpZiAoY2FjaGVkTW9kYWwgaW5zdGFuY2VvZiBNb2RhbCkge1xuICAgICAgICAgICAgcmV0dXJuIGNhY2hlZE1vZGFsO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgbW9kYWwgPSBuZXcgTW9kYWwoJG1vZGFsLCBvcHRpb25zKTtcblxuICAgICAgICAkbW9kYWwuZGF0YShpbnN0YW5jZUtleSwgbW9kYWwpO1xuXG4gICAgICAgIHJldHVybiBtb2RhbDtcbiAgICB9KS50b0FycmF5KCk7XG59XG5cbi8qXG4gKiBSZXR1cm4gdGhlIGRlZmF1bHQgcGFnZSBtb2RhbFxuICovXG5leHBvcnQgZnVuY3Rpb24gZGVmYXVsdE1vZGFsKCkge1xuICAgIHJldHVybiBtb2RhbEZhY3RvcnkoJyNtb2RhbCcpWzBdO1xufVxuXG4vKlxuICogUmV0dXJuIHRoZSBkZWZhdWx0IGFsZXJ0IG1vZGFsXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBhbGVydE1vZGFsKCkge1xuICAgIHJldHVybiBtb2RhbEZhY3RvcnkoJyNhbGVydC1tb2RhbCcpWzBdO1xufVxuXG4vKlxuICogRGlzcGxheSB0aGUgZ2l2ZW4gbWVzc2FnZSBpbiB0aGUgZGVmYXVsdCBhbGVydCBtb2RhbFxuICovXG5leHBvcnQgZnVuY3Rpb24gc2hvd0FsZXJ0TW9kYWwobWVzc2FnZSwgb3B0aW9ucyA9IHt9KSB7XG4gICAgY29uc3QgbW9kYWwgPSBhbGVydE1vZGFsKCk7XG4gICAgY29uc3QgJGNhbmNlbEJ0biA9IG1vZGFsLiRtb2RhbC5maW5kKCcuY2FuY2VsJyk7XG4gICAgY29uc3QgJGNvbmZpcm1CdG4gPSBtb2RhbC4kbW9kYWwuZmluZCgnLmNvbmZpcm0nKTtcbiAgICBjb25zdCB7XG4gICAgICAgIGljb24gPSAnZXJyb3InLFxuICAgICAgICAkcHJlTW9kYWxGb2N1c2VkRWwgPSBudWxsLFxuICAgICAgICBzaG93Q2FuY2VsQnV0dG9uLFxuICAgICAgICBvbkNvbmZpcm0sXG4gICAgfSA9IG9wdGlvbnM7XG5cbiAgICBpZiAoJHByZU1vZGFsRm9jdXNlZEVsKSB7XG4gICAgICAgIG1vZGFsLiRwcmVNb2RhbEZvY3VzZWRFbCA9ICRwcmVNb2RhbEZvY3VzZWRFbDtcbiAgICB9XG5cbiAgICBtb2RhbC5vcGVuKCk7XG4gICAgbW9kYWwuJG1vZGFsLmZpbmQoJy5hbGVydC1pY29uJykuaGlkZSgpO1xuXG4gICAgaWYgKGljb24gPT09ICdlcnJvcicpIHtcbiAgICAgICAgbW9kYWwuJG1vZGFsLmZpbmQoJy5lcnJvci1pY29uJykuc2hvdygpO1xuICAgIH0gZWxzZSBpZiAoaWNvbiA9PT0gJ3dhcm5pbmcnKSB7XG4gICAgICAgIG1vZGFsLiRtb2RhbC5maW5kKCcud2FybmluZy1pY29uJykuc2hvdygpO1xuICAgIH1cblxuICAgIG1vZGFsLnVwZGF0ZUNvbnRlbnQoYDxzcGFuPiR7bWVzc2FnZX08L3NwYW4+YCk7XG5cbiAgICBpZiAob25Db25maXJtKSB7XG4gICAgICAgICRjb25maXJtQnRuLm9uKCdjbGljaycsIG9uQ29uZmlybSk7XG5cbiAgICAgICAgbW9kYWwuJG1vZGFsLm9uZShNb2RhbEV2ZW50cy5jbG9zZWQsICgpID0+IHtcbiAgICAgICAgICAgICRjb25maXJtQnRuLm9mZignY2xpY2snLCBvbkNvbmZpcm0pO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBpZiAoc2hvd0NhbmNlbEJ1dHRvbikge1xuICAgICAgICAkY2FuY2VsQnRuLnNob3coKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICAkY2FuY2VsQnRuLmhpZGUoKTtcbiAgICB9XG59XG4iLCJjb25zdCByZXZlYWxDbG9zZUF0dHIgPSAncmV2ZWFsQ2xvc2UnO1xuY29uc3QgcmV2ZWFsQ2xvc2VTZWxlY3RvciA9IGBbZGF0YS0ke3JldmVhbENsb3NlQXR0cn1dYDtcbmNvbnN0IHJldmVhbFNlbGVjdG9yID0gJ1tkYXRhLXJldmVhbF0nO1xuXG5jbGFzcyBSZXZlYWxDbG9zZSB7XG4gICAgY29uc3RydWN0b3IoJGJ1dHRvbikge1xuICAgICAgICB0aGlzLiRidXR0b24gPSAkYnV0dG9uO1xuICAgICAgICB0aGlzLm1vZGFsSWQgPSAkYnV0dG9uLmRhdGEocmV2ZWFsQ2xvc2VBdHRyKTtcblxuICAgICAgICB0aGlzLm9uQ2xpY2sgPSB0aGlzLm9uQ2xpY2suYmluZCh0aGlzKTtcblxuICAgICAgICB0aGlzLmJpbmRFdmVudHMoKTtcbiAgICB9XG5cbiAgICBnZXQgbW9kYWwoKSB7XG4gICAgICAgIGxldCAkbW9kYWw7XG5cbiAgICAgICAgaWYgKHRoaXMubW9kYWxJZCkge1xuICAgICAgICAgICAgJG1vZGFsID0gJChgIyR7dGhpcy5tb2RhbElkfWApO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgJG1vZGFsID0gdGhpcy4kYnV0dG9uLnBhcmVudHMocmV2ZWFsU2VsZWN0b3IpLmVxKDApO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuICRtb2RhbC5kYXRhKCdtb2RhbEluc3RhbmNlJyk7XG4gICAgfVxuXG4gICAgYmluZEV2ZW50cygpIHtcbiAgICAgICAgdGhpcy4kYnV0dG9uLm9uKCdjbGljaycsIHRoaXMub25DbGljayk7XG4gICAgfVxuXG4gICAgdW5iaW5kRXZlbnRzKCkge1xuICAgICAgICB0aGlzLiRidXR0b24ub2ZmKCdjbGljaycsIHRoaXMub25DbGljayk7XG4gICAgfVxuXG4gICAgb25DbGljayhldmVudCkge1xuICAgICAgICBjb25zdCB7IG1vZGFsIH0gPSB0aGlzO1xuXG4gICAgICAgIGlmIChtb2RhbCkge1xuICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgICAgICAgbW9kYWwuY2xvc2UoKTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuLypcbiAqIEV4dGVuZCBmb3VuZGF0aW9uLnJldmVhbCB3aXRoIHRoZSBhYmlsaXR5IHRvIGNsb3NlIGEgbW9kYWwgYnkgY2xpY2tpbmcgb24gYW55IG9mIGl0cyBjaGlsZCBlbGVtZW50XG4gKiB3aXRoIGRhdGEtcmV2ZWFsLWNsb3NlIGF0dHJpYnV0ZS5cbiAqXG4gKiBAZXhhbXBsZVxuICpcbiAqIDxkaXYgZGF0YS1yZXZlYWwgaWQ9XCJoZWxsb01vZGFsXCI+XG4gKiAgIDxidXR0b24gZGF0YS1yZXZlYWwtY2xvc2U+Q29udGludWU8L2J1dHRvbj5cbiAqIDwvZGl2PlxuICpcbiAqIDxkaXYgZGF0YS1yZXZlYWwgaWQ9XCJoZWxsb01vZGFsXCI+PC9kaXY+XG4gKiA8YnV0dG9uIGRhdGEtcmV2ZWFsLWNsb3NlPVwiaGVsbG9Nb2RhbFwiPkNvbnRpbnVlPC9idXR0b24+XG4gKi9cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIHJldmVhbENsb3NlRmFjdG9yeShzZWxlY3RvciA9IHJldmVhbENsb3NlU2VsZWN0b3IsIG9wdGlvbnMgPSB7fSkge1xuICAgIGNvbnN0ICRidXR0b25zID0gJChzZWxlY3Rvciwgb3B0aW9ucy4kY29udGV4dCk7XG5cbiAgICByZXR1cm4gJGJ1dHRvbnMubWFwKChpbmRleCwgZWxlbWVudCkgPT4ge1xuICAgICAgICBjb25zdCAkYnV0dG9uID0gJChlbGVtZW50KTtcbiAgICAgICAgY29uc3QgaW5zdGFuY2VLZXkgPSBgJHtyZXZlYWxDbG9zZUF0dHJ9SW5zdGFuY2VgO1xuICAgICAgICBjb25zdCBjYWNoZWRCdXR0b24gPSAkYnV0dG9uLmRhdGEoaW5zdGFuY2VLZXkpO1xuXG4gICAgICAgIGlmIChjYWNoZWRCdXR0b24gaW5zdGFuY2VvZiBSZXZlYWxDbG9zZSkge1xuICAgICAgICAgICAgcmV0dXJuIGNhY2hlZEJ1dHRvbjtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGJ1dHRvbiA9IG5ldyBSZXZlYWxDbG9zZSgkYnV0dG9uKTtcblxuICAgICAgICAkYnV0dG9uLmRhdGEoaW5zdGFuY2VLZXksIGJ1dHRvbik7XG5cbiAgICAgICAgcmV0dXJuIGJ1dHRvbjtcbiAgICB9KS50b0FycmF5KCk7XG59XG4iXSwibmFtZXMiOlsibW9kYWxGYWN0b3J5IiwicmV2ZWFsQ2xvc2VGYWN0b3J5IiwiJGVsZW1lbnQiLCJmb3VuZGF0aW9uIiwiZHJvcGRvd24iLCJhY3RpdmVfY2xhc3MiLCJyZXZlYWwiLCJiZ19jbGFzcyIsImRpc21pc3NfbW9kYWxfY2xhc3MiLCJjbG9zZV9vbl9iYWNrZ3JvdW5kX2NsaWNrIiwidGFiIiwiJGNvbnRleHQiLCJmb2N1c1RyYXAiLCJib2R5QWN0aXZlQ2xhc3MiLCJsb2FkaW5nT3ZlcmxheUNsYXNzIiwibW9kYWxCb2R5Q2xhc3MiLCJtb2RhbENvbnRlbnRDbGFzcyIsIlNpemVDbGFzc2VzIiwic21hbGwiLCJsYXJnZSIsIm5vcm1hbCIsIk1vZGFsRXZlbnRzIiwiY2xvc2UiLCJjbG9zZWQiLCJvcGVuIiwib3BlbmVkIiwibG9hZGVkIiwiZ2V0U2l6ZUZyb21Nb2RhbCIsIiRtb2RhbCIsImhhc0NsYXNzIiwiZ2V0Vmlld3BvcnRIZWlnaHQiLCJtdWx0aXBsZXIiLCJ2aWV3cG9ydEhlaWdodCIsIiQiLCJ3aW5kb3ciLCJoZWlnaHQiLCJ3cmFwTW9kYWxCb2R5IiwiY29udGVudCIsIiRtb2RhbEJvZHkiLCJhZGRDbGFzcyIsImh0bWwiLCJyZXN0cmFpbkNvbnRlbnRIZWlnaHQiLCIkY29udGVudCIsImxlbmd0aCIsIiRib2R5IiwiYm9keUhlaWdodCIsIm91dGVySGVpZ2h0IiwiY29udGVudEhlaWdodCIsIm1heEhlaWdodCIsImNzcyIsImNyZWF0ZU1vZGFsQ29udGVudCIsImV4aXN0aW5nQ29udGVudCIsImNoaWxkcmVuIiwiYXBwZW5kIiwiYXBwZW5kVG8iLCJjcmVhdGVMb2FkaW5nT3ZlcmxheSIsIiRsb2FkaW5nT3ZlcmxheSIsIk1vZGFsIiwiX3RlbXAiLCJfcmVmIiwiX3JlZiRzaXplIiwic2l6ZSIsIiRvdmVybGF5IiwiZGVmYXVsdFNpemUiLCJwZW5kaW5nIiwiJHByZU1vZGFsRm9jdXNlZEVsIiwib25Nb2RhbE9wZW4iLCJiaW5kIiwib25Nb2RhbE9wZW5lZCIsIm9uTW9kYWxDbG9zZSIsIm9uTW9kYWxDbG9zZWQiLCJiaW5kRXZlbnRzIiwib24iLCJlIiwic3RvcFByb3BhZ2F0aW9uIiwiX3Byb3RvIiwicHJvdG90eXBlIiwiX3RlbXAyIiwiX3JlZjIiLCJfcmVmMiRwZW5kaW5nIiwiX3JlZjIkY2xlYXJDb250ZW50IiwiY2xlYXJDb250ZW50IiwidXBkYXRlQ29udGVudCIsIl90ZW1wMyIsIl9yZWYzIiwiX3JlZjMkd3JhcCIsIndyYXAiLCJ0cmlnZ2VyIiwic2V0dXBGb2N1c1RyYXAiLCJfdGhpcyIsImRvY3VtZW50IiwiYWN0aXZlRWxlbWVudCIsImNyZWF0ZUZvY3VzVHJhcCIsImVzY2FwZURlYWN0aXZhdGVzIiwicmV0dXJuRm9jdXNPbkRlYWN0aXZhdGUiLCJhbGxvd091dHNpZGVDbGljayIsImZhbGxiYWNrRm9jdXMiLCJmYWxsYmFja05vZGUiLCJkZWFjdGl2YXRlIiwiYWN0aXZhdGUiLCJyZW1vdmVDbGFzcyIsImZvY3VzIiwiX3RoaXMyIiwib25lIiwiX2NyZWF0ZUNsYXNzIiwia2V5IiwiZ2V0IiwiX3BlbmRpbmciLCJzZXQiLCJzaG93IiwiaGlkZSIsIl9zaXplIiwic2VsZWN0b3IiLCJvcHRpb25zIiwiJG1vZGFscyIsIm1hcCIsImluZGV4IiwiZWxlbWVudCIsImluc3RhbmNlS2V5IiwiY2FjaGVkTW9kYWwiLCJkYXRhIiwibW9kYWwiLCJ0b0FycmF5IiwiZGVmYXVsdE1vZGFsIiwiYWxlcnRNb2RhbCIsInNob3dBbGVydE1vZGFsIiwibWVzc2FnZSIsIiRjYW5jZWxCdG4iLCJmaW5kIiwiJGNvbmZpcm1CdG4iLCJfb3B0aW9ucyIsIl9vcHRpb25zJGljb24iLCJpY29uIiwiX29wdGlvbnMkJHByZU1vZGFsRm9jIiwic2hvd0NhbmNlbEJ1dHRvbiIsIm9uQ29uZmlybSIsIm9mZiIsInJldmVhbENsb3NlQXR0ciIsInJldmVhbENsb3NlU2VsZWN0b3IiLCJyZXZlYWxTZWxlY3RvciIsIlJldmVhbENsb3NlIiwiJGJ1dHRvbiIsIm1vZGFsSWQiLCJvbkNsaWNrIiwidW5iaW5kRXZlbnRzIiwiZXZlbnQiLCJwcmV2ZW50RGVmYXVsdCIsInBhcmVudHMiLCJlcSIsIiRidXR0b25zIiwiY2FjaGVkQnV0dG9uIiwiYnV0dG9uIl0sInNvdXJjZVJvb3QiOiIifQ==
