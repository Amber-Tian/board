<template>
  <div class="container">
    <Head @handleSearch="handleSearch" :isShow="true" :title="title" />
    <ImgOccur :imgTitle="imgTitle" />
    <ProcessArrow :processList="processList" :processData="processData" />
    <div class="content">
      <div class="stage">
        <div class="stage_one">SO1销售阶段</div>
        <div class="stage_two">SO2生产阶段——(排产款确认至装车发运) —已经用时= <span class="usetime">{{useTime}}</span></div>
        <div class="stage_three">SO3安装阶段</div>
      </div>
      <div class="info">
        <dl class="dl" v-for="item in dlList" :key="item.prop">
          <dt @click="item.isButton && clickProductionStatus()" :class="{dt:true,status:item.isButton,pointer:item.isButton}">{{item.label}}
          </dt>
          <dd v-if="!item.noShow" class="dd">{{selectRow[item.prop]}}</dd>
        </dl>
      </div>
      <div class="content_table">
        <QuoteTableRank :autoScroll="autoScroll" :tableData="tableData" :tableColumn="tableColumn" :highlightCurrentRow="true" @rowClick="getProcessData">
          请在左上角进行合同号查询
        </QuoteTableRank>
      </div>
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
  import QuoteTableRank from '@/views/screen/QuoteTableRank'
  import moment from 'moment'
  export default {
    name: 'EquipmentStatus',
    components: {
      Head, ImgOccur, QuoteTableRank, ProcessArrow
    },
    data() {
      return {
        title: config.Statustitle,
        searchValue: '',
        autoScroll: false, //滚动条是否自行滚动
        useTime: null,
        dlR:1,  //dl距离右边的位置
        processList: {
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
          },
          expected: {
            label: '预计',
            flag: 'el-icon-s-promotion', 
            icon:true,
            color: 'rgb(51,204,255)',
            prop: 'expected'
          },
        },
        processData: {
          htsp: {
            label: '合同审批',
          },
          bgsp: {
            label: '变更审批',
          },
          ghsx: {
            label: '工号生效',
          },
          pcsq: {
            label: '排产申请',
          },
          htgc: {
            label: '合同工程',
          },
          ztjh: {
            label: '整梯计划',
          },
          xtjh: {
            label: '箱头计划',
          },
          ddjh: {
            label: '订单计划',
          },
          gdjh: {
            label: '工单计划',
          },
          lljs: {
            label: '订单收货',
          },
          gdwg: {
            label: '工单完工',
          },
          zxwg: {
            label: '装箱完工',
          },
          ghqt: {
            label: '设备齐套',
          },
          zcfy: {
            label: '装车发运',
          },
          azjc: {
            label: '安装进场',
          },
          azyj: {
            label: '安装移交',
          }
        },
        dlList: [
          {
            prop: 'elevator_no',
            label: '电梯工号：'
          },
          {
            prop: 'contract_number',
            label: '合同编号'
          },
          {
            prop: 'project_name',
            label: '项目名称'
          },
          {
            prop: 'org_name',
            label: '销售中心'
          }, {
            prop: 'status',
            label: '查看生产状态',
            isButton: true,
            noShow: true
          },
        ],
        selectRow: {},
        tableColumn: [
          {
            prop: 'elevator_no',
            label: '工号'
          }, {
            prop: 'elevator_seq',
            label: '梯号'
          }, {
            prop: 'teh_model_code',
            label: '设备名称'
          }, {
            prop: 'p',
            label: '载重KG/梯级MM'
          }, {
            prop: 'sd',
            label: '速度M/S'
          }, {
            prop: 'tsgd',
            label: '提升高度M'
          }, {
            prop: 'czm',
            label: '层/站/门'
          }, {
            prop: 'elv_status',
            label: '设备当前状态'
          }, {
            prop: 'valid_date',
            label: '生效'
          }, {
            prop: 'pc_pay_flag',
            label: '排产款到位'
          }, {
            prop: 'th_pay_flag',
            label: '发货款到位'
          }, {
            prop: 'credit_date',
            label: '铺底'
          }, {
            prop: 'stop_flg',
            label: '暂停'
          }, {
            prop: 'nostandard_qty',
            label: '非标数'
          }, {
            prop: 't2_days',
            label: '参考T2(工作日)'
          }
        ],
        tableData: [],
        processDataHash: {
            "htsp": "contract_date",
            "bgsp": "revision_date",
            "ghsx": "valid_date",
            "pcsq": "cf_request_date",
            "htgc": "publish_date",
            "ztjh": "ps_schedule_completion_date",
            "xtjh": "box_schedule_confirmation_date",
            "ddjh": "pr_plans_date",
            "gdjh": "wip_plans_date",
            "lljs": ["pr_comp_qty_i", "pr_comp_qty_e", "pr_comp_qty_n"],
            "gdwg": ["wip_comp_qty_i", "wip_comp_qty_e", "wip_comp_qty_n"],
            "zxwg": ["box_comp_qty_i", "box_comp_qty_e", "box_comp_qty_n"],
            "ghqt": "elv_comp_date",
            "zcfy": ["shipment_date", "sd_schedule_delivery_date"],
            "azjc": "entrance_date",
            "azyj": "turn_date"
        },
      }
    },
    computed: {
      imgTitle() {
        return Object.keys(this.processData)
      }
    },
    mounted() {

    },
    created() {

    },
    methods: {
      getProcessData(rowIndex) {
        this.selectRow = this.tableData[rowIndex]
        this.useTime = this.selectRow.elv_comp_days
        for(let key in this.processData) {
          const item = this.processData[key]
          const hashItem = this.processDataHash[key]
          const date = this.selectRow
          if(key === 'zcfy') {
            this.$set(item, 'finishDate', date[hashItem[0]] ?? '')
            this.$set(item, 'exceptedDate', date[hashItem[1]] ?? '')
            this.$set(item, 'dark', !Boolean(date[hashItem[0]]))
          } else if (key === 'ddsh' || key === 'gdwg' || key === 'zxwg') {
            const going = date[hashItem[0]] ?? 0, finish = date[hashItem[1]] ?? 0, abnormal = date[hashItem[2]] ?? 0
            this.$set(item, 'going', going)
            this.$set(item, 'finish', finish)
            this.$set(item, 'abnormal', abnormal)
            this.$set(item, 'dark', going+finish+abnormal === 0)
          } else {
            this.$set(item, 'finishDate', date[hashItem] ?? '')
            this.$set(item, 'dark', !Boolean(date[hashItem]))
          }
        }
      },
      // 点击搜索按钮
      handleSearch(value) {
        myApp.post(allAPI.QUERY_SBJFZTCX, {'number': value}).then((res) => {
          if (res.status === 1 && res.count) {
            this.tableData = res.data
            this.$nextTick(() => {
              document.querySelectorAll('.content_table .content').forEach(i => {
                i.innerText === 'N' && (i.style.backgroundColor = config.brown)
              })
            })
          } else {
            this.$message({
              showClose: true,
              message: '请输入正确的合同号',
              type: 'warning'
            });
          }
        })
      },
      // 点击查看生产状态，跳转到详情
      clickProductionStatus() {
        if(!this.selectRow.elevator_id) {
          this.$message({
            showClose: true,
            message: '请选中一行数据',
            type: 'warning'
          });
          return
        }
        const { elevator_no, elevator_seq, teh_model_code, p, sd, tsgd, czm, contract_number, project_name } = this.selectRow
        const productionStatusData = { elevator_no, elevator_seq, teh_model_code, p, sd, tsgd, czm, contract_number, project_name }
        myApp.setData('productionStatusData', productionStatusData)
        const routeData = this.$router.resolve({
          path: '/equipmentProductionStatus',
          query: { elevator_id: this.selectRow.elevator_id }
        })
        window.open(routeData.href, '_blank')
      },
    },
  } 
