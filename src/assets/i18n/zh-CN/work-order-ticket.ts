export default {
  workOrderTicket: {
    dataTable: {
      searchPlaceholder: '搜索工单号',
      selectWorkOrder: '选择工单',
      selectUser: '选择用户',
      showOnlyMySubmit: '仅显示我提交的',
      filter: '筛选',
      fetchData: '获取数据',
      headers: {
        no: '编号',
        name: '名称',
        applicant: '申请人',
        state: '状态',
        time: '时间',
        actions: '操作',
      },
      timeLabels: {
        submit: '提交',
        complete: '完成',
      },
    },
    menu: {
      new: '新建',
      select: '选择',
    },
    base: {
      options: '选项',
      content: '内容',
      approvalInfo: '审批信息',
      applyRemark: '申请说明',
      approveRemark: '审批意见',
    },
    state: {
      all: '全部',
      new: '新建',
      inApproval: '审批中',
      inProgress: '执行中',
      completed: '完成',
    },
    aliyunDataworks: {
      headers: {
        aliyunInstance: '阿里云实例',
        akRamUser: 'AK RAM用户',
        actions: '操作',
        result: '结果',
      },
      labels: {
        instance: '实例',
      },
    },
    cloudIdentityReset: {
      headers: {
        instance: '实例',
        loginUsername: '登录用户名',
        loginLink: '登录链接',
        password: '重置密码',
        mfa: '解绑 MFA',
        actions: '操作',
        result: '结果',
      },
      labels: {
        account: '账户',
        password: '重置密码',
        mfa: '解绑 MFA',
      }
    },
    applicationFrontend: {
      headers: {
        applicationName: '应用名称',
        type: '类型',
        level: '级别',
        repositorySshUrl: '仓库SSH地址',
        description: '描述',
        actions: '操作',
        result: '结果',
      },
      labels: {
        applicationName: '应用名称',
        level: '级别',
        cloneOf: '克隆自',
        gitlabInstance: 'GitLab实例',
        gitlabProject: 'GitLab项目',
        domain: '域名',
        mappingsPath: '映射路径',
        urlPreview: 'URL预览',
        comment: '备注',
      },
      applicationName: {
        tips: '以字母开头，只能包含小写字母、数字和 - 。',
      },
      mappingsPath: {
        tips1: '填写规则',
        tips2: '● 路径层级：最多2级（如：path 或 path/subpath）',
        tips3: '● 允许字符：字母、数字、连字符(-)、下划线(_)、点号(.)',
        tips4: '● 斜杠：开头和结尾的 / 可选',
        tips5: '● 长度：每个路径段至少1个字符',
      },
    },
    aliyunKmsSecret: {
      headers: {
        aliyunInstance: '阿里云实例',
        secretName: '密钥名称',
        version: '版本',
        encryptionKeyId: '加密密钥ID',
        configCenterValue: '配置中心值',
        description: '描述',
        actions: '操作',
        result: '结果',
      },
      labels: {
        instance: '实例',
        kmsInstance: 'KMS实例',
        kmsEncryptionKey: 'KMS加密密钥',
        application: '应用',
        env: '环境',
        secretName: '密钥名称',
        secretData: '密钥数据',
        version: '版本',
        description: '描述',
      },
      tips: '点击查看更多应用凭据',
      secretName: {
        tips: '{环境}_{应用名称}_{租户}_{国家码}_{云服务}_{凭据类型}_{用户自定义}',
        envTips: '● 环境: dev | daily | sit | pre | prod',
        countryCodeTips: '● 国家码<可选>: ng | gh | bd | tz | ...',
        cloudServiceTips: '● 云服务<可选>: oss | ons | s3 | sqs | sns | rds | ...',
        secretTypeTips: '● 凭据类型<可选>: token | accessId | secretKey | username | password | ...',
        userCustomTips: '● 用户自定义<可选>: 用户自定义后缀',
      },
    },
    aliyunKmsSecretUpdate: {
      headers: {
        aliyunInstance: '阿里云实例',
        secretName: '密钥名称',
        version: '版本',
        configCenterValue: '配置中心值',
        description: '描述',
        actions: '操作',
        result: '结果',
      },
      labels: {
        instance: '实例',
        kmsSecret: 'KMS 密钥',
        secretData: '密钥数据',
        version: '版本',
      },
      riskTips: '检测到您不是改密钥创建者！',
      tips: '我已悉知并确认所有风险，仍要继续操作',
    },
    awsTransferSftp: {
      headers: {
        instance: '实例',
        transferUsernameServer: '传输用户名@服务器',
        keyFingerprint: '密钥指纹',
        description: '描述',
        actions: '操作',
        result: '结果',
      },
      labels: {
        instance: '实例',
        transferServer: '传输服务器',
        username: '用户名',
        publicKey: '公钥',
        description: '描述',
      },
      tips1: '1. 字符串必须以一个字母、数字或下划线开头',
      tips2: '2. 之后可以包含字母、数字、下划线、@符号、点号或连字符',
      tips3: '3. 总长度必须在3到100个字符之间（第一个字符加上后面的2-99个字符）',
    },
    cloudIdentity: {
      headers: {
        instance: '实例',
        ramLoginUsername: 'RAM登录用户名',
        loginLink: '登录链接',
        actions: '操作',
        result: '结果',
      },
      labels: {
        instance: '实例',
      },
    },
    cloudPolicy: {
      headers: {
        instance: '实例',
        loginUrl: '登录地址',
        policyName: '策略名称',
        policyDesc: '策略描述',
        actions: '操作',
        result: '结果',
      },
      labels: {
        instance: '实例',
        cloudPolicy: '云策略',
      },
    },
    elasticScaling: {
      headers: {
        application: '应用',
        namespace: '命名空间',
        currentReplicas: '当前副本数',
        expectedReplicas: '期望副本数',
        scalingType: '扩缩容类型',
        instance: '实例',
        deployment: '部署',
        actions: '操作',
        result: '结果',
      },
      labels: {
        application: '应用',
        namespace: '命名空间',
        deployment: '部署',
        expectedReplicas: '期望副本数',
      },
      application: {
        tips: '应用维度弹性伸缩，符合SRE分组规范。',
      },
      deployment: {
        tips: '指定Deployment调整副本大小。',
      },
    },
    gitlab: {
      headers: {
        instance: '实例',
        sshUrl: 'SSH地址',
        role: '角色',
        actions: '操作',
        result: '结果',
      },
      labels: {
        instance: '实例',
        gitlabPermission: 'GitLab权限',
        role: '角色',
      },
    },
    ldapIdentity: {
      headers: {
        ldapRole: 'LDAP角色',
        description: '描述',
        actions: '操作',
        result: '结果',
      },
      labels: {
        group: '组',
        role: '角色',
      },
    },
    mailIdentityReset: {
      headers: {
        instance: '实例',
        mail: '邮箱',
        loginLink: '登录链接',
        actions: '操作',
        result: '结果',
      },
      labels: {
        account: '账户',
      },
    },
    podDelete: {
      headers: {
        application: '应用',
        comment: '备注',
        tags: '标签',
        instance: '实例',
        namespace: '命名空间',
        deployment: '部署',
        pod: 'Pod',
        deleteOperationTime: '删除操作时间',
        actions: '操作',
        result: '结果',
      },
      labels: {
        application: '应用',
      },
      tips: '审批通过的工单提供2小时的有效期用于pod删除，操作过程会被完整记录在工单内。',
    },
    applicationRedeploy: {
      headers: {
        application: '应用',
        comment: '备注',
        tags: '标签',
        instance: '实例',
        namespace: '命名空间',
        deployment: '部署',
        redeployTime: '重新部署时间',
        actions: '操作',
        result: '结果',
      },
      labels: {
        application: '应用',
      },
      tips: '审批通过的工单提供2小时的有效期用于应用重新部署，操作过程会被完整记录在工单内。',
    },
    userRevoke: {
      headers: {
        businessType: '业务类型',
        subType: '子类型',
        instance: '实例',
        account: '账户',
        actions: '操作',
        result: '结果',
      },
      labels: {
        user: '用户',
      },
    },
    businessPermission: {
      labels: {
        permission: '权限',
        namespaces: '命名空间',
        applyDuration: '申请时长',
      },
      application: {
        prod: {
          tips: '审批完成后，您需在15分钟内完成相关操作。',
        }
      },
    },
    aliyunOns: {
      headers: {
        instance: '实例',
        onsInstance: 'ONS实例',
        consumerGroup: '消费组',
        deliveryOrderType: '投递顺序类型',
        topicName: '主题名称',
        messageType: '消息类型',
        remark: '备注',
        actions: '操作',
        result: '结果',
      },
      labels: {
        instance: '实例',
        onsInstance: 'ONS实例',
        remark: '备注',
        topicName: '主题名称',
        messageType: '消息类型',
        groupId: '组ID',
        deliveryOrderType: '投递顺序类型',
        retryRules: '重试规则',
        retryPolicy: '重试策略',
        maxRetryTimes: '最大重试次数',
      },
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
    },
    riskChange: {
      labels: {
        applicant: '变更申请人',
        title: '标题',
        content: '内容',
      },
      headers: {
        applicant: '变更申请人',
        title: '标题',
        content: '内容',
      }
    }
  },
};
