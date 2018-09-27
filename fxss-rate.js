/** 
 * fxss-rate评分插件是基于jQuery的插件，支持全星、半星、小数星、未选中星等多种显示样式，并且支持评分操作，不过操作评分的时候仅支持全星评价。
 * time：2018-09-07
 * by 樊小书生: http://www.fxss5201.cn/
 * github: https://github.com/fxss5201/fxss-rate
 */
;
(function(){
    $.fn.rateDefaults = {
        length: 5, // 初始长度,即渲染几颗星星
        value: 3.5, // 选中星星的个数，介于0和length之间，如果想要显示半颗行或者小数星，还需要设置相应的half/decimal，否则仅会显示整数部分
        half: true, // 是否显示半星（仅做显示处理）
        decimal: true, // 是否根据小数来显示小数星（仅做显示处理，优先级高于half）
        readonly: true, // 是否只读
        text: true, // 是否显示对应的文字描述
        textList: ['极差', '差', '中等', '好', '非常好'], // 文字描述
        theme: '#FFB800', // 主题色
        size: '20px', // 星星以及文字描述的大小
        gutter: '3px', // 两颗星星之间的距离/2
        selectClass: 'fxss_rate_select', // 星星选中的样式class名称，可以在此class中设置自定义样式
        incompleteClass: '', // 星星未完全选中的样式名称，主要针对半星和小数星
        customClass: '', // 自定义class
        validate: function(){
            var _this = this;
            if(_this.value > _this.length){
                alert('value应小于等于length');
            }
            if(_this.textList.length > _this.length){
                alert('textList.length应小于等于length');
            }
        },
        init: function(initBox){
            var _this = this,
                rateBoxHtml = '',
                rateHtml = '',
                rateHtmlTpl = '<div class="fxss_rate_wrapper ' + _this.customClass + '"><div class="fxss_rate_box clearfix">{{rateHtmlTpl}}</div>{{textTpl}}</div>';
            var rateItemStyle = (_this.theme ? 'color:' + _this.theme : '') + ';' + (_this.gutter ? 'margin: 0 ' + _this.gutter : '') + ';';
            var rateSvgItemStyle = (_this.size ? 'font-size:' + _this.size : '') + ';';
            var rateItemTpl = '<div class="fxss_rate_item {{selectClass}}" style="' + rateItemStyle + '"><svg class="icon" style="' + rateSvgItemStyle + '" aria-hidden="true"><use xlink:href="#{{svgHref}}"></use></svg></div>';
            var valueObj = _this.countValue();
            for(var i = 0; i < _this.length; i++){
                if(_this.decimal || _this.half){ // 开启小数星渲染或半星渲染
                    if(i < valueObj.int){
                        rateHtml = rateHtml + rateItemTpl.replace('{{selectClass}}', _this.selectClass).replace('{{svgHref}}', 'icon-stars-10');
                    }else if(i == valueObj.int){
                        var index = 0;
                        if(_this.decimal){
                            index = valueObj.float * 10;
                        }else if(_this.half){
                            if(valueObj.float < 0.33){
                                index = 0;
                            }else if(valueObj.float > 0.66){
                                index = 10;
                            }else{
                                index = 5;
                            }
                        }
                        rateHtml = rateHtml + rateItemTpl.replace('{{selectClass}}', _this.incompleteClass).replace('{{svgHref}}', 'icon-stars-' + index);
                    }else{
                        rateHtml = rateHtml + rateItemTpl.replace('{{selectClass}}', '').replace('{{svgHref}}', 'icon-stars-0');
                    }
                }else{
                    if(i < valueObj.int){
                        rateHtml = rateHtml + rateItemTpl.replace('{{selectClass}}', _this.selectClass).replace('{{svgHref}}', 'icon-stars-10');
                    }else{
                        rateHtml = rateHtml + rateItemTpl.replace('{{selectClass}}', '').replace('{{svgHref}}', 'icon-stars-0');
                    }
                }
            }
            rateBoxHtml = rateHtmlTpl.replace('{{rateHtmlTpl}}', rateHtml);

            var textStyle = (_this.theme ? 'color:' + _this.theme : '') + ';' + (_this.size ? 'font-size:' + _this.size : '') + ';';
            rateBoxHtml = _this.text 
                ? (_this.value > 0 
                    ? rateBoxHtml.replace('{{textTpl}}', '<div class="fxss_rate_text" style="' + textStyle + '">' + _this.countText() + '</div>')
                    : rateBoxHtml.replace('{{textTpl}}', '')) 
                : rateBoxHtml.replace('{{textTpl}}', '');

            $(initBox).html(rateBoxHtml);

            if(!_this.readonly){
                $(initBox).find(".fxss_rate_box").on("click", '.fxss_rate_item', function(){
                    var $this = $(this);
                    if(_this.value == $this.index() + 1){
                        return false;
                    }
                    _this.value = $this.index() + 1;
                    _this.init(initBox);
                    var object = {
                        id: $(initBox).attr("id"),
                        index: $this.index()
                    }
                    _this.callback(object);
                });
            }
        },
        countValue: function(){
            var _this = this;
            var returnValue;
            if(_this.value == parseInt(_this.value)){
                returnValue = {
                    int: _this.value,
                    float: ''
                }
            }else{
                returnValue = {
                    int: parseInt(_this.value),
                    float: (parseFloat(_this.value) * 1000 - parseInt(_this.value) * 1000) / 1000
                }
            }
            return returnValue;
        },
        countText: function(){
            var _this = this,
                curFloat = _this.value * _this.textList.length / _this.length,
                curRound = Math.round(curFloat),
                curIndex = 0;
            curIndex = curRound > 0 ? curRound - 1 : curRound; // 解决value为0时的问题
            if(_this.decimal || _this.half){
                _this.value > parseInt(_this.value) && (_this.value > (curRound ? curRound * _this.length / _this.textList.length : _this.length / _this.textList.length)) && curIndex++; // 解决value为小数的时候
            }
            return _this.textList[curIndex];
        },
        callback: function(object){} // 回调函数
    };

    $.fn.rate = function(options){
        var options = $.extend({}, $.fn.rateDefaults, options);
        this.each(function(index, element) {
            options.validate();
            options.init(element);
        });
        return this;
    };
})(jQuery);