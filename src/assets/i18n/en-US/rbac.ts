export default {
  rbac: {
    // Common
    common: {
      actions: 'Actions',
      edit: 'Edit',
      delete: 'Delete',
      add: 'Add',
      save: 'Save',
      cancel: 'Cancel',
      confirm: 'Confirm',
      search: 'Search',
      filter: 'Filter',
      refresh: 'Refresh',
      loading: 'Loading...',
      noData: 'No Data',
      success: 'Operation Successful',
      error: 'Operation Failed',
      yes: 'Yes',
      no: 'No',
      enabled: 'Enabled',
      disabled: 'Disabled',
      enable: 'Enable',
      disable: 'Disable',
      valid: 'Valid',
      invalid: 'Invalid',
      active: 'Active',
      inactive: 'Inactive',
      batch: 'Batch'
    },

    // Role Management
    role: {
      title: 'Role Management',
      list: 'Role List',
      add: 'Add Role',
      edit: 'Edit Role',
      delete: 'Delete Role',
      details: 'Role Details',
      authorize: 'Role Authorization',
      menu: 'Menu Permissions',
      
      // Table Headers
      table: {
        roleName: 'Role Name',
        accessLevel: 'Access Level',
        workOrderVisible: 'Work Order Visible',
        comment: 'Comment',
        createTime: 'Create Time',
        updateTime: 'Update Time',
        actions: 'Actions'
      },

      // Form Fields
      form: {
        roleName: 'Role Name',
        roleNamePlaceholder: 'Please enter role name',
        accessLevel: 'Access Level',
        workOrderVisible: 'Work Order Visibility',
        comment: 'Comment',
        commentPlaceholder: 'Please enter comment'
      },

      // Access Levels
      accessLevel: {
        none: 'No Permission',
        readonly: 'Read Only',
        readwrite: 'Read Write',
        admin: 'Administrator',
        unknown: 'Unknown'
      },

      // Work Order Visibility
      workOrderVisible: {
        visible: 'Visible',
        invisible: 'Invisible'
      },

      // Messages
      messages: {
        deleteConfirm: 'Are you sure you want to delete this role?',
        deleteSuccess: 'Role deleted successfully',
        saveSuccess: 'Role saved successfully',
        authorizeSuccess: 'Role authorized successfully'
      }
    },

    // Resource Management
    resource: {
      title: 'Resource Management',
      list: 'Resource List',
      add: 'Add Resource',
      edit: 'Edit Resource',
      delete: 'Delete Resource',
      
      // Table Headers
      table: {
        groupName: 'Resource Group',
        resourceName: 'Resource Name',
        uiPoint: 'UI Point',
        valid: 'Status',
        comment: 'Comment',
        createTime: 'Create Time',
        updateTime: 'Update Time',
        actions: 'Actions'
      },

      // Form Fields
      form: {
        groupId: 'Resource Group',
        groupIdPlaceholder: 'Please select resource group',
        resourceName: 'Resource Name',
        resourceNamePlaceholder: 'Please enter resource name',
        uiPoint: 'UI Point',
        comment: 'Comment',
        commentPlaceholder: 'Please enter comment'
      },

      // UI Point
      uiPoint: {
        yes: 'UI Node',
        no: 'Non-UI Node'
      },

      // Messages
      messages: {
        deleteConfirm: 'Are you sure you want to delete this resource?',
        deleteSuccess: 'Resource deleted successfully',
        saveSuccess: 'Resource saved successfully',
        setValidSuccess: 'Resource status updated successfully'
      }
    },

    // Group Management
    group: {
      title: 'Group Management',
      list: 'Group List',
      add: 'Add Group',
      edit: 'Edit Group',
      delete: 'Delete Group',
      
      // Table Headers
      table: {
        groupName: 'Group Name',
        base: 'Base Path',
        resourceCount: 'Resource Count',
        comment: 'Comment',
        createTime: 'Create Time',
        updateTime: 'Update Time',
        actions: 'Actions'
      },

      // Form Fields
      form: {
        groupName: 'Group Name',
        groupNamePlaceholder: 'Please enter group name',
        base: 'Base Path',
        basePlaceholder: 'Please enter base path',
        comment: 'Comment',
        commentPlaceholder: 'Please enter comment'
      },

      // Messages
      messages: {
        deleteConfirm: 'Are you sure you want to delete this group?',
        deleteSuccess: 'Group deleted successfully',
        saveSuccess: 'Group saved successfully'
      }
    },

    // Role Authorization
    authorize: {
      title: 'Role Authorization',
      resourcePermissions: 'Resource Permissions',
      menuPermissions: 'Menu Permissions',
      
      // Table Headers
      table: {
        rbacGroup: 'RBAC Group',
        resourceName: 'Resource Name',
        valid: 'Status',
        comment: 'Comment',
        inRole: 'Authorized',
        notInRole: 'Not Authorized'
      },

      // Actions
      actions: {
        addToRole: 'Add to Role',
        removeFromRole: 'Remove from Role',
        addSelected: 'Add Selected',
        removeSelected: 'Remove Selected'
      },

      // Messages
      messages: {
        addSuccess: 'Resource added successfully',
        removeSuccess: 'Resource removed successfully',
        noSelection: 'Please select resources to operate'
      }
    }
  },

  // Role Details (保持原有的rbacRoleDetails结构以兼容现有代码)
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
