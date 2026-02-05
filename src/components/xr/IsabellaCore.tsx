 import React, { useRef, useMemo } from 'react';
 import { useFrame } from '@react-three/fiber';
 import { Sphere, Ring } from '@react-three/drei';
 import * as THREE from 'three';
 
 interface IsabellaCoreProps {
   processingLoad: number; // 0-1
   ethicsScore: number; // 0-1
   position?: [number, number, number];
 }
 
 const coreVertexShader = `
   varying vec2 vUv;
   varying vec3 vPosition;
   uniform float uTime;
   uniform float uProcessing;
 
   void main() {
     vUv = uv;
     vPosition = position;
     
     vec3 pos = position;
     
     // Neural pulse effect
     float pulse = sin(uTime * 3.0 + position.y * 5.0) * 0.05 * uProcessing;
     pos += normal * pulse;
     
     gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
   }
 `;
 
 const coreFragmentShader = `
   uniform float uTime;
   uniform float uProcessing;
   uniform float uEthics;
   varying vec2 vUv;
   varying vec3 vPosition;
 
   void main() {
     // Isabella's signature colors
     vec3 coreColor = vec3(0.6, 0.3, 0.9);      // Deep purple
     vec3 ethicsColor = vec3(0.0, 0.9, 0.7);    // Teal (ethical alignment)
     vec3 processingColor = vec3(0.9, 0.7, 0.2); // Gold (active processing)
     
     // Base color modulated by ethics score
     vec3 baseColor = mix(coreColor, ethicsColor, uEthics);
     
     // Add processing glow
     float processingGlow = sin(uTime * 5.0) * 0.5 + 0.5;
     baseColor = mix(baseColor, processingColor, processingGlow * uProcessing * 0.3);
     
     // Neural network pattern
     float pattern = sin(vUv.x * 20.0 + uTime) * sin(vUv.y * 20.0 + uTime * 0.7);
     pattern = smoothstep(0.3, 0.7, pattern) * uProcessing;
     
     // Consciousness rings
     float rings = sin(length(vPosition) * 10.0 - uTime * 2.0);
     rings = smoothstep(0.8, 1.0, rings) * 0.3;
     
     vec3 finalColor = baseColor + vec3(pattern * 0.2) + vec3(rings);
     
     // Central glow
     float centerGlow = 1.0 - length(vUv - 0.5) * 2.0;
     centerGlow = max(0.0, centerGlow);
     finalColor += vec3(centerGlow * 0.3);
     
     gl_FragColor = vec4(finalColor, 0.9);
   }
 `;
 
 export const IsabellaCore: React.FC<IsabellaCoreProps> = ({
   processingLoad,
   ethicsScore,
   position = [0, 0, 0],
 }) => {
   const coreRef = useRef<THREE.Mesh>(null);
   const ring1Ref = useRef<THREE.Mesh>(null);
   const ring2Ref = useRef<THREE.Mesh>(null);
   const ring3Ref = useRef<THREE.Mesh>(null);
 
   const uniforms = useMemo(() => ({
     uTime: { value: 0 },
     uProcessing: { value: processingLoad },
     uEthics: { value: ethicsScore },
   }), []);
 
   useFrame((state) => {
     const time = state.clock.elapsedTime;
     
     if (coreRef.current) {
       const material = coreRef.current.material as THREE.ShaderMaterial;
       material.uniforms.uTime.value = time;
       material.uniforms.uProcessing.value = THREE.MathUtils.lerp(
         material.uniforms.uProcessing.value,
         processingLoad,
         0.1
       );
       material.uniforms.uEthics.value = THREE.MathUtils.lerp(
         material.uniforms.uEthics.value,
         ethicsScore,
         0.1
       );
     }
     
     // Rotate consciousness rings
     if (ring1Ref.current) {
       ring1Ref.current.rotation.x = time * 0.5;
       ring1Ref.current.rotation.y = time * 0.3;
     }
     if (ring2Ref.current) {
       ring2Ref.current.rotation.x = -time * 0.4;
       ring2Ref.current.rotation.z = time * 0.2;
     }
     if (ring3Ref.current) {
       ring3Ref.current.rotation.y = time * 0.6;
       ring3Ref.current.rotation.z = -time * 0.25;
     }
   });
 
   return (
     <group position={position}>
       {/* Core sphere */}
       <mesh ref={coreRef}>
         <sphereGeometry args={[0.8, 64, 64]} />
         <shaderMaterial
           uniforms={uniforms}
           vertexShader={coreVertexShader}
           fragmentShader={coreFragmentShader}
           transparent
         />
       </mesh>
       
       {/* Consciousness rings */}
       <Ring ref={ring1Ref} args={[1.0, 1.05, 64]}>
         <meshBasicMaterial color="#00d4aa" transparent opacity={0.6} side={THREE.DoubleSide} />
       </Ring>
       
       <Ring ref={ring2Ref} args={[1.2, 1.24, 64]}>
         <meshBasicMaterial color="#f59e0b" transparent opacity={0.4} side={THREE.DoubleSide} />
       </Ring>
       
       <Ring ref={ring3Ref} args={[1.4, 1.43, 64]}>
         <meshBasicMaterial color="#8b5cf6" transparent opacity={0.3} side={THREE.DoubleSide} />
       </Ring>
       
       {/* Inner glow */}
       <Sphere args={[0.6, 32, 32]}>
         <meshBasicMaterial color="#ffffff" transparent opacity={0.1} />
       </Sphere>
     </group>
   );
 };
 
 export default IsabellaCore;