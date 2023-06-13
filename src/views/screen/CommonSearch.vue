<template>
  <div class="commonBorder commonBg rankContainer" style="position:relative">
    <div class="dateBtn boxSizing">
      <el-button-group type="mini">
        <template v-if="isALL" v-for="item in searchBtnList">
          <el-button size="mini" :key="item.id" :type="item.id===activeSearch?'primary':''"
            @click="clickSearchBtn(item)">{{ item.name }}
          </el-button>

        </template>
        <template v-else v-for="item in searchBtnList">
          <el-button size="mini" :key="item.id" :type="item.id===activeSearch?'primary':''"
            @click="clickSearchBtn(item)">{{ item.name }}
          </el-button>

        </template>
      </el-button-group>
      <el-date-picker v-if="isOccurTime" v-model="projectYear" :type="activeSearch" size="mini" class="dateContainer"
        popper-class="datePopver" :picker-options="pickerOptions" placeholder="请选择" @change="changeProjectYear" />
      <i @click="setModalVisible(true)" style="color:#fff;cursor: pointer" class="el-icon-time"></i>
    </div>
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
    props: ['isResize', 'timeValue', 'timeSetVisible', 'isALL'],
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
            id: 'all',
            name: "全部"
          },
          {
            id: 'year',
            name: '按月'
          }, {
            id: 'month',
            name: '按天'
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
        },
        isOccurTime: true
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

          this.$emit('changeProjectYear', { activeSearch: this.activeSearch, projectYear: value })
        } else {
          myApp.alert('请选择正确的日期', 'error')
        }
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
        if (item.id == 'all') {
          this.isOccurTime = false;
        } else {
          this.isOccurTime = true;
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
    }
  }
</script>

<style lang="scss" scoped>
  @import "src/style/variable";

  .rankContainer {
    width: 100%;
    height: 100%;
    position: relative;
    display: inline-block;
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