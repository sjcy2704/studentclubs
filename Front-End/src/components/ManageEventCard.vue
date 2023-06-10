<script setup>
import { watchEffect } from "vue";
import { api } from "../helpers/api";
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const props = defineProps({
  name: String,
  starttime: String,
  endtime: String,
  disabled: Boolean,
  eventID: Number,
  modelValue: Object,
  clubID: Number,
});

const emits = defineEmits(["update:modelValue"]);

let date = ref();
let endDate = ref();
let eventDate = ref();
let eventStartTime = ref();
let eventEndTime = ref();
let duration = ref();

watchEffect(() => {
  date.value = new Date(props.starttime);
  endDate.value = new Date(props.endtime);
  eventDate.value = date.value.toLocaleDateString("en-AU");
  eventStartTime.value = date.value.toLocaleTimeString("en-AU", {
    hour: "2-digit",
    minute: "2-digit",
  });
  eventEndTime.value = endDate.value.toLocaleTimeString("en-AU", {
    hour: "2-digit",
    minute: "2-digit",
  });
  duration.value = Math.abs(endDate.value - date.value) / 60000;
});

async function removeEvent() {
  await api.post("/events/remove", { eventID: props.eventID }).then(() => {
    props.modelValue.splice(
      props.modelValue.findIndex((obj) => obj.eventID === props.eventID),
      1
    );

    emits("update:modelValue", props.modelValue);
  });
}
</script>

<template>
  <div class="userCard flex align-center" :class="{ disabled }">
    <div class="flex justify-between w-100 sm-col">
      <div class="userDetails">
        <h3>{{ props.name }}</h3>
        <div class="details flex">
          <div>
            <p><span>Date: </span>{{ eventDate }}</p>
            <p><span>Duration: </span> {{ duration }} mins</p>
          </div>
          <div>
            <p><span>Start Time: </span>{{ eventStartTime }}</p>
            <p><span>End Time: </span>{{ eventEndTime }}</p>
          </div>
        </div>
      </div>
      <div class="options flex align-center">
        <RouterLink
          :to="
            '/clubs/' +
            props.clubID +
            '/manage/events/' +
            props.eventID +
            '/guestlist'
          "
          >Guest List <font-awesome-icon icon="fa-solid fa-list"
        /></RouterLink>
        <RouterLink
          :to="'/clubs/' + props.clubID + '/manage/events/' + props.eventID"
          >Edit <font-awesome-icon icon="fa-solid fa-pen-to-square"
        /></RouterLink>
        <a @click="removeEvent"
          >Delete <font-awesome-icon icon="fa-solid fa-trash-can"
        /></a>
      </div>
    </div>
  </div>
</template>

<style scoped>
.details {
  gap: 40px;
}

.details span {
  font-weight: 500;
}
.userCard {
  padding: 20px 0;
  border-bottom: 2px solid black;
}

.userCard:first-child {
  padding-top: 0;
}

.userCard:last-child {
  border-bottom: 0;
}

.options {
  gap: 50px;
  padding: 10px 30px;
}

.options a {
  font-size: 1em;
  font-weight: 400;
}

.disabled {
  background-color: lightgrey;
  border-bottom: 2px solid grey;
  color: grey;
}

.disabled a {
  color: grey;
}

@media only screen and (max-width: 739px) {
  .options {
    margin-top: 10px;
  }
  .sm-col {
    flex-direction: column;
  }
}

@media only screen and (max-width: 550px) {
  .options {
    padding: 0;
  }
}
</style>
