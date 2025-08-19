export const webTerminal = {
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

  // 终端窗体
  close: '关闭',
  assetId: '资产ID',
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
    previewEffect: '预览效果',
    resetToDefault: '重置为默认主题',
    currentTheme: '当前主题',
    resetConfirmation: '确定要重置为默认主题吗？',
  },
};
