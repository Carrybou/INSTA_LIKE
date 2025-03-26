<template>
        <div v-if="content">
          <div class="post-card">
            <div class="post-header d-flex align-items-center p-3">
              <a :href="`/profile/${content.author}`">
                <img src="@/assets/avatar.png" alt="User Avatar" class="rounded-circle me-2" style="width: 30px; height: 30px;">
              </a>
              <span class="fw-bold">{{ authorEmail }}</span>
            </div>
            <img :src="content.img ? `https://localhost${content.img}` : '@/assets/placeholder.png'" class="post-image" alt="Post Image">
            <div class="post-content p-3">
              <div class="d-flex justify-content-between align-items-center">
                <div>
                  <span class="fw-bold">{{ authorEmail }} : </span>
                  <span class="post-description">{{ content.content }}</span>
                </div>
                <button @click="toggleComments" class="btn btn-link p-0 text-decoration-none text-muted">
                  Voir les {{ content.comments.length }} commentaires
                </button>
              </div>
              <Comment v-if="showComments" :slug="content.slug" :commentUrls="content.comments" @commentPosted="refreshContent" />
            </div>
            <hr class="my-0 border-secondary">
          </div>
        </div>
        <div v-else>
          <p>Error: Content not available</p>
        </div>
      </template>

      <script setup>
      import { ref, onMounted } from 'vue';
      import api from '../services/api';
      import Comment from '../components/Comment.vue';

      const props = defineProps({
        slug: {
          type: String,
          required: true
        }
      });

      const content = ref(null);
      const showComments = ref(false);
      const authorEmail = ref('');

      const toggleComments = () => {
        showComments.value = !showComments.value;
      };

      const refreshContent = async () => {
        try {
          const response = await api.getContent(props.slug);
          content.value = response.data;
          const userResponse = await api.getUser(content.value.author);
          authorEmail.value = userResponse.data.email;
        } catch (error) {
          console.error('Error refreshing content:', error);
        }
      };

      onMounted(async () => {
        await refreshContent();
      });
      </script>

      <style scoped>
      .post-card {
        background-color: #121212;
        border-radius: 0;
        margin-bottom: 10px;
      }

      .post-image {
        width: 100%;
        height: auto;
      }

      .post-content {
        display: flex;
        flex-direction: column;
      }

      .post-description {
        margin-bottom: 10px;
      }
      </style>
