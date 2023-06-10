<script setup>
import { useRouter } from "vue-router";
import Input from "../../components/Input.vue";
import { reactive } from "vue";
import { logUser } from "../../helpers/auth";
import { useUserStore } from "../../stores/userStore";

const router = useRouter();

const login = reactive({
  username: "",
  password: "",
});

const errors = reactive({
  errs: false,
});

const userStore = useUserStore();

async function logWithGoogle() {
  router.push("/auth/google");
}
</script>

<template>
  <div class="container">
    <p class="title">Login</p>
  </div>

  <form
    class="lsgForm"
    v-on:submit.prevent="logUser(login, router, userStore, errors)"
  >
    <button class="googleLogin" type="button" @click="logWithGoogle">
      Login With Google
      <font-awesome-icon class="googleIcon" icon="fa-brands fa-google" />
    </button>
    <hr />
    <Input label="Username" v-model="login.username" />
    <Input label="Password" v-model="login.password" passwordField="true" />
    <span class="errors" v-if="errors.errs"
      >Username or password incorrect</span
    >
    <button type="submit">Login</button>
    <div class="options">
      <RouterLink to="/signup">Sign Up</RouterLink>
    </div>
  </form>
</template>

<style scoped>
.googleLogin {
  padding: 10px;
  display: flex;
  justify-content: space-evenly;
  margin-bottom: 10px;
}
.googleIcon {
  font-size: 1.3em;
}
.title {
  font-size: 2.8em;
}
.errors {
  display: block;
  font-size: 0.75em;
}
</style>
