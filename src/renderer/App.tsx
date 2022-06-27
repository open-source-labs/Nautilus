/**
 * ************************************
 *
 * @module  App.tsx
 * @author Joshua Nordstrom
 * @date 3/7/20
 * @description start of the application, initializes state
 *
 * ************************************
 */
//IMPORT LIBRARIES
import React, { useEffect } from 'react';

import { ipcRenderer } from 'electron';
import { useDispatch } from 'react-redux';
import { useAppSelector } from '../hooks';

//IMPORT HELPER FUNCTIONS
import {convertAndStoreYamlJSON, handleFileOpenError} from './helpers/fileOpen';
import setD3State from './helpers/setD3State';

 
// IMPORT REACT CONTAINERS OR COMPONENTS
import LeftNav from './components/LeftNav';
import OptionBar from './components/OptionBar';
import D3Wrapper from './components/D3Wrapper';
import TabBar from './components/TabBar';

//IMPORT ACTIONS/REDUCERS
// import { updateView, selectNetwork } from '../reducers/updateViewAndSelectNetworkSlice';
// import { switchTab, closeTab } from '../reducers/tabSlice';
// import { updateOption } from '../reducers/optionSlice';
// import { yamlToState, fileOpenError } from '../reducers/fileSlice';
//  updateViewStore , selecte
import { openYamlFiles, fileOpenError } from '../reducers/appSlice';


// const dispatch = useDispatch();

//IMPORT TYPES
// import {
//   State,
//   FileOpen,
//   UpdateOption,
//   UpdateView,
//   SelectNetwork,
//   SwitchTab,
// } from './App.d';

// const initialState: State = {
//   openFiles: [],
//   openErrors: [],
//   selectedContainer: '',
//   fileOpened: false,
//   filePath: '',
//   services: {},
//   dependsOn: {
//     name: 'placeholder',
//   },
//   networks: {},
//   selectedNetwork: '',
//   volumes: {},
//   volumesClicked: {},
//   bindMounts: [],
//   bindMountsClicked: {},
//   view: 'depends_on',
//   options: {
//     ports: false,
//     volumes: false,
//     selectAll: false,
//   },
//   version: '',
// };

// function App (props){
//   const [openFiles, setOpenFiles] = useState(props.openFiles || []);
//   const [openErrors, setOpenErrors] = useState(props.openErrors || []);
//   const [selectedContainer, setStateSelectedContainer] = useState(props.selectedContainer || '');
//   const [fileOpened, setFileOpened] = useState(props.fileOpened || false);
//   const [filePath, setFilePath] = useState(props.filePath || '');
//   const [services, setServices] = useState(props.services || {});
//   const [dependsOn, setDependsOn] = useState(props.dependsOn || {name: 'placeholder'});
//   const [networks, setNetworks] = useState(props.networks || {});
//   const [selectedNetwork, setSelectedNetwork] = useState(props.selectedNetwork || '');
//   const [volumes, setVolumes] = useState(props.volumes || {});
//   const [volumesClicked, setVolumesClicked] = useState(props.volumesClicked || {});
//   const [bindMounts, setBindMounts] = useState(props.bindMounts || []);


// }

