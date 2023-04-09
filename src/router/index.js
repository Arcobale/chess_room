import { createRouter, createWebHistory } from "vue-router"


const router = createRouter({
    routes: [
        {
            path: '/',
            redirect: '/home',
            name: '首页',
            component: () => import('@/components/Home'),
        },
        {
            path: '/home',
            name: '游戏入口',
            component: () => import('@/components/Home'),
        },
        {
            path: '/golang',
            name: '五子棋',
            component: () => import('@/components/Gobang'),
        },
        {
            path: '/othello',
            name: '黑白棋',
            component: () => import('@/components/Othello'),
        },
    ],
    history: createWebHistory(),
})

export default router;