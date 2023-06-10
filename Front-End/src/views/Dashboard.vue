<script setup>
import DasboardCard from "../components/DashboardCard.vue";
</script>

<template>
  <div class="mainContainer flex align-center col">
    <div class="container">
      <div class="title">Administrator Dashboard</div>
    </div>
    <div class="manageCards">
      <DasboardCard
        label="Users"
        icon="fa-solid fa-users"
        :link="$route.path + '/users'"
      />
      <DasboardCard
        label="Events"
        icon="fa-solid fa-calendar-days"
        :link="$route.path + '/events'"
      />
      <DasboardCard
        label="Announcements"
        icon="fa-solid fa-bullhorn"
        :link="$route.path + '/announcements'"
      />
      <DasboardCard
        label="Clubs"
        icon="fa-solid fa-bars-progress"
        :link="$route.path + '/clubs'"
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
