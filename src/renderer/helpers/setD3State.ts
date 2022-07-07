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
    (nodesObject: SNode[], Links: Link[], kubeBool: boolean): number;
  }
  export const dagCreator: DagCreator = (nodes, links, kubeBool) => {
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
      if(treeHierarchy[0] && kubeBool){
      let sorted = treeHierarchy[0].sort();
      let copy = {...treeHierarchy, '0': sorted};
      treeHierarchy = copy;
      }
      
      Object.keys(treeHierarchy).forEach((row: string) => {
        treeHierarchy[row].forEach((sName: string, column: number) => {
          nodesObject[sName].row = Number(row);
          if (!nodesObject[sName].column) nodesObject[sName].column = column + 1;
          nodesObject[sName].rowLength = treeHierarchy[row].length;
        });
      });
  }
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
      
      let counter = 0;
      while(counter < services.replica - 1){
        for(let i = 0; i < services.replica - 1; i++){
          let newNode = nodes[i];
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
        }
        counter += 1;
      }
      
      nodes = nodes.concat(newNodesArr);
      
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
  
  if(services.containers){
     
    nodes.forEach((node:any) => {
      if (!node.name.includes('replica') && services.name !== node.name) links.push({source: node.name, target: services.name});
    });

    for(let i = 0 ; i < services.containers.length; i++){
      for(let j = 0; j < services.replica - 1; j++){
        links.push({target: `${services.containers[i].name}`, source: `${services.containers[i].name} replica ${j + 1}`})
      }
    }
  }
  else{
    
    Object.keys(services).forEach((sName: string) => {
      if (services[sName].hasOwnProperty('depends_on')) {
      services[sName].depends_on!.forEach((el:any) => {
        links.push({ source: el, target: sName });
      });
      }
    });
  }
    let kubeBool = false;
    if(services.kind){
      kubeBool = true;
    }

    const treeDepth = dagCreator(nodes, links, kubeBool);
    /**
     *********************
     * Variables for d3 visualizer
     *********************
     */
    nodes = nodes.sort((a:any,b:any) => {
      return a.id - b.id
    })
    const d3State: D3State = {
      treeDepth,
      serviceGraph: {
        nodes,
        links,
      },
      simulation: d3.forceSimulation<SNode>(nodes),
    };
    return d3State;
  };
  
  export default setD3State;
