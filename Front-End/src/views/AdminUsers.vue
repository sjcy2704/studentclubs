<script setup>
import { ref, watchEffect } from "vue";
import UserCard from "../components/ManageUserCard.vue";
import { api } from "../helpers/api";
import { useUserStore } from "../stores/userStore";
const userStore = useUserStore();

let members = ref([]);

await api.get(`/users`).then(({ data }) => (members.value = data));

let search = ref("");
let filter = ref("");

let currMembers = ref([]);

function filterMembers(search, filter) {
  if (search === "" && filter === "") {
    return members.value;
  }

  let res = [];

  search = search.toLowerCase();
  if (filter === "managers") {
    res = members.value.filter((member) =>
      managers.value.includes(member.userID)
    );
  } else if (filter === "members") {
    res = members.value.filter(
      (member) => !managers.value.includes(member.userID)
    );
  }

  return res.filter(
    (member) =>
      member.firstName.toLowerCase().includes(search) ||
      member.familyName.toLowerCase().includes(search)
  );
}

watchEffect(() => {
  currMembers.value = filterMembers(search.value, filter.value);
});
</script>

<template>
  <a class="back" @click="$router.go(-1)"
    ><font-awesome-icon
      icon="fa-solid
    fa-chevron-left"
  /></a>
  <div class="mainContainer flex col align-center w-100">
    <div class="usersContainer">
      <div class="manageMenu">
        <h2>Manage Users</h2>
        <div class="menuContainer flex justify-between align-center sm-col">
          <div class="sm-w100 searchContainer">
            <input
              v-model="search"
              class="searchbar"
              type="search"
              placeholder="Search Name"
            />
            <font-awesome-icon
              class="searchicon"
              icon="fa-solid fa-magnifying-glass"
            />
          </div>

          <div class="filterContainer flex align-center">
            <div class="flex filter">
              <select class="roleSelect" v-model="filter">
                <option value="" disabled selected>Role</option>
                <option value="managers">Managers</option>
                <option value="members">Members</option>
              </select>
              <button
                v-if="filter !== ''"
                type="button"
                class="filterButton resetFilter"
                @click="filter = ''"
              >
                Reset Filter
              </button>
            </div>
            <font-awesome-icon
              class="filterIcon"
              icon="fa-solid fa-filter"
              @click="showFilter = !showFilter"
            />
          </div>
        </div>
      </div>
      <div class="userCardsContainer">
        <UserCard
          v-for="member in currMembers"
          v-bind="member"
          :role="member.userType"
          :curr-manager="member.userID === userStore.user.userID"
          admin
        />
      </div>
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
  width: 30%;
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
  padding: 20px 20px;
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
