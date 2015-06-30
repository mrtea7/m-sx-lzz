/**
 * Created by tea on 2015/1/20.
 */
$().ready(function(){
    var date = new Date();
    this.year = date.getFullYear();
    this.month = date.getMonth() + 1;
    this.date = date.getDate();
    this.hour = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
    this.minute = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();

    this.toString = function() {
        return this.year + "-" + this.month + "-" + this.date  + " " + this.hour + ":" + this.minute;
    };

    $("#datetime").val(this.toString());

});

function minus(obj){
    var num = $(obj).next().html();
    num = parseInt(num);
    num-=1;
    $(obj).next().html(num);
    if(num==0){
        $(obj).css('display','none');
    }
}
function add(obj){
    var num = $(obj).prev().html();
    num = parseInt(num);
    num+=1;
    $(obj).prev().html(num);
    num>0?$(obj).prev().prev().css('display','inline'):'';
}
function minus5(obj){
    var num = $(obj).next().html();
    num = parseInt(num);
    num-=5;
    $(obj).next().html(num);
    if(num==0){
        $(obj).css('display','none');
    }
}
function add5(obj){
    var num = $(obj).prev().html();
    num = parseInt(num);
    num+=5;
    $(obj).prev().html(num);
    num>0?$(obj).prev().prev().css('display','inline'):'';
}