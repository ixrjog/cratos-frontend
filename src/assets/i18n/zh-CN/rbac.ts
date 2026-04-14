export default {
  rbac: {
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
      enable: '启用',
      disable: '禁用',
      valid: '有效',
      invalid: '无效',
      active: '激活',
      inactive: '未激活',
      batch: '批量操作'
    },

    // 角色管理
    role: {
      title: '角色管理',
      list: '角色列表',
      add: '新增角色',
      edit: '编辑角色',
      delete: '删除角色',
      details: '角色详情',
      authorize: '角色授权',
      menu: '菜单权限',
      
      // 表格列头
      table: {
        roleName: '角色名称',
        accessLevel: '访问级别',
        workOrderVisible: '工单可见',
        comment: '备注',
        createTime: '创建时间',
        updateTime: '更新时间',
        actions: '操作'
      },

      // 表单字段
      form: {
        roleName: '角色名称',
        roleNamePlaceholder: '请输入角色名称',
        accessLevel: '访问级别',
        workOrderVisible: '工单可见性',
        comment: '备注',
        commentPlaceholder: '请输入备注信息'
      },

      // 访问级别
      accessLevel: {
        none: '无权限',
        readonly: '只读',
        readwrite: '读写',
        admin: '管理员',
        unknown: '未知'
      },

      // 工单可见性
      workOrderVisible: {
        visible: '可见',
        invisible: '不可见'
      },

      // 消息提示
      messages: {
        deleteConfirm: '确定要删除该角色吗？',
        deleteSuccess: '角色删除成功',
        saveSuccess: '角色保存成功',
        authorizeSuccess: '角色授权成功'
      }
    },

    // 资源管理
    resource: {
      title: '资源管理',
      list: '资源列表',
      add: '新增资源',
      edit: '编辑资源',
      delete: '删除资源',
      
      // 表格列头
      table: {
        groupName: '资源组',
        resourceName: '资源路径',
        uiPoint: 'UI节点',
        valid: '状态',
        comment: '备注',
        createTime: '创建时间',
        updateTime: '更新时间',
        actions: '操作'
      },

      // 表单字段
      form: {
        groupId: '资源组',
        groupIdPlaceholder: '请选择资源组',
        resourceName: '资源名称',
        resourceNamePlaceholder: '请输入资源名称',
        uiPoint: 'UI节点',
        comment: '备注',
        commentPlaceholder: '请输入备注信息'
      },

      // UI节点
      uiPoint: {
        yes: 'UI节点',
        no: '非UI节点'
      },

      // 消息提示
      messages: {
        deleteConfirm: '确定要删除该资源吗？',
        deleteSuccess: '资源删除成功',
        saveSuccess: '资源保存成功',
        setValidSuccess: '资源状态更新成功'
      }
    },

    // 资源组管理
    group: {
      title: '资源组管理',
      list: '资源组列表',
      add: '新增资源组',
      edit: '编辑资源组',
      delete: '删除资源组',
      
      // 表格列头
      table: {
        groupName: '组名称',
        base: '基础路径',
        resourceCount: '资源数量',
        comment: '备注',
        createTime: '创建时间',
        updateTime: '更新时间',
        actions: '操作'
      },

      // 表单字段
      form: {
        groupName: '组名称',
        groupNamePlaceholder: '请输入组名称',
        base: '基础路径',
        basePlaceholder: '请输入基础路径',
        comment: '备注',
        commentPlaceholder: '请输入备注信息'
      },

      // 消息提示
      messages: {
        deleteConfirm: '确定要删除该资源组吗？',
        deleteSuccess: '资源组删除成功',
        saveSuccess: '资源组保存成功'
      }
    },

    // 角色授权
    authorize: {
      title: '角色授权',
      resourcePermissions: '资源权限',
      menuPermissions: '菜单权限',
      
      // 表格列头
      table: {
        rbacGroup: 'RBAC组',
        resourceName: '资源名称',
        valid: '状态',
        comment: '备注',
        inRole: '已授权',
        notInRole: '未授权'
      },

      // 操作
      actions: {
        addToRole: '添加到角色',
        removeFromRole: '从角色移除',
        addSelected: '添加选中项',
        removeSelected: '移除选中项'
      },

      // 消息提示
      messages: {
        addSuccess: '资源添加成功',
        removeSuccess: '资源移除成功',
        noSelection: '请选择要操作的资源'
      }
    }
  },

  // 角色详情 (保持原有的rbacRoleDetails结构以兼容现有代码)
  rbacRoleDetails: {
    title: '角色详情',
    roleInfo: {
      title: '角色信息',
      roleName: '角色名称',
      accessLevel: '访问级别',
      workOrderVisible: '工单可见性',
      createTime: '创建时间',
      updateTime: '更新时间',
      comment: '备注',
      visible: '可见',
      invisible: '不可见'
    },
    accessLevel: {
      none: '无权限',
      readonly: '只读',
      readwrite: '读写',
      admin: '管理员',
      unknown: '未知'
    },
    resourcePermissions: {
      title: '资源权限',
      groupName: '组名称',
      groupId: '组ID',
      basePath: '基础路径',
      resourceCount: '资源数量',
      groupDescription: '组描述',
      resourceList: '资源列表',
      resources: '个资源'
    },
    table: {
      rbacGroup: 'RBAC组',
      resourceName: '资源名称',
      uiPoint: 'UI节点',
      valid: '状态',
      comment: '备注',
      uiNode: 'UI节点',
      nonUiNode: '非UI节点',
      active: '有效',
      inactive: '无效',
      noComment: '-'
    },
    empty: {
      noPermissions: '暂无权限',
      noPermissionsDesc: '该角色暂无分配任何资源权限',
      noResources: '暂无资源',
      noResourcesDesc: '该组暂未分配任何资源'
    },
    loading: '加载中...',
    debug: {
      roleExists: '角色存在',
      groupResourcesExists: 'groupResources存在',
      groupResourcesLength: 'groupResources长度',
      roleId: '角色ID',
      roleName: '角色名称'
    }
  }
};
