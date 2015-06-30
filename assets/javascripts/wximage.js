var images = {
    localId: [],
    serverId: []
};
$('#wxuploadImg').bind("touchstart", function (event) {
    wx.chooseImage({
        success: function (res) {
            for (var i = 0; i < res.localIds.length; i++) {
                var imgUrl = [];
                imgUrl[i] = res.localIds[i];
                $("#wxuploadImg").parent().before('<li>' +
                '<span  style="background-image: url(' + imgUrl[i] + ');"></span>' +
                '</li>')
            }
            alert('已选择 ' + res.localIds.length + ' 张图片');
            var i = 0, length = images.localId.length;
            images.serverId = [];
            function upload() {
                wx.uploadImage({
                    localId: images.localId[i],
                    success: function (res) {
                        i++;
                        alert('已上传：' + i + '/' + length);
                        images.serverId.push(res.serverId);
                        if (i < length) {
                            upload();
                        }
                    },
                    fail: function (res) {
                        alert(JSON.stringify(res));
                    }
                });
            }
            upload();
        }
    });
});