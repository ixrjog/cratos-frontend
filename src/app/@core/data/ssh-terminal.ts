export interface HostSystem {
  id: number;
  displayNm: string;
  host: string;
  port: number;
  displayLabel: string;
  authorizedKeys: string;
  checked: boolean;
  statusCd: string;
  errorMsg: string;
  instanceId: string;
  terminalSize: {
    rows: number
    cols: number
  };
  auditPath: string;
}

export interface SessionOutput extends HostSystem {
  sessionId: string;
  output: string;
}

