/* 
* @Author: Marte
* @Date:   2018-11-05 16:52:00
* @Last Modified by:   Marte
* @Last Modified time: 2018-11-05 16:58:37
*/

var Plugins;
(function (Plugins) {
    var AutosizeInputOptions = (function () {
        function AutosizeInputOptions(space) {
            if (typeof space === "undefined") { space = 30; }
            this.space = space;
        }
        return AutosizeInputOptions;
    })();
    Plugins.AutosizeInputOptions = AutosizeInputOptions;

    var AutosizeInput = (function () {
        function AutosizeInput(input, options) {
            var _this = this;
            this._input = $(input);
            this._options = $.extend({}, AutosizeInput.getDefaultOptions(), options);

            //初始化镜像
            this._mirror = $('<span style="position:absolute; top:-999px; left:0; white-space:pre;"/>');

            //复制到镜像
            $.each(['fontFamily', 'fontSize', 'fontWeight', 'fontStyle', 'letterSpacing', 'textTransform', 'wordSpacing', 'textIndent'], function (i, val) {
                _this._mirror[0].style[val] = _this._input.css(val);
            });
            $("body").append(this._mirror);

            //绑定事件 - 更改更新粘贴单击mousedown mouseup焦点模糊
            // IE 9需要keydown在删除时保持更新（保留退格键 - 否则它将在释放退格时首先更新）
            // IE 9需要keyup incase文本被选中并且退格/删除被命中 -  keydown是早期的
            //如何修复框中删除“X”的问题 - 但不更新！？mouseup显然是早期的
            //可以分开绑定并设置计时器
            //添加以便在输入值更改时自动更新http://stackoverflow.com/a/1848414/58524
            this._input.on("keydown keyup input propertychange change", function (e) {
                _this.update();
            });

            //更新
            (function () {
                _this.update();
            })();
        }
        AutosizeInput.prototype.getOptions = function () {
            return this._options;
        };

        AutosizeInput.prototype.update = function () {
            var value = this._input.val() || "";

            if (value === this._mirror.text()) {
                //什么都没有改变 - 跳过
                return;
            }

            //更新镜像
            this._mirror.text(value);

            //计算宽度
            var newWidth = this._mirror.width() + this._options.space;

            //更新宽度
            this._input.width(newWidth);
        };

        AutosizeInput.getDefaultOptions = function () {
            return this._defaultOptions;
        };

        AutosizeInput.getInstanceKey = function () {
            //使用camelcase因为.data（）['autosize-input-instance']不起作用
            return "autosizeInputInstance";
        };
        AutosizeInput._defaultOptions = new AutosizeInputOptions();
        return AutosizeInput;
    })();
    Plugins.AutosizeInput = AutosizeInput;

    // jQuery插件
    (function ($) {
        var pluginDataAttributeName = "autosize-input";
        var validTypes = ["text", "password", "search", "url", "tel", "email", "number"];

        // jQuery插件
        $.fn.autosizeInput = function (options) {
            return this.each(function () {
                //确保它仅应用于有效类型的输入元素
                //或者让程序员只负责选择并应用有效元素？
                if (!(this.tagName == "INPUT" && $.inArray(this.type, validTypes) > -1)) {
                    //跳过 - 如果没有输入和有效类型
                    return;
                }

                var $this = $(this);

                if (!$this.data(Plugins.AutosizeInput.getInstanceKey())) {
                    //如果实例尚未创建和附加
                    if (options == undefined) {
                        //尝试从属性中获取选项
                        options = $this.data(pluginDataAttributeName);
                    }

                    //创建并附加实例
                    $this.data(Plugins.AutosizeInput.getInstanceKey(), new Plugins.AutosizeInput(this, options));
                }
            });
        };

        //在文件就绪上
        $(function () {
            //使用data-provide = autosize-input属性为所有人实例化
            $("input[data-" + pluginDataAttributeName + "]").autosizeInput();
        });
        //替代使用On Document Ready并立即创建实例
        //$(document).on('focus.autosize-input', 'input[data-autosize-input]', function (e)
        //{
        //  $(this).autosizeInput();
        //});
    })(jQuery);
})(Plugins || (Plugins = {}));