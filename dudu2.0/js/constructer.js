/* 
* @Author: Marte
* @Date:   2019-03-03 14:46:56
* @Last Modified by:   Marte
* @Last Modified time: 2019-03-06 15:22:16
*/



// 页面对象
function Page(opt){
    // 属性
    this.ele = '.container';
    this.nav1 = '.nav1';
    this.nav2 = '.nav2';
    this.side = '.side';
    this.staticFocus = ['nav1-0'];
    //静态聚焦类名
    this.staticFocusClass = opt.staticFocusClass ? opt.staticFocusClass : "staticOn";
    this.moveFocus = 'nav1-0';
    //动态聚焦类名
    this.moveFocusClass = opt.moveFocusClass ? opt.moveFocusClass : "moveOn";
}

// 初始化（复杂操作）
// * 创建/获取元素
// * 绑定事件
Page.prototype.init = function(){
    var _this = this;
    // 这里的this指向谁：page
    // 获取元素
    this.ele = document.querySelector(this.ele);
    this.nav1 = this.ele.querySelector(this.nav1);
    this.nav2 = this.ele.querySelector(this.nav2);

    // 获取所有热键，并设置热键类名
    _this.getKeys();
    // 给默认热键添加焦点
    _this.addClass(_this.hotBtns[_this.startFocus],_this.focusName);
    _this.BtnOpen();
};

