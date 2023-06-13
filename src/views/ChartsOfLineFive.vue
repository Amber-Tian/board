<template>
    <!-- 第五行图表 -->
    <div class="line">
        <div class="echart_item ecahrtFlag" v-for="item in idList" :id="item" :key="item" @click="clickChart(item)" />
    </div>
</template>
  
<script>
export default {
    name: 'ChartsOfLineFive',
    props: ['options'],
    data() {
        return {
            idList: [
                "cpfbqs",    // 产品非标趋势
                "jhgycgsx",  // 计划工艺采购时效
                "gdzjl",     // 工单准交率
                "ctzq",      // 出梯周期
                "kcdz",      // 库存呆滞
                "cjhgl"      // 厂检合格率
            ],
            chartsOption: {}
        }
    },
    watch: {
        'options.parentMounted'(val) {
            if (val) {
                this.PRODUCT_NONSTANDARD_TRENDS()
                this.PLANNED_PROCESS_PROCUREMENT_TIMELINESS()
                this.WORK_ORDER_DELIVERY_RATE()
                this.EXIT_CYCLE()
                this.INVENTORY_STAGNATION()
                this.FACTORY_INSPECTION_QUALIFICATION_RATE()
            }
        }
    },
    methods: {
        clickChart(id){
            this.$parent.clickChart(id, this.chartsOption[id])
        },
        // 产品非标趋势
        PRODUCT_NONSTANDARD_TRENDS() {
            const id = 'cpfbqs'
            const { common, echartSize, myApp, allAPI, config, param } = this.options
            var myChart = common.singleBar(id, echartSize[id]);
            myChart.showLoading(myApp.showEchartLoading());
            myApp.post(allAPI.QUERY_CPFBQS, param).then((res) => {
                myChart.hideLoading();
                let xData = [];
                let seriesData1 = [];
                let seriesData2 = []
                if (res.status === 1 && res.data) {
                    const data = res.data;
                    xData = data.month;
                    seriesData1 = data.nonStandard;
                    seriesData2 = data.ratio
                }
                const option = {
                    title: {
                        text: '产品\n\n非标\n\n趋势',
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
                        {
                            ...config.baseYAxis,
                            axisLabel: {
                                formatter: '{value} %',
                            },
                        },
                    ],
                    series: [
                        {
                            barMaxWidth: config.barMaxWidth,
                            name: '非标数',
                            type: 'bar',
                            data: seriesData1,
                            itemStyle: {
                                color: config.blue
                            }
                        },
                        {
                            name: '非标比',
                            type: 'line',
                            data: seriesData2,
                            yAxisIndex: 1,
                            itemStyle: {
                                color: config.fontYellow
                            },
                            symbolSize: config.symbolSize,
                            symbol: 'circle',
                        }
                    ]
                };

                myChart.setOption(option)
                echartSize[id] = myChart
                this.chartsOption[id] = option
            })
        },
        // 计划工艺采购时效
        PLANNED_PROCESS_PROCUREMENT_TIMELINESS() {
            const id = 'jhgycgsx'
            const { common, echartSize, myApp, allAPI, config, param } = this.options
            var myChart = common.singleBar(id, echartSize[id]);
            myChart.showLoading(myApp.showEchartLoading());
            myApp.post(allAPI.QUERY_JHGYCGSX, param).then((res) => {
                myChart.hideLoading();
                let xData = [], plan = [], technology = [], procurement = []
                if (res.status === 1 && res.data) {
                    if (res.status === 1 && res.data) {
                        const data = res.data;
                        xData = data.month;
                        ({ procurement, technology, plan } = data)
                    }
                }
                const option = {
                    title: {
                        text: '计划\n\n工艺\n\n采购\n\n时效\n\n工程',
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
                            name: '计划时效',
                            type: 'line',
                            symbol: 'none',
                            data: plan,
                            itemStyle: {
                                color: config.fontYellow
                            }
                        },
                        {
                            name: '工艺时效',
                            type: 'line',
                            symbol: 'none',
                            data: technology,
                            itemStyle: {
                                color: config.gray
                            }
                        },
                        {
                            name: '采购时效',
                            type: 'line',
                            symbol: 'none',
                            data: procurement,
                            itemStyle: {
                                color: config.blue
                            }
                        }
                    ]
                };
                myChart.setOption(option)
                echartSize[id] = myChart
                this.chartsOption[id] = option
            })
        },
        // 工单准交率
        WORK_ORDER_DELIVERY_RATE() {
            const id = 'gdzjl'
            const { common, echartSize, myApp, allAPI, config, param } = this.options
            var myChart = common.singleBar(id, echartSize[id]);
            myChart.showLoading(myApp.showEchartLoading());
            const grid = {
                ...config.grid,
                left: config.left
            }
            myApp.post(allAPI.QUERY_GDZJL, param).then((res) => {
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
                    },
                };
                const markLine = {
                    symbol: 'none',
                    data: [{
                        name: '目标',
                        yAxis: '95',
                        label: { show: false },
                        lineStyle: { color: config.fontGreen }
                    }]
                }
                const option = common.commonOption('line', xData, seriesData, '工单\n\n准交\n\n率', config.fontYellow, null, yAxis, null, grid, markLine)
                myChart.setOption(option)
                echartSize[id] = myChart
                this.chartsOption[id] = option
            })
        },
        // 出梯周期
        EXIT_CYCLE() {
            const id = 'ctzq'
            const { common, echartSize, myApp, allAPI, config, param } = this.options
            var myChart = common.singleBar(id, echartSize[id]);
            myChart.showLoading(myApp.showEchartLoading());
            myApp.post(allAPI.QUERY_CTZQ, param).then((res) => {
                myChart.hideLoading();
                let xData = [];
                let seriesData = [];
                if (res.status === 1 && res.data) {
                    const data = res.data;
                    xData = data.month;
                    seriesData = [data.elevator, data.escalator, data.freight];
                }
                const option = {
                    title: {
                        text: '出梯\n\n周期',
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
                            name: '客梯',
                            type: 'line',
                            symbol: 'none',
                            data: seriesData[0],
                            itemStyle: {
                                color: config.darkYellow
                            }
                        },
                        {
                            name: '货梯',
                            type: 'line',
                            symbol: 'none',
                            data: seriesData[2],
                            itemStyle: {
                                color: config.lightGreen
                            }
                        },
                        {
                            name: '扶梯',
                            type: 'line',
                            symbol: 'none',
                            data: seriesData[1],
                            itemStyle: {
                                color: config.lightBrown
                            }
                        }
                    ]
                };
                myChart.setOption(option)
                echartSize[id] = myChart
                this.chartsOption[id] = option
            })
        },
        // 库存呆滞
        INVENTORY_STAGNATION() {
            const id = 'kcdz'
            const { config, common, echartSize, myApp, allAPI, param } = this.options
            var myChart = common.singleBar(id, echartSize[id]);
            myChart.showLoading(myApp.showEchartLoading());
            myApp.post(allAPI.QUERY_KCDZ, param).then((res) => {
                myChart.hideLoading();
                let xData = [], stock = [], inv = []
                if (res.status === 1 && res.data) {
                    if (res.status === 1 && res.data) {
                        const data = res.data;
                        xData = data.month;
                        stock = data.stock;
                        inv = data.inv
                    }
                }
                const option = {
                    title: {
                        text: '库存\n\n呆滞',
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
                            name: '呆滞',
                            type: 'line',
                            data: inv,
                            symbolSize: config.symbolSize,
                            symbol: 'circle',
                            itemStyle: {
                                color: config.pink
                            }
                        },
                        {
                            name: '库存',
                            type: 'line',
                            data: stock,
                            symbolSize: config.symbolSize,
                            symbol: 'circle',
                            itemStyle: {
                                color: config.blue
                            },
                            markLine: {
                                symbol: 'none',
                                data: [{
                                    name: '目标',
                                    yAxis: 150,
                                    label: { show: false },
                                    lineStyle: { color: config.redColor }
                                }]
                            }
                        }
                    ]
                };
                myChart.setOption(option)
                echartSize[id] = myChart
                this.chartsOption[id] = option
            })
        },
        // 厂检合格率
        FACTORY_INSPECTION_QUALIFICATION_RATE() {
            const id = 'cjhgl'
            const { common, echartSize, myApp, allAPI, config, param } = this.options
            var myChart = common.singleBar(id, echartSize[id]);
            myChart.showLoading(myApp.showEchartLoading());
            myApp.post(allAPI.QUERY_CJHGL, param).then((res) => {
                myChart.hideLoading();
                let xData = [], surate = [], firstChecknum = [], firstCheckfailNum = [];
                if (res.status === 1 && res.data) {
                    const data = res.data;
                    xData = data.month;
                    firstCheckfailNum = data.firstCheckfailNum
                    firstChecknum = data.firstChecknum
                    surate = data.surate;
                }
                const option = {
                    title: {
                        text: '厂检\n\n合格\n\n率',
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
                    yAxis: [
                        {
                            ...config.baseYAxis,
                            axisLabel: {
                                formatter: '{value}%'
                            },
                        },
                        { ...config.baseYAxis },
                    ],
                    series: [
                        {
                            data: firstCheckfailNum,
                            type: 'bar',
                            name: '一次不合格台量',
                            yAxisIndex: 1,
                            stack: 'total',
                            itemStyle: {
                                color: config.blue
                            },
                        },
                        {
                            barMaxWidth: config.barMaxWidth,
                            data: firstChecknum,
                            type: 'bar',
                            name: '厂检台量',
                            yAxisIndex: 1,
                            stack: 'total',
                            itemStyle: {
                                color: config.lightPink
                            },
                        },
                        {
                            data: surate,
                            type: 'line',
                            name: '一次合格率',
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
                            markLine: {
                                symbol: 'none',
                                data: [{
                                    name: '绿色标准值',
                                    yAxis: 95,
                                    label: { show: false },
                                    lineStyle: { color: config.fontGreen }
                                }]
                            }
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