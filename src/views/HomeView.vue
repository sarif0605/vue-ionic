<template>
  <div class="hero bg-base-200 min-h-screen flex justify-center items-center">
    <div class="hero-content text-center lg:text-left flex-col lg:flex-row animate-fade-in">
      <div class="animate-scale-up">
        <h1 class="text-5xl font-bold text-center lg:text-left mb-4">
          Membaca Buku Membawa Kita Terhadap Pengetahuan Yang Luas!
        </h1>
        <p class="py-6 mb-6 px-4 sm:px-0">
          Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda excepturi exercitationem
          quasi. In deleniti eaque aut repudiandae et a id nisi.
        </p>
        <RouterLink :to="{ name: 'Content' }" class="btn btn-primary">Get Started</RouterLink>
      </div>
    </div>
  </div>

  <section class="mx-auto max-w-6xl p-4">
    <h1 class="text-2xl font-bold mb-4">Content New</h1>
    <!-- Komponen Loading -->
    <LoadingComponent v-if="authStore.isLoading" />

    <!-- Jika Data Kosong -->
    <div v-else-if="dataContent && dataContent.length < 1" class="text-center text-gray-500">
      Data belum tersedia.
    </div>

    <!-- Jika Data Tersedia -->
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        class="card bg-base-100 image-full w-full shadow-xl transform transition-transform hover:scale-105 hover:shadow-lg animate-fade-in"
        v-for="data in dataContent"
        :key="data.id"
      >
        <figure class="rounded-lg overflow-hidden">
          <img :src="data.image_url" alt="Gambar Buku" class="object-cover h-48 w-full" />
        </figure>
        <div class="card-body">
          <h2 class="card-title text-lg font-semibold mb-2">{{ data.title }}</h2>
          <p class="text-sm text-gray-600">{{ data.content.substring(0, 20) }}...</p>
          <div class="card-actions justify-between items-center mt-4">
            <p class="text-sm text-gray-500">{{ data.user?.name || 'Nama tidak tersedia' }}</p>
            <RouterLink
              :to="{ name: 'ContentId', params: { id: data.id } }"
              class="btn btn-primary"
            >
              Lihat
            </RouterLink>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { customeApi } from '@/api';
import LoadingComponent from '@/components/LoadingComponent.vue';
import { useAuthStore } from '@/stores/AuthStore';
import { onMounted, ref } from 'vue';
import { RouterLink } from 'vue-router';

const authStore = useAuthStore();
const dataContent = ref([]);

const getAll = async () => {
  try {
    authStore.isLoading = true;
    const { data } = await customeApi.get('/content-three');
    console.log("apakah data tampil");
    console.log(data);
    dataContent.value = data.data || []; // Ensure fallback to empty array if data is malformed
  } catch (error) {
    console.error('Error fetching data:', error);
  } finally {
    authStore.isLoading = false;
  }
};

onMounted(() => {
  getAll();
});
</script>
