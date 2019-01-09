/** 
 * fxss-rate评分插件是基于jQuery的插件，支持全星、半星、小数星、未选中星等多种显示样式，并且支持评分操作，不过操作评分的时候仅支持全星评价。
 * time：2018-09-07
 * by 樊小书生: http://www.fxss5201.cn/
 * github: https://github.com/fxss5201/fxss-rate
 */
;
(function(){
    $.fn.rateDefaults = {
        version: '0.0.1', // 版本号
        type: 0, // 星级的渲染方式，0：svg  1：Font class  2：Unicode，为兼容以前版本，默认采用svg渲染
        length: 5, // 初始长度,即渲染几颗星星
        value: 3.5, // 选中星星的个数，介于0和length之间，如果想要显示半颗行或者小数星，还需要设置相应的half/decimal，否则仅会显示整数部分
        half: true, // 是否显示半星（仅做显示处理）
        decimal: true, // 是否根据小数来显示小数星（仅做显示处理，优先级高于half）
        readonly: true, // 是否只读
        hover: false, // 鼠标移到星级上是否显示当前的value值
        text: true, // 是否显示对应的文字描述
        textList: ['极差', '差', '中等', '好', '非常好'], // 文字描述
        theme: '#FFB800', // 主题色
        size: '20px', // 星星以及文字描述的大小
        gutter: '3px', // 两颗星星之间的距离/2
        selectClass: 'rate_select', // 星星选中的样式class名称，可以在此class中设置自定义样式
        incompleteClass: '', // 星星未完全选中的样式名称，主要针对半星和小数星
        customClass: '', // 自定义class
        validate: function(){
            var _this = this;
            if(_this.value * 1 > _this.length * 1){
                alert('value应小于等于length');
            }
            if(_this.textList.length > _this.length * 1){
                alert('textList.length应小于等于length');
            }
        },
        getPath: function(){ // 获取引入js的路径
            var jsPath = document.currentScript ? document.currentScript.src : function(){
                var js = document.scripts,
                    last = js.length - 1,
                    src;
                for(var i = last; i > 0; i--){
                    if(js[i].readyState === 'interactive'){
                        src = js[i].src;
                        break;
                    }
                }
                return src || js[last].src;
            }();
            return jsPath.substring(0, jsPath.lastIndexOf('/') + 1);
        }(),
        link: function(href, cssname){ // 动态获取css
            if(!this.getPath) return;
            var head = document.getElementsByTagName("head")[0], link = document.createElement('link');
            var id = cssname;
            
            link.rel = 'stylesheet';
            link.href = this.getPath + href;
            link.id = id;
            
            if(!document.getElementById(id)){
                head.appendChild(link);
            }
        },
        script: function(src, jsname){ // 动态获取js
            if(!this.getPath) return;
            var head = document.getElementsByTagName("head")[0], script = document.createElement('script');
            var id = jsname;
            
            script.src = this.getPath + src;
            script.id = id;
            
            if(!document.getElementById(id)){
                head.appendChild(script);
            }
        },
        addEventClick: function (renderBox, type) { // 添加点击事件
            var _this = this;
            $(renderBox).find(".rate_box").on("click", '.rate_item', function(){
                var $this = $(this);
                if(_this.value == $this.index() + 1){
                    return false;
                }
                _this.value = $this.index() + 1;
                _this.render(renderBox, type);
                var object = {
                    dom: $(renderBox)[0],
                    index: $this.index()
                }
                _this.callback(object);
            });
        },
        countValue: function(){ // 将指定的value值的整数部分和小数部分区分开
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
        countText: function(){ // 根据value获取当前对应的textList中的值
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
        getIconName: function(index, type){
            var rateItemIconUnicode = ['&#xe610;', '&#xe604;', '&#xe608;', '&#xe605;', '&#xe606;', '&#xe607;', '&#xe60b;', '&#xe60a;', '&#xe60c;', '&#xe60d;', '&#xe609;'];
            return type * 1 === 2 ? rateItemIconUnicode[index] : ('icon-stars-' + index);
        },
        render: function(renderBox, type){ // 渲染函数
            var _this = this,
                rateBoxHtml = '',
                rateHtml = '',
                rateHtmlTpl = '<div class="rate_wrapper ' + _this.customClass + (_this.hover ? "\" title=\"" + _this.value + "\"" : '"') + '><div class="rate_box clearfix">{{rateHtmlTpl}}</div>{{textTpl}}</div>',
                rateItemIcon = '';
            var rateItemStyle = (_this.theme ? 'color:' + _this.theme : '') + ';' + (_this.gutter ? 'margin: 0 ' + _this.gutter : '') + ';';
            var rateItemIconStyle = (_this.size ? 'font-size:' + _this.size : '') + ';';

            if(type * 1 === 0){
                rateItemIcon = '<svg class="icon" style="' + rateItemIconStyle + '" aria-hidden="true"><use xlink:href="#{{iconname}}"></use></svg>';
            }else if(type * 1 === 1){
                rateItemIcon = '<i class="iconfont {{iconname}}" style="' + rateItemIconStyle + '"></i>';
            }else if(type * 1 === 2){
                rateItemIcon = '<i class="iconfont icon-rate-item" style="' + rateItemIconStyle + '">{{iconname}}</i>';
            }

            var rateItemTpl = '<div class="rate_item {{selectClass}}" style="' + rateItemStyle + '">' + rateItemIcon + '</div>';
            var valueObj = _this.countValue();
            for(var i = 0; i < _this.length; i++){
                if(_this.decimal || _this.half){ // 开启小数星渲染或半星渲染
                    if(i < valueObj.int){
                        rateHtml = rateHtml + rateItemTpl.replace('{{selectClass}}', _this.selectClass).replace('{{iconname}}', _this.getIconName(10, type));
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
                        rateHtml = rateHtml + rateItemTpl.replace('{{selectClass}}', _this.incompleteClass).replace('{{iconname}}', _this.getIconName(index, type));
                    }else{
                        rateHtml = rateHtml + rateItemTpl.replace('{{selectClass}}', '').replace('{{iconname}}', _this.getIconName(0, type));
                    }
                }else{
                    if(i < valueObj.int){
                        rateHtml = rateHtml + rateItemTpl.replace('{{selectClass}}', _this.selectClass).replace('{{iconname}}', _this.getIconName(10, type));
                    }else{
                        rateHtml = rateHtml + rateItemTpl.replace('{{selectClass}}', '').replace('{{iconname}}', _this.getIconName(0, type));
                    }
                }
            }
            rateBoxHtml = rateHtmlTpl.replace('{{rateHtmlTpl}}', rateHtml);

            var textStyle = (_this.theme ? 'color:' + _this.theme : '') + ';' + (_this.size ? 'font-size:' + _this.size : '') + ';';
            rateBoxHtml = _this.text 
                ? (_this.value > 0 
                    ? rateBoxHtml.replace('{{textTpl}}', '<div class="rate_text" style="' + textStyle + '">' + _this.countText() + '</div>')
                    : rateBoxHtml.replace('{{textTpl}}', '')) 
                : rateBoxHtml.replace('{{textTpl}}', '');

            $(renderBox).html(rateBoxHtml);

            if(!_this.readonly){
                _this.addEventClick(renderBox, type);
            }
        },
        callback: function(object){} // 回调函数
    };
    
    $.fn.rate = function(option){
        var options = $.extend({}, $.fn.rateDefaults, option);
        options.link('rate.css', 'rateLink');
        if(options.type * 1 === 0){
            options.script('need/iconfont.js', 'rateIconfontSvg');
        }else{
            options.link('need/iconfont.css', 'rateIconfontCss');
        }
        this.each(function(index, element) {
            options.validate();
            options.render(element, options.type);
        });
        return this;
    };
})(jQuery);