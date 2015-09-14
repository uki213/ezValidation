/*global jQuery, window, console, validationRule */
(function ($) {
    'use strict';
    $.fn.ezValidation = function (options) {

        // プラグインオプション
        var settings = $.extend({
            'event': 'keydown keyup change input', // バリデーションを行うイベントを指定
            'errClass': 'invalid', // エラー時に入力項目に付けるClass名
            'okClass': 'valid', // 非エラー時に入力項目に付けるClass名
            'baseDom': 'body', // エラーバルーンの土台を設置するDOM名
            'closeButton': true // バルーンのクローズボタンの有無
        }, options);

        return this.each(function () {

            // 初期設定
            var inputDom = 'input, select, textarea',
                customVali = 'custom-validation',
                closeBtnDom = '<span class="close">×</span></span>';

            $(this).attr('novalidate', 'novalidate'); // HTML5標準のバリデーションをオフ

            // バルーンのクローズボタンの有無
            if (settings.closeButton === false) {
                closeBtnDom = '';
            }

            // 送信機能
            $(this).on('submit', function () {
                $(inputDom).trigger('validation');

                // バリデーションエラーが有った場合は submit 処理を中断する。
                if ($(inputDom).hasClass(settings.errClass) === true) {
                    return false;
                }
            });

            // 各イベントを一つのイベントへ統一する
            $(this).find(inputDom).on(settings.event, function (e) {
                $(e.target).trigger('validation');
            });

            // エラーポップアップ処理
            function errorMsg(msg, e) {
                var index = $(e.target).index(), i, errMsgHtml = '';
                $('#errBalloon' + index + ' *').remove();
                if (msg.length !== 0) {
                    for (i = 0; i < msg.length; i = i + 1) {
                        errMsgHtml = errMsgHtml + '<div>' + msg[i] + '</div>';
                    }
                    $('#errBalloon' + index).html('<span class="balloon">' + errMsgHtml + closeBtnDom + '</span>');
                }
            }

            function closeErrMsg(e) {
                var index = $(e.target).index();
                $('#errBalloon' + index).html();
            }

            // カスタムバリデーション
            $(this).on('validation', inputDom, function (e) {
                var i,
                    arrErrorMsg = [],
                    validationType;

                validationType = $(e.target).data(customVali);

                // custom-validationが存在しない時
                if (validationType !== undefined) {
                    validationType = validationType.replace(/ /g, ',').split(',');
                    validationType.push('default');
                } else {
                    validationType = ['default'];
                }

                // エラーバルーンの土台作成
                function balloonPositionSet(e) {
                    var offset,
                        inputNum = $(e.target).index();
                    offset = $(e.target).offset();

                    // DOM生成
                    if (!$('#errBalloon' + inputNum)[0]) {
                        $(settings.baseDom).append('<div id="errBalloon' + inputNum + '" class="errBalloon"></div>');
                    }
                    $('#errBalloon' + inputNum).offset(offset);

                }
                balloonPositionSet(e);
                $(window).resize(function () {
                    balloonPositionSet(e);
                });

                // エラー状態をinputにclassで反映
                $(e.target).removeClass(settings.errClass).removeClass(settings.okClass);
                for (i = 0; i < validationType.length; i = i + 1) {
                    if (validationRule[validationType[i]] !== undefined && validationRule[validationType[i]](e) !== false) {
                        $(e.target).addClass(settings.errClass);
                        $(e.target).trigger('invalid');
                        // エラーメッセージ呼び出し
                        arrErrorMsg.push(validationRule[validationType[i]](e));
                    }
                }
                errorMsg(arrErrorMsg, e);

                // エラーの無い物には 非エラーのClassを追加
                if ($(e.target).hasClass(settings.errClass) === false) {
                    $(e.target).addClass(settings.okClass);
                }

                // balloonの☓ボタン
                $('body').on('click', '.close', function (e) {
                    $(e.target).parents('.balloon').remove();
                });

            });

            // function customValidtionJoin


        });

    };
}(jQuery));
