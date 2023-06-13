<template>
    <div class="container">
        <Head :title="title"></Head>
        <ul class="message">
            <li v-for="(item,index) in messageData" :key="index">{{ item }}</li>
        </ul>
        <div class="table-content">
            <el-table :data="tableBodyData" style="width: 100%;" row-key="no" border lazy :load="load"
                :tree-props="{ children: 'children', hasChildren: 'hasChildren' }" :indent="50" max-height="860" :cell-class-name="cellStyleFuc">
                <el-table-column v-for="(item, index) in tableHeadData" :key="index" :prop="item.prop" :label="item.label" :width="item.width" />
            </el-table>
        </div>
    </div>
</template>

<script>
import { myApp } from "@/api/app";
import { allAPI } from "@/api/apiValue";
import Head from '@/components/Head'
import config from '@/api/config'
import QuoteTableRank from './screen/QuoteTableRank.vue'
export default {
    name: 'EquipmentProductionStatus',
    components: { Head, QuoteTableRank },
    data() {
        const messageData = Object.values(myApp.getData('productionStatusData'))
        return {
            title: config.productionStatusTitle,
            messageData,
            tableHeadData: [
                {
                    prop: 'item_number',
                    label: '产品树',
                    width: 200
                },
                {
                    prop: 'item_desc',
                    label: '描述',
                },
                {
                    prop: 'quantity',
                    label: '数量',
                    width: 60
                },
                {
                    prop: 'uom_code',
                    label: '单位',
                    width: 60
                },
                {
                    prop: 'specifications',
                    label: '规格',
                },
                {
                    prop: 'make_buy_code',
                    label: '计划属性',
                    width: 80
                },
                {
                    prop: 'po_status',
                    label: '订单状态',
                    width: 100
                },
                {
                    prop: 'wip_status',
                    label: '工单状态',
                    width: 100
                },
                {
                    prop: 'operation_process',
                    label: '工序过程',
                    width: 120
                },
                {
                    prop: 'operation_result',
                    label: '工序完工',
                    width: 120
                },
                {
                    prop: 'completion_date',
                    label: '更新时间',
                    width: 120
                },
            ],
            tableBodyData: [],
        }
    },
    methods: {
        cellStyleFuc(option) {
            if([2,3,5,6,7,10].includes(option.columnIndex)) {
                return 'column-style'
            }
        },
        load(tree, treeNode, resolve) {
            const param = { number: tree.elevator_box_id }
            myApp.post(allAPI.QUERY_EPSL, param).then((res) => {
                if (res.status === 1 && res.data) {
                    res.data.forEach(i => i.no = `${tree.no}-${i.no}`)
                    resolve(res.data)
                }
            })
        },
    },
    mounted() {
        const param = { number: this.$router.currentRoute.query.elevator_id }
        myApp.post(allAPI.QUERY_EPSH, param).then((res) => {
          if (res.status === 1 && res.data) {
            this.tableBodyData = res.data
            this.tableBodyData.forEach(i => { i.hasChildren = true })
          }
        })
    },
    computed: {
    }
}
</script>

<style lang="scss" scoped>
@import "src/style/variables";

.container {
    background-color: $bgColor;
    height: 100%;
    padding: 10px;
    overflow: hidden;
    box-sizing: border-box;
    .message {
        height: 2rem;
        display: flex;
        width: 100%;
        margin: 1rem 0 0 0;
        font-size: 0.8rem;
        color: rgba($color: #fff, $alpha: 0.8);
        li {
            list-style-type: none;
            border-top: 1px solid $borderColor;
            border-left: 1px solid $borderColor;
            padding: 0 2rem;
            height: 2rem;
            background-color: rgb(63, 70, 91);
            text-align: center;
            line-height: 2rem;

            &:nth-child(7), &:last-child {
                border-right: 1px solid $borderColor;
            }

            &:nth-child(8) {
                margin-left: auto;
            }
        }
    }
    .table-content {
        height: calc(100% - 6rem);
        .el-table {
            font-size: 12px;
            color: #fff;

            ::v-deep .el-table__empty-block {
                background-color: $bgColor;
            }
        }
        ::v-deep .el-table th {
            background-image: linear-gradient(transparent, #00b0f0 99%);
            color: #fff;
            text-align: center;
        }
        ::v-deep .el-table tr, ::v-deep .el-table th {
            background-color: $bgColor;
            border-color: $borderColor;
        }
        .el-table--border {
            border-color: $borderColor;
        }
        ::v-deep .el-table--border td {
            border-right-color: $borderColor;
        }
        .el-table--border::after, .el-table--group::after, .el-table::before {
            background-color: $borderColor;
        }
        ::v-deep .el-table tbody tr:hover>td {
            background-color: $trHoverColor !important;
        }
        ::v-deep .el-table td {
            border-bottom: none;
        }
        ::v-deep .current-row {
            background-color: $trHoverColor !important;
        }
        ::v-deep .el-icon-arrow-right:before, ::v-deep .el-icon-loading:before {
            color: $borderColor;
        }
        ::v-deep .column-style {
            text-align: center;
        }
    }
}
</style>