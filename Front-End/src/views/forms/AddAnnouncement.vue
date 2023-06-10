<script setup>
import Input from "../../components/Input.vue";
import { reactive, ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import { QuillEditor } from "@vueup/vue-quill";
import "@vueup/vue-quill/dist/vue-quill.snow.css";
import { api } from "../../helpers/api";

const route = useRoute();

let newsDetails = reactive({
  title: "",
  content: "",
  status: "public",
  clubID: route.params.clubID,
});

let update = ref(false);

if (route.params.newsID) {
  update.value = true;
  await api.get(`/news/${route.params.newsID}`).then(({ data }) => {
    newsDetails = reactive(data[0]);
  });
}

const visibility = ref([
  { name: "Public", value: "public" },
  { name: "Private", value: "private" },
]);

const router = useRouter();

async function addNews() {
  let path = "/news";
  if (update.value) {
    path = "/news/update";
  }
  await api.post(path, newsDetails).then(() => router.go(-1));
}
</script>

<template>
  <a class="back" @click="$router.go(-1)"
    ><font-awesome-icon
      icon="fa-solid
    fa-chevron-left"
  /></a>
  <div class="mainContainer flex col align-center">
    <div class="container">
      <p class="title">
        {{ update ? "Edit Announcement" : "Add Announcement" }}
      </p>
    </div>
    <form class="lsgForm registerForm" v-on:submit.prevent="addNews">
      <Input label="Title" v-model="newsDetails.title" required="true" />
      <p class="category">Status</p>
      <select class="categorySelect" v-model="newsDetails.status" required>
        <option v-for="status in visibility" :value="status.value">
          {{ status.name }}
        </option>
      </select>
      <p class="descLabel">Content</p>
      <QuillEditor v-model:content="newsDetails.content" contentType="html" />
      <button type="submit">
        {{ update ? "Update Announcement" : "Create Announcement" }}
      </button>
    </form>
  </div>
</template>

<style scoped>
.descLabel {
  margin-top: 10px;
}

.registerForm {
  max-width: 500px;
}
.title {
  font-size: 2.3em;
}
.title span {
  display: block;
  font-size: 0.55em;
  font-weight: 400;
}

.back {
  color: black;
  cursor: pointer;
  position: absolute;
  left: 10%;
  top: 15%;
  font-size: 1.5em;
}

.categorySelect {
  font-size: 1.15em;
  margin-bottom: 15px;
}

.category {
  margin-top: 10px;
}
</style>
