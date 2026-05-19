import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { useAnimations, useGLTF } from "@react-three/drei";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

const HERO_VISUAL_CONFIG = {
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

  transform: {
    position: [0, 0, 0],
    scale: [1, 1, 1],
    rotation: [0, 0, 0],
  },

  modelConfigs: [
    {
      key: "Burger_Menu_Empty",
      scale: [0.8, 0.8, 0.8],
      position: [5, -5, -50],
      rotation: [0.4, -2, 0],
    },
    {
      key: "Pizza_Menu_Empty",
      scale: [0.8, 0.8, 0.8],
      position: [5, -5, -50],
      rotation: [0.5, 0.2, 0],
    },
    {
      key: "Grand_Hot_Dog_Empty",
      scale: [0.8, 0.8, 0.8],
      position: [5, -15, -50],
      rotation: [0.2, 0.3, 0.1],
    },
  ],
};

export const HeroModels = ({ activeIndex, isStarting }) => {
  const groupRef = useRef(null);
  const rotationWrapperRef = useRef(null);
  const modelWrapperRef = useRef(null);
  const flashlightRef = useRef(null);
  const camLightRef = useRef(null);
  const displayedIndexRef = useRef(activeIndex);

  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const cameraPath = useMemo(() => {
    if (typeof window === "undefined") return "/three/slider_camera.glb";
    return window.innerWidth < 768
      ? "/three/slider_camera_mobile.glb"
      : "/three/slider_camera.glb";
  }, []);

  const { nodes, animations, scene } = useGLTF("/three/slider_model.glb");
  const { scene: cameraScene } = useGLTF(cameraPath);
  const { gl } = useThree();

  useLayoutEffect(() => {
    gl.toneMapping = THREE.NoToneMapping;
    gl.outputColorSpace = THREE.SRGBColorSpace;
    gl.shadowMap.enabled = false;
    gl.setPixelRatio(window.devicePixelRatio);
    gl.setClearColor(0x000000, 0);
  }, [gl]);

  useEffect(() => {
    const meshes = [];
    scene.traverse((child) => {
      if (child.isMesh && !child.userData.isOutline) meshes.push(child);
    });

    const { saturationBoost, brightnessBoost, outline } =
      HERO_VISUAL_CONFIG.materials;

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
  }, [scene]);

  // Animaciones de Entrada
  useGSAP(() => {
    const config = HERO_VISUAL_CONFIG.modelConfigs[activeIndex];
    const activeNode = nodes[config?.key];

    if (
      activeNode &&
      modelWrapperRef.current &&
      rotationWrapperRef.current &&
      groupRef.current
    ) {
      // Calcular el centro del nuevo modelo activo
      const currentPos = modelWrapperRef.current.position.clone();
      modelWrapperRef.current.position.set(0, 0, 0);
      modelWrapperRef.current.updateMatrixWorld(true);

      const box = new THREE.Box3().setFromObject(activeNode);
      const center = new THREE.Vector3();
      box.getCenter(center);
      modelWrapperRef.current.worldToLocal(center);

      // Restauramos posicion para que la animación fluya
      modelWrapperRef.current.position.copy(currentPos);

      const targetX = -center.x;
      const targetY = -center.y;
      const targetZ = -center.z;

      const g = groupRef.current;
      const baseScale = config.scale || [1, 1, 1];
      const scaleMultiplier = isMobile ? 0.65 : 1.0;
      const targetScale = baseScale.map((s) => s * scaleMultiplier);

      // Entrada inicial
      if (
        isStarting &&
        activeIndex === displayedIndexRef.current &&
        !g.userData.hasStarted
      ) {
        g.userData.hasStarted = true;

        // Centrado inicial inmediato
        modelWrapperRef.current.position.set(targetX, targetY, targetZ);
        rotationWrapperRef.current.position.set(
          ...(config.position || [0, 0, 0]),
        );
        if (config.rotation) {
          rotationWrapperRef.current.rotation.set(...config.rotation);
        }

        // Animación de aparición (de izquierda a derecha hacia el centro)
        gsap.fromTo(
          g.position,
          { x: -30, z: HERO_VISUAL_CONFIG.transform.position[2] },
          {
            x: HERO_VISUAL_CONFIG.transform.position[0],
            duration: 2.2,
            ease: "power3.out",
          },
        );
        gsap.fromTo(
          g.scale,
          { x: 0, y: 0, z: 0 },
          {
            x: targetScale[0],
            y: targetScale[1],
            z: targetScale[2],
            duration: 1.8,
            ease: "expo.out",
            delay: 0.2,
          },
        );
      }
      // Transición entre platillos (Sliding)
      else if (activeIndex !== displayedIndexRef.current) {
        displayedIndexRef.current = activeIndex;

        gsap.to(modelWrapperRef.current.position, {
          x: targetX,
          y: targetY,
          z: targetZ,
          duration: 1.2,
          ease: "power3.inOut",
        });

        gsap.to(rotationWrapperRef.current.position, {
          x: config.position?.[0] || 0,
          y: config.position?.[1] || 0,
          z: config.position?.[2] || 0,
          duration: 1.2,
          ease: "power3.inOut",
        });

        if (config.rotation) {
          gsap.to(rotationWrapperRef.current.rotation, {
            x: config.rotation[0],
            y: config.rotation[1],
            z: config.rotation[2],
            duration: 1.2,
            ease: "power3.inOut",
          });
        }

        gsap.to(g.scale, {
          x: targetScale[0],
          y: targetScale[1],
          z: targetScale[2],
          duration: 1.2,
          ease: "power3.inOut",
        });
      }
    }
  }, [activeIndex, isStarting, nodes, isMobile]);

  useEffect(() => {
    if (groupRef.current && groupRef.current.userData.hasStarted) {
      const config = HERO_VISUAL_CONFIG.modelConfigs[activeIndex];
      const baseScale = config.scale || [1, 1, 1];
      const scaleMultiplier = isMobile ? 0.65 : 1.0;
      gsap.to(groupRef.current.scale, {
        x: baseScale[0] * scaleMultiplier,
        y: baseScale[1] * scaleMultiplier,
        z: baseScale[2] * scaleMultiplier,
        duration: 0.5,
        ease: "power2.out",
      });
    }
  }, [isMobile, activeIndex]);

  const gltf = useGLTF("/three/slider_model.glb");
  const { ref: animRef, actions } = useAnimations(gltf.animations);

  useEffect(() => {
    console.log("--- DEEP ANIMATION SEARCH ---");
    console.log(
      "gltf.animations:",
      gltf.animations ? gltf.animations.length : 0,
    );
    console.log(
      "scene.animations:",
      scene.animations ? scene.animations.length : 0,
    );
    let count = 0;
    scene.traverse((child) => {
      if (child.animations && child.animations.length > 0) {
        count += child.animations.length;
        console.log(
          "Child '" + child.name + "' has animations:",
          child.animations.map((a) => a.name).join(", "),
        );
      }
    });
    console.log("Total child animations:", count);
  }, [scene]);
  useEffect(() => {
    if (actions) {
      Object.values(actions).forEach((action) => {
        if (action) {
          action.setLoop(THREE.LoopRepeat, Infinity);
          action.clampWhenFinished = false;
          action.reset().play();
        }
      });
    }
  }, [actions]);

  const blenderCamRef = useRef(null);
  const tmpQuat = useMemo(() => new THREE.Quaternion(), []);
  const lastFovRef = useRef(null);

  useEffect(() => {
    cameraScene.traverse((obj) => {
      if (obj.isCamera) blenderCamRef.current = obj;
    });
  }, [cameraScene]);

  useFrame((state) => {
    if (flashlightRef.current)
      flashlightRef.current.position.copy(state.camera.position);
    if (camLightRef.current)
      camLightRef.current.position.copy(state.camera.position);

    const blenderCam = blenderCamRef.current;
    if (blenderCam) {
      blenderCam.lookAt(0, 0, 0);
      blenderCam.updateMatrixWorld(true);
      state.camera.position.setFromMatrixPosition(blenderCam.matrixWorld);
      blenderCam.getWorldQuaternion(tmpQuat);
      state.camera.quaternion.copy(tmpQuat);

      if (blenderCam.fov) {
        const nextFov = blenderCam.fov;
        if (lastFovRef.current !== nextFov) {
          lastFovRef.current = nextFov;
          state.camera.fov = nextFov;
          state.camera.updateProjectionMatrix();
        }
      }
    }
  });

  return (
    <>
      <ambientLight
        intensity={HERO_VISUAL_CONFIG.lighting.ambient.intensity}
        color={HERO_VISUAL_CONFIG.lighting.ambient.color}
      />

      <directionalLight
        ref={flashlightRef}
        intensity={HERO_VISUAL_CONFIG.lighting.directional.intensity}
        color={HERO_VISUAL_CONFIG.lighting.directional.color}
        castShadow={HERO_VISUAL_CONFIG.lighting.directional.castShadow}
      />

      {HERO_VISUAL_CONFIG.lighting.topLight.enabled && (
        <directionalLight
          position={HERO_VISUAL_CONFIG.lighting.topLight.position}
          intensity={HERO_VISUAL_CONFIG.lighting.topLight.intensity}
          color={HERO_VISUAL_CONFIG.lighting.topLight.color}
        />
      )}

      <pointLight
        ref={camLightRef}
        intensity={80}
        distance={200}
        decay={0}
        color="#ffffff"
      />

      <group
        ref={groupRef}
        position={HERO_VISUAL_CONFIG.transform.position}
        rotation={HERO_VISUAL_CONFIG.transform.rotation}
      >
        <group ref={rotationWrapperRef}>
          <group ref={modelWrapperRef}>
            <primitive object={scene} ref={animRef} />
          </group>
        </group>
      </group>
    </>
  );
};

useGLTF.preload("/three/slider_model.glb");
useGLTF.preload("/three/slider_camera.glb");
useGLTF.preload("/three/slider_camera_mobile.glb");
