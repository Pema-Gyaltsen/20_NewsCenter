import { createRouter, createWebHistory } from 'vue-router'
import HomeView from './views/HomeView.vue'
import LoginView from './views/LoginView.vue' 

const routes = [
    { 
      path: '/', 
      component: HomeView,
      meta: { requiresAuth: true } // Diese Route braucht einen Login
    },
    { 
      path: '/login', 
      component: LoginView,
      meta: { guestOnly: true }    // Diese Route ist NUR für Gäste (wer eingeloggt ist, braucht kein Login)
    }
  ]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
    const isAuthenticated = localStorage.getItem('user') !== null;

    if (to.meta.requiresAuth && !isAuthenticated) {
      next('/login'); 
    } 
    else if (to.meta.guestOnly && isAuthenticated) {
      next('/'); 
    } 
    else {
      next();
    }
  });
  
  export default router;