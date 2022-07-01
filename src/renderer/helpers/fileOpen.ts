
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
<<<<<<< HEAD
    // console.log('Opening file');
    const fileReader = new FileReader();
=======
>>>>>>> a3b5e6b... app & file open cleaned up
    // check for valid file path
    if (file.path) {
      console.log('this is the file ', file);
      await runDockerComposeValidation(file.path).then( async (validationResults: any) => { 
        if (validationResults.error) {
          
          /** 
           * @MUSTDO
           * if validationResults.error is related to kubernetes yaml,
           * run a composeValidation for the kubernetes file  
           * if it succeeds, go to the else block;
           */
<<<<<<< HEAD
           let text:any = await readFileAsync(file);
           text = new TextDecoder().decode(text);
           const yamlText = convertAndStoreYamlJSON(text, file.path, openFiles);
<<<<<<< HEAD
           console.log('yaml stored', yamlText)
=======
          //REALLY BAD SOLUTION SHOULD BE CHANGED BUT NEED TO REWORK THESE FUNCTIONS:
          
>>>>>>> 0797247... ready to merge to feature
          console.log('broken here in app.tsx line 153. Error here: ', validationResults.error)
          const error = handleFileOpenError(validationResults.error);
          fileReader.readAsText(file);
          return error;
        } else {
          // console.log('before filereader, this log will work');
          // event listner to run after the file has been read as text
          // fileReader.onload = () => {
            // console.log('filereader is loading');
            // if successful read, invoke method to convert and store to state
            // if (fileReader.result) {
              let yamlText: any = await readFileAsync(file);
              // yamlText = yamlText.toString();
              // yamlText = new TextEncoder().encode(yamlText);
              // console.log("regular: ", yamlText);
              // console.log("First version: " , new TextEncoder().encode(yamlText));
              // console.log("Second version: " , new TextDecoder().decode(yamlText));
              yamlText = new TextDecoder().decode(yamlText);

              // let yamlText = fileReader.result.toString();
              //if docker-compose uses env file, replace the variables with value from env file
              if (validationResults.envResolutionRequired) {
                yamlText = resolveEnvVariables(yamlText, file.path);
              }
              const yaml = convertAndStoreYamlJSON(yamlText, file.path, openFiles);
              getCache(yaml);
              
=======
           getCache(yamlText);
        } else {
            let yamlText: any = await readFileAsync(file);
            yamlText = new TextDecoder().decode(yamlText);
            //if docker-compose uses env file, replace the variables with value from env file
            if (validationResults.envResolutionRequired) {
              yamlText = resolveEnvVariables(yamlText, file.path);
            }
            const yaml = convertAndStoreYamlJSON(yamlText, file.path, openFiles);
>>>>>>> a3b5e6b... app & file open cleaned up
              
            getCache(yaml);
        }
      });
    }
  };
  //Makeshift solution to get async file read working when called from fileSelector - without putting read file text in some sort of cache the call in fileSelector was returning undefined
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
  export const getCache = cacheFile();

  export const convertAndStoreYamlJSON = (yamlText: string, filePath: string, openFiles: string[] = []) => {
    // Convert Yaml to state object.
    console.log('yaml text that went to cAndStoreYamlJson', yamlText)
    const yamlJSON = yaml.safeLoad(yamlText);
    console.log(yamlJSON)
    const yamlState = convertYamlToState(yamlJSON, filePath);
    
    // Don't add a file that is already opened to the openFiles array
    if (!openFiles.includes(filePath)) openFiles.push(filePath); 
  
    // Set global variables for d3 simulation
    //check if file is Kubernetes, if yes setD3 with kubeObj else set with services
    // yamlState.kubeBool? window.d3State = setD3State(yamlState.kubeObj):window.d3State = setD3State(yamlState.services);
    
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
    return openErrors;
  };
