import Vue from 'vue'
import Router from 'vue-router'
import orderDetail from '@/page/orderDetail/index'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/orderDetail/:unikey/:id',
      component: orderDetail,
      name: "orderDetail"
    }
  ]
})
