/*global jQuery,console,validationRule */
(function ($) {
    'use strict';
    $.fn.ezValidation = function (options) {

        // 渡された任意のオプションで拡張されるデフォルトをいくつか作成する
        var settings = $.extend({
            'event': 'keydown keyup change input',
            'errClass': 'error',
            'okClass': 'ok',
            'baseDom': 'body'
        }, options);

        return this.each(function () {

            // 初期設定
            var inputDom = 'input, select, textarea',
                customVali = 'custom-validation';

            $(this).attr('novalidate', 'novalidate'); // HTML5標準のバリデーションをオフ

            // 送信機能
            $(this).on('submit', function () {
                $(inputDom).trigger('validation');
                return false;
            });

            // バリデーションイベント
            $(this).find(inputDom).on(settings.event, function (e) {
                $(e.target).trigger('validation');
            });

            // エラーポップアップ処理
            function errorMsg(msg, e) {
                var index = $(e.target).index();
                $('#errBalloon' + index + ' *').remove();
                $('#errBalloon' + index).html(msg);
            }

            function closeErrMsg(e) {
                var index = $(e.target).index();
                $('#errBalloon' + index).html();
            }

            // カスタムバリデーション
            $(this).on('validation', inputDom, function (e) {
                var i,
                    arrErrorMsg = [],
                    validationType,
                    validationName = [];

                // バリデーションルール(data-custom-validation)を配列化
                validationType = $(e.target).data(customVali);

                // custom-validationが存在しない時
                if (validationType === undefined) {
                    validationType = '';
                }

                // custom-validationが1つの場合は split の処理を迂回させる
                if (validationType.match(' ') !== null) {
                    validationType = validationType.split(' ');
                    for (i = 0; i < validationType.length; i = i + 1) {
                        validationName.push(validationType[i]);
                    }
                    validationName.push('default');
                } else {
                    if (validationType === '') {
                        validationName.push('default');
                    } else {
                        validationName.push(validationType, 'default');
                    }
                }

                // エラー状態をinputにclassで反映
                $(e.target).removeClass(settings.errClass).removeClass(settings.okClass);
                for (i = 0; i < validationName.length; i = i + 1) {
                    if (validationRule[validationName[i]] !== undefined && validationRule[validationName[i]](e) !== false) {
                        $(e.target).addClass(settings.errClass);

                        // エラーメッセージ呼び出し

                        arrErrorMsg.push(validationRule[validationName[i]](e));
                    }
                }
                errorMsg(arrErrorMsg, e);

                if ($(e.target).hasClass(settings.errClass) === false) {
                    $(e.target).addClass(settings.okClass);
                }

                // エラーバルーンの土台作成
                function balloonPositionSet(e) {
                    var offset,
                        inputNum = $(e.target).index();
                    offset = $(e.target).offset();

                    // DOM生成
                    if (!$('#errBalloon' + inputNum)[0]) {
                        $(settings.baseDom).append('<span id="errBalloon' + inputNum + '"></span>');
                    }
                    $('#errBalloon' + inputNum).offset(offset);

                }
                balloonPositionSet(e);

            });

            // function customValidtionJoin


        });

    };
}(jQuery));
