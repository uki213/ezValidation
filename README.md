# $.ezValidation.js

日本語バリデーションツール $.ezValidation.js

## 概要

$.ezValidation.js （イージーバリデーション）は日本語環境でのjavascriptバリデーションをサポートするjQueryプラグインです。
HTML5の表記で、イージー（簡単）に導入できるプラグインを目指します。

* HTML5のほぼ上位互換（擬似関数は仕様不可）
* カスタムバリデーションを設定しオリジナルバリデーションルールを設定可能
* 一つのバリデーションルールで2種類以上のエラーメッセージを出力可能

## 必要とするもの

* [jQuery](https://jquery.com/)

## 使用法

    <link rel="stylesheet" href="$.ezValidation.css">
    <script type="text/javascript" src="$.ezValidation.js"></script>
    <script type="text/javascript" src="$.customValidtion.js"></script>
[ダウンロードして](http://uki213.github.io/ezValidation/)scriptとcssを読み込ませて準備完了

## HTML5互換

    $(targetDom).ezValidation();
対象のDOM（主にform）に対して実行します。  
カスタムバリデーションなどを特に使用していない場合は、HTML5互換のバリデーションが使用できます。  
pattern要素とtitle要素でバリデーションを記述することが出来ます。

カスタムバリデーションが設定されていても、title要素のエラー文言のほうが優先されます。

### 擬似Class
擬似クラスのvalidとinvalidはカスタムバリデーションには使用できません。  
別途、$.ezValidation.jsでは通常のclassにvalid、またはinvalidを設定します。  
$.ezValidation.jsのvalid、invalidはIE9以下でも動作します。

擬似関数を利用した使用した場合は以下の様な記述になります。
    input:valid { boder:green 1px solid };
    input:invalid { boder:red 1px solid };
この場合はバリデーションを行い、問題なければ緑、エラー時は赤線をinputに反映します。

$.ezValidation.jsでは以下の様な記述になります。
    input.valid { boder:green 1px solid };
    input.invalid { boder:red 1px solid };
置き換えは、擬似クラス「:」を通常のクラスにするだけになります「.」

## $.customValidtion.js （カスタムバリデーション）
別途、カスタムバリデーションを作成しオリジナルバリデーションルールを設定することが出来ます。  
基本的な作りは、入力項目(input, select, textarea)等のイベントオブジェクトを取得し、エラーの文言をreturnで返します。  
retrun false の場合はエラーが無いという処理になります。

※カスタムバリデーションの記述ルールは、exValidationとは違うので、そのまま使用することは出来ません。

## プラグインオプション
プラグインのオプションは以下になります。

    'event':'keydown keyup change input'
バリデーションを行うイベントを指定します。

    'errClass': 'invalid'
エラー時に入力項目に付けるクラス名です。

    'okClass': 'valid'
チェック通過時に入力項目に付けるクラス名です。

    'baseDom': 'body'
エラーバルーンの土台を設置するDOM要素名になります。

    'positionX': 'left'
入力項目に対してのエラーバルーンの**横軸**の位置を指定します。  
入力する値は「left」または「right」です。

    'positionY': 'top'
入力項目に対してのエラーバルーンの**縦軸**の位置を指定します。  
入力する値は「top」または「bottom」です。

    'closeButton': true
エラーバルーンに閉じるボタンを取り付けます。  
デフォルトでは「true」になります。「false」の場合はチェックが通過するまで消えません。

    'fadeSpeed': 100
エラーバルーンの表示・非表示のフェードアニメーションの時間になります。  
時間の単位はマイクロ秒単位になります。

    'submit': function () {
        $(inputDom).trigger('validation');
        if ($(inputDom).hasClass(settings.errClass) === true) {
            return false;
        }
    }
送信ボタンを押した際の匿名関数になります。  
デフォルトでは上記の設定がされています。  
送信ボタンを押した際の挙動を変更したい場合は、独自の匿名関数を設定します。  
retrun falseを行うと、フォームの送信を行いません。

## LICENCE

自由。ただしこのプログラム単体そのもので利益をえるような行為はNG
[http://uki213.github.io/ezValidation/](http://uki213.github.io/ezValidation/)
[https://github.com/uki213/ezValidation](https://github.com/uki213/ezValidation)
