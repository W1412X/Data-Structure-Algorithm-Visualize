import { createRouter, createWebHashHistory } from 'vue-router';
const routes = [
  {
    path:'/',
    name:"IndexPage",
    component:(()=>import('@/pages/IndexPage.vue'))
  },
  {
    path:'/tree',
    name:'TreePage',
    component:(()=>import('@/pages/TreePage.vue'))
  },
  {
    path:'/map',
    name:'MapPage',
    component:(()=>import('@/pages/MapPage.vue'))
  }
];

const router = createRouter({
  history: createWebHashHistory(process.env.BASE_URL),
  routes,
});

export default router;
