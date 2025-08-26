export default {
  user: {
    // 通用
    common: {
      actions: '操作',
      edit: '编辑',
      delete: '删除',
      add: '新增',
      save: '保存',
      cancel: '取消',
      confirm: '确认',
      search: '搜索',
      filter: '筛选',
      refresh: '刷新',
      loading: '加载中...',
      noData: '暂无数据',
      success: '操作成功',
      error: '操作失败',
      yes: '是',
      no: '否',
      enabled: '启用',
      disabled: '禁用',
      valid: '有效',
      invalid: '无效',
      new: '新建',
      showOnlyExternalUser: '仅显示外部用户'
    },

    // 用户列表
    list: {
      title: '用户列表',
      table: {
        name: '姓名',
        username: '用户名',
        displayName: '显示名称',
        email: '邮箱',
        phone: '电话',
        valid: '状态',
        isExternal: '外部用户',
        createTime: '创建时间',
        updateTime: '更新时间',
        actions: '操作',
        lastLoginTime: '最后登录时间',
        department: '部门',
        position: '职位'
      },
      status: {
        valid: '有效',
        invalid: '无效',
        active: '激活',
        inactive: '未激活'
      },
      userType: {
        internal: '内部用户',
        external: '外部用户'
      }
    },

    // 用户设置
    settings: {
      title: '用户设置',
      menu: {
        base: '基础信息',
        permissions: '权限管理',
        cloudIdentity: '云身份',
        identity: '身份认证',
        sshKey: 'SSH密钥',
        robot: '机器人'
      }
    },

    // 基础设置
    baseSettings: {
      title: '基础信息',
      form: {
        username: '用户名',
        displayName: '显示名称',
        name: '姓名',
        email: '邮箱',
        phone: '电话',
        department: '部门',
        position: '职位',
        comment: '备注',
        usernamePlaceholder: '请输入用户名',
        displayNamePlaceholder: '请输入显示名称',
        namePlaceholder: '请输入姓名',
        emailPlaceholder: '请输入邮箱地址',
        phonePlaceholder: '请输入电话号码',
        departmentPlaceholder: '请输入部门',
        positionPlaceholder: '请输入职位',
        commentPlaceholder: '请输入备注信息'
      }
    },

    // 权限管理
    permissions: {
      title: '权限管理',
      noPermissions: '暂无权限',
      expiration: {
        permanent: '永久',
        expired: '已过期',
        expiringSoon: '即将过期',
        days: '天',
        today: '今天',
        tooltipPrefix: '过期时间: '
      },
      actions: {
        grant: '授权',
        revoke: '撤销',
        renew: '续期'
      },
      dialog: {
        grantTitle: '授权确认',
        revokeTitle: '撤销确认',
        grantContent: '确定要授权该权限吗？',
        revokeContent: '确定要撤销该权限吗？'
      }
    },

    // 身份认证
    identity: {
      title: '身份认证',
      ldap: 'LDAP身份',
      gitlab: 'GitLab身份',
      dingtalk: '钉钉身份',
      mail: '邮箱身份',
      sshKey: 'SSH密钥身份',
      cloud: '云身份'
    },

    // SSH密钥
    sshKey: {
      title: 'SSH密钥管理',
      add: '添加SSH密钥',
      keyName: '密钥名称',
      keyContent: '密钥内容',
      fingerprint: '指纹',
      keyType: '密钥类型',
      keySize: '密钥长度',
      comment: '备注',
      createTime: '创建时间'
    },

    // 机器人设置
    robot: {
      title: '机器人设置',
      enable: '启用机器人',
      disable: '禁用机器人',
      token: '访问令牌',
      generateToken: '生成令牌',
      regenerateToken: '重新生成令牌',
      copyToken: '复制令牌',
      tokenExpiry: '令牌过期时间'
    },

    // 用户编辑器
    editor: {
      title: '用户编辑',
      userInfo: '用户信息',
      permissions: '权限设置',
      identity: '身份设置',
      sshKey: 'SSH密钥',
      save: '保存',
      cancel: '取消'
    },

    // 消息提示
    messages: {
      saveSuccess: '保存成功',
      deleteSuccess: '删除成功',
      grantSuccess: '授权成功',
      revokeSuccess: '撤销成功',
      copySuccess: '复制成功',
      tokenGenerated: '令牌生成成功',
      confirmDelete: '确定要删除吗？',
      confirmGrant: '确定要授权吗？',
      confirmRevoke: '确定要撤销吗？',
      operationSuccess: '操作成功',
      operationFailed: '操作失败'
    }
  }
};
