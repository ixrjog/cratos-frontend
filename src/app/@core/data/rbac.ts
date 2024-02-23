import { BaseVO, ValidVO } from './base-data';

export interface RbacUserRoleVO extends BaseVO {
  id: number;
  username: string;
  roleId: number;
  rbacRole: RbacRoleVO;
}

export interface RbacRoleVO extends BaseVO {
  id: number;
  roleName: string;
  accessLevel: number;
  workOrderVisible: boolean;
  comment: string;
}

export interface RbacGroupVO extends BaseVO {
  id: number;
  groupName: string;
  base: string;
  comment: string;
  resourceCount: Map<string, number>;
}

export interface RbacResourceVO extends BaseVO, ValidVO {
  id: number;
  groupId: number;
  resourceName: string;
  uiPoint: boolean;
  rbacGroup: RbacGroupVO;
  comment: string;
}
