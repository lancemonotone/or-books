"use strict";
(self["webpackChunkbigcommerce_cornerstone"] = self["webpackChunkbigcommerce_cornerstone"] || []).push([["assets_js_theme_contact-us_js"],{

/***/ "./assets/js/theme/contact-us.js"
/*!***************************************!*\
  !*** ./assets/js/theme/contact-us.js ***!
  \***************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ ContactUs)
/* harmony export */ });
/* harmony import */ var _page_manager__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./page-manager */ "./assets/js/theme/page-manager.js");
/* harmony import */ var _common_nod__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./common/nod */ "./assets/js/theme/common/nod.js");
/* harmony import */ var _common_models_forms__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./common/models/forms */ "./assets/js/theme/common/models/forms.js");
/* harmony import */ var _common_utils_form_utils__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./common/utils/form-utils */ "./assets/js/theme/common/utils/form-utils.js");
/* provided dependency */ var $ = __webpack_require__(/*! jquery */ "./node_modules/jquery/dist/jquery.min.js");
function _inheritsLoose(t, o) { t.prototype = Object.create(o.prototype), t.prototype.constructor = t, _setPrototypeOf(t, o); }
function _setPrototypeOf(t, e) { return _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) { return t.__proto__ = e, t; }, _setPrototypeOf(t, e); }
;



var ContactUs = /*#__PURE__*/function (_PageManager) {
  function ContactUs() {
    return _PageManager.apply(this, arguments) || this;
  }
  _inheritsLoose(ContactUs, _PageManager);
  var _proto = ContactUs.prototype;
  _proto.onReady = function onReady() {
    this.registerContactFormValidation();
  };
  _proto.registerContactFormValidation = function registerContactFormValidation() {
    var formSelector = 'form[data-contact-form]';
    var contactUsValidator = (0,_common_nod__WEBPACK_IMPORTED_MODULE_1__["default"])({
      submit: formSelector + " input[type=\"submit\"]",
      tap: _common_utils_form_utils__WEBPACK_IMPORTED_MODULE_3__.announceInputErrorMessage
    });
    var $contactForm = $(formSelector);
    contactUsValidator.add([{
      selector: formSelector + " input[name=\"contact_email\"]",
      validate: function validate(cb, val) {
        var result = _common_models_forms__WEBPACK_IMPORTED_MODULE_2__["default"].email(val);
        cb(result);
      },
      errorMessage: this.context.contactEmail
    }, {
      selector: formSelector + " textarea[name=\"contact_question\"]",
      validate: function validate(cb, val) {
        var result = _common_models_forms__WEBPACK_IMPORTED_MODULE_2__["default"].notEmpty(val);
        cb(result);
      },
      errorMessage: this.context.contactQuestion
    }]);
    $contactForm.on('submit', function (event) {
      contactUsValidator.performCheck();
      if (contactUsValidator.areAll('valid')) {
        return;
      }
      event.preventDefault();
    });
  };
  return ContactUs;
}(_page_manager__WEBPACK_IMPORTED_MODULE_0__["default"]);


