<template>
        <div>
          <nav class="navbar navbar-dark bg-dark">
            <div class="container">
              <a class="navbar-brand" href="#">InstaLike</a>
              <i v-if="isAuthenticated" @click="navigateToPost" class="fas fa-plus text-light" style="cursor: pointer;"></i>

              <div>
                <button v-if="!isAuthenticated" @click="navigateToLogin" class="btn btn-outline-light me-2">Login</button>
                <button v-if="!isAuthenticated" @click="navigateToRegister" class="btn btn-outline-light me-2">Register</button>
                <span v-if="isAuthenticated" class="text-light me-2">{{ userEmail }}</span>
                <button v-if="isAuthenticated" @click="navigateToLogout" class="btn btn-outline-light me-2">Logout</button>
              </div>
            </div>
          </nav>

          <div class="container content-container">
            <div class="row">
              <div class="col-12 col-md-8 offset-md-2">
                <ContentView v-for="slug in slugs" :key="slug" :slug="slug" />
              </div>
            </div>
          </div>
        </div>
      </template>

      <script setup>
      import { useRouter } from 'vue-router';
      import { ref, onMounted } from 'vue';
      import api from '../services/api';
      import ContentView from './ContentView.vue';

      const slugs = ref([]);

      onMounted(async () => {
        const response = await api.getContents();
        slugs.value = response.data.member.map(content => content.slug);
      });

      const router = useRouter();
      const isAuthenticated = !!localStorage.getItem('token');
      const userEmail = localStorage.getItem('email');

      const navigateToLogin = () => {
        router.push({ name: 'Login' });
      };

      const navigateToRegister = () => {
        router.push({ name: 'Register' });
      };

      const navigateToLogout = () => {
        router.push({ name: 'Logout' });
      };

      const navigateToPost = () => {
        router.push({ name: 'Posts' });
      };
      </script>

      <style scoped>
      .navbar {
        background-color: #1c1c1c !important;
        border-bottom: 1px solid #333;
      }

      .content-container {
        padding-top: 20px;
        background-color: #121212;
        color: #fff;
      }

      @media (min-width: 600px) {
        .content-container {
          padding-top: 40px;
        }
      }
      </style>
