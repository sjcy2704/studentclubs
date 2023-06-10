import { api } from "./api";

export async function logUser(login, router, userStore, errors = null) {
  let { username, password } = login;
  username = username.toLowerCase();
  await api
    .post("/login", { username, password })
    .then((res) => {
      userStore.user = res.data;
      userStore.loggedIn = true;
      router.go(-1);
    })
    .catch(({ response }) => {
      if ((response.status === 401 || response.status === 400) && errors) {
        errors.errs = true;
      }
    });
}

export async function logout(router, route, userStore) {
  await api.post("/logout").then(() => {
    if (route.path !== "/") {
      router.push("/");
    } else {
      router.go();
    }
    userStore.$reset();
  });
}

export async function signUpUser(signup, router, userStore) {
  const formData = new FormData();
  for (const key in signup) {
    if (key === "avatar" && signup[key]) {
      formData.append(key, signup[key][0]);
    } else {
      formData.append(key, signup[key]);
    }
  }

  await api.post("/signup", formData).then(() => {
    const user = {
      username: signup.username,
      password: signup.password,
    };
    logUser(user, router, userStore);
  });
}
