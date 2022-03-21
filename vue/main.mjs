import Vue from 'vue'
import Router from 'vue-router'
import { Portal, PortalTarget } from 'portal-vue'
import Vuetify from 'vuetify'
import routes from './routes.mjs'
import 'vuetify/dist/vuetify.min.css'
import '@mdi/font/css/materialdesignicons.min.css'

Vue.use(Vuetify)
Vue.component('Portal', Portal)
Vue.component('PortalTarget', PortalTarget)

Vue.use(Router)

const router = new Router({
  mode: 'hash',
  base: '/',
  linkActiveClass: 'active',
  scrollBehavior (to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    }
    return { x: 0, y: 0 }
  },
  routes: routes
})

const vm = window.vm = new Vue({
  vuetify: new Vuetify({}),
  router: router
})

vm.$mount('#app')
