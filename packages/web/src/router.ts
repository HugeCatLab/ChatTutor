import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: () => import('#/pages/index.vue') },
    { path: '/chat', component: () => import('#/pages/chat/index.vue') },
    { path: '/chat/:id', component: () => import('#/pages/chat/index.vue') },
  ],
})

export default router