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

    <div class="container mt-3">
      <div class="row">
        <div class="col-12 col-md-8 offset-md-2 d-flex align-items-center">
          <div class="search-bar">
            <i class="fas fa-search search-icon"></i>
            <input v-model="searchQuery" @input="filterContents" type="text" class="form-control search-input" placeholder="Recherche par auteur ou description">
          </div>
          <span @click="toggleSortOrder" :class="['sort-icon', sortOrder]" class="fas fa-sort"></span>
        </div>
      </div>
    </div>

    <div class="container content-container">
      <div class="row">
        <div class="col-12 col-md-8 offset-md-2">
          <ContentView v-for="slug in filteredSlugs" :key="slug" :slug="slug" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { ref, onMounted, computed } from 'vue';
import api from '../services/api';
import ContentView from './ContentView.vue';

const slugs = ref([]);
const contents = ref([]);
const users = ref([]);
const sortOrder = ref('newest');
const searchQuery = ref('');

onMounted(async () => {
  const [contentsResponse, usersResponse] = await Promise.all([
    api.getContents(),
    api.getUsers()
  ]);
  contents.value = contentsResponse.data.member;
  slugs.value = contents.value.map(content => content.slug);
  users.value = usersResponse.data.member;
});

const sortedSlugs = computed(() => {
  const sorted = [...slugs.value];
  sorted.sort((a, b) => {
    const contentA = contents.value.find(content => content.slug === a);
    const contentB = contents.value.find(content => content.slug === b);
    return sortOrder.value === 'newest'
      ? new Date(contentB.Dcrt) - new Date(contentA.Dcrt)
      : new Date(contentA.Dcrt) - new Date(contentB.Dcrt);
  });
  return sorted;
});

const filteredSlugs = computed(() => {
  const query = searchQuery.value.toLowerCase();
  return sortedSlugs.value.filter(slug => {
    const content = contents.value.find(content => content.slug === slug);
    const author = users.value.find(user => user['@id'] === content.author);
    return author?.email.toLowerCase().includes(query) || content.content.toLowerCase().includes(query);
  });

});

const toggleSortOrder = () => {
  sortOrder.value = sortOrder.value === 'newest' ? 'oldest' : 'newest';
};

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

.search-bar {
  position: relative;
  width: 100%;
}

.search-icon {
  position: absolute;
  top: 50%;
  left: 10px;
  transform: translateY(-50%);
  color: #ccc;
}

.search-input {
  background-color: #2c2c2c;
  color: #fff;
  padding-left: 35px;
  border: none;
}
.search-input:focus {
  outline: none;
  box-shadow: none;
  border:none;
}

.sort-icon {
  cursor: pointer;
  transition: transform 0.3s;
  color: #fff;
  margin-left: 10px;
}

.sort-icon.newest {
  transform: rotate(0deg);
}

.sort-icon.oldest {
  transform: rotate(180deg);
}
</style>
