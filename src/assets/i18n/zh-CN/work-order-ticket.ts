export default {
  workOrderTicket: {
    podDelete: {
      tips: '审批通过的工单提供2小时的有效期用于pod删除，操作过程会被完整记录在工单内。',
    },
    elasticScaling: {
      application: {
        tips: '应用维度弹性伸缩，符合SRE分组规范。',
      },
      deployment: {
        tips: '指定Deployment调整副本大小。',
      },
    },
  },
};
