<template>
  <div>
    <div v-show="!dialogFormVisible">
      <query ref="querycomponent" :list-query="listQuery" :dialog-width="'1000px'" :api="api">
        <div slot="queryFilter">
          <el-button v-waves class="filter-item" size="small" type="primary" icon="el-icon-edit" @click="handleCreate">{{ $t('table.add') }}</el-button>
        </div>
        <el-table-column slot="tableColumn" :label="$t('table.photo')" align="center">
          <template slot-scope="scope">
            <img :src="scope.row.service_image || ''" style="max-width: 100%" alt="">
          </template>
        </el-table-column>
        <el-table-column slot="tableColumn" :label="$t('table.title')" prop="service_title" align="center"/>
        <el-table-column slot="tableColumn" :label="$t('table.contentValidity')" prop="summary" align="center"/>
        <el-table-column slot="tableColumn" :label="$t('table.actions')" align="center" width="230" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="handleUpdate(scope.row.service_id)">{{ $t('table.edit') }}</el-button>
            <el-button size="mini" type="danger" @click="handleModifyStatus(scope.row.service_id)">{{ $t('table.delete') }}
            </el-button>
          </template>
        </el-table-column>
      </query>
    </div>
    <div v-show="dialogFormVisible" class="app-container">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="right" label-width="80px" style="width: 100%;">
        <el-form-item :label="$t('table.sort')">
          <el-input v-model="temp.order" placeholder="数字越大越在前"/>
        </el-form-item>
        <el-form-item :label="$t('table.photo')">
          <uploadimg :imglist="imgList" @getimg="getImgurl"/>
        </el-form-item>
        <el-form-item :label="$t('table.title')">
          <el-input v-model="temp.service_title"/>
        </el-form-item>
        <el-form-item :label="$t('table.contentValidity')">
          <el-input :autosize="{ minRows: 4, maxRows: 8 }" v-model="temp.summary" resize="none" type="textarea"/>
        </el-form-item>
        <el-form-item :label="$t('table.activeinner')">
          <tinymce ref="tiny" :height="400" v-model="temp.content"/>
        </el-form-item>
      </el-form>
      <div class="filter-container">
        <el-button @click="dialogFormVisible = false">{{ $t('table.cancel') }}</el-button>
        <el-button v-if="dialogStatus=='create'" :loading="addloading" type="primary" @click="createData">{{ $t('table.confirm') }}</el-button>
        <el-button v-else :loading="editloading" type="primary" @click="updateData">{{ $t('table.confirm') }}</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import query from '@/components/queryTable'
import Tinymce from '@/components/Tinymce'
import uploadimg from '@/components/Upload/uploadImg'
import waves from '@/directive/waves' // 水波纹指令

export default {
  name: 'Tab',
  directives: {
    waves
  },
  components: {
    query,
    Tinymce,
    uploadimg
  },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: null,
      addloading: false,
      editloading: false,
      api: {
        fetch: '/service_guide',
        add: '/service_guide',
        edit: '/service_guide',
        info: '/service_guide',
        delete: '/service_guide'
      },
      imgList: [],
      value4: '',
      imageUrl: '',
      typedata: [
        { lable: '读者须知', value: 1 },
        { lable: '办证指南', value: 2 },
        { lable: '服务时间', value: 3 },
        { lable: '服务区布局', value: 4 },
        { lable: '借阅服务', value: 5 },
        { lable: '阅读推广服务', value: 6 },
        { lable: '你读书我买单服务', value: 7 },
        { lable: '移动平台服务', value: 8 }
      ],
      listLoading: true,
      listQuery: {},
      isload: false,
      statusOptions: ['published', 'draft', 'deleted'],
      showReviewer: false,
      temp: {},
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '修改',
        create: '新增'
      },
      dialogPvVisible: false,
      pvData: [],
      rules: {
        type: [{ required: true, message: 'type is required', trigger: 'change' }],
        timestamp: [{ type: 'date', required: true, message: 'timestamp is required', trigger: 'change' }],
        title: [{ required: true, message: 'title is required', trigger: 'blur' }]
      },
      downloadLoading: false
    }
  },
  mounted() {
    this.$refs.querycomponent.getList()
  },
  methods: {
    handleModifyStatus(id) {
      this.$refs.querycomponent.deleteData(id)
    },
    handleFilter() {
      this.$refs.querycomponent.handleFilter()
    },
    resetTemp() {
      this.temp = {}
    },
    handleCreate() {
      this.resetTemp()
      this.$refs.tiny.setContent('')
      this.imgList = []
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.addloading = true
          var formData = new FormData()
          for (var j in this.temp) {
            formData.append(j, this.temp[j])
          }
          const config = {
            headers: { 'Content-Type': 'multipart/form-data' }
          }
          this.$r.post(this.api.add, formData, config).then((re) => {
            if (re.data.status === 'success') {
              this.dialogFormVisible = false
              this.$refs.querycomponent.getList(1)
              this.$notify({
                title: '成功',
                message: '创建成功',
                type: 'success',
                duration: 2000
              })
            } else {
              this.$notify.error({
                title: '失败',
                message: re.data.msg,
                duration: 2000
              })
            }
            this.addloading = false
          }).catch(errs => {
            this.addloading = false
            console.log(errs)
          })
        }
      })
    },
    handleUpdate(row) {
      if (this.isload) {
        return false
      }
      this.listLoading = true
      this.isload = true
      this.dialogStatus = 'update'
      this.imgList = []
      this.$r.get(this.api.info + '/' + row).then(re => {
        if (re.data.status === 'success') {
          this.dialogFormVisible = true
          this.temp = re.data.result
          this.imgList.push({ name: re.data.result.service_title, url: re.data.result.service_image })
          this.$refs.tiny.setContent(re.data.result.content || '')
        } else {
          this.$notify.error({
            title: '失败',
            message: '获取失败',
            duration: 2000
          })
        }
        this.listLoading = false
        this.isload = false
      }).catch(errs => {
        this.listLoading = false
        this.isload = false
        console.log(errs)
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.listLoading = true
          this.editloading = true
          var formData = new FormData()
          for (var j in this.temp) {
            formData.append(j, this.temp[j])
          }
          const config = {
            headers: { 'Content-Type': 'multipart/form-data' }
          }
          this.$r.post(this.api.edit, formData, config).then((re) => {
            if (re.data.status === 'success') {
              this.$refs.querycomponent.getList()
              this.dialogFormVisible = false
              this.$notify({
                title: '成功',
                message: '更新成功',
                type: 'success',
                duration: 2000
              })
            } else {
              this.$notify.error({
                title: '失败',
                message: '修改失败',
                duration: 2000
              })
            }
            this.listLoading = false
            this.editloading = false
          }).catch(errs => {
            this.listLoading = false
            this.editloading = false
            console.log(errs)
          })
        }
      })
    },
    handleDelete(row) {
      this.$refs.querycomponent.handleDelete(row)
    },
    handleDownload() {
      this.$refs.querycomponent.handleDownload()
    },
    getImgurl(e) {
      this.temp.image = e
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>

</style>
