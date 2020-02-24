/* 
* @Author: Marte
* @Date:   2018-12-27 17:44:21
* @Last Modified by:   Marte
* @Last Modified time: 2019-01-08 17:48:40
*/

// 按键对象构造函数
/**
 * [Btn description]
 * @param {[obj]} opt.btn [方向和确认按键（可选，不设置使用默认方向键的keycode）]
 * @param {[num]} opt.btnLeft [左方向键]
 * @param {[num]} opt.btnUp [上方向键]
 * @param {[num]} opt.btnRight [右方向键]
 * @param {[num]} opt.btnDown [下方向键]   
 * @param {[num]} opt.btnSure [确定键]   
 * @param {[obj][array]} opt.rule [方向按键规则数组对象(可选)]例子：{0：[0,1,2,3],2:[1,2,3,4]}
 * @param {[obj][function]} opt.sureRules [确定按键规则数组函数(可选)]例子：{0：function(){},2:function(){}}
 * @param {[num]} opt.startFocus [默认焦点的索引值（可选，默认0）]
 * @param {[string]} opt.area [焦点所在区域（可选，默认page）]
 * @param {[string]} opt.keyName [热键的类名，（可选，默认hotButton）]
 * @param {[string]} opt.focusName [焦点的类名，（可选，默认on）]
 * @param {[function]} opt.otherRules [其他案件规则（可选，默认空函数）]
 */
