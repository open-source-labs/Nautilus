/**
 * ************************************
 *
 * @module  ComposeDeployment.tsx
 * @author David Soerensen, Michael Villamor
 * @date 3/11/20 edited 7/7/22
 * @description container for hte swarm deployment. 
 *
 * ************************************
 */

import React from 'react';

import SwarmDeployment from './SwarmDeployment';

const ClusterDeployment: React.FC = () => {
  return (
    <div>
      <SwarmDeployment  />

      {/*planned feature */}

      {/* <KubeDeployment currentFilePath={currentFilePath} /> */}
    </div>
  );
};

export default ClusterDeployment;
