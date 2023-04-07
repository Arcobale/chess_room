import { createRouter, createWebHistory } from "vue-router"


const router = createRouter({
    routes: [
        {
            path: '/',
            redirect: '/golang',
            name: '五子棋',
            component: () => import('@/components/Golang'),
        },
        {
            path: '/golang',
            name: '五子棋',
            component: () => import('@/components/Golang'),
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