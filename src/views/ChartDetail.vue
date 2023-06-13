<template>
  <!-- 合同工程变更分布详细页面 -->
  <div class="chartDetail">
    <Head :isShow="false" :title="title"></Head>
    <div class="content">
      <div class="content_left">
        <div id="detailChart" />
        <div class="search" id="search">
          <div class="line">
            <div class="search_top">{{ searchTitle }}</div>
            <!-- <el-select popper-class="bgSelectPopver" class="line_left searchInput detailInput" size="mini"
              v-model="serachObj.prop" placeholder="请选择">
              <el-option v-for="item in serachList" :key="item.prop" :label="item.label" :value="item.prop">
              </el-option>
            </el-select>
            <span class="el-icon-caret-bottom searchIcon"></span> -->
          </div>
          <div class="line">
            <el-input clearable size="mini" class="line_left searchInput detailInput input" placeholder="请输入内容"
              v-model="searchValue" />
            <i @click="handleSearch(searchValue)" class="el-icon-search searchIcon pointer"></i>
          </div>
          <div class="line">
            <el-checkbox size="mini" text-color="#ffffff"
              v-model="autoScroll">列表滚动显示</el-checkbox>
          </div>
        </div>
      </div>
      <div class="content_right myTable">
        <QuoteTableRank :autoScroll="autoScroll" :tableData="tableData" :tableColumn="tableColumn" :hideEmpty="true" />
      </div>
    </div>
  </div>
</template>

