/*global jQuery*/
(function ($) {
    'use strict';
    $.validationRule = $.extend($.validationRule, {
        test01: function (e) {
            if ($(e.target).val() === 'test') {
                return '使用禁止';
            } else {
                return false;
            }
        },
        test02: function (e) {
            if ($(e.target).val() === 'test') {
                return '使用禁止2';
            } else {
                return false;
            }
        }
    });

}(jQuery));
