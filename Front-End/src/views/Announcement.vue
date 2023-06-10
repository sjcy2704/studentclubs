<script setup>
import { useRoute, useRouter } from "vue-router";
import { api } from "../helpers/api.js";
import { ref } from "vue";
import { useUserStore } from "../stores/userStore";

const userStore = useUserStore();
const route = useRoute();
const router = useRouter();

const news = ref([]);

await api.get(`/news/${route.params.newsID}`).then(({ data }) => {
  if (data[0].status === "private") {
    api
      .get(`/members/club/${data[0].clubID}/user/${userStore.user.userID}`)
      .then(({ data }) => {
        if (!data.joined && userStore.user.userType !== "admin") {
          router.push("/");
        }
      });
  }

  news.value = data[0];
});

let currDatePosted = ref("");
let currTimePosted = ref("");
let date = ref("");
date.value = new Date(news.value.posted);
let today = new Date(news.value.posted);

if (date.value.getDate() === today.getDate()) {
  currDatePosted.value = "Today";
} else {
  const day = date.value.getDate();
  const month = date.value.getMonth();
  const year = date.value.getFullYear();
  currDatePosted.value = `${month} ${day}, ${year}`;
}

const minutes = 30;
const ms = 1000 * 60 * minutes;

currTimePosted.value = new Date(
  Math.round(date.value.getTime() / ms) * ms
).toLocaleTimeString("en-AU", { hour: "2-digit", minute: "2-digit" });

let clubName = ref("");
await api.get(`/clubs/${news.value.clubID}`).then(({ data }) => {
  clubName.value = data.name;
});
</script>

<template>
  <a class="back" @click="$router.go(-1)"
    ><font-awesome-icon
      icon="fa-solid
    fa-chevron-left"
  /></a>
  <div class="mainContainer flex col align-center">
    <article class="announcementContainer">
      <div class="topDetails">
        <h1 class="clubName">{{ clubName }}</h1>
        <h2 class="title">{{ news.title }}</h2>
        <h3 class="posted">{{ currDatePosted }} - {{ currTimePosted }}</h3>
      </div>
      <div class="content" v-html="news.content"></div>
    </article>
  </div>
</template>

<style scoped>
img {
  width: 75%;
  height: auto;
}
.announcementContainer {
  width: 50%;
  padding: 30px;
}

.topDetails {
  margin-bottom: 30px;
}

.title {
  font-size: 2em;
}

.clubName {
  font-size: 1em;
}

.posted {
  font-size: 0.85em;
  font-weight: 500;
}
.content {
  text-align: justify;
}
.back {
  color: black;
  cursor: pointer;
  position: absolute;
  left: 7%;
  top: 15%;
  font-size: 1.5em;
}

@media only screen and (max-width: 1200px) {
  .announcementContainer {
    width: 75%;
  }
  .back {
    top: 13%;
  }
}

@media only screen and (max-width: 550px) {
  .announcementContainer {
    width: 100%;
  }

  .back {
    top: 11%;
    left: 5%;
  }
}
</style>
