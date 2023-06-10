<script setup>
import ClubsCard from "../components/ManageClubCard.vue";
import { ref } from "vue";
import { watchEffect } from "vue";
import { api } from "../helpers/api";
let allClubs = ref([]);

await api.get("/clubs/all").then(({ data }) => (allClubs.value = data));

let search = ref("");
let showSearch = ref(false);
let categoryFilter = ref("");
let showFilter = ref(false);
const categories = ref([
  { value: "Skills and Professional Development" },
  { value: "Faith and Religion" },
  { value: "Culture and Languages" },
  { value: "Faculty" },
  { value: "Activities and Hobbies" },
  { value: "Issue-Based and Politics" },
  { value: "Volunteering" },
  { value: "Sports" },
  { value: "Roseworthy" },
  { value: "Waite" },
]);
function filterClubs(search, filter) {
  if (search === "" && filter === "") {
    return allClubs.value;
  }
  search = search.toLowerCase();
  return allClubs.value.filter((club) => {
    if (search === "" && filter !== "") {
      return club.category === filter;
    } else if (search !== "" && filter === "") {
      return (
        club.name.toLowerCase().includes(search) ||
        club.short_name.toLowerCase().includes(search) ||
        club.category.toLowerCase().includes(search)
      );
    }
    return (
      club.name.toLowerCase().includes(search) ||
      club.short_name.toLowerCase().includes(search) ||
      club.category.toLowerCase().includes(search) ||
      club.category === filter
    );
  });
}
let clubs = ref([]);
watchEffect(() => {
  clubs.value = filterClubs(search.value, categoryFilter.value);
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
        <h2>Manage Clubs</h2>
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
            <select class="roleSelect" v-model="categoryFilter">
              <option value="" selected>All</option>
              <option v-for="category in categories" :value="category.value">
                {{ category.value }}
              </option>
            </select>
          </div>
        </div>
      </div>
    </div>
    <div class="userCardsContainer">
      <ClubsCard v-for="club in clubs" v-bind="club" />
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
