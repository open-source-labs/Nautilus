/**
 * ************************************
 *
 * @module  Nodes.tsx
 * @author
 * @date 3/23/20
 * @description Rendering of the nodes in d3 simulation
 *
 * ************************************
 */
import React, { useEffect } from 'react';
import * as d3 from 'd3';
// IMPORT HELPER FUNCTIONS
import {
  getHorizontalPosition,
  getVerticalPosition,
} from '../helpers/getSimulationDimensions';
import { getStatic } from '../helpers/static';
// IMPORT TYPES
import {
  SNode,
  SetSelectedContainer,
  Services,
  Options,
  Simulation,
} from '../App.d';
// IMPORT COMPONENTS
import NodePorts from './NodePorts';
import NodeVolumes from './NodeVolumes';

type Props = {
  services: Services;
  nodes: SNode[];
  setSelectedContainer: SetSelectedContainer;
  simulation: Simulation;
  treeDepth: number;
  options: Options;
};

const Nodes: React.FC<Props> = ({
  nodes,
  setSelectedContainer,
  simulation,
  treeDepth,
  services,
  options,
}) => {
  /**
   *********************
   * RENDER NODES
   *********************
   */
  useEffect(() => {
    const container = d3.select('.depends-wrapper');
    const width = parseInt(container.style('width'), 10);
    const height = parseInt(container.style('height'), 10);

    //sets 'clicked' nodes back to unfixed position
    const dblClick = (d: SNode) => {
      simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    };

    let drag = d3
      .drag<SVGGElement, SNode>()
      .on('start', function dragstarted(d: SNode) {
        if (!d3.event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d3.event.x;
        d3.event.y;
      })
      .on('drag', function dragged(d: SNode) {
        d3.select(this).raise();
        d.fx = d3.event.x;
        d.fy = d3.event.y;
      })
      .on('end', function dragended(d: SNode) {
        if (!d3.event.active) simulation.alphaTarget(0);
        d.fx = d.x;
        d.fy = d.y;
      });

    // create container svgs
    const nodeContainers = d3
      .select('.nodes')
      .selectAll('g')
      .data<SNode>(nodes)
      .enter()
      .append('g')
      .on('click', (node: SNode) => {
        setSelectedContainer(node.name);
      })
      .on('dblclick', dblClick)
      .call(drag)
      .attr('fx', (d: SNode) => {
        //assign the initial x location to the relative displacement from the left
        return (d.fx = getHorizontalPosition(d, width));
      })
      .attr('fy', (d: SNode) => {
        return (d.fy = getVerticalPosition(d, treeDepth, height));
      });

    // add names of services
    nodeContainers.append('text').text((d: SNode) => d.name);

    //add container images
    nodeContainers
      .append('svg:image')
      .attr('xlink:href', (d: SNode) => {
        return getStatic('container.svg');
      })
      .attr('height', 60)
      .attr('width', 60);

    return () => {
      nodeContainers.remove();
    };
  }, [services]);

  return (
    <g className="nodes">
      <NodePorts portsOn={options.ports} />
      <NodeVolumes volumesOn={options.volumes} />
    </g>
  );
};

export default Nodes;
