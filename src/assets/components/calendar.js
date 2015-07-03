
var myCalendar = (function(iTPL){
    var week = {0:"日", 1:"一", 2:"二", 3:"三", 4:"四", 5:"五", 6:"六"};

    function mc(obj){
        this.curTime = new Date();
        this.table = document.createDocumentFragment();
        for(o in obj){
            this[o] = obj[o];
        }
        this.month = this.curTime.getMonth();
        this.year = this.curTime.getFullYear();
        this.date = this.curTime.getDate();
    }
    mc.prototype = {
        fillDate: function(fn){
            var that = this;
            //
            var lastMonth = that.getMonthOBJ(new Date(that.year, that.month-1, 1) );
            var nextMonth = that.getMonthOBJ(new Date(that.year, that.month+1, 1) );
            var curMonth  = that.getMonthOBJ(that.curTime);
            //
            var last_arr = (0 ==curMonth.lastMonthLength)?[]:lastMonth.arr.slice(-curMonth.lastMonthLength);
            var next_arr = (0 ==curMonth.nextMonthLength)?[]:nextMonth.arr.slice(0, curMonth.nextMonthLength);
            
            Array.prototype.unshift.call(last_arr, 0, 0);
            //
            Array.prototype.splice.apply(curMonth.arr, last_arr);
            Array.prototype.push.apply(curMonth.arr, next_arr);
            that.curMonth = curMonth;
            return that;
        },
        draw: function(fn){
            var that = this;
            var frag = document.createDocumentFragment();
            var tmpDate = that.curMonth.arr.slice(0);
            while(tmpDate.length>0){
                var row = document.createElement("tr");
                for(var i=0, _date; i<7; i++){
                    _date = tmpDate.shift();
                    _date.si = new Date(_date.year, _date.month, _date.date).valueOf();
                    var cell = document.createElement("td");
                    cell.innerHTML = _date.date;
                    row.appendChild(cell);
                    fn&&fn.call(this, cell, _date);
                }
                frag.appendChild(row);
            }
            that.table.innerHTML = "";
            that.table.appendChild(frag);
            return that;
        },
        getMonthOBJ:function(date, full){
            var that = this;
            var OBJ = {
                arr:[]
            };
            var year = date.getFullYear();
            var month = date.getMonth();                        
            var date = new Date(year, month+1, 0);//本月的下个月的上个月
            for (var i = 1,  monthDay = date.getDate(); i <= monthDay; i++){
                OBJ.arr.push({
                    date:i,
                    month:month,
                    year:year
                });
            }
            var firstDay = new Date(that.year, that.month, 1).getDay();
            var lastDay = new Date(that.year, that.month, i-1).getDay();
            OBJ.lastMonthLength = firstDay%7;
            OBJ.nextMonthLength = 6-lastDay;
            return OBJ;
        }
    }

    return mc;
})(iTemplate);


