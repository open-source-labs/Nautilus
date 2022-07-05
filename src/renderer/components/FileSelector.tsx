/**
 * ************************************
 *
 * @module  FileSelector.tsx
 * @author Mike D, Michael Villamor, Nathan Lovell, Jordan Long, Giovanni Rodriguez
 * @date 3/11/20 edited on 6/30/22
 * @description Button to allow user to open docker-compose and kubernetes files
 *
 * ************************************
 */
import React from 'react';
import { FaUpload } from 'react-icons/fa';
import { yamlToState, fileOpenError, switchTab } from "../../reducers/appSlice";
import { fileOpen, getCache, cacheErrors } from '../helpers/fileOpen'
import { useAppDispatch } from '../../hooks';

/**
   * @param file: a File classed object
   * @returns void
   * @description validates the docker-compose file
   * ** if no errors, passes file string along to convert and store yaml method
   * ** if errors, passes error string to handle file open errors method
   */



const FileSelector: React.FC = () => {
  const dispatch = useAppDispatch();
 
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
          dispatch(fileOpenError(['reset']));
          cacheErrors('reset');
          if (event.currentTarget) {
            // make sure user opened a file
            if (event.currentTarget.files) {
              // fire fileOpen function on first file opened
              /** fileOpen cannot have hooks called inside because it's not a functional component
               * To circumvent, we're returning the necessary, adjusted files into 'openedFile'
               * If it's an array, than it's outputting a string of error messages and calling error reducer
               * If it's an object, dispatch yamlState and switchTab reducers with object properties
               */
<<<<<<< HEAD

<<<<<<< HEAD
              // const fetchInfoFromFile = createAsyncThunk(
              //   'File',
              //   async (file: File, thunkAPI)
              // );

            fileOpen(event.currentTarget.files[0]);
              
             
              
              
=======
=======
            
>>>>>>> 0e56383... added file error functionality
            fileOpen(event.currentTarget.files[0]); //goes to helper function to process
>>>>>>> a56fe83... cleaned up fileSelector, LeftNav, NetworksDropdown and Store
              

            /*
            
              setTimeout solution because the result cannot return into this file.
              Result from file open and subsequent parsing is added to a cache function
              the setTimeout waits for the file to be read and grabs data from the cache
              
            */
              setTimeout(() => {
                let result = getCache('123');
                let errors = cacheErrors('123');
                
                let openedFile = result[0];
<<<<<<< HEAD
                if (openedFile !== undefined){
                  if (Array.isArray(openedFile)){
                      dispatch(fileOpenError(openedFile))
                    }
                    else{
                      console.log('openedfile', openedFile);
                      dispatch(yamlToState(openedFile.yamlState))
                      dispatch(switchTab({filePath: openedFile.filePath, openFiles: openedFile.openFiles}))
                  };
=======
                let dispatchError;
                if(errors.length){
                   dispatchError = errors[0];
                }
                // console.log('result from the cache: ', openedFile.openFiles)
                console.log('result from errors: ', errors);
                if (openedFile !== undefined && !errors.length){
                  Array.isArray(openedFile) ? dispatch(fileOpenError(openedFile)) : dispatch(yamlToState(openedFile.yamlState)), dispatch(switchTab({filePath: openedFile.filePath, openFiles: openedFile.openFiles, closeTab: false}));
>>>>>>> 0e56383... added file error functionality
                }
                else if (dispatchError) {
                  console.log('error opening file, try again');
                  dispatch(fileOpenError(dispatchError));
                }
              }, 500)
<<<<<<< HEAD
              
              
              
              
             
              


              // const openedFile = await fileOpen(event.currentTarget.files[0]);
              // console.log('after file open, we get this far', openedFile);
              // Array.isArray(openedFile) ? dispatch(fileOpenError(openedFile)) : dispatch(yamlToState(openedFile.yamlState)), dispatch(switchTab({filePath: openedFile.filePath, openFiles: openedFile.openFiles}));
=======
>>>>>>> a56fe83... cleaned up fileSelector, LeftNav, NetworksDropdown and Store
            }
          }
        }}
      />
    </div>
  );
};
export default FileSelector;
