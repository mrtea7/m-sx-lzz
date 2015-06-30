/*
 * 隐藏微信右上角按钮
 * 全局设置textarea 输入限制
 * hongda.wu@hsmob.com
*/
(function(){
    function onBridgeReady(){
        WeixinJSBridge.call('hideOptionMenu');
    }

    if(location.href.indexOf('showOptionMenu') < 0){
        if (typeof WeixinJSBridge == "undefined"){
            if( document.addEventListener ){
                document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
            }else if (document.attachEvent){
                document.attachEvent('WeixinJSBridgeReady', onBridgeReady); 
                document.attachEvent('onWeixinJSBridgeReady', onBridgeReady);
            }
        }else{
            onBridgeReady();
        }
    }

    document.addEventListener("DOMContentLoaded", function(){
        var textarea = document.querySelectorAll('textarea'),
            i = 0;

        for(; i < textarea.length; i++){
            textarea[i].setAttribute('maxlength', 125);
        }
    }, false);
})();