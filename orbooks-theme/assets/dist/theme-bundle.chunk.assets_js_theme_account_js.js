"use strict";
(self["webpackChunkbigcommerce_cornerstone"] = self["webpackChunkbigcommerce_cornerstone"] || []).push([["assets_js_theme_account_js"],{

/***/ "./assets/js/theme/account.js":
/*!************************************!*\
  !*** ./assets/js/theme/account.js ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Account)
/* harmony export */ });
/* harmony import */ var lodash_find__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! lodash/find */ "./node_modules/lodash/find.js");
/* harmony import */ var lodash_find__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lodash_find__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var lodash_reduce__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! lodash/reduce */ "./node_modules/lodash/reduce.js");
/* harmony import */ var lodash_reduce__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(lodash_reduce__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _page_manager__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./page-manager */ "./assets/js/theme/page-manager.js");
/* harmony import */ var _common_nod__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./common/nod */ "./assets/js/theme/common/nod.js");
/* harmony import */ var _wishlist__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./wishlist */ "./assets/js/theme/wishlist.js");
/* harmony import */ var _common_form_validation__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./common/form-validation */ "./assets/js/theme/common/form-validation.js");
/* harmony import */ var _common_state_country__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./common/state-country */ "./assets/js/theme/common/state-country.js");
/* harmony import */ var _common_utils_form_utils__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./common/utils/form-utils */ "./assets/js/theme/common/utils/form-utils.js");
/* harmony import */ var _common_utils_translations_utils__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./common/utils/translations-utils */ "./assets/js/theme/common/utils/translations-utils.js");
/* harmony import */ var _common_payment_method__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./common/payment-method */ "./assets/js/theme/common/payment-method.js");
/* harmony import */ var _global_modal__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./global/modal */ "./assets/js/theme/global/modal.js");
/* harmony import */ var _global_compare_products__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./global/compare-products */ "./assets/js/theme/global/compare-products.js");
/* provided dependency */ var $ = __webpack_require__(/*! jquery */ "./node_modules/jquery/dist/jquery.min.js");


function _inheritsLoose(t, o) { t.prototype = Object.create(o.prototype), t.prototype.constructor = t, _setPrototypeOf(t, o); }
function _setPrototypeOf(t, e) { return _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) { return t.__proto__ = e, t; }, _setPrototypeOf(t, e); }










var Account = /*#__PURE__*/function (_PageManager) {
  function Account(context) {
    var _this;
    _this = _PageManager.call(this, context) || this;
    _this.validationDictionary = (0,_common_utils_translations_utils__WEBPACK_IMPORTED_MODULE_8__.createTranslationDictionary)(context);
    _this.$state = $('[data-field-type="State"]');
    _this.$body = $('body');
    return _this;
  }
  _inheritsLoose(Account, _PageManager);
  var _proto = Account.prototype;
  _proto.onReady = function onReady() {
    var $editAccountForm = (0,_common_utils_form_utils__WEBPACK_IMPORTED_MODULE_7__.classifyForm)('form[data-edit-account-form]');
    var $addressForm = (0,_common_utils_form_utils__WEBPACK_IMPORTED_MODULE_7__.classifyForm)('form[data-address-form]');
    var $inboxForm = (0,_common_utils_form_utils__WEBPACK_IMPORTED_MODULE_7__.classifyForm)('form[data-inbox-form]');
    var $accountReturnForm = (0,_common_utils_form_utils__WEBPACK_IMPORTED_MODULE_7__.classifyForm)('[data-account-return-form]');
    var $paymentMethodForm = (0,_common_utils_form_utils__WEBPACK_IMPORTED_MODULE_7__.classifyForm)('form[data-payment-method-form]');
    var $reorderForm = (0,_common_utils_form_utils__WEBPACK_IMPORTED_MODULE_7__.classifyForm)('[data-account-reorder-form]');
    var $invoiceButton = $('[data-print-invoice]');
    var $bigCommerce = window.BigCommerce;
    (0,_global_compare_products__WEBPACK_IMPORTED_MODULE_11__["default"])(this.context);

    // Injected via template
    this.passwordRequirements = this.context.passwordRequirements;

    // Instantiates wish list JS
    _wishlist__WEBPACK_IMPORTED_MODULE_4__["default"].load(this.context);
    if ($editAccountForm.length) {
      this.registerEditAccountValidation($editAccountForm);
      if (this.$state.is('input')) {
        (0,_common_utils_form_utils__WEBPACK_IMPORTED_MODULE_7__.insertStateHiddenField)(this.$state);
      }
    }
    if ($invoiceButton.length) {
      $invoiceButton.on('click', function () {
        var left = window.screen.availWidth / 2 - 450;
        var top = window.screen.availHeight / 2 - 320;
        var url = $invoiceButton.data('printInvoice');
        window.open(url, 'orderInvoice', "width=900,height=650,left=" + left + ",top=" + top + ",scrollbars=1");
      });
    }
    if ($addressForm.length) {
      this.initAddressFormValidation($addressForm);
      if (this.$state.is('input')) {
        (0,_common_utils_form_utils__WEBPACK_IMPORTED_MODULE_7__.insertStateHiddenField)(this.$state);
      }
    }
    if ($inboxForm.length) {
      this.registerInboxValidation($inboxForm);
    }
    if ($accountReturnForm.length) {
      this.initAccountReturnFormValidation($accountReturnForm);
    }
    if ($paymentMethodForm.length) {
      this.initPaymentMethodFormValidation($paymentMethodForm);
    }
    if ($reorderForm.length) {
      this.initReorderForm($reorderForm);
    }
    if ($bigCommerce && $bigCommerce.renderAccountPayments) {
      var _this$context = this.context,
        countries = _this$context.countries,
        paymentsUrl = _this$context.paymentsUrl,
        storeHash = _this$context.storeHash,
        storeLocale = _this$context.storeLocale,
        vaultToken = _this$context.vaultToken,
        shopperId = _this$context.shopperId,
        customerEmail = _this$context.customerEmail,
        providerId = _this$context.providerId,
        currencyCode = _this$context.currencyCode,
        paymentMethodsUrl = _this$context.paymentMethodsUrl,
        paymentProviderInitializationData = _this$context.paymentProviderInitializationData,
        themeSettings = _this$context.themeSettings;
      $bigCommerce.renderAccountPayments({
        styles: {
          inputBase: {
            color: themeSettings['input-font-color'],
            borderColor: themeSettings['input-border-color']
          },
          inputValidationError: {
            color: themeSettings['color-error'],
            borderColor: themeSettings['color-error']
          },
          inputValidationSuccess: {
            color: themeSettings['color-success'],
            borderColor: themeSettings['color-success']
          },
          submitButton: {
            color: themeSettings['button--primary-color'],
            backgroundColor: themeSettings['button--primary-backgroundColor'],
            borderColor: themeSettings['button--primary-backgroundColor'],
            '&:hover': {
              color: themeSettings['button--primary-colorHover'],
              backgroundColor: themeSettings['button--primary-backgroundColorHover'],
              borderColor: themeSettings['button--primary-backgroundColorHover']
            },
            '&:active': {
              color: themeSettings['button--primary-colorActive'],
              backgroundColor: themeSettings['button--primary-backgroundColorActive'],
              borderColor: themeSettings['button--primary-backgroundColorActive']
            },
            '&[disabled]': {
              backgroundColor: themeSettings['button--disabled-backgroundColor'],
              borderColor: themeSettings['button--disabled-borderColor'],
              color: themeSettings['button--disabled-color'],
              cursor: 'not-allowed'
            }
          },
          cancelButton: {
            color: themeSettings['button--default-color'],
            backgroundColor: 'transparent',
            borderColor: themeSettings['button--default-borderColor'],
            '&:hover': {
              color: themeSettings['button--default-colorHover'],
              backgroundColor: 'transparent',
              borderColor: themeSettings['button--default-borderColorHover']
            },
            '&:active': {
              color: themeSettings['button--default-colorActive'],
              backgroundColor: 'transparent',
              borderColor: themeSettings['button--default-borderColorActive']
            }
          },
          label: {
            color: themeSettings['form-label-font-color']
          },
          validationError: {
            color: themeSettings['color-error']
          },
          heading: {
            color: themeSettings['color-textHeading']
          }
        },
        storeContextData: {
          countries: countries,
          paymentsUrl: paymentsUrl,
          storeHash: storeHash,
          storeLocale: storeLocale,
          vaultToken: vaultToken,
          shopperId: shopperId,
          customerEmail: customerEmail,
          providerId: providerId,
          currencyCode: currencyCode,
          paymentMethodsUrl: paymentMethodsUrl,
          paymentProviderInitializationData: paymentProviderInitializationData
        },
        errorHandler: _global_modal__WEBPACK_IMPORTED_MODULE_10__.showAlertModal
      });
    }
    this.bindDeleteAddress();
    this.bindDeletePaymentMethod();
  }

  /**
   * Binds a submit hook to ensure the customer receives a confirmation dialog before deleting an address
   */;
  _proto.bindDeleteAddress = function bindDeleteAddress() {
    $('[data-delete-address]').on('submit', function (event) {
      var message = $(event.currentTarget).data('deleteAddress');
      if (!window.confirm(message)) {
        event.preventDefault();
      }
    });
  };
  _proto.bindDeletePaymentMethod = function bindDeletePaymentMethod() {
    $('[data-delete-payment-method]').on('submit', function (event) {
      var message = $(event.currentTarget).data('deletePaymentMethod');
      if (!window.confirm(message)) {
        event.preventDefault();
      }
    });
  };
  _proto.initReorderForm = function initReorderForm($reorderForm) {
    var _this2 = this;
    $reorderForm.on('submit', function (event) {
      var $productReorderCheckboxes = $('.account-listItem .form-checkbox:checked');
      var submitForm = false;
      $reorderForm.find('[name^="reorderitem"]').remove();
      $productReorderCheckboxes.each(function (index, productCheckbox) {
        var productId = $(productCheckbox).val();
        var $input = $('<input>', {
          type: 'hidden',
          name: "reorderitem[" + productId + "]",
          value: '1'
        });
        submitForm = true;
        $reorderForm.append($input);
      });
      if (!submitForm) {
        event.preventDefault();
        (0,_global_modal__WEBPACK_IMPORTED_MODULE_10__.showAlertModal)(_this2.context.selectItem);
      }
    });
  };
  _proto.initAddressFormValidation = function initAddressFormValidation($addressForm) {
    var _this3 = this;
    var validationModel = (0,_common_form_validation__WEBPACK_IMPORTED_MODULE_5__["default"])($addressForm, this.context);
    var stateSelector = 'form[data-address-form] [data-field-type="State"]';
    var $stateElement = $(stateSelector);
    var addressValidator = (0,_common_nod__WEBPACK_IMPORTED_MODULE_3__["default"])({
      submit: 'form[data-address-form] input[type="submit"]',
      tap: _common_utils_form_utils__WEBPACK_IMPORTED_MODULE_7__.announceInputErrorMessage
    });
    addressValidator.add(validationModel);
    if ($stateElement) {
      var $last;

      // Requests the states for a country with AJAX
      (0,_common_state_country__WEBPACK_IMPORTED_MODULE_6__["default"])($stateElement, this.context, function (err, field) {
        if (err) {
          throw new Error(err);
        }
        var $field = $(field);
        if (addressValidator.getStatus($stateElement) !== 'undefined') {
          addressValidator.remove($stateElement);
        }
        if ($last) {
          addressValidator.remove($last);
        }
        if ($field.is('select')) {
          $last = field;
          _common_utils_form_utils__WEBPACK_IMPORTED_MODULE_7__.Validators.setStateCountryValidation(addressValidator, field, _this3.validationDictionary.field_not_blank);
        } else {
          _common_utils_form_utils__WEBPACK_IMPORTED_MODULE_7__.Validators.cleanUpStateValidation(field);
        }
      });
    }
    $addressForm.on('submit', function (event) {
      addressValidator.performCheck();
      if (addressValidator.areAll('valid')) {
        return;
      }
      event.preventDefault();
    });
  };
  _proto.initAccountReturnFormValidation = function initAccountReturnFormValidation($accountReturnForm) {
    var errorMessage = $accountReturnForm.data('accountReturnFormError');
    $accountReturnForm.on('submit', function (event) {
      var formSubmit = false;

      // Iterate until we find a non-zero value in the dropdown for quantity
      $('[name^="return_qty"]', $accountReturnForm).each(function (i, ele) {
        if (parseInt($(ele).val(), 10) !== 0) {
          formSubmit = true;

          // Exit out of loop if we found at least one return
          return true;
        }
      });
      if (formSubmit) {
        return true;
      }
      (0,_global_modal__WEBPACK_IMPORTED_MODULE_10__.showAlertModal)(errorMessage);
      return event.preventDefault();
    });
  };
  _proto.initPaymentMethodFormValidation = function initPaymentMethodFormValidation($paymentMethodForm) {
    var _this4 = this;
    // Inject validations into form fields before validation runs
    $paymentMethodForm.find('#first_name.form-field').attr('data-validation', "{ \"type\": \"singleline\", \"label\": \"" + this.context.firstNameLabel + "\", \"required\": true, \"maxlength\": 0 }");
    $paymentMethodForm.find('#last_name.form-field').attr('data-validation', "{ \"type\": \"singleline\", \"label\": \"" + this.context.lastNameLabel + "\", \"required\": true, \"maxlength\": 0 }");
    $paymentMethodForm.find('#company.form-field').attr('data-validation', "{ \"type\": \"singleline\", \"label\": \"" + this.context.companyLabel + "\", \"required\": false, \"maxlength\": 0 }");
    $paymentMethodForm.find('#phone.form-field').attr('data-validation', "{ \"type\": \"singleline\", \"label\": \"" + this.context.phoneLabel + "\", \"required\": false, \"maxlength\": 0 }");
    $paymentMethodForm.find('#address1.form-field').attr('data-validation', "{ \"type\": \"singleline\", \"label\": \"" + this.context.address1Label + "\", \"required\": true, \"maxlength\": 0 }");
    $paymentMethodForm.find('#address2.form-field').attr('data-validation', "{ \"type\": \"singleline\", \"label\": \"" + this.context.address2Label + "\", \"required\": false, \"maxlength\": 0 }");
    $paymentMethodForm.find('#city.form-field').attr('data-validation', "{ \"type\": \"singleline\", \"label\": \"" + this.context.cityLabel + "\", \"required\": true, \"maxlength\": 0 }");
    $paymentMethodForm.find('#country.form-field').attr('data-validation', "{ \"type\": \"singleselect\", \"label\": \"" + this.context.countryLabel + "\", \"required\": true, \"prefix\": \"" + this.context.chooseCountryLabel + "\" }");
    $paymentMethodForm.find('#state.form-field').attr('data-validation', "{ \"type\": \"singleline\", \"label\": \"" + this.context.stateLabel + "\", \"required\": true, \"maxlength\": 0 }");
    $paymentMethodForm.find('#postal_code.form-field').attr('data-validation', "{ \"type\": \"singleline\", \"label\": \"" + this.context.postalCodeLabel + "\", \"required\": true, \"maxlength\": 0 }");
    var validationModel = (0,_common_form_validation__WEBPACK_IMPORTED_MODULE_5__["default"])($paymentMethodForm, this.context);
    var paymentMethodSelector = 'form[data-payment-method-form]';
    var paymentMethodValidator = (0,_common_nod__WEBPACK_IMPORTED_MODULE_3__["default"])({
      submit: paymentMethodSelector + " input[type=\"submit\"]",
      tap: _common_utils_form_utils__WEBPACK_IMPORTED_MODULE_7__.announceInputErrorMessage
    });
    var $stateElement = $(paymentMethodSelector + " [data-field-type=\"State\"]");
    var $last;
    // Requests the states for a country with AJAX
    (0,_common_state_country__WEBPACK_IMPORTED_MODULE_6__["default"])($stateElement, this.context, function (err, field) {
      if (err) {
        throw new Error(err);
      }
      var $field = $(field);
      if (paymentMethodValidator.getStatus($stateElement) !== 'undefined') {
        paymentMethodValidator.remove($stateElement);
      }
      if ($last) {
        paymentMethodValidator.remove($last);
      }
      if ($field.is('select')) {
        $last = field;
        _common_utils_form_utils__WEBPACK_IMPORTED_MODULE_7__.Validators.setStateCountryValidation(paymentMethodValidator, field, _this4.validationDictionary.field_not_blank);
      } else {
        _common_utils_form_utils__WEBPACK_IMPORTED_MODULE_7__.Validators.cleanUpStateValidation(field);
      }
    });

    // Use credit card number input listener to highlight credit card type
    var cardType;
    $(paymentMethodSelector + " input[name=\"credit_card_number\"]").on('keyup', function (_ref) {
      var target = _ref.target;
      cardType = (0,_common_payment_method__WEBPACK_IMPORTED_MODULE_9__.creditCardType)(target.value);
      if (cardType) {
        $(paymentMethodSelector + " img[alt=\"" + cardType + "\"]").siblings().css('opacity', '.2');
      } else {
        $(paymentMethodSelector + " img").css('opacity', '1');
      }
    });

    // Set of credit card validation
    _common_payment_method__WEBPACK_IMPORTED_MODULE_9__.Validators.setCreditCardNumberValidation(paymentMethodValidator, paymentMethodSelector + " input[name=\"credit_card_number\"]", this.context.creditCardNumber);
    _common_payment_method__WEBPACK_IMPORTED_MODULE_9__.Validators.setExpirationValidation(paymentMethodValidator, paymentMethodSelector + " input[name=\"expiration\"]", this.context.expiration);
    _common_payment_method__WEBPACK_IMPORTED_MODULE_9__.Validators.setNameOnCardValidation(paymentMethodValidator, paymentMethodSelector + " input[name=\"name_on_card\"]", this.context.nameOnCard);
    _common_payment_method__WEBPACK_IMPORTED_MODULE_9__.Validators.setCvvValidation(paymentMethodValidator, paymentMethodSelector + " input[name=\"cvv\"]", this.context.cvv, function () {
      return cardType;
    });

    // Set of credit card format
    _common_payment_method__WEBPACK_IMPORTED_MODULE_9__.Formatters.setCreditCardNumberFormat(paymentMethodSelector + " input[name=\"credit_card_number\"]");
    _common_payment_method__WEBPACK_IMPORTED_MODULE_9__.Formatters.setExpirationFormat(paymentMethodSelector + " input[name=\"expiration\"]");

    // Billing address validation
    paymentMethodValidator.add(validationModel);
    $paymentMethodForm.on('submit', function (event) {
      event.preventDefault();
      // Perform final form validation
      paymentMethodValidator.performCheck();
      if (paymentMethodValidator.areAll('valid')) {
        // Serialize form data and reduce it to object
        var data = lodash_reduce__WEBPACK_IMPORTED_MODULE_1___default()($paymentMethodForm.serializeArray(), function (obj, item) {
          var refObj = obj;
          refObj[item.name] = item.value;
          return refObj;
        }, {});

        // Assign country and state code
        var country = lodash_find__WEBPACK_IMPORTED_MODULE_0___default()(_this4.context.countries, function (_ref2) {
          var value = _ref2.value;
          return value === data.country;
        });
        var state = country && lodash_find__WEBPACK_IMPORTED_MODULE_0___default()(country.states, function (_ref3) {
          var value = _ref3.value;
          return value === data.state;
        });
        data.country_code = country ? country.code : data.country;
        data.state_or_province_code = state ? state.code : data.state;

        // Default Instrument
        data.default_instrument = !!data.default_instrument;

        // Store credit card
        (0,_common_payment_method__WEBPACK_IMPORTED_MODULE_9__.storeInstrument)(_this4.context, data, function () {
          window.location.href = _this4.context.paymentMethodsUrl;
        }, function () {
          (0,_global_modal__WEBPACK_IMPORTED_MODULE_10__.showAlertModal)(_this4.context.generic_error);
        });
      }
    });
  };
  _proto.registerEditAccountValidation = function registerEditAccountValidation($editAccountForm) {
    var validationModel = (0,_common_form_validation__WEBPACK_IMPORTED_MODULE_5__["default"])($editAccountForm, this.context);
    var formEditSelector = 'form[data-edit-account-form]';
    var editValidator = (0,_common_nod__WEBPACK_IMPORTED_MODULE_3__["default"])({
      submit: '${formEditSelector} input[type="submit"]',
      delay: 900
    });
    var emailSelector = formEditSelector + " [data-field-type=\"EmailAddress\"]";
    var $emailElement = $(emailSelector);
    var passwordSelector = formEditSelector + " [data-field-type=\"Password\"]";
    var $passwordElement = $(passwordSelector);
    var password2Selector = formEditSelector + " [data-field-type=\"ConfirmPassword\"]";
    var $password2Element = $(password2Selector);
    var currentPasswordSelector = formEditSelector + " [data-field-type=\"CurrentPassword\"]";
    var $currentPassword = $(currentPasswordSelector);

    // This only handles the custom fields, standard fields are added below
    editValidator.add(validationModel);
    if ($emailElement) {
      editValidator.remove(emailSelector);
      _common_utils_form_utils__WEBPACK_IMPORTED_MODULE_7__.Validators.setEmailValidation(editValidator, emailSelector, this.validationDictionary.valid_email);
    }
    if ($passwordElement && $password2Element) {
      var _this$validationDicti = this.validationDictionary,
        enterPassword = _this$validationDicti.password,
        matchPassword = _this$validationDicti.password_match;
      editValidator.remove(passwordSelector);
      editValidator.remove(password2Selector);
      _common_utils_form_utils__WEBPACK_IMPORTED_MODULE_7__.Validators.setPasswordValidation(editValidator, passwordSelector, password2Selector, this.passwordRequirements, (0,_common_utils_form_utils__WEBPACK_IMPORTED_MODULE_7__.createPasswordValidationErrorTextObject)(enterPassword, enterPassword, matchPassword, this.passwordRequirements.error), true);
    }
    if ($currentPassword) {
      editValidator.add({
        selector: currentPasswordSelector,
        validate: function validate(cb, val) {
          var result = true;
          if (val === '' && $passwordElement.val() !== '') {
            result = false;
          }
          cb(result);
        },
        errorMessage: this.context.currentPassword
      });
    }
    editValidator.add([{
      selector: formEditSelector + " input[name='account_firstname']",
      validate: function validate(cb, val) {
        var result = val.length;
        cb(result);
      },
      errorMessage: this.context.firstName
    }, {
      selector: formEditSelector + " input[name='account_lastname']",
      validate: function validate(cb, val) {
        var result = val.length;
        cb(result);
      },
      errorMessage: this.context.lastName
    }]);
    $editAccountForm.on('submit', function (event) {
      editValidator.performCheck();
      if (editValidator.areAll('valid')) {
        return;
      }
      event.preventDefault();
      setTimeout(function () {
        var earliestError = $('span.form-inlineMessage:first').prev('input');
        earliestError.focus();
      }, 900);
    });
  };
  _proto.registerInboxValidation = function registerInboxValidation($inboxForm) {
    var inboxValidator = (0,_common_nod__WEBPACK_IMPORTED_MODULE_3__["default"])({
      submit: 'form[data-inbox-form] input[type="submit"]',
      delay: 900
    });
    inboxValidator.add([{
      selector: 'form[data-inbox-form] select[name="message_order_id"]',
      validate: function validate(cb, val) {
        var result = Number(val) !== 0;
        cb(result);
      },
      errorMessage: this.context.enterOrderNum
    }, {
      selector: 'form[data-inbox-form] input[name="message_subject"]',
      validate: function validate(cb, val) {
        var result = val.length;
        cb(result);
      },
      errorMessage: this.context.enterSubject
    }, {
      selector: 'form[data-inbox-form] textarea[name="message_content"]',
      validate: function validate(cb, val) {
        var result = val.length;
        cb(result);
      },
      errorMessage: this.context.enterMessage
    }]);
    $inboxForm.on('submit', function (event) {
      inboxValidator.performCheck();
      if (inboxValidator.areAll('valid')) {
        return;
      }
      event.preventDefault();
      setTimeout(function () {
        var earliestError = $('span.form-inlineMessage:first').prev('input');
        earliestError.focus();
      }, 900);
    });
  };
  return Account;
}(_page_manager__WEBPACK_IMPORTED_MODULE_2__["default"]);