/***/ }

}]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGhlbWUtYnVuZGxlLmNodW5rLmFzc2V0c19qc190aGVtZV9jb250YWN0LXVzX2pzLmpzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsQ0FBeUM7QUFDVjtBQUNXO0FBQzRCO0FBQUEsSUFFakRJLFNBQVMsMEJBQUFDLFlBQUE7RUFBQSxTQUFBRCxVQUFBO0lBQUEsT0FBQUMsWUFBQSxDQUFBQyxLQUFBLE9BQUFDLFNBQUE7RUFBQTtFQUFBQyxjQUFBLENBQUFKLFNBQUEsRUFBQUMsWUFBQTtFQUFBLElBQUFJLE1BQUEsR0FBQUwsU0FBQSxDQUFBTSxTQUFBO0VBQUFELE1BQUEsQ0FDMUJFLE9BQU8sR0FBUCxTQUFBQSxPQUFPQSxDQUFBLEVBQUc7SUFDTixJQUFJLENBQUNDLDZCQUE2QixDQUFDLENBQUM7RUFDeEMsQ0FBQztFQUFBSCxNQUFBLENBRURHLDZCQUE2QixHQUE3QixTQUFBQSw2QkFBNkJBLENBQUEsRUFBRztJQUM1QixJQUFNQyxZQUFZLEdBQUcseUJBQXlCO0lBQzlDLElBQU1DLGtCQUFrQixHQUFHYix1REFBRyxDQUFDO01BQzNCYyxNQUFNLEVBQUtGLFlBQVksNEJBQXVCO01BQzlDRyxHQUFHLEVBQUViLCtFQUF5QkE7SUFDbEMsQ0FBQyxDQUFDO0lBQ0YsSUFBTWMsWUFBWSxHQUFHQyxDQUFDLENBQUNMLFlBQVksQ0FBQztJQUVwQ0Msa0JBQWtCLENBQUNLLEdBQUcsQ0FBQyxDQUNuQjtNQUNJQyxRQUFRLEVBQUtQLFlBQVksbUNBQThCO01BQ3ZEUSxRQUFRLEVBQUUsU0FBVkEsUUFBUUEsQ0FBR0MsRUFBRSxFQUFFQyxHQUFHLEVBQUs7UUFDbkIsSUFBTUMsTUFBTSxHQUFHdEIsNERBQUssQ0FBQ3VCLEtBQUssQ0FBQ0YsR0FBRyxDQUFDO1FBRS9CRCxFQUFFLENBQUNFLE1BQU0sQ0FBQztNQUNkLENBQUM7TUFDREUsWUFBWSxFQUFFLElBQUksQ0FBQ0MsT0FBTyxDQUFDQztJQUMvQixDQUFDLEVBQ0Q7TUFDSVIsUUFBUSxFQUFLUCxZQUFZLHlDQUFvQztNQUM3RFEsUUFBUSxFQUFFLFNBQVZBLFFBQVFBLENBQUdDLEVBQUUsRUFBRUMsR0FBRyxFQUFLO1FBQ25CLElBQU1DLE1BQU0sR0FBR3RCLDREQUFLLENBQUMyQixRQUFRLENBQUNOLEdBQUcsQ0FBQztRQUVsQ0QsRUFBRSxDQUFDRSxNQUFNLENBQUM7TUFDZCxDQUFDO01BQ0RFLFlBQVksRUFBRSxJQUFJLENBQUNDLE9BQU8sQ0FBQ0c7SUFDL0IsQ0FBQyxDQUNKLENBQUM7SUFFRmIsWUFBWSxDQUFDYyxFQUFFLENBQUMsUUFBUSxFQUFFLFVBQUFDLEtBQUssRUFBSTtNQUMvQmxCLGtCQUFrQixDQUFDbUIsWUFBWSxDQUFDLENBQUM7TUFFakMsSUFBSW5CLGtCQUFrQixDQUFDb0IsTUFBTSxDQUFDLE9BQU8sQ0FBQyxFQUFFO1FBQ3BDO01BQ0o7TUFFQUYsS0FBSyxDQUFDRyxjQUFjLENBQUMsQ0FBQztJQUMxQixDQUFDLENBQUM7RUFDTixDQUFDO0VBQUEsT0FBQS9CLFNBQUE7QUFBQSxFQTNDa0NKLHFEQUFXIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vYmlnY29tbWVyY2UtY29ybmVyc3RvbmUvLi9hc3NldHMvanMvdGhlbWUvY29udGFjdC11cy5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUGFnZU1hbmFnZXIgZnJvbSAnLi9wYWdlLW1hbmFnZXInO1xyXG5pbXBvcnQgbm9kIGZyb20gJy4vY29tbW9uL25vZCc7XHJcbmltcG9ydCBmb3JtcyBmcm9tICcuL2NvbW1vbi9tb2RlbHMvZm9ybXMnO1xyXG5pbXBvcnQgeyBhbm5vdW5jZUlucHV0RXJyb3JNZXNzYWdlIH0gZnJvbSAnLi9jb21tb24vdXRpbHMvZm9ybS11dGlscyc7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDb250YWN0VXMgZXh0ZW5kcyBQYWdlTWFuYWdlciB7XHJcbiAgICBvblJlYWR5KCkge1xyXG4gICAgICAgIHRoaXMucmVnaXN0ZXJDb250YWN0Rm9ybVZhbGlkYXRpb24oKTtcclxuICAgIH1cclxuXHJcbiAgICByZWdpc3RlckNvbnRhY3RGb3JtVmFsaWRhdGlvbigpIHtcclxuICAgICAgICBjb25zdCBmb3JtU2VsZWN0b3IgPSAnZm9ybVtkYXRhLWNvbnRhY3QtZm9ybV0nO1xyXG4gICAgICAgIGNvbnN0IGNvbnRhY3RVc1ZhbGlkYXRvciA9IG5vZCh7XHJcbiAgICAgICAgICAgIHN1Ym1pdDogYCR7Zm9ybVNlbGVjdG9yfSBpbnB1dFt0eXBlPVwic3VibWl0XCJdYCxcclxuICAgICAgICAgICAgdGFwOiBhbm5vdW5jZUlucHV0RXJyb3JNZXNzYWdlLFxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGNvbnN0ICRjb250YWN0Rm9ybSA9ICQoZm9ybVNlbGVjdG9yKTtcclxuXHJcbiAgICAgICAgY29udGFjdFVzVmFsaWRhdG9yLmFkZChbXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHNlbGVjdG9yOiBgJHtmb3JtU2VsZWN0b3J9IGlucHV0W25hbWU9XCJjb250YWN0X2VtYWlsXCJdYCxcclxuICAgICAgICAgICAgICAgIHZhbGlkYXRlOiAoY2IsIHZhbCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IGZvcm1zLmVtYWlsKHZhbCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGNiKHJlc3VsdCk7XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgZXJyb3JNZXNzYWdlOiB0aGlzLmNvbnRleHQuY29udGFjdEVtYWlsLFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBzZWxlY3RvcjogYCR7Zm9ybVNlbGVjdG9yfSB0ZXh0YXJlYVtuYW1lPVwiY29udGFjdF9xdWVzdGlvblwiXWAsXHJcbiAgICAgICAgICAgICAgICB2YWxpZGF0ZTogKGNiLCB2YWwpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCByZXN1bHQgPSBmb3Jtcy5ub3RFbXB0eSh2YWwpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBjYihyZXN1bHQpO1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGVycm9yTWVzc2FnZTogdGhpcy5jb250ZXh0LmNvbnRhY3RRdWVzdGlvbixcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICBdKTtcclxuXHJcbiAgICAgICAgJGNvbnRhY3RGb3JtLm9uKCdzdWJtaXQnLCBldmVudCA9PiB7XHJcbiAgICAgICAgICAgIGNvbnRhY3RVc1ZhbGlkYXRvci5wZXJmb3JtQ2hlY2soKTtcclxuXHJcbiAgICAgICAgICAgIGlmIChjb250YWN0VXNWYWxpZGF0b3IuYXJlQWxsKCd2YWxpZCcpKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbn1cclxuIl0sIm5hbWVzIjpbIlBhZ2VNYW5hZ2VyIiwibm9kIiwiZm9ybXMiLCJhbm5vdW5jZUlucHV0RXJyb3JNZXNzYWdlIiwiQ29udGFjdFVzIiwiX1BhZ2VNYW5hZ2VyIiwiYXBwbHkiLCJhcmd1bWVudHMiLCJfaW5oZXJpdHNMb29zZSIsIl9wcm90byIsInByb3RvdHlwZSIsIm9uUmVhZHkiLCJyZWdpc3RlckNvbnRhY3RGb3JtVmFsaWRhdGlvbiIsImZvcm1TZWxlY3RvciIsImNvbnRhY3RVc1ZhbGlkYXRvciIsInN1Ym1pdCIsInRhcCIsIiRjb250YWN0Rm9ybSIsIiQiLCJhZGQiLCJzZWxlY3RvciIsInZhbGlkYXRlIiwiY2IiLCJ2YWwiLCJyZXN1bHQiLCJlbWFpbCIsImVycm9yTWVzc2FnZSIsImNvbnRleHQiLCJjb250YWN0RW1haWwiLCJub3RFbXB0eSIsImNvbnRhY3RRdWVzdGlvbiIsIm9uIiwiZXZlbnQiLCJwZXJmb3JtQ2hlY2siLCJhcmVBbGwiLCJwcmV2ZW50RGVmYXVsdCIsImRlZmF1bHQiXSwic291cmNlUm9vdCI6IiJ9