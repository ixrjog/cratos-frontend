export default {
  user: {
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
      success: 'Success',
      error: 'Error',
      yes: 'Yes',
      no: 'No',
      enabled: 'Enabled',
      disabled: 'Disabled',
      valid: 'Valid',
      invalid: 'Invalid',
      new: 'New',
      showOnlyExternalUser: 'Show Only External User'
    },

    // User List
    list: {
      title: 'User List',
      table: {
        name: 'Name',
        username: 'Username',
        displayName: 'Display Name',
        email: 'Email',
        phone: 'Phone',
        valid: 'Status',
        isExternal: 'External User',
        createTime: 'Create Time',
        updateTime: 'Update Time',
        actions: 'Actions',
        lastLoginTime: 'Last Login Time',
        department: 'Department',
        position: 'Position'
      },
      status: {
        valid: 'Valid',
        invalid: 'Invalid',
        active: 'Active',
        inactive: 'Inactive'
      },
      userType: {
        internal: 'Internal User',
        external: 'External User'
      }
    },

    // User Settings
    settings: {
      title: 'User Settings',
      menu: {
        base: 'Base',
        password: 'Password',
        permissions: 'Permissions',
        cloudIdentity: 'Cloud Identity',
        identity: 'Identity',
        sshKey: 'SSH Key',
        robot: 'Robot'
      }
    },

    // Base Settings
    baseSettings: {
      title: 'Base Information',
      form: {
        username: 'Username',
        displayName: 'Display Name',
        name: 'Name',
        email: 'Email',
        phone: 'Phone',
        department: 'Department',
        position: 'Position',
        comment: 'Comment',
        usernamePlaceholder: 'Please enter username',
        displayNamePlaceholder: 'Please enter display name',
        namePlaceholder: 'Please enter name',
        emailPlaceholder: 'Please enter email address',
        phonePlaceholder: 'Please enter phone number',
        departmentPlaceholder: 'Please enter department',
        positionPlaceholder: 'Please enter position',
        commentPlaceholder: 'Please enter comment'
      }
    },

    // Permissions
    permissions: {
      title: 'Permission Management',
      noPermissions: 'No permissions',
      expiration: {
        permanent: 'Permanent',
        expired: 'Expired',
        expiringSoon: 'Expiring Soon',
        days: 'days',
        today: 'Today',
        tooltipPrefix: 'Expiration Time: '
      },
      actions: {
        grant: 'Grant',
        revoke: 'Revoke',
        renew: 'Renew'
      },
      dialog: {
        grantTitle: 'Grant Confirmation',
        revokeTitle: 'Revoke Confirmation',
        grantContent: 'Are you sure you want to grant this permission?',
        revokeContent: 'Are you sure you want to revoke this permission?'
      }
    },

    // Identity
    identity: {
      title: 'Identity Authentication',
      ldap: 'LDAP Identity',
      gitlab: 'GitLab Identity',
      dingtalk: 'DingTalk Identity',
      mail: 'Mail Identity',
      sshKey: 'SSH Key Identity',
      cloud: 'Cloud Identity',
      ldapTitle: 'LDAP',
      gitlabTitle: 'GitLab',
      dingtalkTitle: 'Dingtalk',
      mailTitle: 'Mail'
    },

    // SSH Key
    sshKey: {
      title: 'SSH Key Management',
      add: 'Add SSH Key',
      keyName: 'Key Name',
      keyContent: 'Key Content',
      fingerprint: 'Fingerprint',
      keyType: 'Key Type',
      keySize: 'Key Size',
      comment: 'Comment',
      createTime: 'Create Time',
      publicKey: 'Public Key',
      publicKeyPlaceholder: 'Please enter public key',
      connectingInfo: 'Connecting to Cratos SSH-Server using SSH keys',
      generateInfo: 'Generate an SSH key pair Type ssh-keygen -t followed by the key type and an optional comment.This comment is included in the .pub file that\'s created.You may want to use an email address for the comment.',
      sshKeyList: 'SSH key list'
    },

    // Robot
    robot: {
      title: 'Robot Settings',
      enable: 'Enable Robot',
      disable: 'Disable Robot',
      token: 'Access Token',
      generateToken: 'Generate Token',
      regenerateToken: 'Regenerate Token',
      copyToken: 'Copy Token',
      tokenExpiry: 'Token Expiry',
      tokenWarning: 'After refreshing the current page, the Token cannot be queried again. If you lose this Token, you can create a new one to replace it.',
      name: 'Name',
      expiredTime: 'Expired Time',
      description: 'Description',
      submit: 'Submit',
      reset: 'Reset'
    },

    // User Editor
    editor: {
      title: 'User Editor',
      userInfo: 'User Information',
      permissions: 'Permission Settings',
      identity: 'Identity Settings',
      sshKey: 'SSH Key',
      save: 'Save',
      cancel: 'Cancel'
    },

    // Messages
    messages: {
      saveSuccess: 'Save successful',
      deleteSuccess: 'Delete successful',
      grantSuccess: 'Grant successful',
      revokeSuccess: 'Revoke successful',
      copySuccess: 'Copy successful',
      tokenGenerated: 'Token generated successfully',
      confirmDelete: 'Are you sure you want to delete?',
      confirmGrant: 'Are you sure you want to grant?',
      confirmRevoke: 'Are you sure you want to revoke?',
      operationSuccess: 'Operation successful',
      operationFailed: 'Operation failed'
    }
  }
};
