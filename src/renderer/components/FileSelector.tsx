/**
 * ************************************
 *
 * @module  FileSelector.tsx
 * @author Mike D
 * @date 3/11/20
 * @description Button to allow user to open docker-compose file
 *
 * ************************************
 */
import React from 'react';
import { FaUpload } from 'react-icons/fa';
// import { runDockerComposeValidation } from '../../common/runShellTasks';
// import resolveEnvVariables from '../../common/resolveEnvVariables';
// import convertYamlToState from '.././helpers/yamlParser';
// import parseOpenError from '../helpers/parseOpenError';
// import yaml from 'js-yaml';
// import { useDispatch } from 'react-redux';
// import { FileOpen } from '../App.d';
// import RootState from '../../store'
// import { yamlToState, fileOpenError, updateOption } from '../../reducers/appSlice';
// import { switchTab } from '../../reducers/tabSlice';
// import setD3State from '../helpers/setD3State';
import { yamlToState, fileOpenError, switchTab } from "../../reducers/appSlice";
import { fileOpen, getCache } from '../helpers/fileOpen'
import { useAppDispatch } from '../../hooks';
// import { createAsyncThunk } from '@reduxjs/toolkit';


// const dispatch = useDispatch();


/**
   * @param file: a File classed object
   * @returns void
   * @description validates the docker-compose file
   * ** if no errors, passes file string along to convert and store yaml method
   * ** if errors, passes error string to handle file open errors method
   */



const FileSelector: React.FC = () => {
  const dispatch = useAppDispatch();
  // const allOpenFiles = useAppSelector((state) => state.openFiles);
  // const someAsync = async (event: any) =>{
  //   const response = await fileOpen(event.currentTarget.files[0]);
  //   return response;
  // };

  // useEffect(() => {

  // })
  return (
    <div className="file-open">
      <label htmlFor="files">
        <div className="select-file-button open-flex">
          <FaUpload className="open-button" size={24} />
          <h5>Open</h5>
        </div>
      </label>
      <input
        id="files"
        type="file"
        name="yaml"
        accept=".yml,.yaml"
        style={{ display: 'none' }}
        onChange={async (event: React.SyntheticEvent<HTMLInputElement>) => {
          // make sure there was something selected
          // console.log('FileSelector Event and event.currentTarget', event, event.currentTarget)
          if (event.currentTarget) {
            // make sure user opened a file
            if (event.currentTarget.files) {
              // fire fileOpen function on first file opened
              // console.log('Event.currentTarget.file', event.currentTarget.files[0] )
              /** fileOpen cannot have hooks called inside because it's not a functional component
               * To circumvent, we're returning the necessary, adjusted files into 'openedFile'
               * If it's an array, than it's outputting a string of error messages and calling error reducer
               * If it's an object, dispatch yamlState and switchTab reducers with object properties
               */

              // const fetchInfoFromFile = createAsyncThunk(
              //   'File',
              //   async (file: File, thunkAPI)
              // );

            fileOpen(event.currentTarget.files[0]);
              
             
              
              
              
              
              setTimeout(() => {
                let result = getCache('123');
              
                
                let openedFile = result[0];
                if (openedFile !== undefined){
                  if (Array.isArray(openedFile)){
                      dispatch(fileOpenError(openedFile))
                    }
                    else{
                      console.log('openedfile', openedFile);
                      dispatch(yamlToState(openedFile.yamlState))
                      dispatch(switchTab({filePath: openedFile.filePath, openFiles: openedFile.openFiles}))
                  };
                }
                else {
                  console.log('error opening file, try again');
                }
              }, 500)
              
              
              
              
             
              


              // const openedFile = await fileOpen(event.currentTarget.files[0]);
              // console.log('after file open, we get this far', openedFile);
              // Array.isArray(openedFile) ? dispatch(fileOpenError(openedFile)) : dispatch(yamlToState(openedFile.yamlState)), dispatch(switchTab({filePath: openedFile.filePath, openFiles: openedFile.openFiles}));
            }
          }
        }}
      />
    </div>
  );
};
export default FileSelector;
