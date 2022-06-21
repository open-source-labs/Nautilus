/**
 * ************************************
 *
 * @module  OptionBar.tsx

 * @author Tyler Hurtt
 * @date 3/11/20
 * @description Used to display toggle options
 *
 * ************************************
 */
import React from 'react';
import {useDispatch} from 'react-redux';
import NetworksDropdown from './NetworksDropdown';
import { updateViewStore } from '../../reducers/updateViewAndSelectNetworkSlice';
import { updateOption } from '../../reducers/optionSlice';
// import { AppDispatch } from '../../store';
// import { useAppDispatch } from '../../hooks';

// const dispatch = useDispatch();
// const useAppDispatch: () => AppDispatch = useDispatch
// const dispatch2 = useAppDispatch();
const dispatch = useDispatch();


import {
  ViewT,
  Options,
  UpdateView,
  SelectNetwork,
  ReadOnlyObj,
  Handler,
} from '../App.d';

type Props = {
  view: ViewT;
  options: Options;
  networks: ReadOnlyObj;
  updateView: UpdateView;
  selectNetwork: SelectNetwork;
  selectedNetwork: string;
};

const OptionBar: React.FC<Props> = ({
  view,
  options,
  networks,
  selectNetwork,
  selectedNetwork,
}) => {
  const dependsOnClass = view === 'depends_on' ? 'option selected' : 'option';

  // calls update function with the specified view from the click event
  const handleViewUpdate: Handler = (e) => {
    const view = e.currentTarget.id as 'networks' | 'depends_on';
    // updateView(view);
    dispatch(updateViewStore({view:view}))
  };

  // calls the update option function with the specificed option from the click event
  const handleOptionUpdate: Handler = (e) => {
    const option = e.currentTarget.id as 'ports' | 'volumes' | 'selectAll';
    // updateOption(option)
    
      // check if select all should be on or off
    dispatch(updateOption(option));
  };

  // creates an array of jsx elements for each option
  const optionsDisplay = Object.keys(options).map((opt, i) => {
    let title = '';
    // format select all title
    if (opt === 'selectAll') title = 'select all';
    // otherwise set title to option name
    else title = opt;

    return (
      <span
        key={`opt${i}`}
        // if the current option is selected, give it the 'selected' class
        className={
          options[opt as 'selectAll' | 'ports' | 'volumes']
            ? 'option selected'
            : 'option'
        }
        id={opt}
        onClick={handleOptionUpdate}
      >
        {title}
      </span>
    );
  });

  return (
    <div className="option-bar">
      <div className="views flex">
        <NetworksDropdown
          networks={networks}
          selectedNetwork={selectedNetwork}
        />
        <span
          className={dependsOnClass}
          id="depends_on"
          onClick={handleViewUpdate}
        >
          depends on
        </span>
      </div>
      <div className="titles flex">
        <h2>Views</h2>
        <div className="vl"></div>
        <h2>Options</h2>
      </div>
      <div className="options flex">{optionsDisplay}</div>
    </div>
  );
};

export default OptionBar;
