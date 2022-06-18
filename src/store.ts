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
 
 // we are adding composeWithDevTools here to get easy access to the Redux dev tools
 const store = configureStore({
    reducer: {
      tab: tabsReducer,
      
    }
     
 });
 
 export default store;