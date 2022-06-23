/**
 * ************************************
 *
 * @module  store.ts
 * @author Jordan Long, Michael Villamor, Nathan Lovell, Giovanni Rodriguez
 * @date 6/16/2020
 * @description Redux 'single source of truth'
 *
 * ************************************
 */

import { configureStore } from '@reduxjs/toolkit'; //this is the new way to create a store with RTK
import appSlice from './reducers/appSlice';

 // we are adding composeWithDevTools here to get easy access to the Redux dev tools
const store = configureStore({
  reducer:  appSlice, //only need to put slice in an object if you want it to 'combine' the reducers together
});

export type AppState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch;
export default store;