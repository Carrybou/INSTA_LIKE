<template>
    <div class="comment-section">
      <div class="comments-list p-3">
        <div v-for="comment in comments" :key="comment.uuid" class="comment mb-2">
          <strong>{{ comment.authorEmail }}:</strong> {{ comment.txt }}
        </div>
      </div>
      <div v-if="isLoggedIn" class="comment-form p-3">
        <div class="input-group">
          <textarea v-model="newComment" class="form-control comment-textarea" placeholder="Ajouter un commentaire"></textarea>
          <i class="fas fa-paper-plane text-muted comment-icon" @click="postComment"></i>
        </div>
      </div>
    </div>
  </template>

  <script setup>
  import { ref, onMounted, watch } from 'vue';
  import api from '../services/api';

  const props = defineProps({
    slug: {
      type: String,
      required: true
    },
    commentUrls: {
      type: Array,
      required: true
    }
  });
  const emit = defineEmits(['commentPosted']);
  const slugLink = 'api/contents/' + props.slug;
  const comments = ref([]);
  const newComment = ref('');
  const isLoggedIn = ref(false);

  onMounted(async () => {
    isLoggedIn.value = !!localStorage.getItem('token');
    await fetchComments();
  });

  watch(() => props.commentUrls, async () => {
    await fetchComments();
  });

  const fetchComments = async () => {
    try {
      const commentPromises = props.commentUrls.map(async (url) => {
        const response = await api.getComment(url);
        const userResponse = await api.getUser(response.data.author);
        return {
          ...response.data,
          authorEmail: userResponse.data.email
        };
      });

      comments.value = await Promise.all(commentPromises);
      console.log('Comments:', comments.value);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const postComment = async () => {
    try {
      await api.createComment({ txt: newComment.value, content: slugLink });
      newComment.value = '';
      emit('commentPosted'); // Emit event after posting a comment
    } catch (error) {
      console.error('Error posting comment:', error);
    }
  };
  </script>

  <style scoped>
  .comment-section {
    border-top: 1px solid #333;
  }

  .comments-list {
    max-height: 300px;
    overflow-y: auto;
  }

  .comment-form {
    margin-top: 10px;
    position: relative;
  }

  .comment-textarea {
    background-color: #121212;
    color: #fff;
    height: 40px;
    resize: none;
    padding-right: 30px; /* Space for the icon */
    border: none;
  }

  .comment-textarea:focus {
    outline: none;
    box-shadow: none;
  }

  .comment-icon {
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
    cursor: pointer;
    z-index: 100;
  }
  </style>
