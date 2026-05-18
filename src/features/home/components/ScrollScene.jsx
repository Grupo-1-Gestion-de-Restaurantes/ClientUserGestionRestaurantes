import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useGLTF, Environment } from "@react-three/drei";
import { useScrollStore } from "../store/useScrollStore";
import * as THREE from "three";

// El offset desplaza la cámara a lo largo del vector target→cámara,
// no en Z del mundo: valores positivos alejan, negativos acercan.
const CAMERA_DISTANCE_OFFSET = 0;

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function boostMaterials(scene) {
  scene.traverse((child) => {
    if (!child.isMesh || !child.material) return;
    const mats = Array.isArray(child.material) ? child.material : [child.material];
    mats.forEach((mat) => {
      if (!(mat instanceof THREE.MeshStandardMaterial)) return;
      mat.roughness = Math.min(mat.roughness, 0.15);
      mat.metalness = Math.max(mat.metalness, 0.6);
      mat.envMapIntensity = 3.0;
      if (mat.color) {
        if (!mat.emissive) mat.emissive = new THREE.Color(0x000000);
        mat.emissive.set(mat.color).multiplyScalar(0.25);
        mat.emissiveIntensity = 0.25;
      }
      mat.needsUpdate = true;
    });
  });
}

export const ScrollScene = () => {
  const { camera } = useThree();
  const scrollProgress = useScrollStore((state) => state.progress);

  const cameraPath = useMemo(() => {
    if (typeof window === "undefined") return "/three/scroll_camera.glb";
    return window.innerWidth < 768
      ? "/three/scroll_camera_mobile.glb"
      : "/three/scroll_camera.glb";
  }, []);

  const { scene: modelScene, animations: modelAnims } = useGLTF("/three/scroll_model.glb");
  const { scene: camScene, animations: camAnims } = useGLTF(cameraPath);

  const modelMixer = useMemo(() => new THREE.AnimationMixer(modelScene), [modelScene]);
  const cameraMixer = useMemo(() => new THREE.AnimationMixer(camScene), [camScene]);

  const modelActionsRef = useRef([]);
  const camActionsRef = useRef([]);

  const blenderCamRef = useRef(null);
  const blenderTargetRef = useRef(null);
  const tmpTargetPos = useMemo(() => new THREE.Vector3(), []);
  const tmpCamPos = useMemo(() => new THREE.Vector3(), []);
  const tmpDir = useMemo(() => new THREE.Vector3(), []);
  const tmpQuat = useMemo(() => new THREE.Quaternion(), []);
  const lastFovRef = useRef(null);

  const modelDuration = useMemo(() => {
    if (!modelAnims.length) return 0;
    return Math.max(...modelAnims.map((c) => c.duration));
  }, [modelAnims]);

  const camDuration = useMemo(() => {
    if (!camAnims.length) return 0;
    return Math.max(...camAnims.map((c) => c.duration));
  }, [camAnims]);

  // Boost PBR materials once
  useEffect(() => { boostMaterials(modelScene); }, [modelScene]);

  // Aplica pose inicial de la cámara Blender y desplaza a lo largo del vector
  // (target→cam) para que el offset realmente aleje/acerque en la línea de visión.
  useEffect(() => {
    camScene.updateMatrixWorld(true);
    let blenderCam = null;
    let blenderTarget = null;
    camScene.traverse((obj) => {
      if (!blenderCam && obj.isCamera) blenderCam = obj;
      const name = String(obj.name || "").toLowerCase();
      if (!blenderTarget && !obj.isCamera && (name.includes("target") || name.includes("look"))) {
        blenderTarget = obj;
      }
    });
    if (!blenderCam) return;

    const pos = new THREE.Vector3();
    const quat = new THREE.Quaternion();
    blenderCam.getWorldPosition(pos);
    blenderCam.getWorldQuaternion(quat);

    if (CAMERA_DISTANCE_OFFSET !== 0) {
      const targetPos = new THREE.Vector3();
      if (blenderTarget) {
        blenderTarget.getWorldPosition(targetPos);
      }
      const dir = pos.clone().sub(targetPos);
      if (dir.lengthSq() > 0) {
        dir.normalize();
        pos.addScaledVector(dir, CAMERA_DISTANCE_OFFSET);
      }
    }

    camera.position.copy(pos);
    camera.quaternion.copy(quat);
    if (blenderCam.isPerspectiveCamera && blenderCam.fov) camera.fov = blenderCam.fov;
    camera.updateProjectionMatrix();
  }, [camScene, camera]);

  useEffect(() => {
    blenderCamRef.current = null;
    blenderTargetRef.current = null;

    camScene.updateMatrixWorld(true);
    camScene.traverse((obj) => {
      if (!blenderCamRef.current && obj.isCamera) {
        blenderCamRef.current = obj;
        return;
      }

      if (blenderTargetRef.current) return;
      const name = String(obj.name || "").toLowerCase();
      if (!obj.isCamera && (name.includes("target") || name.includes("look"))) {
        blenderTargetRef.current = obj;
      }
    });
  }, [camScene]);

  // Prime all model clips: play + paused — we control the playhead manually
  useEffect(() => {
    if (!modelAnims.length) return;
    modelActionsRef.current = modelAnims.map((clip) => {
      const action = modelMixer.clipAction(clip);
      action.reset();
      action.play();
      action.paused = true;
      return action;
    });
    return () => modelMixer.stopAllAction();
  }, [modelMixer, modelAnims]);

  useEffect(() => {
    if (!camAnims.length) return;
    camActionsRef.current = camAnims.map((clip) => {
      const action = cameraMixer.clipAction(clip);
      action.reset();
      action.play();
      // Mantener la action activa (enabled + play) pero sin auto-avance:
      // mixer.setTime(t) sí re-evalúa los bindings con timeScale=0,
      // mientras que paused=true rompe la propagación en three ^0.184.
      action.timeScale = 0;
      action.clampWhenFinished = true;
      return action;
    });
    return () => cameraMixer.stopAllAction();
  }, [cameraMixer, camAnims]);

  // Dev warnings: detectar GLB sin animaciones o sin cámara
  useEffect(() => {
    if (!import.meta.env.DEV) return;
    if (!camAnims.length) {
      console.warn("[ScrollScene] camera GLB no tiene animaciones");
    }
    if (!blenderCamRef.current) {
      console.warn("[ScrollScene] no se encontró ninguna PerspectiveCamera dentro del GLB de cámara");
    }
  }, [camAnims, camScene]);

  // Scrub model animation in sync with scroll progress across all clips
  useFrame((state) => {
    if (modelActionsRef.current.length && Number.isFinite(modelDuration) && modelDuration > 0) {
      const t = scrollProgress * modelDuration;
      modelActionsRef.current.forEach((action) => {
        const duration = action.getClip().duration;
        action.time = clamp(t, 0, duration);
      });
      modelMixer.update(0);
    }

    const blenderCam = blenderCamRef.current;
    if (!blenderCam || !camActionsRef.current.length) return;
    if (!Number.isFinite(camDuration) || camDuration <= 0) return;

    const t = clamp(scrollProgress * camDuration, 0, camDuration);
    const camActions = camActionsRef.current;
    const anyPaused = camActions.some((a) => a.paused);

    // Path principal: setTime fuerza la re-evaluación de bindings (con timeScale=0).
    // Path manual de fallback: si alguien externamente vuelve a pausar las acciones,
    // empujamos action.time + mixer.update(0) para no quedarnos congelados.
    if (anyPaused) {
      camActions.forEach((action) => {
        const duration = action.getClip().duration;
        action.time = clamp(t, 0, duration);
      });
      cameraMixer.update(0);
    } else {
      cameraMixer.setTime(t);
    }

    camScene.updateMatrixWorld(true);

    tmpCamPos.setFromMatrixPosition(blenderCam.matrixWorld);

    const blenderTarget = blenderTargetRef.current;
    if (blenderTarget) {
      tmpTargetPos.setFromMatrixPosition(blenderTarget.matrixWorld);
    } else {
      tmpTargetPos.set(0, 0, 0);
    }

    if (CAMERA_DISTANCE_OFFSET !== 0) {
      tmpDir.copy(tmpCamPos).sub(tmpTargetPos);
      if (tmpDir.lengthSq() > 0) {
        tmpDir.normalize();
        tmpCamPos.addScaledVector(tmpDir, CAMERA_DISTANCE_OFFSET);
      }
    }

    state.camera.position.copy(tmpCamPos);

    if (blenderTarget) {
      state.camera.lookAt(tmpTargetPos);
    } else {
      blenderCam.getWorldQuaternion(tmpQuat);
      state.camera.quaternion.copy(tmpQuat);
    }

    if (blenderCam.isPerspectiveCamera && typeof blenderCam.fov === "number") {
      const nextFov = blenderCam.fov;
      if (lastFovRef.current !== nextFov) {
        lastFovRef.current = nextFov;
        state.camera.fov = nextFov;
        state.camera.updateProjectionMatrix();
      }
    }
  });

  return (
    <>
      <ambientLight intensity={2.0} color="#ffffff" />
      <directionalLight position={[5, 10, 5]} intensity={4} color="#ffffff" />
      <directionalLight position={[-5, 5, -5]} intensity={1.5} color="#ffe0b0" />
      <Environment preset="city" environmentIntensity={1.2} />
      <primitive object={modelScene} />
    </>
  );
};

useGLTF.preload("/three/scroll_model.glb");
useGLTF.preload("/three/scroll_camera.glb");
useGLTF.preload("/three/scroll_camera_mobile.glb");
