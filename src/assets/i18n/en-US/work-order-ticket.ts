export default {
  workOrderTicket: {
    application: {
      prod: {
        tips: 'After the approval is completed, you need to complete the relevant operations within 15 minutes.',
      }
    },
    podDelete: {
      tips: 'Approved tickets provide a 2-hours window for pod deletion, and the entire operation process will be fully recorded in the ticket.',
    },
    elasticScaling: {
      application: {
        tips: 'Application elastic scaling, conforms to the SRE specification.',
      },
      deployment: {
        tips: 'Specify Deployment to adjust the replica.',
      },
    },
    awsTransferSftp: {
      tips1: '1. Start with a letter, digit, or underscore',
      tips2: '2. Continue with 2-99 characters that can be letters, digits, underscores, @, periods, or hyphens',
      tips3: '3. Have a total length between 3-100 characters',
    },
    aliyunOns: {
      topic: {
        topicName: {
          tips: 'Start with TOPIC_ , The name must be 1 to 60 characters in length, and can contain only capital letters, digits, hyphens (-), and underscores (_). Some names are reserved for the system and cannot be used.',
        },
        messageTypes: {
          title: {
            normal: 'Normal',
            transaction: 'Transaction',
            delay: 'Scheduler/Delayed',
            fifo: 'Ordered',
          },
          desc: {
            normal: 'Normal messages are applicable to scenarios such as asynchronous decoupling between systems, load shifting, log service, large-scale cache synchronization between brokers, and real-time computing and analysis. A topic for normal messages cannot be used for ordered messages, scheduled and delayed messages, and transactional messages. This prevents message exceptions caused by mixed use.',
            transaction: 'Message Queue for Apache RocketMQ provides a distributed transaction processing feature that is similar to X/Open XA to ensure transaction consistency by using transactional messages. ',
            delay: 'A scheduled message is sent to a RocketMQ broker and delivered at a specified point in time after the message is sent. For example, you can specify the RocketMQ broker to deliver the message at 15:00:00 on January 1, 2016. A delayed message is sent to a RocketMQ broker and delivered after a specified period of time, for example, 30 minutes after the message is sent. ',
            fifo: 'Ordered messages are an advanced type of messages that are provided by Message Queue for Apache RocketMQ. Ordered messages are applicable to scenarios such as orderly event processing, matching transactions, and real-time synchronization of incremental data.',
          }
        }
      },
      consumerGroup: {
        consumerGroupId: {
          tips: 'Start with GID_ , The name must be 1 to 60 characters in length and can contain only capital letters, digits, hyphens (-), and underscores (_). Specific names are reserved for the system and cannot be used.'
        },
        deliveryOrderType: {
          title: {
            concurrently: 'Concurrent',
            orderly: 'Ordered',
          },
          desc: {
            concurrently: 'In this mode, messages delivered by a broker are concurrently processed based on the policy of ensuring high throughput, and no order dependency exists between messages. Even ordered messages that belong to the same message group are also delivered out of order. ',
            orderly: 'In ordered delivery mode, consumers can obtain messages only in the order in which they are grouped. If a message is not submitted, consumers cannot obtain subsequent messages.',
          }
        },
        retryPolicy: {
          title: {
            fixedRetryPolicy: 'Fixed Interval',
            defaultRetryPolicy: 'Exponential backoff',
          },
          desc: {
            fixedRetryPolicy: 'If a fixed interval is used, PushConsumer retries locally at the fixed interval. ',
            defaultRetryPolicy: 'In concurrent delivery mode, the interval at which the system retries message consumption increases as the number of retries increases.',
          }
        }
      }
    },
    frontend: {
      applicationName: {
        tips: 'Start with a letter and can only contain lowercase letters, numbers, and hyphens.',
      },
      mappingsPath: {
        tips1: 'Filling Rules',
        tips2: '● Path Levels: Maximum 2 levels (e.g., path or path/subpath)',
        tips3: '● Allowed Characters: Letters, numbers, hyphens (-), underscores (_), dots (.)',
        tips4: '● Slashes: Leading and trailing / are optional',
        tips5: '● Length: Each path segment must have at least 1 character',
      }
    },
    aliyunKms: {
      tips: 'see more application credential , please click here',
      secretName: {
        tips: '{env}_{applicationName}_{tenant}_{countryCode}_{cloudService}_{secretType}_{userCustom}',
        envTips: '● env: dev | daily | sit | pre | prod',
        countryCodeTips: '● countryCode<optional>: ng | gh | bd | tz | ...',
        cloudServiceTips: '● cloudService<optional>: oss | ons | s3 | sqs | sns | ...',
        secretTypeTips: '● secretType<optional>: token | accessId | secretKey | username | password | ...',
        userCustomTips: '● userCustom<optional>: User defined credential suffix',
      }
    }
  },
};
