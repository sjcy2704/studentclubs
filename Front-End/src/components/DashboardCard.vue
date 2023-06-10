<script setup>
defineProps(["label", "icon", "link"]);
</script>
<template>
  <RouterLink :to="link">
    <div class="card">
      <h2>{{ label }}</h2>
      <font-awesome-icon class="icon" :icon="icon" />
    </div>
  </RouterLink>
</template>

<style scoped>
a {
  color: black;
}

.card {
  position: relative;
  border: 2px solid black;
  border-radius: 10px;
  width: 300px;
  height: 180px;
  padding: 20px 30px;
}

.icon {
  position: absolute;
  font-size: 3.5em;
  bottom: 25px;
  right: 25px;
}
</style>
