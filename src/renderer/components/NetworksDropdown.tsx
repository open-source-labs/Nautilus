import React from 'react';
import {  Handler } from '../App.d';
import { selectNetwork } from '../../reducers/appSlice';
import { useAppDispatch, useAppSelector } from '../../hooks';

const dispatch = useAppDispatch();

// type Props = {
//   networks: ReadOnlyObj;
//   selectedNetwork: string;
// };

const NetworksDropDown: React.FC = ({
  // networks,
  // selectedNetwork,
}) => {
  const networks = useAppSelector(state => state.networks)
  const selectedNetwork = useAppSelector(state => state.selectedNetwork)
  const handleNetworkUpdate: Handler = e => {
    const network = (e as React.ChangeEvent<HTMLSelectElement>).currentTarget
      .value;
    dispatch(selectNetwork(network));
  };

  const groupNetworks = (): JSX.Element | void => {
    if (Object.keys(networks).length === 1) return;
    const title: string =
      Object.keys(networks).length > 1 ? 'group networks' : 'default';
    return (
      <option
        className="networkOption"
        key={title}
        id="groupNetworks"
        value="groupNetworks"
      >
        {title}
      </option>
    );
  };
  const networksOptions = Object.keys(networks).map((network, i) => {
    return (
      <option
        className="networkOption"
        key={`networks option: ${network}`}
        id={network}
        value={network}
      >
        {network}
      </option>
    );
  });

  let selectClass = selectedNetwork ? 'option selected' : 'option';
  return (
    <>
      <select
        id="networks"
        className={selectClass}
        name="networks"
        onChange={handleNetworkUpdate}
        value={selectedNetwork}
      >
        <option
          key="networks option header"
          id="networkHeader"
          value=""
          disabled
        >
          networks
        </option>
        {networksOptions}
        {groupNetworks()}
      </select>
    </>
  );
};

export default NetworksDropDown;
