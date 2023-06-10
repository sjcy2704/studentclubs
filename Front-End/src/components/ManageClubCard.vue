<script setup>
import { useRouter } from "vue-router";
import { api } from "../helpers/api";

const router = useRouter();
const props = defineProps({
  name: String,
  short_name: String,
  clubID: Number,
  logo: String,
});

async function removeClub() {
  await api.post("/clubs/remove", { clubID: props.clubID }).then(() => {
    router.go();
  });
}
</script>

<template>
  <div class="userCard flex align-center">
    <img :src="props.logo" class="profilePic" loading="lazy" />
    <div class="flex justify-between w-100 sm-col">
      <div class="userDetails">
        <h3>{{ props.name }}</h3>
        <p>Short Name: {{ props.short_name }}</p>
        <p>Club ID: {{ props.userID }}</p>
      </div>
      <div class="options flex align-center">
        <p>Edit <font-awesome-icon icon="fa-solid fa-pen-to-square" /></p>
        <a @click="removeClub"
          >Remove <font-awesome-icon icon="fa-solid fa-trash-can"
        /></a>
      </div>
    </div>
  </div>
</template>

<style scoped>
.userCard {
  padding: 20px 0;
  border-bottom: 2px solid black;
}

.userCard:first-child {
  padding-top: 0;
}

.userCard:last-child {
  border-bottom: 0;
  padding-bottom: 0;
}

.options {
  gap: 50px;
  padding: 10px 30px;
}

.options a {
  font-size: 1em;
  font-weight: 400;
}

.profilePic {
  width: 80px;
  height: 80px;
  background-color: black;
  margin-right: 20px;
}

@media only screen and (max-width: 550px) {
  .options {
    padding: 0;
  }
}
</style>
