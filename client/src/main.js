import App from '@/App.vue'
import router from '@/router/index.js'
import '@/style.css'
import { createPinia } from 'pinia'
import { createApp } from 'vue'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import 'vuetify/styles'

const vuetify = createVuetify({
  components,
  directives,
})

createApp(App)
  .use(vuetify)
  .use(createPinia())
  .use(router)
  .mount('#app')