</script>
<style scoped lang="scss">
  @import "src/style/variables";

  $infoH: 2rem;

  .container {
    background-color: $bgColor;
    height: 100%; 
    padding: $containerD;
    overflow:hidden;  
    width: 100%; 
    min-width: $containerMinW;
    box-sizing:border-box;

    .content {
      height: calc(100% - #{$headH} - #{$imgH}); 
      .usetime{
            color: rgb(0,255,0);
          }
      .info {
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: $infoH;
        line-height: $infoH;
        margin: 2vh 0;

        .dt,
        .dd {
          border: 1px solid $borderColor;
          padding: 0 1rem;
          word-break: keep-all;
        }
        dl:first-child{
          font-size: 1.5rem;
        }
        dl:last-child{
          justify-content: flex-end;
          width: 10%;
        }

        .dl {
          display: flex;
          justify-content: flex-start;
          align-items: center;
          text-align: center;
          width: 20%;
          height: 100%;

          &:first-child dt,
          &:first-child .dd {
            border: none;
            background: none;
          }

          .dt {
            background-image: linear-gradient(transparent, $borderColor 99%);
          }

          .dd {
            background: rgb(63, 70, 91);
            height: 100%;
            box-sizing: content-box;
            flex-grow: 1;
          }

          .status {
            background: rgb(192, 0, 0) !important;
          }
         
        } 
      }



      .content_table {
        height: calc(100% - #{$headH} - #{$imgH} -  #{$infoH} - #{$stageH} - 2*#{$containerD} - #{$stageD} ); 
      }

    }
  }
</style>