import { createApp } from 'vue';
import App from './App.vue';
import { createVuetify } from 'vuetify';  // Vuetify 3
import 'vuetify/styles';  // 引入 Vuetify 的样式
import 'vuetify/dist/vuetify.min.css';
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import router from './router';
// 创建 Vuetify 实例
const vuetify = createVuetify({
  icons: {
    sets: {
    },
  },
  components,
  directives
});

createApp(App)
  .use(vuetify)  // 使用 Vuetify
  .use(router)
  .mount('#app');
