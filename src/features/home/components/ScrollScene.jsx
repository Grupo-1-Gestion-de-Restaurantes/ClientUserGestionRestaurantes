import { useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useGLTF, useAnimations } from '@react-three/drei';
import { useScrollStore } from '../store/useScrollStore';
import * as THREE from 'three';

export const ScrollScene = () => {
  // 1. Cargamos el Entorno y la Cámara con su animación
  const { scene: envScene } = useGLTF('/three/scroll_model.glb');
  const { scene: cameraScene, animations } = useGLTF('/three/scroll_camera.glb');
  
  // 2. Extraemos las herramientas de R3F
  const { set } = useThree();
  const { actions, mixer } = useAnimations(animations, cameraScene);

  useEffect(() => {
    // 3. Buscamos la cámara oculta dentro del archivo GLB y la volvemos la "Principal"
    cameraScene.traverse((child) => {
      if (child.isPerspectiveCamera) {
        // Configuramos el campo de visión para que parezca cinematográfico
        child.fov = 45;
        child.updateProjectionMatrix();
        set({ camera: child }); 
      }
    });

    // 4. Tomamos la animación, la iniciamos pero la PAUSAMOS.
    const action = Object.values(actions)[0];
    if (action) {
      action.play();
      action.paused = true; // Nosotros controlaremos el tiempo manualmente
    }
  }, [cameraScene, actions, set]);

  // 5. EL NÚCLEO DE LA MAGIA: Esto se ejecuta 60 veces por segundo
  useFrame(() => {
    // Leemos el store SIN causar re-renders en React (Transient update)
    const progress = useScrollStore.getState().progress;
    const action = Object.values(actions)[0];
    
    if (action) {
      const duration = action.getClip().duration;
      
      // Matemática PRO: Interpolación lineal suave (Lerp) para evitar tirones si el usuario hace scroll rápido
      const targetTime = progress * duration;
      
      // Movemos la cámara lentamente hacia el targetTime
      mixer.setTime(THREE.MathUtils.lerp(mixer.time, targetTime, 0.05));
    }
  });

  return (
    <group>
      <ambientLight intensity={1.5} />
      <directionalLight position={[10, 20, 10]} intensity={2} color="#ffffff" />
      
      {/* Renderizamos el modelo de la estación */}
      <primitive object={envScene} />
      
      {/* Renderizamos el sistema de la cámara */}
      <primitive object={cameraScene} />
    </group>
  );
};

// Optimizamos precargando
useGLTF.preload('/three/scroll_model.glb');
useGLTF.preload('/three/scroll_camera.glb');