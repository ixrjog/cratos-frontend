export default {
  kubernetes: {
    // Main tabs and navigation
    tabs: {
      workloads: '工作负载',
      network: '网络',
    },

    // Common actions and buttons
    actions: {
      favorite: '收藏',
      filter: '筛选',
      share: '分享',
      scan: '扫描',
      exec: '执行',
      logs: '日志',
      delete: {
        button: '删除',
        tooltip: '通过工单进行授权',
      } ,
      exit: '退出',
      close: '关闭',
      fullscreen: '全屏',
      minimize: '最小化',
      more: '更多',
    },

    // Form placeholders and labels
    form: {
      selectApplication: '选择应用',
      selectResourceName: '选择资源名称',
    },

    // Deployment related
    deployment: {
      redeploy: {
        button: '重新部署',
        tooltip: '通过工单进行授权',
      },
      totalReplicas: '总副本数 x',
      unboundDeployment: '未绑定部署',
    },

    // Pod related
    pod: {
      status: {
        phase: '阶段',
      },
      info: {
        podIP: 'Pod IP',
        workerIP: '工作节点 IP',
        imageTag: '镜像标签',
        restartCount: '重启次数',
      },
    },

    // Container probes
    probe: {
      startup: '启动探针',
      liveness: '存活探针',
      readiness: '就绪探针',
      none: '无',
      fields: {
        command: '命令',
        httpGet: 'HTTP GET',
        httpHeaders: 'HTTP 头',
        host: '主机',
        path: '路径',
        port: '端口',
        scheme: '协议',
        initialDelaySeconds: '初始延迟秒数',
        failureThreshold: '失败阈值',
        periodSeconds: '周期秒数',
        successThreshold: '成功阈值',
        timeoutSeconds: '超时秒数',
      },
    },

    // Container lifecycle
    lifecycle: {
      postStart: '启动后',
      preStop: '停止前',
    },

    // Service related
    service: {
      headers: {
        name: '名称',
        selector: '选择器',
        type: '类型',
        clusterIP: '集群 IP',
        ports: '端口',
      },
    },

    // Network related
    network: {
      title: '网络',
    },

    // Common messages
    messages: {
      noData: '暂无数据',
      myFavorites: '我的收藏应用',
    },

    // Resource types
    resources: {
      containers: '容器',
      image: '镜像',
      version: '版本',
      resources: '资源',
      lifecycle: '生命周期',
      probe: '探针',
      jvm: 'JVM',
      requests: '请求',
      limits: '限制',
    },
  }
};
