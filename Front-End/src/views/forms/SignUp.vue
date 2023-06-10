<script setup>
import Input from "../../components/Input.vue";
import { useRouter } from "vue-router";
import { reactive, ref, watch } from "vue";
import { validateUser } from "../../helpers/validators";
import { signUpUser } from "../../helpers/auth";
import { useUserStore } from "../../stores/userStore";
import Dropzone from "../../components/Dropzone.vue";

const router = useRouter();

const signup = reactive({
  firstName: "",
  familyName: "",
  username: "",
  password: "",
  confirm: "",
  email: "",
  phone: "",
  avatar: null,
  gender: null,
  manager: false,
});

const genders = [
  { name: "Male", value: "M" },
  { name: "Female", value: "F" },
  { name: "Non-binary", value: "NB" },
  { name: "Prefer Not to Say", value: "" },
];

const errs = reactive({
  errors: [],
});

function createUser() {
  validateUser(signup).then((errors) => (errs.errors = errors));

  if (errs.errors.length === 0) {
    const userStore = useUserStore();
    signup.username = signup.username.toLowerCase();
    signUpUser(signup, router, userStore);
  }
}
async function logWithGoogle() {
  router.push("/auth/google");
}
</script>

<template>
  <div class="container">
    <p class="title">Sign Up</p>
  </div>

  <form id="signUpForm" class="lsgForm" v-on:submit.prevent="createUser">
    <button class="googleLogin" type="button" @click="logWithGoogle">
      Sign Up With Google
      <font-awesome-icon class="googleIcon" icon="fa-brands fa-google" />
    </button>
    <hr />
    <div class="flex justify-between name sm-col">
      <Input label="First Name" v-model="signup.firstName" required="true" />
      <Input label="Family Name" v-model="signup.familyName" required="true" />
    </div>
    <Input label="Username" v-model="signup.username" required="true" />
    <div class="flex justify-between name">
      <Input
        label="Password"
        passwordField="true"
        v-model="signup.password"
        required="true"
      />
      <Input
        label="Confirm Password"
        passwordField="true"
        v-model="signup.confirm"
        required="true"
      />
    </div>
    <Input label="Email" v-model="signup.email" required="true" />
    <Input label="Phone Number" v-model="signup.phone" />
    <p>Gender</p>
    <select class="genderSelect" v-model="signup.gender" required>
      <option v-for="gender in genders" :value="gender.value">
        {{ gender.name }}
      </option>
    </select>
    <Dropzone label="Profile Avatar" v-model="signup.avatar" />
    <span class="errors" v-if="errs.errors" v-for="err in errs.errors">{{
      err
    }}</span>
    <button type="submit">Sign Up</button>
    <div class="options">
      <div
        class="signUpType"
        v-if="!signup.manager"
        @click.capture="signup.manager = true"
      >
        <p>Sign Up as a Manager</p>
      </div>
      <div v-else class="signUpType" @click.capture="signup.manager = false">
        <p>Sign Up as a User</p>
      </div>
      <RouterLink to="/login">Login</RouterLink>
    </div>
  </form>
</template>

<style scoped>
.genderSelect {
  margin-bottom: 15px;
}

.title {
  font-size: 2.8em;
}
.signUpType {
  cursor: pointer;
}

.name {
  gap: 20px;
}
.errors {
  display: block;
  font-size: 0.75em;
}
</style>
