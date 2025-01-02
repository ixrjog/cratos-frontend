import { ApplicationVO } from './application';
import { EdsInstanceVO } from './ext-datasource';
import { EnvVO } from './env';

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
  attributes: Map<string, string>;
  env: EnvVO;
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
  labels: Map<string, string>;
  creationTimestamp: Date;
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
  resources: ContainerResourcesVO;
  lifecycle: ContainerLifecycleVO;
  livenessProbe: ContainerProbeVO;
  readinessProbe: ContainerProbeVO;
  startupProbe: ContainerProbeVO;
}

export interface ContainerLifecycleVO {
  postStart: ContainerLifecycleHandlerVO;
  preStop: ContainerLifecycleHandlerVO;
  isEmpty: boolean;
}

export interface ContainerLifecycleHandlerVO {
  exec: { command: string };
  httpGet: ContainerHTTPGetActionVO;
  sleep: { seconds: number };
}

export interface ContainerProbeVO {
  exec: { command: string };
  failureThreshold: number;
  httpGet: ContainerHTTPGetActionVO;
  initialDelaySeconds: number;
  periodSeconds: number;
  successThreshold: number;
  terminationGracePeriodSeconds: number;
  timeoutSeconds: number;
  empty: boolean;
}

export interface ContainerHTTPGetActionVO {
  host: string,
  httpHeaders: { name: string, value: string }[],
  path: string
  port: string
  scheme: string
}

export interface ContainerResourcesVO {
  limits: Map<string, { amount: string, format: string }>;
  requests: Map<string, { amount: string, format: string }>;
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

export interface KubernetesNodeDetailsVO {
  success: boolean;
  message: string;
  kubernetesInstance: EdsInstanceVO;
  nodes: Map<string, KubernetesNodeVO[]>;
}

export interface KubernetesNodeVO {
  region: string;
  zone: string;
  metadata: KubernetesMetadataVO;
  status: KubernetesNodeStatusVO;
  attributes: Map<string, string>;
  usage: {
    cpuPercentage: number
    memoryPercentage: number
    name: string
  }
}

export interface KubernetesNodeStatusVO {
  addresses: Map<string, { address: string, type: string }>;
  nodeInfo: KubernetesNodeSystemInfoVO;
  conditions: Map<string, KubernetesNodeConditionVO>;
}

export interface KubernetesNodeSystemInfoVO {
  architecture: string;
  bootID: string;
  containerRuntimeVersion: string;
  kernelVersion: string;
  kubeProxyVersion: string;
  kubeletVersion: string;
  machineID: string;
  operatingSystem: string;
  osImage: string;
  systemUUID: string;
}

export interface KubernetesNodeConditionVO {
  lastProbeTime: Date;
  lastTransitionTime: Date;
  message: string;
  reason: string;
  status: string;
  type: string;
}
