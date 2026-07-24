"use strict";
(self["webpackChunkbigcommerce_cornerstone"] = self["webpackChunkbigcommerce_cornerstone"] || []).push([["assets_js_theme_common_utils_form-utils_js-assets_js_theme_page-manager_js"],{

/***/ "./assets/js/theme/common/models/forms.js":
/*!************************************************!*\
  !*** ./assets/js/theme/common/models/forms.js ***!
  \************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
var forms = {
  email: function email(value) {
    var re = /^\S+@\S+\.\S+/;
    return re.test(value);
  },
  /**
   * Validates a password field
   * @param value
   * @returns {boolean}
   */
  password: function password(value) {
    return this.notEmpty(value);
  },
  /**
   * validates if a field is empty
   * @param value
   * @returns {boolean}
   *
   */
  notEmpty: function notEmpty(value) {
    return value.length > 0;
  },
  /**
   * validates a field like product quantity
   * @param value
   * @returns {boolean}
   *
   */
  numbersOnly: function numbersOnly(value) {
    var re = /^\d+$/;
    return re.test(value);
  },
  /**
   * validates increase in value does not exceed max
   * @param {number} value
   * @param {number} max
   * @returns {number}
   *
   */
  validateIncreaseAgainstMaxBoundary: function validateIncreaseAgainstMaxBoundary(value, max) {
    var raise = value + 1;
    if (!max || raise <= max) return raise;
    return value;
  },
  /**
   * validates decrease in value does not fall below min
   * @param {number} value
   * @param {number} min
   * @returns {number}
   *
   */
  validateDecreaseAgainstMinBoundary: function validateDecreaseAgainstMinBoundary(value, min) {
    var decline = value - 1;
    if (!min || decline >= min) return decline;
    return value;
  }
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (forms);

/***/ }),

/***/ "./assets/js/theme/common/nod-functions/min-max-validate.js":
/*!******************************************************************!*\
  !*** ./assets/js/theme/common/nod-functions/min-max-validate.js ***!
  \******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* provided dependency */ var $ = __webpack_require__(/*! jquery */ "./node_modules/jquery/dist/jquery.min.js");
function minMaxValidate(minInputSelector, maxInputSelector) {
  function validate(cb) {
    var minValue = parseFloat($(minInputSelector).val());
    var maxValue = parseFloat($(maxInputSelector).val());
    if (maxValue > minValue || Number.isNaN(maxValue) || Number.isNaN(minValue)) {
      return cb(true);
    }
    return cb(false);
  }
  return validate;
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (minMaxValidate);

/***/ }),

/***/ "./assets/js/theme/common/nod.js":
/*!***************************************!*\
  !*** ./assets/js/theme/common/nod.js ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var nod_validate__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! nod-validate */ "./node_modules/nod-validate/nod.js");
/* harmony import */ var nod_validate__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(nod_validate__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _nod_functions_min_max_validate__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./nod-functions/min-max-validate */ "./assets/js/theme/common/nod-functions/min-max-validate.js");



// Hook our SCSS framework form field status classes into the nod validation system before use
(nod_validate__WEBPACK_IMPORTED_MODULE_0___default().classes).errorClass = 'form-field--error';
(nod_validate__WEBPACK_IMPORTED_MODULE_0___default().classes).successClass = 'form-field--success';
(nod_validate__WEBPACK_IMPORTED_MODULE_0___default().classes).errorMessageClass = 'form-inlineMessage';

// Register validate functions
(nod_validate__WEBPACK_IMPORTED_MODULE_0___default().checkFunctions)['min-max'] = _nod_functions_min_max_validate__WEBPACK_IMPORTED_MODULE_1__["default"];
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((nod_validate__WEBPACK_IMPORTED_MODULE_0___default()));

/***/ }),

/***/ "./assets/js/theme/common/utils/form-utils.js":
/*!****************************************************!*\
  !*** ./assets/js/theme/common/utils/form-utils.js ***!
  \****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Validators: () => (/* binding */ Validators),
/* harmony export */   announceInputErrorMessage: () => (/* binding */ announceInputErrorMessage),
/* harmony export */   classifyForm: () => (/* binding */ classifyForm),
/* harmony export */   createPasswordValidationErrorTextObject: () => (/* binding */ createPasswordValidationErrorTextObject),
/* harmony export */   insertStateHiddenField: () => (/* binding */ insertStateHiddenField)
/* harmony export */ });
/* harmony import */ var lodash_capitalize__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! lodash/capitalize */ "./node_modules/lodash/capitalize.js");
/* harmony import */ var lodash_capitalize__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lodash_capitalize__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var lodash_camelCase__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! lodash/camelCase */ "./node_modules/lodash/camelCase.js");
/* harmony import */ var lodash_camelCase__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(lodash_camelCase__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _nod__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../nod */ "./assets/js/theme/common/nod.js");
/* harmony import */ var _models_forms__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../models/forms */ "./assets/js/theme/common/models/forms.js");
/* provided dependency */ var $ = __webpack_require__(/*! jquery */ "./node_modules/jquery/dist/jquery.min.js");




var inputTagNames = ['input', 'select', 'textarea'];
/**
 * Set up Object with Error Messages on Password Validation. Please use messages in mentioned order
 * @param {string} empty defines error text for empty field
 * @param {string} confirm defines error text for empty confirmation field
 * @param {string} mismatch defines error text if confirm passford mismatches passford field
 * @param {string} invalid defines error text for invalid password charaters sequence
 * @return {object} messages or default texts if nothing is providing
 */
var createPasswordValidationErrorTextObject = function createPasswordValidationErrorTextObject(empty, confirm, mismatch, invalid) {
  return {
    onEmptyPasswordErrorText: empty,
    onConfirmPasswordErrorText: confirm,
    onMismatchPasswordErrorText: mismatch,
    onNotValidPasswordErrorText: invalid
  };
};

/**
 * Apply class name to an input element on its type
 * @param {object} input
 * @param {string} formFieldClass
 * @return {object} Element itself
 */
function classifyInput(input, formFieldClass) {
  var $input = $(input);
  var $formField = $input.parent("." + formFieldClass);
  var tagName = $input.prop('tagName').toLowerCase();
  var className = formFieldClass + "--" + tagName;
  var specificClassName;

  // Input can be text/checkbox/radio etc...
  if (tagName === 'input') {
    var inputType = $input.prop('type');
    if (['radio', 'checkbox', 'submit'].includes(inputType)) {
      // ie: .form-field--checkbox, .form-field--radio
      className = formFieldClass + "--" + lodash_camelCase__WEBPACK_IMPORTED_MODULE_1___default()(inputType);
    } else {
      // ie: .form-field--input .form-field--inputText
      specificClassName = "" + className + lodash_capitalize__WEBPACK_IMPORTED_MODULE_0___default()(inputType);
    }
  }

  // Apply class modifier
  return $formField.addClass(className).addClass(specificClassName);
}

/**
 * Apply class name to each input element in a form based on its type
 * @example
 * // Before
 * <form id="form">
 *     <div class="form-field">
 *         <input type="text">
 *     </div>
 *     <div class="form-field">
 *         <select>...</select>
 *     </div>
 * </form>
 *
 * classifyForm('#form', { formFieldClass: 'form-field' });
 *
 * // After
 * <div class="form-field form-field--input form-field--inputText">...</div>
 * <div class="form-field form-field--select">...</div>
 *
 * @param {string|object} formSelector - selector or element
 * @param {object} options
 * @return {jQuery} Element itself
 */
function classifyForm(formSelector, options) {
  if (options === void 0) {
    options = {};
  }
  var $form = $(formSelector);
  var $inputs = $form.find(inputTagNames.join(', '));

  // Obtain options
  var _options = options,
    _options$formFieldCla = _options.formFieldClass,
    formFieldClass = _options$formFieldCla === void 0 ? 'form-field' : _options$formFieldCla;

  // Classify each input in a form
  $inputs.each(function (__, input) {
    classifyInput(input, formFieldClass);
  });
  return $form;
}

