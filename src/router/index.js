import { createRouter, createWebHashHistory } from 'vue-router';
const routes = [
  {
    path:'/',
    redirect:'/tree',
  },
  {
    path:'/tree',
    name:'TreePage',
    component:(()=>import('@/pages/TreePage.vue'))
  }
];

const router = createRouter({
  history: createWebHashHistory(process.env.BASE_URL),
  routes,
});

export default router;
