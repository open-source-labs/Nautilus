/**
 * 
 * @module tabSlice.ts
 * 
 * @author Jordan Long
 * @date 6/15/2022
 * @description Defines both Tab related initial state, actions, and its state modifying reducer
 * 
 */

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import setD3State from '../renderer/helpers/setD3State';

interface SwitchTab { //copied from app.d.ts but removed the void and switched from 'type' to interface
    filePath: string, openFiles?: Array<string>;
  };

const initialState = {} as SwitchTab;

const tabSlice = createSlice({
    name: 'tab', //an arbitrary name for this set of reducers, in this case the tab group
    initialState, //defined above, I'm copying this from the first invocation of 
    reducers: {
      switchTab (state, action: PayloadAction<SwitchTab>) {
        const tabState = JSON.parse(localStorage.getItem(action.payload.filePath) || '{}');
        // Create new state object with the returned tab state
        let newState;
        let tempObj = action.payload.openFiles;
        if (tempObj)
          newState = {
            ...state,
            ...tabState,
            tempObj,
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
        state = {...newState};
      },
      // closeTab (state, action: PayloadAction<SwitchTab>) {
      //   // Grab current open files and remove the file path of the tab to be closed, assign the
      //   // updated array to newOpenFiles
      //   const { openFiles, options } = state;
      //   const newOpenFiles = openFiles.filter((file) => file != action.payload.filePath);
      //   // Remove the state object associated with the file path in localStorage
      //   localStorage.removeItem(action.payload.filePath);
      //   // If the tab to be closed is the active tab, reset d3 and delete "state" object from local
      //   // storage and set state to the initial state with the updated open files array included.
      //   if (action.payload.filePath === state.filePath) {
      //     // Remove the 'state' localStorage item, which represents the
      //     // services of the currently opened file.
      //     localStorage.removeItem('state');
      //     // Stop the simulation to prevent d3 transform errors related
      //     // to 'tick' events
      //     const { simulation } = window.d3State;
      //     simulation.stop();
      //     // If there are other open tabs, switch to the first open one
      //     // If not, reset to initialState with selected options.
      //     if (openFiles.length > 1) this.switchTab(newOpenFiles[0], newOpenFiles);
      //     else this.setState({ ...initialState, options });
      //   } else this.setState({ ...state, openFiles: newOpenFiles });
      }
    }
})

export const {switchTab, closeTab} = tabSlice.actions;
export default tabSlice.reducer;