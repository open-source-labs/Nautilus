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
};

const appSlice = createSlice({
    name: 'app',
    initialState,
    reducers: {
      yamlToState (state: State, action: PayloadAction<YamlState>) {
        console.log('payload for yamlToState reducer: ', action.payload);
        
        state = {
          ...state, 
          ...action.payload
        };
        console.log(JSON.stringify(state, undefined, 2));
        return state;
      },
      switchTab (state: State, action: PayloadAction<SwitchTab>) {
        const tabState = JSON.parse(localStorage.getItem(action.payload.filePath) || '{}');
        // Create new state object with the returned tab state
        let newState;
        if (action.payload.openFiles)
          newState = {
            ...state,
            ...tabState,
            openFiles: action.payload.openFiles,
          };
        else
          newState = {
            ...state,
            ...tabState,
          };
        // Set the 'state' item in localStorage to the tab state. This means that tab is the current tab, which would be used if the app got reloaded.
        localStorage.setItem('state', JSON.stringify(tabState));
    
        // Set the d3 state using the services extracted from the tabState and then setState
        window.d3State = setD3State(newState.services);
        return state = {...newState};
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
          if (openFiles.length > 1) switchTab({filePath: newOpenFiles[0], openFiles: newOpenFiles});
          // else this.setState({ ...initialState, options });
        } else return { ...state, openFiles: newOpenFiles };
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
        updateOption (state, action: PayloadAction<string>) {
          // let option = action.payload.option;
            const newState = {
                ...state,
                [action.payload]: true 
              }
              // if (action.payload === 'ports') Object.assign(newState, newState[action.payload] = true)
             // check if toggling select all on or off
            if (action.payload === 'selectAll') {
                newState.options.ports = true;
                newState.options.volumes = true;
            }else if (newState.options.ports && newState.volumes) {
                  newState.options.selectAll = true;
            }
                // check if select all should be on or off
            return state = {...newState};
        }

    }
})

export const {yamlToState, switchTab, closeTab, updateViewStore, selectNetwork, openYamlFiles, setSelectedContainers, fileOpenError, updateOption} = appSlice.actions;
export default appSlice.reducer;