/***/ }),

/***/ "./assets/js/theme/common/payment-method.js":
/*!**************************************************!*\
  !*** ./assets/js/theme/common/payment-method.js ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Formatters: () => (/* binding */ Formatters),
/* harmony export */   Validators: () => (/* binding */ Validators),
/* harmony export */   creditCardType: () => (/* binding */ creditCardType),
/* harmony export */   storeInstrument: () => (/* binding */ storeInstrument)
/* harmony export */ });
/* harmony import */ var creditcards__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! creditcards */ "./node_modules/creditcards/index.js");
/* harmony import */ var creditcards__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(creditcards__WEBPACK_IMPORTED_MODULE_0__);
/* provided dependency */ var $ = __webpack_require__(/*! jquery */ "./node_modules/jquery/dist/jquery.min.js");


/**
 * Omit null or empty string properties of object
 * @param {Object} object
 * @returns {Object}
 */
var omitNullString = function omitNullString(obj) {
  var refObj = obj;
  $.each(refObj, function (key, value) {
    if (value === null || value === '') {
      delete refObj[key];
    }
  });
  return refObj;
};

/**
 * Get credit card type from credit card number
 * @param {string} value
 */
var creditCardType = function creditCardType(value) {
  return creditcards__WEBPACK_IMPORTED_MODULE_0___default().card.type(creditcards__WEBPACK_IMPORTED_MODULE_0___default().card.parse(value), true);
};

/**
 * Wrapper for ajax request to store a new instrument in bigpay
 * @param {object} Representing the data needed for the header
 * @param {object} Representing the data needed for the body
 * @param {function} done Function to execute on a successful response
 * @param {function} fail Function to execute on a unsuccessful response
 */
var storeInstrument = function storeInstrument(_ref, _ref2, done, fail) {
  var paymentsUrl = _ref.paymentsUrl,
    shopperId = _ref.shopperId,
    storeHash = _ref.storeHash,
    vaultToken = _ref.vaultToken;
  var provider_id = _ref2.provider_id,
    currency_code = _ref2.currency_code,
    credit_card_number = _ref2.credit_card_number,
    expiration = _ref2.expiration,
    name_on_card = _ref2.name_on_card,
    cvv = _ref2.cvv,
    default_instrument = _ref2.default_instrument,
    address1 = _ref2.address1,
    address2 = _ref2.address2,
    city = _ref2.city,
    postal_code = _ref2.postal_code,
    state_or_province_code = _ref2.state_or_province_code,
    country_code = _ref2.country_code,
    company = _ref2.company,
    first_name = _ref2.first_name,
    last_name = _ref2.last_name,
    email = _ref2.email,
    phone = _ref2.phone;
  var expiry = expiration.split('/');
  $.ajax({
    url: paymentsUrl + "/stores/" + storeHash + "/customers/" + shopperId + "/stored_instruments",
    dataType: 'json',
    method: 'POST',
    cache: false,
    headers: {
      Authorization: vaultToken,
      Accept: 'application/vnd.bc.v1+json',
      'Content-Type': 'application/vnd.bc.v1+json'
    },
    data: JSON.stringify({
      instrument: {
        type: 'card',
        cardholder_name: name_on_card,
        number: creditcards__WEBPACK_IMPORTED_MODULE_0___default().card.parse(credit_card_number),
        expiry_month: creditcards__WEBPACK_IMPORTED_MODULE_0___default().expiration.month.parse(expiry[0]),
        expiry_year: creditcards__WEBPACK_IMPORTED_MODULE_0___default().expiration.year.parse(expiry[1], true),
        verification_value: cvv
      },
      billing_address: omitNullString({
        address1: address1,
        address2: address2,
        city: city,
        postal_code: postal_code,
        state_or_province_code: state_or_province_code,
        country_code: country_code,
        company: company,
        first_name: first_name,
        last_name: last_name,
        email: email,
        phone: phone
      }),
      provider_id: provider_id,
      default_instrument: default_instrument,
      currency_code: currency_code
    })
  }).done(done).fail(fail);
};
var Formatters = {
  /**
   * Sets up a format for credit card number
   * @param field
   */
  setCreditCardNumberFormat: function setCreditCardNumberFormat(field) {
    if (field) {
      $(field).on('keyup', function (_ref3) {
        var target = _ref3.target;
        var refTarget = target;
        refTarget.value = creditcards__WEBPACK_IMPORTED_MODULE_0___default().card.format(creditcards__WEBPACK_IMPORTED_MODULE_0___default().card.parse(target.value));
      });
    }
  },
  /**
   * Sets up a format for expiration date
   * @param field
   */
  setExpirationFormat: function setExpirationFormat(field) {
    if (field) {
      $(field).on('keyup', function (_ref4) {
        var target = _ref4.target,
          which = _ref4.which;
        var refTarget = target;
        if (which === 8 && /.*(\/)$/.test(target.value)) {
          refTarget.value = target.value.slice(0, -1);
        } else if (target.value.length > 4) {
          refTarget.value = target.value.slice(0, 5);
        } else if (which !== 8) {
          refTarget.value = target.value.replace(/^([1-9]\/|[2-9])$/g, '0$1/').replace(/^(0[1-9]|1[0-2])$/g, '$1/').replace(/^([0-1])([3-9])$/g, '0$1/$2').replace(/^(0[1-9]|1[0-2])([0-9]{2})$/g, '$1/$2').replace(/^([0]+)\/|[0]+$/g, '0').replace(/[^\d\/]|^[\/]*$/g, '').replace(/\/\//g, '/');
        }
      });
    }
  }
};
var Validators = {
  /**
   * Sets up a validation for credit card number
   * @param validator
   * @param field
   * @param errorMessage
   */
  setCreditCardNumberValidation: function setCreditCardNumberValidation(validator, field, errorMessage) {
    if (field) {
      validator.add({
        selector: field,
        validate: function validate(cb, val) {
          var result = val.length && creditcards__WEBPACK_IMPORTED_MODULE_0___default().card.isValid(creditcards__WEBPACK_IMPORTED_MODULE_0___default().card.parse(val));
          cb(result);
        },
        errorMessage: errorMessage
      });
    }
  },
  /**
   * Sets up a validation for expiration date
   * @param validator
   * @param field
   * @param errorMessage
   */
  setExpirationValidation: function setExpirationValidation(validator, field, errorMessage) {
    if (field) {
      validator.add({
        selector: field,
        validate: function validate(cb, val) {
          var expiry = val.split('/');
          var result = val.length && /^(0[1-9]|1[0-2])\/([0-9]{2})$/.test(val);
          result = result && !creditcards__WEBPACK_IMPORTED_MODULE_0___default().expiration.isPast(creditcards__WEBPACK_IMPORTED_MODULE_0___default().expiration.month.parse(expiry[0]), creditcards__WEBPACK_IMPORTED_MODULE_0___default().expiration.year.parse(expiry[1], true));
          cb(result);
        },
        errorMessage: errorMessage
      });
    }
  },
  /**
   * Sets up a validation for name on card
   * @param validator
   * @param field
   * @param errorMessage
   */
  setNameOnCardValidation: function setNameOnCardValidation(validator, field, errorMessage) {
    if (field) {
      validator.add({
        selector: field,
        validate: function validate(cb, val) {
          var result = !!val.length;
          cb(result);
        },
        errorMessage: errorMessage
      });
    }
  },
  /**
   * Sets up a validation for cvv
   * @param validator
   * @param field
   * @param errorMessage
   * @param {any} cardType The credit card number type
   */
  setCvvValidation: function setCvvValidation(validator, field, errorMessage, cardType) {
    if (field) {
      validator.add({
        selector: field,
        validate: function validate(cb, val) {
          var type = typeof cardType === 'function' ? cardType() : cardType;
          var result = val.length && creditcards__WEBPACK_IMPORTED_MODULE_0___default().cvc.isValid(val, type);
          cb(result);
        },
        errorMessage: errorMessage
      });
    }
  }
};

/***/ }),

/***/ "./assets/js/theme/global/compare-products.js":
/*!****************************************************!*\
  !*** ./assets/js/theme/global/compare-products.js ***!
  \****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _modal__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./modal */ "./assets/js/theme/global/modal.js");
/* provided dependency */ var $ = __webpack_require__(/*! jquery */ "./node_modules/jquery/dist/jquery.min.js");

