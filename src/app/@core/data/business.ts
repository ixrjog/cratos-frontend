export interface GetByBusiness {
  businessType: string,
  businessId: number,
}

export enum BusinessTypeEnum {
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

  // RBAC
  RBAC_ROLE = 'RBAC_ROLE',
  RBAC_GROUP = 'RBAC_GROUP',
  RBAC_RESOURCE = 'RBAC_RESOURCE',
  RBAC_USER_ROLE = 'RBAC_USER_ROLE',

  EDS_INSTANCE = 'EDS_INSTANCE',
  EDS_CONFIG = 'EDS_CONFIG',

  CHANNEL_NETWORK = 'CHANNEL_NETWORK',

  ENV = 'ENV',
  SERVER_ACCOUNT = 'SERVER_ACCOUNT',

  EDS_ASSET_INDEX = 'EDS_ASSET_INDEX',

  TRAFFIC_LAYER_DOMAIN = 'TRAFFIC_LAYER_DOMAIN',
  TRAFFIC_LAYER_RECORD= 'TRAFFIC_LAYER_RECORD'
}
