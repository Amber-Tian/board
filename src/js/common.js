import * as echarts from 'echarts'
import { myApp } from '@/api/app'
import { allAPI } from '@/api/apiValue'
import config from '@/api/config';
import moment from 'moment/moment';
const commonJS = {
  // 简单图表初始化
  singleBar(id, myChart) {
    if (!myChart || myChart == '') {
      if (!document.getElementById(id) || document.getElementById(id) === null) {
        myApp.alert(id + '页面未渲染成功', 'error')
        return false
      }
      myChart = echarts.init(document.getElementById(id))
    }
    return myChart
  },
  /**
       * Option通用
       * type区分折线图还是柱状图
       * seriesLabel表示图形上的文本标签,true表示显示，false表示不显示
       * **/
  commonOption(type, xData, seriesData, title, barColor, seriesLabel, yAxis, legend, grid, markLine) {
    let lineColor = barColor ? barColor : config.defaultBgColor;
    const fontGray = config.xFont;
    let finalGrid = config.grid;
    if (yAxis) {
      finalGrid = {
        ...config.grid,
        left: config.left
      };
    }
    let xName = ''
    let series = []
    if (type == 'bar') {
      series = this.barSeries(seriesData, lineColor, seriesLabel, markLine);
    }
    else if (type == 'line') {
      series = this.lineSeries(seriesData, lineColor, seriesLabel, markLine);
    }
    else if (type == 'lineMultiple') {
      series = this.lineMulSeries(seriesData, lineColor, seriesLabel);
    }
    else if (type == 'stackBar') {
      series = seriesData;
    }
    return {
      color: lineColor,
      title: {
        text: title,
        top: 'center',
        textStyle: { color: config.fontGray, fontSize: config.titleSize },
      },
      legend: legend ? legend : config.legend,
      grid: grid ? { ...finalGrid, ...grid } : {
        ...finalGrid
      },
      dataZoom: [
        { type: 'inside' }
      ],
      tooltip: {},
      xAxis: {...config.baseXAxis, data: xData},
      yAxis: yAxis ? {...yAxis,axisLabel:{...yAxis.axisLabel, color:fontGray}} : {
        show: false,
        ...config.baseYAxis
      },
      series: series
    }
  },

  // 柱状图Series
  barSeries(seriesData, lineColor, seriesLabel, markLine) {
    const fontC = config.fontBlue;
    return [{
      type: 'bar',
      data: seriesData, 
      barMaxWidth: config.barMaxWidth,  //柱状图宽度
      label: {  //柱状图上方字体颜色
        show: seriesLabel,
        color: fontC,
        position: 'top'
      },
      itemStyle: {  //柱状图的柱子颜色  
        color: lineColor,
        // borderRadius: 4, //柱状图边框
        shadowBlur: 8,
        // shadowColor: '#08f3ca', //柱状图阴影颜色
        borderType: '',
        borderWidth: 0,  //柱状图边框宽度 
        borderColor: '#fcd811'
      },
      markLine: markLine ? markLine : null
    }]
  },

  // 单个折线图series
  lineSeries(seriesData, lineColor, seriesLabel, markLine) {
    return [{
      data: seriesData,
      type: 'line',
      symbolSize: config.symbolSize,
      symbol: 'circle',
      itemStyle: {
        color: lineColor
      },
      splitLine: {
        show: false
      },
      lineStyle: {
        width: config.lineSize,
        color: lineColor,
        // shadowColor: 'rgba(127,240,141,1)',
        // shadowBlur: 10
      },
      markPoint: {
        itemStyle: {
          color: 'red'
        }
      }, markLine: markLine ? markLine : null
    }]
  },

}
export default commonJS