function decrementCounter(counter, item) {
  var index = counter.indexOf(item);
  if (index > -1) {
    counter.splice(index, 1);
  }
}
function incrementCounter(counter, item) {
  counter.push(item);
}
function updateCounterNav(counter, $link, urls) {
  if (counter.length !== 0) {
    if (!$link.is('visible')) {
      $link.addClass('show');
    }
    $link.attr('href', urls.compare + "/" + counter.join('/'));
    $link.find('span.countPill').html(counter.length);
  } else {
    $link.removeClass('show');
  }
}
/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(_ref) {
  var noCompareMessage = _ref.noCompareMessage,
    urls = _ref.urls;
  var compareCounter = [];
  var $compareLink = $('a[data-compare-nav]');
  $('body').on('compareReset', function () {
    var $checked = $('body').find('input[name="products\[\]"]:checked');
    compareCounter = $checked.length ? $checked.map(function (index, element) {
      return element.value;
    }).get() : [];
    updateCounterNav(compareCounter, $compareLink, urls);
  });
  $('body').triggerHandler('compareReset');
  $('body').on('click', '[data-compare-id]', function (event) {
    var product = event.currentTarget.value;
    var $clickedCompareLink = $('a[data-compare-nav]');
    if (event.currentTarget.checked) {
      incrementCounter(compareCounter, product);
    } else {
      decrementCounter(compareCounter, product);
    }
    updateCounterNav(compareCounter, $clickedCompareLink, urls);
  });
  $('body').on('click', 'a[data-compare-nav]', function () {
    var $clickedCheckedInput = $('body').find('input[name="products\[\]"]:checked');
    if ($clickedCheckedInput.length <= 1) {
      (0,_modal__WEBPACK_IMPORTED_MODULE_0__.showAlertModal)(noCompareMessage);
      return false;
    }
  });
}

