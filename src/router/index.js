import PublicLayouts from '@/layouts/PublicLayouts.vue'
import LoginView from '@/views/auth/LoginView.vue'
import RegisterView from '@/views/auth/RegisterView.vue'
import ContentByIdView from '@/views/ContentByIdView.vue'
import ContentUserView from '@/views/ContentUserView.vue'
import ContentView from '@/views/ContentView.vue'
import HomeView from '@/views/HomeView.vue'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component : PublicLayouts,
      children: [
        {
          path: '/',
          name: 'Home',
          component : HomeView
        },
        {
          path: '/content',
          name: 'Content',
          component: ContentView
        },
        {
          path: '/content/:id',
          name: 'ContentId',
          component: ContentByIdView
        },
        {
          path: '/content-user',
          name: 'ContentUser',
          component: ContentUserView
        }
      ],
    },
    {
      path : "/login",
      name : "Login",
      component: LoginView
    },
    {
      path: '/register',
      name : 'Register',
      component: RegisterView
    }
  ],
})

export default router
