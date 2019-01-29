<!--
    Administrator
    2018/9/20 17:12
 -->
<template>
  <el-upload
    ref="imgup"
    :auto-upload="false"
    :on-change="getImgurl"
    :on-remove="handleRemove"
    :on-exceed="handleExceed"
    :file-list="imglist"
    :limit="1"
    accept="image/*"
    list-type="picture-card"
    class="avatar-uploader"
    action="https://jsonplaceholder.typicode.com/posts/">
    <i class="el-icon-plus"/>
  </el-upload>
</template>

<script>
export default {
  name: 'UploadImg',
  props: {
    imglist: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data() {
    return {
      imgurls: ''
    }
  },
  methods: {
    getImgurl(file) {
      this.$emit('getimg', file.raw)
    },
    handleRemove(file) {
      this.$emit('getimg', '')
    },
    handleExceed() {
      this.$message.warning(`当前限制上传 1 个图片！`)
    },
    clearFile() {
      this.$refs.imgup.clearFiles()
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>

</style>
