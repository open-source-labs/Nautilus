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
// import { options } from "../../samples/react-express-mongodb/backend/server";

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
            const newState = {
                ...state,
                ports: action.payload.ports,
                volumes: action.payload.volumes,
                selectAll: action.payload.selectAll
              }
             // check if toggling select all on or off
            if (action.payload.selectAll) {
                newState.ports = true;
                newState.volumes = true;
            }else if (newState.ports && newState.volumes) {
                  newState.selectAll = true;
            }
                // check if select all should be on or off
            state = {...newState};
        }
    }
})

export const { updateOption } = optionSlice.actions;
export default optionSlice.reducer;

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