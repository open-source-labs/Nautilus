import React from 'react';
import { shallow } from 'enzyme';

import Tab from '../src/renderer/components/Tab';

describe('TabBar', () => {
  //const mockFunction = jest.fn(() => {});
  const props = {
    filePath: '',
    activePath: '',
    switchTab: jest.fn(),
    closeTab: jest.fn(),
  };
  const wrapper = shallow(<Tab {...props} />);
  // tab div test
  it('renders div with classname of tab', () => {
    expect(wrapper.find('.tab')).toHaveLength(1);
  });
  // check if clicking tab will invoke function switchToTab
  it('should invoke function switchTab when tab is clicked', () => {
    //console.log(wrapper.find('Tab').length);
    wrapper.find('.tab-text').first().simulate('click');
    expect(props.switchTab).toHaveBeenCalledTimes(1);
  });
  // check if tab has class active when clicked
  it('tab should have active-tab class when clicked', () => {
    wrapper.find('.tab-text').first().simulate('click');
    expect(wrapper.find('.tab').first().hasClass('active-tab')).toEqual(true);
  });
  // each tab should render a button
  it('should render a button on each tab', () => {
    expect(wrapper.find('button')).toHaveLength(1);
  });
  // when button is clicked props.openFiles.length should equal 1
  it('should invoke function closeTab when close-btn is clicked', () => {
    wrapper.find('button').simulate('click');
    expect(props.closeTab).toHaveBeenCalledTimes(1);
  });
});
