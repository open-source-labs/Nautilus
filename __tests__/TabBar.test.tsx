import React from 'react';
import { shallow, configure } from 'enzyme';
import TabBar from '../src/renderer/components/TabBar';
//import Tab from '../src/renderer/components/Tab';
//import { SwitchTab } from '../src/renderer/App.d';

describe('TabBar', () => {
  //const mockFunction = jest.fn(() => {});
  const props = {
    openFiles: ['file1', 'file2'],
    activePath: '',
    switchTab: jest.fn(),
    closeTab: () => {
      props.openFiles.pop();
    },
  };
  const wrapper = shallow(<TabBar {...props} />);
  beforeAll(() => {
    props.openFiles = ['file1', 'file2'];
  });
  //tabBar div test
  it('renders div with classname of tab-bar', () => {
    expect(wrapper.find('.tab-bar')).toHaveLength(1);
  });
  //check if tab has class active when clicked
  //check if tabBar renders a tab for each filepath
  it('should render a tab for each file path in openFiles', () => {
    expect(wrapper.find('Tab').length).toEqual(props.openFiles.length);
  });
});
