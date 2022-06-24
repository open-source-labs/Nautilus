// import { useDispatch } from 'react-redux';
// import {createApi} from '@reduxjs/toolkit/query/react';
import yaml from 'js-yaml';
import convertYamlToState from './yamlParser';
import setD3State from './setD3State';
import parseOpenError from './parseOpenError';
import resolveEnvVariables from '../../common/resolveEnvVariables';
import { runDockerComposeValidation } from "../../common/runShellTasks";
// import { yamlToState, switchTab, fileOpenError } from "../../reducers/appSlice";
// import { useAppSelector, useAppDispatch } from '../../hooks';
// const dispatch = useAppDispatch();

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
    console.log('Opening file');
    const fileReader = new FileReader();
    // check for valid file path
    if (file.path) {
      /* TODO: refactor error handling */
      await runDockerComposeValidation(file.path).then( async (validationResults: any) => { 
        if (validationResults.error) {
          /** 
           * @MUSTDO
           * if validationResults.error is related to kubernetes yaml,
           * run a composeValidation for the kubernetes file  
           * if it succeeds, go to the else block;
           * if it fails then display lines 156/157 
           */
          console.log('broken here in app.tsx line 153. Error here: ', validationResults.error)
          const error = handleFileOpenError(validationResults.error);
          fileReader.readAsText(file);
          return error;
        } else {
          console.log('before filereader, this log will work');
          // event listner to run after the file has been read as text
          // fileReader.onload = () => {
            console.log('filereader is loading');
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
              console.log("this is yaml : " ,yaml);
              return new Promise((resolve,reject)=>{
                resolve(yaml);
              });
            //}
          //};
          // read the file
          
          fileReader.readAsText(file);
        }
      });
    }
  };

    
  export const convertAndStoreYamlJSON = (yamlText: string, filePath: string, openFiles: string[] = []) => {
    // Convert Yaml to state object.
    const yamlJSON = yaml.safeLoad(yamlText);
    const yamlState = convertYamlToState(yamlJSON, filePath);
    // console.log('yamlState in openFiles: ', yamlState);
    // dispatch(yamlToState(yamlState));
  
    // Copy options and open files state
    // const openFiles = this.state.openFiles.slice();
    // const { options } = this.state;
    // const openFiles = useAppSelector((state) => state.openFiles);
    // const options = useAppSelector((state) => state.options);
    // Don't add a file that is already opened to the openFiles array
    if (!openFiles.includes(filePath)) openFiles.push(filePath); 
    // dispatch(switchTab({filePath, openFiles}));
  
    // Set global variables for d3 simulation
    window.d3State = setD3State(yamlState.services);
  
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
    // const openFiles = useAppSelector((state) => state.openFiles);
    return openErrors;
    // dispatch(fileOpenError(openErrors))
  };
