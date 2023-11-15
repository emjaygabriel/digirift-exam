// imports
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import { loadFonts } from './plugins/webfontloader'

// Font awesome library imports - unfortunately you have to import and add one icon each. 
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faCircleCheck } from '@fortawesome/free-solid-svg-icons'
import { faCirclePlus } from '@fortawesome/free-solid-svg-icons'
import { faTrash } from '@fortawesome/free-solid-svg-icons'
import { faCheckCircle } from '@fortawesome/free-regular-svg-icons'
library.add(faCircleCheck,faCheckCircle,faCirclePlus,faTrash)
loadFonts()


const eventBus = createApp({});
eventBus.config.globalProperties.$bus = eventBus;
export default eventBus;

// create app
createApp(App)
  .use(router)
  .use(store)
  .use(vuetify)
  .component('font-awesome-icon', FontAwesomeIcon)
  .mount('#app')


  
