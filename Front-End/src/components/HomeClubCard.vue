<script setup>
defineProps({
  clubID: Number,
  name: String,
  short_name: String,
  category: String,
  members: Number,
  logo: String,
});
</script>
<template>
  <RouterLink :to="/clubs/ + clubID" class="card">
    <img :src="logo" class="img" loading="lazy" />
    <div class="clubDetails flex col justify-between">
      <div class="name">
        <p class="clubName">{{ name }}</p>
        <p class="subName">{{ short_name }}</p>
      </div>
      <div class="subDetails flex justify-between">
        <p class="category">{{ category }}</p>
      </div>
    </div>
  </RouterLink>
</template>

<style scoped>
.card {
  width: 100%;
  display: grid;
  grid-template-columns: auto 1fr 1fr;
}

.img {
  border-radius: 5px;
  height: auto;
  width: 100%;
  max-width: 100px;
}

.clubDetails {
  text-align: left;
  grid-column: 2 / span 2;
  padding: 0px 20px;
}

.clubName {
  font-size: 1.15em;
}

.subName {
  font-size: 0.95em;
  margin-bottom: 5px;
}

.subDetails {
  width: 100%;
  font-size: 0.95em;
  font-weight: 400;
}

@media only screen and (max-width: 1430px) {
  .name {
    font-size: 0.9em;
  }
  .category {
    font-size: 0.9em;
  }
}

@media only screen and (max-width: 700px) {
  .membersCount {
    display: none;
  }
  .name {
    font-size: 0.8em;
  }
  .category {
    font-size: 0.8em;
  }
  .clubDetails {
    justify-content: start;
  }
}

@media only screen and (max-width: 550px) {
  .img {
    max-width: 80px;
  }
}
</style>
