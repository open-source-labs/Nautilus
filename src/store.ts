/**
 * ************************************
 *
 * @module  store.ts
 * @author Jordan Long
 * @date 6/16/2020
 * @description Redux 'single source of truth'
 *
 * ************************************
 */

 import { configureStore } from '@reduxjs/toolkit'; //this is the new way to create a store with RTK
//  import { composeWithDevTools } from 'redux-devtools-extension'; //this was needed in old, 'createStore' method but seems to no longer be needed to create store
 import tabsReducer from './reducers/tabSlice';
 import optionsReducer from './reducers/optionSlice';
 import fileReducer from './reducers/fileSlice';
 import updateViewAndSelectNetworkSlice from './reducers/updateViewAndSelectNetworkSlice';

 import {
  State,
  FileOpen,
  UpdateOption,
  UpdateView,
  SelectNetwork,
  SwitchTab,
  
} from './renderer/App.d';

 //initialState taken from app.ts
 const initialState: State = {
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
  selectedNetwork: '',
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

 // we are adding composeWithDevTools here to get easy access to the Redux dev tools
 const store = configureStore({
    reducer: {
      tab: tabsReducer,
      option: optionsReducer,
      file: fileReducer,
      updateView: updateViewAndSelectNetworkSlice,
      updateNetwork: updateViewAndSelectNetworkSlice
    }
     
 });
 
 export default store;