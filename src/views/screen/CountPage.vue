<template>
  <div class="count boxSizing">
    <div class="fieldContainer">
      <fieldset v-for="item in countList" :key="item.id" class="fieldset">
        <legend class="title">
          {{ item.name }}
        </legend>
        <div class="value">
          {{ item.value }}
        </div>
      </fieldset>
    </div>
  </div>
</template>

<script>
  import config from '@/api/config'
  import { myApp } from '@/api/app'
  import commonMethod from '@/api/commonMethod'
  export default {
    name: 'CountPage',
    props: ['activeSearch', 'isPageLeave', 'timeValue', 'isTimeChange'],
    data() {
      return {
        countList: [{
          id: 'quote',
          name: '总报价单询价数量',
          value: 0
        }, {
          id: 'customer',
          name: '总客户数量',
          value: 0
        }, {
          id: 'project',
          name: '总项目数量',
          value: 0
        }, {
          id: 'agent',
          name: '总代理商数量',
          value: 0
        }],
        timeOutList: {
          agentCount: null,
          customerCount: null,
          projectCount: null,
          quoteCount: null
        }
      }
    },
    computed: {},
    watch: {
      isPageLeave(newValue) {
        if (newValue) {
          this.initTimeOut();
        }
      },
      isTimeChange() {
        this.initTimeOut();
        const _this = this;
        _this.$nextTick(function () {
          _this.initCount()
        })
      }
    },
    mounted() {

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
      initCount() {
        const param = this.getParam()
        this.initAgent(param)
        this.initCustomer(param)
        this.initProject(param)
        this.initQuote(param)
      },
      getParam() {
        return {
          year: 'all',
          flag: this.activeSearch,
          org: ''
        }
      },
      async initAgent(param) {
        const res = await commonMethod.getAgent(param)
        let count = 0
        if (res.data && res.data.data && res.data.data.length > 0) {
          count = res.data.data[0].count
        }
        this.countList[3].value = count
        const _this = this;
        if (!this.isPageLeave) {
          this.timeOutList.agentCount = setTimeout(function () {
            _this.initAgent(_this.getParam())
          }, _this.timeValue)
        }
      },
      async initCustomer(param) {
        const res = await commonMethod.getCustomer(param)
        let count = 0
        if (res.data && res.data.data && res.data.data.length > 0) {
          count = res.data.data[0].count
        }
        this.countList[1].value = count
        const _this = this;
        if (!this.isPageLeave) {
          this.timeOutList.customerCount = setTimeout(function () {
            _this.initCustomer(_this.getParam())
          }, _this.timeValue)
        }
      },
      async initProject(param) {
        const res = await commonMethod.getProject(param)
        let count = 0
        if (res.data && res.data.data && res.data.data.length > 0) {
          count = res.data.data[0].count
        }
        this.countList[2].value = count
        const _this = this;
        if (!this.isPageLeave) {
          this.timeOutList.projectCount = setTimeout(function () {
            _this.initProject(_this.getParam())
          }, _this.timeValue)
        }
      },
      async initQuote(param) {
        const res = await commonMethod.getQuote(param)
        let count = 0
        if (res.data && res.data.data && res.data.data.length > 0) {
          count = res.data.data[0].count
        }
        this.countList[0].value = count
        const _this = this;
        if (!this.isPageLeave) {
          this.timeOutList.quoteCount = setTimeout(function () {
            _this.initQuote(_this.getParam())
          }, _this.timeValue)
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "src/style/variable";
  $CountH: 3;

  .count {
    position: relative;
    display: inline-block;
    vertical-align: top;
    //width: calc(100% - #{$quoteRankW});
    width: 100%;
    height: $middleH;
    color: #fff;
    box-sizing: border-box;

    .fieldContainer {
      display: flex;
      justify-content: space-around;
      align-items: center;
    }
  }

  .fieldset {
    display: inline-block;
    text-align: center;
    margin-top: 0.3rem;
    width: 25%;

    .title {
      font-size: 1rem;
      color: #9af169;
    }

    .value {
      $color: #18f5db;
      color: #fff;
      font-size: 1.8rem;
      text-shadow: 0 0 20px white, 0 0 20px $color, 0 0 30px white, 0 0 40px $color; //设置发光效果
    }
  }
</style>