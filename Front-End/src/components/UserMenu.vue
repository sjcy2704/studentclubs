<script setup>
import { useRouter, useRoute } from "vue-router";
import { logout } from "../helpers/auth";
import { ref } from "vue";
import { useUserStore } from "../stores/userStore";

defineProps({
  hide: Boolean,
});

const router = useRouter();
const route = useRoute();

const userStore = useUserStore();
</script>

<template>
  <div class="dropdown">
    <div v-if="!hide" class="profile">
      <RouterLink class="name flex" to="/profile"
        >{{ userStore.user.firstName }}
      </RouterLink>
    </div>
    <div class="dropdownContent">
      <div class="dropdownItems flex col">
        <div v-if="userStore.user.userType === 'admin'">
          <RouterLink class="navLink flex justify-between" to="/dashboard"
            >Dashboard
            <span><font-awesome-icon icon="fa-solid fa-table-columns" /></span
          ></RouterLink>
        </div>
        <div v-if="userStore.user.userType !== 'user'">
          <RouterLink class="navLink flex justify-between" to="/clubs/manage"
            >Manage Clubs
            <span> <font-awesome-icon icon="fa-solid fa-bars-progress" /> </span
          ></RouterLink>
        </div>
        <RouterLink class="navLink flex justify-between" to="/profile"
          >Profile <span> <font-awesome-icon icon="fa-solid fa-user" /> </span
        ></RouterLink>
        <RouterLink class="navLink flex justify-between" to="/profile/settings"
          >Settings <span> <font-awesome-icon icon="fa-solid fa-gear" /> </span
        ></RouterLink>
        <a
          class="navLink flex justify-between"
          href="#"
          @click="logout(router, route, userStore)"
          >Logout
          <span
            ><font-awesome-icon icon="fa-solid fa-right-from-bracket" /></span
        ></a>
      </div>
    </div>
  </div>
</template>

<style scoped>
.avatar {
  width: 40px;
  border-radius: 100px;
  position: absolute;
  right: -50px;
  top: -5px;
}

.dropdown {
  position: relative;
}

.name {
  color: inherit;
  position: relative;
}

@media only screen and (min-width: 981px) {
  .dropdownContent {
    display: none;
    position: absolute;
    background-color: black;
    padding: 25px 10px 10px;
    top: 25px;
    left: -55px;
    text-align: left;
    width: 185px;
    z-index: 9999;
  }

  .dropdown:hover .dropdownContent {
    display: block;
  }

  .dropdownItems a {
    padding: 5px 10px;
  }

  .dropdownItems a:hover {
    background-color: white;
    color: black;
  }
}

@media only screen and (max-width: 980px) {
  .navLink {
    padding: 20px;
  }
}
</style>
