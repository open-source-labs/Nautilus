// update file name
import { createSlice, PayloadAction } from "@reduxjs/toolkit";


interface ViewAndSelectNetwork {
    view?: 'networks' | 'depends on';
    selectedNetwork?: string;
}

const initialState: ViewAndSelectNetwork = {
    view: 'networks',
    selectedNetwork: ""
} 

const viewAndSelectNetworkSlice = createSlice({
    name: 'viewAndSelectNetwork',
    initialState,
    reducers: {
        updateView(state, action: PayloadAction<ViewAndSelectNetwork>){
            let newState;
            newState = {
                ...state,
                view: action.payload.view, //which property to access passed in view?
                selectedNetwork: ''
            }
            return newState;
        },
        selectNetwork(state, action: PayloadAction<ViewAndSelectNetwork>){
            const newState = {
                ...state,
                selectedNetwork: action.payload.selectedNetwork,
                view: "networks"
            }
            return newState;
        }
    }
})
 /* 
    updateView: 
    - If invoking action in handleNetworkUpdate:
	invoke : dispatch(selectNetwork( view: view )

    - If invoking in onclick property: 
	onclick = { (e) => {

			dispatch(selectNetwork( view: e.currentTarget.id ))
			}
		}
    ----

    selectNetwork: 
     - If invoking action in handleViewOption:
	invoke : dispatch(updateView( network: network )

    - If invoking in onclick property: 
	onclick = { (e) => {

			dispatch(updateView( view: e.currentTarget.value ))
			}
		}

 */




export const { updateView, selectNetwork } = viewAndSelectNetworkSlice.actions;
export default viewAndSelectNetworkSlice.reducer