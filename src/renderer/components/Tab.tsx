import React from 'react'
import { useDispatch } from 'react-redux';
import { switchTab, closeTab } from '../../reducers/appSlice';


type Props = {
  activePath: string;
  filePath: string;
};

const Tab: React.FC<Props> = ({
  filePath,
  activePath,
}) => {
  const dispatch = useDispatch();

  

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
