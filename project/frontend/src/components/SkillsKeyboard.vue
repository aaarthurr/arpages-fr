<template>
  <div ref="canvasContainer" class="keyboard-container">

    <div class="text-overlay" :style="textStyle">
      <h2 class="title">MY SKILLS</h2>
    </div>


    <div class="right-title-zone" :style="textStyle">
      <transition name="fade" mode="out-in">
        <h2 :key="displayTitle.id" class="main-title">
          {{ displayTitle }}
        </h2>
      </transition>
      <p class="subtitle" :class="{ visible: !selectedSkill }">
        {{ selectedSkill ? '' : 'Scroll to explore • Click for details' }}
      </p>
    </div>

    <transition name="slide-right" mode="out-in">
      <div v-if="selectedSkill" :key="selectedSkill.id" class="left-detail-zone">

        <h1 class="selected-main-title">{{ selectedSkill.name }}</h1>
        
        <h3 class="detail-header">Skill Details</h3>
        
        <div class="description" v-html="selectedSkill.para"></div>

        <div class="level-container">
          <div class="level-label">Proficiency:</div>
          <div class="level-track">
            <div class="level-bar" :style="{ width: selectedSkill.lvl + '%', backgroundColor: hexToCss(selectedSkill.color) }"></div>
          </div>
        </div>

        <button class="more-btn" @click="openLink(selectedSkill.url)">
          View Projects <span class="arrow">→</span>
        </button>

        <div class="close-hint" @click="selectedSkill = null">× Close Details</div>

      </div>
    </transition>

  </div>
</template>

<script setup>
import { onMounted, onBeforeUnmount, ref, reactive, computed } from 'vue';
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { skillKeys } from '../script/skills.js';

const hoveredSkill = ref(null);   // Tracks hover
const selectedSkill = ref(null);  // Tracks click

const displayTitle = computed(() => {
  if (hoveredSkill.value) return hoveredSkill.value.name;
  return "MY SKILLS";
});

const hexToCss = (hex) => '#' + new THREE.Color(hex).getHexString();
const openLink = (url) => window.open(url, '_blank');

const canvasContainer = ref(null);
let scene, camera, renderer, animationId;
let keyboardGroup = new THREE.Group(); 
let keys = []; 
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
let mouseMoved = false;

// --- CONFIGURATION ---
const BASE_SCALE = 40; 
const SPACING = 0.80;  
const COLS = 5; 

// --- 🌊 IDLE WAVE VARIABLES (NEW) ---
let lastWaveTime = 0;
let nextWaveDelay = 3000; // First wave happens after 3 seconds
let isWaving = false;
let waveStartTime = 0;
const WAVE_DURATION = 1500; // How long the whole ripple lasts

// --- SCROLL ZONES ---
const ZONE_START = 200;        
const ZONE_STABLE_START = 500; 
const ZONE_STABLE_END = 1800;  
const ZONE_EXIT_END = 2200;    

// --- POSITIONS ---
const POS_HIDDEN_RIGHT = { x: 15, y: 0, z: 0.5, rotY: 0.5, rotZ: -0.2 }; 
const POS_STABLE_1     = { x: 5, y: 0, z: 1, rotY: -0.5, rotZ: -0.1 };  
const POS_STABLE_2     = { x: -4, y: 1, z: -1, rotY: 2, rotZ: 0.4 }; 
const POS_HIDDEN_LEFT  = { x: -15, y: 2, z: -2, rotY: 3, rotZ: 0.8 };

// --- ANIMATION TARGETS ---
let targetGroupX = POS_HIDDEN_RIGHT.x;
let targetGroupY = POS_HIDDEN_RIGHT.y; 
let targetGroupZ = POS_HIDDEN_RIGHT.z;
let targetGroupRotY = POS_HIDDEN_RIGHT.rotY;
let targetGroupRotZ = POS_HIDDEN_RIGHT.rotZ;

