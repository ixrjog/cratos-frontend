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
    awsTransferSftp: {
      tips1: '1. 字符串必须以一个字母、数字或下划线开头',
      tips2: '2. 之后可以包含字母、数字、下划线、@符号、点号或连字符',
      tips3: '3. 总长度必须在3到100个字符之间（第一个字符加上后面的2-99个字符）',
    },
  },
};
