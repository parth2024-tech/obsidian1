"use client";

import { useEffect, useRef, useState } from "react";
import ForceGraph2D from "react-force-graph-2d";
import { useMetadataStore } from "@/stores/metadata-store";
import { useWorkspaceStore } from "@/stores/workspace-store";

export function GraphView() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { cache } = useMetadataStore();
  const { openTab } = useWorkspaceStore();
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const [mode, setMode] = useState<'global' | 'local'>('global');

  useEffect(() => {
    if (containerRef.current) {
      setDimensions({
        width: containerRef.current.clientWidth,
        height: containerRef.current.clientHeight
      });
    }
    const handleResize = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight
        });
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const getGraphData = () => {
    const nodes: any[] = [];
    const links: any[] = [];
    
    Array.from(cache.entries()).forEach(([path, data]) => {
      nodes.push({ id: path, name: path.split('/').pop()?.replace('.md', ''), val: 1 });
      
      data.links?.forEach(link => {
        links.push({
          source: path,
          target: link.link
        });
        // Ensure target node exists
        if (!nodes.find(n => n.id === link.link)) {
          nodes.push({ id: link.link, name: link.link.split('/').pop()?.replace('.md', ''), val: 0.5 });
        }
      });
    });
    
    return { nodes, links };
  };

  return (
    <div ref={containerRef} className="w-full h-full bg-[var(--graph-bg)] relative">
      <div className="absolute top-4 left-4 z-10 flex gap-2">
        <button 
          onClick={() => setMode('global')}
          className={`px-3 py-1 rounded text-sm ${mode === 'global' ? 'bg-[var(--primary)] text-[var(--primary-foreground)]' : 'bg-[var(--card)] text-[var(--foreground)]'}`}
        >
          Global
        </button>
        <button 
          onClick={() => setMode('local')}
          className={`px-3 py-1 rounded text-sm ${mode === 'local' ? 'bg-[var(--primary)] text-[var(--primary-foreground)]' : 'bg-[var(--card)] text-[var(--foreground)]'}`}
        >
          Local
        </button>
      </div>
      <ForceGraph2D
        width={dimensions.width}
        height={dimensions.height}
        graphData={getGraphData()}
        nodeLabel="name"
        nodeColor={(node: any) => node.val === 1 ? 'var(--graph-node)' : 'var(--graph-node-active)'}
        linkColor={() => 'var(--graph-edge)'}
        backgroundColor="transparent"
        onNodeClick={(node) => {
          if (node.id) openTab(node.id as string);
        }}
      />
    </div>
  );
}
