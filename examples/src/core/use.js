import Vue from 'vue';
import Antd from 'ant-design-vue';
import ElementUI from "element-ui";
import 'ant-design-vue/dist/antd.less';
import 'element-ui/lib/theme-chalk/index.css';

import SetUI from 'set-ui/src';
import 'set-ui-style/index.scss';

console.log('Antd:', Antd);
console.log('SetUI:', SetUI);
Vue.use(Antd);
Vue.use(ElementUI);
Vue.use(SetUI);
