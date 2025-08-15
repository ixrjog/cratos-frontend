export interface WebTerminalOpenRequest extends WebTerminalBaseRequest {
  assetId: number;
  instanceId: string;
}

export interface WebTerminalResizeRequest extends WebTerminalBaseRequest {
  instanceId: string;
}

export interface WebTerminalCommandRequest extends WebTerminalBaseRequest {
  instanceId: string;
  input: string;
}

export interface WebTerminalCloseRequest extends WebTerminalBaseRequest {
  instanceId: string;
}

export interface WebTerminalBaseRequest {
  state: string;
  terminal: {
    rows: number
    cols: number
  };
}

export enum WebTerminalStatus {
  OPEN = 'OPEN',
  RESIZE = 'RESIZE',
  CLOSE = 'CLOSE',
  COMMAND = 'COMMAND'
}
