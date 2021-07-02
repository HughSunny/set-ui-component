<template>
  <div class="upload-box">
    <el-upload
      v-if=" isEdit && type === 'file' && limit > fileList.length"
      ref="upload"
      v-loading="loading"
      :action="action"
      :show-file-list="false"
      :on-success="handleSuccess"
      :before-upload="handleBeforeUpload"
      :http-request="uploadFile"
      :limit='limit'
    >
      <el-button slot="trigger" size="small">
        <i class="el-icon-plus"/>
        添加
      </el-button>
      <div slot="tip" v-if="tip" class="el-upload__tip">{{tip}}}</div>
    </el-upload>


    <div v-if="type === 'file'" class="set-upload__file-list">
      <div v-for="(item,index) in fileList" :key="index" class="file-item">
        <a class="link" :href="item.url" target="_blank">{{ item.name || '文件' }}</a>
        <el-button v-if="isEdit" type="text" icon="el-icon-close" @click="deleteFile(index)" style="margin-left: 20px"/>
      </div>
    </div>

    <el-upload
      v-if="isEdit && type === 'image'"
      ref="upload"
      v-loading="loading"
      :action="action"
      list-type="picture-card"
      :file-list="fileList"
      :on-success="handleSuccess"
      :before-upload="handleBeforeUpload"
      :http-request="uploadFile"
      :on-preview="openImageViewer"
      :on-remove="deletePicFile"
      :limit="limit"
    >
      <i class="el-icon-plus"/>
    </el-upload>

    <div v-if="type === 'image' && !isEdit && fileList.length > 0" class="set-upload__img-list">
      <div v-for="(image,index) in fileList" :key="image.index" class="img-item">
        <el-image class="img" :src="image.url" fit="contain"/>
        <div class="img-actions">
          <i class="el-icon-zoom-in preview" @click="openImageViewer(image)"/>
        </div>
      </div>
    </div>
    <el-image-viewer
      v-if="showViewer"
      :on-close="closeImageViewer"
      :url-list="viewImage"
    />
  </div>
</template>

<script>
  import {isFileRequestExist, getFileRequest, getFileHost} from '../../utils/config'
  // import { ElUpload, ElButton, ElImage } from 'element-ui'
  export default {
    name:"SetUpload",
    model: {
      prop: 'fileUrl',
      event: 'input'
    },
    components: {
      'el-image-viewer': () => import('element-ui/packages/image/src/image-viewer'),
      // ElUpload,
      // ElButton,
      // ElImage
    },
    props: {
      action: {
        type: String,
        default() {
          console.log('SetUpload  action =>  fileHost =>', getFileHost())
          return getFileHost() || ''
        }
      },

      isEdit: {
        type: Boolean,
        default() {
          return true
        }
      },
      type: {
        type: String,
        default() {
          return 'file'
        }
      },

      limit: {
        type: Number,
        default() {
          return 1
        }
      },
      limitSize: {
        type: Number,
        default() {
          return -1
        }
      },
      tip: {
        type: String,
        default() {
          return null
        }
      },
      // fileUrl 和dataList 取其一
      fileUrl: {
        type: String,
        default() {
          return ''
        }
      },

      dataList: {
        type: Array,
        default() {
          return null
        }
        // { name, url, path}
      },

      fileSeparator: {
        type: String,
        default() {
          // return '☩',
          return ','
        }
      },
      needFileName: {
        type: Boolean,
        default() {
          return true
        }
      },
      httpRequest: Function,

      resKey: {
        type: String,
        default() {
          // return '☩',
          return 'filePath'
        }
      },

    },
    data() {
      // console.log(this.$props)
      let fileList = []
      if (this.fileUrl) {
        fileList = [...this.getFileListFromUrl(this.fileUrl)]
      }
      return {
        loading: false,
        fileList,
        showViewer: false,
        viewImage: []
      }
    },
    computed: {},
    watch: {
      fileUrl: function (val) {
        this.fileList = [...this.getFileListFromUrl(val)]
      },
      dataList: function (val) {
        this.fileList = [...val]
      }
    },
    mounted() {
    },
    methods: {
      getFileListFromUrl(url) {
        if (url) {
          let fileArray = url.split(this.fileSeparator)
          if (fileArray) {
            return fileArray.map((item) => this.getFileFromUrl(item))
          }
        }
        return []
      },

      getFileFromUrl(fileUrl) {
        const fileInfo = fileUrl.split('|||')
        const filePath = fileInfo[0]
        const fileName = fileInfo.length > 1 ? fileInfo[1] : null
        return {
          // url: this.action + `/${this.type}/` + filePath,
          url: this.action + '/' + filePath,
          path: filePath,
          name: fileName
        }
      },

      getUrlFromList() {
        const needFileName = this.needFileName || this.fileUrl.indexOf('|||') !== -1
        const fileStrArray = this.fileList.map((item) => {
          if (needFileName) {
            return item.path + '|||' + item.name
          } else {
            return item.path
          }
        })
        return fileStrArray.join(this.fileSeparator)
      },
      handleSuccess(res, file) {
        const newFile = {
          name: file.name,
          // url: this.action + `/${this.type}/` + res.filePath,
          url: this.action + '/' + res[this.resKey],
          path: res[this.resKey]
        }
        if (this.limit > 1) {
          this.fileList.push(newFile)
        } else {
          this.fileList = [newFile]
        }
        this.notifyResult(newFile, this.fileList, 'add')
      },

      handleBeforeUpload(file) {
        // 这里做可以做文件校验操作
        if (this.type === 'image') {
          const isIMG = file.type === 'image/jpg' || file.type === 'image/jpeg' || file.type === 'image/png'
          if (!isIMG) {
            this.$message.warning('上传图片只支持jpg、jpeg、png格式!')
            return false
          }
        } else if (this.type === 'file') {
          console.log('file')
        }

        if (this.limitSize != -1 && file.size > this.limitSize * 1024 * 1024) {
          this.$message.warning(`上传文件过大,文件不超过${this.limitSize}M`)
          return false
        }
      },

      notifyResult(doingFile, fileList, type) {
        let fileStr = this.getUrlFromList();
        fileStr = fileStr ? fileStr : null

        let parent = this.$parent;
        if (parent.elForm) {
          // el-form
          if (this.dataList == null) {
            // fileUrl 直接传值
            this.$emit('input', fileStr)
            this.$parent.$emit('el.form.change', fileStr)
          } else {
            // fileList 通过回调
          }
        }
        // debugger
        this.$emit('change', {
          file: doingFile,
          fileList,
          fileStr,
          action: type
        },)

      },

      uploadFile(params) {
        console.log('SetUpload  uploadFile => ', isFileRequestExist())
        if (isFileRequestExist()) {
          getFileRequest()(params.file).then(data => {
              params.onSuccess(data)
          }).catch(error => {
              params.onError(error)
          })
        }
      },

      deleteFile(index) {
        const targetFile = {...this.fileList[index]}
        const orgFileList = [...this.fileList];
        orgFileList.splice(index, 1)
        this.fileList = [...orgFileList];
        this.notifyResult(targetFile, orgFileList, 'delete')
      },

      // 删除图片
      deletePicFile(file, fileList) {
        const orgFileList = this.fileList.filter(v => v.path !== file.path)
        this.fileList = [...orgFileList];
        this.notifyResult(file, orgFileList, 'delete')
      },

      openImageViewer(file) {
        this.showViewer = true
        this.viewImage = [file.url]
      },
      closeImageViewer() {
        this.showViewer = false
        this.viewImage = []
      }
    }
  }
