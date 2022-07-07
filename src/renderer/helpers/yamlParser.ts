import { ReadOnlyObj, DependsOn, Services, VolumeType } from '../App.d';

type YamlState = {
  fileOpened: boolean;
  services: Services;
  filePath?: string;
  dependsOn?: DependsOn;
  networks?: ReadOnlyObj;
  volumes?: ReadOnlyObj;
  bindMounts?: Array<string>;
};

const convertYamlToState = (file: any, filePath: string) => {
  
  const services = file.services;
  const volumes = file.volumes ? file.volumes : {};
  const networks = file.networks ? file.networks : {};
  const state: YamlState = Object.assign(
    {},
    { fileOpened: true, services, volumes, networks, filePath },
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

export default convertYamlToState;
