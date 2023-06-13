 
const allAPI = {
  // 图表汇总---- 
  ORDER_PERFORMANCES_S:'/api/sxtl/getList1.json',  //生效台量
  QUERY_QYTL:'/api/qytlfb/getList1.json',  //签约台量分布
  QUERY_HTBGQS:'/api/htbgqs/getList1.json', //合同变更趋势
  QUERY_HTLCQS:'/api/htlcqs/getList1.json', //合同流程趋势
  QUERY_CTCPFB:'/api/ctcpfb/getList1.json', //出梯产品分布
  QUERY_CTZSL:'/api/ctzsl/getList1.json', //出梯准时率
  QUERY_TJFBQS:'/api/tjfbqs/getList1.json', //土建非标趋势
  QUERY_CPFBQS:'/api/cpfbqs/getList1.json', //产品非标趋势
  QUERY_PCTL:'/api/pctl/getList1.json', //排产台量
  QUERY_LJFY:'/api/accumulatedShipments/getAccumulatedShipmentsList.json', //累计发运
  QUERY_BOMZSXF:'/api/bomDownOnTime/getBomDownOnTime.json', //BOM准时下发
  QUERY_HHZJL:'/api/orderOnTimePayRate/getOrderOnTimePayRate.json', //回货准交率
  QUERY_GDZJL:'/api/workOrderOnTimePayRate/getWorkOrderOnTimePayRate.json', //工单准交率
  QUERY_JHYC:'/api/planErrors/getBomDownOnTime.json', //计划异常
  QUERY_HTGCCL:'/api/contractEngineeringProcessing/getContractEngineeringProcessing.json', //合同工程处理
  QUERY_JHGYCGSX:'/api/plannedProcessProcurementData/getList1.json', //计划工艺采购时效
  QUERY_KCDZ:'/api/stockStagnate/getStockStagnate.json', //库存呆滞
  QUERY_HTGCBG:'/api/contractEngineeringChange/getContractEngineeringChange.json', //合同工程变更
  QUERY_CTZQ:'/api/elevatorWorkPeriod/getElevatorWorkPeriod.json', //出梯周期
  QUERY_LLJS:'/api/incomingReceivePPM/getIncomingReceivePPM.json', //来料接收PPM
  QUERY_KHTSBL:'/api/customerComplaintDefectRate/getCustomerComplaintDefectRate.json', //客户投诉不良
  QUERY_AZHT:'/api/installationContractFB/getInstallationContractFB.json',  //安装合同分布
  QUERY_ZAZTL:'/api/installationTL/getInstallationTL.json', //在安装台量
  QUERY_AZZQ:'/api/installationPeriod/getInstallationPeriod.json', //安装周期
  QUERY_CJHGL:'/api/factoryInspectionQualificationRate/getFactoryInspectionQualificationRate.json', //厂检合格率
  QUERY_ZXYCHG:'/api/packFirstPassRate/getPackFirstPassRate.json', //装箱一次合格
  QUERY_GHQT:'/api/equipmentKitting/getEquipmentKitting.json', //工号齐套率

  // 图表明细
  QUERY_HTGCCL_DETAIL:'/api/contractEngineeringProcessing/getContractEngineeringProcessingDetail.json', //合同工程处理
  QUERY_BOMZSXF_DETAIL:'/api/bomDownOnTime/getBomDownOnTimeDetail.json', //BOM准时下发
  QUERY_JHYC_DETAIL:'/api/planErrors/getBomDownOnTimeDetail.json', //计划异常
  QUERY_HHZJL_DETAIL:'/api/orderOnTimePayRate/getOrderOnTimePayRateDetail.json', //回货准交率
  QUERY_GDZJL_DETAIL:'/api/workOrderOnTimePayRate/getWorkOrderOnTimePayRateDetail.json', //工单准交率
  QUERY_LJFY_DETAIL:'/api/accumulatedShipments/getAccumulatedShipmentsDetail.json', //累计发运
  QUERY_GHSX_DETAIL:'/api/sxtl/getList2.json',  //生效台量
  QUERY_QYTS_DETAIL:'/api/qytlfb/getList2.json',  //签约台量分布
  QUERY_HTBGQS_DETAIL:'/api/htbgqs/getList2.json', //合同变更趋势
  QUERY_HTLCQS_DETAIL:'/api/htlcqs/getList2.json', //合同流程趋势
  QUERY_CTCPFB_DETAIL:'/api/ctcpfb/getList2.json', //出梯产品分布
  QUERY_CTZSL_DETAIL:'/api/ctzsl/getList2.json', //出梯准时率
  QUERY_TJFBQS_DETAIL:'/api/tjfbqs/getList2.json', //土建非标趋势
  QUERY_CPFBQS_DETAIL:'/api/cpfbqs/getList2.json', //产品非标趋势
  QUERY_PCTL_DETAIL:'/api/pctl/getList2.json', //排产台量
  QUERY_JHGYCGSX_DETAIL:'/api/plannedProcessProcurementData/getList2.json', //计划工艺采购时效
  QUERY_KCDZ_DETAIL:'/api/stockStagnate/getStockStagnateDetail.json', //库存呆滞
  QUERY_HTGCBG_DETAIL:'/api/contractEngineeringChange/getContractEngineeringChangeDetail.json', //合同工程变更
  QUERY_CTZQ_DETAIL:'/api/elevatorWorkPeriod/getElevatorWorkPeriodDetail.json', //出梯周期
  QUERY_LLJS_DETAIL:'/api/incomingReceivePPM/getIncomingReceivePPMDetail.json', //来料接收PPM
  QUERY_KHTSBL_DETAIL:'/api/customerComplaintDefectRate/getCustomerComplaintDefectRateDetail.json', //客户投诉不良
  QUERY_AZHT_DETAIL:'/api/installationContractFB/getInstallationContractFBDetail.json',  //安装合同分布
  QUERY_ZAZTL_DETAIL:'/api/installationTL/getInstallationTLDetail.json', //在安装台量
  QUERY_AZZQ_DETAIL:'/api/installationPeriod/getInstallationPeriodDetail.json', //安装周期
  QUERY_CJHGL_DETAIL:'/api/factoryInspectionQualificationRate/getFactoryInspectionQualificationRateDetail.json', //厂检合格率
  QUERY_ZXYCHG_DETAIL:'/api/packFirstPassRate/getPackFirstPassRateDetail.json', //装箱一次合格
  QUERY_GHQT_DETAIL:'/api/equipmentKitting/getEquipmentKittingDetail.json', //工号齐套率

  // 设备交付状态查询
  QUERY_SBJFZTCX:'/api/sbjfztcx/getList2.json', //设备交付状态查询明细

  // 设备生产状态查询页
  QUERY_EPSH:'/api/equipmentProductionStatus/getEquipmentProductionStatusHeader.json', //设备生产状态-头表
  QUERY_EPSL:'/api/equipmentProductionStatus/getEquipmentProductionStatusLine.json', //设备生产状态-行表
}
export {
  allAPI 
}
