<template>
    <div>
        <el-table cell-class-name="tableItem" :height="height?height:550" :row-class-name="tableRowClassName"
            size="mini" :data="tableData" stripe border style="width: 100%" @row-dblclick="rowdbClick"
            @selection-change="handleSelectionChange">
            <el-table-column v-if="!noCheck" type="selection" width="55">
            </el-table-column>
            <template v-for="item in tableColumn">
                <el-table-column :width="item.width?item.width:'auto'" :class-name="item.className?item.className:''"
                    :prop="item.prop" v-if="!item.operate" :label="item.label">
                    <template slot-scope="scope">
                        <span class="content" v-if="item.type=='time'">
                            {{moment(scope.row[item.prop]).format("YYYY-MM-DD HH:mm:ss")}}
                        </span>
                        <template v-else>
                            <span v-if="!item.isShowTip" class="content">
                                {{scope.row[item.prop]}}</span>
                            <el-popover popper-class="tableBg" v-else placement="bottom" trigger="click"
                                :content="scope.row[item.prop]">
                                <span class="exit" slot="reference">{{scope.row[item.prop]}}</span>
                            </el-popover>
                            <!-- <el-tooltip v-else popper-class="tableItemTooltip" effect="dark"
                                :content="scope.row[item.prop]" placement="right">
                                <span class="content">
                                    {{scope.row[item.prop]}}</span>
                            </el-tooltip> -->
                        </template>
                    </template>
                </el-table-column>
                <el-table-column :prop="item.prop" v-else fixed="right" label="操作" width="100">
                    <template slot-scope="scope">
                        <el-button v-for="btn in item.btnList" size="small" @click="clickBtn(scope.row,item)"
                            type="text">
                            {{btn.label}}</el-button>
                    </template>
                </el-table-column>
            </template>

        </el-table>
        <el-pagination v-if="!noShowPage" @size-change="handleSizeChange" @current-change="handleCurrentChange"
            :current-page="pagination.currentPage" :page-sizes="[10,50,100, 200, 300, 400]"
            :page-size="pagination.pageSize" :pager-count="5" layout="total, sizes, prev, pager, next, jumper"
            :total="pagination.total">
        </el-pagination>
    </div>
</template>

<script>
    import { myApp } from "@/api/app";
    import { elevatorAPI } from "@/api/apiValue";
    import moment from 'moment'
    // 例子 tableColumn: [
    //                 {
    //                     prop: 'contract_no',
    //                     label: '合同号'
    //                 },
    //                 {
    //                     operate: true,
    //                     btnList: [
    //                         {
    //                             label: "查看报文"
    //                         }
    //                     ]
    //                 }
    //             ],
    export default {
        name: 'XTableComp',
        props: ['pagination', 'tableColumn', 'tableData', 'noShowPage', 'height', "noCheck"],
        data() {
            return {
                moment: moment
            }
        },

        computed: {

        },
        mounted() {

        },
        created() {

        },
        methods: {
            tableRowClassName({ row, rowIndex }) {
                if (rowIndex % 2 === 0) {
                    return 'warning-row';
                } else {
                    return 'success-row';
                }
            },
            clickBtn(row, item) {
                this.$emit("clickBtn", { ...row, ...item })
            },
            rowdbClick(row, column, cell) {
                this.$emit("rowdbClick", { ...row, property: column.property })
            },
            handleSizeChange(val) {
                this.$emit("handleChangePage", { flag: "pageSize", value: val })
            },
            handleCurrentChange(val) {
                this.$emit("handleChangePage", { flag: "currentPage", value: val })
            },
            handleSelectionChange(val) {
                this.$emit("handleSelectionChange", val)
            }
        },
    } 
</script>
<style scoped>
    .el-table /deep/ .warning-row {
        background: rgb(230, 253, 244) !important;
    }

    .el-table /deep/ .success-row {
        background: #e2b00c !important;
    }

    .content {
        overflow: hidden;
        white-space: nowrap;

    }

    .content:hover {
        cursor: pointer;
    }
</style>