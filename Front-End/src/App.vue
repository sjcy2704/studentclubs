<script setup>
import Navbar from "./components/Navbar.vue";
import Footer from "./components/Footer.vue";
</script>

<template>
  <Navbar />
  <main class="flex col align-center">
    <RouterView />
  </main>
  <Footer />
</template>
