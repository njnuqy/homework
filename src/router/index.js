import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/Login'
import Reg from '../views/Reg.vue'
import Home from '../views/Home.vue'
Vue.use(VueRouter)

const routes = [
    {
        path:'/login',
        name:'Login',
        component:Login,
    },
    {
        path:'/reg',
        name:'reg',
        component:Reg,
    },
    {
        path:'/home',
        name:'home',
        component:Home,
    },
    {
        path:'',
        name:'home',
        component:Home,
    },
]


const router = new VueRouter({
    mode:"history",
    base:process.env.BASE_URL,
    routes:routes
})

export default router