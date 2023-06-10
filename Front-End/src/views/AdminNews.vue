<script setup>
import { ref, watchEffect } from "vue";
import NewsCard from "../components/ManageNewsCard.vue";
import { useRoute, useRouter } from "vue-router";
import { api } from "../helpers/api";

const route = useRoute();
const router = useRouter();

let search = ref("");
let filter = ref("");
let allNews = ref([]);

await api.get("/news").then(({ data }) => (allNews.value = data));

let currNews = ref([]);

function filterEvents(search, filter) {
  if (search === "" && filter === "") {
    return allNews.value;
  }

  let res = allNews.value;

  search = search.toLowerCase();

  if (filter !== "") {
    res = allNews.value.filter((event) => event.status === filter);
  }

  return res.filter((event) => event.title.toLowerCase().includes(search));
}

watchEffect(() => {
  currNews.value = filterEvents(search.value, filter.value);
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
        <h2>Manage Announcements</h2>
      </div>
      <div class="menuContainer flex justify-between align-center sm-col">
        <div class="sm-w100 searchContainer">
          <input
            v-model="search"
            class="searchbar"
            type="search"
            placeholder="Search Title"
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
              <option value="public">Public</option>
              <option value="private">Private</option>
            </select>
          </div>
        </div>
      </div>
    </div>
    <div class="userCardsContainer">
      <NewsCard
        v-for="announcement in currNews"
        v-bind="announcement"
        v-model="currNews"
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
  text-align: center;
}

@media only screen and (max-width: 1200px) {
  .searchContainer {
    width: 40%;
  }

  .filterContainer {
    width: 40%;
  }
}

@media only screen and (max-width: 660px) {
  .topMenu {
    flex-direction: column;
  }
  .newEvent {
    width: 100%;
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