const textStyle = reactive({
  opacity: 0,
  transform: 'translateX(50px)', 
  transition: 'all 0.8s ease'    
});

// ... (createKeyTexture function remains exactly the same) ...
const createKeyTexture = (imageUrl, bgColorHex) => {
  const size = 512; 
  const canvas = document.createElement('canvas');
  canvas.width = size; canvas.height = size;
  const ctx = canvas.getContext('2d');
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.flipY = false;
  texture.center.set(0.5, 0.5);
  texture.rotation = Math.PI;
  texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
  const colorObj = new THREE.Color(bgColorHex);
  const brightness = (colorObj.r * 0.299) + (colorObj.g * 0.587) + (colorObj.b * 0.114);
  const logoColor = brightness > 0.5 ? '#000000' : '#FFFFFF';
  ctx.fillStyle = '#' + colorObj.getHexString();
  ctx.fillRect(0, 0, size, size);
  const img = new Image();
  img.crossOrigin = "anonymous";
  img.src = imageUrl;
  img.onload = () => {
    ctx.fillStyle = '#' + colorObj.getHexString();
    ctx.fillRect(0, 0, size, size);
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = size; tempCanvas.height = size;
    const tempCtx = tempCanvas.getContext('2d');
    const iconSize = size * 0.6; 
    const offset = (size - iconSize) / 2;
    tempCtx.drawImage(img, offset, offset, iconSize, iconSize);
    tempCtx.globalCompositeOperation = 'source-in';
    tempCtx.fillStyle = logoColor
    tempCtx.fillRect(0, 0, size, size);
    ctx.drawImage(tempCanvas, 0, 0);
    texture.needsUpdate = true;
  };
  return texture;
};

// ... (handleScroll remains same) ...
const handleScroll = () => {
  const currentY = window.scrollY;

  if (currentY < ZONE_START) {
    targetGroupX = POS_HIDDEN_RIGHT.x;
    targetGroupY = POS_HIDDEN_RIGHT.y;
    targetGroupZ = POS_HIDDEN_RIGHT.z;
    targetGroupRotY = POS_HIDDEN_RIGHT.rotY;
    targetGroupRotZ = POS_HIDDEN_RIGHT.rotZ;
  } 
  else if (currentY >= ZONE_START && currentY < ZONE_STABLE_START) {
    const progress = (currentY - ZONE_START) / (ZONE_STABLE_START - ZONE_START);
    targetGroupX = POS_HIDDEN_RIGHT.x + (POS_STABLE_1.x - POS_HIDDEN_RIGHT.x) * progress;
    targetGroupY = POS_HIDDEN_RIGHT.y + (POS_STABLE_1.y - POS_HIDDEN_RIGHT.y) * progress;
    targetGroupZ = POS_HIDDEN_RIGHT.z + (POS_STABLE_1.z - POS_HIDDEN_RIGHT.z) * progress;
    targetGroupRotY = POS_HIDDEN_RIGHT.rotY + (POS_STABLE_1.rotY - POS_HIDDEN_RIGHT.rotY) * progress;
    targetGroupRotZ = POS_HIDDEN_RIGHT.rotZ + (POS_STABLE_1.rotZ - POS_HIDDEN_RIGHT.rotZ) * progress;
  } 
  else if (currentY >= ZONE_STABLE_START && currentY < ZONE_STABLE_END) {
    const progress = (currentY - ZONE_STABLE_START) / (ZONE_STABLE_END - ZONE_STABLE_START);
    targetGroupX = POS_STABLE_1.x + (POS_STABLE_2.x - POS_STABLE_1.x) * progress;
    targetGroupY = POS_STABLE_1.y + (POS_STABLE_2.y - POS_STABLE_1.y) * progress;
    targetGroupZ = POS_STABLE_1.z + (POS_STABLE_2.z - POS_STABLE_1.z) * progress;
    targetGroupRotY = POS_STABLE_1.rotY + (POS_STABLE_2.rotY - POS_STABLE_1.rotY) * progress;
    targetGroupRotZ = POS_STABLE_1.rotZ + (POS_STABLE_2.rotZ - POS_STABLE_1.rotZ) * progress;
  } 
  else if (currentY >= ZONE_STABLE_END && currentY < ZONE_EXIT_END) {
    const progress = (currentY - ZONE_STABLE_END) / (ZONE_EXIT_END - ZONE_STABLE_END);
    targetGroupX = POS_STABLE_2.x + (POS_HIDDEN_LEFT.x - POS_STABLE_2.x) * progress;
    targetGroupY = POS_STABLE_2.y + (POS_HIDDEN_LEFT.y - POS_STABLE_2.y) * progress;
    targetGroupZ = POS_STABLE_2.z + (POS_HIDDEN_LEFT.z - POS_STABLE_2.z) * progress;
    targetGroupRotY = POS_STABLE_2.rotY + (POS_HIDDEN_LEFT.rotY - POS_STABLE_2.rotY) * progress;
    targetGroupRotZ = POS_STABLE_2.rotZ + (POS_HIDDEN_LEFT.rotZ - POS_STABLE_2.rotZ) * progress;
  } 
  else {
    targetGroupX = POS_HIDDEN_LEFT.x;
    targetGroupY = POS_HIDDEN_LEFT.y;
    targetGroupZ = POS_HIDDEN_LEFT.z;
    targetGroupRotY = POS_HIDDEN_LEFT.rotY;
    targetGroupRotZ = POS_HIDDEN_LEFT.rotZ;
  }

  if (currentY >= ZONE_STABLE_START && currentY < ZONE_STABLE_END) {
     textStyle.opacity = 1;
     textStyle.transform = 'translateX(0px)';
  } else {
     textStyle.opacity = 0;
     textStyle.transform = 'translateX(50px)';
  }
};

