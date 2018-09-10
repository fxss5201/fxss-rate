# fxss-rate评分插件 #

## 介绍 ##
fxss-rate评分插件是基于jQuery的插件，支持全星、半星、小数星、未选中星等多种显示样式，并且支持评分操作，不过操作评分的时候仅支持全星评价。
demo地址：[http://www.fxss5201.cn/project/plugin/fxss-rate/](http://www.fxss5201.cn/project/plugin/fxss-rate/)

## 资源 ##

首先需要引入样式文件：

```HTML
<link rel="stylesheet" href="fxss-rate.css">
```

基于jQuery，需要引入jQuery文件：

```HTML
<script src="js/jquery-1.11.3.js"></script>
```

渲染星星使用的是阿里矢量图库的svg字体，所以还需要引入字体文件：

```HTML
<script src="fxss-rate-iconfont.js"></script>
```

接下来引入我们的评分插件：

```HTML
<script src="fxss-rate.js"></script>
```

## 使用 ##

在使用的时候，需要一个容器，例如：

```HTML
<div id="rateBox"></div>
```

然后在 `JavaScript` 中进行初始化：

```JavaScript
$("#rateBox").rate();
```

上面这种事最简单的使用，所有的参数都会使用默认参数。也可以自有配置参数，比如将其设置为可操作的并且增加点击回调函数：

```JavaScript
$("#rateBox").rate({
    readonly: false,
    callback: function(object){
        console.log(object)
    }
});
```

## 参数 ##

|参数名|类型|默认值|描述|
|----|----|----|----|
|length|Number|5|初始长度，即渲染几颗星。|
|value|Number|3.5|选中星星的个数，介于0和length之间，如果想要显示半颗行或者小数星，还需要设置相应的half/decimal，否则仅会显示整数部分|
|half|Boolean|true|是否显示半星（仅做显示处理）|
|decimal|Boolean|true|是否根据小数来显示小数星（仅做显示处理，优先级高于half）|
|readonly|Boolean|true|是否只读，如果设置为只读，则设置callback回调函数也无用|
|text|Boolean|true|是否显示对应的文字描述|
|textList|Array|['极差', '差', '中等', '好', '非常好']|文字描述，可以自己设置，建议与length保持整除关系|
|theme|String|'#FFB800'|主题色|
|size|String|'20px'|星星以及文字描述的大小|
|gutter|String|'3px'|两颗星星之间的距离/2，原理是设置margin: 0 gutter;|
|selectClass|String|'fxss_rate_select'|星星选中的样式class名称，可以在此class中设置自定义样式|
|incompleteClass|String|''|星星未完全选中的样式名称，主要针对半星和小数星|
|customClass|String|''|自定义class，会添加在fxss_rate_wrapper标签上面，可以利用css权重来重置css样式|
|callback|Function||星星点击的回调函数，参数object包含当前的id、点击的星星的index|
