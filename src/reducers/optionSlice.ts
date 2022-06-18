/**
 * 
 * @module tabSlice.ts
 * 
 * @author Jordan Long
 * @date 6/16/2022
 * @description Defines option state and its state modifying reducer
 * 
 */
 import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { options } from "../../samples/react-express-mongodb/backend/server";

 interface Options {
    ports: boolean;
    volumes: boolean;
    selectAll: boolean;
  };

const initialState = {ports: false, volumes: false, selectAll: false} as Options;

const optionSlice = createSlice({
    name: 'option',
    initialState,
    reducers: {
        updateOption (state, action: PayloadAction<Options>) {
            // const tempObj = action.payload; //variable created to pass in the payload because dot notation doesn't work after spread operator
            // const newState = {
            //     ...state,
            //     action.paylod, //need to figure out how to pass in only the option that's being sent
            // }
            //  // check if toggling select all on or off
            // if (action.payload.selectAll === 'selectAll') {
            //     if (newState.action.payload.selectAll) {
            //     newState.action.payload.ports = true;
            //     newState.action.payload.volumes = true;
            //     } else {
            //     newState.action.payload.ports = false;
            //     newState.action.payload.volumes = false;
            //     }
            //     // check if select all should be on or off
            // } else {
            //     if (newState.action.payload.ports && newState.action.payload.volumes) {
            //     newState.action.payload.selectAll = true;
            //     } else {
            //     newState.action.payload.selectAll = false;
            //     }
            // }
            // this.setState(newState);
        }
    }
})

/**
 * 
 updateOption: UpdateOption = (option) => {
   const newState: State = {
     ...this.state,
     options: { ...this.state.options, [option]: !this.state.options[option] },
    };
    // check if toggling select all on or off
    if (option === 'selectAll') {
      if (newState.options.selectAll) {
        newState.options.ports = true;
        newState.options.volumes = true;
      } else {
        newState.options.ports = false;
        newState.options.volumes = false;
      }
      // check if select all should be on or off
    } else {
      if (newState.options.ports && newState.options.volumes) {
        newState.options.selectAll = true;
      } else {
        newState.options.selectAll = false;
      }
    }
    this.setState(newState);
  };
*/