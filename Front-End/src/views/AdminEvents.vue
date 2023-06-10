<script setup>
import { ref, watchEffect } from "vue";
import EventCard from "../components/ManageEventCard.vue";
import { api } from "../helpers/api";

let search = ref("");
let filter = ref("");
let allEvents = ref([]);

await api.get("/events").then(({ data }) => (allEvents.value = data));

let currEvents = ref([]);

function filterEvents(search, filter) {
  if (search === "" && filter === "") {
    return allEvents.value;
  }

  let res = [];

  search = search.toLowerCase();

  const currDate = new Date();
  if (filter === "upcoming") {
    res = allEvents.value.filter((event) => {
      const startDate = new Date(event.starttime);
      return startDate > currDate;
    });
  } else {
    res = allEvents.value.filter((event) => {
      const startDate = new Date(event.starttime);
      return startDate < currDate;
    });
  }

  return res.filter((event) => event.name.toLowerCase().includes(search));
}

watchEffect(() => {
  currEvents.value = filterEvents(search.value, filter.value);
});
</script>

<template>
  <a class="back" @click="$router.go(-1)"
    ><font-awesome-icon
      icon="fa-solid
    fa-chevron-left"
  /></a>
  <div class="usersContainer">
    <div class="manageMenu">
      <div class="topMenu flex align-center justify-between">
        <h2>Manage Events</h2>
      </div>
      <div class="menuContainer flex justify-between align-center sm-col">
        <div class="sm-w100 searchContainer">
          <input
            v-model="search"
            class="searchbar"
            type="search"
            placeholder="Search Event Name"
          />
          <font-awesome-icon
            class="searchicon"
            icon="fa-solid fa-magnifying-glass"
          />
        </div>

        <div class="filterContainer flex align-center">
          <font-awesome-icon class="filterIcon" icon="fa-solid fa-filter" />
          <div class="flex filter">
            <select class="roleSelect" v-model="filter">
              <option value="" selected>All</option>
              <option value="upcoming">Upcoming</option>
              <option value="past">Past</option>
            </select>
          </div>
        </div>
      </div>
    </div>
    <div class="userCardsContainer">
      <EventCard
        v-for="event in currEvents"
        v-bind="event"
        v-model="currEvents"
      />
    </div>
  </div>
</template>

<style scoped>
.back {
  color: black;
  cursor: pointer;
  position: absolute;
  left: 4%;
  top: 12%;
  font-size: 1.5em;
}

.usersContainer {
  border: 2px solid black;
  width: 80%;
  height: calc(100vh - (100vh * 0.25));
  border-radius: 10px;
  overflow-y: scroll;
}

.manageMenu {
  border-bottom: 2px solid black;
  border-radius: 10px 10px 0 0;
  background-color: white;
  padding: 20px;
  position: sticky;
  top: 0;
}

.menuContainer {
  margin-top: 10px;
}

input {
  margin: 0;
}

.searchContainer {
  position: relative;
  text-align: left;
  width: 25%;
}

.searchbar {
  padding-left: 33px;
}

.searchicon {
  position: absolute;
  left: 10px;
  top: 10px;
  cursor: pointer;
}

.filter {
  gap: 20px;
  width: 100%;
  justify-content: end;
}

.filterContainer {
  gap: 20px;
  width: 20%;
  justify-content: end;
}

.filterButton {
  margin: 0;
  width: 60%;
  padding: 9px;
  font-size: 0.8em;
}

.resetFilter {
  border: 2px solid black;
  color: black;
  background-color: white;
}

.filterIcon {
  cursor: pointer;
  font-size: 1.2em;
}

.userCardsContainer {
  padding: 20px 20px 10px;
}

.newEvent {
  border-radius: 5px;
  padding: 5px 20px;
  background-color: black;
}

@media only screen and (max-width: 1200px) {
  .searchContainer {
    width: 40%;
  }

  .filterContainer {
    width: 40%;
  }
}
@media only screen and (max-width: 550px) {
  .searchContainer {
    width: 100%;
    margin-bottom: 10px;
  }

  .filterContainer {
    width: 100%;
  }

  .filter {
    gap: 10px;
  }

  .filterIcon {
    display: none;
  }

  .back {
    top: 10%;
  }
}
</style>
