<template>
  <div id="app">
    <!-- ✅ BIND CLASS: 'header-active' is true when mouse is at top -->
    <header 
      class="site-header" 
      :class="{ 'header-active': isMouseAtTop }"
      :style="{ transform: `translateY(${finalHeaderOffset}px)` }"
    >
      <div class="site-header-left">
        <h1 class="site-title">Arpages.fr</h1>
      </div>
      <div class="site-header-center">
        <button class="header-button">About me</button>
        <router-link to="/home" class="header-button">Home</router-link>
        <div class="dropdown">
          <button class="header-button dropdown-btn">More</button>
          <div class="dropdown-content">
            <router-link to="/idle_rand" class="dropdown-item">Idle_rand </router-link>
            <router-link to="/test" class="dropdown-item">Test</router-link>
          </div>
        </div>
      </div>
      <div class="site-header-right">
        <button id="theme-button" class="theme-button" onclick="change_theme()">
          <span class="material-symbols-outlined" id="theme-icon">light_mode</span>
        </button>		  
      </div>
  </header>

    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      scrollOffset: 0, 
      isMouseAtTop: false 
    }
  },
  computed: {
    finalHeaderOffset() {
      // If mouse is at top, show header (0px)
      if (this.isMouseAtTop) {
        return 0;
      }
      return this.scrollOffset;
    }
  },
  mounted() {
    this.initializeTheme();
    window.addEventListener('mousemove', this.trackMouse);
    window.addEventListener('scroll', this.handleScroll);
  },
  beforeUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
    window.removeEventListener('mousemove', this.trackMouse);
  },
  methods: {
    handleScroll() {
      const scrollY = window.scrollY;
      const scrollThreshold = 170; 
      const maxOffset = 70; 

      if (scrollY <= scrollThreshold) {
        this.scrollOffset = - (scrollY * (maxOffset / scrollThreshold));
      } else {
        this.scrollOffset = -maxOffset;
      }
    },

    trackMouse(event) {
      if (event.clientY < 100) {
        this.isMouseAtTop = true;
      } else {
        this.isMouseAtTop = false;
      }
    },

    initializeTheme() {
      const savedTheme = localStorage.getItem("theme");
      const body = document.body;
      const app = document.getElementById("app");

      if (savedTheme === "light") {
        body.classList.add("light-theme");
        app.classList.add("light-theme");
      } else {
        body.classList.add("dark-theme");
        app.classList.add("dark-theme");
      }
    }
  }
}
</script>

<style>
/* Import theme variables */
@import './assets/home_theme.css';

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body {
  height: 100%;
  width: 100%;
  margin: 0;
  padding: 0;
}

#app {
  background-color: var(--background);
  color: var(--text);
  min-height: 100vh;
  width: 100vw;
  position: relative;
  transition: background-color 200ms ease-in-out, color 200ms ease-in-out;

  padding-top: 40px; 
}

.site-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 2rem;
  text-align: center;
  
  position: fixed !important;
  top: 0;
  left: 0;
  width: 100%; 
  height: 80px; 
  z-index: 1000; 

  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px;

  transition: 
    transform 0.3s cubic-bezier(0.25, 0.8, 0.5, 1), 
    background-color 0.3s ease, 
    backdrop-filter 0.3s ease;
  will-change: transform;

  background-color: transparent;
}

/* ✅ COMBINED HOVER & ACTIVE STATE */
/* Applies when hovering OR when programmatically active via mouse tracking */
.site-header:hover,
.site-header.header-active {
  background-color: rgba(0, 0, 0, 0.2); 
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);

  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
}

.site-header-left {
  flex: 1;
  display: flex;
  justify-content: flex-start;
}

.site-header-center {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%; 
}

.site-header-right {
  flex: 1;
  display: flex;
  justify-content: flex-end;
}

.header-button {
  appearance: none;
  margin-left: 15px;
  margin-right: 15px;
  width: 105px;
  font-size: 1.3rem;
  background-color: transparent;
  border: none;
  font-family: 'Montserrat', serif;
  font-weight: 400;
  color: var(--text);
  text-decoration: none;
  display: inline-block;
  cursor: pointer;
  transition: transform 0.2s, color 0.2s;
} 

.header-button:hover {
  transform: scale(1.1);
  color: var(--primary);
}

/* --- DROPDOWN FIXES --- */
.dropdown {
  position: relative;
  display: flex; 
  align-items: center;
  height: 100%; 
}

.dropdown-content {
  display: none;
  position: absolute;
  background-color: var(--background);
  min-width: 160px;
  box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.3);
  z-index: 2000;
  border: 1px solid var(--primary);
  border-radius: 4px;
  
  top: 85%; 
  left: 50%;
  transform: translateX(-50%);
}

.dropdown-content::before {
  content: "";
  position: absolute;
  top: -10px; 
  left: 0;
  width: 100%;
  height: 10px; 
  background: transparent; 
}

.dropdown:hover .dropdown-content {
  display: block;
}

.dropdown-item {
  color: var(--text);
  padding: 12px 16px;
  text-decoration: none;
  display: block;
  font-family: 'Montserrat', serif;
  transition: background-color 0.2s;
}

.dropdown-item:hover {
  background-color: var(--primary);
  color: var(--background);
}

.theme-button {
  border: none;
  background-color: transparent;
  color: var(--text);
  cursor: pointer;
}

.theme-button:hover {
  transform: scale(1.05);
  color: var(--primary);
}

.theme-button .material-symbols-outlined {
  font-size: 32px;
}

@keyframes rotate-icon {
  0% { transform: rotate(0deg); opacity: 1; }
  50% { transform: rotate(180deg); opacity: 0; }
  100% { transform: rotate(360deg); opacity: 1; }
}

.rotate {
  animation: rotate-icon 0.4s ease-in-out;
}
</style>