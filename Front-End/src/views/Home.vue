<script setup>
import ClubCard from "../components/HomeClubCard.vue";
import EventCard from "../components/HomeEventCard.vue";
import NewsCard from "../components/HomeNewsCard.vue";
import { useUserStore } from "../stores/userStore";

import { ref } from "vue";
import { api } from "../helpers/api";

const userStore = useUserStore();

let clubs = ref([]);
let events = ref([]);
let news = ref([]);

async function getInfo() {
  await api.get("/news").then(({ data }) => {
    if (userStore.loggedIn) {
      data.forEach(async (announce) => {
        await api
          .get(`/members/club/${announce.clubID}/user/${userStore.user.userID}`)
          .then(({ data }) => {
            if (data.joined && announce.status === "private") {
              news.value.push(announce);
            }
            if (announce.status === "public") {
              news.value.push(announce);
            }
          });
      });
    } else {
      news.value = data.filter((announce) => announce.status === "public");
    }
  });

  await api.get("/clubs/top").then(({ data }) => {
    clubs.value = data.splice(0, 10);
  });

  await api.get("/events").then(({ data }) => {
    events.value = data;
  });
}
getInfo();
</script>

<template>
  <div class="mainContainer flex col align-center w-100">
    <div class="container">
      <div class="title">
        <span>Welcome to</span>
        Uni Clubs
      </div>
    </div>

    <div class="news">
      <h2 class="subTitle">News</h2>
      <div class="eventCards flex col">
        <h3 v-if="news.length <= 0">No news</h3>
        <NewsCard
          v-if="news.length > 0"
          class="newsCard"
          v-for="announce in news"
          v-bind="announce"
        />
      </div>
    </div>

    <div class="clubRelated flex sm-col m-col">
      <div class="clubs">
        <div class="titleContainer flex justify-between align-center">
          <RouterLink to="/clubs">
            <h2 class="subTitle">Top Clubs</h2>
          </RouterLink>
          <RouterLink to="/clubs"> <h4>See All Clubs</h4> </RouterLink>
        </div>

        <div class="clubCards flex col">
          <ClubCard
            v-if="clubs.length > 0"
            class="clubCard"
            v-for="club in clubs"
            v-bind="club"
          />
          <h3 v-if="clubs.length <= 0">No Clubs</h3>
        </div>
      </div>
      <div class="clubs">
        <h2 class="subTitle">Upcoming Events</h2>
        <div class="eventCards flex col">
          <h3 v-if="events.length <= 0">No events</h3>
          <EventCard
            v-if="events.length > 0"
            class="eventCard"
            v-for="event in events"
            v-bind="event"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
a {
  color: inherit;
}
.title span {
  font-size: 0.7em;
  display: block;
}
.title {
  font-size: 4em;
}

.titleContainer {
  margin-bottom: 20px;
}

.subTitle {
  font-size: 25px;
}

.clubCard {
  box-sizing: unset;
  padding-bottom: 10px;
  margin-bottom: 10px;
  border-bottom: 1px solid black;
}

.newsCard {
  padding-bottom: 10px;
  margin-bottom: 10px;
}
.eventCard {
  padding-bottom: 10px;
  margin-bottom: 10px;
  border-bottom: 1px solid black;
}

.eventCards .eventCard:last-child,
.clubCards .clubCard:last-child {
  border: 0;
  margin: 0;
  padding: 0;
}

.reDiv {
  font-size: 20px;
}

.news {
  border: black 2px solid;
  border-radius: 10px;
  width: 75%;
  height: 600px;
  padding: 20px 30px;
}

.clubRelated {
  width: 75%;
  gap: 20px;
  margin-top: 20px;
}

.clubs {
  border: black 2px solid;
  border-radius: 10px;
  width: 50%;
  height: 550px;
  padding: 20px 30px;
  overflow-y: scroll;
}

.clubs::-webkit-scrollbar {
  display: none;
}

.eventCards {
  margin-top: 10px;
}

@media only screen and (max-width: 1024px) {
  .clubs {
    width: 100%;
  }
  .eventsCards {
    width: 100%;
    padding: 0;
  }

  .rvspBlack {
    width: 100%;
  }
  .rvspWhite {
    width: 100%;
  }
}
</style>