<script>
  import * as echarts from 'echarts'
  import Head from '@/components/Head'
  import QuoteTableRank from '@/views/screen/QuoteTableRank'
  import config from '@/api/config'
  import { myApp } from '@/api/app'
  import { allAPI } from "@/api/apiValue";
  import common from '@/js/common'
  import moment from 'moment'
  import { Loading } from 'element-ui';

  export default {
    name: 'ChartDetail',
    props: [""],
    components: {
      Head, QuoteTableRank
    },
    data() {
      return {
        queryChartOption: myApp.getData('chartOption'),
        searchValue: '',
        detailGrid: {
          top: '3%',
          right: '10%',
          left: '8%', 
          bottom: '36%'
        },
        autoScroll: true, //滚动条是否自行滚动
        serachList: [
          {
            prop: 'gh',
            label: '工号'
          },
          {
            prop: 'riqi',
            label: '变更日期'
          }, {
            prop: 'person',
            label: '变更人'
          }, {
            prop: 'guishu',
            label: '变更归属'
          }, {
            prop: 'miaoshu',
            label: '变更描述'
          },
        ],
        baseColumn: [{ prop: 'no', label: '序号' }],
        columns: {
          'HTGCCL': [ // 合同工程处理
            {
              prop: 'elevator_no',
              label: '工号'
            }, 
            {
              prop: 'task_name',
              label: '任务名称'
            },
            {
              prop: 'create_time',
              label: '创建日期'
            },
            {
              prop: 'end_time',
              label: '完成日期'
            },
            {
              prop: 'process_min',
              label: '用时(min)'
            },
          ],
          'JHYC': [ // 计划异常
            {
              prop: 'elevator_no',
              label: '工号'
            }, 
            {
              prop: 'err_type',
              label: '异常类型'
            },
            {
              prop: 't_date',
              label: '日期'
            },
            {
              prop: 'elevator_box_name',
              label: '箱头号'
            },
            {
              prop: 'item_number',
              label: '编号'
            },
            {
              prop: 'item_desc',
              label: '描述'
            },
            {
              prop: 'err_msg',
              label: '异常信息'
            }
          ],
          'BOMZSXF': [ // BOM准时下发
            {
              prop: 't_no',
              label: '工号'
            },
            {
              prop: 't_cd',
              label: '开始时间'
            },
            {
              prop: 't_sd',
              label: '结束时间'
            },
            {
              prop: 'pd',
              label: '发布时间'
            },
            {
              prop: 'bs',
              label: '是否发布'
            },
            {
              prop: 'ebs',
              label: '是否准时'
            },
          ],
          'HHZJL': [ // 回货准交率
            {
              prop: 'item_desc',
              label: '描述'
            },
            {
              prop: 'item_number',
              label: '编号'
            },
            {
              prop: 'line_num',
              label: '线性数量'
            },
            {
              prop: 'need_by_date',
              label: '需求日期'
            },
            {
              prop: 'po_num',
              label: 'po_num'
            },
            {
              prop: 'quantity',
              label: '收货'
            },
            {
              prop: 'quantity_received',
              label: '收货数量'
            },
          ],
          'GDZJL': [ // 工单准交率
            {
              prop: 'completion_date',
              label: '完工日期'
            },
            {
              prop: 'item_desc',
              label: '描述'
            },
            {
              prop: 'item_number',
              label: '编号'
            },
            {
              prop: 'primary_uom_code',
              label: '单位'
            },
            {
              prop: 'quantity',
              label: '数量'
            },
            {
              prop: 'schedule_completion_date',
              label: '计划完成日期'
            },
            {
              prop: 'wip_entity_name',
              label: '实体名称'
            },
          ],
          'CTCPFB': [ // 出梯产品分布
            {
              prop: 'elevator_no',
              label: '工号'
            }, 
            {
              prop: 'contract_number',
              label: '合同号'
            },
            {
              prop: 'shipmentdate',
              label: '装运日期'
            },
            {
              prop: 'elv_majortype',
              label: '梯型'
            },
            {
              prop: 'model_code',
              label: '型号'
            },
          ],
          'CTZSL': [ // 出梯准时率
            {
              prop: 'elevator_no',
              label: '工号'
            }, 
            {
              prop: 'contract_number',
              label: '合同号'
            },
            {
              prop: 'ontime_flag',
              label: '准时标志'
            },
            {
              prop: 'schedule_delivery_date',
              label: '交货日期'
            },
            {
              prop: 'shipment_date',
              label: '发货日期'
            },
          ],
          "LJFY": [ // 累计发运
            {
              prop: 'elevator_no',
              label: '工号'
            }, 
            {
              prop: 'actual_ship_date',
              label: '实际发货日期'
            },
            {
              prop: 'elevator_box_name',
              label: '箱头号'
            },
            {
              prop: 'entity_box_quantity',
              label: '实体箱数量'
            },
            {
              prop: 'shipment_num',
              label: '发货号'
            },
          ],
          'QYTS': [ // 签约台量分布
            {
              prop: 'elevator_no',
              label: '工号'
            }, 
            {
              prop: 'contract_date',
              label: '合同日期'
            },
            {
              prop: 'contract_number',
              label: '合同号'
            },
            {
              prop: 'model_code',
              label: '型号'
            },
          ],
          'HTBGQS': [ // 合同变更趋势
            {
              prop: 'change_no',
              label: '变更号'
            },
            {
              prop: 'start_time',
              label: '开始时间'
            },
            {
              prop: 'change_type',
              label: '变更类型'
            },
            {
              prop: 'flw_time',
              label: '用时(min)'
            },
          ],
          'HTLCQS': [ // 合同流程趋势
            {
              prop: 'contract_no',
              label: '合同号'
            },
            {
              prop: 'start_time',
              label: '开始时间'
            },
            {
              prop: 'contract_type',
              label: '合同类型'
            },
            {
              prop: 'flw_time',
              label: '用时(min)'
            },
          ],
          'TJFBQS': [ // 土建非标趋势
            {
              prop: 'drawing_task_no_version',
              label: '任务版本'
            },
            {
              prop: 'equip_no',
              label: '设备编号'
            },
            {
              prop: 'start_time',
              label: '开始时间'
            },
            {
              prop: 'draw_type',
              label: '类型'
            },
          ],
          'CPFBQS': [ // 产品非标趋势
            {
              prop: 'productno',
              label: '生产编号'
            },
            {
              prop: 'equipno',
              label: '设备编号'
            },
            {
              prop: 'producttype',
              label: '类型'
            },
            {
              prop: 'createtime',
              label: '创建时间'
            },
          ],
          'GHSX': [ // 生效台量
            {
              prop: 'elevator_no',
              label: '工号'
            }, 
            {
              prop: 'valid_date',
              label: '有效日期'
            },
            {
              prop: 'contract_number',
              label: '合同号'
            },
            {
              prop: 'model_code',
              label: '型号'
            },
          ],
          'PCTL': [ // 排产台量
            {
              prop: 'elevator_no',
              label: '工号'
            }, 
            {
              prop: 'approve_date',
              label: '批准日期'
            },
            {
              prop: 'contract_number',
              label: '合同号'
            },
            {
              prop: 'model_code',
              label: '型号'
            },
          ],
          'JHGYCGSX': [ // 计划工艺采购时效
            {
              prop: 'business_no',
              label: '业务编号'
            }, 
            {
              prop: 'maintain_type',
              label: '维护类型'
            },
            {
              prop: 'create_time',
              label: '创建日期'
            },
            {
              prop: 'end_time',
              label: '完成日期'
            },
            {
              prop: 'process_min',
              label: '用时(min)'
            },
          ],
          'KCDZ': [ // 库存呆滞
            {
              prop: 'segment1',
              label: '工号'
            }, 
            {
              prop: 'period_name',
              label: '日期'
            },
            {
              prop: 'description',
              label: '描述'
            },
            {
              prop: 'inv_cost',
              label: '呆滞'
            },
            {
              prop: 'stock_cost',
              label: '库存'
            },
          ],
          'HTGCBG': [ // 合同工程变更
            {
              prop: 'elevator_no',
              label: '工号'
            }, 
            {
              prop: 'contract_number',
              label: '合同编号'
            },
            {
              prop: 'publish_date',
              label: '发布日期'
            },
            {
              prop: 'upgrade_reason',
              label: '升级原因'
            }
          ],
          'CTZQ': [ // 出梯周期
            {
              prop: 'elevator_no',
              label: '工号'
            }, 
            {
              prop: 'elevator_class_code',
              label: '梯型'
            },
            {
              prop: 'period_name',
              label: '日期'
            },
            {
              prop: 'consume_day',
              label: '天数'
            }, 
            {
              prop: 'shipment_date',
              label: '发货日期'
            },
            {
              prop: 'confirm_date',
              label: '收货日期'
            },
          ],
          'LLJS': [ // 来料接收PPM
            {
              prop: 'receipt_num',
              label: '工号'
            }, 
            {
              prop: 'item_number',
              label: '编号'
            },
            {
              prop: 'item_description',
              label: '描述'
            },
            {
              prop: 'quantity_defect',
              label: '缺陷数量'
            }
          ],
          'KHTSBL': [ // 客户投诉不良
            {
              prop: 'contract_no',
              label: '合同编号'
            }, 
            {
              prop: 'year_month',
              label: '年月份'
            },
            {
              prop: 'project_name',
              label: '项目名称'
            },
            {
              prop: 'customer_name',
              label: '客户名称'
            }, 
            {
              prop: 'product_no',
              label: '生产编号'
            },
            {
              prop: 'elevator_model',
              label: '梯型'
            },
            {
              prop: 'deliver_time',
              label: '交货日期'
            }, 
            {
              prop: 'regional_application_time',
              label: '区域应用日期'
            },
            {
              prop: 'installation_unit',
              label: '安装单元'
            },
            {
              prop: 'problem_description',
              label: '问题描述'
            }, 
          ],
          'AZHT': [ // 安装合同分布
            {
              prop: 'ele_no',
              label: '工号'
            }, 
            {
              prop: 'finishdate',
              label: '完成日期'
            },
            {
              prop: 'elevator_model',
              label: '梯型'
            }, 
            {
              prop: 'number',
              label: '编号'
            },
            {
              prop: 'name',
              label: '名称'
            },
            {
              prop: 'from_area_name',
              label: '区域名称'
            },
          ],
          'ZAZTL': [ // 在安装台量
            {
              prop: 'ele_no',
              label: '工号'
            }, 
            {
              prop: 'ym',
              label: '日期'
            },
            {
              prop: 'elevator_model',
              label: '梯型'
            }, 
            {
              prop: 'number',
              label: '编号'
            },
            {
              prop: 'install_address',
              label: '安装地址'
            },
            {
              prop: 'type',
              label: '类型'
            },
          ],
          'AZZQ': [ // 安装周期
            {
              prop: 'ele_no',
              label: '工号'
            }, 
            {
              prop: 'ym',
              label: '日期'
            },
            {
              prop: 'elevator_model',
              label: '梯型'
            }, 
            {
              prop: 'number',
              label: '编号'
            },
            {
              prop: 'install_address',
              label: '安装地址'
            },
            {
              prop: 'type',
              label: '类型'
            },
          ],
          'CJHGL': [ // 厂检合格率
            {
              prop: 'ele_no',
              label: '工号'
            }, 
            {
              prop: 'name',
              label: '姓名'
            },
            {
              prop: 'elevator_model',
              label: '梯型'
            }, 
            {
              prop: 'number',
              label: '编号'
            },
            {
              prop: 'finishdate',
              label: '完成日期'
            },
            {
              prop: 'from_area_name',
              label: '来源'
            },
          ],
          'ZXYCHG': [ // 装箱一次合格
            {
              prop: 'elevator_no',
              label: '工号'
            }, 
            {
              prop: 'elevator_box_name',
              label: '箱头号'
            },
            {
              prop: 'pack_status',
              label: '包装状态'
            }, 
            {
              prop: 'reissue_flag',
              label: '重发'
            },
            {
              prop: 'schedule_completion_date',
              label: '计划完成日期'
            },
            {
              prop: 'pack_date',
              label: '包装日期'
            },
          ],
          'GHQT': [ // 工号齐套率
            {
              prop: 'elevator_no',
              label: '工号'
            }, 
            {
              prop: 'schedule_completion_date',
              label: '计划完成日期'
            },
            {
              prop: 'kitting_flag',
              label: '标识'
            }, 
            {
              prop: 'shipment_num',
              label: '发货号'
            },
          ]
        },
        tableData: [],
        responseData: []
      }
    },
    watch: {

    },
    computed: {
      title() {
        return this.queryChartOption.title.text.replaceAll('\n', '')
      },
      chartId() {
        return this.$router.currentRoute.query.id.toLocaleUpperCase()
      },
      chartOption() {
        const yAxis = this.queryChartOption.yAxis
        if(yAxis instanceof Array) {
          yAxis.forEach(i => {
            i.show = true
            i.axisLine.show = true
            i.axisTick.show = true
          })
        } else {
          yAxis.show = true
          yAxis.axisLine.show = true
          yAxis.axisTick.show = true
        }
        const xAxis = this.queryChartOption.xAxis
        if(xAxis.data.length > 0) {
          xAxis.axisLabel.formatter = function (value) {
            return moment(value).format('M') + '月'
          }
        }
        return {
          ...this.queryChartOption,
          title: '',
          grid: this.detailGrid,
          legend: {...this.queryChartOption.legend, show: true}
        }
      },
      tableColumn() {
        return [...this.baseColumn, ...this.columns[this.chartId]]
      },
      searchTitle() {
        return this.columns[this.chartId][0].label
      },
    },
    async mounted() {
      const detailChartDOM = document.getElementById('detailChart')
      const _this = this
      const bottom = 25;
      const searchH = (document.getElementById('search').offsetHeight) + bottom + 10;
      const h = `calc(100% - ` + searchH + `px)`;
      detailChartDOM.style.height = h;
      detailChartDOM.style.marginBottom = bottom + 'px';
      const myChart = echarts.init(detailChartDOM)
      myChart.setOption(this.chartOption)

      await this.handleSearch(this.searchValue)

      window.addEventListener('resize', () => myChart.resize(), true)
    },
    created() {
    },
    methods: {
      loadNext() {
        if(this.tableData.length < this.responseData.length) {
          let loadingInstance = Loading.service({
            target: '.myTable',
            text: 'Loading',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.3)'
          });
          setTimeout(() => {
            this.tableData = this.responseData
            loadingInstance.close()
          }, 500)
          return true
        } else return false
      },
      // 点击左边的搜索
      async handleSearch(searchValue) {
        let loadingInstance = Loading.service({
          target: '.myTable',
          text: 'Loading',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.3)'
        });
        await myApp.post(allAPI[`QUERY_${this.chartId}_DETAIL`], {'number': searchValue}).then((res) => {
          if (res.status == 1 && res.data) {
            this.tableData = res.data.slice(0, config.chartDetailFirstLoadDataNum)
            this.responseData = res.data
            this.$nextTick(() => {
              loadingInstance.close();
            });
          }
        })
      },
    }
  }