var calendarDialog  = (function(win, doc, dialog, myCalendar){
    var cd = function(obj){
        this.startDate = obj&&obj.startDate||(new Date().getTime() );
        this.init();
    }

    cd.prototype = {
        constructor:cd,
        init: function(){
            var self = this;
            self.bookObj = {
                startDate: self.startDate,
                days: 1,
                selecteds:[],
                init: function(){
                    var d = new Date(this.startDate);
                    this.selecteds = [];
                    //this.selecteds.push(d.valueOf());
                    for(var i=1, ci; ci = new Date(d.getFullYear(), d.getMonth(), d.getDate() ), i<=this.days; i++){
                        this.selecteds.push(ci.valueOf());
                    }
                }
            }
            self.bookObj.init();
            //一切以当前时间为准，初始化
            self.curTime = new Date();
            self.curObj = {
                //origin record
                year: self.curTime.getFullYear(),
                month: self.curTime.getMonth(),
                date: self.curTime.getDate(),
                monthRange: 0,
                si: self.curTime.getTime(),
                //special flag of select days range
                crosNextMonth: 0,
                crosPrevMonth: 0,
                crosPrevDay:0,
                crosMonth: 0
            }
           //当前选中的日期
            self.bookDate = new Date(self.bookObj.startDate);
            self.curTime = new Date(self.curObj.year, self.bookDate.getMonth(), self.bookDate.getDate());
            self.curObj.monthRange = self.bookDate.getMonth()-self.curObj.month;
            var html = '<div class="widget_wrap" style="z-index:{zIndex2};" ontouchmove="return false;">\
                <div class="Calendar">\
                    <header>\
                        <ul class="tbox">\
                            <li id="idCalendarPre">\
                                <span class="icons icons_left" data-btn="prevMonth">&nbsp;</span>\
                            </li>\
                            <li style="width:100%;">\
                                <label id="label_month"><span id="idCalendarYear"></span>年<span id="idCalendarMonth">8</span>月</label>\
                            </li>\
                            <li id="idCalendarNext">\
                                <span class="icons icons_right" data-btn="nextMonth">&nbsp;</span>\
                            </li>\
                        </ul>\
                    </header>\
                    <table> \
                        <thead>\
                            <tr>\
                                <td>日</td><td>一</td><td>二</td><td>三</td><td>四</td><td>五</td><td>六</td>\
                            </tr>\
                        </thead>\
                        <tbody id="idCalendar"></tbody>\
                    </table>\
                    <header>\
                        <ul class="tbox time_select">\
                            <li>\
                                <a href="javascript:;" data-btn="cancel">取消</a>\
                            </li>\
                            <li style="width:100%;">\
                                <select id="hour_select" name="hour_select"><option>24</option></select>:\
                                <select id="minute_select" name="minute_select"><option>60</option></select>\
                            </li>\
                            <li>\
                                <a href="javascript:;" data-btn="select">确定</a>\
                            </li>\
                        </ul>\
                    </header>\
                </div>\
            </div>';
            self.dialog = dialog(null,{
                TPL: html,
                classes:" calendarDialog ",
                callBack: function(evt){
                    var et = evt.target, dataBtn = et&&et.getAttribute("data-btn");
                    switch(dataBtn){
                        case "prevMonth":
                            self.drawMonth(null, -1);
                        break;
                        case "nextMonth":
                            self.drawMonth(null, 1);
                        break;
                        case "cancel":
                            self.close();
                             window.parent.postMessage({val:null,method:"setdate"}, "*");
                        break;
                        case "select":
                            self.close();
                            var res = self.bookObj.startDate + " " + self.timeObj.hour_select.value+":"+self.timeObj.minute_select.value;
                            res = res.replace(/\/(\d+)/g, function($1, $2){
                                return "-"+("0"+$2).slice(-2);
                            });
                            window.parent.postMessage({val:res,method:"setdate"}, "*");
                        break;
                    }
                    return self;
                }
            });
            return self;
        },
        drawMonth: function(month, flag){
            var self = this;
           switch(flag){
                case 1://next month
                    if((1 != self.curObj.crosNextMonth) && (self.curObj.monthRange>=3) ){return;}
                    self.curObj.monthRange ++;
                    self.curTime = new Date(self.curTime.getFullYear(), self.curTime.getMonth()+1, 1 );
                break;
                case -1://prev month
                    if((-1 != self.curObj.crosPrevMonth) && (self.curObj.monthRange<=0) ){return;}
                    self.curObj.monthRange --;
                    self.curTime = new Date(self.curTime.getFullYear(), self.curTime.getMonth()-1, 1 );
                break;
                default://curr month

                break;
            }
            self.dialog.widget.querySelector("#label_month").innerHTML = self.curTime.getFullYear()+'年'+(self.curTime.getMonth()+1)+'月';
            window.mc2 = new myCalendar({
                curTime: self.curTime,
                table:document.getElementById("idCalendar")
            }).fillDate().draw(function(cell, _date){
                if(self.curObj.si<=(_date.si+24*60*60*1000) && (_date.month-self.curObj.month<=5) ){
                    cell.addEventListener("click", function(){
                        self.selectStart(_date);
                    }, false);
                }else{
                    cell.classList.add("disabled");
                }
                var today = new Date();
                today = new Date(today.getFullYear(), today.getMonth(), today.getDate() ).valueOf();
                
                if(this.month !== _date.month){
                    cell.style.backgroundColor = "rgba(0,0,0,0)";
                }
                if(today == _date.si){
                    cell.classList.add("onToday");
                    cell.innerHTML = '<a href="javascript:;" class="double"><span>'+_date.date+'</span><span>今天</span></a>';
                }
                for(var j=0,len=self.bookObj.selecteds.length, cj; cj = self.bookObj.selecteds[j]; j++){
                    if(cj  == _date.si){
                        switch(true){
                            case _date.month>self.curTime.getMonth():
                                self.curObj.crosNextMonth = 1;
                                break;
                            case _date.month<self.curTime.getMonth():
                                self.curObj.crosNextMonth = -1;
                                break;
                            default:
                                self.curObj.crosNextMonth = 0;
                        }
                        var span2 = (function(){
                            if(j==0){
                                self.bookObj.startDate = _date.year+"/"+(_date.month+1)+"/"+_date.date;
                                return {type:0, str:'<span>√</span><input type="hidden" value="'+cj+'" name="selectedDay" />'};
                            }else if(j == (len-1) ){
                                return {type:1, str:'<span></span>'};
                            }else{
                                return {type:-1, str:""};
                            }
                        })();
                        cell.innerHTML = "<a href='javascript:void(0);' class='checked "+(span2.type>-1?"double":"")+"'><span>" + _date.date + "</span>"+span2.str+"</a>";
                    }
                }
             });
            return self;
        },
        selectStart: function(_date){
            var self = this;
            self.bookObj.startDate = _date.year+"/"+(_date.month+1)+"/"+_date.date;
            self.bookObj.init();
            self.drawMonth(null, (function(){
                switch(true){
                    case _date.month>self.curTime.getMonth():
                        return 1;
                    break;
                    case _date.month<self.curTime.getMonth():
                        return -1;
                    break;
                    default:
                        return 0;
                    break;
                }
            })());
            self.drawTime(_date);
            return self;
        },
        drawTime: function(_date){
            var self = this;
            var today = new Date();
            today = {
                year: today.getFullYear(),
                month: today.getMonth(),
                date: today.getDate(),
                _today:false,
                H:today.getHours(),
                M:today.getMinutes()
            }
            _date = _date||today;
            if(today.year == _date.year && today.month == _date.month && today.date == _date.date){
                today._today = true;
            }else{
                today.H = 1;
                today.M = 0;
            }
            self.timeObj = {
                hour_select : self.dialog.widget.querySelector("#hour_select"),
                minute_select : self.dialog.widget.querySelector("#minute_select"),
                init: function(){
                    hour_select.addEventListener("change", this, false);
                    this.drawHour();
                },
                handleEvent: function(evt){
                    this.drawMinute(evt.target.value);
                },
                drawHour: function(){
                    var frag_hour = "", start_H = (today._today)?today.H:0;
                    for(var hour= start_H,str; hour<24;hour++){
                        hour = ("0"+hour).slice(-2);
                        frag_hour += '<option value="'+hour+'" '+((18==hour)?['selected="selected"', start_H = 18][0]:'')+'>'+hour+'</option>';
                    }
                    this.hour_select.innerHTML = frag_hour;
                    this.drawMinute(start_H);
                },
                drawMinute: function(H){
                    var frag_minute = "";
                    for(var minute=(today._today && today.H == H)?today.M:0; minute<60;minute++){
                        minute = ("0"+minute).slice(-2);
                        frag_minute += '<option value="'+minute+'">'+minute+'</option>';
                    }
                    this.minute_select.innerHTML = frag_minute;
                }
            }
            self.timeObj.init();
            return self;
        },
        open: function(){
            this.dialog.open();
            return this;
        }, 
        close: function(){
            this.dialog.destroy();
            return this;
        }
    }


    return cd;
})(window, document, dialog, myCalendar);