/**
 * ************************************
 *
 * @module  SwarmDeployment.tsx
 * @author Kim Wysocki
 * @date 5/30/20
 * @description component to deploy stacks to Docker Swarm and show deployment state
 *
 * ************************************
 */

import React, { useState, useEffect, useRef } from 'react';
import { FaUpload } from 'react-icons/fa';
import Draggable from 'react-draggable';

import {
  runDockerSwarmDeployment,
  runLeaveSwarm,
  runDockerSwarmDeployStack,
  runCheckStack,
} from '../../common/runShellTasks';
import { Void } from '../App.d';

type Props = {
  currentFilePath: string;
};

const SwarmDeployment: React.FC<Props> = ({ currentFilePath }) => {
  // Create React hooks to hold onto state
  const [success, setSuccess] = useState(false);
  const [swarmExists, setSwarmExists] = useState(false);
  // const [stdOutMessage, setStdOutMessage] = useState('');
  const [nodeAddress, setNodeAddress] = useState('');
  // const [infoFromSwarm, setInfoFromSwarm] = useState({});
  const [swarmDeployState, setSwarmDeployState] = useState(0);
  const [popUpContent, setPopupContent] = useState(<div></div>);
  const [popupIsOpen, setPopupIsOpen] = useState(false);
  const [stackName, setStackName] = useState('');
  const [allStackNames, setAllStackNames] = useState([] as any);
  const stackNameRef = useRef(stackName);

  // if there is no active file, ask user to open a file to deploy
  // TO DO - have different message from default error message
  // currently using default, but would be best to have a 'please open a file' message
  useEffect(() => {
    if (currentFilePath && !swarmExists && !success) {
      setSwarmDeployState(1);
      setPopupContent(popupStartDiv);
    } else if (currentFilePath && swarmExists && success) {
      setSwarmDeployState(3);
      setPopupContent(successDiv);
    } else if (!currentFilePath && swarmExists && success) {
      setSwarmDeployState(3);
      setPopupContent(errorDiv);
    } else if (!currentFilePath && !swarmExists && !success) {
      setSwarmDeployState(0);
      setPopupContent(errorDiv);
    } else if (swarmExists && success) {
      setPopupContent(successDiv);
    } else if (swarmExists && !success) {
      setPopupContent(errorDiv);
    }
  }, [currentFilePath, swarmExists, success]);

  // Submit Swarm name input on pressing 'enter'
  const handleKeyPress = (event: any) => {
    if (event.key === 'Enter') {
      console.log('pressing enter');
      handleClick(event);
    }
  };

  // handle click of buttons to add a stack to the swarm
  const handleClick = (event: any) => {
    console.log('Event target', event.target.className);
    if (
      event.target.className === 'create-swarm' ||
      event.target.className === 'stack-name'
    ) {
      if (currentFilePath) {
        console.log('stackName inside onClick: ', stackNameRef.current);
        if (swarmExists) addStackToSwarm();
        else if (!swarmExists) getNameAndDeploy();
      } else {
        setSuccess(false);
        setSwarmDeployState(0);
      }
    } else if (
      event.target.className === 'add-stack-btn' ||
      event.target.className === 'new-stack-name'
    )
      addStackToSwarm();
  };

  // save html code in variables for easier access later
  // the default for the pop-up div, before any interaction with swarm / after leaving swarm
  const popupStartDiv = (
    <div className="initialize-swarm">
      <label htmlFor="stack-name" className="stack-name-label">
        Stack Name
      </label>
      <input
        className="stack-name"
        name="stack-name"
        placeholder="Enter name...."
        onKeyPress={handleKeyPress}
        onChange={(event) => {
          stackNameRef.current = event.target.value;
        }}
      ></input>
      <button className="create-swarm" onClick={handleClick}>
        Create Swarm
      </button>
    </div>
  );

  // render this div if successful joining swarm
  const successDiv = (
    <div className="success-div">
      <p className="success-p">
        <span>Success! Your swarm has been deployed!</span>
        <br></br>The current node{' '}
        <span className="success-msg-spans">{nodeAddress}</span>
        <br></br>is now a manager
      </p>
      <br></br>

      <div className="add-stack-div">
        <label htmlFor="new-stack-name" className="new-stack-name-label">
          Deploy Additional Stack
        </label>
        <input
          className="new-stack-name"
          name="new-stack-name"
          placeholder="Enter name...."
          onKeyPress={handleKeyPress}
          onChange={(event) => {
            stackNameRef.current = event.target.value;
          }}
        ></input>
        <button className="add-stack-btn" onClick={handleClick}>
          Add new stack
        </button>
      </div>
    </div>
  );

  // if unsuccessful / if no active file, render error dive
  const errorDiv = (
    <div className="error-div">
      <p className="error-p">
        Sorry, there was an issue initializing your swarm
      </p>
      <button
        className="try-again-btn"
        onClick={() => {
          leaveSwarm();
        }}
      >
        Try Again
      </button>
    </div>
  );

  // retrieve input from user and pass it to runDockerSwarmDeployment as an argument
  // the function will return stdout from running each function, so that we have access to that information
  const getNameAndDeploy: Void = async (): Promise<any> => {
    // hide pop-up while running commands
    setPopupIsOpen(false);
    setSwarmDeployState(2);
    setAllStackNames([...allStackNames, stackNameRef.current]);

    // await results from running dwarm deployment shell tasks
    const returnedFromPromise = await runDockerSwarmDeployment(
      currentFilePath,
      stackNameRef.current,
    );
    const infoReturned = JSON.parse(returnedFromPromise);
    // setInfoFromSwarm(infoReturned);

    // if there is no error on the returned object, swarm initialisation was successful
    if (!infoReturned.init.error) {
      // const messageFromStdOut = infoReturned.init.out.split('\n')[0];
      // setStdOutMessage(messageFromStdOut);
      // console.log(stdOutMessage);
      // console.log(infoFromSwarm);
      // the split here is to get just the 25-character node ID of the swarm
      const managerID = infoReturned.init.out
        .split('\n')[0]
        .split(' ')[4]
        .replace(/[()]/g, '');
      setNodeAddress(managerID);
      setSuccess(true);
      setSwarmExists(true);
      setSwarmDeployState(3);
      setPopupIsOpen(true);
    } else {
      setSwarmExists(true);
      setSuccess(false);
      setSwarmDeployState(1);
      setPopupIsOpen(true);
    }
  };

  const addStackToSwarm = async (): Promise<any> => {
    setPopupIsOpen(false);
    setSwarmDeployState(2);
    setAllStackNames([...allStackNames, stackNameRef.current]);

    const nextStackResults = await runDockerSwarmDeployStack(
      currentFilePath,
      stackNameRef.current,
    );
    const stackList = await runCheckStack();

    setSwarmDeployState(3);
    setPopupIsOpen(true);

    console.log('results from adding new stack: ', nextStackResults);
    console.log('docker stack ls: ', stackList);
  };

  // function to allow the user to leave the swarm
  // called in onClicks
  const leaveSwarm = (): void => {
    setPopupIsOpen(false);
    setSwarmExists(false);
    setSuccess(false);
    runLeaveSwarm();
    setSwarmDeployState(1);
    setNodeAddress('');
    setStackName('');
    setAllStackNames([]);
  };

  // uninitialised variable allowing the values to change depending on state
  // used for swarm deploy button in leftNav
  let swarmBtnTitle: string | undefined, swarmOnClick: any;

  if (!swarmExists || (swarmExists && !success)) {
    swarmBtnTitle = 'Deploy to Swarm';
    swarmOnClick = () => {
      setPopupIsOpen(true);
    };
  } else if (swarmExists) {
    swarmBtnTitle = 'Leave Swarm';
    swarmOnClick = () => {
      setPopupIsOpen(false);
      leaveSwarm();
    };
  }
  //exit-swarm-deploy-div
  return (
    <div className="deploy-container">
      <button className="deploy-btn" onClick={swarmOnClick}>
        <span>
          <FaUpload className="deployment-button" size={24} />
        </span>
        {swarmBtnTitle}
        <div className="status-container">
          <div style={{ width: '4em' }}></div>
          <span
            className={`deployment-status status-healthy ${
              swarmDeployState === 3 ? 'status-active' : ''
            }`}
          ></span>
          <span
            className={`deployment-status status-moderate ${
              swarmDeployState === 2 ? 'status-active' : ''
            }`}
          ></span>
          <span
            className={`deployment-status status-dead ${
              swarmDeployState === 1 ? 'status-active' : ''
            }`}
          ></span>
        </div>
      </button>

      {/* If popupIsOpen state is set to true, render the popup div, else don't render anything here */}
      {popupIsOpen ? (
        <Draggable handle=".exit-popup-div">
          <div className="popup-div">
            <div className="exit-button-and-content-divs">
              <div className="exit-popup-div">
                <button
                  className="exit-popup-button"
                  onClick={() => {
                    setPopupIsOpen(false);
                  }}
                >
                  X
                </button>
              </div>

              <div className="popup-content-wrapper">{popUpContent}</div>
            </div>
          </div>
        </Draggable>
      ) : null}
    </div>
  );
};

export default SwarmDeployment;
