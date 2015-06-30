/**
 * Created by tea on 2015/6/16.
 */
var voice = {
    localId: '',
    serverId: ''
    /* ,
     start: '',
     end: ''*/
};
/*   $("#wxrecordText").toggle(
 function () {
 $("#wxrecordText").attr("value", '完成录音');
 wx.startRecord({
 cancel: function () {
 alert('用户拒绝授权录音');
 }
 });
 },
 function () {
 $('#wxrecordText').hide();
 $("#wxrecordText").attr("value", '开始录音');
 wx.stopRecord({
 success: function (res) {
 voice.localId = res.localId;
 },
 fail: function (res) {
 alert(JSON.stringify(res));
 }
 });
 wx.uploadVoice({
 localId: voice.localId,
 success: function (res) {
 alert('上传语音成功，serverId 为' + res.serverId);
 voice.serverId = res.serverId;
 }
 });
 $("#wxrecordPic").show(200);
 }
 );*/
var start = "";
var end = "";
var flag = false;
$('#wxrecordText').bind("touchstart", function () {
    flag = true;
    start = new Date().getTime();//起始时间
    wx.startRecord({
        cancel: function () {
            alert('用户拒绝授权录音');
        }
    });
    $('body').append(
        '<div id="shade" style="height: 100%;width:100%;position: absolute;top: 0;background-color: #000000;opacity: 0.5;z-index: 10001">' +
        '<img style="position: relative;top:50%;left:50%" src="../../../assets/imgs/jsb_j.png">' +
        '</div>')
});
$(document).bind("touchend", function () {
    if (flag == true) {
        end = new Date().getTime();//接受时间
        var time = parseInt((end - start) / 1000);
        $('#time').html(time + " ’’")
        $("#shade").remove();
        wx.stopRecord({
            success: function (res) {
                voice.localId = res.localId;
                wx.uploadVoice({
                    localId: voice.localId,
                    success: function (res) {
                        voice.serverId = res.serverId;
                        $('#shade').remove()
                        $('#wxrecordText').hide();
                        $("#wxrecordPic").show(500);
                    alert("voice.localId"+voice.localId)
                    alert("voice.serverId"+voice.serverId)
                    }
                });
            },
            fail: function (res) {
                alert(JSON.stringify(res));
            }
        });
        flag = false;
    }
});
$("#pic").click(
    function () {
        wx.playVoice({
            localId: voice.localId
        });

    }
);
$("#trash").click(
    function () {
        $('#wxrecordText').show();
        $('#wxrecordPic').hide();

    }
)
