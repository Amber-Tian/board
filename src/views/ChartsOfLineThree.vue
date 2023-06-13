<template>
    <!-- 第三行图表 -->
    <div class="line">
        <div class="echart_item ecahrtFlag" v-for="item in idList" :id="item" :key="item" @click="clickChart(item)" />
    </div>
</template>
  
<script>
export default {
    name: 'ChartsOfLineThree',
    props: ['options'],
    data() {
        return {
            idList: [
                "htbgqs",  // 合同变更趋势
                "pclcqs",  // 排产流程趋势
                "jhyc",    // 计划异常
                "ctzsl",   // 出梯准时率
                "zxychg",  // 装箱一次合格
                "azzq"     // 安装周期
            ],
            chartsOption: {}
        }
    },
    watch: {
        'options.parentMounted'(val) {
            if (val) {
                this.CONTRACT_CHANGE_TRENDS()
                this.PRODUCTION_TRENDS()
                this.PLAN_EXCEPTION()
                this.ELEVATOR_ONTIME_RATE()
                this.QUALIFIED_PACKING_ONCE()
                this.INSTALLATION_PERIOD()
            }
        }
    },
    methods: {
        clickChart(id){
            this.$parent.clickChart(id, this.chartsOption[id])
        },
        // 合同变更趋势
        CONTRACT_CHANGE_TRENDS() {
            const id = 'htbgqs'
            const { common, echartSize, myApp, allAPI, config, param } = this.options
            var myChart = common.singleBar(id, echartSize[id]);
            myChart.showLoading(myApp.showEchartLoading());
            myApp.post(allAPI.QUERY_HTBGQS, param).then((res) => {
                myChart.hideLoading();
                let xData = [];
                let sumTimeList = [];
                let contractChangeBusiness = []
                let contractChangeProduct = []
                let contractChangeCancelDevice = []
                if (res.status === 1 && res.data) {
                    const data = res.data;
                    xData = data.month;
                    contractChangeBusiness = data.business
                    contractChangeProduct = data.product
                    contractChangeCancelDevice = data.cancelDevice
                    data.sumTime.forEach((i, index) => {
                        const totalContract = data.business[index]+data.product[index]+data.cancelDevice[index]
                        sumTimeList.push(Math.round(i/60/totalContract*100)/100)
                    })
                }
                const option = {
                    title: {
                        text: '合同\n\n变更\n\n趋势',
                        top: 'center',
                        textStyle: { color: config.fontGray, fontSize: config.titleSize },
                    },
                    tooltip: {},
                    grid: {
                        ...config.grid,
                        left: config.left
                    },
                    dataZoom: [
                        { type: 'inside' }
                    ],
                    legend: config.legend,
                    xAxis: {...config.baseXAxis, data: xData},
                    yAxis: [
                        { ...config.baseYAxis },
                        { ...config.baseYAxis },
                    ],
                    series: [
                        {
                            name: '商务变更',
                            type: 'bar',
                            data: contractChangeBusiness,
                            itemStyle: {
                                color: config.lightYellow
                            }
                        },
                        {
                            name: '产品变更',
                            type: 'bar',
                            data: contractChangeProduct,
                            itemStyle: {
                                color: config.blueGray
                            }
                        },
                        {
                            barGap: '0',
                            name: '取消设备',
                            type: 'bar',
                            data: contractChangeCancelDevice,
                            itemStyle: {
                                color: config.lightBlue
                            }
                        },
                        {
                            name: '审批时长',
                            type: 'line',
                            data: sumTimeList,
                            yAxisIndex: 1,
                            symbolSize: config.symbolSize,
                            symbol: 'circle',
                            itemStyle: {
                                color: config.darkYellow
                            }
                        }
                    ]
                };

                myChart.setOption(option)
                echartSize[id] = myChart
                this.chartsOption[id] = option
            })
        },
        // 排产流程趋势
        PRODUCTION_TRENDS() {
            const id = 'pclcqs'
            const { common, echartSize, myApp, allAPI, config } = this.options
            var myChart = this.options.common.singleBar(id, this.options.echartSize[id]);
            myChart.showLoading(this.options.myApp.showEchartLoading());
            const grid = {
                ...config.grid,
                left: config.left
            }
            // myApp.post(allAPI.QUERY_GHQT, {}).then((res) => {
            myChart.hideLoading();

            let xData = [];
            let seriesData = [];
            // if (res.status === 1 && res.data) { 
            //     const data = res.data;
            //     xData = data.time;
            //     seriesData = data.value; 
            // }
            let yAxis = {...config.baseYAxis};
            xData = [10, 11, 12, 1, 2, 3]
            seriesData = [327, 342, 245, 233, 287, 254];
            const option = common.commonOption('line', xData, seriesData, '排产\n\n流程\n\n趋势', config.fontYellow, null, yAxis, null, grid)
            myChart.setOption(option)
            this.options.echartSize[id] = myChart
            this.chartsOption[id] = option
        },
        // 计划异常
        PLAN_EXCEPTION() {
            const id = 'jhyc'
            const { common, echartSize, myApp, allAPI, config, param } = this.options
            var myChart = common.singleBar(id, echartSize[id]);
            myChart.showLoading(myApp.showEchartLoading());
            myApp.post(allAPI.QUERY_JHYC, param).then((res) => {
                myChart.hideLoading();
                let xData = [], dataWhole = [], dataBox = [], dataOrder = [], dataWorkOrder = [];
                if (res.status === 1 && res.data) {
                    const data = res.data;
                    xData = data.month;
                    dataWhole = data.whole;
                    dataBox = data.box;
                    dataOrder = data.order;
                    dataWorkOrder = data.workOrder
                }
                const option = {
                    title: {
                        text: '计划\n\n异常',
                        top: 'center',
                        textStyle: { color: config.fontGray, fontSize: config.titleSize },
                    },
                    tooltip: {},
                    grid: {
                        ...config.grid,
                        left: config.left
                    },
                    dataZoom: [
                        { type: 'inside' }
                    ],
                    legend: config.legend,
                    xAxis: {...config.baseXAxis, data: xData},
                    yAxis: {...config.baseYAxis},
                    series: [
                        {
                            name: '整梯计划异常',
                            stack: 'total',
                            type: 'bar',
                            data: dataWhole,
                            itemStyle: {
                                color: config.jhycBarColor[3]
                            }
                        },
                        {
                            name: '箱子头计划异常',
                            stack: 'total',
                            type: 'bar',
                            data: dataBox,
                            itemStyle: {
                                color: config.jhycBarColor[2]
                            }
                        },
                        {
                            name: '订单计划异常',
                            stack: 'total',
                            type: 'bar',
                            data: dataOrder,
                            itemStyle: {
                                color: config.jhycBarColor[1]
                            }
                        },
                        {
                            barMaxWidth: config.barMaxWidth,
                            name: '工单计划异常',
                            stack: 'total',
                            type: 'bar',
                            data: dataWorkOrder,
                            itemStyle: {
                                color: config.jhycBarColor[0]
                            }
                        },
                    ]
                };
                myChart.setOption(option)
                echartSize[id] = myChart
                this.chartsOption[id] = option
            })
        },
        // 出梯准时率
        ELEVATOR_ONTIME_RATE() {
            const id = 'ctzsl'
            const { common, echartSize, myApp, allAPI, config, param } = this.options
            var myChart = common.singleBar(id, echartSize[id]);
            myChart.showLoading(myApp.showEchartLoading());
            const grid = {
                ...config.grid,
                left: config.left
            }
            myApp.post(allAPI.QUERY_CTZSL, param).then((res) => {
                myChart.hideLoading();
                let xData = [];
                let seriesData = [];
                if (res.status === 1 && res.data) { 
                    const data = res.data;
                    xData = data.month
                    seriesData = data.rate
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
                        name: '目标',
                        yAxis: '98',
                        label: { show: false },
                        lineStyle: { color: config.fontGreen }
                    }]
                }
                const option = common.commonOption('line', xData, seriesData, '出梯\n\n准时\n\n率', config.darkYellow, null, yAxis, null, grid, markLine)
                myChart.setOption(option)
                echartSize[id] = myChart
                this.chartsOption[id] = option
            })
        },
        // 装箱一次合格
        QUALIFIED_PACKING_ONCE() {
            const id = 'zxychg'
            const { config, common, echartSize, myApp, param, allAPI } = this.options
            var myChart = common.singleBar(id, echartSize[id]);
            const grid = {
                ...config.grid,
                left: config.left
            }
            myChart.showLoading(myApp.showEchartLoading());
            myApp.post(allAPI.QUERY_ZXYCHG, param).then((res) => {
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
                        formatter: '{value} %',
                    },
                };
                const markLine = {
                    symbol: 'none',
                    data: [{
                        name: '绿色标准值',
                        yAxis: 98,
                        label: { show: false },
                        lineStyle: { color: config.fontGreen }
                    }]
                }
                const option = common.commonOption('bar', xData, seriesData, '装箱\n\n一次\n\n合格', config.blue, false, yAxis, null, null, markLine)
                myChart.setOption(option)
                echartSize[id] = myChart
                this.chartsOption[id] = option
            })
        },
        // 安装周期
        INSTALLATION_PERIOD() {
            const id = 'azzq'
            const { common, echartSize, myApp, allAPI, config, param } = this.options
            var myChart = common.singleBar(id, echartSize[id]);
            myChart.showLoading(myApp.showEchartLoading());
            myApp.post(allAPI.QUERY_AZZQ, param).then((res) => {
                myChart.hideLoading();
                let xData = [], self = [], subPackage = []
                if (res.status === 1 && res.data) {
                    const data = res.data;
                    xData = data.month;
                    self = data.self;
                    subPackage = data.subPackage
                }
                const option = {
                    title: {
                        text: '安装\n\n周期',
                        top: 'center',
                        textStyle: { color: config.fontGray, fontSize: config.titleSize },
                    },
                    grid: {
                        ...config.grid,
                        left: config.left
                    },
                    dataZoom: [
                        { type: 'inside' }
                    ],
                    tooltip: {},
                    legend: config.legend,
                    xAxis: {...config.baseXAxis, data: xData},
                    yAxis: {...config.baseYAxis},
                    series: [
                        {
                            data: self,
                            type: 'line',
                            name: '自安装周期',
                            symbolSize: config.symbolSize,
                            symbol: 'circle',
                            itemStyle: {
                                color: config.blue
                            },
                            splitLine: {
                                show: false
                            },
                            lineStyle: {
                                width: config.lineSize,
                                color: config.blue,
                            },
                            markPoint: {
                                itemStyle: {
                                    color: 'red'
                                }
                            },
                        },
                        {
                            data: subPackage,
                            type: 'line',
                            name: '分包安装周期',
                            symbolSize: config.symbolSize,
                            symbol: 'circle',
                            itemStyle: {
                                color: config.lightBlue
                            },
                            splitLine: {
                                show: false
                            },
                            lineStyle: {
                                width: config.lineSize,
                                color: config.lightBlue,
                            },
                            markPoint: {
                                itemStyle: {
                                    color: 'red'
                                }
                            },
                        }
                    ]
                }
                myChart.setOption(option)
                echartSize[id] = myChart
                this.chartsOption[id] = option
            })
        }
    }
}
</script>