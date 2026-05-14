import React, { useRef } from 'react';
import { useGLTF, Float, PerspectiveCamera } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';

/**
 * @description Componente que maneja la visualización de los modelos 3D del Hero.
 * @param {string} modelPath - Ruta al archivo .glb
 */
export const HeroModels = ({ modelPath = '/models/hero_model.glb' }) => {
  const group = useRef();
  const { nodes, materials } = useGLTF(modelPath);

  // Animación sutil de levitación (Floating effect)
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (group.current) {
      group.current.rotation.y = Math.sin(t / 4) / 8;
      group.current.position.y = (1 + Math.sin(t / 1.5)) / 10;
    }
  });

  return (
    <group ref={group} dispose={null}>
      <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
        {/* Aquí mapeamos los nodos específicos del modelo de Planetono 
            debes verificar los nombres exactos en tu archivo GLB */}
        <mesh
          geometry={nodes.Planet?.geometry}
          material={materials.MainMaterial}
          scale={1.2}
        />
      </Float>
      
      <PerspectiveCamera makeDefault position={[0, 0, 5]} fov={75} />
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
    </group>
  );
};

// Optimizamos la carga previa de assets
useGLTF.preload('/models/hero_model.glb');