const initThreeJS = () => {
  // ... (Scene/Renderer setup same as before) ...
  scene = new THREE.Scene();
  const width = canvasContainer.value.clientWidth;
  const height = canvasContainer.value.clientHeight;
  
  camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
  camera.position.set(3, 6, 6); 
  camera.lookAt(0, -1.5, 0)

  renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: "high-performance", alpha: true });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  renderer.shadowMap.enabled = false; 
  canvasContainer.value.appendChild(renderer.domElement);

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
  scene.add(ambientLight);
  const dirLight = new THREE.DirectionalLight(0xffffff, 2.5);
  dirLight.position.set(5, 10, 5);
  scene.add(dirLight);

  scene.add(keyboardGroup);
  keyboardGroup.position.x = POS_HIDDEN_RIGHT.x; 
  keyboardGroup.rotation.y = POS_HIDDEN_RIGHT.rotY;
  keyboardGroup.rotation.z = POS_HIDDEN_RIGHT.rotZ;

  const loader = new GLTFLoader();
  loader.load('3d_assets/key_master.glb', (gltf) => {
    const masterMesh = gltf.scene;
    masterMesh.scale.set(BASE_SCALE, BASE_SCALE, BASE_SCALE);
    
    skillKeys.forEach((data, index) => {
      const keyInstance = masterMesh.clone();
      const col = index % COLS;
      const row = Math.floor(index / COLS);
      const totalRows = Math.ceil(skillKeys.length / COLS);
      const xOffset = (col - (COLS - 1) / 2) * SPACING;
      const zOffset = (row - (totalRows - 1) / 2) * SPACING;

      keyInstance.position.set(xOffset, 0, zOffset);
      
      const customTexture = createKeyTexture("skill_img/" + data.icon, data.color);
      const bodyMat = new THREE.MeshPhysicalMaterial({ color: data.color, roughness: 0.2, clearcoat: 0.5 });
      const topMat = new THREE.MeshPhysicalMaterial({ color: 0xffffff, map: customTexture, roughness: 0.2, clearcoat: 0.5 });

      keyInstance.traverse((node) => {
        if (node.isMesh) {
          const matName = node.material.name ? node.material.name.toLowerCase() : "";
          if (matName.includes('top')) node.material = topMat;
          else node.material = bodyMat;
        }
      });

      keyboardGroup.add(keyInstance);
      keys.push({ 
          data: data,
          mesh: keyInstance,
          currentScaleY: 1, 
          currentScaleXZ: 1, 
          currentPosY: 0, 
          isHovering: false, 
          isPressed: false 
      });
    });
    createChassis(skillKeys.length);
  });

  updateCameraAspect();
  handleScroll();
  animate();
};

