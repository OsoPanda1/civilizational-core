 import React, { useRef, useMemo } from 'react';
 import { useFrame } from '@react-three/fiber';
 import * as THREE from 'three';
 
 interface PhoenixWorldShaderProps {
   economicHealth: number;
   size?: number;
 }
 
 const vertexShader = `
   varying vec2 vUv;
   varying float vElevation;
   varying vec3 vNormal;
   uniform float uTime;
   uniform float uEconomicHealth;
 
   void main() {
     vUv = uv;
     vNormal = normal;
     vec3 pos = position;
 
     // 4D Breathing: structures expand when economy is healthy
     float breath = sin(uTime * 0.5 + position.y * 2.0) * 0.05 * uEconomicHealth;
     float pulse = sin(uTime * 2.0) * 0.02 * uEconomicHealth;
     
     pos += normal * (breath + pulse);
     vElevation = breath + pulse;
     
     gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
   }
 `;
 
 const fragmentShader = `
   uniform float uTime;
   uniform float uEconomicHealth;
   varying vec2 vUv;
   varying float vElevation;
   varying vec3 vNormal;
 
   void main() {
     // TAMV Color Palette
     vec3 colorDecay = vec3(0.2, 0.1, 0.1);      // Crisis: dark rust
     vec3 colorNeutral = vec3(0.1, 0.15, 0.2);   // Neutral: dark navy
     vec3 colorUtopia = vec3(0.9, 0.7, 0.2);     // Healthy: TAMV Gold
     vec3 colorTeal = vec3(0.0, 0.8, 0.7);       // Accent: TAMV Teal
     
     // Dynamic color based on economic health
     vec3 baseColor;
     if (uEconomicHealth < 0.3) {
       baseColor = mix(colorDecay, colorNeutral, uEconomicHealth / 0.3);
     } else if (uEconomicHealth < 0.7) {
       baseColor = mix(colorNeutral, colorTeal, (uEconomicHealth - 0.3) / 0.4);
     } else {
       baseColor = mix(colorTeal, colorUtopia, (uEconomicHealth - 0.7) / 0.3);
     }
     
     // Add glow based on elevation
     float glow = smoothstep(0.0, 0.1, vElevation) * uEconomicHealth;
     
     // Fresnel effect for edge glow
     float fresnel = pow(1.0 - abs(dot(vNormal, vec3(0.0, 0.0, 1.0))), 3.0);
     vec3 fresnelColor = mix(colorTeal, colorUtopia, uEconomicHealth) * fresnel * 0.5;
     
     // Animated pulse lines
     float lines = sin(vUv.y * 20.0 + uTime * 2.0) * 0.5 + 0.5;
     lines = step(0.9, lines) * uEconomicHealth * 0.3;
     
     vec3 finalColor = baseColor + fresnelColor + vec3(lines) + vec3(glow * 0.2);
     
     // Add subtle transparency for depth
     float alpha = 0.85 + fresnel * 0.15;
     
     gl_FragColor = vec4(finalColor, alpha);
   }
 `;
 
 export const PhoenixWorldShader: React.FC<PhoenixWorldShaderProps> = ({ 
   economicHealth, 
   size = 2 
 }) => {
   const meshRef = useRef<THREE.Mesh>(null);
   
   const uniforms = useMemo(() => ({
     uTime: { value: 0 },
     uEconomicHealth: { value: economicHealth },
   }), []);
 
   useFrame((state) => {
     if (meshRef.current) {
       const material = meshRef.current.material as THREE.ShaderMaterial;
       material.uniforms.uTime.value = state.clock.elapsedTime;
       // Smooth transition of economic health
       material.uniforms.uEconomicHealth.value = THREE.MathUtils.lerp(
         material.uniforms.uEconomicHealth.value,
         economicHealth,
         0.05
       );
       
       // Gentle rotation
       meshRef.current.rotation.y += 0.002;
     }
   });
 
   return (
     <mesh ref={meshRef}>
       <icosahedronGeometry args={[size, 32]} />
       <shaderMaterial
         uniforms={uniforms}
         vertexShader={vertexShader}
         fragmentShader={fragmentShader}
         transparent={true}
         side={THREE.DoubleSide}
       />
     </mesh>
   );
 };
 
 export default PhoenixWorldShader;