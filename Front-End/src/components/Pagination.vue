<script setup>
import { watchEffect } from "vue";
import { computed, ref } from "vue";
const props = defineProps({
  maxButtons: {
    type: Number,
    default: 7,
  },
  pageCount: Number,
  currentPage: Number,
});

const emits = defineEmits(["changepage"]);

let availableButtons = props.maxButtons;
if (props.pageCount < props.maxButtons) {
  availableButtons = props.pageCount;
}

const totalPages = computed(() => {
  let res = [];
  let startPage = props.currentPage;
  let endPage = props.currentPage;

  let startCount = 1;
  let newPages = 1;

  while (startCount < availableButtons) {
    if (endPage + 1 <= props.pageCount) {
      endPage++;
      newPages++;
    }

    if (startPage - 1 > 0) {
      startPage--;
      newPages++;
    }
    if (newPages === startCount) {
      break;
    } else {
      startCount = newPages;
    }
  }

  for (let i = startPage; i <= endPage; i++) {
    res.push(i);
  }
  return res;
});

function firstPage() {
  emits("changepage", 1);
}

function prevPage() {
  emits("changepage", props.currentPage - 1);
}

function nextPage() {
  emits("changepage", props.currentPage + 1);
}

function clickPage(page) {
  emits("changepage", page);
}

function lastPage() {
  emits("changepage", props.pageCount);
}

const isFirstPage = computed(() => {
  return props.currentPage === 1;
});

const isLastPage = computed(() => {
  return props.currentPage === props.pageCount;
});
</script>

<template>
  <ul class="paginationContainer flex">
    <div class="paginationLeft flex">
      <li>
        <a href="#" :class="{ disabled: isFirstPage }" @click="firstPage"
          ><font-awesome-icon v-for="_ in 2" icon="fa-solid fa-chevron-left"
        /></a>
      </li>
      <li>
        <a href="#" :class="{ disabled: isFirstPage }" @click="prevPage"
          ><font-awesome-icon icon="fa-solid fa-chevron-left"
        /></a>
      </li>
    </div>

    <div class="paginationMid flex">
      <li v-for="page in totalPages">
        <a
          href="#"
          :class="{ disabled: page === currentPage }"
          @click="clickPage(page)"
          >{{ page }}</a
        >
      </li>
    </div>

    <div class="paginationRight flex">
      <li>
        <a href="#" :class="{ disabled: isLastPage }" @click="nextPage"
          ><font-awesome-icon icon="fa-solid fa-chevron-right"
        /></a>
      </li>
      <li>
        <a href="#" :class="{ disabled: isLastPage }" @click="lastPage"
          ><font-awesome-icon v-for="_ in 2" icon="fa-solid fa-chevron-right"
        /></a>
      </li>
    </div>
  </ul>
</template>

<style scoped>
.disabled {
  pointer-events: none;
  cursor: none;
  color: grey;
}
a {
  color: black;
}

.paginationContainer {
  margin-top: 30px;
}

.paginationLeft,
.paginationRight {
  gap: 15px;
}
.paginationMid {
  gap: 15px;
  margin: 0 20px;
}
</style>
