import child_process from 'child_process';
import { shellResults } from '../renderer/App.d'

const runDockerStats = (handleOnData: Function, containerNames: Array<string>) => {
  runSpawn(handleOnData, 'docker', containerNames);
}

const runSpawn = (handleOnData: Function, cmd: string, args: Array<string>) => {
  const sp = child_process.spawn('docker', args);

  sp.stdout.on("data", data => {
    handleOnData(data, sp.kill.bind(sp));
  });

  sp.stderr.on("data", data => {
    console.log(`spawn stderr: ${data}`);
  });

  sp.on('error', (error) => {
    console.log(`child process error: ${error.message}`);
  });
}

const runDockerComposeKill = (filePath: string) =>
  runShell(`docker-compose -f ${filePath} kill`, false);

const runDockerComposeListContainer = (filePath: string) =>
  runShell(`docker-compose -f ${filePath} ps`, false);

const runDockerComposeDeployment = (filePath: string) =>
  runShell(`docker-compose -f ${filePath} up -d`, false);

const runDockerComposeValidation = (filePath: string) =>
  runShell(`docker-compose -f ${filePath} config`, true);

const runDockerSwarmInit = (filePath: string) =>
  runShell(`docker swarm init`, false);

const runDockerSwarmDeployStack = (filePath: string, stackName: string) =>
  runShell(`docker stack deploy -c ${filePath} ${stackName}`, false);

const runLeaveSwarm = () => runShell(`docker swarm leave -f`, false);

const runCheckStack = () => runShell(`docker stack ls`, false);

const runDockerSwarmDeployment = async (
  filePath: string,
  stackName: string,
) => {
  let stackDeployResult, initResult;
  await runDockerSwarmInit(filePath)
    .then((data) => (initResult = data))
    .then(() => runDockerSwarmDeployStack(filePath, stackName))
    .then((info) => {
      stackDeployResult = info;
    });

  return JSON.stringify({ init: initResult, stackDeploy: stackDeployResult });
};

const runShell = (cmd: string, filter: boolean) =>
  // promise for the electron application
  new Promise((resolve, reject) => {
    try {
      // run docker's validation command in a bash shell
      child_process.exec(
        cmd,
        // callback function to access output of docker-compose command
        (error, stdout, stderr) => {
          // add output to object
          const shellResult: shellResults = {
            out: stdout.toString(),
            envResolutionRequired: false,
          };
          if (error) {
            //if docker-compose uses env file to run, store this variable to handle later
            if (filter) {
              if (error.message.includes('variable is not set')) {
                shellResult.envResolutionRequired = true;
              }
              // filter errors we don't care about
              if (
                !error.message.includes("Couldn't find env file") &&
                !error.message.includes(
                  'either does not exist, is not accessible',
                ) &&
                !error.message.includes('variable is not set')
              ) {
                shellResult.error = error;
              }
            } else {
              shellResult.error = error;
            }
          }
          resolve(shellResult);
        },
      );
    } catch {}
  });

export default runShell;
export {
  runDockerComposeDeployment,
  runDockerComposeValidation,
  runDockerComposeKill,
  runDockerComposeListContainer,
  runDockerSwarmDeployment,
  runDockerSwarmInit,
  runLeaveSwarm,
  runCheckStack,
  runDockerSwarmDeployStack,
  runSpawn,
  runDockerStats
};