/**
 * Get id from given field
 * @param {object} $field JQuery field object
 * @return {string}
 */
function getFieldId($field) {
  var fieldId = $field.prop('name').match(/(\[.*\])/);
  if (fieldId && fieldId.length !== 0) {
    return fieldId[0];
  }
  return '';
}

/**
 * Insert hidden field after State/Province field
 * @param {object} $stateField JQuery field object
 */
function insertStateHiddenField($stateField) {
  var fieldId = getFieldId($stateField);
  var stateFieldAttrs = {
    type: 'hidden',
    name: "FormFieldIsText" + fieldId,
    value: '1'
  };
  $stateField.after($('<input />', stateFieldAttrs));
}

/**
 * Announce form input error message by screen reader
 * @param {params.element} dom input element where checking is happened
 * @param {params.result} result of validation check
 */
function announceInputErrorMessage(_ref) {
  var element = _ref.element,
    result = _ref.result;
  if (result) {
    return;
  }
  var activeInputContainer = $(element).parent();
  // the reason for using span tag is nod-validate lib
  // which does not add error message class while initialising form.
  // specific class is added since it can be multiple spans
  var errorMessage = $(activeInputContainer).find('span.form-inlineMessage');
  if (errorMessage.length) {
    var $errMessage = $(errorMessage[0]);
    if (!$errMessage.attr('role')) {
      $errMessage.attr('role', 'alert');
    }
  }
}
var Validators = {
  /**
   * Sets up a new validation when the form is dirty
   * @param validator
   * @param field
   * @param {string} errorText describes errorMassage on email validation
   */
  setEmailValidation: function setEmailValidation(validator, field, errorText) {
    if (field) {
      validator.add({
        selector: field,
        validate: function validate(cb, val) {
          var result = _models_forms__WEBPACK_IMPORTED_MODULE_3__["default"].email(val);
          cb(result);
        },
        errorMessage: errorText
      });
    }
  },
  /**
   * Validate password fields
   * @param validator
   * @param passwordSelector
   * @param password2Selector
   * @param requirements
   * @param {object} errorTextsObject
   * @param isOptional
   */
  setPasswordValidation: function setPasswordValidation(validator, passwordSelector, password2Selector, requirements, _ref2, isOptional) {
    var onEmptyPasswordErrorText = _ref2.onEmptyPasswordErrorText,
      onConfirmPasswordErrorText = _ref2.onConfirmPasswordErrorText,
      onMismatchPasswordErrorText = _ref2.onMismatchPasswordErrorText,
      onNotValidPasswordErrorText = _ref2.onNotValidPasswordErrorText;
    var $password = $(passwordSelector);
    var passwordValidations = [{
      selector: passwordSelector,
      validate: function validate(cb, val) {
        var result = val.length;
        if (isOptional) {
          return cb(true);
        }
        cb(result);
      },
      errorMessage: onEmptyPasswordErrorText
    }, {
      selector: passwordSelector,
      validate: function validate(cb, val) {
        var result = val.match(new RegExp(requirements.alpha)) && val.match(new RegExp(requirements.numeric)) && val.length >= requirements.minlength;

        // If optional and nothing entered, it is valid
        if (isOptional && val.length === 0) {
          return cb(true);
        }
        cb(result);
      },
      errorMessage: onNotValidPasswordErrorText
    }, {
      selector: password2Selector,
      validate: function validate(cb, val) {
        var result = val.length;
        if (isOptional) {
          return cb(true);
        }
        cb(result);
      },
      errorMessage: onConfirmPasswordErrorText
    }, {
      selector: password2Selector,
      validate: function validate(cb, val) {
        var result = val === $password.val();
        cb(result);
      },
      errorMessage: onMismatchPasswordErrorText
    }];
    validator.add(passwordValidations);
  },
  /**
   * Validate password fields
   * @param {Nod} validator
   * @param {Object} selectors
   * @param {string} selectors.errorSelector
   * @param {string} selectors.fieldsetSelector
   * @param {string} selectors.formSelector
   * @param {string} selectors.maxPriceSelector
   * @param {string} selectors.minPriceSelector
   */
  setMinMaxPriceValidation: function setMinMaxPriceValidation(validator, selectors, priceValidationErrorTexts) {
    if (priceValidationErrorTexts === void 0) {
      priceValidationErrorTexts = {};
    }
    var errorSelector = selectors.errorSelector,
      fieldsetSelector = selectors.fieldsetSelector,
      formSelector = selectors.formSelector,
      maxPriceSelector = selectors.maxPriceSelector,
      minPriceSelector = selectors.minPriceSelector;

    // eslint-disable-next-line object-curly-newline
    var _priceValidationError = priceValidationErrorTexts,
      onMinPriceError = _priceValidationError.onMinPriceError,
      onMaxPriceError = _priceValidationError.onMaxPriceError,
      minPriceNotEntered = _priceValidationError.minPriceNotEntered,
      maxPriceNotEntered = _priceValidationError.maxPriceNotEntered,
      onInvalidPrice = _priceValidationError.onInvalidPrice;
    validator.configure({
      form: formSelector,
      preventSubmit: true,
      successClass: '_' // KLUDGE: Don't apply success class
    });

    validator.add({
      errorMessage: onMinPriceError,
      selector: minPriceSelector,
      validate: "min-max:" + minPriceSelector + ":" + maxPriceSelector
    });
    validator.add({
      errorMessage: onMaxPriceError,
      selector: maxPriceSelector,
      validate: "min-max:" + minPriceSelector + ":" + maxPriceSelector
    });
    validator.add({
      errorMessage: maxPriceNotEntered,
      selector: maxPriceSelector,
      validate: 'presence'
    });
    validator.add({
      errorMessage: minPriceNotEntered,
      selector: minPriceSelector,
      validate: 'presence'
    });
    validator.add({
      errorMessage: onInvalidPrice,
      selector: [minPriceSelector, maxPriceSelector],
      validate: 'min-number:0'
    });
    validator.setMessageOptions({
      selector: [minPriceSelector, maxPriceSelector],
      parent: fieldsetSelector,
      errorSpan: errorSelector
    });
  },
  /**
   * Sets up a new validation when the form is dirty
   * @param validator
   * @param field
   */
  setStateCountryValidation: function setStateCountryValidation(validator, field, errorText) {
    if (field) {
      validator.add({
        selector: field,
        validate: 'presence',
        errorMessage: errorText
      });
    }
  },
  /**
   * Removes classes from dirty form if previously checked
   * @param field
   */
  cleanUpStateValidation: function cleanUpStateValidation(field) {
    var $fieldClassElement = $("[data-type=\"" + field.data('fieldType') + "\"]");
    Object.keys(_nod__WEBPACK_IMPORTED_MODULE_2__["default"].classes).forEach(function (value) {
      if ($fieldClassElement.hasClass(_nod__WEBPACK_IMPORTED_MODULE_2__["default"].classes[value])) {
        $fieldClassElement.removeClass(_nod__WEBPACK_IMPORTED_MODULE_2__["default"].classes[value]);
      }
    });
  }
};


/***/ }),

/***/ "./assets/js/theme/page-manager.js":
/*!*****************************************!*\
  !*** ./assets/js/theme/page-manager.js ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ PageManager)
/* harmony export */ });
/* provided dependency */ var $ = __webpack_require__(/*! jquery */ "./node_modules/jquery/dist/jquery.min.js");
var PageManager = /*#__PURE__*/function () {
  function PageManager(context) {
    this.context = context;
  }
  var _proto = PageManager.prototype;
  _proto.type = function type() {
    return this.constructor.name;
  };
  _proto.onReady = function onReady() {};
  PageManager.load = function load(context) {
    var page = new this(context);
    $(document).ready(function () {
      page.onReady.bind(page)();
    });
  };
  return PageManager;
}();


