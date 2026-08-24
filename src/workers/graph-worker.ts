import { forceSimulation, forceLink, forceManyBody, forceCenter, forceCollide, type SimulationNodeDatum, type SimulationLinkDatum } from 'd3-force';
import type { GraphNode, GraphLink } from '@/lib/vault/types';

interface D3Node extends GraphNode, SimulationNodeDatum {}
interface D3Link extends SimulationLinkDatum<D3Node> {
  source: string | D3Node;
  target: string | D3Node;
}

let simulation: any = null;

self.onmessage = (event: MessageEvent) => {
  const { type, payload } = event.data;

  if (type === 'init') {
    const nodes: D3Node[] = payload.nodes.map((n: GraphNode) => ({ ...n }));
    const links: D3Link[] = payload.links.map((l: GraphLink) => ({ ...l }));

    if (simulation) {
      simulation.stop();
    }

    simulation = forceSimulation(nodes)
      .force('link', forceLink(links).id((d: any) => d.id).distance(50))
      .force('charge', forceManyBody().strength(-200))
      .force('center', forceCenter(0, 0))
      .force('collide', forceCollide().radius(20))
      .on('tick', () => {
        self.postMessage({
          type: 'tick',
          nodes: nodes.map(n => ({ id: n.id, x: n.x, y: n.y }))
        });
      })
      .on('end', () => {
        self.postMessage({ type: 'end' });
      });
  } else if (type === 'tick') {
    if (simulation) simulation.tick();
  } else if (type === 'reheat') {
    if (simulation) {
      simulation.alpha(1).restart();
    }
  }
};