const animate = () => {
  const currentY = window.scrollY;

  if (currentY < ZONE_START - 100 || currentY > ZONE_EXIT_END + 100) {
      animationId = requestAnimationFrame(animate);
      return; 
  }

  animationId = requestAnimationFrame(animate);

  // 1. Group Movement (Scroll)
  keyboardGroup.position.x += (targetGroupX - keyboardGroup.position.x) * 0.1;
  keyboardGroup.position.y += (targetGroupY - keyboardGroup.position.y) * 0.1; 
  keyboardGroup.position.z += (targetGroupZ - keyboardGroup.position.z) * 0.1;
  keyboardGroup.rotation.y += (targetGroupRotY - keyboardGroup.rotation.y) * 0.1;
  keyboardGroup.rotation.z += (targetGroupRotZ - keyboardGroup.rotation.z) * 0.1;

  const now = performance.now();
  
  // A. Check if it's time to start a wave
  if (!isWaving && now - lastWaveTime > nextWaveDelay) {
    isWaving = true;
    waveStartTime = now;
  }

  // B. Check if wave is finished
  if (isWaving && now - waveStartTime > WAVE_DURATION) {
    isWaving = false;
    lastWaveTime = now;
    // Set next wave for 1 to 5 seconds later
    nextWaveDelay = Math.random() * 4000 + 1000; 
  }
  let hoveredKey = null;
  if (mouseMoved) {
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(keyboardGroup.children, true);
      keys.forEach(k => k.isHovering = false);

      let foundHover = null;

      if (intersects.length > 0) {
          for (let i = 0; i < keys.length; i++) {
              let match = false;
              keys[i].mesh.traverse(child => {
                  if (child === intersects[0].object) match = true;
              });

              if (match) {
                  keys[i].isHovering = true;
                  hoveredKey = keys[i].mesh;
                  foundHover = keys[i].data;
                  break; 
              }
          }
      }

      hoveredSkill.value = foundHover;
      mouseMoved = false; 
  }

  // 3. Physics & Animation Loop
  keys.forEach((keyObj, index) => {
      let targetY = 1.0;
      let targetXZ = 1.0;
      let targetPosY = 0;

      // Determine Target State
      if (keyObj.isHovering) {
        // --- HOVER STATE (High Priority) ---
        if (keyObj.isPressed) {
            targetY = 0.6;
            targetXZ = 1.15;
            targetPosY = -0.1;
        } else {
            targetY = 1.1;
            targetXZ = 1.0;
            targetPosY = 0.2; // Lift Height
        }
      } else if (isWaving) {
         // --- 🌊 WAVE STATE (Low Priority) ---
         // Calculate wave based on column index (Left -> Right)
         const elapsed = now - waveStartTime;
         const col = index % COLS; // 0, 1, 2, 3, 4
         
         // Delay the start of the wave for each column (creates ripple)
         const waveDelay = col * 150; 
         const keyTime = elapsed - waveDelay;

         // If this key is currently inside the "Bump" timeframe (0 to 600ms)
         if (keyTime > 0 && keyTime < 600) {
             // Use Math.sin to create a smooth hump (0 -> 1 -> 0)
             // Map 0-600ms to 0-PI radians
             const angle = (keyTime / 600) * Math.PI;
             const waveHeight = Math.sin(angle) * 0.4; // Amplitude
             targetPosY = waveHeight;
         }
      }

      // Smoothly Lerp to Target
      keyObj.currentScaleY += (targetY - keyObj.currentScaleY) * 0.2;
      keyObj.currentScaleXZ += (targetXZ - keyObj.currentScaleXZ) * 0.2;
      keyObj.currentPosY += (targetPosY - keyObj.currentPosY) * 0.2;

      // Apply to Mesh
      keyObj.mesh.scale.set(
        BASE_SCALE * keyObj.currentScaleXZ, 
        BASE_SCALE * keyObj.currentScaleY, 
        BASE_SCALE * keyObj.currentScaleXZ
      );
      keyObj.mesh.position.y = keyObj.currentPosY;
  });

  document.body.style.cursor = hoveredKey ? 'pointer' : 'default';
  renderer.render(scene, camera);
};

