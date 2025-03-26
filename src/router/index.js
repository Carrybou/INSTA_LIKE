import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import ContentView from '../views/ContentView.vue';
import LoginView from '../views/LoginView.vue';
import LogoutView from '../views/LogoutView.vue';
import RegisterView from '../views/RegisterView.vue';
import AdminView from '../views/AdminView.vue';
import PostView from '../views/PostView.vue';

const routes = [
  { path: '/', name: 'Home', component: HomeView },
  { path: '/content/:slug', name: 'Content', component: ContentView },
  { path: '/login', name: 'Login', component: LoginView },
  { path: '/logout', name: 'Logout', component: LogoutView,},
  { path: '/register', name: 'Register', component: RegisterView },
  { path: '/admin', name: 'Admin', component: AdminView, meta: { requiresAuth: true, roles: ['admin'] } },
  { path: '/posts', name: 'Posts', component: PostView, },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to, from, next) => {
  if (to.meta.requiresAuth) {
    const token = localStorage.getItem('token');
    if (!token) {
      next('/login');
    } else {
      try {
        const user = await api.get('http://localhost:8000/api/user'); // vérifier l'URL
        const userRoles = user.roles;
        const requiredRoles = to.meta.roles;

        if (requiredRoles.some(role => userRoles.includes(role))) {
          next();
        } else {
          next('/login');
        }
      } catch (e) {
        next('/login');
      }
    }
  } else {
    next();
  }
});

export default router;
