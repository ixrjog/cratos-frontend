export default {
  webTerminal: {
    // 主页面
    addTerminal: '打开终端',
    selectAll: '全选',
    clearSelection: '清除选择',
    closeSelected: '关闭选中',
    totalTerminals: '终端总数',
    selectedTerminals: '已选择',
    noTerminals: '暂无终端',
    clickAddToStart: '点击"打开终端"开始使用',
    groupControlHint: '群控模式：在任意选中的终端中输入命令将同时发送到所有选中的终端',
    send: '发送',
    correctTerminals: '矫正终端',
    correctTerminalsHint: '重新发送终端尺寸信息到后端，矫正终端显示',
    confirmCloseTerminal: '确定要关闭选中的终端吗？',
    confirmCloseTerminals: '确定要关闭选中的 {{count}} 个终端吗？',
    closeTerminalsSuccess: '已成功关闭 {{count}} 个终端',

    // Demo演示
    demo: {
      title: '群控终端演示',
      description: '体验多终端同步管理功能，观看实时群控命令执行效果',
      allConnected: '群控模式',
      document: '平台文档',
      realTime: '同步执行',
      hint: '这是群控演示效果，所有终端同步执行相同命令，点击"打开终端"开始真实的终端会话',
    },

    // WebSocket连接状态
    wsStatus: {
      connected: '已连接',
      connecting: '连接中...',
      error: '连接错误',
      disconnected: '未连接',
    },

    // 资产选择抽屉
    selectAsset: '选择资产',
    searchAssetPlaceholder: '搜索资产名称...',
    selectAssetType: '选择资产类型',
    noAssetsFound: '未找到资产',
    tryDifferentSearch: '请尝试不同的搜索条件',
    select: '选择',
    multiSelectHint: '可以选择多个资产创建多个终端，选择完成后点击右上角关闭按钮',
    batchSelect: '批量操作',
    addSelectedTerminals: '添加选中的终端',
    filter: '筛选',
    open: '打开',
    opened: '已打开',
    myFavorites: '我的收藏',

    // 终端窗体
    close: '关闭',
    assetId: '资产ID',
    assetName: '服务器名称',
    instanceId: '实例ID',
    commandPlaceholder: '输入命令...',
    groupCommandPlaceholder: '输入群控命令（将发送到所有选中的终端）...',
    groupControl: '群控',
    groupControlActive: '群控模式激活 - 命令将发送到所有选中的终端',
    enterWideScreen: '宽屏模式',
    exitWideScreen: '退出宽屏',

    // 连接状态
    connected: '已连接',
    disconnected: '已断开',
    connecting: '连接中',
    connectingTo: '正在连接到',
    closingConnection: '正在关闭终端连接...',

    // 消息提示
    connectionFailed: '连接失败',
    connectionLost: '连接丢失',
    reconnecting: '重新连接中',
    terminalClosed: '终端已关闭',
    commandSent: '命令已发送',

    // 错误信息
    websocketError: 'WebSocket连接错误',
    terminalError: '终端错误',
    assetNotFound: '资产未找到',
    permissionDenied: '权限不足',

    // 主题设置
    themeSettings: {
      button: '主题设置',
      title: '终端主题设置',
      selectTheme: '选择主题',
      fontSettings: '字体设置',
      fontFamily: '字体',
      fontSize: '字号',
      lineHeight: '行高',
      previewEffect: '预览效果',
      resetToDefault: '重置为默认主题',
      currentTheme: '当前主题',
      resetConfirmation: '确定要重置为默认主题吗？',
    },
  }
};
