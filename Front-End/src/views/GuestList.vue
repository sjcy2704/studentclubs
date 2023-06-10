<script setup>
import { ref, watchEffect } from "vue";
import { useRoute, useRouter } from "vue-router";
import { api } from "../helpers/api";

const route = useRoute();
const router = useRouter();

const { eventID } = route.params;

let search = ref("");
let filter = ref("");
let allGuests = ref([]);
let totalGuests = ref(0);

await api.get(`/rsvp/events/${eventID}`).then(({ data }) => {
  totalGuests = data.totalRsvpd;
  allGuests.value = data.data;
});

let currGuests = ref([]);

function filterEvents(search) {
  search = search.toLowerCase();

  return allGuests.value.filter(
    (guest) =>
      guest.firstName.toLowerCase().includes(search) ||
      guest.familyName.toLowerCase().includes(search) ||
      guest.email.toLowerCase().includes(search)
  );
}

watchEffect(() => {
  currGuests.value = filterEvents(search.value);
});

async function updateStatus(e, userID) {
  await api.post(`/rsvp/events/${eventID}/users/${userID}/update`, {
    status: e.target.checked,
  });
}
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
        <h2>Guest List</h2>
      </div>
      <div class="menuContainer flex justify-between align-center sm-col">
        <div class="sm-w100 searchContainer">
          <input
            v-model="search"
            class="searchbar"
            type="search"
            placeholder="Search Guest"
          />
          <font-awesome-icon
            class="searchicon"
            icon="fa-solid fa-magnifying-glass"
          />
        </div>
      </div>
    </div>
    <div class="userCardsContainer">
      <div class="userDetails tableHeader">
        <div class="name">
          <p>Name</p>
        </div>
        <div class="email hide">
          <p>Email</p>
        </div>
        <div class="status">
          <p>Status</p>
        </div>
      </div>
      <div v-for="guest in currGuests">
        <div class="userDetails">
          <div class="name">
            <p>{{ guest.firstName + " " + guest.familyName }}</p>
          </div>
          <div class="email hide">
            <p>{{ guest.email }}</p>
          </div>
          <div class="status">
            <input
              class="statusCheckbox"
              type="checkbox"
              :checked="guest.status"
              @change="updateStatus($event, guest.userID)"
            />
          </div>
        </div>
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

.userDetails {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  border-bottom: 2px solid black;
  padding: 10px 0;
}
.tableHeader {
  border-bottom: 0;
  padding: 5px 0;
}
.status {
  justify-self: end;
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
}

@media only screen and (max-width: 660px) {
  .searchContainer {
    width: 100%;
  }
  .topMenu {
    flex-direction: column;
  }
  .newEvent {
    width: 100%;
  }

  .userDetails {
    grid-template-columns: 1fr 1fr;
  }

  .hide {
    display: none;
  }
}

@media only screen and (max-width: 550px) {
  .back {
    top: 10%;
  }
}
</style>