const App: React.FC = ({/**state to be loaded for App */}) => {

  const dispatch = useDispatch();


  useEffect(() => {
    if (ipcRenderer) {
      ipcRenderer.on('file-open-error-within-electron', (event, arg) => {
        dispatch(fileOpenError(handleFileOpenError(arg)));
      });
      ipcRenderer.on('file-opened-within-electron', (event, arg) => {
        convertAndStoreYamlJSON(arg, '', useAppSelector(state => state.openFiles));
      });
    }
    const stateJSON = localStorage.getItem('state');
    if (stateJSON) {
      const stateJS = JSON.parse(stateJSON);
      // set d3 state
      window.d3State = setD3State(stateJS.services);
      console.log('d3state completed in App')
      //Create openFile state array from items in localStorage
      const openFiles = [];
      const keys = Object.keys(localStorage);
      for (let key of keys) {
        if (key !== 'state') {
          const item = localStorage.getItem(key);
          try {
            const parsed = JSON.parse(item || '{}');
            openFiles.push(parsed.filePath);
          } catch {
            console.log(
              'Item from localStorage not included in openFiles: ',
              item,
            );
          }
        }
      }
      console.log('local storage check in App complete')
      dispatch(openYamlFiles(openFiles));
    }
    return () => {
      if (ipcRenderer) {
        ipcRenderer.removeAllListeners('file-opened-within-electron');
        ipcRenderer.removeAllListeners('file-open-error-within-electron');
      }
    }
  }, [])

  return (
    <div className="app-class">
      {/* dummy div to create draggable bar at the top of application to replace removed native bar */}
      <div className="draggable" />
      <LeftNav
        // fileOpened={this.state.fileOpened}
        // fileOpen={this.fileOpen}
        // selectedContainer={this.state.selectedContainer}
        // service={this.state.services[this.state.selectedContainer]}
        // currentFilePath={this.state.filePath}
      />
      <div className="main flex">
        <OptionBar
          // view={this.state.view}
          // options={this.state.options}
          // networks={this.state.networks}
          // // updateView={this.updateView}
          // // updateOption={this.updateOption}
          // selectNetwork={this.selectNetwork}
          // selectedNetwork={this.state.selectedNetwork}
        />
        <TabBar
          // activePath={this.state.filePath}
          // openFiles={this.state.openFiles}
          // switchTab={this.switchTab}
          // closeTab={this.closeTab}
        />
        <D3Wrapper
          // openErrors={this.state.openErrors}
          // fileOpened={this.state.fileOpened}
          // fileOpen={this.fileOpen} //this is getting passed from imported state
          // services={this.state.services}
          // setSelectedContainer={this.setSelectedContainer} //is defined locally as is 'selectedContainer'
          // options={this.state.options}
          // volumes={this.state.volumes}
          // bindMounts={this.state.bindMounts}
          // view={this.state.view}
          // networks={this.state.networks}
          // selectedNetwork={this.state.selectedNetwork}
        />
      </div>
    </div>
  );
  
}

//TODO: Add useSelector to optionBar, NetworksDropdown, tabBar
// Puruse Deployment components for additional changes to state that need to be accounted for

