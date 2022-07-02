/**
 * 
 * @module appSlice.ts
 * 
 * @author Jordan Long, Michael Villamor, Nathan Lovell, Giovanni Rodriguez
 * @date 6/22/2022
 * @description Primary reducer which also initializes state
 * 
 */

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import setD3State from "../renderer/helpers/setD3State";
import {
    State,
    SwitchTab,
    // FileOpen,
    // UpdateOption,
    // UpdateView,
    // SelectNetwork,
    // SetSelectedContainer,
    YamlState,
    ViewAndSelectNetwork
  } from '../renderer/App.d';
// import { convertAndStoreYamlJSON } from "../renderer/helpers/fileOpen";
// import { act } from "react-test-renderer";

 const initialState: State =  {
  openFiles: [],
  openErrors: [],
  selectedContainer: '',
  fileOpened: false,
  filePath: '',
  services: {},
  dependsOn: {
    name: 'placeholder',
  },
  networks: {},
  selectedNetwork: 'networks',
  volumes: {},
  volumesClicked: {},
  bindMounts: [],
  bindMountsClicked: {},
  view: 'depends_on',
  options: {
    ports: false,
    volumes: false,
    selectAll: false,
  },
  version: '',
  KubeObj: {},
  KubeBool: false
};

const appSlice = createSlice({
    name: 'app',
    initialState,
    reducers: {
      yamlToState (state: State, action: PayloadAction<YamlState>) {
        // console.log('payload in yamlToState after dispatch: ', action.payload);
        
        state = {
          ...state, 
          ...action.payload
        };
        state.services = action.payload;
        //console log to see state:
        // console.log('state after opening a file', JSON.stringify(state, undefined, 2)); 
        return state;
      },
      switchTab (state: State, action: PayloadAction<SwitchTab>) {
        console.log('something got dispatched to switchTab')
        
        
        console.log('SwitchTab payload', action.payload)
        const tabState = JSON.parse(localStorage.getItem(action.payload.filePath) || '{}');
        // const fileToPushIn = [];
        // console.log('tabState in Switchtab', tabState);
        // Create new state object with the returned tab state
        // if(!state.openFiles.includes(action.payload.openFiles[0])) fileToPushIn.push(action.payload.openFiles[0]);
        // console.log('this tab state', tabState)
        
          
        
         if (action.payload.openFiles && !state.openFiles.includes(action.payload.filePath)){
          state = {
            ...state,
            ...tabState,
            openFiles: state.openFiles.concat(action.payload.openFiles),
            filePath: action.payload.filePath
          };
          console.log('this is tabState', tabState)
        }
        else {
          console.log('this is tabState in else', tabState)
          state = {
            ...state,
            ...tabState,
          };
          if (tabState.kubeBool){ 
            console.log('kubeBool is true')
            state.services = tabState.kubeObj;
            state.filePath = action.payload.filePath;
          }
        }

        // Set the 'state' item in localStorage to the tab state. This means that tab is the current tab, which would be used if the app got reloaded.
        // console.log('local storage before calling setitem in SwitchTab reducer', localStorage)
        localStorage.setItem('state', JSON.stringify(tabState));
        // console.log('local storage after calling setitem in SwitchTab reducer', localStorage)

        // Set the d3 state using the services extracted from the tabState and then setState
        // console.log('window.d3state in switchtab reducer before calling setD3state', window.d3State);
          console.log('kubeBool true hit else condition in appSlice');
          window.d3State = setD3State(state.services);
        // console.log('window.d3state in switchtab reducer after calling setD3state', window.d3State);
       
        return state;
      },
      closeTab (state: State, action: PayloadAction<SwitchTab>) {
        // Grab current open files and remove the file path of the tab to be closed, assign the
        // updated array to newOpenFiles
        console.log('something got dispatched to closeTab');
        console.log('action.payload in closeTab: ', action.payload)
        const { openFiles } = state;
        console.log('openFiles before filtering: ', openFiles);
        const newOpenFiles = openFiles.filter((file: string) => file != action.payload.filePath);
        // Remove the state object associated with the file path in localStorage
        
        localStorage.removeItem(action.payload.filePath);
        
        // If the tab to be closed is the active tab, reset d3 and delete "state" object from local
        // storage and set state to the initial state with the updated open files array included.
        if (action.payload.filePath === state.filePath) {
          // Remove the 'state' localStorage item, which represents the
          // services of the currently opened file.
          localStorage.removeItem('state');
          // Stop the simulation to prevent d3 transform errors related
          // to 'tick' events
          const { simulation } = window.d3State;
          simulation.stop();
          // If there are other open tabs, switch to the first open one
          // If not, reset to initialState with selected options.
          if (openFiles.length > 1){
            let newFilePath = newOpenFiles[0];
            const tabState = JSON.parse(localStorage.getItem(newFilePath) || '{}');
            localStorage.setItem('state', JSON.stringify(tabState));
            console.log('tabState in closeTab: ', tabState);
            console.log('new open files: ', newOpenFiles);
            console.log('new file path: ', newFilePath);
            // appSlice.caseReducers.switchTab(state, {payload: {filePath: newFilePath, openFiles: newOpenFiles, closeTab: true}, type: 'switchTab'});
            state = {...state, ...tabState, openFiles: newOpenFiles}
            console.log('state before returning: ', JSON.stringify(state, undefined, 2));
            window.d3State = setD3State(state.services);
            return state;
          }
          // else this.setState({ ...initialState, options });
          else return {...initialState };
          console.log('newOpenFiles: ', newOpenFiles);
        }  return { ...state, openFiles: newOpenFiles };
        },
        updateViewStore(state: State, action: PayloadAction<ViewAndSelectNetwork>){
          state.view = action.payload.view;
          state.selectedNetwork = '';
          return state;
        },
        selectNetwork(state: State, action: PayloadAction<string>){
          state.selectedNetwork = action.payload;
          state.view = 'networks';
          return state;
        },
        setSelectedContainers(state: State, action: PayloadAction<string>){
          state.selectedContainer = action.payload;
          return state;
        },
        fileOpenError (state: State, action: PayloadAction<string[]>) {
          state.openErrors.concat(action.payload)
          state.fileOpened = false;
          return state;
        },
        openYamlFiles (state: State, action: PayloadAction<string[]> ) {
          console.log('openYamlFiles dispatch received by reducer')
          state.openFiles.concat(action.payload);
          console.log(state);
          return state;
        },
        updateOption (state: State, action: PayloadAction<string>) {
          // let option = action.payload.option;
          console.log('option clicked: ', action.payload);
              // if (action.payload === 'ports') Object.assign(newState, newState[action.payload] = true)
             // check if toggling select all on or off
            if (action.payload === 'ports') state.options.ports = !state.options.ports;
            if (action.payload === 'volumes') state.options.volumes = !state.options.volumes;
            if (action.payload === 'selectAll') {
                state.options.ports = !state.options.ports;
                state.options.volumes = !state.options.volumes;
            }else if (state.options.ports && state.options.volumes) {
                  state.options.selectAll = true;
            } else {
              state.options.selectAll = false;
            }
              
                
            return state;
        }

    }
})

export const {yamlToState, switchTab, closeTab, updateViewStore, selectNetwork, openYamlFiles, setSelectedContainers, fileOpenError, updateOption} = appSlice.actions;
export default appSlice.reducer;