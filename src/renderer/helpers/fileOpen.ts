
import yaml from 'js-yaml';
import convertYamlToState from './yamlParser';
import setD3State from './setD3State';
import parseOpenError from './parseOpenError';
import resolveEnvVariables from '../../common/resolveEnvVariables';
import { runDockerComposeValidation } from "../../common/runShellTasks";

import {
    // State,
    FileOpen,
    // UpdateOption,
    // UpdateView,
    // SelectNetwork,
    // SwitchTab,
  } from '../App.d'

const readFileAsync = (file:File) => {
  return new Promise((resolve, reject) => {
    let reader = new FileReader();

    reader.onload = () => {
      resolve(reader.result);
    };

    reader.onerror = reject;

    reader.readAsArrayBuffer(file);
  })
};

export const fileOpen: FileOpen = async (file: File, openFiles = []): Promise<any> => {
    // check for valid file path
    if (file.path) {
      // console.log('this is the file ', file);
      await runDockerComposeValidation(file.path).then( async (validationResults: any) => { 
        if (validationResults.error) {
          
          /** 
           * @MUSTDO
           * if validationResults.error is related to kubernetes yaml,
           * run a composeValidation for the kubernetes file  
           * if it succeeds, go to the else block;
           */
          if (validationResults.error.message.includes('apiVersion') || validationResults.error.message.includes('kind')){
           let text:any = await readFileAsync(file);
           text = new TextDecoder().decode(text);
           const yamlText = convertAndStoreYamlJSON(text, file.path, openFiles);
           getCache(yamlText);
          }
          else {
            handleFileOpenError(validationResults.error)
          }
        } else {
            let yamlText: any = await readFileAsync(file);
            yamlText = new TextDecoder().decode(yamlText);
            //if docker-compose uses env file, replace the variables with value from env file
            if (validationResults.envResolutionRequired) {
              yamlText = resolveEnvVariables(yamlText, file.path);
            }
            const yaml = convertAndStoreYamlJSON(yamlText, file.path, openFiles);
              
            getCache(yaml);
        }
      });
    }
  };
  //Makeshift solution to get async file read working when called from fileSelector
  //without putting read file text in some sort of cache the call in fileSelector was returning undefined
  export function cacheFile (){
    let pw = '123'
    let cache:any = [];
    
    return function (password: any){
      if (password === pw) return cache
      else if (!cache.includes(password)){
        cache.unshift(password);       
    }
  }
}
  export function cacheError(){
    let pw = '123'
    let cache:any = [];

    return function(password: any){
      if (password === pw) return cache
      else if (password === 'reset'){
        cache = [];
      }
      else {
        cache = [];
        cache.push(password);
      }
    }
  }
  export const getCache = cacheFile();
  export const cacheErrors = cacheError();

  export const convertAndStoreYamlJSON = (yamlText: string, filePath: string, openFiles: string[] = []) => {
    // Convert Yaml to state object.
    // console.log('yaml text that went to cAndStoreYamlJson', yamlText)
    const yamlJSON = yaml.safeLoad(yamlText);
    // console.log(yamlJSON)
    const yamlState = convertYamlToState(yamlJSON, filePath);
    
    // Don't add a file that is already opened to the openFiles array
    if (!openFiles.includes(filePath)) openFiles.push(filePath); 
  
    // Set global variables for d3 simulation
    if(yamlState.kubeObj){
      window.d3State = setD3State(yamlState.kubeObj);
    }else{
     window.d3State = setD3State(yamlState.services);
    }
    // console.log('this is the windowD3 state', window.d3State)
    
    // Store opened file state in localStorage under the current state item call "state" as well as an individual item using the filePath as the key.
    localStorage.setItem('state', JSON.stringify(yamlState));
    localStorage.setItem(`${filePath}`, JSON.stringify(yamlState));
    return {yamlState: yamlState, filePath:filePath, openFiles: openFiles}
  };
  

  /**
     * @param errorText -> string
     * @returns void
     * @description sets state with array of strings of different errors
     */
  export const handleFileOpenError = (errorText: Error) => {
    // Stop the simulation to prevent hundreds of d3 transform errors from occuring. This is rare but its a simple fix to prevent it.
    const { simulation } = window.d3State;
    simulation.stop();
    // Grab the current openFiles array so that we don't lose them when setting state.
    const openErrors = parseOpenError(errorText);
    console.log('openError in handleFileOpenError: ', openErrors);
    cacheErrors(openErrors);
    return openErrors;
  };
