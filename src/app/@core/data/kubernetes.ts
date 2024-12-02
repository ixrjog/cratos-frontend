import { ApplicationVO } from './application';

export interface KubernetesDetailsVO {
  application: ApplicationVO;
  success: boolean;
  message: string;
  namespace: string;
  deployments: KubernetesDeploymentVO[];
}

export interface KubernetesDeploymentVO {
  kubernetesCluster: KubernetesClusterVO;
  metadata: KubernetesMetadataVO;
  spec: DeploymentSpecVO;
  pods: KubernetesPodVO[];
}

export interface KubernetesClusterVO {
  name: string;
}

export interface KubernetesMetadataVO {
  namespace: string;
  name: string;
  generateName: string;
  uid: string;
}

export interface DeploymentSpecVO {
  replicas: number;
  strategy: DeploymentStrategyVO;
}

export interface DeploymentStrategyVO {
  type: string;
  rollingUpdate: RollingUpdateDeploymentVO;
}

export interface RollingUpdateDeploymentVO {
  maxSurge: string;
  maxUnavailable: string;
}

export interface KubernetesPodVO {
  metadata: KubernetesMetadataVO;
  status: PodStatusVO;
  spec: PodSpecVO;
  containerStatuses: KubernetesContainerVO[];
}

export interface PodStatusVO {
  conditions: Map<string, PodConditionVO>;
  hostIP: string;
  message: string;
  nominatedNodeName: string;
  phase: string;
  podIP: string;
  qosClass: string;
  reason: string;
  resize: string;
  startTime: Date;
}

export interface PodSpecVO {
  nodeName: string;
}

export interface KubernetesContainerVO {
  main: boolean;
  name: string;
  containerID: string;
  image: string;
  imageID: string;
  started: boolean;
  restartCount: number;
}

export interface PodConditionVO {
  lastProbeTime: Date;
  lastTransitionTime: Date;
  message: string;
  reason: string;
  status: string;
  type: string;

}
