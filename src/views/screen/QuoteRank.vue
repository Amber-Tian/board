<template>
  <div class="commonBorder commonBg rankContainer" style="position:relative">
    <div class="dateBtn boxSizing">
      <el-button-group type="mini">
        <el-button size="mini" v-for="item in searchBtnList" :key="item.id" :type="item.id===activeSearch?'primary':''"
          @click="clickSearchBtn(item)">{{ item.name }}
        </el-button>
      </el-button-group>
      <el-date-picker v-model="projectYear" :type="activeSearch" size="mini" class="dateContainer"
        popper-class="datePopver" :picker-options="pickerOptions" placeholder="请选择" @change="changeProjectYear" />
      <i @click="setModalVisible(true)" style="color:#fff;cursor: pointer" class="el-icon-time"></i>
    </div>
    <!--    分公司区域排名-->
    <div class="QuoteRank commonBg boxSizing" style="border-top: 1px solid deepskyblue">
      <div class="area commonQuote" id="quoteArea"></div>
      <div class="company commonQuote" id="quoteCompany"></div>
    </div>
    <!--    人员排名-->
    <QuoteTableRank :activeSearch="activeSearch" :projectYear="projectYear" :personRank="personRank" />

    <el-dialog title="定时器设置" :close-on-press-escape="false" :close-on-click-modal="false" :center="true"
      :visible.sync="timeSetVisible" width="30%" :show-close="false">
      <div style="text-align: center">
        <el-input-number :min="30" v-model="myTimeValue"></el-input-number>
        <span>分钟</span>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setModalVisible(false)">取 消</el-button>
        <el-button type="primary" @click="confirmTimeSet">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import QuoteTableRank from './QuoteTableRank'
  import config from '@/api/config'
  import { myApp } from '@/api/app'
  import commonMethod from '@/api/commonMethod'
  import * as echarts from 'echarts'
  import moment from 'moment'
  import { elevatorAPI } from '@/api/apiValue'

  export default {
    name: 'QuoteRank',
    components: { QuoteTableRank },
    props: ['isResize', 'timeValue', 'timeSetVisible'],
    data() {
      return {
        myTimeValue: '',
        personRank: {
          time: [],
          data: [],
          company: [],
          area: []
        },
        pickerOptions: {
          disabledDate(time) {
            if (time.getTime() > Date.now()) {
              return true
            } else if (time.getTime() <= new Date('2021-06-01')) { // 报价系统在2021-6-15号上线
              return true
            }
          }
        },
        searchBtnList: [
          {
            id: 'year',
            name: '按月查询报价单'
          }, {
            id: 'month',
            name: '按天查询报价单'
          }
        ],
        projectYear: new Date(),
        activeSearch: 'year',
        echartSize: {
          quoteCompany: null,
          quoteArea: null
        },
        timeOutList: {
          quoteCompany: null,
          quoteArea: null,
          quotePerson: null
        }
      }
    },
    watch: {
      isResize() {
        this.resizeMethod()
      },
      isPageLeave(newValue) {
        if (newValue) {
          this.initTimeOut()
        }
      }
    },

    mounted() {
      const _this = this
      setTimeout(function () {
        _this.changeProjectYear(new Date())
      }, 500)
    },
    methods: {
      // 清除所有的定时器
      initTimeOut() {
        const _this = this
        for (const key in _this.timeOutList) {
          if (_this.timeOutList[key]) {
            clearTimeout(_this.timeOutList[key])
            _this.timeOutList[key] = null

          }
        }
      },
      setModalVisible(value) {
        this.$emit('setModalVisible', value)
      },
      confirmTimeSet() {
        this.$emit('confirmTimeSet', this.myTimeValue)
        this.initTimeOut()
        this.initAllRequest()
      },
      // 日期改变
      changeProjectYear(value) {
        if (value) {
          this.projectYear = value
          const _this = this
          this.initTimeOut()
          _this.$nextTick(function () {
            _this.initAllRequest()
          })
          this.$emit('changeProjectYear', { activeSearch: this.activeSearch, projectYear: value })
        } else {
          myApp.alert('请选择正确的日期', 'error')
        }
      },
      initAllRequest() {
        this.initQuoteByCompany()
        this.initQuoteByArea()
        this.initQuoteByPerson()
      },
      clickSearchBtn(item) {
        if (this.activeSearch != item.id) {
          this.activeSearch = item.id
          this.projectYear = new Date()
          const _this = this
          this.$nextTick(function () {
            _this.changeProjectYear(new Date())
          })
        }
      },
      resizeMethod() {
        const echartSize = this.echartSize
        for (const key in echartSize) {
          if (echartSize[key]) {
            echartSize[key].resize()
          }
        }
      },
      // 获取echart图表的option
      getCommonOption(xData, seriesData, yName, title, flag) {
        let axisLabel = {
          formatter: function (value) {
            return value
          }
        }
        let seriesLabel = {
          formatter: function (param) {
            return param.value
          }
        }
        if (flag == 'company') {
          const rich = {
            index: {
              color: '#0dc5b5'
            },
            valueStyle: {
              color: 'orange',
              borderWidth: 1,
              borderType: 'solid',
              borerColor: 'red'
            }
          }
          axisLabel = {
            formatter: function (value, index) {
              if (index % 2 == 0) {
                return '{index|' + (index + 1) + '}' + value + '：' + '{valueStyle|' + seriesData[index] + '}'
              }
            },
            rich: rich
          }
          seriesLabel = {
            formatter: function (param) {
              if (param.dataIndex % 2 != 0) {
                return '{index|' + (param.dataIndex + 1) + '}' + param.name + '：' + '{valueStyle|' + param.value + '}'
              } else {
                return ''
              }
            },
            rich: rich
          }
        }
        const projectYear = this.projectYear
        const activeSearch = this.activeSearch
        if (activeSearch && activeSearch == 'year') {
          title = moment(projectYear).format('YYYY') + '年' + title
        } else if (activeSearch && activeSearch == 'month') {
          title = moment(projectYear).format('YYYY-MM') + '月' + title
        }
        return {
          color: ['#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de', '#3ba272', '#fc8452', '#9a60b4', '#ea7ccc'],
          title: {
            ...config.echartTitle,
            text: title
          },
          grid: {
            top: '10%',
            right: '15%',
            left: '8%',
            bottom: '-3%',
            containLabel: true
          },
          dataZoom: [
            { type: 'inside' }
          ],
          tooltip: {},
          yAxis: {
            show: true,
            type: 'category',
            // name: '月',
            inverse: true,
            axisLabel: {
              interval: 0,
              color: '#fff',
              ...axisLabel
            },
            axisLine: { show: false, lineStyle: { color: '#fff' } },
            splitLine: { show: false },
            axisTick: { show: false },
            data: xData
          },
          xAxis: {
            type: 'value',
            name: yName,
            show: false,
            nameGap: 0,
            axisLabel: {
              color: '#fff'
            },
            axisLine: { show: false, lineStyle: { color: '#fff' } },
            splitLine: { show: false },
            axisTick: { show: false }
          },
          series: [
            {
              type: 'bar',
              data: seriesData,
              // barWidth: 15,
              barMaxWidth: 10,
              label: {
                show: true,
                color: '#fff',
                position: 'right',
                ...seriesLabel
              },
              itemStyle: {
                color: 'rgb(163,241,8)',
                borderRadius: 10,
                shadowBlur: 2,
                shadowColor: '#fff'
              }
            }
          ]
        }
      },
      // 报价单录入按创建人查询
      initQuoteByPerson() {
        if (!this.projectYear || this.projectYear === null) {
          myApp.alert('请选择正确的日期', 'error')
          return false
        }
        this.personRank = {
          time: [],
          data: [],
          company: [],
          area: []
        }
        const projectYear = moment(this.projectYear).format('YYYY-MM')
        myApp.post('screen', elevatorAPI.SEARCH_QUOTE_LIST, {
          year: projectYear,
          flag: this.activeSearch,
          org: 'person'
        }).then((res) => {
          let time = []
          let data = []
          let company = []
          let area = []
          if (res.code === 1 && res.data && res.data.time && res.data.time.length > 0) {
            const dataR = res.data
            time = dataR.time
            data = dataR.data
            if (dataR.company && dataR.company.length > 0) {
              company = dataR.company
              area = dataR.area
            }
          }
          this.personRank = {
            time: time,
            data: data,
            company: company,
            area: area
          }
          const _this = this
          if (!this.isPageLeave) {
            this.timeOutList.quotePerson = setTimeout(function () {
              _this.initQuoteByPerson()
            }, _this.timeValue)
          }
        })
      },
      // 报价单录入按中心查询
      initQuoteByCompany() {
        const id = 'quoteCompany'

        if (!this.projectYear || this.projectYear === null) {
          myApp.alert('请选择正确的日期', 'error')
          return false
        }
        var myChart = this.echartSize.quoteCompany
        if (!myChart || myChart == '') {
          if (!document.getElementById(id) || document.getElementById(id) === null) {
            myApp.alert('页面未渲染成功', 'error')
            return false
          }
          myChart = echarts.init(document.getElementById(id))
        }
        const projectYear = moment(this.projectYear).format('YYYY-MM')
        myApp.post('screen', elevatorAPI.SEARCH_QUOTE_LIST, {
          year: projectYear,
          flag: this.activeSearch,
          org: 'company'
        }).then((res) => {
          // 使用刚指定的配置项和数据显示图表。
          let xData = []
          let seriesData = []
          if (res.code === 1 && res.data && res.data.time && res.data.time.length > 0) {
            xData = res.data.time
            seriesData = res.data.data
          }
          const option = this.getCommonOption(xData, seriesData, '报价单录入数量', '分公司报价单数排名', 'company')
          myChart.setOption(option)
          this.echartSize.quoteCompany = myChart
          const _this = this
          if (!this.isPageLeave) {
            this.timeOutList.quoteCompany = setTimeout(function () {
              _this.initQuoteByCompany()
            }, _this.timeValue)
          }
        })
      },
      // 报价单录入按区域查询
      initQuoteByArea() {
        const id = 'quoteArea'

        if (!this.projectYear || this.projectYear === null) {
          myApp.alert('请选择正确的日期', 'error')
          return false
        }
        var myChart = this.echartSize.quoteArea
        if (!myChart || myChart == '') {
          if (!document.getElementById(id) || document.getElementById(id) === null) {
            myApp.alert('页面未渲染成功', 'error')
            return false
          }
          myChart = echarts.init(document.getElementById(id))
        }
        const projectYear = moment(this.projectYear).format('YYYY-MM')
        myApp.post('screen', elevatorAPI.SEARCH_QUOTE_LIST, {
          year: projectYear,
          flag: this.activeSearch,
          org: 'area'
        }).then((res) => {
          // 使用刚指定的配置项和数据显示图表。
          let seriesData = []
          const color = config.color
          let legendData = []
          if (res.code === 1 && res.data && res.data.time && res.data.time.length > 0) {
            const resData = res.data
            resData.time.forEach((item, index) => {
              legendData.push({ name: item })
              seriesData.push({
                name: item,
                value: resData.data[index],
                emphasis: {
                  scale: true,
                  label: {
                    formatter: function (param) {
                      return param.name + '：{emphasisLabel|' + param.value + '}'
                    },
                    rich: {
                      emphasisLabel: {
                        color: '#0ee5c2',
                        fontWeight: 'bold',
                        fontSize: 18
                      },
                    }
                  }
                },
                labelLine: { show: true },
                itemStyle: {
                  borderWidth: 8,
                  shadowBlur: 20,
                  borderRadius: 20,
                  borderColor: color[index] ? color[index] : '#1890ff',
                  shadowColor: color[index] ? color[index] : '#1890ff'
                }
              }, {
                value: 8,
                name: '',
                label: {
                  show: false,
                  scale: false
                },
                labelLine: { show: false },
                itemStyle: {
                  color: 'rgba(0, 0, 0, 0)',
                  borderColor: 'rgba(0, 0, 0, 0)',
                  borderWidth: 0
                }
              })
            })
          }
          // const option = this.getCommonOption(xData, seriesData, '报价单录入数量', '区域排名', 'area')
          let title = ''
          const projectYear = this.projectYear
          const activeSearch = this.activeSearch
          if (activeSearch && activeSearch == 'year') {
            title = moment(projectYear).format('YYYY') + '年' + title
          } else if (activeSearch && activeSearch == 'month') {
            title = moment(projectYear).format('YYYY-MM') + '月' + title
          }
          const option = {
            color: color,
            title: {
              text: title + '区域报价单数排名',
              ...config.echartTitle
            },
            tooltip: {
              show: false
            },
            legend: [{
              orient: 'horizontal',
              icon: 'circle',
              // x: 'left',
              data: legendData,
              top: '10%',
              left: 0,
              itemGap: 8,
              textStyle: {
                color: '#fff'
              }
            }],
            series: [{
              name: '',
              type: 'pie',
              radius: ['90%', '90%'],
              center: ['50%', '95%'],
              top: 'center',
              label: {
                show: false,
                position: 'center'
              },
              emphasis: {
                scale: true,  //放大扇区
                label: {
                  show: true,
                  fontWeight: 'bold',
                  color: '#fff'
                }
              },
              data: seriesData
            }]
          }
          myChart.setOption(option)
          this.echartSize.quoteArea = myChart
          const _this = this
          if (!this.isPageLeave) {
            this.timeOutList.quoteArea = setTimeout(function () {
              _this.initQuoteByArea()
            }, _this.timeValue)
          }
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "src/style/variable";

  .rankContainer {
    width: $quoteRankW;
    height: 100%;
    position: relative;
    display: inline-block;
  }

  .QuoteRank {
    position: relative;
    height: calc(100% - #{$dateH} - #{$tableH} - 0.5rem);

    .commonQuote {
      height: 100%;
      display: inline-block;
    }

    $areaW: 40%;

    .area {
      width: $areaW;
    }

    .company {
      width: 100% - $areaW;
    }

  }

  .dateBtn {
    height: $dateH;
    line-height: $dateH;
    display: flex;
    justify-content: space-between;
    align-items: center;
    overflow: hidden;
  }
</style>