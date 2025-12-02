<template>
<div class="home-container">
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

  <!-- Dynamic shooting stars container -->
  <div class="stars" id="stars"></div>

  <main class="site-main">

	<div intro class="hero-section">
		<section class="intro-text-section">
		<p class="intro-text" id="catchphrase">Achieving greatness is not about luck.</p>
		</section>
		<section class="main-button-section">
			<button class="liquid_glass_discovery_button" @click="scrollToContent">Discorver</button>
		</section>
	</div>



	<section class="post-section" id="content-section">
		<h2 class="section-title">Latest Work</h2>
		
		<div class="posts-grid">
			<article class="glass-card">
				<div class="card-image">
					<img src="../assets/mango.jpeg" alt="Project Image">
				</div>
				<div class="card-content">
					<span class="card-tag">Portfolio</span>
					<h3>Project Alpha</h3>
					<p>A deep dive into modern web aesthetics using Vue.js and dynamic animations.</p>
					<a href="#" class="card-link">Read More &rarr;</a>
				</div>
			</article>

			<article class="glass-card">
				<div class="card-image">
					<img src="https://picsum.photos/600/400?grayscale" alt="Placeholder">
				</div>
				<div class="card-content">
					<span class="card-tag">Design</span>
					<h3>Creative Flow</h3>
					<p>Exploring the boundaries of CSS animations and liquid interfaces.</p>
					<a href="#" class="card-link">Read More &rarr;</a>
				</div>
			</article>
		</div>
	</section>
  </main>

  <footer class="site-footer">
    <p class="footer-text">© 2025 Arthur Pages</p>
  </footer>
</div>

</template>

<script>
import '../assets/home_style.css' // ✅ Page-specific CSS
import '../assets/home_theme.css' // ✅ Page-specific CSS
import {select_random_catchphrase, initializeTextAnimation, initializeTheme, scrollToContent } from '../script/home.js' // ✅ Import functions

export default {
  name: 'Home',
  methods: {
	scrollToContent
  },
  mounted() {
    // Initialize the home page functionality when component is mounted
	select_random_catchphrase();
    initializeTextAnimation();
    initializeTheme();
  }
}
</script>

