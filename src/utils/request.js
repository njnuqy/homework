import axios from 'axios'
import router from 'vue-router'

// 创建一个新的axios对象
const request = axios.create({
    baseURL:"http://localhost:8081",
    timeout:30000
})

// request拦截器
// 可以在发送请求前做一些处理
// 如统一加token或者做一些加密处理
request.interceptors.request.use(config => {
    config.headers['Content-Type'] = 'application/json;charset=utf-8'
    //问题出在这里：如果LocalStorage中没有"user"键，localStorage.getItem("user") 返回的是 null，
    //而不是一个有效的JSON字符串。当你尝试解析 null 为JSON对象时，会出现错误，因为 null 不是一个有效的JSON。
    //var user = JSON.parse(localStorage.getItem("user") || {})
    var user = JSON.parse(localStorage.getItem("user") || '{"token": ""}')
     config.headers['token'] = user.token
    return config
},error => {
    console.error("request error" + error)
    return Promise.reject(error)
})

request.interceptors.response.use(
    response => {
        var res= response.data
        if(res.code === "400"){
            router.push('/login')
        }
        return res;
    }
)

export default request