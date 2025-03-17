<template>
  <div>
    <h1>InstaLike</h1>
    <div v-for="content in contents" :key="content.uuid">
      <router-link :to="`/content/${content.slug}`">{{ content.title }}</router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from '../services/api';

const contents = ref([]);

onMounted(async () => {
  const response = await api.getContents();
  contents.value = response.data.member;
});
</script>
