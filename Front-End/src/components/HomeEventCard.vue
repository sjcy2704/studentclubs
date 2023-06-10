<script setup>
import { ref } from "vue";
import { api } from "../helpers/api";
const props = defineProps({
  eventID: Number,
  name: String,
  description: String,
  clubID: Number,
  starttime: String,
  endtime: String,
  rsvpLimit: Number,
  inDetails: Boolean,
});

let date = ref();
let endDate = ref();
let eventDate = ref();
let eventStartTime = ref();
let eventEndTime = ref();
let duration = ref();

date.value = new Date(props.starttime);
endDate.value = new Date(props.endtime);
eventDate.value = date.value.toLocaleDateString("en-AU");
eventStartTime.value = date.value.toLocaleTimeString("en-AU", {
  hour: "2-digit",
  minute: "2-digit",
});
eventEndTime.value = endDate.value.toLocaleTimeString("en-AU", {
  hour: "2-digit",
  minute: "2-digit",
});
duration.value = Math.abs(endDate.value - date.value) / 60000;

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
    :to="'/clubs/' + props.clubID + '/events/' + props.eventID"
    class="card"
  >
    <div class="clubDetails flex col justify-between">
      <div class="name">
        <p class="eventName">{{ props.name }}</p>
        <p class="clubName">{{ clubName }}</p>
      </div>
      <div class="subDetails flex justify-between">
        <div class="date">
          <p class="category"><span>Date: </span>{{ eventDate }}</p>
          <p class="category"><span>Duration: </span> {{ duration }} mins</p>
        </div>
        <div class="time">
          <p class="category"><span>Start Time: </span>{{ eventStartTime }}</p>
          <p class="category"><span>End Time: </span>{{ eventEndTime }}</p>
        </div>
      </div>
    </div>
  </RouterLink>
</template>

<style scoped>
.time {
  text-align: right;
}
.card {
  width: 100%;
  display: grid;
  grid-template-columns: auto 1fr 1fr;
}

.clubDetails {
  text-align: left;
  grid-column: 2 / span 2;
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
  width: 100%;
  font-size: 0.95em;
}

.category {
  font-weight: 400;
}

.category span {
  font-weight: 500;
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
