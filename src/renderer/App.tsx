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


//IMPORT HELPER FUNCTIONS
import {convertAndStoreYamlJSON, handleFileOpenError} from './helpers/fileOpen';
import setD3State from './helpers/setD3State';

 
// IMPORT REACT CONTAINERS OR COMPONENTS
import LeftNav from './components/LeftNav';
import D3Wrapper from './components/D3Wrapper';
import TabBar from './components/TabBar';
import OptionBar from './components/OptionBar';


//IMPORT ACTIONS/REDUCERS
import { useDispatch } from 'react-redux';
import { useAppSelector } from '../hooks'
import { openYamlFiles, fileOpenError } from '../reducers/appSlice';




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
      <LeftNav/>
      <div className="main flex">
        <OptionBar/>
        <TabBar/>
        <D3Wrapper/>
      </div>
    </div>
  );
  
}

export default App
