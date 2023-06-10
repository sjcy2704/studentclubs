<script setup>
import { ref } from "vue";
import { useDropzone } from "vue3-dropzone";

const props = defineProps(["modelValue", "label"]);
const emit = defineEmits(["update:modelValue"]);

let file = ref(null);
const { getRootProps, getInputProps, isDragActive } = useDropzone({
  onDrop,
  multiple: false,
});

function onDrop(acceptFiles) {
  if (acceptFiles.length === 1) {
    file.value = acceptFiles;
    emit("update:modelValue", file.value);
  }
}

function deleteFile() {
  file.value = null;
  emit("update:modelValue", file.value);
}
</script>

<template>
  <div>
    <p class="label">{{ label }}</p>
    <div :class="{ dropzone: !file }" v-bind="getRootProps()">
      <div :class="{ isDragActive, border: !file }">
        <input v-bind="getInputProps()" />

        <div v-if="file" class="files">
          <div class="file-item">
            <span>{{ file[0].name }}</span>
            <span class="delete-file" @click="deleteFile()">Clear</span>
          </div>
        </div>
        <div v-else>
          <p v-if="isDragActive">Drop the files here ...</p>
          <p v-else>Drag and drop image here, or Click to select image</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.dropzone,
.files {
  width: 100%;
  margin: 0 auto;
  padding: 10px;
  border-radius: 8px;
  box-shadow: rgba(60, 64, 67, 0.3) 0px 1px 2px 0px,
    rgba(60, 64, 67, 0.15) 0px 1px 3px 1px;
  font-size: 12px;
  line-height: 1.5;
  cursor: pointer;
}

.border {
  border: 2px dashed #ccc;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  transition: all 0.3s ease;
  background: #fff;
}
.border.isDragActive {
  border: 2px dashed #ffb300;
  background: rgba(255, 167, 18, 0.2);
}

.file-item {
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: rgba(255, 167, 18, 0.2);
  padding: 7px;
  padding-left: 15px;
  margin-top: 10px;
}
.file-item:first-child {
  margin-top: 0;
}
.delete-file {
  background: black;
  color: #fff;
  padding: 5px 10px;
  border-radius: 8px;
  cursor: pointer;
  margin-left: 10px;
}
</style>
