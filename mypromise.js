/* 
* @Author: Marte
* @Date:   2018-09-26 18:28:43
* @Last Modified by:   Marte
* @Last Modified time: 2018-11-07 17:06:08
*/

(function(window){
    // 参考Joe-Xie：https://www.cnblogs.com/XieJunBao/p/9156134.html
    // 原生封装promise为了应对低版本浏览器不兼容问题
    

    // 异步串行思路：promise执行then是注册回调函数，then有多个就可以注册多个回调函数，但是若多个回调都是异步执行的，那我们要等上一个异步结束后才执行下一个异步，这是时候就需要上一个异步操作完成后，把这个完成状态告诉下一个回调，这样才可以异步串行。为了解决这个问题我们把异步完成状态托管给promise去管理
    // 流程：第一步注册：链式调用then函数，每执行一个then函数，返回一个桥梁promise(then函数中的成功回调和失败回调是写入这个promise的回调列表中的，注意成功回调的功能除了执行本身函数外还要更新下一个promise的状态)
    // 第二步执行：第一个promise的异步执行完，开始执行第一个promise的回调函数（回调函数又分两步走：第一步：resolvePromise解析回调返回值（如果是promise则说明是异步，就需要继续解析直到不是promise而是一个具体的值），第二步：当回调返回的值是一个具体值而不是promise时，调用第二个proomise的reslove方法将第二个proomise的状态更新为fulfilled，并将第一个promise的回调的值传入p2的回调函数中去执行）

    function MyPromise(fn) {
        var self = this;
        // 成功回调传的参数
        self.value = null;
        // 失败回调传的参数
        self.error = null;
        // 当前promise对象的状态
        self.status = "pending";
        // 存储成功回调列表
        self.onFulfilledCallbacks = [];
        // 存储失败回调列表
        self.onRejectedCallbacks = [];

        // 状态改变并执行回调
        // 成功
        function resolve(value) {
            // 判断传入参数是否由MyPromise构造的对象，若是，注册该函数
            if (value instanceof MyPromise) {
                return value.then(resolve, reject);
            }
            // 判断
            if (self.status === "pending") {
                setTimeout(function(){
                    self.status = "fulfilled";
                    self.value = value;
                    // 执行成功回调
                    // self.onFulfilledCallbacks.forEach(function(callback){callback(self.value)});
                    // 向下兼容forEach
                    for(var i=0;i<self.onFulfilledCallbacks.length;i++){
                        self.onFulfilledCallbacks[i](self.value);
                    }
                }, 0)
            }
        }
        // 失败
        function reject(error) {
            if (self.status === "pending") {
                setTimeout(function() {
                    self.status = "rejected";
                    self.error = error;
                    // self.onRejectedCallbacks.forEach(function(callback){callback(self.error)});
                    for(var i=0;i<self.onRejectedCallbacks.length;i++){
                        self.onRejectedCallbacks[i](self.error);
                    }
                }, 0)
            }
        }
        try {
            fn(resolve, reject);
        } 
        catch (e) {
            reject(e);
        }
    }

    // 解析放回值
    // 用来解析回调函数的返回值x，x可能是普通值也可能是个promise对象
    // 因为回调函数既可能会返回一个异步的promise也可能会返回一个同步结果，所以我们把直接把回调函数的结果托管给bridgePromise，使用resolvePromise方法来解析回调函数的结果，如果回调函数返回一个promise并且状态还是pending，就在这个promise的then方法中继续解析这个promise reslove传过来的值，如果值还是pending状态的promise就继续解析，直到不是一个异步promise，而是一个正常值就使用bridgePromise的reslove方法将bridgePromise的状态改为fulfilled，并调用onFulfilledCallbacks回调数组中的方法，将该值传入，到此异步操作就衔接上了。
    function resolvePromise(bridgepromise, x, resolve, reject) {
        // bridgepromise是桥梁promise，x是桥梁promise中注册的成功回调的返回值，resolve和reject是桥梁promise的状态改变函数
        // 2.3.1规范，避免循环引用
        // 如果成功回调的值又是桥梁promise就返回循环传参的错误（死循环）
        if (bridgepromise === x) {
            return reject(new TypeError('Circular reference'));
        }
        var called = false;
        // // 如果x是一个promise，则通过递归
        // if (x instanceof MyPromise) {
        //     //如果这个promise是pending状态，就在它的then方法里继续执行resolvePromise解析它的结果，直到返回值不是一个pending状态的promise为止（这里使用了递归的方法）
        //     if (x.status === "pending") {
        //         x.then(
        //             function(y){
        //                 resolvePromise(bridgepromise, y, resolve, reject);
        //             }, 
        //             function(error){
        //                 reject(error);
        //             }
        //         );
        //     } 
        //     else {
        //         x.then(resolve, reject);
        //     }
        // } 
        // else 
        // // 如果x是一个promise，则继续解析它的状态
        if (x != null && ((typeof x === 'object') || (typeof x === 'function'))) {
            try {
                var then = x.then;
                if (typeof then === 'function') {
                    // then方法的指向传入的桥梁promise，也就是说该桥梁promise调用了then方法并传入了成功回调和失败回调
                    then.call(
                        x,
                        // 传入then的成功回调
                        function(y){
                            if (called) return;
                            called = true;
                            // 这里重新解析当前的桥梁promise，至于成功回调的返回值传空（这里目的是通过递归持续判断当前桥梁promise的状态）
                            resolvePromise(bridgepromise, y, resolve, reject);
                        },
                        //传入then的失败回调
                        function(error){
                            if (called) return;
                            called = true;
                            reject(error);
                        }
                    )
                } 
                // 如果then不是一个函数，则以x为值改变promise状态并延长成功回调列表
                else {
                    resolve(x);
                }
            } 
             // 如果在取x.then值时抛出了异常，则以这个异常做为原因将promise拒绝。
            catch (e) {
                if (called) return;
                called = true;
                reject(e);
            }
        } 
        // 如过x不是一个promise，则改变bridgePromise的状态改为fulfilled，并调用onFulfilledCallbacks回调数组中的方法，将该值传入
        else {
            resolve(x);
        }
    }

    // 注册回调函数
    MyPromise.prototype.then = function(onFulfilled, onRejected) {
        var self = this;
        // 搭建桥梁promise（即调用为then方法后重新返回一个新的promise对象）
        var bridgePromise;
        // 防止使用者不传成功或失败回调函数，所以成功失败回调都给了默认回调函数
        onFulfilled = typeof onFulfilled === "function" ? onFulfilled : function(value){return value};
        onRejected = typeof onRejected === "function" ? onRejected : function(error){throw error};
        // 如果当前的promise对象是完成状态
        // 返回一个新的桥梁promise
        if (self.status === "fulfilled") {
            return bridgePromise = new MyPromise(function(resolve, reject){
                setTimeout(function(){
                    try {
                        // 获取成功回调函数的返回值
                        var x = onFulfilled(self.value);
                        // 解析桥梁promise函数
                        resolvePromise(bridgePromise, x, resolve, reject);
                    } 
                    catch (e) {
                        reject(e);
                    }
                }, 0);
            })
        }
        // 如果当前的promise对象是拒绝状态
        if (self.status === "rejected") {
            return bridgePromise = new MyPromise(function(resolve, reject){
                setTimeout(function(){
                    try {
                        var x = onRejected(self.error);
                        resolvePromise(bridgePromise, x, resolve, reject);
                    } 
                    catch (e) {
                        reject(e);
                    }
                }, 0);
            });
        }
        // 如果当前的promise对象是听候状态，则在当前promise对象的成功回调列表和失败回调列表中注入
        if (self.status === "pending") {
            return bridgePromise = new MyPromise(function(resolve, reject){
                // 注意回调列表是把整个回调函数和回调解析函数一起注入的！！！！！，所以在执行回调时除运行回调函数还要，解析桥梁promise的状态（有可能桥梁promise中也有promise），解析中改变当前promise的状态，若当前promise的状态为完成状态才继续执行下一个注册好的回调
                self.onFulfilledCallbacks.push(function(value){
                    try {
                        var x = onFulfilled(value);
                        resolvePromise(bridgePromise, x, resolve, reject);
                    } 
                    catch (e) {
                        reject(e);
                    }
                });
                self.onRejectedCallbacks.push(function(error){
                    try {
                        var x = onRejected(error);
                        resolvePromise(bridgePromise, x, resolve, reject);
                    } 
                    catch (e) {
                        reject(e);
                    }
                });
            });
        }
    }
    MyPromise.prototype.MyCatch = function(onRejected) {

        return this.then(null, onRejected);    
    }
    
    MyPromise.all = function(promises) {
        return new MyPromise(function(resolve, reject) {
            var result = [];
            var count = 0;
            for (var i = 0; i < promises.length; i++) {
                promises[i].then(function(data) {
                    result[i] = data;
                    if (++count == promises.length) {
                        resolve(result);
                    }
                }, function(error) {
                    reject(error);
                });
            }
        });
    }

    MyPromise.race = function(promises) {
        return new MyPromise(function(resolve, reject) {
            for (var i = 0; i < promises.length; i++) {
                promises[i].then(function(data) {
                    resolve(data);
                }, function(error) {
                    reject(error);
                });
            }
        });
    }

    MyPromise.resolve = function(value) {
        return new MyPromise(function(resolve){
            resolve(value);
        });
    }

    MyPromise.reject = function(error) {
        return new MyPromise(function(resolve, reject){
            reject(error);
        });
    }
    MyPromise.promisify = function(fn) {
        return function() {
            var args = Array.from(arguments);
            return new MyPromise(function(resolve, reject) {
                fn.apply(null, args.concat(function(err) {
                    err ? reject(err) : resolve(arguments[1])
                }));
            })
        }
    }

    window.MyPromise = MyPromise;

})(window);