Page.prototype.getKeys = function(){
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
Page.prototype.moveAction = function(key,prevIndex,area){
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
Page.prototype.sureAction = function(prevIndex,area){
    if(_this.sureRules[area] && _this.sureRules[area][prevIndex] ){
        _this.sureRules[area][prevIndex]();
    }
}

// 切换焦点区域
Page.prototype.changeArea = function(area,keyName,startFocus){
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
Page.prototype.addClass = function(obj, cls){
    if (!_this.hasClass(obj, cls)) obj.className += " " + cls
}

// 去除类名
Page.prototype.removeClass = function(obj, cls){
    if (_this.hasClass(obj, cls)) {
        var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
        obj.className = obj.className.replace(reg, ' ')
    }
}

// 查看类名
Page.prototype.hasClass = function(obj, cls){
    // console.log(obj,cls)
    return obj.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'))
}
// 按键关闭
Page.prototype.BtnClose = function(){
    document.onkeydown = null;
}
// 按键打开
Page.prototype.BtnOpen = function(){
    var _this = this;
    // 绑定事件
    document.onkeydown = function(e){
        // 兼容
        var e = e || window.event;
        // 阻止默认行为（防止类似整屏移动的情况发生）
        if(e.preventDefault){
          e.preventDefault();
        }
        else{
          e.returnValue = false;
        }
        var key = e.keyCode || e.which;
        // 兼容EC6108V9盒子
        if(key<0 || key>255){
          key = e.charCode;
        }

        // 方向键处理
        if( key >=37 && key <=40 ){
            // 获取移动前的焦点
            _this.prevIndex = document.getElementsByClassName(_this.moveFocusClass)[0].getAttribute('data-id');

            // 执行移动规则后的焦点索引值
            _this.currentIndex = _this.moveAction(key,_this.prevIndex,_this.area);
            // 焦点改变
            _this.removeClass(_this.hotBtns[_this.prevIndex],_this.focusName);
            _this.addClass(_this.hotBtns[_this.currentIndex],_this.focusName);

            // 按移动建后执行的特殊规则
            _this.focusRules && _this.focusRules(_this.hotBtns,_this.prevIndex,_this.currentIndex,_this.area,key);

        }
        // 确定键处理
        else if(key == 13){
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

// epg对象
/**
* @param  {[type]} opt.contentId [内容id]
* @param  {[type]} opt.serviceId [内容id]
* @param  {[type]} opt.productIds [各省产品id]
* @return {[type]}      [description]
*/
function Epg(opt){
    var _this = this;
    // 属性
    _this.SPID = "96596";
    _this.TVVAS_URL = "http://202.99.114.14:35820/";
    _this.baseUrl = "http://202.99.114.74:56199/";
    _this.UserID;
    _this.carrierId;
    _this.contentId = opt.contentId;
    _this.serviceId;
    _this.productId;
    _this.UserToken;
    _this.EPGDomain;
    _this.areaid;
    _this.templateName;
    _this.stbModel;
    _this.isVip = 0;
    _this.returnUrl;
}
// 初始化
Epg.prototype.init = function(){
    var _this = this;
    try{
        _this.carrierId = getCarrierID();
        _this.UserID = getUserID();
        _this.contentId = _this.contentId || Authentication.CTCGetConfig("contentId");
        _this.serviceId = _this.getServerID() ||  Authentication.CTCGetConfig("serviceId");
        _this.productId = _this.getproductID() || Authentication.CTCGetConfig("productId");
        _this.UserToken = _this.getUserToken() || Authentication.CTCGetConfig("UserToken");
        _this.EPGDomain = Authentication.CTCGetConfig("EPGDomain");
        _this.areaid = Authentication.CTCGetConfig("areaid");
        _this.templateName = Authentication.CTCGetConfig("templateName");
        _this.stbModel = _this.getSTBModel();
        _this.returnUrl = _this.getReturnUrl();
    }
    catch(e){
        console.log(e);
    }
}
// 获取机顶盒型号
Epg.prototype.getSTBModel = function(){
    var _this = this;
    var stbModel = '';
    try{
        //此方法经测试目前可以获取到华为，中兴，创维三款机顶盒型号
        stbModel = Authentication.CTCGetConfig('STBType');
        if (!stbModel){
            stbModel = Authentication.CUGetConfig("STBType");
        }
        //烽火的机顶盒
        if(!stbModel){
            stbModel = Authentication.CTCGetConfig("device.stbmodel");
        }
        //中兴老的盒子获取机顶盒型号的方法
        if(!stbModel && typeof(ztebw) == 'object' ){
            stbModel = ztebw.ioctlRead("infoZTEHWType");
            if(!stbModel){
                stbModel = ztebw.ioctlRead("infoHWProduct");
            }
        }
    }
    catch(e){
      // console.log("不支持获取机顶盒型号！");
    }
    _this.stbModel = stbModel;
    return stbModel;
}
//获取机顶盒userId
Epg.prototype.getSTBUserId = function(){
    var userId = '';
    try{
        if(typeof (Authentication) == 'object'){
            // 此方法经测试目前可以获取到华为，中兴，创维三款机顶盒型号
            userId = Authentication.CTCGetConfig('UserID');
            if (!userId) {
                userId = Authentication.CUGetConfig("UserID");
            }
            //烽火的机顶盒 
            if(!userId) { 
                userId =Authentication.CTCGetConfig("device.userid"); 
            }
        }
        else{
          // console.log("不支持Authentication！");
        }
    }
    catch(e){
        userId = '';
    }    
    _this.UserID = userId;
    return userId; 
}
/**
 * 通过键值获取机顶盒对应信息
 * ex:UserToken--用户token,EPGDomain--EPG域名,areaid--地区编码,templateName--当前用户模板,
 * @param  {[type]} name [参数名]
 * @return {[type]}      [description]
 */
Epg.prototype.getSTBKey = function(name){
    var _this = this;
    var value = '';
    try {
        value = Authentication.CTCGetConfig(name);
        _this[name] = value;
    } 
    catch(e){
        // console.log('不支持Authentication!');
    }
    return value;
}
Epg.prototype.setKey = function(name,value){
    var _this = this;
    try{
        //设置机顶盒函数
        var code = Authentication.CTCSetConfig(name,value);
        _this[name] = value;
    }
    catch(e){
        console.log(e);
    }
    return code;
}
//获取carrierId
Epg.prototype.getCarrierID = function(){
    var _this = this;
    //获取carrierId先从url上找
    var CarrierID = _this.getQueryString('carrierId');
    //如果url上有carrierId就把它写入cookie里面
    if(CarrierID){
        _this.setCookie("CarrierID",CarrierID);//设置cookie['UserToken']
    }
    //如果url上没有CarrierID就在cookie上寻找
    else{
        CarrierID = _this.getCookie('CarrierID'); //CarrierID
        //如果cookie上也没有CarrierId
        if(!CarrierID){
            CarrierID = "100";
            _this.setCookie("CarrierID",CarrierID);
        }
    }
    _this.carrierId = CarrierID;
    return CarrierID;
}
//获取userId 
Epg.prototype.getUserID = function(){
    var _this = this;
    //优先获取epg在url上携带的userId(注意这个参数名是userId,这可能与镜像的参数名不同)
    var userId = _this.getQueryString('userId') || _this.getQueryString('UserID') || _this.getQueryString('uid');
    //如果url上有则写进cookie里面
    if(userId){
        if(userId.indexOf("_")==-1 && _this.getCarrierID() != "201"){
            userId = userId + "_" + _this.getCarrierID();
        }
        _this.setCookie('uid',userId);
    }
    //如果没有url上没有携带useid
    else{
        //从cookie上寻找uid
        userId = _this.getCookie('uid');
        //如果cookie上没有，最后再获取机顶盒的userid
        if(!userId){
            userId = _this.getSTBUserId();
            // 如果能从机顶盒获取用户id
            if(userId){
                if(userId.indexOf("_")==-1 && _this.getCarrierID() != "201"){
                    userId = userId + "_" + _this.getCarrierID();
                }
                _this.setCookie('uid',userId);
            }
            //如果机顶盒上也没有，就是用pc访问的话
            else{
                userId = Authentication.CTCGetConfig("UserID") ? Authentication.CTCGetConfig("UserID") : 'pc201711272010101'; 
                _this.setCookie('uid',userId);
            }
        }
    }
    _this.UserID = userId;
    return userId;
}
// 获取服务id
Epg.prototype.getServerID = function(){
    var _this = this;
    _this.serviceId = opt.serviceId;
    setCookie(_this.contentId+"_serviceId",_this.serviceId);
    return _this.serviceId;
}
// 获取产品id
Epg.prototype.getproductID = function(){
    var _this = this;
    _this.productId = opt.productIds[_this.carrierId];
    setCookie(_this.contentId+"_productId",_this.productId);
    return _this.productId;
}
// 获取用户令牌
Epg.prototype.getUserToken = function(){
    var _this = this;
    // 如果usertoken在url上
    var UserToken = getQueryString('UserToken');//获取Url的UserToken
    //如果在url上则设置到cookie里面
    if(UserToken){
        _this.setCookie('UserToken',UserToken);
    }
    //如果usertoken不在url上
    else{
        //先从cookie里面寻找
        UserToken = _this.getCookie('UserToken');
        //usertoken在cookie上
        if(UserToken){//有则没有过期
            _this.setCookie('UserToken',UserToken);
        }
        //usertoken不在cookie上,则进行身份验证
        else{
            //若身份验证后依然拿不到usertoken（则说明该用户是黑名单用户，不存在usertoken,无法进行订购操作），此时就不能验证第二次，否则会一直验证下去进入死循环
            if(_this.getQueryString('verifyuser') != 'true'){
                _this.verifyuser();
            }
            // 若是黑名单用户
            else{
                UserToken = "blacklist";
            }
        }
    }
    _this.UserToken = UserToken;
    return UserToken;
}
//获取返回epg的地址
Epg.prototype.getReturnUrl = function(){
    var _this = this;
    var url = _this.getQueryString('ReturnUrl') || _this.getQueryString("returnUrl");
    if(url){
        _this.setCookie(_this.contentId+"_returnUrl",url,16);
    }
    // 如果url上没有从cookie上查找
    else{
        // 如果cookie上有
        if(_this.getCookie(_this.contentId+"_returnUrl")){
            url = _this.getCookie(_this.contentId+"_returnUrl")
            _this.setCookie(_this.contentId+"_returnUrl",url,16);
        }
        // 如果cookie上没有，就把上一页路径做为返回路径
        else{
            url = document.referrer;
            _this.setCookie(_this.contentId+"_returnUrl",document.referrer,16);
        }
    }
    _this.returnUrl = url
    return url;
}
// 身份验证(重定向)
Epg.prototype.verifyuser = function(fn){
    var _this = this;
    var returnUrl = window.location.href.indexOf("?") != -1 ? window.location.href + "&verifyuser=true" : window.location.href + "?verifyuser=true";
    window.location.href = _this.TVVAS_URL +"ACS/vas/verifyuser?SPID="+_this.SPID+"&UserID="+_this.UserID+"&CarrierID="+_this.carrierId+"&ReturnURL="+encodeURIComponent(returnUrl);
}
Epg.prototype.getQueryString = function(name){
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]); return null; 
}
Epg.prototype.setCookie = function(name,value,t){   
    var hour = t?t:8; 
    var exp = new Date();   
    exp.setTime(exp.getTime() + hour*60*60*1000);   
    document.cookie = name + "="+ escape (value) + ";expires=" + exp.toGMTString()+";path=/";   
} 
Epg.prototype.getCookie = function(name){    
    var arr, reg = new RegExp("(^| )"+name+"=([^;]*)(;|$)");  
    if(arr=document.cookie.match(reg)){  
        return unescape(arr[2]);   
    }  
    else{  
        return null;   
    }
}
Epg.prototype.ajax = function(options){
    var _this = this;
    //异步请求对象的完成状态
    this.done = 0;
    this.format = function(){
        var now = new String(new Date().getTime());
        return now.substr(0,now.length-5);
    }
    //格式化参数
    this.formatParams = function(data) {
        //获取地址参数
        var arr = [];
        for (var name in data) {
            arr.push(encodeURIComponent(name) + "=" + encodeURIComponent(data[name]));
        }
        
        arr.push("t="+_this.format());//按分钟刷一次
        return arr.join("&");
    }
    
    //传入设置
    options = options || {};
    //请求方式
    options.type = (options.type || "GET").toUpperCase();
    options.dataType = options.dataType || "json";
    options.async = options.async || true;
    var params = _this.formatParams(options.data);
    //创建异步请求对象 - 第一步
    var xhr;
    //w3c标准
    if (window.XMLHttpRequest) {
        xhr = new XMLHttpRequest();
    } 
    //兼容IE6及以下
    else if (window.ActiveObject) { 
        xhr = new ActiveXObject('Microsoft.XMLHTTP');
    }
    
    //连接 和 发送 - 第二步
    //判断是那种类型的请求
    //若是get请求
    if (options.type == "GET") {
        //参数拼接
        if(options.url.indexOf("?")==-1) sp="?" ; else sp="&";
    
        //发送请求
        xhr.open("GET", options.url + sp + params,options.async);
        xhr.send(null);
        
    } 
    //若是post请求
    else if (options.type == "POST") {
        //发送请求
        xhr.open("POST", options.url,options.async);
        //设置表单提交时的内容类型
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        //参数配置
        xhr.send(params);
    }

    //接收 - 第三步
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
            //状态码
            var status = xhr.status;
            //状态码表示成功时，执行成功回调函数
            if (status >= 200 && status < 300 || status == 304) {
                            
                //返回数据的格式
                //json字符串
                if (options.dataType == "json") {

                    try{
                        options.success && options.success(eval("("+xhr.responseText+")"));
                    }
                    catch(err){
                        options.success && options.success(JSON.parse(xhr.responseText), xhr.responseXML);
                    }
                    
                
                } 
                //普通字符串
                else {
                    options.success && options.success(xhr.responseText, xhr.responseXML);
                }
                // 改变状态为完成
                _this.done = 1;
            } 
            //如果状态码表示失败时调用错误处理回调函数
            else {
                options.error && options.error(status);
                // 改变状态为完成
                _this.done = 1;
            }
        }
    }
}
// 鉴权
Epg.prototype.authorization = function(call){
    var _this = this;
    _this.ajax({
        type: 'POST',
        url:_this.baseUrl+'index.php?m=Home&c=Api&a=authorization',
        dataType: "json",
        data: {
            url:_this.TVVAS_URL+'ACS/vas/authorization',
            userId:_this.UserID,
            contentId:_this.contentId,
            serviceId:_this.serviceId,
            productId:_this.productId,
            UserToken:_this.UserToken,
        },
        success: function (res) {
            //如果返回该用户是vip，则设置cookie的vip状态，并改变vip热键的样式
            if(res.result==0){           
                _this.isVip = 1;
                _this.setCookie(_this.contentId+"_isVip", 1);
                call && call();
            }
        }
    })
}