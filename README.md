# fxss-rate评分插件 #

![](https://img.shields.io/badge/language-javascript-green.svg)
![](https://img.shields.io/badge/Dependencies-jQuery-brightgreen.svg)
![](https://img.shields.io/badge/license-MIT-blue.svg)
[![](https://codebeat.co/assets/svg/badges/A-398b39-669406e9e1b136187b91af587d4092b0160370f271f66a651f444b990c2730e9.svg)](https://codebeat.co/projects/github-com-fxss5201-fxss-rate-master)

## 介绍 ##

fxss-rate评分插件是基于jQuery的插件，支持全星、半星、小数星、未选中星等多种显示样式，并且支持评分操作，不过操作评分的时候仅支持全星评价。
demo地址：[http://www.fxss5201.cn/project/plugin/fxss-rate/](http://www.fxss5201.cn/project/plugin/fxss-rate/)

## 版本 ##

`0.0.1`版本。

`beta`版：

1. [文档](https://github.com/fxss5201/fxss-rate/wiki/beta-%E7%89%88)

## 使用 ##

基于jQuery，需要引入jQuery文件：

```HTML
<script src="js/jquery-1.11.3.js"></script>
```

本版本使用和之前版本有点区别，需要将`fxss-rate`文件夹复制到您的项目目录中（由于`css`和`js`的压缩文件都在其中，所以使用时请根据使用情况删除源码或压缩码），只需要在页面中引入js文件：

```HTML
<script src="fxss-rate/rate.js"></script>
```

在使用的时候，需要一个容器，例如：

```HTML
<div id="rateBox"></div>
```

然后在 `JavaScript` 中进行初始化：

```JavaScript
$("#rateBox").rate();
```

上面这种是最简单的使用，所有的参数都会使用默认参数。也可以自由配置参数，比如将其设置为可操作的并且增加点击回调函数：

```JavaScript
$("#rateBox").rate({
    readonly: false,
    callback: function(object){
        console.log(object)
    }
});
```

## 参数 ##

|参数名|类型|默认值|何时添加|描述|
|----|----|----|----|----|
|type|Number|0|`0.0.1`|星级的渲染方式，0：`svg`，1：`Font class`，2：`Unicode`|
|length|Number|5|`beta`|初始长度，即渲染几颗星。|
|value|Number|3.5|`beta`|选中星星的个数，介于0和`length`之间，如果想要显示半颗星或者小数星，还需要设置相应的`half/decimal`，否则仅会显示整数部分|
|half|Boolean|`true`|`beta`|是否显示半星（仅做显示处理）|
|decimal|Boolean|`true`|`beta`|是否根据小数来显示小数星（仅做显示处理，优先级高于`half`）|
|readonly|Boolean|`true`|`beta`|是否只读，如果设置为只读，则设置`callback`回调函数也无用|
|hover|Boolean|`false`|`0.0.1`|鼠标移到星级上是否显示当前的`value`值，此版本使用简单的标签`title`表示|
|text|Boolean|`true`|`beta`|是否显示对应的文字描述|
|textList|Array|['极差', '差', '中等', '好', '非常好']|`beta`|文字描述，可以自己设置，建议与`length`保持整除关系|
|theme|String|'#FFB800'|`beta`|主题色|
|size|String|'20px'|`beta`|星星以及文字描述的大小|
|gutter|String|'3px'|`beta`|两颗星星之间的距离/2，原理是设置`margin: 0 gutter;`|
|selectClass|String|'rate_select'|`beta`|星星选中的样式class名称，可以在此class中设置自定义样式|
|incompleteClass|String|''|`beta`|星星未完全选中的样式名称，主要针对半星和小数星|
|customClass|String|''|`beta`|自定义class，会添加在`rate_wrapper`标签上面，可以利用css权重来重置css样式|
|callback|Function||`beta`|星星点击的回调函数，参数object包含当前的DOM元素、点击的星星的index|