</script>

<!--<style scoped lang="scss">-->
<!--  /*@import '@/styles/variables.scss';*/-->

<!--  .file-list {-->
<!--    display: flex;-->
<!--    flex-direction: column;-->
<!--    flex-wrap: wrap;-->
<!--    margin-left: 10px;-->
<!--    /*align-items: center;*/-->
<!--    .link {-->
<!--      color: #409EFF;-->
<!--    }-->

<!--    .file-item {-->
<!--      margin-right: 10px;-->
<!--      display: flex;-->
<!--      align-items: center;-->
<!--    }-->
<!--  }-->

<!--  .img-list {-->
<!--    display: flex;-->
<!--    flex-wrap: wrap;-->

<!--    .img-item {-->
<!--      position: relative;-->
<!--      margin: 0 15px 15px 0;-->
<!--      background-color: #fff;-->
<!--      border: 1px solid #c0ccda;-->
<!--      border-radius: 3px;-->
<!--      width: 140px;-->
<!--      height: 140px;-->
<!--      overflow: hidden;-->
<!--      display: flex;-->
<!--      align-items: center;-->
<!--      justify-content: center;-->

<!--      .img {-->
<!--        position: relative;-->
<!--        width: 140px;-->
<!--      }-->

<!--      .img-actions {-->
<!--        position: absolute;-->
<!--        width: 100%;-->
<!--        height: 100%;-->
<!--        left: 0;-->
<!--        top: 0;-->
<!--        cursor: default;-->
<!--        text-align: center;-->
<!--        color: #fff;-->
<!--        opacity: 0;-->
<!--        font-size: 20px;-->
<!--        background-color: rgba(0, 0, 0, 0.5);-->
<!--        transition: opacity .5s;-->
<!--        display: flex;-->
<!--        align-items: center;-->
<!--        justify-content: center;-->

<!--        .preview, .delete {-->
<!--          font-size: 26px;-->
<!--          margin: 0 14px;-->
<!--          cursor: pointer;-->
<!--        }-->

<!--        &:hover {-->
<!--          opacity: 1;-->
<!--        }-->
<!--      }-->
<!--    }-->
<!--  }-->
<!--</style>-->
