<template>
  <section class="mx-auto max-w-6xl p-4 mt-16">
    <h1 class="text-3xl font-bold mb-6 text-center animate-fade-in">Content</h1>
    
    <!-- Komponen Loading -->
    <LoadingComponent v-if="authStore.isLoading" />

    <!-- Jika Data Kosong -->
    <div v-else-if="dataContent.length < 1" class="text-center text-gray-500 animate-fade-in">
      Data belum tersedia.
    </div>

    <!-- Jika Data Tersedia -->
    <div v-else class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <div 
        class="card bg-base-100 w-full shadow-xl transform transition-all hover:animate-card-hover"
        v-for="data in dataContent"
        :key="data.id"
      >
        <figure class="px-10 pt-10 animate-scale-up">
          <img
            :src="data.image_url"
            alt="Shoes"
            class="rounded-xl"
          />
        </figure>
        <div class="card-body items-center text-center">
          <h2 class="card-title">{{ data.title }}!</h2>
          <p>{{ data.content.substring(0, 20) }}...</p>
          <p>By. {{ data.user?.name || 'Nama tidak tersedia' }}</p>
          <p>{{ new Date(data.created_at).toLocaleDateString() }}</p>
          <div class="card-actions">
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
    const { data } = await customeApi.get('/content');
    dataContent.value = data.data;
    console.log(data);
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

