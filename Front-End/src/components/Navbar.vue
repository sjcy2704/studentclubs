<script setup>
import UserMenu from "./UserMenu.vue";
import { useUserStore } from "../stores/userStore";
import { ref } from "vue";

const navRoutes = [
  { name: "Home", path: "/", class: "home", icon: "fa-solid fa-house" },
  {
    name: "Clubs",
    path: "/clubs",
    class: "clubs",
    icon: "fa-solid fa-layer-group",
  },
];

const logInRoutes = [
  {
    name: "Sign Up",
    path: "/signup",
    class: "signup",
    icon: "fa-solid fa-address-card",
  },
  {
    name: "Login",
    path: "/login",
    class: "login",
    icon: "fa-solid fa-right-to-bracket",
  },
];

let showMenu = ref(false);

const userStore = useUserStore();
</script>

<template>
  <header>
    <div class="topCorner"></div>
    <div class="topDiv flex justify-between">
      <RouterLink to="/" class="logo white">World-Execute-Me</RouterLink>
      <ul class="flex row sm-col justify-between nav hide">
        <li class="navItem" v-for="item in navRoutes">
          <RouterLink class="navLink" :to="item.path">{{
            item.name
          }}</RouterLink>
        </li>
        <li class="navItem" v-if="userStore.loggedIn">
          <RouterLink class="navLink" to="/profile/clubs">My Clubs</RouterLink>
        </li>
        <li
          v-if="!userStore.loggedIn"
          class="navItem"
          v-for="item in logInRoutes"
        >
          <RouterLink class="navLink" :to="item.path">{{
            item.name
          }}</RouterLink>
        </li>
        <li v-if="userStore.loggedIn" class="navItem">
          <UserMenu />
        </li>
      </ul>
      <font-awesome-icon
        @click="showMenu = !showMenu"
        class="icon l-hide"
        icon="fa-solid fa-burger"
      />
    </div>
    <div
      @mouseleave="showMenu = false"
      :class="{ open: showMenu }"
      class="hamburgerMenu l-hide"
    >
      <ul @click="showMenu = false" class="menu">
        <li class="navItem" v-for="item in navRoutes">
          <RouterLink class="navLink flex justify-between" :to="item.path"
            >{{ item.name }}<font-awesome-icon :icon="item.icon"
          /></RouterLink>
        </li>
        <li class="navItem" v-if="userStore.loggedIn">
          <RouterLink class="navLink flex justify-between" to="/profile/clubs"
            >My Clubs
            <font-awesome-icon
              icon="fa-solid
            fa-baseball-bat-ball"
          /></RouterLink>
        </li>
        <li
          v-if="!userStore.loggedIn"
          class="navItem notLoggedIn"
          v-for="item in logInRoutes"
        >
          <RouterLink class="navLink flex justify-between" :to="item.path"
            >{{ item.name }} <font-awesome-icon :icon="item.icon"
          /></RouterLink>
        </li>
        <li v-if="userStore.loggedIn" class="navItem">
          <UserMenu hide />
        </li>
      </ul>
    </div>
  </header>
</template>

<style scoped>
.logo {
  font-weight: 500;
}

.nav {
  width: 30%;
}

.navItem {
  padding: 2px 10px;
  text-align: center;
  color: white;
}

/* .navItem:hover { */
/*   color: black; */
/*   background-color: white; */
/* } */

.navLink {
  color: inherit;
}

.topDiv {
  background-color: black;
  padding: 20px 100px;
}

.topCorner {
  box-sizing: content-box;
  border-top: 80px solid black;
  border-right: 100px solid transparent;
  height: 0;
  width: 320px;
  top: 0;
  position: absolute;
  z-index: -1;
}

.l-hide {
  display: none;
}

@media only screen and (max-width: 1140px) {
  .topDiv {
    padding: 20px 40px;
  }
}

@media only screen and (max-width: 1040px) {
  .topCorner {
    border-top: 70px solid black;
    border-right: 50px solid transparent;
  }
}

@media only screen and (max-width: 980px) {
  .hide {
    display: none;
  }

  .l-hide {
    display: block;
  }

  .hamburgerMenu {
    font-size: 1.2em;
    display: grid;
    grid-template-rows: 0fr;
    overflow: hidden;
    transition: grid-template-rows 400ms ease-in-out;
  }

  .hamburgerMenu.open {
    grid-template-rows: 1fr;
  }

  .icon {
    cursor: pointer;
    font-size: 1.3em;
  }

  .menu {
    background-color: black;
    width: 100%;
    border-radius: 0 0 10px 10px;
    padding: 10px 0;
    min-height: 0;
  }

  .navItem {
    padding: 20px 40px;
    text-align: left;
  }

  .navItem:last-child {
    padding: 0 20px;
  }

  .notLoggedIn:last-child {
    padding: 20px 40px;
  }
}

@media only screen and (max-width: 550px) {
  .topCorner {
    display: none;
  }
}
</style>
