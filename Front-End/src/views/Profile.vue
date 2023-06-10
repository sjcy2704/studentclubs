<script setup>
import { useUserStore } from "../stores/userStore";
import { ref } from "vue";
import NewsCard from "../components/HomeNewsCard.vue";
import EventCard from "../components/HomeEventCard.vue";
import { api } from "../helpers/api";

const userStore = useUserStore();

const news = ref([]);
const events = ref([]);
async function getInfo() {
  const path = `/users/${userStore.user.userID}`;
  await api.get(`${path}/news`).then(({ data }) => {
    news.value = data;
  });

  await api.get(`${path}/rsvp`).then(({ data }) => {
    events.value = data;
  });
}

getInfo();
</script>
<template>
  <div class="mainContainer w-100 align-center col flex">
    <div class="container flex sm-col">
      <div class="avatarContainer">
        <img class="avatar" :src="userStore.user.avatar" />
      </div>
      <div class="profileContainer">
        <div>
          <h1 class="name">
            {{ userStore.user.firstName + " " + userStore.user.familyName }}
          </h1>
          <h2 class="username">{{ userStore.user.username }}</h2>
          <p>{{ userStore.user.email }}</p>
        </div>
        <RouterLink to="/profile/settings"
          ><div class="settingsButton">Settings</div>
        </RouterLink>
      </div>
    </div>
    <div class="clubRelated">
      <div class="column">
        <h2 class="subTitle">My Clubs Announcements</h2>
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
        <h2 class="subTitle">RSVP'd Events</h2>
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
.avatarContainer {
  max-width: 300px;
}

.profileContainer {
  margin-left: 40px;
}

.avatar {
  width: 100%;
  height: auto;
}

.settingsButton {
  color: white;
  background-color: black;
  padding: 10px 20px;
  border-radius: 8px;
  margin-top: 10px;
  text-align: center;
}

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
