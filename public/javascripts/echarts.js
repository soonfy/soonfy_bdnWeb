$(function () {
  let img = document.getElementById('keyImg')
  let myChart = echarts.init(img);
  let id = $(img).data('id')
  let date = new Date(new Date().setDate(-15))
  let start = [date.getFullYear(), date.getMonth() + 1 < 10 ? '0' + date.getMonth() + 1 : date.getMonth() + 1, date.getDate() < 10 ? '0' + date.getDate() : date.getDate()].join('-')
  $.get('/key/count?id=' + id, function (chart) {
    console.log(chart);
    myChart.setOption(option = {
      title: {
        text: chart.title,
        textAlign: 'left'
      },
      tooltip: {
        trigger: 'axis',
        triggerOn: 'mousemove'
      },
      xAxis: {
        type: 'category',
        data: chart.data.map(function (item) {
          return item[0];
        })
      },
      yAxis: {
      },
      toolbox: {
        left: 'center',
        feature: {
          dataZoom: {
            yAxisIndex: 'none'
          },
          restore: {},
          saveAsImage: {}
        }
      },
      dataZoom: [
        {
          startValue: start
        }, {
          type: 'inside'
        }
      ],
      visualMap: {
        top: 10,
        right: 10,
        pieces: [{
          lte: 0,
          color: '#cc0033'
        }, {
            gt: 0,
            lte: 10,
            color: '#009966'
          }, {
            gt: 10,
            lte: 50,
            color: '#ffde33'
          }, {
            gt: 50,
            lte: 100,
            color: '#ff9933'
          }, {
            gt: 100,
            lte: 200,
            color: '#cc0033'
          }, {
            gt: 200,
            color: '#660099'
          }],
        outOfRange: {
          color: '#000000'
        }
      },
      series: {
        name: chart.title,
        type: 'line',
        data: chart.data.map(function (item) {
          return item[1];
        }),
        markLine: {
          silent: true,
          data: [{
            yAxis: 10
          }, {
              yAxis: 50
            }, {
              yAxis: 100
            }, {
              yAxis: 200
            }]
        }
      }
    }, true);
  });
})