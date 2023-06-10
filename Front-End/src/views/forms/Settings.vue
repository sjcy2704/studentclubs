<script setup>
import Input from "../../components/Input.vue";
import { useRouter } from "vue-router";
import { reactive, ref, watchEffect } from "vue";
import { validateUser } from "../../helpers/validators";
import { signUpUser } from "../../helpers/auth";
import { useUserStore } from "../../stores/userStore";
import Dropzone from "../../components/Dropzone.vue";
import { api } from "../../helpers/api";

const router = useRouter();
const userStore = useUserStore();

let profileAvatar = ref(userStore.user.avatar);

let signup = reactive({
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

await api.get(`/user`).then(({ data }) => {
  signup = reactive(data);
  signup.gender = signup.gender === null ? "" : signup.gender;
  if (signup.phone === null || signup.phone === "null") {
    signup.phone = null;
  }
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
  validateUser(signup, true).then(async (errors) => {
    errs.errors = errors;
    if (errors.length === 0) {
      signup.username = signup.username.toLowerCase();
      const formData = new FormData();
      for (const key in signup) {
        if (key === "avatar" && signup[key] && signup[key][0] instanceof File) {
          formData.append(key, signup[key][0]);
        } else {
          formData.append(key, signup[key]);
        }
      }

      await api.post("/user/update", formData).then(() => {
        router.go("");
      });
    }
  });
}

watchEffect(() => {
  if (signup.avatar && signup.avatar[0] instanceof File) {
    profileAvatar.value = URL.createObjectURL(signup.avatar[0]);
  }
});
</script>

<template>
  <div class="mainContainer flex col align-center">
    <div class="container">
      <p class="title">Edit User Information</p>
    </div>

    <form id="signUpForm" class="lsgForm" v-on:submit.prevent="createUser">
      <img :src="profileAvatar" class="avatarImg" />
      <div class="flex justify-between name sm-col">
        <Input label="First Name" v-model="signup.firstName" required="true" />
        <Input
          label="Family Name"
          v-model="signup.familyName"
          required="true"
        />
      </div>
      <Input label="Username" v-model="signup.username" required="true" />
      <div class="flex justify-between name">
        <Input
          label="Password"
          passwordField="true"
          v-model="signup.password"
        />
        <Input
          label="Confirm Password"
          passwordField="true"
          v-model="signup.confirm"
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
      <button type="submit">Update Info</button>
    </form>
  </div>
</template>

<style scoped>
.avatarImg {
  width: 100%;
  height: auto;
}
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
