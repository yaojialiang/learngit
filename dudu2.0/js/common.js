/* 
* @Author: Len
* @Date:   2018-09-05 09:58:27
* @Last Modified by:   Marte
* @Last Modified time: 2019-03-05 22:19:35
*/



//ajax对象构造函数
/**
 * [Ajax description]
 * @param {[type]} options [请求方式（字符串）]
 * @param {[dataType]} options [返回数据的格式（字符串）]
 * @param {[data]} options [参数（对象）]
 * @param {[url]} options [请求地址（字符串）]
 * @param {[success]} options [成功回调（函数）]
 * @param {[error]} options [错误回调（函数）]
 * @param {[async]} options [是否同步（布尔）]
 
 * 例子：
 * ajax({
        url:
        data:
        type:
        dataType:
        success:
        error:
        async:
    });
 */
function ajax(options){
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



function setCookie(name,value,t){   
  //document.cookie.setPath("/");  
  var hour = t?t:8; 
  var exp = new Date();   
  exp.setTime(exp.getTime() + hour*60*60*1000);   
  document.cookie = name + "="+ escape (value) + ";expires=" + exp.toGMTString()+";path=/";   
} 

function getCookie(name){   
  //document.cookie.setPath("/");  
  var arr, reg = new RegExp("(^| )"+name+"=([^;]*)(;|$)");  
  if(arr=document.cookie.match(reg)){  
      return unescape(arr[2]);   
  }  
  else{  
      return null;   
  }
}


//类名增加兼容
function addClass(obj, cls){
    if (!hasClass(obj, cls)) obj.className += " " + cls
}

// 去除类名
function removeClass(obj, cls){
    if (hasClass(obj, cls)) {
        var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
        obj.className = obj.className.replace(reg, ' ')
    }
}

// 查看类名
function hasClass(obj, cls){
    // console.log(obj,cls)
    return obj.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'))
}

// 缓冲运动
function animate(ele,opt,callback){
    //设置一个变量用于判断动画数量
    var timerLen = 0;
    for(var attr in opt){
        creatTimer(attr);
        //每加一个定时器，动画数加一
        timerLen++;
    }
    function creatTimer(attr){
        var timerName = attr + 'timer';console.log(timerName)
        var target = opt[attr];
        clearInterval(ele[timerName]);
        ele[timerName] = setInterval(function(){
            // 先获取当前值
            var current = getComputedStyle(ele)[attr];

            // 提取数值：单位
            // 根据当前值提取单位(单位在current最后面)
            var unit = current.match(/[a-z]+$/);
            if(unit){
                current = current.substring(0,unit.index)*1;
                unit = unit[0]
            }else{
                unit = '';
                current *= 1;
            }

            // 计算速度
            var speed = (target - current)/10;

            // 处理speed值，防止speed为小数而造成定时器无法完成的情况
            // 0.3=>1,-0.3=>-1
            speed = speed>0 ? Math.ceil(speed) : Math.floor(speed);

            //对于没有单位的属性单独处理
            if(attr == 'opacity'){
                speed = speed>0?0.05:-0.05;
            }
            

            if(current === target){console.log("清除定时器")
                clearInterval(ele[timerName]);
                current = target - speed;
                //每完成一个动画，timerLen减一
                timerLen--
                //最后若timerLen数量为零，则所有动画已经执行完再执行回调函数
                if(typeof callback ==='function'&&timerLen==0){
                    callback();
                }
                
            }
            ele.style[attr] = current + speed + unit;
        },30)
    };
}

/**
  * 获取url字段参数化
  * @param name 字段名
*/
function getQueryString(name){
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]); return null; 
}
//获取机顶盒函数
function getKey(name){
    var value = Authentication.CTCGetConfig(name);
    return value;
}



