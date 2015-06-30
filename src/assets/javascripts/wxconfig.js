/**
 * Created by tea on 2015/6/10.
 */
var timestamp = "";
var nonceStr = "";
var signature = "";
var url = $('#url').val();
$.ajax({
    type: "POST",
    url: "http://weixin.zssglglj.com:8088/api/wechats/getSign.do",
    data: JSON.stringify({"url":url}),
    success: function(data){
        timestamp = data.data.timestamp;
        nonceStr = data.data.nonceStr;
        signature = data.data.signature;

        wx.config({
            debug: false,
            appId: 'wx4a71f087c1c16336',
            timestamp: parseInt(timestamp),
            nonceStr: nonceStr,
            signature: signature,
            jsApiList: [
                'checkJsApi',
                'onMenuShareTimeline',
                'onMenuShareAppMessage',
                'onMenuShareQQ',
                'onMenuShareWeibo',
                'hideMenuItems',
                'showMenuItems',
                'hideAllNonBaseMenuItem',
                'showAllNonBaseMenuItem',
                'translateVoice',
                'startRecord',
                'stopRecord',
                'onRecordEnd',
                'playVoice',
                'pauseVoice',
                'stopVoice',
                'uploadVoice',
                'downloadVoice',
                'chooseImage',
                'previewImage',
                'uploadImage',
                'downloadImage',
                'getNetworkType',
                'openLocation',
                'getLocation',
                'hideOptionMenu',
                'showOptionMenu',
                'closeWindow',
                'scanQRCode',
                'chooseWXPay',
                'openProductSpecificView',
                'addCard',
                'chooseCard',
                'openCard'
            ]
        });
    },
    dataType: "JSON",
    contentType: "application/json; charset=utf-8"
});


