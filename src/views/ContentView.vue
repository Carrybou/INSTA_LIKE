<template>
  <div>
    <h1>{{ content.title }}</h1>
    <img :src="content.img" alt="content image" />
    <p>{{ content.content }}</p>
    <div v-for="comment in comments" :key="comment.uuid">
      <p>{{ comment.content }}</p>
    </div>
    <div v-if="isAuthenticated">
      <textarea v-model="newComment"></textarea>
      <button @click="postComment">Post Comment</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import api from '../services/api';

const route = useRoute();
const content = ref({});
const comments = ref([]);
const newComment = ref('');
const isAuthenticated = !!localStorage.getItem('token');

onMounted(async () => {
  const response = await api.getContent(route.params.slug);
  content.value = response.data;
  const commentsResponse = await api.getComments();
  comments.value = commentsResponse.data.member;
});

const postComment = async () => {
  await api.createComment({ content: newComment.value, contentId: content.value.uuid });
  newComment.value = '';
  const commentsResponse = await api.getComments();
  comments.value = commentsResponse.data.member;
};
</script>
