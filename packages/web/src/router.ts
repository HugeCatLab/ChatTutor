import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: () => import('#/layout/sidebar-layout.vue'),
      children: [
        { path: '', component: () => import('#/pages/home.vue') },
        { path: 'chat', component: () => import('#/pages/chat/index.vue') },
        { path: 'chat/:id', component: () => import('#/pages/chat/index.vue') },
        {
          path: 'settings',
          component: () => import('#/pages/settings/index.vue'),
        },
      ],
    },
  ],
})

export default router