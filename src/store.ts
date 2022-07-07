/**
 * ************************************
 *
 * @module  store.ts
 * @author Jordan Long, Michael Villamor, Nathan Lovell, Giovanni Rodriguez
 * @date 6/16/2022
 * @description Redux 'single source of truth'
 *
 * ************************************
 */

import { configureStore } from '@reduxjs/toolkit';
import appSlice from './reducers/appSlice';

 
const store = configureStore({
  reducer:  appSlice,
});

export type AppState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch;
export default store;