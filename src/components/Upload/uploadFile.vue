<template>
  <div>
    <uploader
      ref="uploader"
      :options="options"
      :file-status-text="statusText"
      class="uploader-example"
      @file-success="filesuccess"
      @file-added="fileadded"
      @file-error="fileError"
      @file-removed="fileremove">
      <!--@complete="filecomplete"-->
      <uploader-unsupport/>
      <uploader-btn>{{ $t('table.selectfile') }}</uploader-btn>
      <uploader-list/>
    </uploader>
  </div>
</template>

<script>
import Vue from 'vue'
import store from '@/store'
import uploader from 'vue-simple-uploader'
import { getToken } from '@/utils/auth'
Vue.use(uploader)
export default {
  data() {
    return {
      options: {
        target: store.getters.url + '/upload-video', // '//jsonplaceholder.typicode.com/posts/',
        action: 'post',
        testMethod: 'post',
        testChunks: false,
        parseTimeRemaining: this.parsetime,
        chunkSize: 4 * 1024 * 1024,
        headers: {
          Authorization: 'Bearer ' + getToken()
        }
      },
      filenum: 0,
      fileList: [],
      file: {},
      re: {},
      statusText: {
        success: '成功了',
        error: '出错了',
        uploading: '上传中',
        paused: '暂停中',
        waiting: '等待中'
      }
    }
  },
  methods: {
    parsetime(timeRemaining, parsedTimeRemaining) {
      return parsedTimeRemaining
        .replace(/\syears?/, '年')
        .replace(/\days?/, '天')
        .replace(/\shours?/, '小时')
        .replace(/\sminutes?/, '分钟')
        .replace(/\sseconds?/, '秒')
    },
    fileadded(file) {
      if (this.filenum >= 1) {
        file.ignored = true
      } else {
        this.filenum++
      }
      this.file = file
    },
    fileremove(file) {
      this.$emit('removefile', 'true')
      this.file = {}
      this.filenum--
    },
    removefile() {
      this.$refs.uploader.uploader.cancel()
    },
    // filecomplete() {
    //   console.log('done')
    // },
    fileError(rootFile, file, message, chunk) {
      this.re = JSON.parse(message)
      this.$emit('fileuploadtype', this.re)
    },
    filesuccess(rootFile, file, message, chunk) {
      this.re = JSON.parse(message)
      this.$emit('fileuploadtype', this.re)
    }
  }
}
</script>

<style lang="scss">
  .uploader{
    width: 100%;
  }
  .uploader-example {
    padding: 15px;
    font-size: 12px;
    text-align: center;
    box-shadow: 0 0 10px rgba(0, 0, 0, .4);
  }
  .uploader-example .uploader-btn {
    margin-right: 4px;
  }
  .uploader-example .uploader-list {
    max-height: 440px;
    overflow: auto;
    overflow-x: hidden;
    overflow-y: auto;
  }
  .uploader-file[status="success"] .uploader-file-remove {
    display: block !important;
  }
</style>
