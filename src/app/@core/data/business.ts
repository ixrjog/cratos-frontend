export interface GetByBusiness {
  businessType: string,
  businessId: number,
}

export enum BusinessTypeEnum {
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
}