// ... (Rest of events, onMounted, createChassis, updateCameraAspect same as before) ...
const onMouseMove = (event) => {
  const rect = canvasContainer.value.getBoundingClientRect();
  mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
  mouseMoved = true; 
};
const onMouseDown = () => { keys.forEach(k => { if(k.isHovering) k.isPressed = true; mouseMoved = true; }); };


const onMouseUp = () => {
  keys.forEach(k => {
    if(k.isPressed && k.isHovering) {
      selectedSkill.value = k.data;
    }
    k.isPressed = false;
    mouseMoved = true;
  });
};
const onResize = () => { updateCameraAspect(); };

const createChassis = (totalKeys) => {
    const ROWS = Math.ceil(totalKeys / COLS);
    const boardWidth = COLS * SPACING; 
    const boardHeight = ROWS * SPACING;
    const padding = 0.4; 
    const geometry = new RoundedBoxGeometry(boardWidth + padding, 0.4, boardHeight + padding, 4, 0.1);
    const material = new THREE.MeshPhysicalMaterial({ color: 0x111111, roughness: 0.4, clearcoat: 0.0 });
    const chassisMesh = new THREE.Mesh(geometry, material);
    chassisMesh.position.y = -0.5; 
    keyboardGroup.add(chassisMesh);
};

onMounted(() => {
  initThreeJS();
  window.addEventListener('resize', onResize);
  window.addEventListener('mousemove', onMouseMove);
  window.addEventListener('mousedown', onMouseDown);
  window.addEventListener('mouseup', onMouseUp);
  window.addEventListener('scroll', handleScroll);
});

onBeforeUnmount(() => {
  cancelAnimationFrame(animationId);
  window.removeEventListener('resize', onResize);
  window.removeEventListener('mousemove', onMouseMove);
  window.removeEventListener('mousedown', onMouseDown);
  window.removeEventListener('mouseup', onMouseUp);
  window.removeEventListener('scroll', handleScroll);
  renderer.dispose();
});

const updateCameraAspect = () => {
  if (!canvasContainer.value || !camera) return;
  const width = canvasContainer.value.clientWidth;
  const height = canvasContainer.value.clientHeight;
  camera.aspect = width / height;
  const targetAspect = 1.6; 
  const baseFOV = 45;
  if (camera.aspect < targetAspect) {
    const tanFOV = Math.tan(((Math.PI / 180) * baseFOV) / 2);
    const newFOV = (360 / Math.PI) * Math.atan(tanFOV * (targetAspect / camera.aspect));
    camera.fov = newFOV;
  } else {
    camera.fov = baseFOV;
  }
  camera.updateProjectionMatrix();
  renderer.setSize(width, height);
};
</script>

<style scoped>
.keyboard-container {
  width: 110%;

  transform: translateX(-5%);
  
  height: 60vh; 
  min-height: 700px; 

  position: sticky;
  top: 10vh;
  
  z-index: 10;
  pointer-events: auto;
}


.text-overlay {
  position: absolute;
  right: 10%; /* Adjust horizontal alignment */
  
  text-align: right; /* Aligns text to the right side */
  z-index: 10;       /* Ensures it sits ON TOP of the 3D canvas */
  pointer-events: none; /* Allows you to click keys "under" the text area */
}

