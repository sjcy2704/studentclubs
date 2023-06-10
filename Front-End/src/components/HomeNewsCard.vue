<script setup>
import { ref } from "vue";
import { api } from "../helpers/api";
const props = defineProps({
  newsID: Number,
  title: String,
  content: String,
  clubID: Number,
  inDetails: Boolean,
  posted: String,
});

let currDatePosted = ref("");
let currTimePosted = ref("");
let date = ref("");
date.value = new Date(props.posted);
let today = new Date(props.posted);

if (date.value.getDate() === today.getDate()) {
  currDatePosted.value = "Today";
} else {
  const day = date.value.getDate();
  const month = date.value.getMonth();
  currDatePosted.value = `${month} ${day}`;
}

const minutes = 30;
const ms = 1000 * 60 * minutes;

currTimePosted.value = new Date(
  Math.round(date.value.getTime() / ms) * ms
).toLocaleTimeString("en-AU", { hour: "2-digit", minute: "2-digit" });

let clubName = ref("");
async function getClubName() {
  await api.get(`/clubs/${props.clubID}`).then(({ data }) => {
    clubName.value = data.name;
  });
}
if (!props.inDetails) {
  getClubName();
}
</script>

<template>
  <RouterLink
    :to="'/clubs/' + props.clubID + '/announcements/' + props.newsID"
    class="card"
  >
    <div class="eventDetails">
      <div class="posted">
        <p>{{ currDatePosted }}</p>
        <p>{{ currTimePosted }}</p>
      </div>
      <div>
        <div class="name">
          <p class="eventName">{{ props.title }}</p>
          <p class="clubName">{{ clubName }}</p>
        </div>
        <div class="subDetails">
          <div class="content" v-html="props.content"></div>
        </div>
      </div>
    </div>
  </RouterLink>
</template>

<style scoped>
.card {
  width: 100%;
}

.eventDetails {
  text-align: left;
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 15px;
}

.posted {
  border-right: 2px solid black;
  padding-right: 15px;
}

.name {
  margin-bottom: 5px;
  font-weight: 500;
}

.eventName {
  font-size: 1.15em;
}

.clubName {
  font-size: 0.95em;
  margin-bottom: 5px;
}

.subDetails {
  font-size: 0.8em;
  width: 100%;
}

.content {
  width: calc(100%);
}

.content :deep(p) {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.content > :not(:first-child) {
  display: none;
}

@media only screen and (max-width: 1430px) {
  .name,
  .posted {
    font-size: 0.9em;
  }
}

@media only screen and (max-width: 700px) {
  .name,
  .posted {
    font-size: 0.8em;
  }
}
</style>
