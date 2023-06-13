import moment from 'moment/moment';
const config = { 
  server: 'http://10.18.211.204:', // 服务器
  // server: 'http://10.136.36.57:', // 本地 
  port:'8082',  //请求后台的端口  
   
  title:'电梯业务全价值流管理',
  Statustitle:'设备交付状态查询',  //设备交付状态查询页面
  productionStatusTitle:'设备生产状态查询',  //设备生产状态查询页面
  brown:'rgb(116, 76, 22)',
  blue:'rgb(51,102,255)',
  blueGray: 'rgb(47,85,151)', //蓝灰色
  lightYellow: 'rgb(255,217,102)', //浅黄色
  darkYellow: 'rgb(197, 90, 17)', //深黄色
  gray: 'rgb(165, 165, 165)', //灰色
  lightGreen: 'rgb(112, 173, 71)', //浅绿色
  lightBrown: 'rgb(153, 115, 0)', //浅棕色
  xFont:'rgb(46,117,182)',
  fontBlue:'rgb(0,176,240)', //柱子上方字体颜色
  fontGray:'rgb(231,230,230,0.7)', //X轴字体颜色
  fontYellow:'rgb(255,192,0)',  //黄色
  fontGreen:'rgb(0,255,0)',  //绿色
  pink:'rgb(248,144,191)',  //粉色
  lightPink: 'rgb(255, 204, 255)', //浅粉色
  redColor:'rgb(255,0,0)',  //红色
  lightBlue:'rgb(0,255,255)',  //淡蓝色
  left:'14%', //当标题内容过多时，Y轴距离左边的距离
  barMaxWidth:15,  //柱状图宽度
  symbolSize:6,  //折线图拐点的大小设置
  lineSize:2,  //折线图的线条宽度
  titleSize:'.6rem',  //标题字体大小
  htgcbgColor:['rgb(68,114,196)','rgb(165,165,165)','rgb(91,155,213)','rgb(255,192,0)'],  //合同工程变更分布各折线图颜色
  jhycBarColor: ['rgb(251, 193, 219)', 'rgb(248, 144, 191)', 'rgb(245, 93, 162)', 'rgb(186, 97, 36)'], //计划异常柱状图颜色
  htgcclBarColor: ['rgb(91, 155, 213)', 'rgb(165, 165, 165)', 'rgb(68, 114, 196)', 'rgb(37, 94, 145)', 'rgb(99, 99, 99)', 'rgb(38, 68, 120)'], //合同工程处理柱状图颜色
  defaultBgColor:'rgb(6,248,183)',  //当出现没有传颜色的值时，柱状图或者折线图的线条或者柱状图背景颜色
  grid: {
    top: '16%',
    right: '2%',
    left: '1%',
    bottom: '3%',
    containLabel: true
  },
  // 图表详情页使用
  legend: {
    show: false,
    left: '8%',
    top: '70%',
    orient: 'vertical',
    itemHeight: 18,
    itemWidth: 60,
    textStyle: { color: '#fff', padding: [0, 0, 0, 20] }
  },
  baseXAxis: {
    type: 'category',
    axisTick: { show: false },
    axisLine: { lineStyle: { color: 'rgb(46,117,182)' } },
    axisLabel: {
      color: 'rgb(46,117,182)',
      formatter: function (value) {
        return moment(value).format('M') + '月'
      }
    },
    data: ['10', '11', '12', '1', '2', '3']
  },
  baseYAxis: {
    axisTick: { show: false, inside: true },
    axisLine: { show: false, lineStyle: { color: 'rgb(46,117,182)' } },
    splitLine: { show: false }
  },
  chartDetailFirstLoadDataNum: 3000, // 图表详情页首次加载数据量
}

export default config