.title {
	font-family: 'Montserrat', serif;
	font-weight: 100;
	font-size: 2rem;
  font-size: 3rem;
  color: #ffffff;
  margin: 0;
  letter-spacing: -1px;
}

.subtitle {
  font-size: 1.2rem;
  color: #666;
  font-weight: 400;
  margin-top: 10px;
  min-height: 1.5em; /* Prevents jumping if text is empty */
}


/* --- ➡️ right ZONE: TITLE --- */
.right-title-zone {
  position: absolute;
  top: 15%;
  right: 10%; /* Right Side */
  text-align: right;
  z-index: 20;
  pointer-events: none;
}

.main-title {
  font-family: 'Montserrat', sans-serif;
  font-weight: 800;
  font-size: 3.5rem;
  color: #fff;
  margin: 0;
  text-transform: uppercase;
  text-shadow: 0 4px 10px rgba(0,0,0,0.3);
  letter-spacing: -2px;
}

.subtitle {
  color: #888;
  font-size: 1rem;
  margin-top: 10px;
  opacity: 0;
  transition: opacity 0.5s;
}
.subtitle.visible { opacity: 1; }

/* --- ⬅️ LEFT ZONE: DETAILS --- */

.selected-main-title {
  font-family: 'Montserrat', sans-serif;
  font-weight: 900;
  font-size: 4rem; /* Very Big */
  color: #fff;
  margin: 0 0 20px 0; /* Spacing below title */
  text-transform: uppercase;
  line-height: 1;
  text-shadow: 0 4px 20px rgba(0,0,0,0.5);
}


.left-detail-zone {
  position: absolute;
  top: 20%;
  left: 10%; /* Left Side */
  width: 320px;
  text-align: left;
  z-index: 30;
  pointer-events: auto; /* Clickable */
}

.detail-header {
  font-size: 0.9rem;
  text-transform: uppercase;
  color: #666;
  margin-bottom: 1rem;
  letter-spacing: 2px;
}

.description {
  color: #eee;
  font-family: 'Inter', sans-serif;
  font-size: 1rem;
  line-height: 1.6;
  margin-bottom: 1.5rem;
  background: rgba(0,0,0,0.5);
  padding: 20px;
  border-radius: 12px;
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255,255,255,0.1);
  box-shadow: 0 0px 15px rgba(255, 255, 255, 0.3);
  height: 200px;
  width: 400px;
}

/* --- BAR STYLES --- */
.level-container { margin-bottom: 2rem; padding: 0 5px; }
.level-label { font-size: 0.8rem; color: #aaa; margin-bottom: 8px; }
.level-track {
  width: 100%; height: 8px; background: rgba(255,255,255,0.1);
  border-radius: 10px; overflow: hidden;
}
.level-bar { height: 100%; border-radius: 10px; transition: width 1s cubic-bezier(0.22, 1, 0.36, 1); }

/* --- BUTTONS --- */
.more-btn {
	background: rgba(255, 255, 255, 0.01);
	border: 2px solid rgba(255, 255, 255, 0.7);
	box-shadow: inset 0 0 10px rgba(255, 255, 255, 0.5);
	border-radius: 500px;
	padding: 20px 40px;
	transition: background-color 0.5s ease, transform 0.5s ease;
	font-size: 1rem;
	cursor: pointer;
	color: var(--text);
}
.more-btn:hover { 
	background-color: rgba(255, 255, 255, 0.1);
	transform: scale(1.05);
}
.close-hint {
  margin-top: 15px; color: #727272; font-size: 0.9rem; cursor: pointer; text-decoration: underline;
}

/* --- ANIMATIONS --- */
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

.slide-right-enter-active { transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1); }
.slide-right-leave-active { transition: all 0.3s ease-in; }
.slide-right-enter-from, .slide-right-leave-to { opacity: 0; transform: translateX(-30px); }
</style>