<template>
  <div>
    <slot name="search"></slot>
  </div>
</template>

<script>
  import { myApp } from "@/api/app";
  import { elevatorAPI } from "@/api/apiValue";

  export default {
    name: 'Dashboard',
    data() {
      return {
        loading: false,
        columns: [
          {
            prop: 'machineKindCode',
            label: '编码',
          },
          {
            prop: 'internationalText',
            label: '梯种名称',
          },
          {
            prop: 'displaySeq',
            label: '顺序',
          },
          {
            prop: 'isDefault',
            label: '是否默认梯形',
          }
        ],
        tableData: [],
        multipleSelection: []
      }
    },
    computed: {

    },
    mounted() {
      // this.loading=true;
      // myApp.post(null,elevatorAPI.SEARCH_ELEVATOR,{}).then((res)=>{
      //   this.loading=false
      //   if(res.code==1){
      //     this.tableData=res.data
      //   }
      // })
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
      handleSelectionChange(val) {
        this.multipleSelection = val;
      }
    }
  }
</script>
<style scoped>
  .el-table /deep/ .warning-row {
    background: oldlace !important;
  }

  .el-table /deep/ .success-row {
    background: #f0f9eb !important;
  }
</style>