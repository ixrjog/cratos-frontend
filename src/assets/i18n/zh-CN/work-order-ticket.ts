export default {
  workOrderTicket: {
    application: {
      prod: {
        tips: '审批完成后，您需在15分钟内完成相关操作。',
      }
    },
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
    aliyunOns: {
      topic: {
        topicName: {
          tips: '以 TOPIC_ 开头，长度限制为 1 ~ 60 个字符，只能包含大写英文、数字、短横线（-）、下划线（_）。同时，系统会保留部分命名方式不允许使用。',
        },
        messageTypes: {
          title: {
            normal: '普通消息',
            transaction: '事务消息',
            delay: '定时/延时消息',
            fifo: '顺序消息',
          },
          desc: {
            normal: '普通消息适用于系统间异步解耦、削峰填谷、日志服务、大规模机器的Cache同步以及实时计算分析等场景。普通Topic不能用于顺序、定时/延时、事务消息使用，避免造成混用带来的消息异常。',
            transaction: '事务消息提供类似 X/Open XA 的分布事务功能，通过事务消息能达到分布式事务的最终一致。',
            delay: '定时/定时消息是指将消息发送到MQ服务端，在消息发送时间（当前时间）之后的指定时间点进行投递，例如指定在2016/01/01 15:00:00进行消息投递。延时消息是指将消息发送到MQ服务端，在消息发送时间（当前时间）之后的指定延迟时间点进行投递，比如指定在消息发送时间的30分钟之后进行投递。',
            fifo: '顺序消息是 RocketMQ提供的高级消息类型，适用于有序事件处理、撮合交易、数据实时增量同步等场景。',
          }
        }
      },
      consumerGroup: {
        consumerGroupId: {
          tips: '以 GID_ 开头，长度限制为 1 ~ 60 个字符，只能包含大写英文、数字、短横线（-）、下划线（_）。同时，系统会保留部分命名方式不允许使用，'
        },
        deliveryOrderType: {
          title: {
            concurrently: '并发投递',
            orderly: '顺序投递',
          },
          desc: {
            concurrently: '该模式下服务端投递消息将按照高吞吐效率优先并发处理，消息之间无顺序依赖。即使设置了相同MessageGroup的顺序消息也会无序投递。',
            orderly: '顺序投递模式下消费者只能按照消息分组的顺序获取消息，前面的消息没有提交完成则无法获取消费后续的消息。',
          }
        },
        retryPolicy: {
          title: {
            fixedRetryPolicy: '阶梯退避',
            defaultRetryPolicy: '阶梯退避重',
          },
          desc: {
            fixedRetryPolicy: '并发投递模式下消费重试间隔遵循阶梯避退策略。',
            defaultRetryPolicy: '固定间隔策略下，PushConsumer会在本地按照固定间隔重试。',
          }
        }
      }
    }
  },
};
