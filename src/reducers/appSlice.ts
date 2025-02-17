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
     YamlState,
     ViewAndSelectNetwork
   } from '../renderer/App.d';
 
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
   kubeObj: {},
   kubeBool: false
 };
 
 const appSlice = createSlice({
     name: 'app',
     initialState,
     reducers: {
       yamlToState (state: State, action: PayloadAction<YamlState>) {        
         state = {
           ...state, 
           ...action.payload
         };
         state.services = action.payload;
         return state;
       },
       switchTab (state: State, action: PayloadAction<SwitchTab>) {
         
         
         const tabState = JSON.parse(localStorage.getItem(action.payload.filePath) || '{}');
          if (action.payload.openFiles && !state.openFiles.includes(action.payload.filePath)){
           state = {
             ...state,
             ...tabState,
             openFiles: state.openFiles.concat(action.payload.openFiles),
             filePath: action.payload.filePath
           };
         }
         else {
           state = {
             ...state,
             ...tabState
           };
           if (tabState.kubeBool){ 
             state.services = tabState.kubeObj;
             state = {
             ...state,
             ...tabState,
             kubeBool: true,
             selectedContainer: ''
             }
             state.filePath = action.payload.filePath;
           }
         }
         state.selectedNetwork = 'networks';
         state.view = 'depends_on';
         if(state.kubeBool){
          state.services = tabState.kubeObj;
         }
         // Set the 'state' item in localStorage to the tab state. This means that tab is the current tab, which would be used if the app got reloaded.
         localStorage.setItem('state', JSON.stringify(tabState));
         // Set the d3 state using the services extracted from the tabState and then setState
         if(state.kubeBool){
           window.d3State = setD3State(state.kubeObj || {})
         }else{
           window.d3State = setD3State(state.services);
         }
        return state;
      },
      closeTab (state: State, action: PayloadAction<SwitchTab>) {
         // Grab current open files and remove the file path of the tab to be closed, assign the
         // updated array to newOpenFiles
         const { openFiles } = state;
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
             if (tabState.kubeBool) tabState.filePath = newFilePath;
             localStorage.setItem('state', JSON.stringify(tabState));
             // appSlice.caseReducers.switchTab(state, {payload: {filePath: newFilePath, openFiles: newOpenFiles, closeTab: true}, type: 'switchTab'});
             state = {...state, ...tabState, openFiles: newOpenFiles, selectedContainer: '', view: 'depends_on'};
             if (tabState.kubeBool){
               state.services = tabState.kubeObj;
             }
             window.d3State = setD3State(state.services);
             return state;
           }
           // else this.setState({ ...initialState, options });
           else return {...initialState };
         }
         return { ...state, openFiles: newOpenFiles };
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
          if(action.payload[0] === 'reset'){
            state = {...state, openErrors: []};
            return state;
          }
          // state.openErrors.concat(action.payload)
          let newOpenErrors = [];
          newOpenErrors.push(action.payload[0]);
          // state.fileOpened = false;
          
          state = {...state, openErrors: newOpenErrors, fileOpened: false };
          return state;
        },
        openYamlFiles (state: State, action: PayloadAction<string[]> ) {
          state.openFiles.concat(action.payload);
          return state;
        },
        updateOption (state: State, action: PayloadAction<string>) {
          // let option = action.payload.option;
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

