/**
 * ************************************
 *
 * @module  ComposeDeployment.tsx
 * @author Yevgeniy Skroznikov
 * @date 3/11/20
 * @description container for the title, the service info and the file open
 *
 * ************************************
 */

import React, { useState, useEffect } from 'react';
import * as d3 from 'd3';

import {
  FaUpload,
  FaDownload,
  FaRegPlayCircle,
  FaRegStopCircle,
} from 'react-icons/fa';
import { remote } from 'electron';
import { GiHeartPlus } from 'react-icons/gi';

import {
  runDockerComposeDeployment,
  runDockerComposeKill,
  runDockerComposeListContainer,
  runDockerStats,
} from '../../common/runShellTasks';

import { FileOpen, Void } from '../App.d';

enum DeploymentStatus {
  OpeningFile = 0,
  NoFile,
  Dead,
  DeadError,
  Checking,
  Deploying,
  Undeploying,
  Warning,
  Running,
}

enum HealthCheck {
  Off = 0,
  Loading,
  On,
}

type Props = {
  currentFilePath: string;
  fileOpen: FileOpen;
};

const Deployment: React.FC<Props> = ({ currentFilePath, fileOpen }) => {
  const [deployState, setDeployState] = useState(DeploymentStatus.NoFile);
  const [errorMessage, setErrorMessage] = useState('');
  const [healthCheck, setHealthCheck] = useState(HealthCheck.Off);
  const [stats, setStats] = useState<Array<string>>([]);
  const [healthKillFn, setHealthKillFn] = useState<Function | undefined>(
    undefined,
  );

  useEffect(() => {
    setHealthCheck(HealthCheck.Off);
    if (currentFilePath !== '') deployCheck();
    else if (deployState !== DeploymentStatus.NoFile)
      setDeployState(DeploymentStatus.NoFile);
  }, [currentFilePath]);

  const deployCheck: Void = () => {
    if (
      deployState === DeploymentStatus.OpeningFile &&
      currentFilePath !== ''
    ) {
      deployCompose();
    } else {
      setDeployState(DeploymentStatus.Checking);
      runDockerComposeListContainer(currentFilePath).then((results: any) => {
        if (results.error) {
          setErrorMessage(results.error.message);
          setDeployState(DeploymentStatus.DeadError);
        } else if (results.out.split('\n').length > 3) {
          if (results.out.includes('Exit'))
            setDeployState(DeploymentStatus.Dead);
          else setDeployState(DeploymentStatus.Running);
        } else setDeployState(DeploymentStatus.Dead);
      });
    }
  };
  //function definitions
  useEffect(() => {
    if (healthCheck === HealthCheck.Loading && !healthKillFn) {
      runDockerComposeListContainer(currentFilePath).then((results: any) => {
        const outputLines = results.out.split('\n');
        const containerNames = [];
        for (let i = 2; i < outputLines.length; i++) {
          const name = outputLines[i].split(' ')[0];
          if (name !== '') containerNames.push(outputLines[i].split(' ')[0]);
        }
        const fn = runDockerStats(dockerStatsDataCallback, containerNames);
        setHealthKillFn(() => fn);
      });
    } else if (healthCheck === HealthCheck.On) {
      d3.selectAll('.nodeLabel').attr('y', (d: any) => 133 / 2 + 15);
    } else if (healthCheck === HealthCheck.Off && healthKillFn) {
      d3.selectAll('.cpu-stat-title').style('display', 'none');
      d3.selectAll('.cpu-stat').style('display', 'none');
      d3.selectAll('.mem-usage-stat-title').style('display', 'none');
      d3.selectAll('.mem-usage-stat').style('display', 'none');
      d3.selectAll('.mem-percent-stat-title').style('display', 'none');
      d3.selectAll('.mem-percent-stat').style('display', 'none');
      d3.selectAll('.net-stat-title').style('display', 'none');
      d3.selectAll('.net-stat').style('display', 'none');
      d3.selectAll('.block-stat-title').style('display', 'none');
      d3.selectAll('.block-stat').style('display', 'none');
      d3.selectAll('.pids-stat-title').style('display', 'none');
      d3.selectAll('.pids-stat').style('display', 'none');
      healthKillFn();
      setHealthKillFn(undefined);
      d3.selectAll('.nodeLabel').attr('y', (d: any) => 133 / 2);
    }
  }, [healthCheck, healthKillFn]);

  const dockerStatsDataCallback = (
    data: string,
    containerNames: Array<string>,
  ) => {
    if (healthCheck === HealthCheck.Loading) setHealthCheck(HealthCheck.On);

    const outputLines = data.toString().split('\n');
    if (outputLines.length !== containerNames.length + 2) {
      setStats([...stats, ...outputLines]);
      return;
    }
    setStats([]);
    const containers: any = [];
    for (let i = 1; i < outputLines.length - 1; i++) {
      const splitLine = outputLines[i]
        .split(' ')
        .filter((word: string) => word !== '');
      containers[i - 1] = {};
      if (splitLine[1].includes('_'))
        containers[i - 1].name = `container_${splitLine[1].split('_')[1]}`;
      else containers[i - 1].name = `container_${splitLine[1]}`;
      containers[i - 1].cpuUsage = splitLine[2];
      containers[i - 1].memUsage = splitLine[3] + splitLine[4] + splitLine[5];
      containers[i - 1].memPercentage = splitLine[6];
      containers[i - 1].netIO = splitLine[7] + splitLine[8] + splitLine[9];
      containers[i - 1].blockIO = splitLine[10] + splitLine[11] + splitLine[12];
      containers[i - 1].pids = splitLine[13];
    }

    d3.select(`#${containers[0].name} > .cpu-stat-title`).style(
      'display',
      'inline',
    );

    for (let i = 0; i < containers.length; i++) {
      d3.select(`#${containers[i].name} > .cpu-stat-title`).style(
        'display',
        'inline',
      );
      d3.selectAll(`#${containers[i].name} > .cpu-stat`)
        .style('display', 'inline')
        .text(`  ${containers[i].cpuUsage}`);

      d3.selectAll(`#${containers[i].name} > .mem-usage-stat-title`).style(
        'display',
        'inline',
      );
      d3.selectAll(`#${containers[i].name} > .mem-usage-stat`)
        .style('display', 'inline')
        .text(`  ${containers[i].memUsage}`);
      d3.selectAll(`#${containers[i].name} > .mem-percent-stat-title`).style(
        'display',
        'inline',
      );
      d3.selectAll(`#${containers[i].name} > .mem-percent-stat`)
        .style('display', 'inline')
        .text(`  ${containers[i].memPercentage}`);

      d3.selectAll(`#${containers[i].name} > .net-stat-title`).style(
        'display',
        'inline',
      );
      d3.selectAll(`#${containers[i].name} > .net-stat`)
        .style('display', 'inline')
        .text(` ${containers[i].netIO}`);
      d3.selectAll(`#${containers[i].name} > .block-stat-title`).style(
        'display',
        'inline',
      );
      d3.selectAll(`#${containers[i].name} > .block-stat`)
        .style('display', 'inline')
        .text(` ${containers[i].blockIO}`);

      d3.selectAll(`#${containers[i].name} > .pids-stat-title`).style(
        'display',
        'inline',
      );
      d3.selectAll(`#${containers[i].name} > .pids-stat`)
        .style('display', 'inline')
        .text(`  ${containers[i].pids}`);
    }
  };

  const toggleStart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (healthCheck === HealthCheck.Off) setHealthCheck(HealthCheck.Loading);
    else setHealthCheck(HealthCheck.Off);
  };
  const deployCompose: Void = () => {
    setDeployState(DeploymentStatus.Deploying);
    runDockerComposeDeployment(currentFilePath)
      .then((results: any) => {
        if (results.error) {
          setErrorMessage(results.error.message);
          setDeployState(DeploymentStatus.DeadError);
        } else setDeployState(DeploymentStatus.Running);
      })
      .catch((err) => console.error('error setting DeployState to Running'));
  };

  const deployKill: Void = () => {
    runDockerComposeKill(currentFilePath).then(() => {
      setDeployState(DeploymentStatus.Dead), setHealthCheck(HealthCheck.Off);
    });
    setDeployState(DeploymentStatus.Undeploying);
  };

  const onErrorClick = (e: React.MouseEvent): void => {
    e.stopPropagation();
    const dialog = remote.dialog;
    dialog.showErrorBox('Error Message:', errorMessage);
  };

  let title,
    onClick,
    icon = <FaUpload className="deployment-button" size={24} />;
  const healthIcon = (
    <GiHeartPlus
      className={`health-icon ${
        deployState === DeploymentStatus.Running ? '' : 'hidden'
      }`}
      size={20}
    />
  );
  const startButton = (
    <FaRegPlayCircle
      className={`start-button ${
        deployState === DeploymentStatus.Running ? '' : 'hidden'
      }`}
      size={20}
      onClick={toggleStart}
    />
  );
  const spinner = (
    <svg
      className="health-spinner"
      viewBox="0 0 50 50"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle
        className="path"
        cx="25"
        cy="25"
        r="20"
        fill="none"
        strokeWidth="5"
      ></circle>
    </svg>
  );

  const stopButton = (
    <FaRegStopCircle
      className={`stop-button ${
        deployState === DeploymentStatus.Running ? '' : 'hidden'
      }`}
      size={20}
      onClick={toggleStart}
    />
  );
  let toggleButton;
  if (healthCheck === HealthCheck.Off) toggleButton = startButton;
  else if (healthCheck === HealthCheck.Loading) toggleButton = spinner;
  else toggleButton = stopButton;

  if (deployState === DeploymentStatus.NoFile) {
    title = 'Deploy Container';
    onClick = () => {};
  } else if (deployState === DeploymentStatus.OpeningFile) {
    title = 'Opening File..';
    onClick = () => {};
  } else if (deployState === DeploymentStatus.Checking) {
    title = 'Checking..';
    onClick = () => {};
  } else if (
    deployState === DeploymentStatus.Dead ||
    deployState === DeploymentStatus.DeadError
  ) {
    title = 'Deploy Container';
    onClick = deployCompose;
  } else if (deployState === DeploymentStatus.Deploying) {
    title = 'Deploying..';
    onClick = () => {};
  } else if (deployState === DeploymentStatus.Undeploying) {
    icon = <FaDownload className="open-button" size={24} />;
    title = 'Undeploying..';
    onClick = () => {};
  } else if (
    deployState === DeploymentStatus.Running ||
    deployState === DeploymentStatus.Warning
  ) {
    icon = <FaDownload className="open-button" size={24} />;
    title = 'Kill Container';
    onClick = deployKill;
  }

  let inputButton = (
    <input
      type="file"
      name="yaml"
      accept=".yml,.yaml"
      style={{ display: 'none' }}
      onChange={(event: React.SyntheticEvent<HTMLInputElement>) => {
        // make sure there was something selected
        if (event.currentTarget) {
          // make sure user opened a file
          if (event.currentTarget.files) {
            // fire fileOpen function on first file opened
            setDeployState(DeploymentStatus.OpeningFile);
            fileOpen(event.currentTarget.files[0]);
          }
        }
      }}
    />
  );

  return (
    <div className="deploy-container" id="compose-deploy-div">
      <div onClick={onClick} className="deploy-btn">
        {icon}
        <label className="deployment-title">
          {title}
          {deployState === DeploymentStatus.NoFile ? inputButton : ''}
        </label>
        <div className="status-container">
          {healthIcon}
          {toggleButton}
          <span
            className={`deployment-status status-healthy 
            ${
              deployState === DeploymentStatus.Running ||
              deployState === DeploymentStatus.Warning
                ? 'status-active'
                : ''
            }`}
          ></span>
          <span
            className={`deployment-status status-moderate 
            ${
              deployState === DeploymentStatus.Deploying ||
              deployState === DeploymentStatus.Undeploying ||
              deployState === DeploymentStatus.Warning
                ? 'status-active'
                : ''
            }`}
          ></span>
          <span
            onClick={
              deployState === DeploymentStatus.DeadError
                ? onErrorClick
                : () => {}
            }
            className={`deployment-status status-dead 
            ${
              deployState === DeploymentStatus.Dead ||
              deployState === DeploymentStatus.DeadError
                ? 'status-active'
                : ''
            }
            ${
              deployState === DeploymentStatus.DeadError
                ? 'clickable-status'
                : ''
            }`}
          >
            {deployState === DeploymentStatus.DeadError ? '!' : ''}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Deployment;
