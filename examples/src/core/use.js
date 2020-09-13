import Vue from 'vue';
import Antd from 'ant-design-vue';
import ElementUI from "element-ui";
import 'ant-design-vue/dist/antd.less';
import 'element-ui/lib/theme-chalk/index.css';

import SetUI from 'set-ui';
import 'set-ui/lib/styles/set-ui-vue.css';

console.log('Antd:', Antd);
console.log('SetUI:', SetUI);
Vue.use(ElementUI);
Vue.use(Antd);
Vue.use(SetUI);