/***/ })

}]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGhlbWUtYnVuZGxlLmNodW5rLmFzc2V0c19qc190aGVtZV9hY2NvdW50X2pzLmpzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQXlDO0FBRVY7QUFDRztBQUNnQjtBQUNBO0FBT2Y7QUFDNkM7QUFDa0Q7QUFDbEY7QUFDUTtBQUFBLElBRW5Da0IsT0FBTywwQkFBQUMsWUFBQTtFQUN4QixTQUFBRCxRQUFZRSxPQUFPLEVBQUU7SUFBQSxJQUFBQyxLQUFBO0lBQ2pCQSxLQUFBLEdBQUFGLFlBQUEsQ0FBQUcsSUFBQSxPQUFNRixPQUFPLENBQUM7SUFDZEMsS0FBQSxDQUFLRSxvQkFBb0IsR0FBR2IsNkZBQTJCLENBQUNVLE9BQU8sQ0FBQztJQUNoRUMsS0FBQSxDQUFLRyxNQUFNLEdBQUdDLENBQUMsQ0FBQywyQkFBMkIsQ0FBQztJQUM1Q0osS0FBQSxDQUFLSyxLQUFLLEdBQUdELENBQUMsQ0FBQyxNQUFNLENBQUM7SUFBQyxPQUFBSixLQUFBO0VBQzNCO0VBQUNNLGNBQUEsQ0FBQVQsT0FBQSxFQUFBQyxZQUFBO0VBQUEsSUFBQVMsTUFBQSxHQUFBVixPQUFBLENBQUFXLFNBQUE7RUFBQUQsTUFBQSxDQUVERSxPQUFPLEdBQVAsU0FBQUEsT0FBT0EsQ0FBQSxFQUFHO0lBQ04sSUFBTUMsZ0JBQWdCLEdBQUcxQixzRUFBWSxDQUFDLDhCQUE4QixDQUFDO0lBQ3JFLElBQU0yQixZQUFZLEdBQUczQixzRUFBWSxDQUFDLHlCQUF5QixDQUFDO0lBQzVELElBQU00QixVQUFVLEdBQUc1QixzRUFBWSxDQUFDLHVCQUF1QixDQUFDO0lBQ3hELElBQU02QixrQkFBa0IsR0FBRzdCLHNFQUFZLENBQUMsNEJBQTRCLENBQUM7SUFDckUsSUFBTThCLGtCQUFrQixHQUFHOUIsc0VBQVksQ0FBQyxnQ0FBZ0MsQ0FBQztJQUN6RSxJQUFNK0IsWUFBWSxHQUFHL0Isc0VBQVksQ0FBQyw2QkFBNkIsQ0FBQztJQUNoRSxJQUFNZ0MsY0FBYyxH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QzRRLGNBQWMsQ0FBQyxjQUFjLENBQUM7RUFFeEM1USxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUNxQixFQUFFLENBQUMsT0FBTyxFQUFFLG1CQUFtQixFQUFFLFVBQUE2QyxLQUFLLEVBQUk7SUFDaEQsSUFBTTJNLE9BQU8sR0FBRzNNLEtBQUssQ0FBQ0UsYUFBYSxDQUFDZ0IsS0FBSztJQUN6QyxJQUFNMEwsbUJBQW1CLEdBQUc5USxDQUFDLENBQUMscUJBQXFCLENBQUM7SUFFcEQsSUFBSWtFLEtBQUssQ0FBQ0UsYUFBYSxDQUFDMk0sT0FBTyxFQUFFO01BQzdCcEIsZ0JBQWdCLENBQUNXLGNBQWMsRUFBRU8sT0FBTyxDQUFDO0lBQzdDLENBQUMsTUFBTTtNQUNIdEIsZ0JBQWdCLENBQUNlLGNBQWMsRUFBRU8sT0FBTyxDQUFDO0lBQzdDO0lBRUFoQixnQkFBZ0IsQ0FBQ1MsY0FBYyxFQUFFUSxtQkFBbUIsRUFBRWYsSUFBSSxDQUFDO0VBQy9ELENBQUMsQ0FBQztFQUVGL1AsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDcUIsRUFBRSxDQUFDLE9BQU8sRUFBRSxxQkFBcUIsRUFBRSxZQUFNO0lBQy9DLElBQU0yUCxvQkFBb0IsR0FBR2hSLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQzBFLElBQUksQ0FBQyxvQ0FBb0MsQ0FBQztJQUVqRixJQUFJc00sb0JBQW9CLENBQUM5UCxNQUFNLElBQUksQ0FBQyxFQUFFO01BQ2xDM0Isc0RBQWMsQ0FBQzhRLGdCQUFnQixDQUFDO01BQ2hDLE9BQU8sS0FBSztJQUNoQjtFQUNKLENBQUMsQ0FBQztBQUNOIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vYmlnY29tbWVyY2UtY29ybmVyc3RvbmUvLi9hc3NldHMvanMvdGhlbWUvYWNjb3VudC5qcyIsIndlYnBhY2s6Ly9iaWdjb21tZXJjZS1jb3JuZXJzdG9uZS8uL2Fzc2V0cy9qcy90aGVtZS9jb21tb24vcGF5bWVudC1tZXRob2QuanMiLCJ3ZWJwYWNrOi8vYmlnY29tbWVyY2UtY29ybmVyc3RvbmUvLi9hc3NldHMvanMvdGhlbWUvZ2xvYmFsL2NvbXBhcmUtcHJvZHVjdHMuanMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFBhZ2VNYW5hZ2VyIGZyb20gJy4vcGFnZS1tYW5hZ2VyJztcclxuaW1wb3J0IF8gZnJvbSAnbG9kYXNoJztcclxuaW1wb3J0IG5vZCBmcm9tICcuL2NvbW1vbi9ub2QnO1xyXG5pbXBvcnQgV2lzaGxpc3QgZnJvbSAnLi93aXNobGlzdCc7XHJcbmltcG9ydCB2YWxpZGF0aW9uIGZyb20gJy4vY29tbW9uL2Zvcm0tdmFsaWRhdGlvbic7XHJcbmltcG9ydCBzdGF0ZUNvdW50cnkgZnJvbSAnLi9jb21tb24vc3RhdGUtY291bnRyeSc7XHJcbmltcG9ydCB7XHJcbiAgICBjbGFzc2lmeUZvcm0sXHJcbiAgICBWYWxpZGF0b3JzLFxyXG4gICAgYW5ub3VuY2VJbnB1dEVycm9yTWVzc2FnZSxcclxuICAgIGluc2VydFN0YXRlSGlkZGVuRmllbGQsXHJcbiAgICBjcmVhdGVQYXNzd29yZFZhbGlkYXRpb25FcnJvclRleHRPYmplY3QsXHJcbn0gZnJvbSAnLi9jb21tb24vdXRpbHMvZm9ybS11dGlscyc7XHJcbmltcG9ydCB7IGNyZWF0ZVRyYW5zbGF0aW9uRGljdGlvbmFyeSB9IGZyb20gJy4vY29tbW9uL3V0aWxzL3RyYW5zbGF0aW9ucy11dGlscyc7XHJcbmltcG9ydCB7IGNyZWRpdENhcmRUeXBlLCBzdG9yZUluc3RydW1lbnQsIFZhbGlkYXRvcnMgYXMgQ0NWYWxpZGF0b3JzLCBGb3JtYXR0ZXJzIGFzIENDRm9ybWF0dGVycyB9IGZyb20gJy4vY29tbW9uL3BheW1lbnQtbWV0aG9kJztcclxuaW1wb3J0IHsgc2hvd0FsZXJ0TW9kYWwgfSBmcm9tICcuL2dsb2JhbC9tb2RhbCc7XHJcbmltcG9ydCBjb21wYXJlUHJvZHVjdHMgZnJvbSAnLi9nbG9iYWwvY29tcGFyZS1wcm9kdWN0cyc7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBBY2NvdW50IGV4dGVuZHMgUGFnZU1hbmFnZXIge1xyXG4gICAgY29uc3RydWN0b3IoY29udGV4dCkge1xyXG4gICAgICAgIHN1cGVyKGNvbnRleHQpO1xyXG4gICAgICAgIHRoaXMudmFsaWRhdGlvbkRpY3Rpb25hcnkgPSBjcmVhdGVUcmFuc2xhdGlvbkRpY3Rpb25hcnkoY29udGV4dCk7XHJcbiAgICAgICAgdGhpcy4kc3RhdGUgPSAkKCdbZGF0YS1maWVsZC10eXBlPVwiU3RhdGVcIl0nKTtcclxuICAgICAgICB0aGlzLiRib2R5ID0gJCgnYm9keScpO1xyXG4gICAgfVxyXG5cclxuICAgIG9uUmVhZHkoKSB7XHJcbiAgICAgICAgY29uc3QgJGVkaXRBY2NvdW50Rm9ybSA9IGNsYXNzaWZ5Rm9ybSgnZm9ybVtkYXRhLWVkaXQtYWNjb3VudC1mb3JtXScpO1xyXG4gICAgICAgIGNvbnN0ICRhZGRyZXNzRm9ybSA9IGNsYXNzaWZ5Rm9ybSgnZm9ybVtkYXRhLWFkZHJlc3MtZm9ybV0nKTtcclxuICAgICAgICBjb25zdCAkaW5ib3hGb3JtID0gY2xhc3NpZnlGb3JtKCdmb3JtW2RhdGEtaW5ib3gtZm9ybV0nKTtcclxuICAgICAgICBjb25zdCAkYWNjb3VudFJldHVybkZvcm0gPSBjbGFzc2lmeUZvcm0oJ1tkYXRhLWFjY291bnQtcmV0dXJuLWZvcm1dJyk7XHJcbiAgICAgICAgY29uc3QgJHBheW1lbnRNZXRob2RGb3JtID0gY2xhc3NpZnlGb3JtKCdmb3JtW2RhdGEtcGF5bWVudC1tZXRob2QtZm9ybV0nKTtcclxuICAgICAgICBjb25zdCAkcmVvcmRlckZvcm0gPSBjbGFzc2lmeUZvcm0oJ1tkYXRhLWFjY291bnQtcmVvcmRlci1mb3JtXScpO1xyXG4gICAgICAgIGNvbnN0ICRpbnZvaWNlQnV0dG9uID0gJCgnW2RhdGEtcHJpbnQtaW52b2ljZV0nKTtcclxuICAgICAgICBjb25zdCAkYmlnQ29tbWVyY2UgPSB3aW5kb3cuQmlnQ29tbWVyY2U7XHJcblxyXG4gICAgICAgIGNvbXBhcmVQcm9kdWN0cyh0aGlzLmNvbnRleHQpO1xyXG5cclxuICAgICAgICAvLyBJbmplY3RlZCB2aWEgdGVtcGxhdGVcclxuICAgICAgICB0aGlzLnBhc3N3b3JkUmVxdWlyZW1lbnRzID0gdGhpcy5jb250ZXh0LnBhc3N3b3JkUmVxdWlyZW1lbnRzO1xyXG5cclxuICAgICAgICAvLyBJbnN0YW50aWF0ZXMgd2lzaCBsaXN0IEpTXHJcbiAgICAgICAgV2lzaGxpc3QubG9hZCh0aGlzLmNvbnRleHQpO1xyXG5cclxuICAgICAgICBpZiAoJGVkaXRBY2NvdW50Rm9ybS5sZW5ndGgpIHtcclxuICAgICAgICAgICAgdGhpcy5yZWdpc3RlckVkaXRBY2NvdW50VmFsaWRhdGlvbigkZWRpdEFjY291bnRGb3JtKTtcclxuICAgICAgICAgICAgaWYgKHRoaXMuJHN0YXRlLmlzKCdpbnB1dCcpKSB7XHJcbiAgICAgICAgICAgICAgICBpbnNlcnRTdGF0ZUhpZGRlbkZpZWxkKHRoaXMuJHN0YXRlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKCRpbnZvaWNlQnV0dG9uLmxlbmd0aCkge1xyXG4gICAgICAgICAgICAkaW52b2ljZUJ1dHRvbi5vbignY2xpY2snLCAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBsZWZ0ID0gd2luZG93LnNjcmVlbi5hdmFpbFdpZHRoIC8gMiAtIDQ1MDtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHRvcCA9IHdpbmRvdy5zY3JlZW4uYXZhaWxIZWlnaHQgLyAyIC0gMzIwO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgdXJsID0gJGludm9pY2VCdXR0b24uZGF0YSgncHJpbnRJbnZvaWNlJyk7XHJcblxyXG4gICAgICAgICAgICAgICAgd2luZG93Lm9wZW4odXJsLCAnb3JkZXJJbnZvaWNlJywgYHdpZHRoPTkwMCxoZWlnaHQ9NjUwLGxlZnQ9JHtsZWZ0fSx0b3A9JHt0b3B9LHNjcm9sbGJhcnM9MWApO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICgkYWRkcmVzc0Zvcm0ubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgIHRoaXMuaW5pdEFkZHJlc3NGb3JtVmFsaWRhdGlvbigkYWRkcmVzc0Zvcm0pO1xyXG5cclxuICAgICAgICAgICAgaWYgKHRoaXMuJHN0YXRlLmlzKCdpbnB1dCcpKSB7XHJcbiAgICAgICAgICAgICAgICBpbnNlcnRTdGF0ZUhpZGRlbkZpZWxkKHRoaXMuJHN0YXRlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKCRpbmJveEZvcm0ubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgIHRoaXMucmVnaXN0ZXJJbmJveFZhbGlkYXRpb24oJGluYm94Rm9ybSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoJGFjY291bnRSZXR1cm5Gb3JtLmxlbmd0aCkge1xyXG4gICAgICAgICAgICB0aGlzLmluaXRBY2NvdW50UmV0dXJuRm9ybVZhbGlkYXRpb24oJGFjY291bnRSZXR1cm5Gb3JtKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICgkcGF5bWVudE1ldGhvZEZvcm0ubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgIHRoaXMuaW5pdFBheW1lbnRNZXRob2RGb3JtVmFsaWRhdGlvbigkcGF5bWVudE1ldGhvZEZvcm0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKCRyZW9yZGVyRm9ybS5sZW5ndGgpIHtcclxuICAgICAgICAgICAgdGhpcy5pbml0UmVvcmRlckZvcm0oJHJlb3JkZXJGb3JtKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICgkYmlnQ29tbWVyY2UgJiYgJGJpZ0NvbW1lcmNlLnJlbmRlckFjY291bnRQYXltZW50cykge1xyXG4gICAgICAgICAgICBjb25zdCB7XHJcbiAgICAgICAgICAgICAgICBjb3VudHJpZXMsXHJcbiAgICAgICAgICAgICAgICBwYXltZW50c1VybCxcclxuICAgICAgICAgICAgICAgIHN0b3JlSGFzaCxcclxuICAgICAgICAgICAgICAgIHN0b3JlTG9jYWxlLFxyXG4gICAgICAgICAgICAgICAgdmF1bHRUb2tlbixcclxuICAgICAgICAgICAgICAgIHNob3BwZXJJZCxcclxuICAgICAgICAgICAgICAgIGN1c3RvbWVyRW1haWwsXHJcbiAgICAgICAgICAgICAgICBwcm92aWRlcklkLFxyXG4gICAgICAgICAgICAgICAgY3VycmVuY3lDb2RlLFxyXG4gICAgICAgICAgICAgICAgcGF5bWVudE1ldGhvZHNVcmwsXHJcbiAgICAgICAgICAgICAgICBwYXltZW50UHJvdmlkZXJJbml0aWFsaXphdGlvbkRhdGEsXHJcbiAgICAgICAgICAgICAgICB0aGVtZVNldHRpbmdzLFxyXG4gICAgICAgICAgICB9ID0gdGhpcy5jb250ZXh0O1xyXG5cclxuICAgICAgICAgICAgJGJpZ0NvbW1lcmNlLnJlbmRlckFjY291bnRQYXltZW50cyh7XHJcbiAgICAgICAgICAgICAgICBzdHlsZXM6IHtcclxuICAgICAgICAgICAgICAgICAgICBpbnB1dEJhc2U6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29sb3I6IHRoZW1lU2V0dGluZ3NbJ2lucHV0LWZvbnQtY29sb3InXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgYm9yZGVyQ29sb3I6IHRoZW1lU2V0dGluZ3NbJ2lucHV0LWJvcmRlci1jb2xvciddLFxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgaW5wdXRWYWxpZGF0aW9uRXJyb3I6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29sb3I6IHRoZW1lU2V0dGluZ3NbJ2NvbG9yLWVycm9yJ10sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJvcmRlckNvbG9yOiB0aGVtZVNldHRpbmdzWydjb2xvci1lcnJvciddLFxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgaW5wdXRWYWxpZGF0aW9uU3VjY2Vzczoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb2xvcjogdGhlbWVTZXR0aW5nc1snY29sb3Itc3VjY2VzcyddLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBib3JkZXJDb2xvcjogdGhlbWVTZXR0aW5nc1snY29sb3Itc3VjY2VzcyddLFxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgc3VibWl0QnV0dG9uOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbG9yOiB0aGVtZVNldHRpbmdzWydidXR0b24tLXByaW1hcnktY29sb3InXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgYmFja2dyb3VuZENvbG9yOiB0aGVtZVNldHRpbmdzWydidXR0b24tLXByaW1hcnktYmFja2dyb3VuZENvbG9yJ10sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJvcmRlckNvbG9yOiB0aGVtZVNldHRpbmdzWydidXR0b24tLXByaW1hcnktYmFja2dyb3VuZENvbG9yJ10sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICcmOmhvdmVyJzoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29sb3I6IHRoZW1lU2V0dGluZ3NbJ2J1dHRvbi0tcHJpbWFyeS1jb2xvckhvdmVyJ10sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6IHRoZW1lU2V0dGluZ3NbJ2J1dHRvbi0tcHJpbWFyeS1iYWNrZ3JvdW5kQ29sb3JIb3ZlciddLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYm9yZGVyQ29sb3I6IHRoZW1lU2V0dGluZ3NbJ2J1dHRvbi0tcHJpbWFyeS1iYWNrZ3JvdW5kQ29sb3JIb3ZlciddLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAnJjphY3RpdmUnOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb2xvcjogdGhlbWVTZXR0aW5nc1snYnV0dG9uLS1wcmltYXJ5LWNvbG9yQWN0aXZlJ10sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6IHRoZW1lU2V0dGluZ3NbJ2J1dHRvbi0tcHJpbWFyeS1iYWNrZ3JvdW5kQ29sb3JBY3RpdmUnXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJvcmRlckNvbG9yOiB0aGVtZVNldHRpbmdzWydidXR0b24tLXByaW1hcnktYmFja2dyb3VuZENvbG9yQWN0aXZlJ10sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICcmW2Rpc2FibGVkXSc6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJhY2tncm91bmRDb2xvcjogdGhlbWVTZXR0aW5nc1snYnV0dG9uLS1kaXNhYmxlZC1iYWNrZ3JvdW5kQ29sb3InXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJvcmRlckNvbG9yOiB0aGVtZVNldHRpbmdzWydidXR0b24tLWRpc2FibGVkLWJvcmRlckNvbG9yJ10sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb2xvcjogdGhlbWVTZXR0aW5nc1snYnV0dG9uLS1kaXNhYmxlZC1jb2xvciddLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY3Vyc29yOiAnbm90LWFsbG93ZWQnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgY2FuY2VsQnV0dG9uOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbG9yOiB0aGVtZVNldHRpbmdzWydidXR0b24tLWRlZmF1bHQtY29sb3InXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgYmFja2dyb3VuZENvbG9yOiAndHJhbnNwYXJlbnQnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBib3JkZXJDb2xvcjogdGhlbWVTZXR0aW5nc1snYnV0dG9uLS1kZWZhdWx0LWJvcmRlckNvbG9yJ10sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICcmOmhvdmVyJzoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29sb3I6IHRoZW1lU2V0dGluZ3NbJ2J1dHRvbi0tZGVmYXVsdC1jb2xvckhvdmVyJ10sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6ICd0cmFuc3BhcmVudCcsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBib3JkZXJDb2xvcjogdGhlbWVTZXR0aW5nc1snYnV0dG9uLS1kZWZhdWx0LWJvcmRlckNvbG9ySG92ZXInXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgJyY6YWN0aXZlJzoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29sb3I6IHRoZW1lU2V0dGluZ3NbJ2J1dHRvbi0tZGVmYXVsdC1jb2xvckFjdGl2ZSddLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYmFja2dyb3VuZENvbG9yOiAndHJhbnNwYXJlbnQnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYm9yZGVyQ29sb3I6IHRoZW1lU2V0dGluZ3NbJ2J1dHRvbi0tZGVmYXVsdC1ib3JkZXJDb2xvckFjdGl2ZSddLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgbGFiZWw6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29sb3I6IHRoZW1lU2V0dGluZ3NbJ2Zvcm0tbGFiZWwtZm9udC1jb2xvciddLFxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgdmFsaWRhdGlvbkVycm9yOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbG9yOiB0aGVtZVNldHRpbmdzWydjb2xvci1lcnJvciddLFxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgaGVhZGluZzoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb2xvcjogdGhlbWVTZXR0aW5nc1snY29sb3ItdGV4dEhlYWRpbmcnXSxcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHN0b3JlQ29udGV4dERhdGE6IHtcclxuICAgICAgICAgICAgICAgICAgICBjb3VudHJpZXMsXHJcbiAgICAgICAgICAgICAgICAgICAgcGF5bWVudHNVcmwsXHJcbiAgICAgICAgICAgICAgICAgICAgc3RvcmVIYXNoLFxyXG4gICAgICAgICAgICAgICAgICAgIHN0b3JlTG9jYWxlLFxyXG4gICAgICAgICAgICAgICAgICAgIHZhdWx0VG9rZW4sXHJcbiAgICAgICAgICAgICAgICAgICAgc2hvcHBlcklkLFxyXG4gICAgICAgICAgICAgICAgICAgIGN1c3RvbWVyRW1haWwsXHJcbiAgICAgICAgICAgICAgICAgICAgcHJvdmlkZXJJZCxcclxuICAgICAgICAgICAgICAgICAgICBjdXJyZW5jeUNvZGUsXHJcbiAgICAgICAgICAgICAgICAgICAgcGF5bWVudE1ldGhvZHNVcmwsXHJcbiAgICAgICAgICAgICAgICAgICAgcGF5bWVudFByb3ZpZGVySW5pdGlhbGl6YXRpb25EYXRhLFxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGVycm9ySGFuZGxlcjogc2hvd0FsZXJ0TW9kYWwsXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5iaW5kRGVsZXRlQWRkcmVzcygpO1xyXG4gICAgICAgIHRoaXMuYmluZERlbGV0ZVBheW1lbnRNZXRob2QoKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEJpbmRzIGEgc3VibWl0IGhvb2sgdG8gZW5zdXJlIHRoZSBjdXN0b21lciByZWNlaXZlcyBhIGNvbmZpcm1hdGlvbiBkaWFsb2cgYmVmb3JlIGRlbGV0aW5nIGFuIGFkZHJlc3NcclxuICAgICAqL1xyXG4gICAgYmluZERlbGV0ZUFkZHJlc3MoKSB7XHJcbiAgICAgICAgJCgnW2RhdGEtZGVsZXRlLWFkZHJlc3NdJykub24oJ3N1Ym1pdCcsIGV2ZW50ID0+IHtcclxuICAgICAgICAgICAgY29uc3QgbWVzc2FnZSA9ICQoZXZlbnQuY3VycmVudFRhcmdldCkuZGF0YSgnZGVsZXRlQWRkcmVzcycpO1xyXG5cclxuICAgICAgICAgICAgaWYgKCF3aW5kb3cuY29uZmlybShtZXNzYWdlKSkge1xyXG4gICAgICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIGJpbmREZWxldGVQYXltZW50TWV0aG9kKCkge1xyXG4gICAgICAgICQoJ1tkYXRhLWRlbGV0ZS1wYXltZW50LW1ldGhvZF0nKS5vbignc3VibWl0JywgZXZlbnQgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCBtZXNzYWdlID0gJChldmVudC5jdXJyZW50VGFyZ2V0KS5kYXRhKCdkZWxldGVQYXltZW50TWV0aG9kJyk7XHJcblxyXG4gICAgICAgICAgICBpZiAoIXdpbmRvdy5jb25maXJtKG1lc3NhZ2UpKSB7XHJcbiAgICAgICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgaW5pdFJlb3JkZXJGb3JtKCRyZW9yZGVyRm9ybSkge1xyXG4gICAgICAgICRyZW9yZGVyRm9ybS5vbignc3VibWl0JywgZXZlbnQgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCAkcHJvZHVjdFJlb3JkZXJDaGVja2JveGVzID0gJCgnLmFjY291bnQtbGlzdEl0ZW0gLmZvcm0tY2hlY2tib3g6Y2hlY2tlZCcpO1xyXG4gICAgICAgICAgICBsZXQgc3VibWl0Rm9ybSA9IGZhbHNlO1xyXG5cclxuICAgICAgICAgICAgJHJlb3JkZXJGb3JtLmZpbmQoJ1tuYW1lXj1cInJlb3JkZXJpdGVtXCJdJykucmVtb3ZlKCk7XHJcblxyXG4gICAgICAgICAgICAkcHJvZHVjdFJlb3JkZXJDaGVja2JveGVzLmVhY2goKGluZGV4LCBwcm9kdWN0Q2hlY2tib3gpID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHByb2R1Y3RJZCA9ICQocHJvZHVjdENoZWNrYm94KS52YWwoKTtcclxuICAgICAgICAgICAgICAgIGNvbnN0ICRpbnB1dCA9ICQoJzxpbnB1dD4nLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogJ2hpZGRlbicsXHJcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogYHJlb3JkZXJpdGVtWyR7cHJvZHVjdElkfV1gLFxyXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlOiAnMScsXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICBzdWJtaXRGb3JtID0gdHJ1ZTtcclxuXHJcbiAgICAgICAgICAgICAgICAkcmVvcmRlckZvcm0uYXBwZW5kKCRpbnB1dCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgaWYgKCFzdWJtaXRGb3JtKSB7XHJcbiAgICAgICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICAgICAgc2hvd0FsZXJ0TW9kYWwodGhpcy5jb250ZXh0LnNlbGVjdEl0ZW0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgaW5pdEFkZHJlc3NGb3JtVmFsaWRhdGlvbigkYWRkcmVzc0Zvcm0pIHtcclxuICAgICAgICBjb25zdCB2YWxpZGF0aW9uTW9kZWwgPSB2YWxpZGF0aW9uKCRhZGRyZXNzRm9ybSwgdGhpcy5jb250ZXh0KTtcclxuICAgICAgICBjb25zdCBzdGF0ZVNlbGVjdG9yID0gJ2Zvcm1bZGF0YS1hZGRyZXNzLWZvcm1dIFtkYXRhLWZpZWxkLXR5cGU9XCJTdGF0ZVwiXSc7XHJcbiAgICAgICAgY29uc3QgJHN0YXRlRWxlbWVudCA9ICQoc3RhdGVTZWxlY3Rvcik7XHJcbiAgICAgICAgY29uc3QgYWRkcmVzc1ZhbGlkYXRvciA9IG5vZCh7XHJcbiAgICAgICAgICAgIHN1Ym1pdDogJ2Zvcm1bZGF0YS1hZGRyZXNzLWZvcm1dIGlucHV0W3R5cGU9XCJzdWJtaXRcIl0nLFxyXG4gICAgICAgICAgICB0YXA6IGFubm91bmNlSW5wdXRFcnJvck1lc3NhZ2UsXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGFkZHJlc3NWYWxpZGF0b3IuYWRkKHZhbGlkYXRpb25Nb2RlbCk7XHJcblxyXG4gICAgICAgIGlmICgkc3RhdGVFbGVtZW50KSB7XHJcbiAgICAgICAgICAgIGxldCAkbGFzdDtcclxuXHJcbiAgICAgICAgICAgIC8vIFJlcXVlc3RzIHRoZSBzdGF0ZXMgZm9yIGEgY291bnRyeSB3aXRoIEFKQVhcclxuICAgICAgICAgICAgc3RhdGVDb3VudHJ5KCRzdGF0ZUVsZW1lbnQsIHRoaXMuY29udGV4dCwgKGVyciwgZmllbGQpID0+IHtcclxuICAgICAgICAgICAgICAgIGlmIChlcnIpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoZXJyKTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBjb25zdCAkZmllbGQgPSAkKGZpZWxkKTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoYWRkcmVzc1ZhbGlkYXRvci5nZXRTdGF0dXMoJHN0YXRlRWxlbWVudCkgIT09ICd1bmRlZmluZWQnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgYWRkcmVzc1ZhbGlkYXRvci5yZW1vdmUoJHN0YXRlRWxlbWVudCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKCRsYXN0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgYWRkcmVzc1ZhbGlkYXRvci5yZW1vdmUoJGxhc3QpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGlmICgkZmllbGQuaXMoJ3NlbGVjdCcpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgJGxhc3QgPSBmaWVsZDtcclxuICAgICAgICAgICAgICAgICAgICBWYWxpZGF0b3JzLnNldFN0YXRlQ291bnRyeVZhbGlkYXRpb24oYWRkcmVzc1ZhbGlkYXRvciwgZmllbGQsIHRoaXMudmFsaWRhdGlvbkRpY3Rpb25hcnkuZmllbGRfbm90X2JsYW5rKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgVmFsaWRhdG9ycy5jbGVhblVwU3RhdGVWYWxpZGF0aW9uKGZpZWxkKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAkYWRkcmVzc0Zvcm0ub24oJ3N1Ym1pdCcsIGV2ZW50ID0+IHtcclxuICAgICAgICAgICAgYWRkcmVzc1ZhbGlkYXRvci5wZXJmb3JtQ2hlY2soKTtcclxuXHJcbiAgICAgICAgICAgIGlmIChhZGRyZXNzVmFsaWRhdG9yLmFyZUFsbCgndmFsaWQnKSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIGluaXRBY2NvdW50UmV0dXJuRm9ybVZhbGlkYXRpb24oJGFjY291bnRSZXR1cm5Gb3JtKSB7XHJcbiAgICAgICAgY29uc3QgZXJyb3JNZXNzYWdlID0gJGFjY291bnRSZXR1cm5Gb3JtLmRhdGEoJ2FjY291bnRSZXR1cm5Gb3JtRXJyb3InKTtcclxuXHJcbiAgICAgICAgJGFjY291bnRSZXR1cm5Gb3JtLm9uKCdzdWJtaXQnLCBldmVudCA9PiB7XHJcbiAgICAgICAgICAgIGxldCBmb3JtU3VibWl0ID0gZmFsc2U7XHJcblxyXG4gICAgICAgICAgICAvLyBJdGVyYXRlIHVudGlsIHdlIGZpbmQgYSBub24temVybyB2YWx1ZSBpbiB0aGUgZHJvcGRvd24gZm9yIHF1YW50aXR5XHJcbiAgICAgICAgICAgICQoJ1tuYW1lXj1cInJldHVybl9xdHlcIl0nLCAkYWNjb3VudFJldHVybkZvcm0pLmVhY2goKGksIGVsZSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYgKHBhcnNlSW50KCQoZWxlKS52YWwoKSwgMTApICE9PSAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZm9ybVN1Ym1pdCA9IHRydWU7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8vIEV4aXQgb3V0IG9mIGxvb3AgaWYgd2UgZm91bmQgYXQgbGVhc3Qgb25lIHJldHVyblxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIGlmIChmb3JtU3VibWl0KSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgc2hvd0FsZXJ0TW9kYWwoZXJyb3JNZXNzYWdlKTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIGluaXRQYXltZW50TWV0aG9kRm9ybVZhbGlkYXRpb24oJHBheW1lbnRNZXRob2RGb3JtKSB7XHJcbiAgICAgICAgLy8gSW5qZWN0IHZhbGlkYXRpb25zIGludG8gZm9ybSBmaWVsZHMgYmVmb3JlIHZhbGlkYXRpb24gcnVuc1xyXG4gICAgICAgICRwYXltZW50TWV0aG9kRm9ybS5maW5kKCcjZmlyc3RfbmFtZS5mb3JtLWZpZWxkJykuYXR0cignZGF0YS12YWxpZGF0aW9uJywgYHsgXCJ0eXBlXCI6IFwic2luZ2xlbGluZVwiLCBcImxhYmVsXCI6IFwiJHt0aGlzLmNvbnRleHQuZmlyc3ROYW1lTGFiZWx9XCIsIFwicmVxdWlyZWRcIjogdHJ1ZSwgXCJtYXhsZW5ndGhcIjogMCB9YCk7XHJcbiAgICAgICAgJHBheW1lbnRNZXRob2RGb3JtLmZpbmQoJyNsYXN0X25hbWUuZm9ybS1maWVsZCcpLmF0dHIoJ2RhdGEtdmFsaWRhdGlvbicsIGB7IFwidHlwZVwiOiBcInNpbmdsZWxpbmVcIiwgXCJsYWJlbFwiOiBcIiR7dGhpcy5jb250ZXh0Lmxhc3ROYW1lTGFiZWx9XCIsIFwicmVxdWlyZWRcIjogdHJ1ZSwgXCJtYXhsZW5ndGhcIjogMCB9YCk7XHJcbiAgICAgICAgJHBheW1lbnRNZXRob2RGb3JtLmZpbmQoJyNjb21wYW55LmZvcm0tZmllbGQnKS5hdHRyKCdkYXRhLXZhbGlkYXRpb24nLCBgeyBcInR5cGVcIjogXCJzaW5nbGVsaW5lXCIsIFwibGFiZWxcIjogXCIke3RoaXMuY29udGV4dC5jb21wYW55TGFiZWx9XCIsIFwicmVxdWlyZWRcIjogZmFsc2UsIFwibWF4bGVuZ3RoXCI6IDAgfWApO1xyXG4gICAgICAgICRwYXltZW50TWV0aG9kRm9ybS5maW5kKCcjcGhvbmUuZm9ybS1maWVsZCcpLmF0dHIoJ2RhdGEtdmFsaWRhdGlvbicsIGB7IFwidHlwZVwiOiBcInNpbmdsZWxpbmVcIiwgXCJsYWJlbFwiOiBcIiR7dGhpcy5jb250ZXh0LnBob25lTGFiZWx9XCIsIFwicmVxdWlyZWRcIjogZmFsc2UsIFwibWF4bGVuZ3RoXCI6IDAgfWApO1xyXG4gICAgICAgICRwYXltZW50TWV0aG9kRm9ybS5maW5kKCcjYWRkcmVzczEuZm9ybS1maWVsZCcpLmF0dHIoJ2RhdGEtdmFsaWRhdGlvbicsIGB7IFwidHlwZVwiOiBcInNpbmdsZWxpbmVcIiwgXCJsYWJlbFwiOiBcIiR7dGhpcy5jb250ZXh0LmFkZHJlc3MxTGFiZWx9XCIsIFwicmVxdWlyZWRcIjogdHJ1ZSwgXCJtYXhsZW5ndGhcIjogMCB9YCk7XHJcbiAgICAgICAgJHBheW1lbnRNZXRob2RGb3JtLmZpbmQoJyNhZGRyZXNzMi5mb3JtLWZpZWxkJykuYXR0cignZGF0YS12YWxpZGF0aW9uJywgYHsgXCJ0eXBlXCI6IFwic2luZ2xlbGluZVwiLCBcImxhYmVsXCI6IFwiJHt0aGlzLmNvbnRleHQuYWRkcmVzczJMYWJlbH1cIiwgXCJyZXF1aXJlZFwiOiBmYWxzZSwgXCJtYXhsZW5ndGhcIjogMCB9YCk7XHJcbiAgICAgICAgJHBheW1lbnRNZXRob2RGb3JtLmZpbmQoJyNjaXR5LmZvcm0tZmllbGQnKS5hdHRyKCdkYXRhLXZhbGlkYXRpb24nLCBgeyBcInR5cGVcIjogXCJzaW5nbGVsaW5lXCIsIFwibGFiZWxcIjogXCIke3RoaXMuY29udGV4dC5jaXR5TGFiZWx9XCIsIFwicmVxdWlyZWRcIjogdHJ1ZSwgXCJtYXhsZW5ndGhcIjogMCB9YCk7XHJcbiAgICAgICAgJHBheW1lbnRNZXRob2RGb3JtLmZpbmQoJyNjb3VudHJ5LmZvcm0tZmllbGQnKS5hdHRyKCdkYXRhLXZhbGlkYXRpb24nLCBgeyBcInR5cGVcIjogXCJzaW5nbGVzZWxlY3RcIiwgXCJsYWJlbFwiOiBcIiR7dGhpcy5jb250ZXh0LmNvdW50cnlMYWJlbH1cIiwgXCJyZXF1aXJlZFwiOiB0cnVlLCBcInByZWZpeFwiOiBcIiR7dGhpcy5jb250ZXh0LmNob29zZUNvdW50cnlMYWJlbH1cIiB9YCk7XHJcbiAgICAgICAgJHBheW1lbnRNZXRob2RGb3JtLmZpbmQoJyNzdGF0ZS5mb3JtLWZpZWxkJykuYXR0cignZGF0YS12YWxpZGF0aW9uJywgYHsgXCJ0eXBlXCI6IFwic2luZ2xlbGluZVwiLCBcImxhYmVsXCI6IFwiJHt0aGlzLmNvbnRleHQuc3RhdGVMYWJlbH1cIiwgXCJyZXF1aXJlZFwiOiB0cnVlLCBcIm1heGxlbmd0aFwiOiAwIH1gKTtcclxuICAgICAgICAkcGF5bWVudE1ldGhvZEZvcm0uZmluZCgnI3Bvc3RhbF9jb2RlLmZvcm0tZmllbGQnKS5hdHRyKCdkYXRhLXZhbGlkYXRpb24nLCBgeyBcInR5cGVcIjogXCJzaW5nbGVsaW5lXCIsIFwibGFiZWxcIjogXCIke3RoaXMuY29udGV4dC5wb3N0YWxDb2RlTGFiZWx9XCIsIFwicmVxdWlyZWRcIjogdHJ1ZSwgXCJtYXhsZW5ndGhcIjogMCB9YCk7XHJcblxyXG4gICAgICAgIGNvbnN0IHZhbGlkYXRpb25Nb2RlbCA9IHZhbGlkYXRpb24oJHBheW1lbnRNZXRob2RGb3JtLCB0aGlzLmNvbnRleHQpO1xyXG4gICAgICAgIGNvbnN0IHBheW1lbnRNZXRob2RTZWxlY3RvciA9ICdmb3JtW2RhdGEtcGF5bWVudC1tZXRob2QtZm9ybV0nO1xyXG4gICAgICAgIGNvbnN0IHBheW1lbnRNZXRob2RWYWxpZGF0b3IgPSBub2Qoe1xyXG4gICAgICAgICAgICBzdWJtaXQ6IGAke3BheW1lbnRNZXRob2RTZWxlY3Rvcn0gaW5wdXRbdHlwZT1cInN1Ym1pdFwiXWAsXHJcbiAgICAgICAgICAgIHRhcDogYW5ub3VuY2VJbnB1dEVycm9yTWVzc2FnZSxcclxuICAgICAgICB9KTtcclxuICAgICAgICBjb25zdCAkc3RhdGVFbGVtZW50ID0gJChgJHtwYXltZW50TWV0aG9kU2VsZWN0b3J9IFtkYXRhLWZpZWxkLXR5cGU9XCJTdGF0ZVwiXWApO1xyXG5cclxuICAgICAgICBsZXQgJGxhc3Q7XHJcbiAgICAgICAgLy8gUmVxdWVzdHMgdGhlIHN0YXRlcyBmb3IgYSBjb3VudHJ5IHdpdGggQUpBWFxyXG4gICAgICAgIHN0YXRlQ291bnRyeSgkc3RhdGVFbGVtZW50LCB0aGlzLmNvbnRleHQsIChlcnIsIGZpZWxkKSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChlcnIpIHtcclxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihlcnIpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBjb25zdCAkZmllbGQgPSAkKGZpZWxkKTtcclxuXHJcbiAgICAgICAgICAgIGlmIChwYXltZW50TWV0aG9kVmFsaWRhdG9yLmdldFN0YXR1cygkc3RhdGVFbGVtZW50KSAhPT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgICAgICAgICAgICAgIHBheW1lbnRNZXRob2RWYWxpZGF0b3IucmVtb3ZlKCRzdGF0ZUVsZW1lbnQpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoJGxhc3QpIHtcclxuICAgICAgICAgICAgICAgIHBheW1lbnRNZXRob2RWYWxpZGF0b3IucmVtb3ZlKCRsYXN0KTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKCRmaWVsZC5pcygnc2VsZWN0JykpIHtcclxuICAgICAgICAgICAgICAgICRsYXN0ID0gZmllbGQ7XHJcbiAgICAgICAgICAgICAgICBWYWxpZGF0b3JzLnNldFN0YXRlQ291bnRyeVZhbGlkYXRpb24ocGF5bWVudE1ldGhvZFZhbGlkYXRvciwgZmllbGQsIHRoaXMudmFsaWRhdGlvbkRpY3Rpb25hcnkuZmllbGRfbm90X2JsYW5rKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIFZhbGlkYXRvcnMuY2xlYW5VcFN0YXRlVmFsaWRhdGlvbihmaWVsZCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgLy8gVXNlIGNyZWRpdCBjYXJkIG51bWJlciBpbnB1dCBsaXN0ZW5lciB0byBoaWdobGlnaHQgY3JlZGl0IGNhcmQgdHlwZVxyXG4gICAgICAgIGxldCBjYXJkVHlwZTtcclxuICAgICAgICAkKGAke3BheW1lbnRNZXRob2RTZWxlY3Rvcn0gaW5wdXRbbmFtZT1cImNyZWRpdF9jYXJkX251bWJlclwiXWApLm9uKCdrZXl1cCcsICh7IHRhcmdldCB9KSA9PiB7XHJcbiAgICAgICAgICAgIGNhcmRUeXBlID0gY3JlZGl0Q2FyZFR5cGUodGFyZ2V0LnZhbHVlKTtcclxuICAgICAgICAgICAgaWYgKGNhcmRUeXBlKSB7XHJcbiAgICAgICAgICAgICAgICAkKGAke3BheW1lbnRNZXRob2RTZWxlY3Rvcn0gaW1nW2FsdD1cIiR7Y2FyZFR5cGV9XCJdYCkuc2libGluZ3MoKS5jc3MoJ29wYWNpdHknLCAnLjInKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICQoYCR7cGF5bWVudE1ldGhvZFNlbGVjdG9yfSBpbWdgKS5jc3MoJ29wYWNpdHknLCAnMScpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIC8vIFNldCBvZiBjcmVkaXQgY2FyZCB2YWxpZGF0aW9uXHJcbiAgICAgICAgQ0NWYWxpZGF0b3JzLnNldENyZWRpdENhcmROdW1iZXJWYWxpZGF0aW9uKHBheW1lbnRNZXRob2RWYWxpZGF0b3IsIGAke3BheW1lbnRNZXRob2RTZWxlY3Rvcn0gaW5wdXRbbmFtZT1cImNyZWRpdF9jYXJkX251bWJlclwiXWAsIHRoaXMuY29udGV4dC5jcmVkaXRDYXJkTnVtYmVyKTtcclxuICAgICAgICBDQ1ZhbGlkYXRvcnMuc2V0RXhwaXJhdGlvblZhbGlkYXRpb24ocGF5bWVudE1ldGhvZFZhbGlkYXRvciwgYCR7cGF5bWVudE1ldGhvZFNlbGVjdG9yfSBpbnB1dFtuYW1lPVwiZXhwaXJhdGlvblwiXWAsIHRoaXMuY29udGV4dC5leHBpcmF0aW9uKTtcclxuICAgICAgICBDQ1ZhbGlkYXRvcnMuc2V0TmFtZU9uQ2FyZFZhbGlkYXRpb24ocGF5bWVudE1ldGhvZFZhbGlkYXRvciwgYCR7cGF5bWVudE1ldGhvZFNlbGVjdG9yfSBpbnB1dFtuYW1lPVwibmFtZV9vbl9jYXJkXCJdYCwgdGhpcy5jb250ZXh0Lm5hbWVPbkNhcmQpO1xyXG4gICAgICAgIENDVmFsaWRhdG9ycy5zZXRDdnZWYWxpZGF0aW9uKHBheW1lbnRNZXRob2RWYWxpZGF0b3IsIGAke3BheW1lbnRNZXRob2RTZWxlY3Rvcn0gaW5wdXRbbmFtZT1cImN2dlwiXWAsIHRoaXMuY29udGV4dC5jdnYsICgpID0+IGNhcmRUeXBlKTtcclxuXHJcbiAgICAgICAgLy8gU2V0IG9mIGNyZWRpdCBjYXJkIGZvcm1hdFxyXG4gICAgICAgIENDRm9ybWF0dGVycy5zZXRDcmVkaXRDYXJkTnVtYmVyRm9ybWF0KGAke3BheW1lbnRNZXRob2RTZWxlY3Rvcn0gaW5wdXRbbmFtZT1cImNyZWRpdF9jYXJkX251bWJlclwiXWApO1xyXG4gICAgICAgIENDRm9ybWF0dGVycy5zZXRFeHBpcmF0aW9uRm9ybWF0KGAke3BheW1lbnRNZXRob2RTZWxlY3Rvcn0gaW5wdXRbbmFtZT1cImV4cGlyYXRpb25cIl1gKTtcclxuXHJcbiAgICAgICAgLy8gQmlsbGluZyBhZGRyZXNzIHZhbGlkYXRpb25cclxuICAgICAgICBwYXltZW50TWV0aG9kVmFsaWRhdG9yLmFkZCh2YWxpZGF0aW9uTW9kZWwpO1xyXG5cclxuICAgICAgICAkcGF5bWVudE1ldGhvZEZvcm0ub24oJ3N1Ym1pdCcsIGV2ZW50ID0+IHtcclxuICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICAgLy8gUGVyZm9ybSBmaW5hbCBmb3JtIHZhbGlkYXRpb25cclxuICAgICAgICAgICAgcGF5bWVudE1ldGhvZFZhbGlkYXRvci5wZXJmb3JtQ2hlY2soKTtcclxuICAgICAgICAgICAgaWYgKHBheW1lbnRNZXRob2RWYWxpZGF0b3IuYXJlQWxsKCd2YWxpZCcpKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBTZXJpYWxpemUgZm9ybSBkYXRhIGFuZCByZWR1Y2UgaXQgdG8gb2JqZWN0XHJcbiAgICAgICAgICAgICAgICBjb25zdCBkYXRhID0gXy5yZWR1Y2UoJHBheW1lbnRNZXRob2RGb3JtLnNlcmlhbGl6ZUFycmF5KCksIChvYmosIGl0ZW0pID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCByZWZPYmogPSBvYmo7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVmT2JqW2l0ZW0ubmFtZV0gPSBpdGVtLnZhbHVlO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiByZWZPYmo7XHJcbiAgICAgICAgICAgICAgICB9LCB7fSk7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gQXNzaWduIGNvdW50cnkgYW5kIHN0YXRlIGNvZGVcclxuICAgICAgICAgICAgICAgIGNvbnN0IGNvdW50cnkgPSBfLmZpbmQodGhpcy5jb250ZXh0LmNvdW50cmllcywgKHsgdmFsdWUgfSkgPT4gdmFsdWUgPT09IGRhdGEuY291bnRyeSk7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBzdGF0ZSA9IGNvdW50cnkgJiYgXy5maW5kKGNvdW50cnkuc3RhdGVzLCAoeyB2YWx1ZSB9KSA9PiB2YWx1ZSA9PT0gZGF0YS5zdGF0ZSk7XHJcbiAgICAgICAgICAgICAgICBkYXRhLmNvdW50cnlfY29kZSA9IGNvdW50cnkgPyBjb3VudHJ5LmNvZGUgOiBkYXRhLmNvdW50cnk7XHJcbiAgICAgICAgICAgICAgICBkYXRhLnN0YXRlX29yX3Byb3ZpbmNlX2NvZGUgPSBzdGF0ZSA/IHN0YXRlLmNvZGUgOiBkYXRhLnN0YXRlO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIERlZmF1bHQgSW5zdHJ1bWVudFxyXG4gICAgICAgICAgICAgICAgZGF0YS5kZWZhdWx0X2luc3RydW1lbnQgPSAhIWRhdGEuZGVmYXVsdF9pbnN0cnVtZW50O1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIFN0b3JlIGNyZWRpdCBjYXJkXHJcbiAgICAgICAgICAgICAgICBzdG9yZUluc3RydW1lbnQodGhpcy5jb250ZXh0LCBkYXRhLCAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgd2luZG93LmxvY2F0aW9uLmhyZWYgPSB0aGlzLmNvbnRleHQucGF5bWVudE1ldGhvZHNVcmw7XHJcbiAgICAgICAgICAgICAgICB9LCAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgc2hvd0FsZXJ0TW9kYWwodGhpcy5jb250ZXh0LmdlbmVyaWNfZXJyb3IpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICByZWdpc3RlckVkaXRBY2NvdW50VmFsaWRhdGlvbigkZWRpdEFjY291bnRGb3JtKSB7XHJcbiAgICAgICAgY29uc3QgdmFsaWRhdGlvbk1vZGVsID0gdmFsaWRhdGlvbigkZWRpdEFjY291bnRGb3JtLCB0aGlzLmNvbnRleHQpO1xyXG4gICAgICAgIGNvbnN0IGZvcm1FZGl0U2VsZWN0b3IgPSAnZm9ybVtkYXRhLWVkaXQtYWNjb3VudC1mb3JtXSc7XHJcbiAgICAgICAgY29uc3QgZWRpdFZhbGlkYXRvciA9IG5vZCh7XHJcbiAgICAgICAgICAgIHN1Ym1pdDogJyR7Zm9ybUVkaXRTZWxlY3Rvcn0gaW5wdXRbdHlwZT1cInN1Ym1pdFwiXScsXHJcbiAgICAgICAgICAgIGRlbGF5OiA5MDAsXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgY29uc3QgZW1haWxTZWxlY3RvciA9IGAke2Zvcm1FZGl0U2VsZWN0b3J9IFtkYXRhLWZpZWxkLXR5cGU9XCJFbWFpbEFkZHJlc3NcIl1gO1xyXG4gICAgICAgIGNvbnN0ICRlbWFpbEVsZW1lbnQgPSAkKGVtYWlsU2VsZWN0b3IpO1xyXG4gICAgICAgIGNvbnN0IHBhc3N3b3JkU2VsZWN0b3IgPSBgJHtmb3JtRWRpdFNlbGVjdG9yfSBbZGF0YS1maWVsZC10eXBlPVwiUGFzc3dvcmRcIl1gO1xyXG4gICAgICAgIGNvbnN0ICRwYXNzd29yZEVsZW1lbnQgPSAkKHBhc3N3b3JkU2VsZWN0b3IpO1xyXG4gICAgICAgIGNvbnN0IHBhc3N3b3JkMlNlbGVjdG9yID0gYCR7Zm9ybUVkaXRTZWxlY3Rvcn0gW2RhdGEtZmllbGQtdHlwZT1cIkNvbmZpcm1QYXNzd29yZFwiXWA7XHJcbiAgICAgICAgY29uc3QgJHBhc3N3b3JkMkVsZW1lbnQgPSAkKHBhc3N3b3JkMlNlbGVjdG9yKTtcclxuICAgICAgICBjb25zdCBjdXJyZW50UGFzc3dvcmRTZWxlY3RvciA9IGAke2Zvcm1FZGl0U2VsZWN0b3J9IFtkYXRhLWZpZWxkLXR5cGU9XCJDdXJyZW50UGFzc3dvcmRcIl1gO1xyXG4gICAgICAgIGNvbnN0ICRjdXJyZW50UGFzc3dvcmQgPSAkKGN1cnJlbnRQYXNzd29yZFNlbGVjdG9yKTtcclxuXHJcbiAgICAgICAgLy8gVGhpcyBvbmx5IGhhbmRsZXMgdGhlIGN1c3RvbSBmaWVsZHMsIHN0YW5kYXJkIGZpZWxkcyBhcmUgYWRkZWQgYmVsb3dcclxuICAgICAgICBlZGl0VmFsaWRhdG9yLmFkZCh2YWxpZGF0aW9uTW9kZWwpO1xyXG5cclxuICAgICAgICBpZiAoJGVtYWlsRWxlbWVudCkge1xyXG4gICAgICAgICAgICBlZGl0VmFsaWRhdG9yLnJlbW92ZShlbWFpbFNlbGVjdG9yKTtcclxuICAgICAgICAgICAgVmFsaWRhdG9ycy5zZXRFbWFpbFZhbGlkYXRpb24oZWRpdFZhbGlkYXRvciwgZW1haWxTZWxlY3RvciwgdGhpcy52YWxpZGF0aW9uRGljdGlvbmFyeS52YWxpZF9lbWFpbCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoJHBhc3N3b3JkRWxlbWVudCAmJiAkcGFzc3dvcmQyRWxlbWVudCkge1xyXG4gICAgICAgICAgICBjb25zdCB7IHBhc3N3b3JkOiBlbnRlclBhc3N3b3JkLCBwYXNzd29yZF9tYXRjaDogbWF0Y2hQYXNzd29yZCB9ID0gdGhpcy52YWxpZGF0aW9uRGljdGlvbmFyeTtcclxuICAgICAgICAgICAgZWRpdFZhbGlkYXRvci5yZW1vdmUocGFzc3dvcmRTZWxlY3Rvcik7XHJcbiAgICAgICAgICAgIGVkaXRWYWxpZGF0b3IucmVtb3ZlKHBhc3N3b3JkMlNlbGVjdG9yKTtcclxuICAgICAgICAgICAgVmFsaWRhdG9ycy5zZXRQYXNzd29yZFZhbGlkYXRpb24oXHJcbiAgICAgICAgICAgICAgICBlZGl0VmFsaWRhdG9yLFxyXG4gICAgICAgICAgICAgICAgcGFzc3dvcmRTZWxlY3RvcixcclxuICAgICAgICAgICAgICAgIHBhc3N3b3JkMlNlbGVjdG9yLFxyXG4gICAgICAgICAgICAgICAgdGhpcy5wYXNzd29yZFJlcXVpcmVtZW50cyxcclxuICAgICAgICAgICAgICAgIGNyZWF0ZVBhc3N3b3JkVmFsaWRhdGlvbkVycm9yVGV4dE9iamVjdChlbnRlclBhc3N3b3JkLCBlbnRlclBhc3N3b3JkLCBtYXRjaFBhc3N3b3JkLCB0aGlzLnBhc3N3b3JkUmVxdWlyZW1lbnRzLmVycm9yKSxcclxuICAgICAgICAgICAgICAgIHRydWUsXHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoJGN1cnJlbnRQYXNzd29yZCkge1xyXG4gICAgICAgICAgICBlZGl0VmFsaWRhdG9yLmFkZCh7XHJcbiAgICAgICAgICAgICAgICBzZWxlY3RvcjogY3VycmVudFBhc3N3b3JkU2VsZWN0b3IsXHJcbiAgICAgICAgICAgICAgICB2YWxpZGF0ZTogKGNiLCB2YWwpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgcmVzdWx0ID0gdHJ1ZTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHZhbCA9PT0gJycgJiYgJHBhc3N3b3JkRWxlbWVudC52YWwoKSAhPT0gJycpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0ID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICBjYihyZXN1bHQpO1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGVycm9yTWVzc2FnZTogdGhpcy5jb250ZXh0LmN1cnJlbnRQYXNzd29yZCxcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBlZGl0VmFsaWRhdG9yLmFkZChbXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHNlbGVjdG9yOiBgJHtmb3JtRWRpdFNlbGVjdG9yfSBpbnB1dFtuYW1lPSdhY2NvdW50X2ZpcnN0bmFtZSddYCxcclxuICAgICAgICAgICAgICAgIHZhbGlkYXRlOiAoY2IsIHZhbCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IHZhbC5sZW5ndGg7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGNiKHJlc3VsdCk7XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgZXJyb3JNZXNzYWdlOiB0aGlzLmNvbnRleHQuZmlyc3ROYW1lLFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBzZWxlY3RvcjogYCR7Zm9ybUVkaXRTZWxlY3Rvcn0gaW5wdXRbbmFtZT0nYWNjb3VudF9sYXN0bmFtZSddYCxcclxuICAgICAgICAgICAgICAgIHZhbGlkYXRlOiAoY2IsIHZhbCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IHZhbC5sZW5ndGg7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGNiKHJlc3VsdCk7XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgZXJyb3JNZXNzYWdlOiB0aGlzLmNvbnRleHQubGFzdE5hbWUsXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgXSk7XHJcblxyXG4gICAgICAgICRlZGl0QWNjb3VudEZvcm0ub24oJ3N1Ym1pdCcsIGV2ZW50ID0+IHtcclxuICAgICAgICAgICAgZWRpdFZhbGlkYXRvci5wZXJmb3JtQ2hlY2soKTtcclxuXHJcbiAgICAgICAgICAgIGlmIChlZGl0VmFsaWRhdG9yLmFyZUFsbCgndmFsaWQnKSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGVhcmxpZXN0RXJyb3IgPSAkKCdzcGFuLmZvcm0taW5saW5lTWVzc2FnZTpmaXJzdCcpLnByZXYoJ2lucHV0Jyk7XHJcbiAgICAgICAgICAgICAgICBlYXJsaWVzdEVycm9yLmZvY3VzKCk7XHJcbiAgICAgICAgICAgIH0sIDkwMCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcmVnaXN0ZXJJbmJveFZhbGlkYXRpb24oJGluYm94Rm9ybSkge1xyXG4gICAgICAgIGNvbnN0IGluYm94VmFsaWRhdG9yID0gbm9kKHtcclxuICAgICAgICAgICAgc3VibWl0OiAnZm9ybVtkYXRhLWluYm94LWZvcm1dIGlucHV0W3R5cGU9XCJzdWJtaXRcIl0nLFxyXG4gICAgICAgICAgICBkZWxheTogOTAwLFxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBpbmJveFZhbGlkYXRvci5hZGQoW1xyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBzZWxlY3RvcjogJ2Zvcm1bZGF0YS1pbmJveC1mb3JtXSBzZWxlY3RbbmFtZT1cIm1lc3NhZ2Vfb3JkZXJfaWRcIl0nLFxyXG4gICAgICAgICAgICAgICAgdmFsaWRhdGU6IChjYiwgdmFsKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgcmVzdWx0ID0gTnVtYmVyKHZhbCkgIT09IDA7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGNiKHJlc3VsdCk7XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgZXJyb3JNZXNzYWdlOiB0aGlzLmNvbnRleHQuZW50ZXJPcmRlck51bSxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgc2VsZWN0b3I6ICdmb3JtW2RhdGEtaW5ib3gtZm9ybV0gaW5wdXRbbmFtZT1cIm1lc3NhZ2Vfc3ViamVjdFwiXScsXHJcbiAgICAgICAgICAgICAgICB2YWxpZGF0ZTogKGNiLCB2YWwpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCByZXN1bHQgPSB2YWwubGVuZ3RoO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBjYihyZXN1bHQpO1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGVycm9yTWVzc2FnZTogdGhpcy5jb250ZXh0LmVudGVyU3ViamVjdCxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgc2VsZWN0b3I6ICdmb3JtW2RhdGEtaW5ib3gtZm9ybV0gdGV4dGFyZWFbbmFtZT1cIm1lc3NhZ2VfY29udGVudFwiXScsXHJcbiAgICAgICAgICAgICAgICB2YWxpZGF0ZTogKGNiLCB2YWwpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCByZXN1bHQgPSB2YWwubGVuZ3RoO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBjYihyZXN1bHQpO1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGVycm9yTWVzc2FnZTogdGhpcy5jb250ZXh0LmVudGVyTWVzc2FnZSxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICBdKTtcclxuXHJcbiAgICAgICAgJGluYm94Rm9ybS5vbignc3VibWl0JywgZXZlbnQgPT4ge1xyXG4gICAgICAgICAgICBpbmJveFZhbGlkYXRvci5wZXJmb3JtQ2hlY2soKTtcclxuXHJcbiAgICAgICAgICAgIGlmIChpbmJveFZhbGlkYXRvci5hcmVBbGwoJ3ZhbGlkJykpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuXHJcbiAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgZWFybGllc3RFcnJvciA9ICQoJ3NwYW4uZm9ybS1pbmxpbmVNZXNzYWdlOmZpcnN0JykucHJldignaW5wdXQnKTtcclxuICAgICAgICAgICAgICAgIGVhcmxpZXN0RXJyb3IuZm9jdXMoKTtcclxuICAgICAgICAgICAgfSwgOTAwKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxufVxyXG4iLCJpbXBvcnQgY3JlZGl0Y2FyZHMgZnJvbSAnY3JlZGl0Y2FyZHMnO1xyXG5cclxuLyoqXHJcbiAqIE9taXQgbnVsbCBvciBlbXB0eSBzdHJpbmcgcHJvcGVydGllcyBvZiBvYmplY3RcclxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdFxyXG4gKiBAcmV0dXJucyB7T2JqZWN0fVxyXG4gKi9cclxuY29uc3Qgb21pdE51bGxTdHJpbmcgPSBvYmogPT4ge1xyXG4gICAgY29uc3QgcmVmT2JqID0gb2JqO1xyXG5cclxuICAgICQuZWFjaChyZWZPYmosIChrZXksIHZhbHVlKSA9PiB7XHJcbiAgICAgICAgaWYgKHZhbHVlID09PSBudWxsIHx8IHZhbHVlID09PSAnJykge1xyXG4gICAgICAgICAgICBkZWxldGUgcmVmT2JqW2tleV07XHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG4gICAgcmV0dXJuIHJlZk9iajtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBHZXQgY3JlZGl0IGNhcmQgdHlwZSBmcm9tIGNyZWRpdCBjYXJkIG51bWJlclxyXG4gKiBAcGFyYW0ge3N0cmluZ30gdmFsdWVcclxuICovXHJcbmV4cG9ydCBjb25zdCBjcmVkaXRDYXJkVHlwZSA9IHZhbHVlID0+IGNyZWRpdGNhcmRzLmNhcmQudHlwZShjcmVkaXRjYXJkcy5jYXJkLnBhcnNlKHZhbHVlKSwgdHJ1ZSk7XHJcblxyXG4vKipcclxuICogV3JhcHBlciBmb3IgYWpheCByZXF1ZXN0IHRvIHN0b3JlIGEgbmV3IGluc3RydW1lbnQgaW4gYmlncGF5XHJcbiAqIEBwYXJhbSB7b2JqZWN0fSBSZXByZXNlbnRpbmcgdGhlIGRhdGEgbmVlZGVkIGZvciB0aGUgaGVhZGVyXHJcbiAqIEBwYXJhbSB7b2JqZWN0fSBSZXByZXNlbnRpbmcgdGhlIGRhdGEgbmVlZGVkIGZvciB0aGUgYm9keVxyXG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSBkb25lIEZ1bmN0aW9uIHRvIGV4ZWN1dGUgb24gYSBzdWNjZXNzZnVsIHJlc3BvbnNlXHJcbiAqIEBwYXJhbSB7ZnVuY3Rpb259IGZhaWwgRnVuY3Rpb24gdG8gZXhlY3V0ZSBvbiBhIHVuc3VjY2Vzc2Z1bCByZXNwb25zZVxyXG4gKi9cclxuZXhwb3J0IGNvbnN0IHN0b3JlSW5zdHJ1bWVudCA9ICh7XHJcbiAgICAvLyBIb3N0bmFtZSwgSWRzICYgVG9rZW5cclxuICAgIHBheW1lbnRzVXJsLFxyXG4gICAgc2hvcHBlcklkLFxyXG4gICAgc3RvcmVIYXNoLFxyXG4gICAgdmF1bHRUb2tlbixcclxufSwge1xyXG4gICAgLyogZXNsaW50LWRpc2FibGUgKi9cclxuICAgIC8vIFByb3ZpZGVyIEluZm9cclxuICAgIHByb3ZpZGVyX2lkLFxyXG4gICAgY3VycmVuY3lfY29kZSxcclxuXHJcbiAgICAvLyBJbnN0cnVtZW50IERldGFpbHNcclxuICAgIGNyZWRpdF9jYXJkX251bWJlcixcclxuICAgIGV4cGlyYXRpb24sXHJcbiAgICBuYW1lX29uX2NhcmQsXHJcbiAgICBjdnYsXHJcbiAgICBkZWZhdWx0X2luc3RydW1lbnQsXHJcblxyXG4gICAgLy8gQmlsbGluZyBBZGRyZXNzXHJcbiAgICBhZGRyZXNzMSxcclxuICAgIGFkZHJlc3MyLFxyXG4gICAgY2l0eSxcclxuICAgIHBvc3RhbF9jb2RlLFxyXG4gICAgc3RhdGVfb3JfcHJvdmluY2VfY29kZSxcclxuICAgIGNvdW50cnlfY29kZSxcclxuICAgIGNvbXBhbnksXHJcbiAgICBmaXJzdF9uYW1lLFxyXG4gICAgbGFzdF9uYW1lLFxyXG4gICAgZW1haWwsXHJcbiAgICBwaG9uZSxcclxuICAgIC8qIGVzbGludC1lbmFibGUgKi9cclxufSwgZG9uZSwgZmFpbCkgPT4ge1xyXG4gICAgY29uc3QgZXhwaXJ5ID0gZXhwaXJhdGlvbi5zcGxpdCgnLycpO1xyXG5cclxuICAgICQuYWpheCh7XHJcbiAgICAgICAgdXJsOiBgJHtwYXltZW50c1VybH0vc3RvcmVzLyR7c3RvcmVIYXNofS9jdXN0b21lcnMvJHtzaG9wcGVySWR9L3N0b3JlZF9pbnN0cnVtZW50c2AsXHJcbiAgICAgICAgZGF0YVR5cGU6ICdqc29uJyxcclxuICAgICAgICBtZXRob2Q6ICdQT1NUJyxcclxuICAgICAgICBjYWNoZTogZmFsc2UsXHJcbiAgICAgICAgaGVhZGVyczoge1xyXG4gICAgICAgICAgICBBdXRob3JpemF0aW9uOiB2YXVsdFRva2VuLFxyXG4gICAgICAgICAgICBBY2NlcHQ6ICdhcHBsaWNhdGlvbi92bmQuYmMudjEranNvbicsXHJcbiAgICAgICAgICAgICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vdm5kLmJjLnYxK2pzb24nLFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZGF0YTogSlNPTi5zdHJpbmdpZnkoe1xyXG4gICAgICAgICAgICBpbnN0cnVtZW50OiB7XHJcbiAgICAgICAgICAgICAgICB0eXBlOiAnY2FyZCcsXHJcbiAgICAgICAgICAgICAgICBjYXJkaG9sZGVyX25hbWU6IG5hbWVfb25fY2FyZCxcclxuICAgICAgICAgICAgICAgIG51bWJlcjogY3JlZGl0Y2FyZHMuY2FyZC5wYXJzZShjcmVkaXRfY2FyZF9udW1iZXIpLFxyXG4gICAgICAgICAgICAgICAgZXhwaXJ5X21vbnRoOiBjcmVkaXRjYXJkcy5leHBpcmF0aW9uLm1vbnRoLnBhcnNlKGV4cGlyeVswXSksXHJcbiAgICAgICAgICAgICAgICBleHBpcnlfeWVhcjogY3JlZGl0Y2FyZHMuZXhwaXJhdGlvbi55ZWFyLnBhcnNlKGV4cGlyeVsxXSwgdHJ1ZSksXHJcbiAgICAgICAgICAgICAgICB2ZXJpZmljYXRpb25fdmFsdWU6IGN2dixcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgYmlsbGluZ19hZGRyZXNzOiBvbWl0TnVsbFN0cmluZyh7XHJcbiAgICAgICAgICAgICAgICBhZGRyZXNzMSxcclxuICAgICAgICAgICAgICAgIGFkZHJlc3MyLFxyXG4gICAgICAgICAgICAgICAgY2l0eSxcclxuICAgICAgICAgICAgICAgIHBvc3RhbF9jb2RlLFxyXG4gICAgICAgICAgICAgICAgc3RhdGVfb3JfcHJvdmluY2VfY29kZSxcclxuICAgICAgICAgICAgICAgIGNvdW50cnlfY29kZSxcclxuICAgICAgICAgICAgICAgIGNvbXBhbnksXHJcbiAgICAgICAgICAgICAgICBmaXJzdF9uYW1lLFxyXG4gICAgICAgICAgICAgICAgbGFzdF9uYW1lLFxyXG4gICAgICAgICAgICAgICAgZW1haWwsXHJcbiAgICAgICAgICAgICAgICBwaG9uZSxcclxuICAgICAgICAgICAgfSksXHJcbiAgICAgICAgICAgIHByb3ZpZGVyX2lkLFxyXG4gICAgICAgICAgICBkZWZhdWx0X2luc3RydW1lbnQsXHJcbiAgICAgICAgICAgIGN1cnJlbmN5X2NvZGUsXHJcbiAgICAgICAgfSksXHJcbiAgICB9KVxyXG4gICAgICAgIC5kb25lKGRvbmUpXHJcbiAgICAgICAgLmZhaWwoZmFpbCk7XHJcbn07XHJcblxyXG5leHBvcnQgY29uc3QgRm9ybWF0dGVycyA9IHtcclxuICAgIC8qKlxyXG4gICAgICogU2V0cyB1cCBhIGZvcm1hdCBmb3IgY3JlZGl0IGNhcmQgbnVtYmVyXHJcbiAgICAgKiBAcGFyYW0gZmllbGRcclxuICAgICAqL1xyXG4gICAgc2V0Q3JlZGl0Q2FyZE51bWJlckZvcm1hdDogZmllbGQgPT4ge1xyXG4gICAgICAgIGlmIChmaWVsZCkge1xyXG4gICAgICAgICAgICAkKGZpZWxkKS5vbigna2V5dXAnLCAoeyB0YXJnZXQgfSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgcmVmVGFyZ2V0ID0gdGFyZ2V0O1xyXG4gICAgICAgICAgICAgICAgcmVmVGFyZ2V0LnZhbHVlID0gY3JlZGl0Y2FyZHMuY2FyZC5mb3JtYXQoY3JlZGl0Y2FyZHMuY2FyZC5wYXJzZSh0YXJnZXQudmFsdWUpKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuXHJcbiAgICAvKipcclxuICAgICAqIFNldHMgdXAgYSBmb3JtYXQgZm9yIGV4cGlyYXRpb24gZGF0ZVxyXG4gICAgICogQHBhcmFtIGZpZWxkXHJcbiAgICAgKi9cclxuICAgIHNldEV4cGlyYXRpb25Gb3JtYXQ6IGZpZWxkID0+IHtcclxuICAgICAgICBpZiAoZmllbGQpIHtcclxuICAgICAgICAgICAgJChmaWVsZCkub24oJ2tleXVwJywgKHsgdGFyZ2V0LCB3aGljaCB9KSA9PiB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCByZWZUYXJnZXQgPSB0YXJnZXQ7XHJcbiAgICAgICAgICAgICAgICBpZiAod2hpY2ggPT09IDggJiYgLy4qKFxcLykkLy50ZXN0KHRhcmdldC52YWx1ZSkpIHtcclxuICAgICAgICAgICAgICAgICAgICByZWZUYXJnZXQudmFsdWUgPSB0YXJnZXQudmFsdWUuc2xpY2UoMCwgLTEpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICh0YXJnZXQudmFsdWUubGVuZ3RoID4gNCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJlZlRhcmdldC52YWx1ZSA9IHRhcmdldC52YWx1ZS5zbGljZSgwLCA1KTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAod2hpY2ggIT09IDgpIHtcclxuICAgICAgICAgICAgICAgICAgICByZWZUYXJnZXQudmFsdWUgPSB0YXJnZXQudmFsdWVcclxuICAgICAgICAgICAgICAgICAgICAgICAgLnJlcGxhY2UoL14oWzEtOV1cXC98WzItOV0pJC9nLCAnMCQxLycpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC5yZXBsYWNlKC9eKDBbMS05XXwxWzAtMl0pJC9nLCAnJDEvJylcclxuICAgICAgICAgICAgICAgICAgICAgICAgLnJlcGxhY2UoL14oWzAtMV0pKFszLTldKSQvZywgJzAkMS8kMicpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC5yZXBsYWNlKC9eKDBbMS05XXwxWzAtMl0pKFswLTldezJ9KSQvZywgJyQxLyQyJylcclxuICAgICAgICAgICAgICAgICAgICAgICAgLnJlcGxhY2UoL14oWzBdKylcXC98WzBdKyQvZywgJzAnKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAucmVwbGFjZSgvW15cXGRcXC9dfF5bXFwvXSokL2csICcnKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAucmVwbGFjZSgvXFwvXFwvL2csICcvJyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgIH0sXHJcbn07XHJcblxyXG5leHBvcnQgY29uc3QgVmFsaWRhdG9ycyA9IHtcclxuICAgIC8qKlxyXG4gICAgICogU2V0cyB1cCBhIHZhbGlkYXRpb24gZm9yIGNyZWRpdCBjYXJkIG51bWJlclxyXG4gICAgICogQHBhcmFtIHZhbGlkYXRvclxyXG4gICAgICogQHBhcmFtIGZpZWxkXHJcbiAgICAgKiBAcGFyYW0gZXJyb3JNZXNzYWdlXHJcbiAgICAgKi9cclxuICAgIHNldENyZWRpdENhcmROdW1iZXJWYWxpZGF0aW9uOiAodmFsaWRhdG9yLCBmaWVsZCwgZXJyb3JNZXNzYWdlKSA9PiB7XHJcbiAgICAgICAgaWYgKGZpZWxkKSB7XHJcbiAgICAgICAgICAgIHZhbGlkYXRvci5hZGQoe1xyXG4gICAgICAgICAgICAgICAgc2VsZWN0b3I6IGZpZWxkLFxyXG4gICAgICAgICAgICAgICAgdmFsaWRhdGU6IChjYiwgdmFsKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgcmVzdWx0ID0gdmFsLmxlbmd0aCAmJiBjcmVkaXRjYXJkcy5jYXJkLmlzVmFsaWQoY3JlZGl0Y2FyZHMuY2FyZC5wYXJzZSh2YWwpKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgY2IocmVzdWx0KTtcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBlcnJvck1lc3NhZ2UsXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgIH0sXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBTZXRzIHVwIGEgdmFsaWRhdGlvbiBmb3IgZXhwaXJhdGlvbiBkYXRlXHJcbiAgICAgKiBAcGFyYW0gdmFsaWRhdG9yXHJcbiAgICAgKiBAcGFyYW0gZmllbGRcclxuICAgICAqIEBwYXJhbSBlcnJvck1lc3NhZ2VcclxuICAgICAqL1xyXG4gICAgc2V0RXhwaXJhdGlvblZhbGlkYXRpb246ICh2YWxpZGF0b3IsIGZpZWxkLCBlcnJvck1lc3NhZ2UpID0+IHtcclxuICAgICAgICBpZiAoZmllbGQpIHtcclxuICAgICAgICAgICAgdmFsaWRhdG9yLmFkZCh7XHJcbiAgICAgICAgICAgICAgICBzZWxlY3RvcjogZmllbGQsXHJcbiAgICAgICAgICAgICAgICB2YWxpZGF0ZTogKGNiLCB2YWwpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBleHBpcnkgPSB2YWwuc3BsaXQoJy8nKTtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgcmVzdWx0ID0gdmFsLmxlbmd0aCAmJiAvXigwWzEtOV18MVswLTJdKVxcLyhbMC05XXsyfSkkLy50ZXN0KHZhbCk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0ID0gcmVzdWx0ICYmICFjcmVkaXRjYXJkcy5leHBpcmF0aW9uLmlzUGFzdChjcmVkaXRjYXJkcy5leHBpcmF0aW9uLm1vbnRoLnBhcnNlKGV4cGlyeVswXSksIGNyZWRpdGNhcmRzLmV4cGlyYXRpb24ueWVhci5wYXJzZShleHBpcnlbMV0sIHRydWUpKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgY2IocmVzdWx0KTtcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBlcnJvck1lc3NhZ2UsXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgIH0sXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBTZXRzIHVwIGEgdmFsaWRhdGlvbiBmb3IgbmFtZSBvbiBjYXJkXHJcbiAgICAgKiBAcGFyYW0gdmFsaWRhdG9yXHJcbiAgICAgKiBAcGFyYW0gZmllbGRcclxuICAgICAqIEBwYXJhbSBlcnJvck1lc3NhZ2VcclxuICAgICAqL1xyXG4gICAgc2V0TmFtZU9uQ2FyZFZhbGlkYXRpb246ICh2YWxpZGF0b3IsIGZpZWxkLCBlcnJvck1lc3NhZ2UpID0+IHtcclxuICAgICAgICBpZiAoZmllbGQpIHtcclxuICAgICAgICAgICAgdmFsaWRhdG9yLmFkZCh7XHJcbiAgICAgICAgICAgICAgICBzZWxlY3RvcjogZmllbGQsXHJcbiAgICAgICAgICAgICAgICB2YWxpZGF0ZTogKGNiLCB2YWwpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCByZXN1bHQgPSAhIXZhbC5sZW5ndGg7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGNiKHJlc3VsdCk7XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgZXJyb3JNZXNzYWdlLFxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICogU2V0cyB1cCBhIHZhbGlkYXRpb24gZm9yIGN2dlxyXG4gICAgICogQHBhcmFtIHZhbGlkYXRvclxyXG4gICAgICogQHBhcmFtIGZpZWxkXHJcbiAgICAgKiBAcGFyYW0gZXJyb3JNZXNzYWdlXHJcbiAgICAgKiBAcGFyYW0ge2FueX0gY2FyZFR5cGUgVGhlIGNyZWRpdCBjYXJkIG51bWJlciB0eXBlXHJcbiAgICAgKi9cclxuICAgIHNldEN2dlZhbGlkYXRpb246ICh2YWxpZGF0b3IsIGZpZWxkLCBlcnJvck1lc3NhZ2UsIGNhcmRUeXBlKSA9PiB7XHJcbiAgICAgICAgaWYgKGZpZWxkKSB7XHJcbiAgICAgICAgICAgIHZhbGlkYXRvci5hZGQoe1xyXG4gICAgICAgICAgICAgICAgc2VsZWN0b3I6IGZpZWxkLFxyXG4gICAgICAgICAgICAgICAgdmFsaWRhdGU6IChjYiwgdmFsKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgdHlwZSA9IHR5cGVvZiBjYXJkVHlwZSA9PT0gJ2Z1bmN0aW9uJyA/IGNhcmRUeXBlKCkgOiBjYXJkVHlwZTtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCByZXN1bHQgPSB2YWwubGVuZ3RoICYmIGNyZWRpdGNhcmRzLmN2Yy5pc1ZhbGlkKHZhbCwgdHlwZSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGNiKHJlc3VsdCk7XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgZXJyb3JNZXNzYWdlLFxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG59O1xyXG4iLCJpbXBvcnQgeyBzaG93QWxlcnRNb2RhbCB9IGZyb20gJy4vbW9kYWwnO1xyXG5cclxuZnVuY3Rpb24gZGVjcmVtZW50Q291bnRlcihjb3VudGVyLCBpdGVtKSB7XHJcbiAgICBjb25zdCBpbmRleCA9IGNvdW50ZXIuaW5kZXhPZihpdGVtKTtcclxuXHJcbiAgICBpZiAoaW5kZXggPiAtMSkge1xyXG4gICAgICAgIGNvdW50ZXIuc3BsaWNlKGluZGV4LCAxKTtcclxuICAgIH1cclxufVxyXG5cclxuZnVuY3Rpb24gaW5jcmVtZW50Q291bnRlcihjb3VudGVyLCBpdGVtKSB7XHJcbiAgICBjb3VudGVyLnB1c2goaXRlbSk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHVwZGF0ZUNvdW50ZXJOYXYoY291bnRlciwgJGxpbmssIHVybHMpIHtcclxuICAgIGlmIChjb3VudGVyLmxlbmd0aCAhPT0gMCkge1xyXG4gICAgICAgIGlmICghJGxpbmsuaXMoJ3Zpc2libGUnKSkge1xyXG4gICAgICAgICAgICAkbGluay5hZGRDbGFzcygnc2hvdycpO1xyXG4gICAgICAgIH1cclxuICAgICAgICAkbGluay5hdHRyKCdocmVmJywgYCR7dXJscy5jb21wYXJlfS8ke2NvdW50ZXIuam9pbignLycpfWApO1xyXG4gICAgICAgICRsaW5rLmZpbmQoJ3NwYW4uY291bnRQaWxsJykuaHRtbChjb3VudGVyLmxlbmd0aCk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgICRsaW5rLnJlbW92ZUNsYXNzKCdzaG93Jyk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uICh7IG5vQ29tcGFyZU1lc3NhZ2UsIHVybHMgfSkge1xyXG4gICAgbGV0IGNvbXBhcmVDb3VudGVyID0gW107XHJcblxyXG4gICAgY29uc3QgJGNvbXBhcmVMaW5rID0gJCgnYVtkYXRhLWNvbXBhcmUtbmF2XScpO1xyXG5cclxuICAgICQoJ2JvZHknKS5vbignY29tcGFyZVJlc2V0JywgKCkgPT4ge1xyXG4gICAgICAgIGNvbnN0ICRjaGVja2VkID0gJCgnYm9keScpLmZpbmQoJ2lucHV0W25hbWU9XCJwcm9kdWN0c1xcW1xcXVwiXTpjaGVja2VkJyk7XHJcblxyXG4gICAgICAgIGNvbXBhcmVDb3VudGVyID0gJGNoZWNrZWQubGVuZ3RoID8gJGNoZWNrZWQubWFwKChpbmRleCwgZWxlbWVudCkgPT4gZWxlbWVudC52YWx1ZSkuZ2V0KCkgOiBbXTtcclxuICAgICAgICB1cGRhdGVDb3VudGVyTmF2KGNvbXBhcmVDb3VudGVyLCAkY29tcGFyZUxpbmssIHVybHMpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgJCgnYm9keScpLnRyaWdnZXJIYW5kbGVyKCdjb21wYXJlUmVzZXQnKTtcclxuXHJcbiAgICAkKCdib2R5Jykub24oJ2NsaWNrJywgJ1tkYXRhLWNvbXBhcmUtaWRdJywgZXZlbnQgPT4ge1xyXG4gICAgICAgIGNvbnN0IHByb2R1Y3QgPSBldmVudC5jdXJyZW50VGFyZ2V0LnZhbHVlO1xyXG4gICAgICAgIGNvbnN0ICRjbGlja2VkQ29tcGFyZUxpbmsgPSAkKCdhW2RhdGEtY29tcGFyZS1uYXZdJyk7XHJcblxyXG4gICAgICAgIGlmIChldmVudC5jdXJyZW50VGFyZ2V0LmNoZWNrZWQpIHtcclxuICAgICAgICAgICAgaW5jcmVtZW50Q291bnRlcihjb21wYXJlQ291bnRlciwgcHJvZHVjdCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgZGVjcmVtZW50Q291bnRlcihjb21wYXJlQ291bnRlciwgcHJvZHVjdCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB1cGRhdGVDb3VudGVyTmF2KGNvbXBhcmVDb3VudGVyLCAkY2xpY2tlZENvbXBhcmVMaW5rLCB1cmxzKTtcclxuICAgIH0pO1xyXG5cclxuICAgICQoJ2JvZHknKS5vbignY2xpY2snLCAnYVtkYXRhLWNvbXBhcmUtbmF2XScsICgpID0+IHtcclxuICAgICAgICBjb25zdCAkY2xpY2tlZENoZWNrZWRJbnB1dCA9ICQoJ2JvZHknKS5maW5kKCdpbnB1dFtuYW1lPVwicHJvZHVjdHNcXFtcXF1cIl06Y2hlY2tlZCcpO1xyXG5cclxuICAgICAgICBpZiAoJGNsaWNrZWRDaGVja2VkSW5wdXQubGVuZ3RoIDw9IDEpIHtcclxuICAgICAgICAgICAgc2hvd0FsZXJ0TW9kYWwobm9Db21wYXJlTWVzc2FnZSk7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICB9KTtcclxufVxyXG4iXSwibmFtZXMiOlsiUGFnZU1hbmFnZXIiLCJub2QiLCJXaXNobGlzdCIsInZhbGlkYXRpb24iLCJzdGF0ZUNvdW50cnkiLCJjbGFzc2lmeUZvcm0iLCJWYWxpZGF0b3JzIiwiYW5ub3VuY2VJbnB1dEVycm9yTWVzc2FnZSIsImluc2VydFN0YXRlSGlkZGVuRmllbGQiLCJjcmVhdGVQYXNzd29yZFZhbGlkYXRpb25FcnJvclRleHRPYmplY3QiLCJjcmVhdGVUcmFuc2xhdGlvbkRpY3Rpb25hcnkiLCJjcmVkaXRDYXJkVHlwZSIsInN0b3JlSW5zdHJ1bWVudCIsIkNDVmFsaWRhdG9ycyIsIkZvcm1hdHRlcnMiLCJDQ0Zvcm1hdHRlcnMiLCJzaG93QWxlcnRNb2RhbCIsImNvbXBhcmVQcm9kdWN0cyIsIkFjY291bnQiLCJfUGFnZU1hbmFnZXIiLCJjb250ZXh0IiwiX3RoaXMiLCJjYWxsIiwidmFsaWRhdGlvbkRpY3Rpb25hcnkiLCIkc3RhdGUiLCIkIiwiJGJvZHkiLCJfaW5oZXJpdHNMb29zZSIsIl9wcm90byIsInByb3RvdHlwZSIsIm9uUmVhZHkiLCIkZWRpdEFjY291bnRGb3JtIiwiJGFkZHJlc3NGb3JtIiwiJGluYm94Rm9ybSIsIiRhY2NvdW50UmV0dXJuRm9ybSIsIiRwYXltZW50TWV0aG9kRm9ybSIsIiRyZW9yZGVyRm9ybSIsIiRpbnZvaWNlQnV0dG9uIiwiJGJpZ0NvbW1lcmNlIiwid2luZG93IiwiQmlnQ29tbWVyY2UiLCJwYXNzd29yZFJlcXVpcmVtZW50cyIsImxvYWQiLCJsZW5ndGgiLCJyZWdpc3RlckVkaXRBY2NvdW50VmFsaWRhdGlvbiIsImlzIiwib24iLCJsZWZ0Iiwic2NyZWVuIiwiYXZhaWxXaWR0aCIsInRvcCIsImF2YWlsSGVpZ2h0IiwidXJsIiwiZGF0YSIsIm9wZW4iLCJpbml0QWRkcmVzc0Zvcm1WYWxpZGF0aW9uIiwicmVnaXN0ZXJJbmJveFZhbGlkYXRpb24iLCJpbml0QWNjb3VudFJldHVybkZvcm1WYWxpZGF0aW9uIiwiaW5pdFBheW1lbnRNZXRob2RGb3JtVmFsaWRhdGlvbiIsImluaXRSZW9yZGVyRm9ybSIsInJlbmRlckFjY291bnRQYXltZW50cyIsIl90aGlzJGNvbnRleHQiLCJjb3VudHJpZXMiLCJwYXltZW50c1VybCIsInN0b3JlSGFzaCIsInN0b3JlTG9jYWxlIiwidmF1bHRUb2tlbiIsInNob3BwZXJJZCIsImN1c3RvbWVyRW1haWwiLCJwcm92aWRlcklkIiwiY3VycmVuY3lDb2RlIiwicGF5bWVudE1ldGhvZHNVcmwiLCJwYXltZW50UHJvdmlkZXJJbml0aWFsaXphdGlvbkRhdGEiLCJ0aGVtZVNldHRpbmdzIiwic3R5bGVzIiwiaW5wdXRCYXNlIiwiY29sb3IiLCJib3JkZXJDb2xvciIsImlucHV0VmFsaWRhdGlvbkVycm9yIiwiaW5wdXRWYWxpZGF0aW9uU3VjY2VzcyIsInN1Ym1pdEJ1dHRvbiIsImJhY2tncm91bmRDb2xvciIsImN1cnNvciIsImNhbmNlbEJ1dHRvbiIsImxhYmVsIiwidmFsaWRhdGlvbkVycm9yIiwiaGVhZGluZyIsInN0b3JlQ29udGV4dERhdGEiLCJlcnJvckhhbmRsZXIiLCJiaW5kRGVsZXRlQWRkcmVzcyIsImJpbmREZWxldGVQYXltZW50TWV0aG9kIiwiZXZlbnQiLCJtZXNzYWdlIiwiY3VycmVudFRhcmdldCIsImNvbmZpcm0iLCJwcmV2ZW50RGVmYXVsdCIsIl90aGlzMiIsIiRwcm9kdWN0UmVvcmRlckNoZWNrYm94ZXMiLCJzdWJtaXRGb3JtIiwiZmluZCIsInJlbW92ZSIsImVhY2giLCJpbmRleCIsInByb2R1Y3RDaGVja2JveCIsInByb2R1Y3RJZCIsInZhbCIsIiRpbnB1dCIsInR5cGUiLCJuYW1lIiwidmFsdWUiLCJhcHBlbmQiLCJzZWxlY3RJdGVtIiwiX3RoaXMzIiwidmFsaWRhdGlvbk1vZGVsIiwic3RhdGVTZWxlY3RvciIsIiRzdGF0ZUVsZW1lbnQiLCJhZGRyZXNzVmFsaWRhdG9yIiwic3VibWl0IiwidGFwIiwiYWRkIiwiJGxhc3QiLCJlcnIiLCJmaWVsZCIsIkVycm9yIiwiJGZpZWxkIiwiZ2V0U3RhdHVzIiwic2V0U3RhdGVDb3VudHJ5VmFsaWRhdGlvbiIsImZpZWxkX25vdF9ibGFuayIsImNsZWFuVXBTdGF0ZVZhbGlkYXRpb24iLCJwZXJmb3JtQ2hlY2siLCJhcmVBbGwiLCJlcnJvck1lc3NhZ2UiLCJmb3JtU3VibWl0IiwiaSIsImVsZSIsInBhcnNlSW50IiwiX3RoaXM0IiwiYXR0ciIsImZpcnN0TmFtZUxhYmVsIiwibGFzdE5hbWVMYWJlbCIsImNvbXBhbnlMYWJlbCIsInBob25lTGFiZWwiLCJhZGRyZXNzMUxhYmVsIiwiYWRkcmVzczJMYWJlbCIsImNpdHlMYWJlbCIsImNvdW50cnlMYWJlbCIsImNob29zZUNvdW50cnlMYWJlbCIsInN0YXRlTGFiZWwiLCJwb3N0YWxDb2RlTGFiZWwiLCJwYXltZW50TWV0aG9kU2VsZWN0b3IiLCJwYXltZW50TWV0aG9kVmFsaWRhdG9yIiwiY2FyZFR5cGUiLCJfcmVmIiwidGFyZ2V0Iiwic2libGluZ3MiLCJjc3MiLCJzZXRDcmVkaXRDYXJkTnVtYmVyVmFsaWRhdGlvbiIsImNyZWRpdENhcmROdW1iZXIiLCJzZXRFeHBpcmF0aW9uVmFsaWRhdGlvbiIsImV4cGlyYXRpb24iLCJzZXROYW1lT25DYXJkVmFsaWRhdGlvbiIsIm5hbWVPbkNhcmQiLCJzZXRDdnZWYWxpZGF0aW9uIiwiY3Z2Iiwic2V0Q3JlZGl0Q2FyZE51bWJlckZvcm1hdCIsInNldEV4cGlyYXRpb25Gb3JtYXQiLCJfcmVkdWNlIiwic2VyaWFsaXplQXJyYXkiLCJvYmoiLCJpdGVtIiwicmVmT2JqIiwiY291bnRyeSIsIl9maW5kIiwiX3JlZjIiLCJzdGF0ZSIsInN0YXRlcyIsIl9yZWYzIiwiY291bnRyeV9jb2RlIiwiY29kZSIsInN0YXRlX29yX3Byb3ZpbmNlX2NvZGUiLCJkZWZhdWx0X2luc3RydW1lbnQiLCJsb2NhdGlvbiIsImhyZWYiLCJnZW5lcmljX2Vycm9yIiwiZm9ybUVkaXRTZWxlY3RvciIsImVkaXRWYWxpZGF0b3IiLCJkZWxheSIsImVtYWlsU2VsZWN0b3IiLCIkZW1haWxFbGVtZW50IiwicGFzc3dvcmRTZWxlY3RvciIsIiRwYXNzd29yZEVsZW1lbnQiLCJwYXNzd29yZDJTZWxlY3RvciIsIiRwYXNzd29yZDJFbGVtZW50IiwiY3VycmVudFBhc3N3b3JkU2VsZWN0b3IiLCIkY3VycmVudFBhc3N3b3JkIiwic2V0RW1haWxWYWxpZGF0aW9uIiwidmFsaWRfZW1haWwiLCJfdGhpcyR2YWxpZGF0aW9uRGljdGkiLCJlbnRlclBhc3N3b3JkIiwicGFzc3dvcmQiLCJtYXRjaFBhc3N3b3JkIiwicGFzc3dvcmRfbWF0Y2giLCJzZXRQYXNzd29yZFZhbGlkYXRpb24iLCJlcnJvciIsInNlbGVjdG9yIiwidmFsaWRhdGUiLCJjYiIsInJlc3VsdCIsImN1cnJlbnRQYXNzd29yZCIsImZpcnN0TmFtZSIsImxhc3ROYW1lIiwic2V0VGltZW91dCIsImVhcmxpZXN0RXJyb3IiLCJwcmV2IiwiZm9jdXMiLCJpbmJveFZhbGlkYXRvciIsIk51bWJlciIsImVudGVyT3JkZXJOdW0iLCJlbnRlclN1YmplY3QiLCJlbnRlck1lc3NhZ2UiLCJkZWZhdWx0IiwiY3JlZGl0Y2FyZHMiLCJvbWl0TnVsbFN0cmluZyIsImtleSIsImNhcmQiLCJwYXJzZSIsImRvbmUiLCJmYWlsIiwicHJvdmlkZXJfaWQiLCJjdXJyZW5jeV9jb2RlIiwiY3JlZGl0X2NhcmRfbnVtYmVyIiwibmFtZV9vbl9jYXJkIiwiYWRkcmVzczEiLCJhZGRyZXNzMiIsImNpdHkiLCJwb3N0YWxfY29kZSIsImNvbXBhbnkiLCJmaXJzdF9uYW1lIiwibGFzdF9uYW1lIiwiZW1haWwiLCJwaG9uZSIsImV4cGlyeSIsInNwbGl0IiwiYWpheCIsImRhdGFUeXBlIiwibWV0aG9kIiwiY2FjaGUiLCJoZWFkZXJzIiwiQXV0aG9yaXphdGlvbiIsIkFjY2VwdCIsIkpTT04iLCJzdHJpbmdpZnkiLCJpbnN0cnVtZW50IiwiY2FyZGhvbGRlcl9uYW1lIiwibnVtYmVyIiwiZXhwaXJ5X21vbnRoIiwibW9udGgiLCJleHBpcnlfeWVhciIsInllYXIiLCJ2ZXJpZmljYXRpb25fdmFsdWUiLCJiaWxsaW5nX2FkZHJlc3MiLCJyZWZUYXJnZXQiLCJmb3JtYXQiLCJfcmVmNCIsIndoaWNoIiwidGVzdCIsInNsaWNlIiwicmVwbGFjZSIsInZhbGlkYXRvciIsImlzVmFsaWQiLCJpc1Bhc3QiLCJjdmMiLCJkZWNyZW1lbnRDb3VudGVyIiwiY291bnRlciIsImluZGV4T2YiLCJzcGxpY2UiLCJpbmNyZW1lbnRDb3VudGVyIiwicHVzaCIsInVwZGF0ZUNvdW50ZXJOYXYiLCIkbGluayIsInVybHMiLCJhZGRDbGFzcyIsImNvbXBhcmUiLCJqb2luIiwiaHRtbCIsInJlbW92ZUNsYXNzIiwibm9Db21wYXJlTWVzc2FnZSIsImNvbXBhcmVDb3VudGVyIiwiJGNvbXBhcmVMaW5rIiwiJGNoZWNrZWQiLCJtYXAiLCJlbGVtZW50IiwiZ2V0IiwidHJpZ2dlckhhbmRsZXIiLCJwcm9kdWN0IiwiJGNsaWNrZWRDb21wYXJlTGluayIsImNoZWNrZWQiLCIkY2xpY2tlZENoZWNrZWRJbnB1dCJdLCJzb3VyY2VSb290IjoiIn0=
