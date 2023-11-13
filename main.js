import { createApp } from 'vue';
import App from './App.vue';
import router from "@/router"; // 1.引入router
import store from "@/store";
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/reset.css';
/*import ViewUIPlus from 'view-ui-plus'
import  'view-ui-plus/dist/styles/viewuiplus.css'*/
var app = createApp(App);
app.use(Antd).use(router).use(store);
app.mount('#app');
// createApp(App).mount('#app')
//# sourceMappingURL=main.js.map


