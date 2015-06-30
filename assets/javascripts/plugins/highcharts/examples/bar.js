/**
 * Created by tea on 2015/1/23.
 */
$(function () {
    Highcharts.setOptions({
        colors: ['#F6BD0F','#AFD8F8','#8BBA00','#FF8E46','#008E8E']
    });
    $('#containerB').highcharts({
        chart: {
            width:320,
            type: 'column'
        },
        credits:{
            enabled:false
        },
        title: {
            text: 'G104东泾线任务统计'
        },
        subtitle: {
            text: '2015-1-23'
        },
        xAxis: {
            categories:  ['数字城管', '垃圾清理', '护栏整修', '路面整修', '其他任务']
        },
        yAxis: {
            min: 0,
            tickInterval:1,
            title: {
                text: ''
            }
        },
        tooltip: {
            headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
            pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
            '<td style="padding:0"><b>{point.y:1f}</b></td></tr>',
            footerFormat: '</table>',
            shared: true,
            useHTML: true
        },
        plotOptions: {
            column: {
                pointPadding: 0.2,
                borderWidth: 0
            }
        },
        series: [{
                //name: '1号线',
                //data: [4, 2, 1, 3, 0]
            //
            //}, {
            //    name: '2号线',
            //    data: [5, 4, 7, 1, 0]
            //
            //}, {
            //    name: '3号线',
            //     data: [1, 1, 1, 1, 1]
            //
            //}, {
            //    name: '4号线',
            //     data: [4, 3, 5, 0, 6]
            //
            //}, {
            name: '5号线',
            data: [ {'color':'#F6BD0F','y':1},
                    {'color':'#AFD8F8','y':2},
                    {'color':'#8BBA00','y':10},
                    {'color':'#FF8E46','y':3},
                    {'color':'#008E8E','y':1}]

        }]
    });
});