/***/ })

}]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGhlbWUtYnVuZGxlLmNodW5rLmFzc2V0c19qc190aGVtZV9jb21tb25fdXRpbHNfZm9ybS11dGlsc19qcy1hc3NldHNfanNfdGhlbWVfcGFnZS1tYW5hZ2VyX2pzLmpzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7QUFBQSxJQUFNQSxLQUFLLEdBQUc7RUFDVkMsS0FBSyxXQUFBQSxNQUFDQyxLQUFLLEVBQUU7SUFDVCxJQUFNQyxFQUFFLEdBQUcsZUFBZTtJQUMxQixPQUFPQSxFQUFFLENBQUNDLElBQUksQ0FBQ0YsS0FBSyxDQUFDO0VBQ3pCLENBQUM7RUFFRDtBQUNKO0FBQ0E7QUFDQTtBQUNBO0VBQ0lHLFFBQVEsV0FBQUEsU0FBQ0gsS0FBSyxFQUFFO0lBQ1osT0FBTyxJQUFJLENBQUNJLFFBQVEsQ0FBQ0osS0FBSyxDQUFDO0VBQy9CLENBQUM7RUFFRDtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7RUFDSUksUUFBUSxXQUFBQSxTQUFDSixLQUFLLEVBQUU7SUFDWixPQUFPQSxLQUFLLENBQUNLLE1BQU0sR0FBRyxDQUFDO0VBQzNCLENBQUM7RUFFRDtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7RUFDSUMsV0FBVyxXQUFBQSxZQUFDTixLQUFLLEVBQUU7SUFDZixJQUFNQyxFQUFFLEdBQUcsT0FBTztJQUNsQixPQUFPQSxFQUFFLENBQUNDLElBQUksQ0FBQ0YsS0FBSyxDQUFDO0VBQ3pCLENBQUM7RUFFRDtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtFQUNJTyxrQ0FBa0MsV0FBQUEsbUNBQUNQLEtBQUssRUFBRVEsR0FBRyxFQUFFO0lBQzNDLElBQU1DLEtBQUssR0FBR1QsS0FBSyxHQUFHLENBQUM7SUFFdkIsSUFBSSxDQUFDUSxHQUFHLElBQUlDLEtBQUssSUFBSUQsR0FBRyxFQUFFLE9BQU9DLEtBQUs7SUFDdEMsT0FBT1QsS0FBSztFQUNoQixDQUFDO0VBRUQ7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7RUFDSVUsa0NBQWtD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QUN3SCxRQUFRLENBQUMsQ0FBQ0MsS0FBSyxDQUFDLFlBQU07TUFDcEJGLElBQUksQ0FBQ0YsT0FBTyxDQUFDSyxJQUFJLENBQUNILElBQUksQ0FBQyxDQUFDLENBQUM7SUFDN0IsQ0FBQyxDQUFDO0VBQ04sQ0FBQztFQUFBLE9BQUFQLFdBQUE7QUFBQSIsInNvdXJjZXMiOlsid2VicGFjazovL2JpZ2NvbW1lcmNlLWNvcm5lcnN0b25lLy4vYXNzZXRzL2pzL3RoZW1lL2NvbW1vbi9tb2RlbHMvZm9ybXMuanMiLCJ3ZWJwYWNrOi8vYmlnY29tbWVyY2UtY29ybmVyc3RvbmUvLi9hc3NldHMvanMvdGhlbWUvY29tbW9uL25vZC1mdW5jdGlvbnMvbWluLW1heC12YWxpZGF0ZS5qcyIsIndlYnBhY2s6Ly9iaWdjb21tZXJjZS1jb3JuZXJzdG9uZS8uL2Fzc2V0cy9qcy90aGVtZS9jb21tb24vbm9kLmpzIiwid2VicGFjazovL2JpZ2NvbW1lcmNlLWNvcm5lcnN0b25lLy4vYXNzZXRzL2pzL3RoZW1lL2NvbW1vbi91dGlscy9mb3JtLXV0aWxzLmpzIiwid2VicGFjazovL2JpZ2NvbW1lcmNlLWNvcm5lcnN0b25lLy4vYXNzZXRzL2pzL3RoZW1lL3BhZ2UtbWFuYWdlci5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCBmb3JtcyA9IHtcbiAgICBlbWFpbCh2YWx1ZSkge1xuICAgICAgICBjb25zdCByZSA9IC9eXFxTK0BcXFMrXFwuXFxTKy87XG4gICAgICAgIHJldHVybiByZS50ZXN0KHZhbHVlKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogVmFsaWRhdGVzIGEgcGFzc3dvcmQgZmllbGRcbiAgICAgKiBAcGFyYW0gdmFsdWVcbiAgICAgKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAgICAgKi9cbiAgICBwYXNzd29yZCh2YWx1ZSkge1xuICAgICAgICByZXR1cm4gdGhpcy5ub3RFbXB0eSh2YWx1ZSk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIHZhbGlkYXRlcyBpZiBhIGZpZWxkIGlzIGVtcHR5XG4gICAgICogQHBhcmFtIHZhbHVlXG4gICAgICogQHJldHVybnMge2Jvb2xlYW59XG4gICAgICpcbiAgICAgKi9cbiAgICBub3RFbXB0eSh2YWx1ZSkge1xuICAgICAgICByZXR1cm4gdmFsdWUubGVuZ3RoID4gMDtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogdmFsaWRhdGVzIGEgZmllbGQgbGlrZSBwcm9kdWN0IHF1YW50aXR5XG4gICAgICogQHBhcmFtIHZhbHVlXG4gICAgICogQHJldHVybnMge2Jvb2xlYW59XG4gICAgICpcbiAgICAgKi9cbiAgICBudW1iZXJzT25seSh2YWx1ZSkge1xuICAgICAgICBjb25zdCByZSA9IC9eXFxkKyQvO1xuICAgICAgICByZXR1cm4gcmUudGVzdCh2YWx1ZSk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIHZhbGlkYXRlcyBpbmNyZWFzZSBpbiB2YWx1ZSBkb2VzIG5vdCBleGNlZWQgbWF4XG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHZhbHVlXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IG1heFxuICAgICAqIEByZXR1cm5zIHtudW1iZXJ9XG4gICAgICpcbiAgICAgKi9cbiAgICB2YWxpZGF0ZUluY3JlYXNlQWdhaW5zdE1heEJvdW5kYXJ5KHZhbHVlLCBtYXgpIHtcbiAgICAgICAgY29uc3QgcmFpc2UgPSB2YWx1ZSArIDE7XG5cbiAgICAgICAgaWYgKCFtYXggfHwgcmFpc2UgPD0gbWF4KSByZXR1cm4gcmFpc2U7XG4gICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogdmFsaWRhdGVzIGRlY3JlYXNlIGluIHZhbHVlIGRvZXMgbm90IGZhbGwgYmVsb3cgbWluXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHZhbHVlXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IG1pblxuICAgICAqIEByZXR1cm5zIHtudW1iZXJ9XG4gICAgICpcbiAgICAgKi9cbiAgICB2YWxpZGF0ZURlY3JlYXNlQWdhaW5zdE1pbkJvdW5kYXJ5KHZhbHVlLCBtaW4pIHtcbiAgICAgICAgY29uc3QgZGVjbGluZSA9IHZhbHVlIC0gMTtcblxuICAgICAgICBpZiAoIW1pbiB8fCBkZWNsaW5lID49IG1pbikgcmV0dXJuIGRlY2xpbmU7XG4gICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICB9LFxufTtcblxuZXhwb3J0IGRlZmF1bHQgZm9ybXM7XG4iLCJmdW5jdGlvbiBtaW5NYXhWYWxpZGF0ZShtaW5JbnB1dFNlbGVjdG9yLCBtYXhJbnB1dFNlbGVjdG9yKSB7XG4gICAgZnVuY3Rpb24gdmFsaWRhdGUoY2IpIHtcbiAgICAgICAgY29uc3QgbWluVmFsdWUgPSBwYXJzZUZsb2F0KCQobWluSW5wdXRTZWxlY3RvcikudmFsKCkpO1xuICAgICAgICBjb25zdCBtYXhWYWx1ZSA9IHBhcnNlRmxvYXQoJChtYXhJbnB1dFNlbGVjdG9yKS52YWwoKSk7XG5cbiAgICAgICAgaWYgKG1heFZhbHVlID4gbWluVmFsdWUgfHwgTnVtYmVyLmlzTmFOKG1heFZhbHVlKSB8fCBOdW1iZXIuaXNOYU4obWluVmFsdWUpKSB7XG4gICAgICAgICAgICByZXR1cm4gY2IodHJ1ZSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gY2IoZmFsc2UpO1xuICAgIH1cblxuICAgIHJldHVybiB2YWxpZGF0ZTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgbWluTWF4VmFsaWRhdGU7XG4iLCJpbXBvcnQgbm9kIGZyb20gJ25vZC12YWxpZGF0ZSc7XG5pbXBvcnQgbWluTWF4VmFsaWRhdGUgZnJvbSAnLi9ub2QtZnVuY3Rpb25zL21pbi1tYXgtdmFsaWRhdGUnO1xuXG4vLyBIb29rIG91ciBTQ1NTIGZyYW1ld29yayBmb3JtIGZpZWxkIHN0YXR1cyBjbGFzc2VzIGludG8gdGhlIG5vZCB2YWxpZGF0aW9uIHN5c3RlbSBiZWZvcmUgdXNlXG5ub2QuY2xhc3Nlcy5lcnJvckNsYXNzID0gJ2Zvcm0tZmllbGQtLWVycm9yJztcbm5vZC5jbGFzc2VzLnN1Y2Nlc3NDbGFzcyA9ICdmb3JtLWZpZWxkLS1zdWNjZXNzJztcbm5vZC5jbGFzc2VzLmVycm9yTWVzc2FnZUNsYXNzID0gJ2Zvcm0taW5saW5lTWVzc2FnZSc7XG5cbi8vIFJlZ2lzdGVyIHZhbGlkYXRlIGZ1bmN0aW9uc1xubm9kLmNoZWNrRnVuY3Rpb25zWydtaW4tbWF4J10gPSBtaW5NYXhWYWxpZGF0ZTtcblxuZXhwb3J0IGRlZmF1bHQgbm9kO1xuIiwiaW1wb3J0IF8gZnJvbSAnbG9kYXNoJztcbmltcG9ydCBub2QgZnJvbSAnLi4vbm9kJztcbmltcG9ydCBmb3JtcyBmcm9tICcuLi9tb2RlbHMvZm9ybXMnO1xuXG5jb25zdCBpbnB1dFRhZ05hbWVzID0gW1xuICAgICdpbnB1dCcsXG4gICAgJ3NlbGVjdCcsXG4gICAgJ3RleHRhcmVhJyxcbl07XG4vKipcbiAqIFNldCB1cCBPYmplY3Qgd2l0aCBFcnJvciBNZXNzYWdlcyBvbiBQYXNzd29yZCBWYWxpZGF0aW9uLiBQbGVhc2UgdXNlIG1lc3NhZ2VzIGluIG1lbnRpb25lZCBvcmRlclxuICogQHBhcmFtIHtzdHJpbmd9IGVtcHR5IGRlZmluZXMgZXJyb3IgdGV4dCBmb3IgZW1wdHkgZmllbGRcbiAqIEBwYXJhbSB7c3RyaW5nfSBjb25maXJtIGRlZmluZXMgZXJyb3IgdGV4dCBmb3IgZW1wdHkgY29uZmlybWF0aW9uIGZpZWxkXG4gKiBAcGFyYW0ge3N0cmluZ30gbWlzbWF0Y2ggZGVmaW5lcyBlcnJvciB0ZXh0IGlmIGNvbmZpcm0gcGFzc2ZvcmQgbWlzbWF0Y2hlcyBwYXNzZm9yZCBmaWVsZFxuICogQHBhcmFtIHtzdHJpbmd9IGludmFsaWQgZGVmaW5lcyBlcnJvciB0ZXh0IGZvciBpbnZhbGlkIHBhc3N3b3JkIGNoYXJhdGVycyBzZXF1ZW5jZVxuICogQHJldHVybiB7b2JqZWN0fSBtZXNzYWdlcyBvciBkZWZhdWx0IHRleHRzIGlmIG5vdGhpbmcgaXMgcHJvdmlkaW5nXG4gKi9cbmV4cG9ydCBjb25zdCBjcmVhdGVQYXNzd29yZFZhbGlkYXRpb25FcnJvclRleHRPYmplY3QgPSAoZW1wdHksIGNvbmZpcm0sIG1pc21hdGNoLCBpbnZhbGlkKSA9PiAoe1xuICAgIG9uRW1wdHlQYXNzd29yZEVycm9yVGV4dDogZW1wdHksXG4gICAgb25Db25maXJtUGFzc3dvcmRFcnJvclRleHQ6IGNvbmZpcm0sXG4gICAgb25NaXNtYXRjaFBhc3N3b3JkRXJyb3JUZXh0OiBtaXNtYXRjaCxcbiAgICBvbk5vdFZhbGlkUGFzc3dvcmRFcnJvclRleHQ6IGludmFsaWQsXG59KTtcblxuXG4vKipcbiAqIEFwcGx5IGNsYXNzIG5hbWUgdG8gYW4gaW5wdXQgZWxlbWVudCBvbiBpdHMgdHlwZVxuICogQHBhcmFtIHtvYmplY3R9IGlucHV0XG4gKiBAcGFyYW0ge3N0cmluZ30gZm9ybUZpZWxkQ2xhc3NcbiAqIEByZXR1cm4ge29iamVjdH0gRWxlbWVudCBpdHNlbGZcbiAqL1xuZnVuY3Rpb24gY2xhc3NpZnlJbnB1dChpbnB1dCwgZm9ybUZpZWxkQ2xhc3MpIHtcbiAgICBjb25zdCAkaW5wdXQgPSAkKGlucHV0KTtcbiAgICBjb25zdCAkZm9ybUZpZWxkID0gJGlucHV0LnBhcmVudChgLiR7Zm9ybUZpZWxkQ2xhc3N9YCk7XG4gICAgY29uc3QgdGFnTmFtZSA9ICRpbnB1dC5wcm9wKCd0YWdOYW1lJykudG9Mb3dlckNhc2UoKTtcblxuICAgIGxldCBjbGFzc05hbWUgPSBgJHtmb3JtRmllbGRDbGFzc30tLSR7dGFnTmFtZX1gO1xuICAgIGxldCBzcGVjaWZpY0NsYXNzTmFtZTtcblxuICAgIC8vIElucHV0IGNhbiBiZSB0ZXh0L2NoZWNrYm94L3JhZGlvIGV0Yy4uLlxuICAgIGlmICh0YWdOYW1lID09PSAnaW5wdXQnKSB7XG4gICAgICAgIGNvbnN0IGlucHV0VHlwZSA9ICRpbnB1dC5wcm9wKCd0eXBlJyk7XG5cbiAgICAgICAgaWYgKFsncmFkaW8nLCAnY2hlY2tib3gnLCAnc3VibWl0J10uaW5jbHVkZXMoaW5wdXRUeXBlKSkge1xuICAgICAgICAgICAgLy8gaWU6IC5mb3JtLWZpZWxkLS1jaGVja2JveCwgLmZvcm0tZmllbGQtLXJhZGlvXG4gICAgICAgICAgICBjbGFzc05hbWUgPSBgJHtmb3JtRmllbGRDbGFzc30tLSR7Xy5jYW1lbENhc2UoaW5wdXRUeXBlKX1gO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gaWU6IC5mb3JtLWZpZWxkLS1pbnB1dCAuZm9ybS1maWVsZC0taW5wdXRUZXh0XG4gICAgICAgICAgICBzcGVjaWZpY0NsYXNzTmFtZSA9IGAke2NsYXNzTmFtZX0ke18uY2FwaXRhbGl6ZShpbnB1dFR5cGUpfWA7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBBcHBseSBjbGFzcyBtb2RpZmllclxuICAgIHJldHVybiAkZm9ybUZpZWxkXG4gICAgICAgIC5hZGRDbGFzcyhjbGFzc05hbWUpXG4gICAgICAgIC5hZGRDbGFzcyhzcGVjaWZpY0NsYXNzTmFtZSk7XG59XG5cbi8qKlxuICogQXBwbHkgY2xhc3MgbmFtZSB0byBlYWNoIGlucHV0IGVsZW1lbnQgaW4gYSBmb3JtIGJhc2VkIG9uIGl0cyB0eXBlXG4gKiBAZXhhbXBsZVxuICogLy8gQmVmb3JlXG4gKiA8Zm9ybSBpZD1cImZvcm1cIj5cbiAqICAgICA8ZGl2IGNsYXNzPVwiZm9ybS1maWVsZFwiPlxuICogICAgICAgICA8aW5wdXQgdHlwZT1cInRleHRcIj5cbiAqICAgICA8L2Rpdj5cbiAqICAgICA8ZGl2IGNsYXNzPVwiZm9ybS1maWVsZFwiPlxuICogICAgICAgICA8c2VsZWN0Pi4uLjwvc2VsZWN0PlxuICogICAgIDwvZGl2PlxuICogPC9mb3JtPlxuICpcbiAqIGNsYXNzaWZ5Rm9ybSgnI2Zvcm0nLCB7IGZvcm1GaWVsZENsYXNzOiAnZm9ybS1maWVsZCcgfSk7XG4gKlxuICogLy8gQWZ0ZXJcbiAqIDxkaXYgY2xhc3M9XCJmb3JtLWZpZWxkIGZvcm0tZmllbGQtLWlucHV0IGZvcm0tZmllbGQtLWlucHV0VGV4dFwiPi4uLjwvZGl2PlxuICogPGRpdiBjbGFzcz1cImZvcm0tZmllbGQgZm9ybS1maWVsZC0tc2VsZWN0XCI+Li4uPC9kaXY+XG4gKlxuICogQHBhcmFtIHtzdHJpbmd8b2JqZWN0fSBmb3JtU2VsZWN0b3IgLSBzZWxlY3RvciBvciBlbGVtZW50XG4gKiBAcGFyYW0ge29iamVjdH0gb3B0aW9uc1xuICogQHJldHVybiB7alF1ZXJ5fSBFbGVtZW50IGl0c2VsZlxuICovXG5leHBvcnQgZnVuY3Rpb24gY2xhc3NpZnlGb3JtKGZvcm1TZWxlY3Rvciwgb3B0aW9ucyA9IHt9KSB7XG4gICAgY29uc3QgJGZvcm0gPSAkKGZvcm1TZWxlY3Rvcik7XG4gICAgY29uc3QgJGlucHV0cyA9ICRmb3JtLmZpbmQoaW5wdXRUYWdOYW1lcy5qb2luKCcsICcpKTtcblxuICAgIC8vIE9idGFpbiBvcHRpb25zXG4gICAgY29uc3QgeyBmb3JtRmllbGRDbGFzcyA9ICdmb3JtLWZpZWxkJyB9ID0gb3B0aW9ucztcblxuICAgIC8vIENsYXNzaWZ5IGVhY2ggaW5wdXQgaW4gYSBmb3JtXG4gICAgJGlucHV0cy5lYWNoKChfXywgaW5wdXQpID0+IHtcbiAgICAgICAgY2xhc3NpZnlJbnB1dChpbnB1dCwgZm9ybUZpZWxkQ2xhc3MpO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuICRmb3JtO1xufVxuXG4vKipcbiAqIEdldCBpZCBmcm9tIGdpdmVuIGZpZWxkXG4gKiBAcGFyYW0ge29iamVjdH0gJGZpZWxkIEpRdWVyeSBmaWVsZCBvYmplY3RcbiAqIEByZXR1cm4ge3N0cmluZ31cbiAqL1xuZnVuY3Rpb24gZ2V0RmllbGRJZCgkZmllbGQpIHtcbiAgICBjb25zdCBmaWVsZElkID0gJGZpZWxkLnByb3AoJ25hbWUnKS5tYXRjaCgvKFxcWy4qXFxdKS8pO1xuXG4gICAgaWYgKGZpZWxkSWQgJiYgZmllbGRJZC5sZW5ndGggIT09IDApIHtcbiAgICAgICAgcmV0dXJuIGZpZWxkSWRbMF07XG4gICAgfVxuXG4gICAgcmV0dXJuICcnO1xufVxuXG4vKipcbiAqIEluc2VydCBoaWRkZW4gZmllbGQgYWZ0ZXIgU3RhdGUvUHJvdmluY2UgZmllbGRcbiAqIEBwYXJhbSB7b2JqZWN0fSAkc3RhdGVGaWVsZCBKUXVlcnkgZmllbGQgb2JqZWN0XG4gKi9cbmZ1bmN0aW9uIGluc2VydFN0YXRlSGlkZGVuRmllbGQoJHN0YXRlRmllbGQpIHtcbiAgICBjb25zdCBmaWVsZElkID0gZ2V0RmllbGRJZCgkc3RhdGVGaWVsZCk7XG4gICAgY29uc3Qgc3RhdGVGaWVsZEF0dHJzID0ge1xuICAgICAgICB0eXBlOiAnaGlkZGVuJyxcbiAgICAgICAgbmFtZTogYEZvcm1GaWVsZElzVGV4dCR7ZmllbGRJZH1gLFxuICAgICAgICB2YWx1ZTogJzEnLFxuICAgIH07XG5cbiAgICAkc3RhdGVGaWVsZC5hZnRlcigkKCc8aW5wdXQgLz4nLCBzdGF0ZUZpZWxkQXR0cnMpKTtcbn1cblxuLyoqXG4gKiBBbm5vdW5jZSBmb3JtIGlucHV0IGVycm9yIG1lc3NhZ2UgYnkgc2NyZWVuIHJlYWRlclxuICogQHBhcmFtIHtwYXJhbXMuZWxlbWVudH0gZG9tIGlucHV0IGVsZW1lbnQgd2hlcmUgY2hlY2tpbmcgaXMgaGFwcGVuZWRcbiAqIEBwYXJhbSB7cGFyYW1zLnJlc3VsdH0gcmVzdWx0IG9mIHZhbGlkYXRpb24gY2hlY2tcbiAqL1xuZnVuY3Rpb24gYW5ub3VuY2VJbnB1dEVycm9yTWVzc2FnZSh7IGVsZW1lbnQsIHJlc3VsdCB9KSB7XG4gICAgaWYgKHJlc3VsdCkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIGNvbnN0IGFjdGl2ZUlucHV0Q29udGFpbmVyID0gJChlbGVtZW50KS5wYXJlbnQoKTtcbiAgICAvLyB0aGUgcmVhc29uIGZvciB1c2luZyBzcGFuIHRhZyBpcyBub2QtdmFsaWRhdGUgbGliXG4gICAgLy8gd2hpY2ggZG9lcyBub3QgYWRkIGVycm9yIG1lc3NhZ2UgY2xhc3Mgd2hpbGUgaW5pdGlhbGlzaW5nIGZvcm0uXG4gICAgLy8gc3BlY2lmaWMgY2xhc3MgaXMgYWRkZWQgc2luY2UgaXQgY2FuIGJlIG11bHRpcGxlIHNwYW5zXG4gICAgY29uc3QgZXJyb3JNZXNzYWdlID0gJChhY3RpdmVJbnB1dENvbnRhaW5lcikuZmluZCgnc3Bhbi5mb3JtLWlubGluZU1lc3NhZ2UnKTtcblxuICAgIGlmIChlcnJvck1lc3NhZ2UubGVuZ3RoKSB7XG4gICAgICAgIGNvbnN0ICRlcnJNZXNzYWdlID0gJChlcnJvck1lc3NhZ2VbMF0pO1xuXG4gICAgICAgIGlmICghJGVyck1lc3NhZ2UuYXR0cigncm9sZScpKSB7XG4gICAgICAgICAgICAkZXJyTWVzc2FnZS5hdHRyKCdyb2xlJywgJ2FsZXJ0Jyk7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbmNvbnN0IFZhbGlkYXRvcnMgPSB7XG4gICAgLyoqXG4gICAgICogU2V0cyB1cCBhIG5ldyB2YWxpZGF0aW9uIHdoZW4gdGhlIGZvcm0gaXMgZGlydHlcbiAgICAgKiBAcGFyYW0gdmFsaWRhdG9yXG4gICAgICogQHBhcmFtIGZpZWxkXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGVycm9yVGV4dCBkZXNjcmliZXMgZXJyb3JNYXNzYWdlIG9uIGVtYWlsIHZhbGlkYXRpb25cbiAgICAgKi9cbiAgICBzZXRFbWFpbFZhbGlkYXRpb246ICh2YWxpZGF0b3IsIGZpZWxkLCBlcnJvclRleHQpID0+IHtcbiAgICAgICAgaWYgKGZpZWxkKSB7XG4gICAgICAgICAgICB2YWxpZGF0b3IuYWRkKHtcbiAgICAgICAgICAgICAgICBzZWxlY3RvcjogZmllbGQsXG4gICAgICAgICAgICAgICAgdmFsaWRhdGU6IChjYiwgdmFsKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IGZvcm1zLmVtYWlsKHZhbCk7XG5cbiAgICAgICAgICAgICAgICAgICAgY2IocmVzdWx0KTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGVycm9yTWVzc2FnZTogZXJyb3JUZXh0LFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogVmFsaWRhdGUgcGFzc3dvcmQgZmllbGRzXG4gICAgICogQHBhcmFtIHZhbGlkYXRvclxuICAgICAqIEBwYXJhbSBwYXNzd29yZFNlbGVjdG9yXG4gICAgICogQHBhcmFtIHBhc3N3b3JkMlNlbGVjdG9yXG4gICAgICogQHBhcmFtIHJlcXVpcmVtZW50c1xuICAgICAqIEBwYXJhbSB7b2JqZWN0fSBlcnJvclRleHRzT2JqZWN0XG4gICAgICogQHBhcmFtIGlzT3B0aW9uYWxcbiAgICAgKi9cbiAgICBzZXRQYXNzd29yZFZhbGlkYXRpb246ICh2YWxpZGF0b3IsIHBhc3N3b3JkU2VsZWN0b3IsIHBhc3N3b3JkMlNlbGVjdG9yLCByZXF1aXJlbWVudHMsIHtcbiAgICAgICAgb25FbXB0eVBhc3N3b3JkRXJyb3JUZXh0LCBvbkNvbmZpcm1QYXNzd29yZEVycm9yVGV4dCwgb25NaXNtYXRjaFBhc3N3b3JkRXJyb3JUZXh0LCBvbk5vdFZhbGlkUGFzc3dvcmRFcnJvclRleHQsXG4gICAgfSwgaXNPcHRpb25hbCkgPT4ge1xuICAgICAgICBjb25zdCAkcGFzc3dvcmQgPSAkKHBhc3N3b3JkU2VsZWN0b3IpO1xuICAgICAgICBjb25zdCBwYXNzd29yZFZhbGlkYXRpb25zID0gW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHNlbGVjdG9yOiBwYXNzd29yZFNlbGVjdG9yLFxuICAgICAgICAgICAgICAgIHZhbGlkYXRlOiAoY2IsIHZhbCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCByZXN1bHQgPSB2YWwubGVuZ3RoO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmIChpc09wdGlvbmFsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gY2IodHJ1ZSk7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBjYihyZXN1bHQpO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgZXJyb3JNZXNzYWdlOiBvbkVtcHR5UGFzc3dvcmRFcnJvclRleHQsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHNlbGVjdG9yOiBwYXNzd29yZFNlbGVjdG9yLFxuICAgICAgICAgICAgICAgIHZhbGlkYXRlOiAoY2IsIHZhbCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCByZXN1bHQgPSB2YWwubWF0Y2gobmV3IFJlZ0V4cChyZXF1aXJlbWVudHMuYWxwaGEpKVxuICAgICAgICAgICAgICAgICAgICAgICAgJiYgdmFsLm1hdGNoKG5ldyBSZWdFeHAocmVxdWlyZW1lbnRzLm51bWVyaWMpKVxuICAgICAgICAgICAgICAgICAgICAgICAgJiYgdmFsLmxlbmd0aCA+PSByZXF1aXJlbWVudHMubWlubGVuZ3RoO1xuXG4gICAgICAgICAgICAgICAgICAgIC8vIElmIG9wdGlvbmFsIGFuZCBub3RoaW5nIGVudGVyZWQsIGl0IGlzIHZhbGlkXG4gICAgICAgICAgICAgICAgICAgIGlmIChpc09wdGlvbmFsICYmIHZhbC5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBjYih0cnVlKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGNiKHJlc3VsdCk7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBlcnJvck1lc3NhZ2U6IG9uTm90VmFsaWRQYXNzd29yZEVycm9yVGV4dCxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgc2VsZWN0b3I6IHBhc3N3b3JkMlNlbGVjdG9yLFxuICAgICAgICAgICAgICAgIHZhbGlkYXRlOiAoY2IsIHZhbCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCByZXN1bHQgPSB2YWwubGVuZ3RoO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmIChpc09wdGlvbmFsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gY2IodHJ1ZSk7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBjYihyZXN1bHQpO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgZXJyb3JNZXNzYWdlOiBvbkNvbmZpcm1QYXNzd29yZEVycm9yVGV4dCxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgc2VsZWN0b3I6IHBhc3N3b3JkMlNlbGVjdG9yLFxuICAgICAgICAgICAgICAgIHZhbGlkYXRlOiAoY2IsIHZhbCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCByZXN1bHQgPSB2YWwgPT09ICRwYXNzd29yZC52YWwoKTtcblxuICAgICAgICAgICAgICAgICAgICBjYihyZXN1bHQpO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgZXJyb3JNZXNzYWdlOiBvbk1pc21hdGNoUGFzc3dvcmRFcnJvclRleHQsXG4gICAgICAgICAgICB9LFxuICAgICAgICBdO1xuXG4gICAgICAgIHZhbGlkYXRvci5hZGQocGFzc3dvcmRWYWxpZGF0aW9ucyk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIFZhbGlkYXRlIHBhc3N3b3JkIGZpZWxkc1xuICAgICAqIEBwYXJhbSB7Tm9kfSB2YWxpZGF0b3JcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gc2VsZWN0b3JzXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHNlbGVjdG9ycy5lcnJvclNlbGVjdG9yXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHNlbGVjdG9ycy5maWVsZHNldFNlbGVjdG9yXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHNlbGVjdG9ycy5mb3JtU2VsZWN0b3JcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gc2VsZWN0b3JzLm1heFByaWNlU2VsZWN0b3JcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gc2VsZWN0b3JzLm1pblByaWNlU2VsZWN0b3JcbiAgICAgKi9cbiAgICBzZXRNaW5NYXhQcmljZVZhbGlkYXRpb246ICh2YWxpZGF0b3IsIHNlbGVjdG9ycywgcHJpY2VWYWxpZGF0aW9uRXJyb3JUZXh0cyA9IHt9KSA9PiB7XG4gICAgICAgIGNvbnN0IHtcbiAgICAgICAgICAgIGVycm9yU2VsZWN0b3IsXG4gICAgICAgICAgICBmaWVsZHNldFNlbGVjdG9yLFxuICAgICAgICAgICAgZm9ybVNlbGVjdG9yLFxuICAgICAgICAgICAgbWF4UHJpY2VTZWxlY3RvcixcbiAgICAgICAgICAgIG1pblByaWNlU2VsZWN0b3IsXG4gICAgICAgIH0gPSBzZWxlY3RvcnM7XG5cbiAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG9iamVjdC1jdXJseS1uZXdsaW5lXG4gICAgICAgIGNvbnN0IHsgb25NaW5QcmljZUVycm9yLCBvbk1heFByaWNlRXJyb3IsIG1pblByaWNlTm90RW50ZXJlZCwgbWF4UHJpY2VOb3RFbnRlcmVkLCBvbkludmFsaWRQcmljZSB9ID0gcHJpY2VWYWxpZGF0aW9uRXJyb3JUZXh0cztcblxuICAgICAgICB2YWxpZGF0b3IuY29uZmlndXJlKHtcbiAgICAgICAgICAgIGZvcm06IGZvcm1TZWxlY3RvcixcbiAgICAgICAgICAgIHByZXZlbnRTdWJtaXQ6IHRydWUsXG4gICAgICAgICAgICBzdWNjZXNzQ2xhc3M6ICdfJywgLy8gS0xVREdFOiBEb24ndCBhcHBseSBzdWNjZXNzIGNsYXNzXG4gICAgICAgIH0pO1xuXG4gICAgICAgIHZhbGlkYXRvci5hZGQoe1xuICAgICAgICAgICAgZXJyb3JNZXNzYWdlOiBvbk1pblByaWNlRXJyb3IsXG4gICAgICAgICAgICBzZWxlY3RvcjogbWluUHJpY2VTZWxlY3RvcixcbiAgICAgICAgICAgIHZhbGlkYXRlOiBgbWluLW1heDoke21pblByaWNlU2VsZWN0b3J9OiR7bWF4UHJpY2VTZWxlY3Rvcn1gLFxuICAgICAgICB9KTtcblxuICAgICAgICB2YWxpZGF0b3IuYWRkKHtcbiAgICAgICAgICAgIGVycm9yTWVzc2FnZTogb25NYXhQcmljZUVycm9yLFxuICAgICAgICAgICAgc2VsZWN0b3I6IG1heFByaWNlU2VsZWN0b3IsXG4gICAgICAgICAgICB2YWxpZGF0ZTogYG1pbi1tYXg6JHttaW5QcmljZVNlbGVjdG9yfToke21heFByaWNlU2VsZWN0b3J9YCxcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdmFsaWRhdG9yLmFkZCh7XG4gICAgICAgICAgICBlcnJvck1lc3NhZ2U6IG1heFByaWNlTm90RW50ZXJlZCxcbiAgICAgICAgICAgIHNlbGVjdG9yOiBtYXhQcmljZVNlbGVjdG9yLFxuICAgICAgICAgICAgdmFsaWRhdGU6ICdwcmVzZW5jZScsXG4gICAgICAgIH0pO1xuXG4gICAgICAgIHZhbGlkYXRvci5hZGQoe1xuICAgICAgICAgICAgZXJyb3JNZXNzYWdlOiBtaW5QcmljZU5vdEVudGVyZWQsXG4gICAgICAgICAgICBzZWxlY3RvcjogbWluUHJpY2VTZWxlY3RvcixcbiAgICAgICAgICAgIHZhbGlkYXRlOiAncHJlc2VuY2UnLFxuICAgICAgICB9KTtcblxuICAgICAgICB2YWxpZGF0b3IuYWRkKHtcbiAgICAgICAgICAgIGVycm9yTWVzc2FnZTogb25JbnZhbGlkUHJpY2UsXG4gICAgICAgICAgICBzZWxlY3RvcjogW21pblByaWNlU2VsZWN0b3IsIG1heFByaWNlU2VsZWN0b3JdLFxuICAgICAgICAgICAgdmFsaWRhdGU6ICdtaW4tbnVtYmVyOjAnLFxuICAgICAgICB9KTtcblxuICAgICAgICB2YWxpZGF0b3Iuc2V0TWVzc2FnZU9wdGlvbnMoe1xuICAgICAgICAgICAgc2VsZWN0b3I6IFttaW5QcmljZVNlbGVjdG9yLCBtYXhQcmljZVNlbGVjdG9yXSxcbiAgICAgICAgICAgIHBhcmVudDogZmllbGRzZXRTZWxlY3RvcixcbiAgICAgICAgICAgIGVycm9yU3BhbjogZXJyb3JTZWxlY3RvcixcbiAgICAgICAgfSk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIFNldHMgdXAgYSBuZXcgdmFsaWRhdGlvbiB3aGVuIHRoZSBmb3JtIGlzIGRpcnR5XG4gICAgICogQHBhcmFtIHZhbGlkYXRvclxuICAgICAqIEBwYXJhbSBmaWVsZFxuICAgICAqL1xuICAgIHNldFN0YXRlQ291bnRyeVZhbGlkYXRpb246ICh2YWxpZGF0b3IsIGZpZWxkLCBlcnJvclRleHQpID0+IHtcbiAgICAgICAgaWYgKGZpZWxkKSB7XG4gICAgICAgICAgICB2YWxpZGF0b3IuYWRkKHtcbiAgICAgICAgICAgICAgICBzZWxlY3RvcjogZmllbGQsXG4gICAgICAgICAgICAgICAgdmFsaWRhdGU6ICdwcmVzZW5jZScsXG4gICAgICAgICAgICAgICAgZXJyb3JNZXNzYWdlOiBlcnJvclRleHQsXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBSZW1vdmVzIGNsYXNzZXMgZnJvbSBkaXJ0eSBmb3JtIGlmIHByZXZpb3VzbHkgY2hlY2tlZFxuICAgICAqIEBwYXJhbSBmaWVsZFxuICAgICAqL1xuICAgIGNsZWFuVXBTdGF0ZVZhbGlkYXRpb246IChmaWVsZCkgPT4ge1xuICAgICAgICBjb25zdCAkZmllbGRDbGFzc0VsZW1lbnQgPSAkKChgW2RhdGEtdHlwZT1cIiR7ZmllbGQuZGF0YSgnZmllbGRUeXBlJyl9XCJdYCkpO1xuXG4gICAgICAgIE9iamVjdC5rZXlzKG5vZC5jbGFzc2VzKS5mb3JFYWNoKCh2YWx1ZSkgPT4ge1xuICAgICAgICAgICAgaWYgKCRmaWVsZENsYXNzRWxlbWVudC5oYXNDbGFzcyhub2QuY2xhc3Nlc1t2YWx1ZV0pKSB7XG4gICAgICAgICAgICAgICAgJGZpZWxkQ2xhc3NFbGVtZW50LnJlbW92ZUNsYXNzKG5vZC5jbGFzc2VzW3ZhbHVlXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH0sXG59O1xuXG5leHBvcnQgeyBWYWxpZGF0b3JzLCBpbnNlcnRTdGF0ZUhpZGRlbkZpZWxkLCBhbm5vdW5jZUlucHV0RXJyb3JNZXNzYWdlIH07XG4iLCJleHBvcnQgZGVmYXVsdCBjbGFzcyBQYWdlTWFuYWdlciB7XG4gICAgY29uc3RydWN0b3IoY29udGV4dCkge1xuICAgICAgICB0aGlzLmNvbnRleHQgPSBjb250ZXh0O1xuICAgIH1cblxuICAgIHR5cGUoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNvbnN0cnVjdG9yLm5hbWU7XG4gICAgfVxuXG4gICAgb25SZWFkeSgpIHtcbiAgICB9XG5cbiAgICBzdGF0aWMgbG9hZChjb250ZXh0KSB7XG4gICAgICAgIGNvbnN0IHBhZ2UgPSBuZXcgdGhpcyhjb250ZXh0KTtcblxuICAgICAgICAkKGRvY3VtZW50KS5yZWFkeSgoKSA9PiB7XG4gICAgICAgICAgICBwYWdlLm9uUmVhZHkuYmluZChwYWdlKSgpO1xuICAgICAgICB9KTtcbiAgICB9XG59XG4iXSwibmFtZXMiOlsiZm9ybXMiLCJlbWFpbCIsInZhbHVlIiwicmUiLCJ0ZXN0IiwicGFzc3dvcmQiLCJub3RFbXB0eSIsImxlbmd0aCIsIm51bWJlcnNPbmx5IiwidmFsaWRhdGVJbmNyZWFzZUFnYWluc3RNYXhCb3VuZGFyeSIsIm1heCIsInJhaXNlIiwidmFsaWRhdGVEZWNyZWFzZUFnYWluc3RNaW5Cb3VuZGFyeSIsIm1pbiIsImRlY2xpbmUiLCJtaW5NYXhWYWxpZGF0ZSIsIm1pbklucHV0U2VsZWN0b3IiLCJtYXhJbnB1dFNlbGVjdG9yIiwidmFsaWRhdGUiLCJjYiIsIm1pblZhbHVlIiwicGFyc2VGbG9hdCIsIiQiLCJ2YWwiLCJtYXhWYWx1ZSIsIk51bWJlciIsImlzTmFOIiwibm9kIiwiY2xhc3NlcyIsImVycm9yQ2xhc3MiLCJzdWNjZXNzQ2xhc3MiLCJlcnJvck1lc3NhZ2VDbGFzcyIsImNoZWNrRnVuY3Rpb25zIiwiaW5wdXRUYWdOYW1lcyIsImNyZWF0ZVBhc3N3b3JkVmFsaWRhdGlvbkVycm9yVGV4dE9iamVjdCIsImVtcHR5IiwiY29uZmlybSIsIm1pc21hdGNoIiwiaW52YWxpZCIsIm9uRW1wdHlQYXNzd29yZEVycm9yVGV4dCIsIm9uQ29uZmlybVBhc3N3b3JkRXJyb3JUZXh0Iiwib25NaXNtYXRjaFBhc3N3b3JkRXJyb3JUZXh0Iiwib25Ob3RWYWxpZFBhc3N3b3JkRXJyb3JUZXh0IiwiY2xhc3NpZnlJbnB1dCIsImlucHV0IiwiZm9ybUZpZWxkQ2xhc3MiLCIkaW5wdXQiLCIkZm9ybUZpZWxkIiwicGFyZW50IiwidGFnTmFtZSIsInByb3AiLCJ0b0xvd2VyQ2FzZSIsImNsYXNzTmFtZSIsInNwZWNpZmljQ2xhc3NOYW1lIiwiaW5wdXRUeXBlIiwiaW5jbHVkZXMiLCJfY2FtZWxDYXNlIiwiX2NhcGl0YWxpemUiLCJhZGRDbGFzcyIsImNsYXNzaWZ5Rm9ybSIsImZvcm1TZWxlY3RvciIsIm9wdGlvbnMiLCIkZm9ybSIsIiRpbnB1dHMiLCJmaW5kIiwiam9pbiIsIl9vcHRpb25zIiwiX29wdGlvbnMkZm9ybUZpZWxkQ2xhIiwiZWFjaCIsIl9fIiwiZ2V0RmllbGRJZCIsIiRmaWVsZCIsImZpZWxkSWQiLCJtYXRjaCIsImluc2VydFN0YXRlSGlkZGVuRmllbGQiLCIkc3RhdGVGaWVsZCIsInN0YXRlRmllbGRBdHRycyIsInR5cGUiLCJuYW1lIiwiYWZ0ZXIiLCJhbm5vdW5jZUlucHV0RXJyb3JNZXNzYWdlIiwiX3JlZiIsImVsZW1lbnQiLCJyZXN1bHQiLCJhY3RpdmVJbnB1dENvbnRhaW5lciIsImVycm9yTWVzc2FnZSIsIiRlcnJNZXNzYWdlIiwiYXR0ciIsIlZhbGlkYXRvcnMiLCJzZXRFbWFpbFZhbGlkYXRpb24iLCJ2YWxpZGF0b3IiLCJmaWVsZCIsImVycm9yVGV4dCIsImFkZCIsInNlbGVjdG9yIiwic2V0UGFzc3dvcmRWYWxpZGF0aW9uIiwicGFzc3dvcmRTZWxlY3RvciIsInBhc3N3b3JkMlNlbGVjdG9yIiwicmVxdWlyZW1lbnRzIiwiX3JlZjIiLCJpc09wdGlvbmFsIiwiJHBhc3N3b3JkIiwicGFzc3dvcmRWYWxpZGF0aW9ucyIsIlJlZ0V4cCIsImFscGhhIiwibnVtZXJpYyIsIm1pbmxlbmd0aCIsInNldE1pbk1heFByaWNlVmFsaWRhdGlvbiIsInNlbGVjdG9ycyIsInByaWNlVmFsaWRhdGlvbkVycm9yVGV4dHMiLCJlcnJvclNlbGVjdG9yIiwiZmllbGRzZXRTZWxlY3RvciIsIm1heFByaWNlU2VsZWN0b3IiLCJtaW5QcmljZVNlbGVjdG9yIiwiX3ByaWNlVmFsaWRhdGlvbkVycm9yIiwib25NaW5QcmljZUVycm9yIiwib25NYXhQcmljZUVycm9yIiwibWluUHJpY2VOb3RFbnRlcmVkIiwibWF4UHJpY2VOb3RFbnRlcmVkIiwib25JbnZhbGlkUHJpY2UiLCJjb25maWd1cmUiLCJmb3JtIiwicHJldmVudFN1Ym1pdCIsInNldE1lc3NhZ2VPcHRpb25zIiwiZXJyb3JTcGFuIiwic2V0U3RhdGVDb3VudHJ5VmFsaWRhdGlvbiIsImNsZWFuVXBTdGF0ZVZhbGlkYXRpb24iLCIkZmllbGRDbGFzc0VsZW1lbnQiLCJkYXRhIiwiT2JqZWN0Iiwia2V5cyIsImZvckVhY2giLCJoYXNDbGFzcyIsInJlbW92ZUNsYXNzIiwiUGFnZU1hbmFnZXIiLCJjb250ZXh0IiwiX3Byb3RvIiwicHJvdG90eXBlIiwiY29uc3RydWN0b3IiLCJvblJlYWR5IiwibG9hZCIsInBhZ2UiLCJkb2N1bWVudCIsInJlYWR5IiwiYmluZCIsImRlZmF1bHQiXSwic291cmNlUm9vdCI6IiJ9
