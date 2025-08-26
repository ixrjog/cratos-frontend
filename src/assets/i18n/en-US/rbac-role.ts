export default {
  rbacRoleDetails: {
    title: 'Role Details',
    roleInfo: {
      title: 'Role Information',
      roleName: 'Role Name',
      accessLevel: 'Access Level',
      workOrderVisible: 'Work Order Visibility',
      createTime: 'Create Time',
      updateTime: 'Update Time',
      comment: 'Comment',
      visible: 'Visible',
      invisible: 'Invisible'
    },
    accessLevel: {
      none: 'No Permission',
      readonly: 'Read Only',
      readwrite: 'Read Write',
      admin: 'Administrator',
      unknown: 'Unknown'
    },
    resourcePermissions: {
      title: 'Resource Permissions',
      groupName: 'Group Name',
      groupId: 'Group ID',
      basePath: 'Base Path',
      resourceCount: 'Resource Count',
      groupDescription: 'Group Description',
      resourceList: 'Resource List',
      resources: ' Resources'
    },
    table: {
      rbacGroup: 'RBAC Group',
      resourceName: 'Resource Name',
      uiPoint: 'UI Point',
      valid: 'Valid',
      comment: 'Comment',
      uiNode: 'UI Node',
      nonUiNode: 'Non-UI Node',
      active: 'Active',
      inactive: 'Inactive',
      noComment: '-'
    },
    empty: {
      noPermissions: 'No Permissions',
      noPermissionsDesc: 'This role has no resource permissions assigned',
      noResources: 'No Resources',
      noResourcesDesc: 'This group has no resources assigned'
    },
    loading: 'Loading...',
    debug: {
      roleExists: 'Role Exists',
      groupResourcesExists: 'GroupResources Exists',
      groupResourcesLength: 'GroupResources Length',
      roleId: 'Role ID',
      roleName: 'Role Name'
    }
  }
};
