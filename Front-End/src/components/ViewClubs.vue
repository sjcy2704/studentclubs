<script setup>
import ClubCard from "./ClubCard.vue";
import { ref, toRef } from "vue";
import { watchEffect } from "vue";

const props = defineProps({
  modelValue: Array,
  label: String,
  manager: Boolean,
});

const emits = defineEmits(["changecategory", "update:modelValue"]);
let allClubs = ref(props.modelValue);

let search = ref("");
let showSearch = ref(false);
let categoryFilter = ref("");
let showFilter = ref(false);

const categories = ref([
  { value: "Skills and Professional Development" },
  { value: "Faith and Religion" },
  { value: "Culture and Languages" },
  { value: "Faculty" },
  { value: "Activities and Hobbies" },
  { value: "Issue-Based and Politics" },
  { value: "Volunteering" },
  { value: "Sports" },
  { value: "Roseworthy" },
  { value: "Waite" },
]);

function searchClubs(search) {
  if (search === "") {
    return allClubs.value;
  }

  search = search.toLowerCase();
  return allClubs.value.filter(
    (club) =>
      club.name.toLowerCase().includes(search) ||
      club.short_name.toLowerCase().includes(search) ||
      club.category.toLowerCase().includes(search)
  );
}

let clubs = ref([]);

watchEffect(() => {
  emits("changecategory", categoryFilter.value);
  allClubs.value = props.modelValue;
  clubs.value = searchClubs(search.value);
});
</script>

<template>
  <div class="mainContainer flex col align-center">
    <div class="container w-100">
      <div class="flex align-center justify-between sm-col">
        <div class="title">{{ props.label }}</div>
        <RouterLink v-if="props.manager" to="/clubs/register" class="newClub">
          New Club
          <font-awesome-icon class="plus" icon="fa-solid fa-plus" />
        </RouterLink>
      </div>
      <div class="lookupContainer flex justify-between sm-col m-col">
        <div class="searchContainer">
          <input
            :class="{ show: showSearch }"
            v-model="search"
            class="searchbar"
            type="search"
            placeholder="Search Club"
          />
          <font-awesome-icon
            class="searchicon"
            icon="fa-solid fa-magnifying-glass"
            @click="showSearch = !showSearch"
          />
        </div>

        <div class="filterContainer flex align-center">
          <div class="flex filter" :class="{ showFilter }">
            <select
              class="categorySelect"
              v-model="categoryFilter"
              :class="{ showFilter }"
            >
              <option value="" disabled selected>Category</option>
              <option v-for="category in categories" :value="category.value">
                {{ category.value }}
              </option>
            </select>
            <button
              v-if="categoryFilter !== ''"
              :class="{ hide: !showFilter }"
              type="button"
              class="filterButton resetFilter"
              @click="categoryFilter = ''"
            >
              Reset Filter
            </button>
          </div>
          <font-awesome-icon
            class="filterIcon"
            icon="fa-solid fa-filter"
            @click="showFilter = !showFilter"
          />
        </div>
      </div>
    </div>

    <div class="cardsContainer">
      <ClubCard
        class="item"
        v-for="club in clubs"
        v-bind="club"
        :manager="props.manager"
      />
      <h2 class="noClubs" v-if="clubs.length <= 0">No Clubs</h2>
    </div>

    <slot />
  </div>
</template>

<style scoped>
.lookupContainer {
  margin-top: 30px;
  margin-bottom: 20px;
}
.newClub {
  padding: 10px 15px;
  background-color: black;
  border-radius: 10px;
}

.hide {
  display: none;
}

.filter {
  gap: 20px;
  width: 100%;
  opacity: 0;
  transition: opacity 0.5s ease;
  justify-content: end;
}

.filterContainer {
  gap: 20px;
  width: 40%;
  justify-content: end;
}
.categorySelect {
  width: 0;
  opacity: 0;
  transition: width 0.5s ease-out, opacity 0.5s ease;
}
.showFilter {
  opacity: 1;
  width: 100%;
}
.filterButton {
  margin: 0;
  width: 60%;
  padding: 9px;
  font-size: 0.8em;
}

.resetFilter {
  border: 2px solid black;
  color: black;
  background-color: white;
}
.title {
  font-size: 2.5em;
  text-align: center;
  flex-grow: 1;
}

.searchContainer {
  position: relative;
  text-align: left;
}

.searchbar {
  padding-left: 33px;
  width: 0%;
  opacity: 0;
  transition: width 0.5s ease-out, opacity 0.5s ease;
  margin-bottom: 0;
}

.show {
  width: 100%;
  opacity: 1;
}

.plus {
  font-size: 1.25em;
}
.filterIcon {
  cursor: pointer;
  font-size: 1.2em;
}

.searchicon {
  position: absolute;
  left: 10px;
  top: 10px;
  cursor: pointer;
}

.cardsContainer {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  gap: 40px;
}

.item {
  justify-self: center;
}

.noClubs {
  grid-column: 1 / span 4;
  width: 1120px;
  justify-self: stretch;
  text-align: center;
}

@media only screen and (min-width: 1025px) and (max-width: 1200px) {
  .cardsContainer {
    grid-template-columns: 1fr 1fr 1fr;
  }

  .filterContainer {
    width: 50%;
  }
}

@media only screen and (max-width: 1024px) {
  .categorySelect {
    width: 100%;
    opacity: 1;
  }
  .searchbar {
    width: 100%;
    opacity: 1;
    margin-bottom: 10px;
  }
  .filter {
    opacity: 1;
  }
  .filterContainer {
    width: 100%;
  }
  .cardsContainer {
    grid-template-columns: 1fr 1fr;
    gap: 25px;
    width: 525px;
  }
  .noClubs {
    width: 100%;
    grid-column: 1 / span2;
  }
}

@media only screen and (max-width: 550px) {
  .cardsContainer {
    grid-template-columns: 1fr;
    gap: 20px;
    width: 100%;
  }
  .filterIcon {
    display: none;
  }
  .noClubs {
    grid-column: 1 / span 1;
  }
  .newClub {
    width: 100%;
  }
}
</style>
