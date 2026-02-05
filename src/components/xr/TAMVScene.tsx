 import React, { Suspense, useState, useEffect } from 'react';
 import { Canvas } from '@react-three/fiber';
 import { OrbitControls, Stars, Environment } from '@react-three/drei';
 import { PhoenixWorldShader } from './PhoenixWorldShader';
 import { IsabellaCore } from './IsabellaCore';
 import { FederatedNode, NodeConnection } from './FederatedNode';
 import { supabase } from '@/integrations/supabase/client';
 
 interface TAMVSceneProps {
   showNodes?: boolean;
   showIsabella?: boolean;
   interactive?: boolean;
 }
 
 export const TAMVScene: React.FC<TAMVSceneProps> = ({
   showNodes = true,
   showIsabella = true,
   interactive = true,
 }) => {
   const [economicHealth, setEconomicHealth] = useState(0.5);
   const [nodes, setNodes] = useState<any[]>([]);
   const [selectedNode, setSelectedNode] = useState<string | null>(null);
 
   useEffect(() => {
     // Fetch initial data
     const fetchData = async () => {
       // Get federated nodes
       const { data: nodesData } = await supabase
         .from('federated_nodes')
         .select('*')
         .order('health_score', { ascending: false });
       
       if (nodesData) {
         // Position nodes in a circle
         const positionedNodes = nodesData.map((node, i) => ({
           ...node,
           position: [
             Math.cos((i / nodesData.length) * Math.PI * 2) * 4,
             (Math.random() - 0.5) * 2,
             Math.sin((i / nodesData.length) * Math.PI * 2) * 4,
           ] as [number, number, number],
         }));
         setNodes(positionedNodes);
       }
     };
 
     fetchData();
 
     // Simulate economic health changes
     const interval = setInterval(() => {
       setEconomicHealth(prev => {
         const delta = (Math.random() - 0.5) * 0.05;
         return Math.max(0.1, Math.min(1, prev + delta));
       });
     }, 3000);
 
     return () => clearInterval(interval);
   }, []);
 
   return (
     <div className="w-full h-full min-h-[400px] rounded-lg overflow-hidden bg-tamv-navy">
       <Canvas
         camera={{ position: [0, 2, 8], fov: 60 }}
         gl={{ antialias: true, alpha: true }}
       >
         <Suspense fallback={null}>
           {/* Lighting */}
           <ambientLight intensity={0.3} />
           <pointLight position={[10, 10, 10]} intensity={1} color="#f59e0b" />
           <pointLight position={[-10, -10, -10]} intensity={0.5} color="#00d4aa" />
           
           {/* Background */}
           <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
           
           {/* Central Phoenix World */}
           <PhoenixWorldShader economicHealth={economicHealth} size={1.5} />
           
           {/* Isabella AI Core */}
           {showIsabella && (
             <IsabellaCore
               processingLoad={0.7}
               ethicsScore={0.9}
               position={[0, 3, 0]}
             />
           )}
           
           {/* Federated Nodes */}
           {showNodes && nodes.map((node) => (
             <React.Fragment key={node.id}>
               <FederatedNode
                 node={{
                   id: node.id,
                   name: node.node_name,
                   type: node.node_type,
                   status: node.status,
                   astState: node.ast_state,
                   healthScore: node.health_score,
                   position: node.position,
                 }}
                 selected={selectedNode === node.id}
                 onClick={() => setSelectedNode(node.id)}
               />
               {/* Connection to center */}
               <NodeConnection
                 start={node.position}
                 end={[0, 0, 0]}
                 active={node.status === 'active'}
               />
             </React.Fragment>
           ))}
           
           {/* Controls */}
           {interactive && (
             <OrbitControls
               enablePan={false}
               minDistance={3}
               maxDistance={15}
               autoRotate
               autoRotateSpeed={0.5}
             />
           )}
         </Suspense>
       </Canvas>
       
       {/* Overlay UI */}
       <div className="absolute bottom-4 left-4 text-xs text-muted-foreground">
         <div className="flex items-center gap-2">
           <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
           <span>Economic Health: {(economicHealth * 100).toFixed(1)}%</span>
         </div>
       </div>
     </div>
   );
 };
 
 export default TAMVScene;