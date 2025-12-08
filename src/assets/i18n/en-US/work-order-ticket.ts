export default {
  workOrderTicket: {
    dataTable: {
      searchPlaceholder: 'Search ticketNo',
      selectWorkOrder: 'Select work order',
      selectUser: 'Select user',
      showOnlyMySubmit: 'show only my submit',
      filter: 'Filter',
      fetchData: 'Fetch Data',
      headers: {
        no: 'No',
        name: 'Name',
        applicant: 'Applicant',
        state: 'State',
        time: 'Time',
        actions: 'Actions',
      },
      timeLabels: {
        submit: 'Submit',
        complete: 'Complete',
      },
    },
    menu: {
      new: 'New',
      select: 'Select',
    },
    base: {
      options: 'Options',
      content: 'Content',
      approvalInfo: 'Approval Info',
      applyRemark: 'Apply Remark',
      approveRemark: 'Approve Remark',
    },
    state: {
      all: 'ALL',
      new: 'NEW',
      inApproval: 'IN APPROVAL',
      inProgress: 'IN PROGRESS',
      completed: 'COMPLETED',
    },
    report: {
      title: 'Work Order Reports',
      monthlyReport: 'Work Order Monthly Report',
      nameReport: 'Work Order Name Report',
      timeRange: 'Time Range',
      totalCount: 'Total',
      noData: 'No Data',
      loading: 'Loading...',
      saveAsImage: 'Save as Image',
      dataView: 'Data View',
      switchToLine: 'Switch to Line Chart',
      switchToBar: 'Switch to Bar Chart',
      switchToStack: 'Switch to Stack',
      restore: 'Restore',
      selectAll: 'Select All',
      inverse: 'Inverse',
      workOrderCount: 'Work Order Count',
      refreshData: 'Refresh Data',
      refreshing: 'Refreshing...',
      exportData: 'Export Data',
      lastRefresh: 'Last Refresh',
      nameReportDesc: 'Shows the proportion of each type of work order',
      monthlyReportDesc: 'Shows the trend of work orders by month',
      dataType: 'Data Type',
      name: 'Name',
      unknown: 'Unknown',
      exportFailed: 'Failed to export data, please check the console for details'
    },
    cloudIdentityReset: {
      headers: {
        instance: 'Instance',
        loginUsername: 'Login Username',
        loginLink: 'Login Link',
        password: 'Reset Password',
        mfa: 'Unbind MFA',
        actions: 'Actions',
        result: 'Result',
      },
      labels: {
        account: 'Account',
        password: 'Reset Password',
        mfa: 'Unbind MFA',
      },
      mfa: {
        tips: 'After unbinding MFA, please log back in to set up a new QR code',
      }
    },
    applicationFrontend: {
      headers: {
        applicationName: 'Application Name',
        cloneOf: 'Clone of',
        level: 'Level',
        domain: 'Domain',
        mappingsPath: 'Mappings Path',
        repositorySshUrl: 'Repository SSH URL',
        description: 'Description',
        actions: 'Actions',
        result: 'Result',
      },
      labels: {
        applicationName: 'Application Name',
        level: 'Level',
        cloneOf: 'Clone of',
        gitlabInstance: 'GitLab Instance',
        gitlabProject: 'GitLab Project',
        domain: 'Domain',
        mappingsPath: 'Mappings Path',
        urlPreview: 'URL Preview',
        comment: 'Comment',
      },
      applicationName: {
        tips: 'Start with a letter and can only contain lowercase letters, numbers, and hyphens.',
      },
      mappingsPath: {
        tips1: 'Filling Rules',
        tips2: '● Path Levels: Maximum 2 levels (e.g., path or path/subpath)',
        tips3: '● Allowed Characters: Letters, numbers, hyphens (-), underscores (_), dots (.)',
        tips4: '● Slashes: Leading and trailing / are optional',
        tips5: '● Length: Each path segment must have at least 1 character',
      },
    },
    aliyunKmsSecret: {
      headers: {
        aliyunInstance: 'Aliyun Instance',
        secretName: 'Secret Name',
        version: 'Version',
        encryptionKeyId: 'Encryption Key ID',
        configCenterValue: 'Config Center Value',
        description: 'Description',
        repeated: 'Repeated',
        actions: 'Actions',
        result: 'Result',
      },
      labels: {
        instance: 'Instance',
        kmsInstance: 'KMS Instance',
        kmsEncryptionKey: 'KMS Encryption Key',
        application: 'Application',
        env: 'Env',
        secretName: 'Secret Name',
        secretData: 'Secret Value',
        version: 'Version',
        description: 'Description',
      },
      tips: 'see more application credential , please click here',
      secretName: {
        tips: 'The name can contain letters, digits, and the following special characters: _ / + = . @ -',
        tips1: '{env}_{applicationName}_{tenant}_{countryCode}_{cloudService}_{secretType}_{userCustom}',
        envTips: '● env: dev | daily | sit | pre | prod',
        countryCodeTips: '● countryCode<optional>: ng | gh | bd | tz | ...',
        cloudServiceTips: '● cloudService<optional>: oss | ons | s3 | sqs | sns | ...',
        secretTypeTips: '● secretType<optional>: token | accessId | secretKey | username | password | ...',
        userCustomTips: '● userCustom<optional>: User defined credential suffix',
      },
    },
    aliyunKmsSecretUpdate: {
      headers: {
        aliyunInstance: 'Aliyun Instance',
        secretName: 'Secret Name',
        version: 'Version',
        configCenterValue: 'Config Center Value',
        actions: 'Actions',
        result: 'Result',
      },
      labels: {
        instance: 'Instance',
        kmsSecret: 'Secret Name',
        secretData: 'Secret Value',
        version: 'Version',
      },
      riskTips: 'Detected that you are not the creator of this secret!',
      tips: 'I acknowledge and confirm all risks, and still want to continue the operation',
    },
    awsTransferSftp: {
      headers: {
        instance: 'Instance',
        transferUsernameServer: 'Transfer Username@Server',
        keyFingerprint: 'Key Fingerprint',
        description: 'Description',
        actions: 'Actions',
        result: 'Result',
      },
      labels: {
        instance: 'Instance',
        transferServer: 'Transfer Server',
        username: 'Username',
        publicKey: 'Public Key',
        description: 'Description',
      },
      tips1: '1. Start with a letter, digit, or underscore',
      tips2: '2. Continue with 2-99 characters that can be letters, digits, underscores, @, periods, or hyphens',
      tips3: '3. Have a total length between 3-100 characters',
    },
    cloudIdentity: {
      headers: {
        instance: 'Instance',
        accountId: 'Account ID',
        ramLoginUsername: 'RAM Login Username',
        loginLink: 'Login Link',
        actions: 'Actions',
        result: 'Result',
      },
      labels: {
        instance: 'Instance',
      },
    },
    cloudPolicy: {
      headers: {
        instance: 'Instance',
        loginUrl: 'Login URL',
        loginUsername: 'Login Username',
        policyName: 'Policy Name',
        policyDesc: 'Policy Desc',
        actions: 'Actions',
        result: 'Result',
      },
      labels: {
        instance: 'Instance',
        cloudPolicy: 'Cloud Policy',
      },
    },
    elasticScaling: {
      headers: {
        application: 'Application',
        namespace: 'Namespace',
        currentReplicas: 'Current Replicas',
        expectedReplicas: 'Expected Replicas',
        scalingType: 'Scaling Type',
        instance: 'Instance',
        deployment: 'Deployment',
        actions: 'Actions',
        result: 'Result',
      },
      labels: {
        application: 'Application',
        namespace: 'Namespace',
        deployment: 'Deployment',
        expectedReplicas: 'Expected Replicas',
      },
      application: {
        tips: 'Application elastic scaling, conforms to the SRE specification.',
      },
      deployment: {
        tips: 'Specify Deployment to adjust the replica.',
      },
    },
    gitlab: {
      headers: {
        instance: 'Instance',
        sshUrl: 'SSH URL',
        role: 'Role',
        actions: 'Actions',
        result: 'Result',
      },
      labels: {
        instance: 'Instance',
        gitlabPermission: 'GitLab Permission',
        role: 'Role',
      },
    },
    ldapIdentity: {
      headers: {
        ldapRole: 'LDAP Role',
        description: 'Description',
        actions: 'Actions',
        result: 'Result',
      },
      labels: {
        group: 'Group',
        role: 'Role',
      },
    },
    mailIdentityReset: {
      headers: {
        instance: 'Instance',
        mail: 'Mail',
        loginLink: 'Login Link',
        actions: 'Actions',
        result: 'Result',
      },
      labels: {
        account: 'Account',
      },
    },
    podDelete: {
      headers: {
        application: 'Application',
        comment: 'Comment',
        tags: 'Tags',
        instance: 'Instance',
        namespace: 'Namespace',
        deployment: 'Deployment',
        pod: 'Pod',
        deleteOperationTime: 'Delete Operation Time',
        actions: 'Actions',
        result: 'Result',
      },
      labels: {
        application: 'Application',
      },
      tips: 'Approved tickets provide a 2-hours window for pod deletion, and the entire operation process will be fully recorded in the ticket.',
    },
    applicationRedeploy: {
      headers: {
        application: 'Application',
        comment: 'Comment',
        tags: 'Tags',
        instance: 'Instance',
        namespace: 'Namespace',
        deployment: 'Deployment',
        redeployTime: 'Redeploy Time',
        actions: 'Actions',
        result: 'Result',
      },
      labels: {
        application: 'Application',
      },
      tips: 'Approved tickets provide a 2-hours window for application redeployment, and the entire operation process will be fully recorded in the ticket.',
    },
    userRevoke: {
      headers: {
        businessType: 'Business Type',
        subType: 'Sub Type',
        instance: 'Instance',
        account: 'Account',
        actions: 'Actions',
        result: 'Result',
      },
      labels: {
        user: 'User',
      },
    },
    businessPermission: {
      labels: {
        permission: 'Permission',
        namespaces: 'Namespaces',
        applyDuration: 'Apply Duration',
      },
      application: {
        prod: {
          tips: 'After the approval is completed, you need to complete the relevant operations within 15 minutes.',
        }
      },
    },
    aliyunOns: {
      headers: {
        instance: 'Instance',
        onsInstance: 'ONS Instance',
        consumerGroup: 'Consumer Group',
        deliveryOrderType: 'Delivery Order Type',
        topicName: 'Topic Name',
        messageType: 'Message Type',
        remark: 'Remark',
        actions: 'Actions',
        result: 'Result',
      },
      labels: {
        instance: 'Instance',
        onsInstance: 'ONS Instance',
        remark: 'Remark',
        topicName: 'Topic Name',
        messageType: 'Message Type',
        groupId: 'Group ID',
        deliveryOrderType: 'Delivery Order Type',
        retryRules: 'Retry Rules',
        retryPolicy: 'Retry Policy',
        maxRetryTimes: 'Max Retry Times',
      },
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
    riskChange: {
      labels: {
        applicant: 'Change Applicant',
        title: 'Title',
        content: 'Content',
      },
      headers: {
        applicant: 'Change Applicant',
        title: 'Title',
        content: 'Content',
      }
    },
    aliyunDataworks: {
      headers: {
        aliyunInstance: 'Aliyun Instance',
        akRamUser: 'AK RAM User',
        actions: 'Actions',
        result: 'Result'
      },
      labels: {
        instance: 'Instance'
      }
    },
    userPasswordReset: {
      headers: {
        username: 'Username',
        name: 'Name',
        displayName: 'Display Name',
        email: 'Email',
        actions: 'Actions',
        result: 'Result'
      },
      labels: {
        user: 'User'
      }
    }
  },
};
