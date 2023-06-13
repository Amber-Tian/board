<template>
    <!-- 第二行图表 -->
    <div class="line">
        <div class="echart_item ecahrtFlag" v-for="item in idList" :id="item" :key="item" @click="clickChart(item)" />
    </div>
</template>

<script>
export default {
    name: 'ChartsOfLineTwo',
    props: ['options'],
    data() {
        return {
            idList: [
                "htlcqs",   // 合同流程趋势
                "pctl",     // 排产台量
                "bomzsxf",  // BOM准时下发
                "ctcpfb",   // 出梯产品分布
                "xxl",      // 下线率
                "zaztl"     // 在安装台量
            ],
            chartsOption: {}
        }
    },
    watch: {
        'options.parentMounted'(val) {
            if (val) {
                this.CONTRACT_PROCESS_TRENDS()
                this.PRODUCTION_CAPACITY()
                this.BOM_ISSUED_ONTIME()
                this.ELEVATOR_PRODUCTS_DISTRIBUTION()
                this.OFFLINE_RATE()
                this.INSTALLATION_QUANTITY()
            }
        }
    },
    methods: {
        clickChart(id){
            this.$parent.clickChart(id, this.chartsOption[id])
        },
        // 合同流程趋势
        CONTRACT_PROCESS_TRENDS() {
            const id = 'htlcqs'
            const { common, echartSize, myApp, allAPI, config, param } = this.options
            var myChart = common.singleBar(id, echartSize[id]);
            myChart.showLoading(myApp.showEchartLoading());
            myApp.post(allAPI.QUERY_HTLCQS, param).then((res) => {
                myChart.hideLoading();
                let xData = [];
                let standardRatioData = [];
                let wholeRatioData = [];
                let demanderRatioData = [];
                let sumTimeData = [];
                if (res.status === 1 && res.data) {
                    const data = res.data
                    xData = data.month
                    const formatFloat = val => Math.round(val*10000)/100 // 百分比保留两位小数
                    for(let i = 0; i < data.month.length; i++) {
                        const totalContract = data.whole[i] + data.demander[i] + data.standard[i]
                        standardRatioData.push(formatFloat(data.standard[i]/totalContract))
                        wholeRatioData.push(formatFloat(data.whole[i]/totalContract))
                        demanderRatioData.push(formatFloat(data.demander[i]/totalContract))
                        sumTimeData.push(Math.round(data.sumTime[i]/60/totalContract*100)/100)
                    }
                }
                const option = {
                    title: {
                        text: '合同\n\n流程\n\n趋势',
                        top: 'center',
                        textStyle: { color: config.fontGray, fontSize: config.titleSize },
                    },
                    tooltip: {},
                    grid: { ...config.grid, left: config.left },
                    legend: config.legend,
                    dataZoom: [{ type: 'inside' }],
                    xAxis: {...config.baseXAxis, data: xData},
                    yAxis: [
                        {
                            ...config.baseYAxis,
                            axisLabel: { formatter: '{value} %' },
                        },
                        { ...config.baseYAxis },
                    ],
                    series: [
                        {
                            stack: 'total',
                            name: '标准合同',
                            type: 'bar',
                            data: standardRatioData,
                            itemStyle: {
                                color: config.lightBlue
                            }
                        },
                        {
                            stack: 'total',
                            name: '一体合同',
                            type: 'bar',
                            data: wholeRatioData,
                            itemStyle: {
                                color: config.blueGray
                            }
                        },
                        {
                            barMaxWidth: config.barMaxWidth,
                            stack: 'total',
                            name: '需方合同',
                            type: 'bar',
                            data: demanderRatioData,
                            yAxisIndex: 0,
                            itemStyle: {
                                color: config.lightYellow
                            }
                        },
                        {
                            name: '审批时长',
                            type: 'line',
                            data: sumTimeData,
                            yAxisIndex: 1,
                            itemStyle: {
                                color: config.darkYellow
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
        // 排产台量
        PRODUCTION_CAPACITY() {
            const id = 'pctl'
            var myChart = this.options.common.singleBar(id, this.options.echartSize[id]);
            myChart.showLoading(this.options.myApp.showEchartLoading());
            this.options.myApp.post(this.options.allAPI.QUERY_PCTL, this.options.param).then((res) => {
                myChart.hideLoading();
                let xData = [];
                let seriesData = [];
                if (res.status === 1 && res.data) {
                    const data = res.data;
                    xData = data.month
                    seriesData = data.qty
                }
                const option = this.options.common.commonOption('bar', xData, seriesData, '排产\n\n台量', this.options.config.blue, true)
                myChart.setOption(option)
                this.options.echartSize[id] = myChart
                this.chartsOption[id] = option
            })
        },
        // BOM准时下发
        BOM_ISSUED_ONTIME() {
            const id = 'bomzsxf'
            const { common, echartSize, myApp, allAPI, config, param } = this.options
            var myChart = common.singleBar(id, echartSize[id]);
            myChart.showLoading(myApp.showEchartLoading());
            const grid = {
                ...config.grid,
                left: config.left
            }
            myApp.post(allAPI.QUERY_BOMZSXF, param).then((res) => {
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
                        name: '目标',
                        yAxis: '95',
                        label: { show: false },
                        lineStyle: { color: config.fontGreen }
                    }]
                }
                const option = common.commonOption('line', xData, seriesData, 'BOM\n\n准时\n\n下发', config.fontYellow, null, yAxis, null, grid, markLine)
                myChart.setOption(option)
                echartSize[id] = myChart
                this.chartsOption[id] = option
            })
        },
        // 出梯产品分布
        ELEVATOR_PRODUCTS_DISTRIBUTION() {
            const id = 'ctcpfb'
            const { common, echartSize, myApp, allAPI, config, param } = this.options
            var myChart = common.singleBar(id, echartSize[id]);
            myChart.showLoading(myApp.showEchartLoading());
            myApp.post(allAPI.QUERY_CTCPFB, param).then((res) => {
                myChart.hideLoading();
                let xData = [];
                let seriesData1 = [];
                let seriesData2 = [];
                let seriesData3 = [];
                if (res.status === 1 && res.data) {
                    const data = res.data
                    xData = data.month
                    seriesData1 = data.evevator
                    seriesData2 = data.escalator
                    seriesData3 = data.freight
                }
                const option = {
                    title: {
                        text: '出梯\n\n产品\n\n分布',
                        top: 'center',
                        textStyle: { color: config.fontGray, fontSize: config.titleSize },
                    },
                    tooltip: {},
                    grid: {
                        ...config.grid,
                        left: config.left
                    },
                    legend: config.legend,
                    dataZoom: [
                        { type: 'inside' }
                    ],
                    xAxis: {...config.baseXAxis, data: xData},
                    yAxis: {...config.baseYAxis},
                    series: [
                        {
                            name: '客梯',
                            stack: 'total',
                            type: 'bar',
                            data: seriesData1,
                            itemStyle: {
                                color: config.blueGray
                            }
                        },
                        {
                            name: '货梯',
                            stack: 'total',
                            type: 'bar',
                            data: seriesData2,
                            itemStyle: {
                                color: config.blue
                            }
                        },
                        {
                            barMaxWidth: config.barMaxWidth,
                            name: '扶梯',
                            stack: 'total',
                            type: 'bar',
                            data: seriesData3,
                            itemStyle: {
                                color: config.lightBlue
                            }
                        },
                    ]
                };
                myChart.setOption(option)
                echartSize[id] = myChart
                this.chartsOption[id] = option
            })
        },
        // 下线率
        OFFLINE_RATE() {
            const id = 'xxl'
            const { config, common, echartSize, myApp } = this.options
            var myChart = common.singleBar(id, echartSize[id]);
            const grid = {
                ...config.grid,
                left: config.left
            }
            myChart.showLoading(myApp.showEchartLoading());
            // myApp.post(allAPI.ORDER_PERFORMANCES_S, {}).then((res) => {
            myChart.hideLoading();
            let xData = [];
            let seriesData = [];
            // if (res.status === 1 && res.data) {
            //   const data = res.data;
            //   xData = data.time;
            //   seriesData = data.value;

            // }
            let yAxis = {
                ...config.baseYAxis,
                axisLabel: {
                    formatter: '{value} %',
                },
            };
            xData = [10, 11, 12, 1, 2, 3]
            seriesData = [2, 12, 1, 9, 7, 2];
            const markLine = {
                symbol: 'none',
                data: [{
                    name: '绿色标准值',
                    yAxis: '5',
                    label: { show: false },
                    lineStyle: { color: config.redColor }
                }]
            }
            const option = common.commonOption('bar', xData, seriesData, '下线\n\n率', config.pink, false, yAxis, null, null, markLine)
            myChart.setOption(option)
            echartSize[id] = myChart
            this.chartsOption[id] = option
        },
        // 在安装台量
        INSTALLATION_QUANTITY() {
            const id = 'zaztl'
            const { common, echartSize, myApp, allAPI, config, param } = this.options
            var myChart = common.singleBar(id, echartSize[id]);
            myChart.showLoading(myApp.showEchartLoading());
            myApp.post(allAPI.QUERY_ZAZTL, param).then((res) => {
                myChart.hideLoading();
                let xData = [], installationTL = [], NotInstallationTL = [];
                if (res.status === 1 && res.data) {
                    const data = res.data;
                    xData = data.month;
                    installationTL = data.installationTL;
                    NotInstallationTL = data.NotInstallationTL
                }
                const option = {
                    title: {
                        text: '在安\n\n装台\n\n量',
                        top: 'center',
                        textStyle: { color: config.fontGray, fontSize: config.titleSize },
                    },
                    tooltip: {},
                    grid: {
                        ...config.grid,
                        left: config.left
                    },
                    legend: config.legend,
                    dataZoom: [
                        { type: 'inside' }
                    ],
                    xAxis: {...config.baseXAxis, data: xData},
                    yAxis: {...config.baseYAxis},
                    series: [
                        {
                            type: 'bar',
                            name: '安装台量',
                            data: installationTL,
                            itemStyle: {
                                color: config.blue
                            }
                        },
                        {
                            type: 'bar',
                            name: '无安装台量',
                            barGap: 0,
                            data: NotInstallationTL,
                            itemStyle: {
                                color: config.lightBlue
                            }
                        }
                    ]
                };
                myChart.setOption(option)
                echartSize[id] = myChart
                this.chartsOption[id] = option
            })
        }
    }
}
</script>