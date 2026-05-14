import { useEffect, useLayoutEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useGLTF, useAnimations } from '@react-three/drei';
import { useScrollStore } from '../store/useScrollStore';
import * as THREE from 'three';

export const ScrollScene = () => {
  const { scene: envScene, animations: envAnims } = useGLTF('/three/scroll_model.glb');
  const { scene: cameraScene, animations: camAnims } = useGLTF('/three/scroll_camera.glb');
  
  const { set, gl } = useThree();
  const { actions: camActions, mixer: camMixer } = useAnimations(camAnims, cameraScene);
  const { actions: envActions, mixer: envMixer } = useAnimations(envAnims, envScene);

  useLayoutEffect(() => {
    gl.toneMapping = THREE.ReinhardToneMapping;
    gl.outputColorSpace = THREE.SRGBColorSpace;
    gl.toneMappingExposure = 2.5; // Boosted for bright models on red bg
  }, [gl]);

  useEffect(() => {
    cameraScene.traverse((child) => {
      if (child.isPerspectiveCamera) {
        child.fov = 45;
        child.updateProjectionMatrix();
        set({ camera: child }); 
      }
    });

    Object.values(camActions).forEach(action => {
      if (action) {
        action.play();
        action.paused = true;
      }
    });

    Object.values(envActions).forEach(action => {
      if (action) {
        action.play();
        action.paused = true;
      }
    });
  }, [cameraScene, camActions, envActions, set]);

  useFrame(() => {
    const progress = useScrollStore.getState().progress;
    const mainCamAction = Object.values(camActions)[0];
    const mainEnvAction = Object.values(envActions)[0];
    
    const duration = mainCamAction
      ? mainCamAction.getClip().duration
      : (mainEnvAction ? mainEnvAction.getClip().duration : 10);
    const targetTime = progress * duration;
    
    // Slightly faster lerp for more responsive tracking
    if (camMixer) camMixer.setTime(THREE.MathUtils.lerp(camMixer.time, targetTime, 0.08));
    if (envMixer) envMixer.setTime(THREE.MathUtils.lerp(envMixer.time, targetTime, 0.08));
  });

  return (
    <group>
      <ambientLight intensity={2} />
      <directionalLight position={[0, 5, 5]} intensity={12} color="#ffffff" castShadow={false} />
      <directionalLight position={[-10, 6, -8]} intensity={3} color="#fff5e0" />
      
      <primitive object={envScene} />
      <primitive object={cameraScene} />
    </group>
  );
};

useGLTF.preload('/three/scroll_model.glb');
useGLTF.preload('/three/scroll_camera.glb');