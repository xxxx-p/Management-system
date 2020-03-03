import Vue from "vue";
import Router from "vue-router";

import Login from './views/login'
import Layout from '@/components/Layout.vue'
import Home from '@/views/home'
import Member from '@/views/member'
import Supplier from '@/views/supplier'
import Goods from '@/views/goods'
import Staffs from '@/views/staffs'
Vue.use(Router);

export default new Router({
    mode: "history",
    routes: [{
            path: '/login',
            name: 'login',
            component: Login
        }, {
            path: '/',
            name: 'layout',
            component: Layout,
            redirect: '/home',
            children: [{
                path: '/home',
                component: Home,
            }]
        },
        {
            path: '/member',
            name: 'member',
            component: Layout,
            children: [{
                path: '/',
                component: Member,
                meta: { title: '会员管理' }
            }]
        },
        {
            path: '/supplier',
            name: 'supplier',
            component: Layout,
            children: [{
                path: '/',
                component: Supplier,
                meta: { title: '供应商管理' }
            }]
        },
        {
            path: '/goods',
            name: 'goods',
            component: Layout,
            children: [{
                path: '/',
                component: Goods,
                meta: { title: '会员管理' }
            }]
        },
        {
            path: '/staffs',
            name: 'staffs',
            component: Layout,
            children: [{
                path: '/',
                component: Staffs,
                meta: { title: '员工管理' }
            }]
        }
    ]
});