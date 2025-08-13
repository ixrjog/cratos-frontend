export interface WebTerminalRequest {
  state: string;
  terminal: {
    width: number
    height: number
  };
  assetId: string;
  instanceId: string;
}

export enum WebTerminalStatus {
  OPEN = 'OPEN',
  DUPLICATE = 'DUPLICATE',
}
