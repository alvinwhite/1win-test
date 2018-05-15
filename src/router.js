import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
    routes: [
        {
            path: '/',
            name: 'FractionCalculator',
            component: () => import('@/components/FractionCalcualtor.vue')
        },
        {
            path: '/comments',
            name: 'CommentsBoard',
            component: () => import('@/components/ComemntsBoard.vue')
        }
    ]
})