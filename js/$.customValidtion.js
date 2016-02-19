/*global jQuery*/
(function ($) {
	'use strict';
	$.validationRule = $.extend($.validationRule, {
		/*
		test02: function (e) {
			if ($(e.target).val() === 'test') {
				return '使用禁止2';
			} else {
				return false;
			}
		}
		*/
		// 全角文字禁止
		chkhankaku: function (e) {
			if ($(e.target).val().match(/^(?:[a-zA-Z0-9@<>\;\:\[\]\{\}\|\^\=\/\!\*\`\"\#\$\+\%\&\'\(\)\,\.\-\_\?\\\s]*)*$/) === null) {
				return '全角文字は使用できません';
			} else {
				return false;
			}
		},
		// 半角文字禁止
		chkzenkaku: function (e) {
			if ($(e.target).val().match(/^(?:[a-zA-Z0-9@<>\;\:\[\]\{\}\|\^\=\/\!\*\"\#\$\+\%\&\'\(\)\,\.\-\_\?\\\s]+)*$/) !== null && $(e.target).val() !== '') {
				return '全角文字で入力してください';
			} else {
				return false;
			}
		},
		// ひらがなのみ
		chkhiragana: function (e) {
			if ($(e.target).val().match(/^(?:[ぁ-ゞ]+)*$/) === null) {
				return 'ひらがなで入力してください';
			} else {
				return false;
			}
		},
		// カタカナのみ
		chkkatakana: function (e) {
			if ($(e.target).val().match(/^(?:[ァ-ヾ]+)*$/) === null) {
				return 'カタカナで入力してください';
			} else {
				return false;
			}
		},
		// ふりがな
		chkfurigana: function (e) {
			if ($(e.target).val().match(/^(?:[ぁ-ゞ０-９ー～（）\(\)\d 　]+)*$/) === null) {
				return 'ふりがなはひらがな、全角数字と〜、ー、（）が利用できます';
			} else {
				return false;
			}
		},
		// ふりがな
		chknochar: function (e) {
			if ($(e.target).val().match(/^(?:[a-zA-Z0-9]+)*$/) === null) {
				return '英数字で入力してください';
			} else {
				return false;
			}
		},
		// 英数字（小文字）
		chknocaps: function (e) {
			if ($(e.target).val().match(/^(?:[a-z0-9]+)*$/) === null) {
				return '英数字(小文字のみ)で入力してください';
			} else {
				return false;
			}
		}
	});

}(jQuery));
