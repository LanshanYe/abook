<!--
    Administrator
    2018/9/20 17:12
 -->
<template>
  <el-upload
    :show-file-list="false"
    :headers="usertoken"
    :on-success="handleAvatarSuccess"
    :on-error="handleAvatarError"
    :action="url + '/upload_cover'"
    :data="direct"
    name="image"
    accept="image/*"
    class="avatar-uploader">
    <img v-if="imgsrc" :src="imgsrc.indexOf('http') >= 0 ? imgsrc : httpimg + imgsrc" class="avatar2">
    <i v-else class="el-icon-plus avatar-uploader-icon"/>
  </el-upload>
</template>

<script>
import { getToken } from '@/utils/auth'
import { mapGetters } from 'vuex'
export default {
  name: 'UploadImg',
  props: {
    imgsrc: {
      type: String,
      default: ''
    },
    theindex: {
      type: null,
      default: 'defaultkey'
    }
  },
  data() {
    return {
      usertoken: {
        Authorization: 'Bearer ' + getToken()
      },
      direct: {
        direct_name: 'video_cover'
      }
    }
  },
  computed: {
    ...mapGetters([
      'url'
    ]),
    httpimg: function() {
      const datas = this.url.split('admin')
      const urls = datas[0]
      return urls
    }
  },
  methods: {
    handleAvatarSuccess(res, file) {
      this.$emit('upSuccess', [res, this.theindex])
    },
    handleAvatarError() {
      this.$emit('upError', 'error')
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .avatar2{
    width: 60px;
    max-height: 200px;
  }
</style>
