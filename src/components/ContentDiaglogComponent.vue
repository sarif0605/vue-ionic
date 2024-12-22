<template>
    <div>
      <div class="modal" :class="{ 'modal-open': visible }">
        <div class="modal-box relative z-20">
          <p class="py-4">{{ data ? "Update" : "Tambah" }} Content</p>
          <form @submit.prevent="handleSubmit" enctype="multipart/form-data">
            <div
              v-if="authStore.isLoading"
              class="absolute inset-0 top-0 bottom-0 left-0 right-0 flex items-center justify-center bg-white bg-opacity-75 z-10"
            >
              <LoadingComponent />
            </div>
            <div role="alert" class="alert alert-error" v-if="authStore.isErr">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-6 w-6 shrink-0 stroke-current"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <ul>
                <li
                  v-for="(msg, index) in authStore.errMsg.general"
                  :key="'general-' + index"
                >
                  {{ msg }}
                </li>
                <li
                  v-for="(errors, field) in authStore.errMsg"
                  v-if="field !== 'general'"
                  :key="field"
                >
                  <ul>
                    <li v-for="(msg, index) in errors" :key="index">{{ msg }}</li>
                  </ul>
                </li>
              </ul>
            </div>
            <label class="input input-bordered flex items-center gap-2">
              <input
                type="text"
                class="grow"
                placeholder="Title"
                v-model="content.title"
              />
            </label>
            <label class="flex flex-col gap-2 mt-2 w-full">
              <textarea
                class="textarea textarea-bordered w-full"
                placeholder="Summary"
                v-model="content.content"
              ></textarea>
            </label>
            <label class="input input-bordered flex items-center gap-2 mt-2">
              <input
                class="grow"
                id="poster"
                type="file"
                accept="image/*"
                @change="selectImage"
              />
            </label>
            <div class="avatar mt-2" v-if="content.previewImage">
              <div class="w-24 rounded">
                <img :src="content.previewImage" />
              </div>
            </div>
            <label class="flex items-center gap-2 mt-2">
              <button class="btn btn-primary" type="submit">Kirim</button>
              <button class="btn btn-base-300" type="button" @click="closeDialog">
                Close
              </button>
            </label>
          </form>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { reactive, watch } from "vue";
  import { customeApi } from "@/api";
  import { useAuthStore } from "@/stores/AuthStore";
  import { useToast } from "vue-toast-notification";
import LoadingComponent from "./LoadingComponent.vue";
  const $toast = useToast();
  const authStore = useAuthStore();
  const props = defineProps({
    data: {
      type: Object,
      default: null,
    },
    visible: Boolean,
  });
  const emit = defineEmits(["closeModal", "save", "update:visible"]);
  const closeDialog = () => {
    emit("update:visible", false);
  };
  const content = reactive({
    id: null,
    content: "",
    title: "",
    currentImage: null,
    previewImage: null,
  });
  
  const clearInput = () => {
    content.id = null;
    content.content = "";
    content.title = "";
    content.currentImage = null;
    content.previewImage = null;
  };
  
  watch(
    () => props.data,
    (newValue) => {
      if (newValue) {
        content.id = newValue.id;
        content.title = newValue.title;
        content.content = newValue.content;
        content.previewImage = newValue.image_url;
      } else {
        clearInput();
      }
    },
    { immediate: true }
  );
  
  const handleSubmit = async () => {
    authStore.isLoading = true;
    const isFileUpload = content.currentImage;
    let formData;
    let headers;
    if (isFileUpload) {
      formData = new FormData();
      formData.append("title", content.title);
      formData.append("content", content.content);
      if (content.currentImage) {
        formData.append("image", content.currentImage);
      } else if (content.previewImage) {
        formData.append("image", content.previewImage);
      }
    } else {
      formData = JSON.stringify({
        title: content.title,
        content: content.content
      });
    }
    headers = {
      Authorization: `Bearer ${authStore.userToken}`,
      "Content-Type": isFileUpload ? "multipart/form-data" : "application/json",
    };
    try {
      const url = content.id ? `/content/${content.id}` : "/content";
      const method = content.id ? "put" : "post";
      const response = await customeApi[method](url, formData, {
        headers: headers,
      });
      console.log(method, url, headers);
      if (response.data) {
        clearInput();
        emit("save");
        emit("closeModal");
      }
      authStore.isLoading = false;
      $toast.success(
        content.id ? "Berhasil Ubah Data Content" : "Berhasil Tambah Data Content",
        {
          position: "top-right",
        }
      );
    } catch (error) {
      console.log(error);
      authStore.isLoading = false;
      authStore.isErr = true;
      if (error.response && error.response.data.errors) {
        authStore.errMsg = error.response.data.errors;
      } else {
        authStore.errMsg = { general: [error.response.data.message] };
      }
      console.log(error);
    }
  };
  
  const selectImage = (event) => {
    const file = event.target.files[0];
    if (file) {
      content.currentImage = file;
      content.previewImage = URL.createObjectURL(file);
    }
  };
  </script>