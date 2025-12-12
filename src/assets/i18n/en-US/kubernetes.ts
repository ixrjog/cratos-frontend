export default {
  kubernetes: {
    // Main tabs and navigation
    tabs: {
      workloads: 'Workloads',
      network: 'Network',
    },

    // Common actions and buttons
    actions: {
      favorite: 'Favorite',
      filter: 'Filter',
      share: 'Share',
      scan: 'Scan',
      exec: 'Exec',
      logs: 'Logs',
      delete: {
        button: 'Delete',
        tooltip: 'Authorization via work order',
      },
      exit: 'Exit',
      close: 'Close',
      fullscreen: 'Fullscreen',
      minimize: 'Minimize',
      more: 'More',
    },

    // Form placeholders and labels
    form: {
      selectApplication: 'Search and select application',
      selectResourceName: 'Select resource name',
    },

    // Deployment related
    deployment: {
      redeploy: {
        button: 'Redeploy',
        tooltip: 'Authorization via work order',
      },
      totalReplicas: 'total replicas x',
      unboundDeployment: 'Unbound Deployment',
    },

    // Pod related
    pod: {
      status: {
        phase: 'Phase',
      },
      info: {
        podIP: 'Pod IP',
        workerIP: 'Worker IP',
        imageTag: 'Image Tag',
        restartCount: 'Restart Count',
      },
    },

    // Container probes
    probe: {
      startup: 'StartupProbe',
      liveness: 'LivenessProbe',
      readiness: 'ReadinessProbe',
      none: 'None',
      fields: {
        command: 'command',
        httpGet: 'httpGet',
        httpHeaders: 'httpHeaders',
        host: 'host',
        path: 'path',
        port: 'port',
        scheme: 'scheme',
        initialDelaySeconds: 'initialDelaySeconds',
        failureThreshold: 'failureThreshold',
        periodSeconds: 'periodSeconds',
        successThreshold: 'successThreshold',
        timeoutSeconds: 'timeoutSeconds',
      },
    },

    // Container lifecycle
    lifecycle: {
      postStart: 'PostStart',
      preStop: 'PreStop',
    },

    // Service related
    service: {
      headers: {
        name: 'Name',
        selector: 'Selector',
        type: 'Type',
        clusterIP: 'Cluster IP',
        ports: 'Ports',
      },
    },

    // Network related
    network: {
      title: 'Network',
    },

    // Common messages
    messages: {
      noData: 'No Data',
      myFavorites: 'My Favorites Application',
    },

    // Resource types
    resources: {
      containers: 'Containers',
      image: 'Image',
      version: 'Version',
      resources: 'Resources',
      lifecycle: 'Lifecycle',
      probe: 'Probe',
      jvm: 'JVM',
      requests: 'Requests',
      limits: 'Limits',
    },
  },
};