// class App extends Component<{}, State> {
//   constructor(props: {}) {
//     super(props);
//     // Copy of initial state object
//     this.state = { ...initialState };
//     // const state = useSelector((state) => state);
//   }



  // setSelectedContainer = (containerName: string) => {
  //   this.setState({ ...this.state, selectedContainer: containerName });
    
  // };

  // updateView: UpdateView = (view) => {
  //   this.setState((state) => {
  //     return {
  //       ...state,
  //       view,
  //       selectedNetwork: '',
  //     };
  //   });
  // };

  // updateOption: UpdateOption = (option) => {
  //   const newState: State = {
  //     ...this.state,
  //     options: { ...this.state.options, [option]: !this.state.options[option] },
  //   };
  //   // check if toggling select all on or off
  //   if (option === 'selectAll') {
  //     if (newState.options.selectAll) {
  //       newState.options.ports = true;
  //       newState.options.volumes = true;
  //     } else {
  //       newState.options.ports = false;
  //       newState.options.volumes = false;
  //     }
  //     // check if select all should be on or off
  //   } else {
  //     if (newState.options.ports && newState.options.volumes) {
  //       newState.options.selectAll = true;
  //     } else {
  //       newState.options.selectAll = false;
  //     }
  //   }
  //   this.setState(newState);
  // };

  // selectNetwork: SelectNetwork = (network) => {
  //   this.setState({ view: 'networks', selectedNetwork: network });
  // };

  // convertAndStoreYamlJSON = (yamlText: string, filePath: string) => {
  //   // Convert Yaml to state object.
  //   const yamlJSON = yaml.safeLoad(yamlText);
  //   const yamlState = convertYamlToState(yamlJSON, filePath);
  //   // Copy options and open files state
  //   const openFiles = this.state.openFiles.slice();
  //   const { options } = this.state;
  //   // Don't add a file that is already opened to the openFiles array
  //   if (!openFiles.includes(filePath)) openFiles.push(filePath);

  //   // Set global variables for d3 simulation
  //   window.d3State = setD3State(yamlState.services);

  //   // Store opened file state in localStorage under the current state item call "state" as well as an individual item using the filePath as the key.
  //   localStorage.setItem('state', JSON.stringify(yamlState));
  //   localStorage.setItem(`${filePath}`, JSON.stringify(yamlState));
  //   this.setState({
  //     ...initialState,
  //     ...yamlState,
  //     fileOpened: true,
  //     openFiles,
  //     options,
  //   });
  // };

  /**
   * @param file: a File classed object
   * @returns void
   * @description validates the docker-compose file
   * ** if no errors, passes file string along to convert and store yaml method
   * ** if errors, passes error string to handle file open errors method
   */
  // fileOpen: FileOpen = (file: File) => {
  //   console.log('Opening file');
  //   const fileReader = new FileReader();
  //   // check for valid file path
  //   if (file.path) {
  //     /* TODO: refactor error handling */
  //     runDockerComposeValidation(file.path).then((validationResults: any) => { 
  //       if (validationResults.error) {
  //         /** 
  //          * @MUSTDO
  //          * if validationResults.error is related to kubernetes yaml,
  //          * run a composeValidation for the kubernetes file  
  //          * if it succeeds, go to the else block;
  //          * if it fails then display lines 156/157 
  //          */
  //         console.log('broken here in app.tsx line 153. Error here: ', validationResults.error)
  //         this.handleFileOpenError(validationResults.error);
  //       } else {
  //         // event listner to run after the file has been read as text
  //         fileReader.onload = () => {
  //           // if successful read, invoke method to convert and store to state
  //           if (fileReader.result) {
  //             let yamlText = fileReader.result.toString();
  //             //if docker-compose uses env file, replace the variables with value from env file
  //             if (validationResults.envResolutionRequired) {
  //               yamlText = resolveEnvVariables(yamlText, file.path);
  //             }
  //             this.convertAndStoreYamlJSON(yamlText, file.path);
  //           }
  //         };
  //         // read the file
  //         fileReader.readAsText(file);
  //       }
  //     });
  //   }
  // };

  // /**
  //  * @param filePath -> string
  //  * @returns void
  //  * @description sets state to the state stored in localStorage of the file
  //  * associated with the given filePath.
  //  */
  // switchTab: SwitchTab = (filePath: string, openFiles?: Array<string>) => {
  //   // Extract the desired tab state from localStorage
  //   const tabState = JSON.parse(localStorage.getItem(filePath) || '{}');
  //   // Create new state object with the returned tab state
  //   let newState;
  //   if (openFiles)
  //     newState = {
  //       ...this.state,
  //       ...tabState,
  //       openFiles,
  //     };
  //   else
  //     newState = {
  //       ...this.state,
  //       ...tabState,
  //     };
  //   // Set the 'state' item in localStorage to the tab state. This means that tab is the current tab, which would be used if the app got reloaded.
  //   localStorage.setItem('state', JSON.stringify(tabState));

  //   // Set the d3 state using the services extracted from the tabState and then setState
  //   window.d3State = setD3State(newState.services);
  //   this.setState(newState);
  // };

  // /**
  //  * @param filePath -> string
  //  * @returns void
  //  * @description removes the tab corresponding to the given file path
  //  */
  // closeTab: SwitchTab = (filePath: string) => {
  //   // Grab current open files and remove the file path of the tab to be closed, assign the
  //   // updated array to newOpenFiles
  //   const openFiles = useSelector((state) => state.openFiles);
  //   //pull options from state
  //   const options = useSelector((state) => state.options)
  //   const newOpenFiles = openFiles.filter((file) => file != filePath);
  //   // Remove the state object associated with the file path in localStorage
  //   localStorage.removeItem(filePath);
  //   // If the tab to be closed is the active tab, reset d3 and delete "state" object from local
  //   // storage and set state to the initial state with the updated open files array included.
  //   if (filePath === this.state.filePath) {
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
  //   } else this.setState({ ...this.state, openFiles: newOpenFiles });
  // };

  /**
   * @param errorText -> string
   * @returns void
   * @description sets state with array of strings of different errors
   */
  // handleFileOpenError = (errorText: Error) => {
  //   // Stop the simulation to prevent hundreds of d3 transform errors from occuring. This is rare but its a simple fix to prevent it.
  //   const { simulation } = window.d3State;
  //   simulation.stop();
  //   // Grab the current openFiles array so that we don't lose them when setting state.
  //   const openErrors = parseOpenError(errorText);
  //   const { openFiles } = this.state;
  //   this.setState({
  //     ...initialState,
  //     openErrors,
  //     openFiles,
  //     fileOpened: false,
  //   });
  // };

