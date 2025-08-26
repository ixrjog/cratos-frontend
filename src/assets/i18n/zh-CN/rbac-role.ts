export default {
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
