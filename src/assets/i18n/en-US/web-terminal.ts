export default {
   webTerminal: {
    // Main page
    addTerminal: 'Open Terminal',
    selectAll: 'Select All',
    clearSelection: 'Clear Selection',
    closeSelected: 'Close Selected',
    totalTerminals: 'Total Terminals',
    selectedTerminals: 'Selected',
    noTerminals: 'No Terminals',
    clickAddToStart: 'Click "Open Terminal" to get started',
    groupControlHint: 'Group Control Mode: Commands entered in any selected terminal will be sent to all selected terminals',
    send: 'Send',
    correctTerminals: 'Correct Terminals',
    correctTerminalsHint: 'Resend terminal size information to backend to correct terminal display',
    confirmCloseTerminal: 'Are you sure you want to close the selected terminal?',
    confirmCloseTerminals: 'Are you sure you want to close the selected {{count}} terminals?',
    closeTerminalsSuccess: 'Successfully closed {{count}} terminals',

    // Demo showcase
    demo: {
      title: 'Group Control Demo',
      description: 'Experience synchronized multi-terminal management and watch real-time group control execution',
      allConnected: 'Group Control',
      document: 'Document Anywhere',
      realTime: 'Synchronized',
      hint: 'This is a group control demo where all terminals execute the same commands synchronously. Click "Open Terminal" to start real terminal sessions',
    },

    // WebSocket connection status
    wsStatus: {
      connected: 'Connected',
      connecting: 'Connecting...',
      error: 'Connection Error',
      disconnected: 'Disconnected',
    },

    // Asset selection drawer
    selectAsset: 'Select Asset',
    searchAssetPlaceholder: 'Search asset name...',
    selectAssetType: 'Select Asset Type',
    noAssetsFound: 'No Assets Found',
    tryDifferentSearch: 'Try different search criteria',
    select: 'Select',
    multiSelectHint: 'You can select multiple assets to create multiple terminals. Click the close button in the top right when finished.',
    batchSelect: 'Batch Operations',
    addSelectedTerminals: 'Add Selected Terminals',
    filter: 'Filter',
    open: 'Open',
    opened: 'Opened',
    myFavorites: 'My Favorites',

    // Terminal item
    close: 'Close',
    assetId: 'Asset ID',
    assetName: 'Server Name',
    instanceId: 'Instance ID',
    commandPlaceholder: 'Enter command...',
    groupCommandPlaceholder: 'Enter group command (will be sent to all selected terminals)...',
    groupControl: 'Group Control',
    groupControlActive: 'Group Control Active - Commands will be sent to all selected terminals',
    enterWideScreen: 'Wide Screen',
    exitWideScreen: 'Exit Wide Screen',

    // Connection status
    connected: 'Connected',
    disconnected: 'Disconnected',
    connecting: 'Connecting',
    connectingTo: 'Connecting to',
    closingConnection: 'Closing terminal connection...',

    // Messages
    connectionFailed: 'Connection Failed',
    connectionLost: 'Connection Lost',
    reconnecting: 'Reconnecting',
    terminalClosed: 'Terminal Closed',
    commandSent: 'Command Sent',

    // Error messages
    websocketError: 'WebSocket Connection Error',
    terminalError: 'Terminal Error',
    assetNotFound: 'Asset Not Found',
    permissionDenied: 'Permission Denied',

    // Theme settings
    themeSettings: {
      button: 'Theme Settings',
      title: 'Terminal Theme Settings',
      selectTheme: 'Select Theme',
      fontSettings: 'Font Settings',
      fontFamily: 'Font Family',
      fontSize: 'Font Size',
      lineHeight: 'Line Height',
      previewEffect: 'Preview Effect',
      resetToDefault: 'Reset to Default Theme',
      currentTheme: 'Current Theme',
      resetConfirmation: 'Are you sure you want to reset to the default theme?',
    },
  }
};
