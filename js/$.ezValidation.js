/*global jQuery, window, setTimeout */
(function ($) {
  'use strict'
  $.fn.ezValidation = function (options) {
    // 初期設定
    var inputDom = 'input, select, textarea'
    var customVali = 'custom-validation'
    var closeBtnDom = '<span class="close"></span>'
    var sendInputDelay
    var $this = $(this)

    // プラグインオプション
    var settings = $.extend({
      'event': 'keydown keyup keypress change', // バリデーションを行うイベントを指定
      'errClass': 'invalid', // エラー時に入力項目に付けるClass名
      'okClass': 'valid', // 非エラー時に入力項目に付けるClass名
      'baseDom': 'body', // エラーバルーンの土台を設置するDOM名
      'positionX': 'left', // エラーバルーン x座標（left or right）
      'positionY': 'top', // エラーバルーン y座標（top or bottom）
      'closeButton': true, // バルーンのクローズボタンの有無
      'fadeSpeed': 100, // エラーバルーン フェードアニメーションの速度（ms）
      'submit': function (e) {
        $(e.target).find(inputDom).trigger('validation')
        if ($(inputDom).hasClass(settings.errClass) === true) {
          return false
        }
      },
      'defaultValidation': true
    }, options)

    // jQueryが3.0.0以上の時
    function isJqv3 () {
      var jQueryVer = Number($.fn.jquery.replace(/\./g, ''))

      if (jQueryVer >= 300) {
        return true
      } else {
        return false
      }
    };

    return this.each(function () {
      // バリデーション→エラーポップアップ表示
      function errorMsg (msg, e) {
        var index = $(e.target).attr('ezv-num')
        var i
        var errMsgHtml = ''

        if (msg.length !== 0) {
          for (i = 0; i < msg.length; i = i + 1) {
            // HTMLタグを除去してエラーメッセージを作成
            errMsgHtml = errMsgHtml + '<div>' + msg[i].replace(/<("[^"]*"|'[^']*'|[^'">])*>/g, '') + '</div>'
          }
          $this.find('#errBalloon' + index).find('.errMsg').html(errMsgHtml)
          $this.find('#errBalloon' + index).trigger('open')
        } else {
          $this.find('#errBalloon' + index).trigger('close')
        }
      }

      // 標準バリデーション エラー出力関数
      function errorMSG (MSG, e) {
        if ($(e.target).attr('title') === undefined) {
          return MSG
        } else {
          return $(e.target).attr('title')
        }
      }

      $(this)
        // HTML5標準のバリデーションをオフ
        .attr('novalidate', 'novalidate')
        // 送信機能
        .on('submit', function (e) {
          if (settings.submit(e) === false) {
            return false
          }
        })
        // 各イベントを一つのイベントへ統一する
        .on(settings.event, inputDom, function (e) {
          sendInputDelay = setTimeout(function () {
            clearTimeout(sendInputDelay)
            $(e.target)
              .removeClass(settings.okClass)
              .trigger('validation')
          }, 10)
        })
        // 入力項目に連番をつける
        .data('ezv-number', '0')

      $(window).on('resize', function () {
        $this.trigger('setPosBalloon')
      })

      // カスタムバリデーション
      $(this).off('validation').on('validation', inputDom, function (e) {
        var i
        var arrErrorMsg = []
        var validationType

        validationType = $(e.target).data(customVali)

        // custom-validationが存在しない時
        if (validationType !== undefined) {
          validationType = validationType.replace(/ /g, ',').split(',')
          validationType.push('defaultValidation')
        } else {
          validationType = ['defaultValidation']
        }

        // balloonの土台作成の関数
        function balloonPositionSet (e) {
          var offset
          var balloonWidth = $(e.target).outerWidth()
          var balloonHeight = $(e.target).outerHeight()
          var inputNum

          if ($(e.target).attr('ezv-num') === undefined) {
            $(e.target).attr('ezv-num', $this.data('ezv-number'))
            $this.data('ezv-number', Number($this.data('ezv-number')) + 1)
          }
          inputNum = $(e.target).attr('ezv-num')

          if ($(e.target).hasClass(settings.okClass) === false) {
            // 土台座標作成
            var scrollTop = $(window).scrollTop()
            offset = $(e.target).offset()
            // バルーンを右にする
            if (settings.positionX === 'right') {
              offset.left = offset.left + balloonWidth
            }
            // バルーンを下にする
            if (settings.positionY === 'bottom') {
              offset.top = offset.top + balloonHeight
            }

            // jQuery3以上の場合
            if (isJqv3()) {
              offset.top = offset.top - scrollTop
            }

            // DOM生成
            if (!$this.find('#errBalloon' + inputNum)[0]) {
              // バルーンのクローズボタンの有無
              if (settings.closeButton === false) {
                closeBtnDom = ''
              }

              // balloonのDOMを生成
              $(settings.baseDom).append('<div id="errBalloon' + inputNum + '" class="errBalloon"><span class="balloon"><span class="errMsg"></span>' + closeBtnDom + '</span></div>')
              $this.find('#errBalloon' + inputNum)
                .stop().fadeTo(0, 0, function () {
                  $(this).find('.balloon').hide()
                })
                // balloonの閉じるボタンにイベントを設定
                .on('click', '.close', function () {
                  $(this).parents('.errBalloon').trigger('close')
                })
                // balloonのクローズ機能（イベントドリブン）
                .on('close', function () {
                  $(this).stop().fadeTo(settings.fadeSpeed, 0, function () {
                    $(this).remove()
                  })
                })
                // balloonのオープン機能（イベントドリブン）
                .on('open', function () {
                  $(this).find('.balloon').show()
                  $(this).stop().fadeTo(settings.fadeSpeed, 1)
                })
            }
          }

          // 親要素がない吹き出しを削除
          $('.errBalloon').each(function () {
            var targetNumer = $(this).attr('id').replace(/errBalloon/g, '')
            if ($('[ezv-num=' + targetNumer + ']')[0] === undefined) {
              $(this).remove()
            }
          })

          // balloonの位置を設定
          $this.find('#errBalloon' + inputNum)
            .offset(offset)
            .addClass(settings.positionX)
            .addClass(settings.positionY)
        }

        // balloonの土台作成の関数を呼ぶ
        balloonPositionSet(e)
        $this.on('setPosBalloon', function () {
          balloonPositionSet(e)
        })

        // エラー状態をinputにclassで反映
        $(e.target).removeClass(settings.errClass).removeClass(settings.okClass)

        for (i = 0; i < validationType.length; i = i + 1) {
          if ($.validationRule[validationType[i]] !== undefined && $.validationRule[validationType[i]](e) !== false) {
            if ($(e.target).prop('disabled') === false) {
              $(e.target).addClass(settings.errClass)
              // エラーメッセージ呼び出し
              arrErrorMsg.push($.validationRule[validationType[i]](e))
            }
          }
        }
        errorMsg(arrErrorMsg, e)

        // エラーの無い物には 非エラーのClassを追加
        if ($(e.target).hasClass(settings.errClass) === false) {
          $(e.target).addClass(settings.okClass)
        }
      })

      // HTML5 標準バリデーション
      $.validationRule = $.extend($.validationRule, {
        defaultValidation: function (e) {
          var validityValid
          var pattern

          if ($(e.target).attr('required') === 'required' && $(e.target).val() === '') {
            return '入力してください'
          }
          // pattern
          if ($(e.target).attr('pattern') !== undefined) {
            pattern = new RegExp($(e.target).attr('pattern'), 'g')
            if (!$(e.target).val().match(pattern) && $(e.target).val() !== '') {
              return errorMSG('指定されている形式で入力してください', e)
            }
          }
          if (settings.defaultValidation === true) {
            // type=email
            if (e.target.type === 'email') {
              if ($(e.target).val().match(/.+@.+\..+$/) === null && $(e.target).val() !== '') {
                return errorMSG('メールアドレスを入力してください', e)
              }
            }
            // type=url
            if (e.target.type === 'url') {
              if ($(e.target).val().match(/^[a-z]+:.+/) === null && $(e.target).val() !== '') {
                return errorMSG('URLを入力してください', e)
              }
            }
            // ブラウザ標準のバリデーション結果を取得
            if (typeof (e.target.validity) !== 'undefined') {
              validityValid = e.target.validity.valid
            } else {
              validityValid = true
            }
            if (validityValid === false) {
              return errorMSG('指定されている形式で入力してください', e)
            }
          }
          return false
        }
      })
    })
  }
}(jQuery))
