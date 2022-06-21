/**
 * 
 * @module fileSlice.ts
 * 
 * @author Nathan Lovell
 * @date 6/20/2022
 * @description Defines state properties from result of parse function
 * 
 */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import convertYamlToState from '../renderer/helpers/yamlParser';
import setD3State from '../renderer/helpers/setD3State';
import parseOpenError from '../renderer/helpers/parseOpenError';
import { runDockerComposeValidation } from '../common/runShellTasks';
import resolveEnvVariables from '../common/resolveEnvVariables';
import { KubeObj, Services, DependsOn, ReadOnlyObj, } from '../renderer/App.d';
/*
from yamlparser.ts:
*/

type YamlState = {
  fileOpened: boolean;
  kubeBool: boolean;
  kubeObj: KubeObj;
  services: Services;
  filePath?: string;
  dependsOn?: DependsOn;
  networks?: ReadOnlyObj;
  volumes?: ReadOnlyObj;
  bindMounts?: Array<string>;
};


const initialState = {} as YamlState;

const fileSlice = createSlice({
  name: 'file',
  initialState, 
  reducers: {
    yamlToState (state, action: PayloadAction<YamlState>) {
      return {
        ...state,
        action.payload
      }
    },
    fileOpenError (state, action: PayloadAction<YamlState>) {
      
    }
  }
})

export const {yamlToState, fileOpenError} = fileSlice.actions;
export default fileSlice.reducer;