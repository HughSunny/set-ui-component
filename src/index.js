import Button from './packages/button'
import Form from './packages/form'
import FormItem from './packages/form-item'
import Input from './packages/input'
import Notice from './packages/notice/notice.js'
import Upload from './packages/upload'
import { setUploadConfig } from './utils/config'
const components = {
  SetButton: Button,
  SetForm: Form,
  SetFormItem: FormItem,
  SetInput: Input,
  SetUpload: Upload
}

const install = function (Vue, config ) {
  const { fileHost, fileAction, fileRequest} = config || {}
  Object.keys(components).forEach(key => {
    Vue.component(key, components[key]);
  });
  setUploadConfig({fileHost, fileAction, fileRequest})
  // Vue.prototype.$message = Message;
  Vue.prototype.$notice = Notice;
}

export default install