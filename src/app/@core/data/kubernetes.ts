import { ApplicationVO } from './application';

export interface KubernetesDetailsVO {
  application: ApplicationVO;
  success: boolean;
  message: string;
  namespace: string;
  workloads: KubernetesWorkloadsVO;
  network: KubernetesNetworkVO;
}

export interface KubernetesWorkloadsVO {
  deployments: KubernetesDeploymentVO[];
}

export interface KubernetesNetworkVO {
  services: KubernetesServiceVO[];
}

export interface KubernetesServiceVO {
  metadata: KubernetesMetadataVO;
  spec: KubernetesServiceSpecVO;
}

export interface KubernetesServiceSpecVO {
  selector: Map<string, string>;
  ports: KubernetesServicePortVO[];
  clusterIP: string;
  type: string;
}

export interface KubernetesServicePortVO {
  appProtocol: string;
  name: string;
  nodePort: number;
  port: number;
  protocol: string;
  targetPort: number;
}

export interface KubernetesDeploymentVO {
  kubernetesCluster: KubernetesClusterVO;
  metadata: KubernetesMetadataVO;
  spec: DeploymentSpecVO;
  pods: KubernetesPodVO[];
  topologyDetails: KubernetesTopologyDetails;
}

export interface KubernetesClusterVO {
  name: string;
}

export interface KubernetesTopologyDetails {
  nodeTopology: Map<string, Map<string, KubernetesNodeVo>>;
}

export interface KubernetesNodeVo {
  name: string;
  hostIP: string;
  region: string;
  zone: string;
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
  template: DeploymentSpecTemplateVO;
}

export interface DeploymentStrategyVO {
  type: string;
  rollingUpdate: RollingUpdateDeploymentVO;
}

export interface DeploymentSpecTemplateVO {
  spec: DeploymentTemplateSpecVO;
}

export interface DeploymentTemplateSpecVO {
  containers: DeploymentTemplateSpecContainerVO[];
}

export interface DeploymentTemplateSpecContainerVO {
  main: boolean;
  name: string;
  image: string;
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
