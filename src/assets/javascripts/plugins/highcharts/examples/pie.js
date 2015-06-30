$(function () {

    var colors = Highcharts.getOptions().colors,
        categories = ['1', '2', '3', '4', '5'],
        data = [{
            color: colors[0],
            drilldown: {
                categories: ['2小时内：5.88%'],
                data: [10]
            }
        }, {
            color: colors[1],
            drilldown: {
                categories: ['3小时内：11.76%'],
                data: [15]
            }
        }, {
            color: colors[2],
            drilldown: {
                categories: ['4小时内：58.82%'],
                data: [10]
            }
        }, {
            color: colors[3],
            drilldown: {
                categories: ['5小时内：17.64%'],
                data: [6]
            }
        }, {
            color: colors[4],
            drilldown: {
                //name: 'Opera versions',
                categories: ['6小时内：5.88%'],
                data: [7]
            }
        }];


    // Build the data arrays
    var browserData = [];
    var versionsData = [];
    for (var i = 0; i < data.length; i++) {

        // add browser data
        browserData.push({
            name: categories[i],
            y: data[i].y,
            color: data[i].color
        });

        // add version data
        for (var j = 0; j < data[i].drilldown.data.length; j++) {
            var brightness = 0.2 - (j / data[i].drilldown.data.length) / 5 ;
            versionsData.push({
                name: data[i].drilldown.categories[j],
                y: data[i].drilldown.data[j],
                color: Highcharts.Color(data[i].color).brighten(brightness).get()
            });
        }
    }

    // Create the chart
    $('#containerP').highcharts({
        chart: {
            width:300,
            type: 'pie'
        },
        credits:{
            enabled:false
        },
        title: {
            text: 'G104东泾线任务完成效率统计图'
        },
        subtitle: {
            text: '完成任务时间占总任务的百分比'
        },
        yAxis: {
            title: {
                text: ''
            }
        },
        plotOptions: {
            pie: {
                shadow: false,
                center: ['50%', '50%']
            }
        },
        tooltip: {
            valueSuffix: ''
        },
        series: [{
            //name: 'Browsers',
            //data: browserData,
            size: '60%',
            dataLabels: {
                formatter: function() {
                    return this.y > 5 ? this.point.name : null;
                },
                color: 'white',
                distance: -30
            }
        }, {
            name: '案件数量',
            data: versionsData,
            size: '30%',
            innerSize: '60%',
            dataLabels: {
                formatter: function() {
                    // display only if larger than 1
                    return this.y > 1 ? '<b>'+ this.point.name +'</b> ' : null;
                }
            }
        }]
    });
});
