<template>
  <div class="container">

    <Head :is-index="true" :is-show="true" :title="title" />
    <ImgOccur :imgTitle="imgTitle" />
    <ProcessArrow :processList="processList" :processData="processData" :isHomeData="true"/>

    <div class="stage">
      <div class="stage_one">SO1销售阶段</div>
      <div class="stage_two">SO2生产阶段——(排产款确认至装车发运)</div>
      <div class="stage_three">SO3安装阶段</div>
    </div>
    <div class="echart_container">

      <!-- 第一行图表 -->
      <div class="line lineOne">
        <div class="echart_item ecahrtFlag" v-for="item in idList" :key="item" :id="item"  @click="clickChart(item)"/>
      </div>
      <ChartsOfLineTwo :options="options" />
      <ChartsOfLineThree :options="options" />
      <ChartsOfLineFour :options="options" />
      <ChartsOfLineFive :options="options" />

    </div>
  </div>
</template>

<script>
  import { myApp } from "@/api/app";
  import common from '@/js/common'
  import { allAPI } from "@/api/apiValue";
  import * as echarts from 'echarts'
  import config from '@/api/config'
  import Head from '@/components/Head'
  import ImgOccur from '@/components/ImgOccur'
  import ProcessArrow from "@/components/ProcessArrow.vue";
  import ChartsOfLineTwo from "./ChartsOfLineTwo.vue";
  import ChartsOfLineThree from "./ChartsOfLineThree.vue";
  import ChartsOfLineFour from "./ChartsOfLineFour.vue";
  import ChartsOfLineFive from "./ChartsOfLineFive.vue";
  import moment from 'moment'
  export default {
    name: 'Board',
    components: {
    Head, ImgOccur, ProcessArrow, ChartsOfLineTwo, ChartsOfLineThree, ChartsOfLineFour, ChartsOfLineFive
  },

    data() {
      const endTime = moment().format('YYYY-MM')
      const beginTime = moment().subtract(5, 'months').format('YYYY-MM')
      return {
        processList: {
          add: {
            label: '新增',
            color: 'rgb(0,255,255)',
            flag: '+',
            prop: 'add'
          },
          update: {
            label: '更新',
            color: 'rgb(0,176,240)',
            flag: '↑',
            prop: 'update'
          },
          going: {
            label: '进行',
            color: 'rgb(255,192,0)',
            flag: '△',
            prop: 'going'
          },
          finish: {
            label: '完成',
            color: 'rgb(0,255,0)',
            flag: '√',
            prop: 'finish'
          },
          abnormal: {
            label: '滞留/异常',
            flag: 'II',
            color: 'red',
            prop: 'abnormal'
          }
        },
        processData: {
          htsp: {
            label: '合同审批',
            add: '',  //新增
            update: '',  //更新
            going: 32,  //进行
            finish: 26, //完成
            abnormal: 6,  //滞留/异常
            expected: 33  //预计
          },
          bgsp: {
            label: '变更审批',
            add: '',
            update: '',
            going: 9,
            finish: 12,
            abnormal: 7,
            expected: ''
          },
          ghsx: {
            label: '工号生效',
            add: 34,
            update: '',
            going: '',
            finish: '',
            abnormal: '',
            expected: ''
          },
          pcsq: {
            label: '排产申请',
            add: '',
            update: '',
            going: 18,
            finish: 22,
            abnormal: 3,
            expected: ''
          },
          htgc: {
            label: '合同工程',
            add: '',
            update: '',
            going: 23,
            finish: 56,
            abnormal: 34,
            expected: ''
          },
          ztjh: {
            label: '整梯计划',
            add: '',
            update: '',
            going: 16,
            finish: 45,
            abnormal: 26,
            expected: ''
          },
          xtjh: {
            label: '箱头计划',
            add: '',
            update: '',
            going: 45,
            finish: 36,
            abnormal: 0,
            expected: ''
          },
          ddjh: {
            label: '订单计划',
            add: '',
            update: '',
            going: 37,
            finish: 65,
            abnormal: 0,
            expected: ''
          },
          gdjh: {
            label: '工单计划',
            add: '',
            update: '',
            going: 24,
            finish: 78,
            abnormal: 0,
            expected: ''
          },
          lljs: {
            label: '来料接收',
            add: '',
            update: '',
            going: 1324,
            finish: 2564,
            abnormal: 203,
            expected: ''
          },
          gdwg: {
            label: '工单完工',
            add: '',
            update: '',
            going: 1488,
            finish: 1874,
            abnormal: 130,
            expected: ''
          },
          zxwg: {
            label: '装箱完工',
            add: '',
            update: '',
            going: 610,
            finish: 853,
            abnormal: 6,
            expected: ''
          },
          ghqt: {
            label: '工号齐套',
            add: '',
            update: '',
            going: 40,
            finish: 23,
            abnormal: 4,
            expected: ''
          },
          zcfy: {
            label: '装车发运',
            add: '',
            update: '',
            going: 50,
            finish: 21,
            abnormal: 3,
            expected: ''
          },
          azjc: {
            label: '安装进场',
            add: '',
            update: '',
            going: 30,
            finish: 80,
            abnormal: 23,
            expected: ''
          },
          azyj: {
            label: '安装移交',
            add: 67,
            update: '',
            going: '',
            finish: '',
            abnormal: '',
            expected: 22
          }
        },
        title: config.title,
        idList: [
          'qyts',     // 签约台量分布
          'ghsx',     // 生效台量
          'htgcbg',  // 合同工程变更分布
          'ghqt',     // 工号齐套率
          'lljs',     // 来料接收PPM
          'azht',     // 安装合同分布
        ],
        changeGrid: { left: config.left },
        echartSize: {  //图表自适应,初始化的时候自动插入

        },
        chartsOption: {},
        mounted: false,
        param: { beginTime, endTime }
      }
    },
    computed: {
      options() {
        return {
          parentMounted: this.mounted,
          echartSize: this.echartSize,
          myApp,
          allAPI,
          common,
          config,
          param: this.param
        }
      },
      imgTitle() {
        return Object.keys(this.processData)
      }
    },
    mounted() {
      const _this = this;
      const echartList = document.getElementsByClassName('ecahrtFlag')
      for (let i = 0; i < echartList.length - 1; i++) {
        const item = echartList[i];
        this.echartSize[item.id] = null;
      }
      window.onresize = function () {
        _this.ecartResize()
      }
      this.initData();//所有请求初始化

      this.mounted = true
    },
    async created() {
      const imageKeysArray = Object.keys(this.processData)
      let keysArray = [
        'ContractApprove',
        'ChangeApprove',
        'JobNumberEffective',
        'SchedulingApplication',
        'ContractEngineering',
        'WholeElevatorPlan',
        'BoxPlans',
        'OrderPlans',
        'WorkOrderPlans',
        'ReceivingMaterials',
        'WorkOrderCompletion',
        'BoxPackCompletion',
        'JobNumberCompletion',
        'LoadingShipping',
        'InstallationMobilization',
        'InstallationHandover'
      ], postArray = []
      for (let i of keysArray) {
        postArray.push(myApp.post(`/api/orderFlow/get${i}.json`, {}))
      }
      await Promise.all(postArray).then((res) => {
        res.forEach((i, index) => {
          if(i.status === 1 && i.data) {
            const data = i.data
            this.processData[imageKeysArray[index]] = {
              ...this.processData[imageKeysArray[index]],
              going: data.iQty ?? '',
              abnormal: data.eQty ?? '',
              finish: data.sQty ?? '',
              add: data.everyDayCount ?? '',
              update: data.cnt ?? ''
            }
          }
        })
      })
    },
    methods: {
      // 点击图表跳转详情
      clickChart(id, chartOption) {
        const option = chartOption ? chartOption : this.chartsOption[id]
        myApp.setData('chartOption', option)
        const routeData = this.$router.resolve({
          path: '/chartDetail',
          query: { id }
        })
        window.open(routeData.href, '_blank')
      },

      // 所有请求初始化
      initData() {
        this.QUERY_QYTL(); //签约台量分布  图1
        this.WERP_PERFORMANCES_S(); //生效台量  图2
        this.QUERY_HTGCBG(); //合同工程变更分布 图3
        this.QUERY_GHQT(); //工号齐套率 图4
        this.QUERY_LLJS(); //来料接收PPM 图5
        this.QUERY_AZHT(); //安装合同分布 图6
      },
      // echart报表自适应
      ecartResize() {
        const _this = this
        for (const key in this.echartSize) {
          if (this.echartSize[key]) {
            this.echartSize[key].resize()
          }
        }
      },

      // 签约台量分布
      QUERY_QYTL() {
        const id = 'qyts'
        var myChart = common.singleBar(id, this.echartSize[id]);
        myChart.showLoading(myApp.showEchartLoading());
        myApp.post(allAPI.QUERY_QYTL, this.param).then((res) => {
          myChart.hideLoading();
          let xData = [];
          let seriesData = [];

          if (res.status === 1 && res.data) {
            const data = res.data;
            xData = data.month
            seriesData = data.qty
          }

          const option = common.commonOption('bar', xData, seriesData, '签约\n\n台量\n\n分布', config.blue, true)
          myChart.setOption(option)
          this.echartSize[id] = myChart
          this.chartsOption[id] = option
        })
      },
      // 生效台量
      WERP_PERFORMANCES_S() {
        const id = 'ghsx'
        var myChart = common.singleBar(id, this.echartSize[id]);
        myChart.showLoading(myApp.showEchartLoading());
        myApp.post(allAPI.ORDER_PERFORMANCES_S, this.param).then((res) => {
          myChart.hideLoading();
          let xData = [];
          let seriesData = [];
          if (res.status === 1 && res.data) {
            const data = res.data;
            xData = data.month
            seriesData = data.qty
          }
          const option = common.commonOption('bar', xData, seriesData, '生效\n\n台量', config.blue, true)
          myChart.setOption(option)
          this.echartSize[id] = myChart
          this.chartsOption[id] = option
        })
      },
      // 合同工程变更分布
      QUERY_HTGCBG() {
        const id = 'htgcbg'
        const lineColor = config.htgcbgColor;
        var myChart = common.singleBar(id, this.echartSize[id]);
        myChart.showLoading(myApp.showEchartLoading());
        myApp.post(allAPI.QUERY_HTGCBG, this.param).then((res) => {
          myChart.hideLoading();
          let xData = [];
          let seriesData = [];
          let seriesArray = []
          if (res.status == 1 && res.data) {
            let data = res.data;
            xData = data.month;
            const ratio = data.ratio.map(i => i.replace('%', ''))
            seriesArray = [data.selas, data.backend, data.design, ratio]
          }
          const legend = ['销售变更', '合同工程变更', '研发变更', '订单变更率']
          const yAxis = [{
            ...config.baseYAxis,
            minInterval:100,
            axisLabel: {
              color:config.xFont,
              formatter: '{value}',
            }
          },
          {
            ...config.baseYAxis,
            minInterval:10,
            axisLabel: {
              color:config.xFont,
              formatter: '{value}%'
            }
          }];
          for (let index = 0; index < 4; index++) {
            if (index <= 2) {
              seriesData.push({
                name: legend[index],
                symbol: 'none',
                type: 'line',
                stack: 'Total',
                areaStyle: {
                  color: lineColor[index]
                },
                lineStyle: {
                  width: 1
                },
                data: seriesArray[index]
              })
            }
          }
          const option = {
            color: lineColor,
            title: {
              text: '合同\n\n工程\n\n变更\n\n分布',
              top: 'center',
              textStyle: { color: config.fontGray, fontSize: config.titleSize },
            },
            legend: {
              ...config.legend,
              data: [
                {
                  name: '订单变更率',
                },
                {
                  name: '其他变更',
                  icon: 'rect',
                },
                {
                  name: '销售变更',
                  icon: 'rect',
                },
                {
                  name: '合同工程变更',
                  icon: 'rect',
                },
                {
                  name: '研发变更',
                  icon: 'rect',
                }
              ]
            },
            grid: { ...config.grid, left: config.left },
            dataZoom: [ { type: 'inside' } ],
            tooltip: {},
            xAxis: {...config.baseXAxis, data: xData},
            yAxis: yAxis,
            series: [{
              name: '订单变更率',
              type: 'line',
              yAxisIndex: seriesData.length > 0 ? 1 : 0, //表示第二条Y轴
              color: lineColor[3],
              symbol: 'circle',
              symbolSize: config.symbolSize,
              lineStyle: {
                width: config.lineSize,
                color: lineColor[3]
              },
              markPoint: {
                itemStyle: {
                  color: lineColor[3]
                }
              },
              data: seriesArray[3],
            }].concat(seriesData)
          }
          myChart.setOption(option);
          this.echartSize[id] = myChart;
          this.chartsOption[id] = option
        })

      },
      // 工号齐套率
      QUERY_GHQT() {
        const id = 'ghqt'
        var myChart = common.singleBar(id, this.echartSize[id]);
        myChart.showLoading(myApp.showEchartLoading());
        const grid = {
          left: '10%'
        }
        myApp.post(allAPI.QUERY_GHQT, this.param).then((res) => {
          myChart.hideLoading();

          let xData = [];
          let seriesData = [];
          if (res.status === 1 && res.data) { 
              const data = res.data;
              xData = data.month;
              seriesData = data.rate; 
          }
          let yAxis = {
            ...config.baseYAxis,
            axisLabel: {
              formatter: '{value}%'
            }
          };
          const markLine = {
            symbol: 'none',
            data: [{
              name: '绿色标准值',
              yAxis: '98',
              label: { show: false },
              lineStyle: { color: config.fontGreen }
            }]
          }
          const option = common.commonOption('line', xData, seriesData, '工号\n\n齐套\n\n率', config.fontYellow, null, yAxis, null, grid, markLine)
          myChart.setOption(option)
          this.echartSize[id] = myChart
          this.chartsOption[id] = option
        })
      },
      // 来料接收PPM
      QUERY_LLJS() {
        const id = 'lljs'
        var myChart = common.singleBar(id, this.echartSize[id]);
        const grid = {
          left: config.left
        }
        myChart.showLoading(myApp.showEchartLoading());
        myApp.post(allAPI.QUERY_LLJS, this.param).then((res) => {
          myChart.hideLoading();
          let xData = [];
          let seriesData = [];
          if (res.status === 1 && res.data) {
            const data = res.data;
            xData = data.month;
            seriesData = data.poRcvPpm;
          }
          let yAxis = {
            ...config.baseYAxis,
            axisLabel: {
              formatter: '{value}'
            }
          };
          const markLine = {
            symbol: 'none',
            data: [{
              name: '绿色标准值',
              yAxis: '4500',
              label: { show: false },
              lineStyle: { color: config.redColor }
            }]
          }
          const option = common.commonOption('bar', xData, seriesData, '来料\n\n接收\n\nPPM\n', config.pink, false, yAxis, null, null, markLine)
          myChart.setOption(option)
          this.echartSize[id] = myChart
          this.chartsOption[id] = option
        })
      },
      // 安装合同分布
      QUERY_AZHT() {
        const id = 'azht'
        var myChart = common.singleBar(id, this.echartSize[id]);
        myChart.showLoading(myApp.showEchartLoading());
        myApp.post(allAPI.QUERY_AZHT, this.param).then((res) => {
          myChart.hideLoading();
          let xData = [], installationTL = [], notInstallationTL = []
          if (res.status === 1 && res.data) {
            const data = res.data;
            xData = data.month;
            installationTL = data.installationTL;
            notInstallationTL = data.notInstallationTL;
          }
          const option = {
              title: {
                  text: '安装\n\n合同\n\n分布\n',
                  top: 'center',
                  textStyle: { color: config.fontGray, fontSize: config.titleSize },
              },
              tooltip: {},
              grid: { ...config.grid, left: config.left },
              legend: config.legend,
              dataZoom: [{ type: 'inside' }],
              xAxis: {...config.baseXAxis, data: xData},
              yAxis: {
                  ...config.baseYAxis,
                  axisLabel: {
                    formatter: '{value}'
                  }
              },
              series: [
                  {
                      name: '有安装',
                      type: 'bar',
                      stack: 'total',
                      data: installationTL,
                      itemStyle: {
                          color: config.blue
                      }
                  },
                  {
                      barMaxWidth: config.barMaxWidth,
                      name: '无安装',
                      type: 'bar',
                      stack: 'total',
                      data: notInstallationTL,
                      itemStyle: {
                          color: config.lightBlue
                      }
                  },
              ]
          };
          myChart.setOption(option)
          this.echartSize[id] = myChart
          this.chartsOption[id] = option
        })
      },

    }
  }
</script>
<style scoped lang="scss">
  @import "src/style/variables";
  .container {
    background-color: $bgColor;
    padding: $containerD; 
    .echart_container {
      ::v-deep .line {
        width: 100%;
        display: flex;
        margin-bottom: 0.6vh;
        min-width: $containerMinW;
        &:last-child {
          margin-bottom: 0;
        }
        .echart_item {
          height: 13vh;
          min-height: 90px;
          width: 16%;
          margin-right: 0.8%;
          flex-shrink: 0; //父元素使用flex之后，子元素的固定宽度会被压缩，使用该项设置
          &:last-child {
            margin-right: 0;
          }
        }
      }

    }
  }
</style>