function Btn(opt){
    opt = opt ? opt : {};
    var _this = this;
    // 方向键Code
    this.btnLeft = opt.btnLeft ? opt.btnLeft : 37;
    this.btnUp = opt.btnUp ? opt.btnUp : 38;
    this.btnRight = opt.btnRight ? opt.btnRight : 39;
    this.btnDown = opt.btnDown ? opt.btnDown : 40;
    // 方向键规则
    this.moveRules = opt.moveRules ? opt.moveRules : {};
    // 确定键
    this.btnSure = opt.btnSure ? opt.btnSure : 13;
    // 确定键规则
    this.sureRules = opt.sureRules ? opt.sureRules : {};
    // 光标移动后执行的特殊规则
    this.focusRules = opt.focusRules ? opt.focusRules : function(){};
    // 开始焦点索引值
    this.startFocus = opt.startFocus ? opt.startFocus : 0;
    // 焦点所在区域
    this.area = opt.area ? opt.area : "page";
    // 热键类名
    this.keyName = opt.keyName ? opt.keyName : "hotButton";
    //聚焦类名
    this.focusName = opt.focusName ? opt.focusName : "on";
    this.otherRules = opt.otherRules ? opt.otherRules : function(){};

    // 所有热键节点组成的数组
    this.hotBtns = [];
    // 移动前节点
    this.prev;
    // 移动前节点索引值
    this.prevIndex;
    // 移动后节点
    this.current;
    // 移动后节点索引值
    this.currentIndex;

    // 获取所有热键，并设置初始焦点
    this.getKeys = function(){
        _this.hotBtns = document.getElementsByClassName(_this.keyName);
        for(var i=0;i<_this.hotBtns.length;i++){
            _this.hotBtns[i].setAttribute('data-id',i);
        }
        // 设置默认的移动前焦点索引值
        _this.prevIndex = _this.startFocus;
        // 设置默认的移动前焦点
        _this.prev = _this.hotBtns[_this.startFocus];
        _this.addClass(_this.prev,"on");
    }   

    // 焦点移动规则
    this.moveAction = function(key,prevIndex,area){
       // 优先执行特殊规则
       if(_this.moveRules[area] && _this.moveRules[area][prevIndex] ){
            if(key*1 == _this.btnLeft*1 && _this.hotBtns[_this.moveRules[area][prevIndex][0]]){
                return _this.moveRules[area][prevIndex][0];
            }
            else if(key*1 == _this.btnUp*1 && _this.hotBtns[_this.moveRules[area][prevIndex][1]]){
                return _this.moveRules[area][prevIndex][1];
            }
            else if(key*1 == _this.btnRight*1 && _this.hotBtns[_this.moveRules[area][prevIndex][2]]){
                return _this.moveRules[area][prevIndex][2];
            }
            else if(key*1 == _this.btnDown*1 && _this.hotBtns[_this.moveRules[area][prevIndex][3]]){
                return _this.moveRules[area][prevIndex][3];
            } 
            else{
                return prevIndex
            }
       }
       // 无特殊规则走一般默认规则
       else if(key*1 == _this.btnLeft*1 && prevIndex > 0){
            return prevIndex*1 - 1;
       }
       else if(key*1 == _this.btnRight*1 && prevIndex < _this.hotBtns.length*1 - 1){
            return prevIndex*1 + 1;
       }
       else if(key*1 == _this.btnUp*1 && _this.hotBtns[prevIndex].getAttribute("data-up")){
            return prevIndex*1 - _this.hotBtns[prevIndex].getAttribute("data-up")*1;
       }
       else if(key*1 == _this.btnDown*1 && _this.hotBtns[prevIndex].getAttribute("data-down")){
            return prevIndex*1 + _this.hotBtns[prevIndex].getAttribute("data-down")*1;
       }
       else{
            return prevIndex*1;
       }
    }
    // 确定键规则
    this.sureAction = function(prevIndex,area){
        if(_this.sureRules[area] && _this.sureRules[area][prevIndex] ){
            _this.sureRules[area][prevIndex]();
        }
    }

    // 切换焦点区域
    this.changeArea = function(area,keyName,startFocus){
        // 把切换前的焦点去除
        _this.removeClass(_this.hotBtns[_this.prevIndex],_this.focusName);
        // 切换焦点区域和焦点类名
        _this.area = area;
        _this.keyName = keyName;
        // 重新获取所有热键并赋予新索引
        _this.hotBtns = document.getElementsByClassName(_this.keyName);
        for(var i=0;i<_this.hotBtns.length;i++){
            _this.hotBtns[i].setAttribute('data-id',i);
        }
        // 设置默认的移动前焦点索引值
        _this.prevIndex = startFocus;
        _this.currentIndex = startFocus;
        // 设置默认的移动前焦点
        _this.prev = _this.hotBtns[startFocus];
        _this.current =  _this.hotBtns[startFocus];
        // 把切换后的焦点赋予上
        _this.addClass(_this.prev,"on");
    }

    //类名增加兼容
    this.addClass = function(obj, cls){
        if (!_this.hasClass(obj, cls)) obj.className += " " + cls
    }
    
    // 去除类名
    this.removeClass = function(obj, cls){
        if (_this.hasClass(obj, cls)) {
            var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
            obj.className = obj.className.replace(reg, ' ')
        }
    }
    
    // 查看类名
    this.hasClass = function(obj, cls){
        // console.log(obj,cls)
        return obj.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'))
    }

    // 按键处理函数
    this.keyDownFun = function(){
        // 绑定事件
        document.onkeydown = function(e){
            // 兼容
            var e = e || window.event;
            var key = e.keyCode || e.which;
            // 兼容EC6108V9盒子
            if(key<0 || key>255){
              key = e.charCode;
            }

            // 方向键处理
            if(
                key == _this.btnLeft||
                key == _this.btnUp ||
                key == _this.btnRight ||
                key == _this.btnDown
            ){
                // 获取移动前的焦点
                _this.prevIndex = document.getElementsByClassName(_this.focusName)[0].getAttribute('data-id');

                // 执行移动规则后的焦点索引值
                _this.currentIndex = _this.moveAction(key,_this.prevIndex,_this.area);
                // 焦点改变
                _this.removeClass(_this.hotBtns[_this.prevIndex],_this.focusName);
                _this.addClass(_this.hotBtns[_this.currentIndex],_this.focusName);

                // 按移动建后执行的特殊规则
                _this.focusRules && _this.focusRules(_this.hotBtns,_this.prevIndex,_this.currentIndex,_this.area,key);

            }
            // 确定键处理
            else if(key == _this.btnSure){
                // 按确定键前的焦点
                _this.prevIndex = document.getElementsByClassName(_this.focusName)[0].getAttribute('data-id');
                _this.sureAction(_this.prevIndex,_this.area);
            }
            // 其他键
            else{
                // 获取移动前的焦点
                _this.prevIndex = document.getElementsByClassName(_this.focusName)[0].getAttribute('data-id');
                _this.otherRules(key,_this.prevIndex,_this.area);
            }
        }
    }
    // 初始化
    this.init = function(){
        // 获取所有热键，并设置热键类名
        _this.getKeys();
        // 给默认热键添加焦点
        _this.addClass(_this.hotBtns[_this.startFocus],_this.focusName);
        _this.keyDownFun();
    }
    // 按键关闭
    this.BtnClose = function(){
        document.onkeydown = null;
    }
    // 按键重开
    this.BtnOpen = function(){
        _this.keyDownFun();
    }
}