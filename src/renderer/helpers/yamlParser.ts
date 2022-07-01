import { ReadOnlyObj, DependsOn, Services, VolumeType, KubeObj } from '../App.d';

type YamlState = {
  fileOpened: boolean;
  kubeBool?: boolean;
  services?: Services;
  filePath?: string;
  dependsOn?: DependsOn;
  networks?: ReadOnlyObj;
  volumes?: ReadOnlyObj;
  bindMounts?: Array<string>;
  kubeObj?: KubeObj;
};

const kubeParser = (file:any):any => {
  const kube: KubeObj = {
    kind: file.kind,
    name: file.metadata.name
  };
  if (kube.kind === 'Pod') {
    return {...kube, containers: file.spec.containers}
  }
  if (kube.kind === 'Deployment') {
    return {...kube, containers: file.spec.spec.containers, replica: file.spec.replicas}
  }
  if (kube.kind === 'Service') {
    return {...kube, selector: file.spec.selector, ports: file.spec.ports}
  }
<<<<<<< HEAD
  // else if (kube.kind === 'Node') {
  //   return {...kube, containers: file.spec.containers}
  // }"
  //somehow generate error about unsupported kind type for now console log
  console.log('Kubernetes kind not currently supported')
=======
>>>>>>> 036ec09... cleaned up app.d, option bar, service info, tab, tab bar, yamlParser
}

const convertYamlToState = (file: any, filePath: string) => {
<<<<<<< HEAD
  
=======
  //check if file.apiVersion exists, if so Kube logic -> 
    //save kind as variable, execeute logic if deployement, service, pod
  if (file.apiVersion) {
<<<<<<< HEAD
   
    return {fileOpened: true, kubeBool: true, kubeObj: kubeParser(file), filePath, services: {service: []}}
=======
    return {fileOpened: true, kubeBool: true, kubeObj: kubeParser(file)}
>>>>>>> 036ec09... cleaned up app.d, option bar, service info, tab, tab bar, yamlParser
  }
  else {
<<<<<<< HEAD
<<<<<<< HEAD
    console.log('file in ymal parser', file)
>>>>>>> 5714a15... added Kube parser to Yamlparser
=======
    console.log('file in yaml parser', file)
>>>>>>> 0797247... ready to merge to feature
=======
>>>>>>> 107eb90...  volumes wrapper rendering
  const services = file.services;
  const volumes = file.volumes ? file.volumes : {};
  const networks = file.networks ? file.networks : {};
  const state: YamlState = Object.assign(
    {},
    { fileOpened: true, kubeBool: false, services, volumes, networks, filePath },
  );
  const bindMounts: string[] = [];
  // iterate through each service
  console.log('this is the yamlState', state);
  Object.keys(services).forEach((name): void => {
    // IF SERVICE HAS VOLUMES PROPERTY
    if (services[name].volumes) {
      // iterate from all the volumes
      services[name].volumes.forEach((volume: VolumeType): void => {
        let v = '';
        if (typeof volume === 'string') {
          // if its a bind mount, capture it
          v = volume.split(':')[0];
        } else if (
          'source' in volume &&
          volume.source &&
          volume.type === 'bind'
        ) {
          v = volume.source;
        }
        if (!!v && !volumes.hasOwnProperty(v)) {
          bindMounts.push(v);
        }
      });
    }
  });
  state.bindMounts = bindMounts;
  return state;
};
}
export default convertYamlToState;
