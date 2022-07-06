 /**
 * ************************************
 *
 * @module  setGlobalVars.ts
 * @author
 * @date 3/24/20
 * @description algorithm to set global vars for forcegraph simulation
 *
 * ************************************
 */
  import {
    Services,
    NodesObject,
    TreeMap,
    Link,
    SNode,
    Port,
    D3State,
    Volumes,
    Ports,
    VolumeType
  } from '../App.d';
  import * as d3 from 'd3';
  
  interface SetD3State {
    (services: Services): D3State;
  }
  
  /**
   * ********************
   * EXTRACTOR FUNCTIONS
   * ********************
   */
  
  // PORTS: https://docs.docker.com/compose/compose-file/#ports
  interface ExtractPorts {
    (portsData: Ports): string[];
  }
  export const extractPorts: ExtractPorts = (portsData) => {
    const ports: string[] = [];
    // short syntax string
    if (typeof portsData === 'string') {
      ports.push(portsData);
      // short or long syntax
    } else if (Array.isArray(portsData)) {
      portsData.forEach((port: string | Port) => {
        // short syntax
        if (typeof port === 'string') {
          const end = port.indexOf('/') !== -1 ? port.indexOf('/') : port.length;
          ports.push(port.slice(0, end));
          // long syntax
        } else if (typeof port === 'object') {
          ports.push(port.published + ':' + port.target);
        }
      });
    }
  
    return ports;
  };
  
  // VOLUMES: https://docs.docker.com/compose/compose-file/#volumes
  interface ExtractVolumes {
    (VolumesData: Volumes): string[];
  }
  export const extractVolumes: ExtractVolumes = (volumesData) => {
    const volumes: string[] = [];
    // short syntax string
    volumesData!.forEach((vol: VolumeType) => {
      // short syntax
      if (typeof vol === 'string') {
        volumes.push(vol);
        // long syntax
      } else if (typeof vol === 'object') {
        volumes.push(vol.source + ':' + vol.target);
      }
    });
    return volumes;
  };
  
  // NETWORKS: https://docs.docker.com/compose/compose-file/#networks
  interface ExtractNetworks {
    (networksData: string[] | {}): string[];
  }
  export const extractNetworks: ExtractNetworks = (networksData) => {
    const networks = Array.isArray(networksData)
      ? networksData
      : Object.keys(networksData);
    return networks;
  };
  
  // DEPENDS_ON: https://docs.docker.com/compose/compose-file/#depends_on
  interface ExtractDependsOn {
    (services: Services): Link[];
  }
  export const extractDependsOn: ExtractDependsOn = (services) => {
    const links: Link[] = [];
  
    Object.keys(services).forEach((sName: string) => {
      if (services[sName].hasOwnProperty('depends_on')) {
        services[sName].depends_on!.forEach((el:any) => {
          links.push({ source: el, target: sName });
        });
      }
    });
  
    return links;
  };
  
  /**
   * *************
   * DAG CREATOR
   * *************
   * adds dag properties a d3 array of nodes passed in and returns depth of tree
   */
  
  /*
  DAG: directed acyclic graph
  This means that it is impossible to traverse the entire graph starting at one edge. The edges of the directed graph only go one way.
  */
  interface DagCreator {
    (nodesObject: SNode[], Links: Link[]): number;
  }
  export const dagCreator: DagCreator = (nodes, links) => {
    //roots object creation, needs to be a deep copy or else deletion of non-roots will remove from nodesObject
    const nodesObject: NodesObject = {};
    nodes.forEach((node) => {
      nodesObject[node.name] = node;
      
    });
  
    const roots = JSON.parse(JSON.stringify(nodesObject));
    //iterate through links and find if the roots object contains any of the link targets
    links.forEach((link: Link) => {
      if (roots[link.target]) {
        //filter the roots
        delete roots[link.target];
      }
    });
  
    //create Tree
    const createTree = (node: NodesObject) => {
      Object.keys(node).forEach((root: string) => {
        links.forEach((link: Link) => {
          if (link.source === root) {
            node[root].children[link.target] = nodesObject[link.target];
          }
        });
        createTree(node[root].children);
      });
    };
    createTree(roots);
  
    //traverse tree and create object outlining the rows/columns in each tree
    const treeMap: TreeMap = {};
    const createTreeMap = (node: NodesObject, height: number = 0) => {
      if (!treeMap[height] && Object.keys(node).length > 0) treeMap[height] = [];
      Object.keys(node).forEach((sName: string) => {
        treeMap[height].push(sName);
        createTreeMap(node[sName].children, height + 1);
      });
    };
    createTreeMap(roots);
  
    // populate nodesObject with column, row, and rowLength
    const storePositionLocation = (treeHierarchy: TreeMap) => {
      Object.keys(treeHierarchy).forEach((row: string) => {
        treeHierarchy[row].forEach((sName: string, column: number) => {
          nodesObject[sName].row = Number(row);
          if (!nodesObject[sName].column) nodesObject[sName].column = column + 1;
          nodesObject[sName].rowLength = treeHierarchy[row].length;
        });
      });
    };
    storePositionLocation(treeMap);
  
    return Object.keys(treeMap).length;
  };
  
  /**
   * ********************
   * @param services
   * @returns an object with serviceGraph, simulation and treeDepth properties
   * ********************
   * 
   * GIO:
   *  made SetD3State take a kubeObj or Service object
   * yamlState: { Kind: ..., name: ... , containers: name: ...., image:...., port:.... }
   */
  
  
  
  const setD3State: SetD3State = (services:any = {}) => {
    // if its a Kube Obj
   
    let nodes: any = [];
    if(services.containers){
      
        nodes = services.containers.map((sName:any, i:any) => {
          const ports = services.containers[i].containerPort;
          const node: SNode = {
            id: i + 1,
            name: sName.name,
            ports,
            volumes: [],
            children: {},
            row: 0,
            rowLength: 0,
            column: 0,
          };
          console.log('nodes in setd3state: ', node)
          // nodes[nodes.length-1] = 
          
          return node;
    
        })
      
      
      const node: SNode = {
        id: 10,
        name: services.name,
        ports: ['0000'],
        volumes: [],
        children: {},
        row: 0,
        rowLength: 0,
        column: 0,
      };
      nodes[nodes.length] = node;
      let newNodesArr = [];
      
      console.log('nodes before loop: ', nodes)
      let counter = 0;
      while(counter < services.replica - 1){
        for(let i = 0; i < services.replica - 1; i++){
          let newNode = nodes[i];
          console.log('this is nodes name', newNode.name);
          console.log('this is count', counter)
          if (newNode.name === node.name) continue;
          else {
            if(counter === 0){
              newNode = {...nodes[i], id: nodes[i].id + counter + i, name: nodes[i].name + ` replica ${counter + 1}`};
            }
            else {
              newNode = {...nodes[i], id: nodes[i].id + counter + i, name: nodes[i].name + ` replica ${counter + 1}`};
            }
            
           newNodesArr.push(newNode);
          }
          // counter += 1;
        }
        counter += 1;
      }
      
      nodes = nodes.concat(newNodesArr);
      console.log('these are the nodes', nodes)
      
    }else{
    nodes = Object.keys(services).map((sName: string, i) => {
      // extract ports data if available
      const ports = services[sName].hasOwnProperty('ports')
        ? extractPorts(services[sName].ports as Ports)
        : [];
      // extract volumes data if available
      const volumes: string[] = services[sName].hasOwnProperty('volumes')
        ? extractVolumes(services[sName].volumes as Volumes)
        : [];
      // extract networks data if available
      const networks: string[] = services[sName].hasOwnProperty('networks')
        ? extractNetworks(services[sName].networks as string[])
        : [];
      const node: SNode = {
        id: i,
        name: sName,
        ports,
        volumes,
        networks,
        children: {},
        row: 0,
        rowLength: 0,
        column: 0,
      };
      
      return node;
    });
  }
  const links: Link[] = [];
  // console.log('these are the services when setD3State is called', services['p'])
  
  if(services.containers){
    // services.containers.forEach((sName: any) => {
    // // if (services.container[sName].hasOwnProperty('depends_on')) {
    //   // services[sName].depends_on!.forEach((el: any) => {
        
    //       console.log('services: ', services)
    //       console.log(services.name, sName.name)
          
    //       links.push({ source: services.name, target: sName.name});
  
    /*
    nodes = [ng]
    */
     
    nodes.forEach((node:any) => {
      if (!node.name.includes('replica')) links.push({source: services.name, target: node.name});
    });
  
    // for(let i = 0; i < services.replica - 1; i++){
    //   links.push({source: 'nginx', target: `nginx replica ${i}`})
    // }
    console.log('these are the containers', services.containers)
  
    for(let i = 0 ; i < services.containers.length; i++){
      for(let j = 0; j < services.replica - 1; j++){
        console.log('hit this line 312 in setD3')
        links.push({source: `${services.containers[i].name}`, target: `${services.containers[i].name} replica ${j + 1}`})
      }
    }
    // console.log('these are the links: ', links);
          
          
    //   });
    // }
  // });
  }
  else{
    console.log('services in Setd3 if not a kube file', services)
  
    Object.keys(services).forEach((sName: string) => {
      if (services[sName].hasOwnProperty('depends_on')) {
      services[sName].depends_on!.forEach((el:any) => {
        links.push({ source: el, target: sName });
      });
      }
    });
  }
  
    const treeDepth = dagCreator(nodes, links);
    /**
     *********************
     * Variables for d3 visualizer
     *********************
     */
    const d3State: D3State = {
      treeDepth,
      serviceGraph: {
        nodes,
        links,
      },
      simulation: d3.forceSimulation<SNode>(nodes),
    };
    // console.log('these are the nodes', nodes)
    // console.log('this is the D3 state', d3State)
    return d3State;
  };
  
  export default setD3State;
