export interface GetByBusiness {
  businessType: string,
  businessId: number,
}

export enum BusinessTypeEnum {
  APPLICATION = 'APPLICATION',
  BUSINESS_PROPERTY = 'BUSINESS_PROPERTY',
  BUSINESS_DOC = 'BUSINESS_DOC',
  // 证书
  CERTIFICATE = 'CERTIFICATE',
  TAG = 'TAG',
  BUSINESS_TAG = 'BUSINESS_TAG',
  // 凭据
  CREDENTIAL = 'CREDENTIAL',
  BUSINESS_CREDENTIAL = 'BUSINESS_CREDENTIAL',
  USER = 'USER',
  DOMAIN= 'DOMAIN',

  ASSET_MATURITY = 'ASSET_MATURITY',

  // RBAC
  RBAC_ROLE = 'RBAC_ROLE',
  RBAC_GROUP = 'RBAC_GROUP',
  RBAC_RESOURCE = 'RBAC_RESOURCE',
  RBAC_USER_ROLE = 'RBAC_USER_ROLE',

  EDS_INSTANCE = 'EDS_INSTANCE',
  EDS_CONFIG = 'EDS_CONFIG',
  EDS_ASSET= 'EDS_ASSET',
  EDS_ASSET_INDEX= 'EDS_CONFIG',

  CHANNEL_NETWORK = 'CHANNEL_NETWORK',

  ENV = 'ENV',
  SERVER_ACCOUNT = 'SERVER_ACCOUNT',

  TRAFFIC_LAYER_DOMAIN = 'TRAFFIC_LAYER_DOMAIN',
  TRAFFIC_LAYER_RECORD= 'TRAFFIC_LAYER_RECORD',

  MENU='MENU',
  MENU_TITLE='MENU_TITLE',

  RISK_EVENT='RISK_EVENT',
  RISK_EVENT_IMPACT='RISK_EVENT_IMPACT',

  SSH_SESSION = 'SSH_SESSION',
  SSH_INSTANCE = 'SSH_INSTANCE',
  SSH_COMMAND = 'SSH_COMMAND',

  GLOBAL_NETWORK = 'GLOBAL_NETWORK',
  GLOBAL_NETWORK_PLANNING = 'GLOBAL_NETWORK_PLANNING',
  GLOBAL_NETWORK_SUBNET = 'GLOBAL_NETWORK_SUBNET',

  KUBERNETES_RESOURCE_TEMPLATE = 'KUBERNETES_RESOURCE_TEMPLATE',
  KUBERNETES_RESOURCE_TEMPLATE_MEMBER = 'KUBERNETES_RESOURCE_TEMPLATE_MEMBER',

}
