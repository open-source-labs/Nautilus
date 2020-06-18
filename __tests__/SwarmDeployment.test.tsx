import React from 'react';
import SwarmDeployment from '../src/renderer/components/SwarmDeployment';
import { shallow } from 'enzyme';

describe('Swarm Deployment component', () => {
  const props = {
    currentFilePath: 'User/project_name/docker-compose.yml',
  };
  //const mockFunction = jest.fn(() => {});
  const wrapper = shallow(<SwarmDeployment {...props} />);

  describe('Component content', () => {
    it('should have a button with className `deploy-btn`', () => {
      expect(wrapper.find('.deploy-btn')).toHaveLength(1);
    });

    it('should have a pop-up box that contains further actions/information', () => {
      wrapper.find('.deploy-btn').simulate('click');
      expect(wrapper.find('.popup-div')).toHaveLength(1);
    });

    //it('should show the error message when no is file open', () => {
    // wrapper.find('.deploy-btn').simulate('click');
    // console.log(wrapper.find('.error-div').length);
    // expect(wrapper.find('.error-div')).toHaveLength(1);
    //});
  });

  describe('handling of state', () => {
    // check that state is being updated correctly and contains the right information
    // make sure currentFile can be accessed in component
    // test for success/error
  });
});
