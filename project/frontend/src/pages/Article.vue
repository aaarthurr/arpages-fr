<template>
  <div class="home-container">
    <!-- Reuse the background sky from Home -->
    <div class="background">
      <div class="sky">
        <div class="sky_parts sides"></div>
        <div class="sky_parts"></div>
        <div class="sky_parts"></div>
        <div class="sky_parts"></div>
        <div class="sky_parts"></div>
        <div class="sky_parts"></div>
        <div class="sky_parts"></div>
        <div class="sky_parts"></div>
        <div class="sky_parts"></div>
        <div class="sky_parts sides"></div>
      </div>
    </div>

    <!-- Main Content -->
    <main class="site-main article-layout">
      <!-- Loading State -->
      <div v-if="!article" class="loading-state">
        <h1 class="intro-text">Article not found...</h1>
        <router-link to="/home" class="liquid_glass_discovery_button">Go Back</router-link>
      </div>

      <!-- Article Content -->
      <div v-else class="glass-card article-card">
        <div class="article-header">
          <span class="card-tag">{{ article.tag }}</span>
          <h1 class="section-title">{{ article.title }}</h1>
        </div>

        <div class="card-image article-image">
          <!-- We use dynamic binding for the image source -->
          <!-- Note: For local assets in Vite, complex dynamic paths can be tricky. 
               For now, we assume simple paths or external URLs. -->
          <img :src="article.image" :alt="article.title">
        </div>

        <div class="article-content">
          <p class="intro-text" style="font-size: 1.5rem; width: 100%;">{{ article.description }}</p>
          <hr class="article-divider">
          <!-- We use v-html if you want to render HTML content, or just {{ }} for text -->
          <div class="article-body" v-html="article.content"></div>
        </div>
        
        <div class="article-footer">
           <router-link to="/home" class="card-link">&larr; Back to Home</router-link>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import '../assets/home_style.css'
import '../assets/home_theme.css'

import img42Perpi from '../assets/42_perpi.jpg'

export default {
  name: 'ArticlePage',
  data() {
    return {
      article: null
    }
  },
  mounted() {
    // 1. Get the "id" from the URL (e.g., 'project-alpha')
    const articleId = this.$route.params.id;
    
    // 2. Fetch the content (Simulated)
    this.fetchArticle(articleId);
  },
  methods: {
    fetchArticle(id) {
      // --- MOCK DATABASE (Replace this with a real API fetch later) ---
      const articlesDB = {
        'Ecole-42': {
          title: "Ecole 42",
          tag: "Education",
          image: img42Perpi, // Placeholder
          description: "My journey at Ecole 42, from the piscine to internship and specialisation.",
          content: `
            <p>The école 42 is a french computer science school known for its innovative peer-to-peer learning approach.</p>
            <p>42 school have been deployed around the world, from Korea to Brasil. And mutliple schools in France, I personnaly attended 42 Perpignan, in south of France</p>
            <br>
            <h3>The Piscine</h3>
            <p>To join 42, every student must complete the Piscine. A rigorous 4-week intensive coding bootcamp designed to test endurance and problem-solving skills.</p>
            <p>I started the piscine, and learned C there, not knowing anybody, being far from my home, and unsure of my future. But 4 weeks later i validated the piscine and was decided to join.</p>
            <br>
            <p>One of the biggest challenges was performance. Animating box-shadows is expensive, so I had to optimize using <code>transform</code> and <code>opacity</code>.</p>
          `
        },
        'creative-flow': {
          title: "Creative Flow",
          tag: "Design",
          image: "https://picsum.photos/800/400?blur",
          description: "Exploring the boundaries of CSS animations and liquid interfaces.",
          content: `
            <p>Liquids in web design are hard. Usually, we rely on WebGL or heavy canvas libraries.</p>
            <p>For this project, I tried to achieve a "liquid" feel using only CSS filters, specifically the gooey effect using contrast and blur.</p>
          `
        }
      };

      // 3. Set the data
      if (articlesDB[id]) {
        this.article = articlesDB[id];
      }
    }
  }
}
</script>

<style scoped>
/* Specific overrides for the article page */
.article-layout {
  display: flex;
  justify-content: center;
  padding-top: 100px; /* Space for fixed header */
  min-height: 100vh;
}

.article-card {
  width: 100%;
  max-width: 900px;
  padding: 0; /* Let image touch edges */
  background: rgba(255, 255, 255, 0.05); /* Slightly darker for readability */
}

.article-header {
  padding: 3rem 3rem 1rem 3rem;
}

.article-image {
  height: 400px;
  width: 100%;
  border-left: none;
  border-right: none;
}

.article-content {
  padding: 3rem;
  line-height: 1.8;
  font-family: 'Montserrat', sans-serif;
}

.article-divider {
  border: 0;
  height: 1px;
  background: rgba(255, 255, 255, 0.2);
  margin: 2rem 0;
}

.article-body {
  font-size: 1.1rem;
  color: var(--text);
  opacity: 0.9;
}

.article-footer {
  padding: 2rem 3rem;
  background: rgba(0,0,0,0.1);
  display: flex;
  justify-content: space-between;
}
</style>