/*global jQuery, window, console */
/*jslint regexp: true*/
(function ($) {
    'use strict';
    $.fn.ezValidation = function (options) {

        // 初期設定
        var inputDom = 'input, select, textarea',
            customVali = 'custom-validation',
            closeBtnDom = '<span class="close"></span>',

            // プラグインオプション
            settings = $.extend({
                'event': 'keydown keyup change input', // バリデーションを行うイベントを指定
                'errClass': 'invalid', // エラー時に入力項目に付けるClass名
                'okClass': 'valid', // 非エラー時に入力項目に付けるClass名
                'baseDom': 'body', // エラーバルーンの土台を設置するDOM名
                'positionX': 'left', // エラーバルーン x座標（left or right）
                'positionY': 'top', // エラーバルーン y座標（top or bottom）
                'closeButton': true, // バルーンのクローズボタンの有無
                'fadeSpeed': 100, // エラーバルーン フェードアニメーションの速度（ms）
                'submit': function (e) {
                    $(e.target).find(inputDom).trigger('validation');
                    if ($(inputDom).hasClass(settings.errClass) === true) {
                        return false;
                    }
                },
                'defaultValidation': true
            }, options);

        return this.each(function () {

            // バリデーション→エラーポップアップ表示
            function errorMsg(msg, e) {
                var index = $(e.target).index(inputDom), i, errMsgHtml = '';
                if (msg.length !== 0) {
                    for (i = 0; i < msg.length; i = i + 1) {
                        // HTMLタグを除去してエラーメッセージを作成
                        errMsgHtml = errMsgHtml + '<div>' + msg[i].replace(/<("[^"]*"|'[^']*'|[^'">])*>/g, '') + '</div>';
                    }
                    $('#errBalloon' + index).find('.errMsg').html(errMsgHtml);
                    $('#errBalloon' + index).trigger('open');
                } else {
                    $('#errBalloon' + index).trigger('close');
                }
            }

            // 標準バリデーション エラー出力関数
            function errorMSG(MSG, e) {
                if ($(e.target).attr('title') === undefined) {
                    return MSG;
                } else {
                    return $(e.target).attr('title');
                }
            }

            $(this).attr('novalidate', 'novalidate'); // HTML5標準のバリデーションをオフ

            // 送信機能
            $(this).on('submit', function (e) {
                if (settings.submit(e) === false) {
                    return false;
                }
            });

            // 各イベントを一つのイベントへ統一する
			$(this).on(settings.event, inputDom, function (e) {
                $(e.target).trigger('validation');
            });

            // カスタムバリデーション
            $(this).on('validation', inputDom, function (e) {
                e.stopPropagation();
                var i,
                    arrErrorMsg = [],
                    validationType;

                validationType = $(e.target).data(customVali);

                // custom-validationが存在しない時
                if (validationType !== undefined) {
                    validationType = validationType.replace(/ /g, ',').split(',');
                    validationType.push('defaultValidation');
                } else {
                    validationType = ['defaultValidation'];
                }

                // balloonの土台作成の関数
                function balloonPositionSet(e) {
                    var offset,
                        balloonWidth = $(e.target).outerWidth(),
                        balloonHeight = $(e.target).outerHeight(),
                        inputNum = $(e.target).index(inputDom);

                    // 土台座標作成
                    offset = $(e.target).offset();
                    // バルーンを右にする
                    if (settings.positionX === 'right') {
                        offset.left = offset.left + balloonWidth;
                    }
                    // バルーンを下にする
                    if (settings.positionY === 'bottom') {
                        offset.top = offset.top + balloonHeight;
                    }

                    // DOM生成
                    if (!$('#errBalloon' + inputNum)[0]) {

                        // バルーンのクローズボタンの有無
                        if (settings.closeButton === false) {
                            closeBtnDom = '';
                        }

                        // balloonのDOMを生成
                        $(settings.baseDom).append('<div id="errBalloon' + inputNum + '" class="errBalloon"><span class="balloon"><span class="errMsg"></span>' + closeBtnDom + '</span></div>');
                        $('#errBalloon' + inputNum)
                            .stop().fadeTo(0, 0, function () {
                            $(this).find('.balloon').hide();
                        })
                        // balloonの閉じるボタンにイベントを設定
                            .on('click', '.close', function () {
                            $(this).parents('.errBalloon').trigger('close');
                        })
                        // balloonのクローズ機能（イベントドリブン）
                            .on('close', function () {
                            $(this).stop().fadeTo(settings.fadeSpeed, 0, function () {
                                $(this).children('.balloon').hide();
                            });
                        })
                        // balloonのオープン機能（イベントドリブン）
                            .on('open', function () {
                            $(this).find('.balloon').show();
                            $(this).stop().fadeTo(settings.fadeSpeed, 1);
                        });
                    }

                    // balloonの位置を設定
                    $('#errBalloon' + inputNum)
                        .stop()
                        .offset(offset)
                        .addClass(settings.positionX)
                        .addClass(settings.positionY);

                }

                // balloonの土台作成の関数を呼ぶ
                balloonPositionSet(e);
                $(window).resize(function () {
                    balloonPositionSet(e); // リサイズ時に再実行
                });

                // エラー状態をinputにclassで反映
                $(e.target).removeClass(settings.errClass).removeClass(settings.okClass);

                for (i = 0; i < validationType.length; i = i + 1) {
                    if ($.validationRule[validationType[i]] !== undefined && $.validationRule[validationType[i]](e) !== false) {
                        $(e.target).addClass(settings.errClass);
                        // エラーメッセージ呼び出し
                        arrErrorMsg.push($.validationRule[validationType[i]](e));
                    }
                }
                errorMsg(arrErrorMsg, e);

                // エラーの無い物には 非エラーのClassを追加
                if ($(e.target).hasClass(settings.errClass) === false) {
                    $(e.target).addClass(settings.okClass);
                }

            });

            // HTML5 標準バリデーション
            $.validationRule = $.extend($.validationRule, {
                defaultValidation: function (e) {
                    var validityValid,
                        pattern;

                    if ($(e.target).attr('required') === 'required' && $(e.target).val() === '') {
                        return '入力してください';
                    }
                    // pattern
                    if ($(e.target).attr('pattern') !== undefined) {
                        pattern = new RegExp($(e.target).attr('pattern'), 'g');
                        if (!$(e.target).val().match(pattern) && $(e.target).val() !== '') {
                            return errorMSG('指定されている形式で入力してください', e);
                        }
                    }
                    if (settings.defaultValidation === true) {
                        // type=email
                        if (e.target.type === 'email') {
                            if ($(e.target).val().match(/.+@.+\..+$/) === null && $(e.target).val() !== '') {
                                return errorMSG('メールアドレスを入力してください', e);
                            }
                        }
                        // type=url
                        if (e.target.type === 'url') {
                            if ($(e.target).val().match(/^[a-z]+:.+/) === null && $(e.target).val() !== '') {
                                return errorMSG('URLを入力してください', e);
                            }
                        }
                        // ブラウザ標準のバリデーション結果を取得
                        if (typeof (e.target.validity) !== 'undefined') {
                            validityValid = e.target.validity.valid;
                        } else {
                            validityValid = true;
                        }
                        if (validityValid === false) {
                            return errorMSG('指定されている形式で入力してください', e);
                        }
                    }
                    return false;
                }
            });
        });

    };
}(jQuery));
