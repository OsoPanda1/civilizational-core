 import React, { useRef, useMemo } from 'react';
 import { useFrame } from '@react-three/fiber';
 import { Sphere, Line, Html } from '@react-three/drei';
 import * as THREE from 'three';
 
 interface NodeData {
   id: string;
   name: string;
   type: 'edge' | 'fog' | 'cloud' | 'quantum';
   status: 'active' | 'degraded' | 'offline';
   astState: 'NORMAL' | 'OBLIVION' | 'BUNKER' | 'ORPHAN' | 'PHOENIX';
   healthScore: number;
   position: [number, number, number];
 }
 
 interface FederatedNodeProps {
   node: NodeData;
   selected?: boolean;
   onClick?: () => void;
 }
 
 const getNodeColor = (status: string, astState: string): string => {
   if (status === 'offline') return '#ef4444';
   if (status === 'degraded') return '#f59e0b';
   
   switch (astState) {
     case 'PHOENIX': return '#f59e0b';
     case 'BUNKER': return '#8b5cf6';
     case 'ORPHAN': return '#6b7280';
     case 'OBLIVION': return '#ef4444';
     default: return '#00d4aa';
   }
 };
 
 const getNodeSize = (type: string): number => {
   switch (type) {
     case 'cloud': return 0.5;
     case 'fog': return 0.35;
     case 'edge': return 0.25;
     case 'quantum': return 0.6;
     default: return 0.3;
   }
 };
 
 export const FederatedNode: React.FC<FederatedNodeProps> = ({ 
   node, 
   selected = false,
   onClick 
 }) => {
   const meshRef = useRef<THREE.Mesh>(null);
   const glowRef = useRef<THREE.Mesh>(null);
   
   const color = useMemo(() => getNodeColor(node.status, node.astState), [node.status, node.astState]);
   const size = useMemo(() => getNodeSize(node.type), [node.type]);
 
   useFrame((state) => {
     if (meshRef.current) {
       // Pulse effect based on health
       const pulse = Math.sin(state.clock.elapsedTime * 2) * 0.1 * (node.healthScore / 100);
       meshRef.current.scale.setScalar(1 + pulse);
     }
     
     if (glowRef.current && selected) {
       glowRef.current.scale.setScalar(1.5 + Math.sin(state.clock.elapsedTime * 3) * 0.1);
     }
   });
 
   return (
     <group position={node.position}>
       {/* Glow effect when selected */}
       {selected && (
         <Sphere ref={glowRef} args={[size * 1.5, 16, 16]}>
           <meshBasicMaterial color={color} transparent opacity={0.2} />
         </Sphere>
       )}
       
       {/* Main node sphere */}
       <Sphere 
         ref={meshRef} 
         args={[size, 32, 32]} 
         onClick={onClick}
       >
         <meshStandardMaterial
           color={color}
           emissive={color}
           emissiveIntensity={0.3}
           metalness={0.8}
           roughness={0.2}
         />
       </Sphere>
       
        {/* Node label */}
        <Html position={[0, size + 0.4, 0]} center distanceFactor={8} style={{ pointerEvents: 'none' }}>
          <div style={{ textAlign: 'center', whiteSpace: 'nowrap' }}>
            <div style={{ color: 'white', fontSize: '10px', fontWeight: 600 }}>{node.name}</div>
            <div style={{ color, fontSize: '8px' }}>{node.astState} | {node.healthScore}%</div>
          </div>
        </Html>
     </group>
   );
 };
 
 interface NodeConnectionProps {
   start: [number, number, number];
   end: [number, number, number];
   active?: boolean;
 }
 
 export const NodeConnection: React.FC<NodeConnectionProps> = ({ 
   start, 
   end, 
   active = true 
 }) => {
   const points = useMemo(() => [
     new THREE.Vector3(...start),
     new THREE.Vector3(...end),
   ], [start, end]);
 
   return (
     <Line
       points={points}
       color={active ? '#00d4aa' : '#4b5563'}
       lineWidth={active ? 2 : 1}
       dashed={!active}
       dashSize={0.1}
       gapSize={0.05}
     />
   );
 };
 
 export default FederatedNode;