//   componentDidMount() {
//     if (ipcRenderer) {
//       ipcRenderer.on('file-open-error-within-electron', (event, arg) => {
//         this.handleFileOpenError(arg);
//       });
//       ipcRenderer.on('file-opened-within-electron', (event, arg) => {
//         this.convertAndStoreYamlJSON(arg, '');
//       });
//     }
//     const stateJSON = localStorage.getItem('state');
//     if (stateJSON) {
//       const stateJS = JSON.parse(stateJSON);
//       // set d3 state
//       window.d3State = setD3State(stateJS.services);

//       //Create openFile state array from items in localStorage
//       const openFiles = [];
//       const keys = Object.keys(localStorage);
//       for (let key of keys) {
//         if (key !== 'state') {
//           const item = localStorage.getItem(key);
//           try {
//             const parsed = JSON.parse(item || '{}');
//             openFiles.push(parsed.filePath);
//           } catch {
//             console.log(
//               'Item from localStorage not included in openFiles: ',
//               item,
//             );
//           }
//         }
//       }
//       this.setState({
//         ...initialState,
//         ...stateJS,
//         openFiles,
//       });
//     }
//   }

//   componentWillUnmount() {
//     if (ipcRenderer) {
//       ipcRenderer.removeAllListeners('file-opened-within-electron');
//       ipcRenderer.removeAllListeners('file-open-error-within-electron');
//     }
//   }

//   render() {
//     return (
//       <div className="app-class">
//         {/* dummy div to create draggable bar at the top of application to replace removed native bar */}
//         <div className="draggable" />
//         <LeftNav
//           fileOpened={this.state.fileOpened}
//           fileOpen={this.fileOpen}
//           selectedContainer={this.state.selectedContainer}
//           service={this.state.services[this.state.selectedContainer]}
//           currentFilePath={this.state.filePath}
//         />
//         <div className="main flex">
//           <OptionBar
//             view={this.state.view}
//             options={this.state.options}
//             networks={this.state.networks}
//             // updateView={this.updateView}
//             // updateOption={this.updateOption}
//             selectNetwork={this.selectNetwork}
//             selectedNetwork={this.state.selectedNetwork}
//           />
//           <TabBar
//             activePath={this.state.filePath}
//             openFiles={this.state.openFiles}
//             switchTab={this.switchTab}
//             closeTab={this.closeTab}
//           />
//           <D3Wrapper
//             openErrors={this.state.openErrors}
//             fileOpened={this.state.fileOpened}
//             fileOpen={this.fileOpen} //this is getting passed from imported state
//             services={this.state.services}
//             setSelectedContainer={this.setSelectedContainer} //is defined locally as is 'selectedContainer'
//             options={this.state.options}
//             volumes={this.state.volumes}
//             bindMounts={this.state.bindMounts}
//             view={this.state.view}
//             networks={this.state.networks}
//             selectedNetwork={this.state.selectedNetwork}
//           />
//         </div>
//       </div>
//     );
//   }
// }

export default App;
