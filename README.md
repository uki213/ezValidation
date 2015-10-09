# $.ezValidation.js

日本語バリデーションツール $.ezValidation.js

## 概要

$.ezValidation.js は日本語環境でのjavascriptバリデーションをサポートするjQueryプラグインです。

* HTML5のほぼ上位互換（擬似関数は仕様不可）
* カスタムバリデーションを設定しオリジナルバリデーションルールを設定可能
* 一つのバリデーションルールで2種類以上のエラーメッセージを出力可能

## 必要とするもの

* [jQuery](https://jquery.com/)

## 使用法

    <script type="text/javascript" src="$.ezValidation.js"></script>
[ダウンロードして](http://uki213.github.io/ezValidation/)scriptタグで読み込ませて準備完了

## HTML5互換

    $(targetDom).ezValidation();
対象のDOM（主にform）に対して実行します。  
カスタムバリデーションなどを特に使用していない場合は、HTML5互換のバリデーションが使用できます。  
pattern要素とtitle要素でバリデーションを記述することが出来ます。

### 擬似Class
擬似クラスのvalidとinvalidはカスタムバリデーションには使用できません。  
別途、$.ezValidation.jsでは通常のclassにvalid、またはinvalidを設定します。  
$.ezValidation.jsのvalid、invalidはIE9以下でも動作します。

## カスタムバリデーション
別途、カスタムバリデーションを作成しオリジナルバリデーションルールを設定することが出来ます。  
基本的な作りは、入力項目(input, select, textarea)等のイベントオブジェクトを取得し、エラーの文言をreturnで返します。  
retrun false の場合はエラーが無いという処理になります。

*カスタムバリデーションの記述ルールは、exValidationと違いますのでそのまま使用することは出来ません。*

## LICENCE

自由。ただしこのプログラム単体そのもので利益をえるような行為はNG
[http://uki213.github.io/ezValidation/](http://uki213.github.io/ezValidation/)
[https://github.com/uki213/ezValidation](https://github.com/uki213/ezValidation)
