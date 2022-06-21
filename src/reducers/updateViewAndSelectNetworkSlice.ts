// update file name
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

/**
 * @MUSTDO
 * See below comment on line 9 
 */
interface ViewAndSelectNetwork {
    //had to change view type to string from 'networks' | 'depends on' - will revisit
    view?: string;
    selectedNetwork?: string;
}

const initialState: ViewAndSelectNetwork = {
    view: 'depends_on',
    selectedNetwork: "networks"
} 

const viewAndSelectNetworkSlice = createSlice({
    name: 'viewAndSelectNetwork',
    initialState,
    reducers: {
        updateViewStore(state = initialState, action: PayloadAction<ViewAndSelectNetwork>){
            return {
                ...state,
                view: action.payload.view, //which property to access passed in view?
                selectedNetwork: ''
            }
        },
        selectNetwork(state, action: PayloadAction<string>){
            return {
                ...state,
                selectedNetwork: action.payload,
                view: 'networks'
            }
        }
    }
})



export const { updateViewStore, selectNetwork } = viewAndSelectNetworkSlice.actions;
export default viewAndSelectNetworkSlice.reducer