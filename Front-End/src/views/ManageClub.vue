<script setup>
import DasboardCard from "../components/DashboardCard.vue";
import { useRoute } from "vue-router";
import { api } from "../helpers/api";
import { ref } from "vue";

const route = useRoute();
const { clubID } = route.params;

let name = ref("");

await api.get(`/clubs/${clubID}`).then(({ data }) => {
  name.value = data.name;
});
</script>

<template>
  <div class="mainContainer flex align-center col">
    <div class="container">
      <div class="title">Manage <br />{{ name }}</div>
    </div>
    <div class="manageCards">
      <DasboardCard
        label="Members"
        icon="fa-solid fa-users"
        :link="'/clubs/' + clubID + '/manage/members'"
      />
      <DasboardCard
        label="Events"
        icon="fa-solid fa-calendar-days"
        :link="'/clubs/' + clubID + '/manage/events'"
      />
      <DasboardCard
        label="Announcements"
        icon="fa-solid fa-bullhorn"
        :link="'/clubs/' + clubID + '/manage/announcements'"
      />
      <DasboardCard
        label="Club Details"
        icon="fa-solid fa-info"
        :link="'/clubs/' + clubID + '/manage/details'"
      />
    </div>
  </div>
</template>

<style scoped>
.title {
  font-size: 2.5em;
  text-align: center;
}

.manageCards {
  margin-top: 35px;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 40px;
}

@media only screen and (min-width: 1025px) and (max-width: 1200px) {
  .manageCards {
    grid-template-columns: 1fr 1fr 1fr;
  }
}

@media only screen and (max-width: 1024px) {
  .manageCards {
    grid-template-columns: 1fr 1fr;
    gap: 25px;
  }
}

@media only screen and (max-width: 620px) {
  .manageCards {
    grid-template-columns: 1fr;
  }
}
</style>