</script>

<style lang="scss" scoped>
  @import "src/style/variables";

  .chartDetail {
    background-color: $bgColor;
    height: 100%;
    box-sizing: border-box;

    .content {
      display: flex;
      $leftW: 30%;
      $leftM: 2%; //左边和右边的距离间隔
      height: calc(100% - #{$headH}); //报价单人员排名表格高度

      .content_left {
        width: $leftW;
        padding: $leftM/2;

        #detailChart {
          /* height: 70%; */
          width: 100%;
          box-sizing: border-box;
        }

        .search {
          border: 1px solid $borderColor;
          padding: 1rem;

          .line {
            display: flex;
            justify-content: flex-start;
            align-items: center;
            margin-bottom: 10px;
            /* height: $htbglineHeight; */
            &:last-child {
              padding-top: 40px;
            }

            .line_left {
              width: calc(100% - #{$htbglineHeight});
            }

            .search_top {
              height: 2.5rem;
              border: 1px solid $borderColor;
              padding-left: 10px;
              width: 100%;
              line-height: 2.5rem;
            }
          }

          .searchIcon {
            border: 1px solid $borderColor;
            vertical-align: middle;
            height: $htbglineHeight;
            width: $htbglineHeight;
            line-height: $htbglineHeight;
            text-align: center;
            box-sizing: border-box;
          }
        }
      }

      .content_right {
        width: calc(100% - #{$leftW});
      }
    }
  }
</style>