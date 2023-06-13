<template>
    <!-- 第四行图表 -->
    <div class="line">
        <div class="echart_item ecahrtFlag" v-for="item in idList" :id="item" :key="item" @click="clickChart(item)" />
    </div>
</template>
  
<script>
export default {
    name: 'ChartsOfLineFour',
    props: ['options'],
    data() {
        return {
            idList: [
                "tjfbqs",  // 土建非标趋势
                "htgccl",  // 合同工程处理
                "hhzjl",   // 回货准交率
                "ljfy",    // 累计发运
                "khtsbl",  // 客户投诉不良
                "azzjl"    // 安装准交率
            ],
            chartsOption: {}
        }
    },
    watch: {
        'options.parentMounted'(val) {
            if (val) {
                this.CIVIL_ENGINEERING_NONSTANDARD_TREND()
                this.CONTRACT_ENGINEERING_PROCESSING()
                this.RETURN_DELIVERY_RATE()
                this.ACCUMULATED_SHIPMENTS()
                this.CUSTOMER_COMPLAINTS_DEFECTS()
                this.INSTALLATION_ACCURACY_RATE()
            }
        }
    },
    methods: {
        clickChart(id){
            this.$parent.clickChart(id, this.chartsOption[id])
        },
        // 土建非标趋势
        CIVIL_ENGINEERING_NONSTANDARD_TREND() {
            const id = 'tjfbqs'
            const { common, echartSize, myApp, allAPI, config, param } = this.options
            var myChart = common.singleBar(id, echartSize[id]);
            myChart.showLoading(myApp.showEchartLoading());
            myApp.post(allAPI.QUERY_TJFBQS, param).then((res) => {
                myChart.hideLoading();
                let xData = [];
                let seriesData1 = [];
                let seriesData2 = [];
                if (res.status === 1 && res.data) {
                    const data = res.data;
                    xData = data.month;
                    seriesData1 = data.nonStandard;
                    seriesData2 = data.ratio
                }
                const option = {
                    title: {
                        text: '土建\n\n非标\n\n趋势',
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
        // 合同工程处理
        CONTRACT_ENGINEERING_PROCESSING() {
            const id = 'htgccl'
            const { common, echartSize, myApp, allAPI, config, param } = this.options
            var myChart = common.singleBar(id, echartSize[id]);
            myChart.showLoading(myApp.showEchartLoading());
            myApp.post(allAPI.QUERY_HTGCCL, param).then((res) => {
                myChart.hideLoading();
                let xData = [], edit = [], machinery = [], electrical = [], order = [], technology = [], procurementElaluation = [], monthSum = []
                if (res.status === 1 && res.data) {
                    if (res.status === 1 && res.data) {
                        ({ edit, machinery, electrical, order, technology, procurementElaluation, monthSum } = res.data)
                        xData = res.data.month;
                    }
                }
                const option = {
                    title: {
                        text: '合同\n\n工程\n\n处理',
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
                            name: '参数编制',
                            type: 'bar',
                            data: edit,
                            itemStyle: {
                                color: config.htgcclBarColor[0]
                            }
                        },
                        {
                            name: '机械设计',
                            type: 'bar',
                            data: machinery,
                            itemStyle: {
                                color: config.htgcclBarColor[1]
                            }
                        },
                        {
                            name: '电气设计',
                            type: 'bar',
                            data: electrical,
                            itemStyle: {
                                color: config.htgcclBarColor[2]
                            }
                        },
                        {
                            name: '计划处理',
                            type: 'bar',
                            data: order,
                            itemStyle: {
                                color: config.htgcclBarColor[3]
                            }
                        },
                        {
                            name: '工艺处理',
                            type: 'bar',
                            data: technology,
                            itemStyle: {
                                color: config.htgcclBarColor[4]
                            }
                        },
                        {
                            barMaxWidth: config.barMaxWidth,
                            barGap: '0',
                            name: '采购定价',
                            type: 'bar',
                            data: procurementElaluation,
                            itemStyle: {
                                color: config.htgcclBarColor[5]
                            }
                        },
                        {
                            name: '平均时长(min)',
                            type: 'line',
                            data: monthSum,
                            yAxisIndex: 1,
                            symbolSize: config.symbolSize,
                            symbol: 'circle',
                            itemStyle: {
                                color: config.fontYellow
                            }
                        }
                    ]
                };
                myChart.setOption(option)
                echartSize[id] = myChart
                this.chartsOption[id] = option
            })
        },
        // 回货准交率
        RETURN_DELIVERY_RATE() {
            const id = 'hhzjl'
            const { common, echartSize, myApp, allAPI, config, param } = this.options
            var myChart = common.singleBar(id, echartSize[id]);
            myChart.showLoading(myApp.showEchartLoading());
            const grid = {
                ...config.grid,
                left: config.left
            }
            myApp.post(allAPI.QUERY_HHZJL, param).then((res) => {
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
                const option = common.commonOption('line', xData, seriesData, '回货\n\n准交\n\n率', config.fontYellow, null, yAxis, null, grid, markLine)
                myChart.setOption(option)
                echartSize[id] = myChart
                this.chartsOption[id] = option
            })
        },
        // 累计发运
        ACCUMULATED_SHIPMENTS() {
            const id = 'ljfy'
            const { common, echartSize, myApp, allAPI, config, param } = this.options
            var myChart = common.singleBar(id, echartSize[id]);
            myChart.showLoading(myApp.showEchartLoading());
            myApp.post(allAPI.QUERY_LJFY, param).then((res) => {
                myChart.hideLoading();
                let xData = [];
                let seriesData = [];
                if (res.status === 1 && res.data) {
                    if (res.status === 1 && res.data) {
                        const data = res.data;
                        xData = data.month;
                        seriesData = data.rate;
                    }
                }
                const option = {
                    title: {
                        text: '累计\n\n发运',
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
                    xAxis:{
                        ...config.baseXAxis,
                        data: xData
                    },
                    yAxis: {...config.baseYAxis},
                    series: [
                        {
                            type: 'bar',
                            barMaxWidth: config.barMaxWidth,
                            data: seriesData,
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
        // 客户投诉不良
        CUSTOMER_COMPLAINTS_DEFECTS() {
            const id = 'khtsbl'
            const { config, common, echartSize, myApp, allAPI, param } = this.options
            var myChart = common.singleBar(id, echartSize[id]);
            myChart.showLoading(myApp.showEchartLoading());
            myApp.post(allAPI.QUERY_KHTSBL, param).then((res) => {
                myChart.hideLoading();
                let xData = [], qty = [], rate = [];
                if (res.status === 1 && res.data) {
                    if (res.status === 1 && res.data) {
                        const data = res.data;
                        xData = data.month;
                        qty = data.qty;
                        rate = data.rate;
                    }
                }
                const option = {
                    title: {
                        text: '客户\n\n投诉\n\n不良',
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
                    xAxis: {
                        ...config.baseXAxis,
                        data: xData
                    },
                    yAxis: [
                        { ...config.baseYAxis },
                        {
                            ...config.baseYAxis,
                            axisLabel: {
                                formatter: '{value}%'
                            },
                        }
                    ],
                    series: [
                        {
                            type: 'bar',
                            barMaxWidth: config.barMaxWidth,
                            data: qty,
                            itemStyle: {
                                color: config.pink
                            }
                        },
                        {
                            type: 'line',
                            data: rate,
                            yAxisIndex: 1,
                            symbolSize: config.symbolSize,
                            symbol: 'circle',
                            itemStyle: {
                                color: config.lightPink
                            },
                            markLine: {
                                symbol: 'none',
                                data: [{
                                    name: '绿色标准值',
                                    yAxis: 5,
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
        // 安装准交率
        INSTALLATION_ACCURACY_RATE() {
            const id = 'azzjl'
            const { common, echartSize, myApp, allAPI, config } = this.options
            var myChart = common.singleBar(id, echartSize[id]);
            // myChart.showLoading(myApp.showEchartLoading());
            // myApp.post(allAPI.ORDER_PERFORMANCES_S, {}).then((res) => {
            //     myChart.hideLoading();
            //     let xData = [];
            //     let seriesData = [];
            //     if (res.status === 1 && res.data) {
            //         if (res.status === 1 && res.data) {
            //             const data = res.data;
            //             xData = data.time;
            //             seriesData = data.value;
            //         }
            //     }
                // const option = common.commonOption('bar', xData, seriesData, '在安\n\n装台\n\n量', config.blue)
                const option = {
                    title: {
                        text: '安装\n\n准交\n\n率',
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
                    xAxis: config.baseXAxis,
                    yAxis: {
                        ...config.baseYAxis,
                        axisLabel: {
                            formatter: '{value}%'
                        },
                    },
                    series: [
                        {
                            data: [82.0, 92.8, 84.8, 90.3, 81.0, 93.3],
                            type: 'line',
                            name: '自安装准交率',
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
                            data: [83.9, 86.6, 81.0, 93.4, 85.9, 87.2],
                            type: 'line',
                            name: '分包安装准交率',
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
            // })
        }
    }
}
</script>