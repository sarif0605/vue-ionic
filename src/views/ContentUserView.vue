<template>
  <section class="mx-auto max-w-6xl p-4 mt-16">
    <h1 class="text-3xl font-bold mb-6 text-center">Content</h1>
    <div class="flex items-center justify-start">
      <input
            v-model="searchQuery"
            @input="searchContent"
            type="text"
            placeholder="Search Content..."
            class="input input-bordered w-full sm:max-w-xs"
          />
      <button class="btn btn-active btn-primary" @click="openNewDialog()">
        Tambah Data
      </button>
    </div>

    <!-- Komponen Loading -->
    <div v-if="authStore.isLoading" class="flex justify-center py-4">
          <LoadingComponent />
    </div>

    <!-- Jika Data Kosong -->
    <div v-else-if="dataContent.length < 1" class="text-center text-gray-500">
      Data belum tersedia.
    </div>

    <!-- Jika Data Tersedia -->
    <div v-else class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <div class="card bg-base-100 w-full shadow-xl" v-for="data in dataContent">
        <figure class="px-10 pt-10">
          <img
            :src="data.image_url"
            alt="Shoes"
            class="rounded-xl" />
        </figure>
        <div class="card-body items-center text-center">
          <h2 class="card-title">{{ data.title }}!</h2>
          <p>{{ data.content }}</p>
          <p>By. {{ data.user?.name || 'Nama tidak tersedia' }}</p>
          <p>{{ new Date(data.created_at).toLocaleDateString() }}</p>
          <div class="card-actions">
            <RouterLink :to="{ name: 'ContentId', params: { id: data.id } }" class="btn btn-accent btn-sm sm:btn-md">Lihat</RouterLink>
            <button class="btn btn-secondary btn-sm sm:btn-md" @click="openEditDialog(data)">
            Edit</button>
            <button class="btn btn-primary btn-sm sm:btn-md" @click="openDeleteDialog(data)">
              Hapus
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>
  <div class="flex justify-center mb-5 space-x-2">
        <button
          class="btn btn-sm sm:btn-md"
          @click="previousPage"
          :disabled="!pagination.prev_page_url"
        >
          «
        </button>
        <button class="btn btn-sm sm:btn-md">{{ currentPage }}</button>
        <button
          class="btn btn-sm sm:btn-md"
          @click="nextPage"
          :disabled="!pagination.next_page_url"
        >
          »
        </button>
      </div>
  <ContentDiaglogComponent
    @closeModal="closeModal"
    :data="selectedContent"
    @save="getAll"
    @update:visible="showModal = $event"
    :visible="showModal"
  />

  <DeleteDialogComponent
    :visible="deleteDialogVisible"
    :itemName="selectedContent?.title"
    @update:visible="deleteDialogVisible = $event"
    @confirmDelete="deleteContent"
  />
</template>
<script setup>
import { customeApi } from '@/api';
import LoadingComponent from '@/components/LoadingComponent.vue';
import { useAuthStore } from '@/stores/AuthStore';
import { ref, onMounted, watch } from 'vue';
import { RouterLink } from 'vue-router';
import DeleteDialogComponent from '@/components/DeleteDialogComponent.vue';
import ContentDiaglogComponent from '@/components/ContentDiaglogComponent.vue';

const authStore = useAuthStore();
const showModal = ref(false);
const deleteDialogVisible = ref(false);
const dataContent = ref([]);
const selectedContent = ref(null);
const searchQuery = ref('');
const currentPage = ref(1);
const pagination = ref({
  prev_page_url: null,
  next_page_url: null,
  total: 0,
  per_page: 8,
});

const openModal = () => {
  showModal.value = true;
};

const openNewDialog = () => {
  selectedContent.value = null;
  openModal();
};

const openEditDialog = (content) => {
  selectedContent.value = content;
  openModal();
};

const closeModal = () => {
  showModal.value = false;
  selectedContent.value = null;
};

const getAll = async () => {
  authStore.isLoading = true;
  try {
    const params = {
      page: currentPage.value,
      query: searchQuery.value || '',
    };
    const { data } = await customeApi.get('/dashboard', {
      params,
      headers: {
        Authorization: `Bearer ${authStore.userToken}`,
      },
    });

    dataContent.value = data.data.data;
    pagination.value.prev_page_url = data.data.prev_page_url;
    pagination.value.next_page_url = data.data.next_page_url;
    pagination.value.total = data.data.total;
    pagination.value.per_page = data.data.per_page;
  } catch (error) {
    console.error('Failed to fetch content:', error);
  } finally {
    authStore.isLoading = false;
  }
};

const previousPage = () => {
  if (pagination.value.prev_page_url) {
    currentPage.value -= 1;
    getAll();
  }
};

const nextPage = () => {
  if (pagination.value.next_page_url) {
    currentPage.value += 1;
    getAll();
  }
};

const openDeleteDialog = (content) => {
  selectedContent.value = content;
  deleteDialogVisible.value = true;
};

const deleteContent = async () => {
  if (!selectedContent.value) return;
  try {
    await customeApi.delete(`/content/${selectedContent.value.id}`, {
      headers: {
        Authorization: `Bearer ${authStore.userToken}`,
      },
    });
    getAll();
    deleteDialogVisible.value = false;

  } catch (error) {
    console.log('Failed to delete content:', error);
  }
};

const searchContent = () => {
  currentPage.value = 1;
  getAll();
};

watch(searchQuery, () => {
  searchContent();
});

onMounted(() => {
  getAll();
});
</script>

