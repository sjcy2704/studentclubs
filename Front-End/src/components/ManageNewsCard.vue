<script setup>
import { api } from "../helpers/api";
import { ref } from "vue";
import { useRouter, useRoute } from "vue-router";

const router = useRouter();

const props = defineProps({
  newsID: Number,
  title: String,
  content: String,
  clubID: Number,
  posted: String,
  status: String,
  modelValue: Array,
});

const emits = defineEmits(["update:modelValue"]);

let date = ref();
date.value = new Date(props.posted).toLocaleDateString();

async function removeNews() {
  await api.post("/news/remove", { newsID: props.newsID }).then(() => {
    router.go();
  });
}
</script>

<template>
  <div class="userCard flex align-center">
    <div class="flex justify-between w-100 sm-col">
      <div class="userDetails">
        <h3>{{ props.title }}</h3>
        <div class="details flex">Date Posted: {{ date }}</div>
      </div>
      <div class="options flex align-center">
        <RouterLink
          :to="/clubs/ + props.clubID + /announcements/ + props.newsID"
        >
          View
          <font-awesome-icon icon="fa-solid fa-eye" />
        </RouterLink>
        <RouterLink
          :to="
            /clubs/ + props.clubID + /manage/ + 'announcements/' + props.newsID
          "
          >Edit <font-awesome-icon icon="fa-solid fa-pen-to-square"
        /></RouterLink>
        <a @click="removeNews"
          >Delete <font-awesome-icon icon="fa-solid fa-trash-can"
        /></a>
      </div>
    </div>
  </div>
</template>

<style scoped>
.details {
  gap: 40px;
}

.details span {
  font-weight: 500;
}
.userCard {
  padding: 20px 0;
  border-bottom: 2px solid black;
}

.userCard:first-child {
  padding-top: 0;
}

.userCard:last-child {
  border-bottom: 0;
}

.options {
  gap: 50px;
  padding: 10px 30px;
}

.options a {
  font-size: 1em;
  font-weight: 400;
}

@media only screen and (max-width: 800px) {
  .options {
    margin-top: 10px;
  }
  .sm-col {
    flex-direction: column;
  }
}

@media only screen and (max-width: 550px) {
  .options {
    padding: 0;
  }
}
</style>
