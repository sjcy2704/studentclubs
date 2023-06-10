<script setup>
defineProps(["label", "modelValue", "passwordField", "required"]);
defineEmits(["update:modelValue"]);
</script>

<template>
  <div class="inputContainer">
    <p>
      {{ label }}
    </p>
    <input
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      :type="passwordField ? 'password' : 'text'"
      :required="required ? true : false"
    />
  </div>
</template>

<style scoped>
.errors {
  font-size: 0.5em;
}
.inputContainer {
  width: 100%;
  position: relative;
}
</style>
