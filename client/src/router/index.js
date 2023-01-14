import { createRouter, createWebHistory } from "vue-router";

const Home = () => import("@/views/Home.vue");

const routes = [
  {
    name: "home",
    path: "/:id",
    component: Home,
  },
  {
    path: "/:catchAll(.*)*",
    redirect: { name: "home", params: { id: `f${(+new Date).toString(16)}` } },
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
