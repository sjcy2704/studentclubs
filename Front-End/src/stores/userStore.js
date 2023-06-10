import { defineStore } from "pinia";
import { api } from "../helpers/api";

export const useUserStore = defineStore("userStore", {
  state: () => ({
    user: {},
    loggedIn: false,
  }),
  actions: {
    async getUser() {
      await api.get("/user").then(({ data }) => {
        if (data.userID) {
          this.user = data;
          this.loggedIn = true;
        } else {
          this.$reset();
        }
      });
    },
  },
  persist: {
    storage: sessionStorage,
    beforeRestore: (ctx) => {
      ctx.store.getUser();
    },
  },
});
