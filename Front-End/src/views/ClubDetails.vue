<script setup>
import { ref, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useUserStore } from "../stores/userStore";
import { api } from "../helpers/api";
import EventCard from "../components/HomeEventCard.vue";
import NewsCard from "../components/HomeNewsCard.vue";
const route = useRoute();
const router = useRouter();
const userStore = useUserStore();

const details = ref({});
const join = ref(false);

await api.get(`/clubs/${route.params.clubID}`).then((res) => {
  if (res.status === 404) {
    router.replace({ name: "NotFound" });
  } else {
    details.value = res.data;
    if (userStore.loggedIn) {
      api
        .get(
          `/members/club/${details.value.clubID}/user/${userStore.user.userID}`
        )
        .then(({ data }) => {
          join.value = data.joined;
        });
    }
  }
});

let events = ref([]);
let news = ref([]);
async function getInfo() {
  await api.get(`/clubs/${route.params.clubID}/events`).then(({ data }) => {
    events.value = data;
  });

  await api.get(`/clubs/${route.params.clubID}/news`).then(({ data }) => {
    news.value = data;
  });
}
getInfo();

async function joinClub() {
  if (!userStore.loggedIn) {
    router.push("/login");
  } else {
    await api
      .post("/members", {
        clubID: details.value.clubID,
        userID: userStore.user.userID,
      })
      .then(() => {
        router.go();
      });
  }
}
</script>

<template>
  <a class="back" @click="$router.go(-1)"
    ><font-awesome-icon
      icon="fa-solid
    fa-chevron-left"
  /></a>
  <div class="mainContainer flex col align-center sm-col">
    <div class="container">
      <div class="detailsContainer flex justify-center">
        <img :src="details.logo" class="img" />
        <div class="clubDetails flex col">
          <div class="main">
            <h1>{{ details.name }}</h1>
            <h2>{{ details.short_name }}</h2>
            <h3>{{ details.category }}</h3>
            <h4>Total Members: {{ details.members }}</h4>
          </div>
          <p
            v-if="details.description"
            v-html="details.description"
            class="description"
          ></p>
          <div class="flex justify-between align-center">
            <div class="socialMedia">
              <a v-if="details.facebook" :href="details.facebook"
                ><font-awesome-icon icon="fa-brands fa-facebook"
              /></a>
              <a v-if="details.twitter" :href="details.twitter"
                ><font-awesome-icon icon="fa-brands fa-twitter"
              /></a>
              <a v-if="details.instagram" :href="details.instagram"
                ><font-awesome-icon icon="fa-brands fa-instagram"
              /></a>
              <a v-if="details.discord" :href="details.discord"
                ><font-awesome-icon icon="fa-brands fa-discord"
              /></a>
            </div>
            <button v-if="!join" class="joinButton" @click="joinClub">
              Join Club
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="clubRelated">
      <div class="column">
        <h2 class="subTitle">Announcements</h2>
        <div class="eventCards flex col">
          <h3 v-if="news.length <= 0">No news</h3>
          <NewsCard
            v-if="news.length > 0"
            class="newsCard"
            v-for="announce in news"
            v-bind="announce"
            inDetails
          />
        </div>
      </div>
      <div class="column">
        <h2 class="subTitle">Upcoming Events</h2>
        <div class="eventCards flex col">
          <h3 v-if="events.length <= 0">No events</h3>
          <EventCard
            v-if="events.length > 0"
            class="eventCard"
            v-for="event in events"
            v-bind="event"
            inDetails
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
a {
  color: black;
}
.back {
  color: black;
  cursor: pointer;
  position: absolute;
  left: 5%;
  top: 15%;
  font-size: 1.5em;
}

.subTitle {
  font-size: 25px;
  margin-bottom: 20px;
}
.clubRelated {
  display: grid;
  grid-template-columns: 1fr 1fr;
  margin-top: 50px;
  gap: 40px;
  width: 70%;
}
.newsCard {
  padding-bottom: 10px;
  margin-bottom: 10px;
}
.column {
  justify-self: center;
  border: black 2px solid;
  border-radius: 10px;
  width: 100%;
  height: 700px;
  padding: 20px 30px;
  overflow-y: scroll;
}

.container {
  text-align: left;
}

.detailsContainer {
  gap: 40px;
  margin-top: 40px;
  padding: 0 115px;
}

.img {
  width: 370px;
  height: 370px;
  border-radius: 10px;
}

.clubDetails {
  width: 55%;
}

.main {
  margin-bottom: 20px;
}

.description {
  text-align: justify;
  margin-bottom: 10px;
}

.description :deep(img) {
  width: 50%;
  height: auto;
}

.socialMedia {
  margin-top: 10px;
}

.socialMedia a {
  color: black;
  font-size: 1.75em;
  margin-right: 15px;
}

.joinButton {
  width: 50%;
}

.eventCards .eventCard:last-child {
  border: 0;
  margin: 0;
  padding: 0;
}

.eventCard {
  padding-bottom: 10px;
  margin-bottom: 10px;
  border-bottom: 1px solid black;
}

.eventCards {
  margin-top: 10px;
}
@media only screen and (max-width: 1000px) {
  .detailsContainer {
    flex-direction: column;
    align-items: center;
  }

  .clubDetails {
    width: 100%;
  }
  .back {
    left: 10%;
  }
}

@media only screen and (max-width: 1400px) {
  .sm-col {
    flex-direction: column;
  }

  .clubRelated {
    grid-template-columns: 1fr;
  }
}
</style>
