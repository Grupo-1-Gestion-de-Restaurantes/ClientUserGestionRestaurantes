import { useEffect, useLayoutEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import { useScrollStore } from "../store/useScrollStore";
import * as THREE from "three";

const SCROLL_VISUAL_CONFIG = {
  lighting: {
    ambient: {
      intensity: 0,
      color: "#ffffff",
    },
    directional: {
      enabled: false,
      intensity: 1.2,
      color: "#ffffff",
      position: [0, 0, 0],
      castShadow: false,
    },
    topLight: {
      enabled: false,
      intensity: 800.0,
      position: [0, 50, 0],
      color: "#ffffff",
    },
  },

  materials: {
    saturationBoost: 0.15,
    brightnessBoost: 0,
    outline: {
      thickness: 0.01,
      color: 0x000000,
    },
  },

  camera: {
    distanceOffset: -14,
    yOffset: -8,
    fov: null,
  },

  background: null,
};

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function applyCartoonStyle(scene) {
  const meshes = [];
  scene.traverse((child) => {
    if (child.isMesh && !child.userData.isOutline) {
      meshes.push(child);
    }
  });

  const { saturationBoost, brightnessBoost, outline } =
    SCROLL_VISUAL_CONFIG.materials;

  meshes.forEach((child) => {
    const oldMat = child.material;
    const newMat = new THREE.MeshBasicMaterial({
      color: oldMat.color.clone(),
      map: oldMat.map ?? null,
    });

    newMat.color.offsetHSL(0, saturationBoost, brightnessBoost);
    child.material = newMat;
    child.castShadow = false;
    child.receiveShadow = false;

    const outlineMesh = child.clone(false);
    outlineMesh.material = new THREE.MeshBasicMaterial({
      color: outline.color,
      side: THREE.BackSide,
    });
    outlineMesh.scale.multiplyScalar(1.0 + (outline.thickness || 0.005));
    outlineMesh.userData.isOutline = true;
    child.parent.add(outlineMesh);
  });
}

export const ScrollScene = () => {
  const { gl, camera } = useThree();
  const scrollProgress = useScrollStore((state) => state.progress);
  const directionalLightRef = useRef(null);

  const cameraPath = useMemo(() => {
    if (typeof window === "undefined") return "/three/scroll_camera.glb";
    return window.innerWidth < 768
      ? "/three/scroll_camera_mobile.glb"
      : "/three/scroll_camera.glb";
  }, []);

  const { scene: modelScene, animations: modelAnims } = useGLTF(
    "/three/scroll_model.glb",
  );

  const { scene: camScene, animations: camAnims } = useGLTF(cameraPath);

  useLayoutEffect(() => {
    gl.toneMapping = THREE.NoToneMapping;
    gl.outputColorSpace = THREE.SRGBColorSpace;
    gl.shadowMap.enabled = false;
    gl.setPixelRatio(window.devicePixelRatio);
    gl.setClearColor(0x000000, 0);
  }, [gl]);

  const modelMixer = useMemo(
    () => new THREE.AnimationMixer(modelScene),
    [modelScene],
  );
  const cameraMixer = useMemo(
    () => new THREE.AnimationMixer(camScene),
    [camScene],
  );

  const modelActionsRef = useRef([]);
  const camActionsRef = useRef([]);
  const blenderCamRef = useRef(null);
  const camLightRef = useRef();
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

  useEffect(() => {
    applyCartoonStyle(modelScene);
  }, [modelScene]);

  useEffect(() => {
    camScene.updateMatrixWorld(true);
    camScene.traverse((obj) => {
      const name = String(obj.name || "").toLowerCase();
      if (!blenderCamRef.current && (obj.isCamera || name.includes("camera")))
        blenderCamRef.current = obj;
      if (
        !blenderTargetRef.current &&
        !obj.isCamera &&
        (name.includes("target") || name.includes("look"))
      ) {
        blenderTargetRef.current = obj;
      }
    });
  }, [camScene]);

  useEffect(() => {
    if (!modelAnims.length) return;
    modelActionsRef.current = modelAnims.map((clip) => {
      const action = modelMixer.clipAction(clip);
      action.reset().play();
      action.paused = true;
      return action;
    });
    return () => modelMixer.stopAllAction();
  }, [modelMixer, modelAnims]);

  useEffect(() => {
    if (!camAnims.length) return;
    camActionsRef.current = camAnims.map((clip) => {
      const action = cameraMixer.clipAction(clip);
      action.reset().play();
      action.paused = true;
      action.clampWhenFinished = true;
      return action;
    });
    return () => cameraMixer.stopAllAction();
  }, [cameraMixer, camAnims]);

  useFrame((state) => {
    // Flashlight effect
    if (directionalLightRef.current) {
      directionalLightRef.current.position.copy(state.camera.position);
    }

    if (modelActionsRef.current.length && modelDuration > 0) {
      const t = scrollProgress * modelDuration;
      modelActionsRef.current.forEach((action) => {
        action.time = clamp(t, 0, action.getClip().duration);
      });
      modelMixer.update(0);
    }

    const blenderCam = blenderCamRef.current;
    if (!blenderCam || !camActionsRef.current.length || camDuration <= 0)
      return;

    const t = clamp(scrollProgress * camDuration, 0, camDuration);
    camActionsRef.current.forEach((action) => {
      action.time = t;
    });
    cameraMixer.update(0);

    camScene.updateMatrixWorld(true);
    tmpCamPos.setFromMatrixPosition(blenderCam.matrixWorld);

    const blenderTarget = blenderTargetRef.current;
    if (blenderTarget) {
      tmpTargetPos.setFromMatrixPosition(blenderTarget.matrixWorld);
    } else {
      tmpTargetPos.set(0, 0, 0);
    }

    const offset = SCROLL_VISUAL_CONFIG.camera.distanceOffset;
    if (offset !== 0) {
      tmpDir.copy(tmpCamPos).sub(tmpTargetPos);
      if (tmpDir.lengthSq() > 0) {
        tmpDir.normalize();
        tmpCamPos.addScaledVector(tmpDir, offset);
      }
    }

    state.camera.position.copy(tmpCamPos);
    state.camera.position.y += SCROLL_VISUAL_CONFIG.camera.yOffset;
    if (camLightRef.current) {
      camLightRef.current.position.copy(state.camera.position);
    }

    if (blenderTarget) {
      state.camera.lookAt(tmpTargetPos);
    } else {
      blenderCam.getWorldQuaternion(tmpQuat);
      state.camera.quaternion.copy(tmpQuat);
    }

    if (blenderCam.fov) {
      const nextFov = SCROLL_VISUAL_CONFIG.camera.fov || blenderCam.fov;
      if (lastFovRef.current !== nextFov) {
        lastFovRef.current = nextFov;
        state.camera.fov = nextFov;
        state.camera.updateProjectionMatrix();
      }
    }
  });

  return (
    <>
      <ambientLight
        intensity={SCROLL_VISUAL_CONFIG.lighting.ambient.intensity}
        color={SCROLL_VISUAL_CONFIG.lighting.ambient.color}
      />

      <directionalLight
        ref={directionalLightRef}
        intensity={SCROLL_VISUAL_CONFIG.lighting.directional.intensity}
        color={SCROLL_VISUAL_CONFIG.lighting.directional.color}
        castShadow={false}
      />
      {SCROLL_VISUAL_CONFIG.lighting.topLight.enabled && (
        <directionalLight
          position={SCROLL_VISUAL_CONFIG.lighting.topLight.position}
          intensity={SCROLL_VISUAL_CONFIG.lighting.topLight.intensity}
          color={SCROLL_VISUAL_CONFIG.lighting.topLight.color}
        />
      )}
      <primitive object={modelScene} />
      <pointLight
        ref={camLightRef}
        intensity={80}
        distance={200}
        decay={0}
        color="#ffffff"
      />
    </>
  );
};
