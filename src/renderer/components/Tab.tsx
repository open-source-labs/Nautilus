import React from 'react'
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
// import { SwitchTab } from '../App.d';
import { switchTab, closeTab } from '../../reducers/appSlice';
import { useAppSelector } from '../../hooks'

type Props = {
  activePath: string;
  filePath: string;
  // switchTab: SwitchTab;
  // closeTab: SwitchTab;
};

const Tab: React.FC<Props> = ({
  filePath,
  // switchTab,
  // closeTab,
  activePath,
}) => {
  const dispatch = useDispatch();

  useEffect(() => {

  }, [useAppSelector(state => state.openFiles)])

  let fileSplit;
  if (process.platform === 'win32') fileSplit = filePath.split('\\');
  else fileSplit = filePath.split('/');
  const fileName = fileSplit[fileSplit.length - 1];
  const splitName = fileName.split('-');
  const tabClass = filePath === activePath ? 'tab active-tab' : 'tab';
  return (
    <div className={tabClass} id={filePath}>
      <div className="tab-text" onClick={() => dispatch(switchTab({filePath: filePath}))}>
        {splitName[0]}&#8209;{splitName[1]}
      </div>
      <button className="close-btn" onClick={() => dispatch(closeTab({filePath: filePath}))}>
        {' '}
        X
      </button>
    </div>
  );
};

export default Tab;
