<template>
  <div class="app-container">
    <div v-show="dialogFormVisible">
      <div class="filter-container">
        <el-button v-waves class="filter-item" size="small" type="primary" icon="el-icon-upload" @click="uploaddialog = true">上传爱心捐赠单</el-button>
      </div>
      <el-table
        v-loading="listLoading"
        :key="tableKey"
        :data="list"
        border
        stripe
        fit
        highlight-current-row
        style="width: 100%;">
        <slot name="tableColumn"/>
        <el-table-column :label="$t('table.docName')" width="200px" align="center" prop="display_name"/>
        <el-table-column :label="$t('table.docContent')" align="center" prop="value">
          <template slot-scope="scope">
            <div v-html="scope.row.value&&scope.row.value.length > 50 ? scope.row.value.substr(0, 50) + '...' : scope.row.value"/>
          </template>
        </el-table-column>
        <el-table-column :label="$t('table.actions')" align="center" width="230" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button v-waves type="primary" size="mini" @click="view(scope.row.id)">{{ $t('table.edit') }}</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div v-show="!dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="right" label-width="80px" style="width: 100%;">
        <el-form-item :label="$t('table.docName')">
          <el-input v-model="temp.display_name" type="text" size="small" clearable/>
        </el-form-item>
        <el-form-item :label="$t('table.docContent')">
          <tinymce ref="tiny" :height="400" v-model="temp.value"/>
        </el-form-item>
      </el-form>
      <div class="filter-container">
        <el-button @click="dialogFormVisible = true">{{ $t('table.cancel') }}</el-button>
        <el-button :loading="editloading" type="primary" @click="updateData">{{ $t('table.confirm') }}</el-button>
      </div>
    </div>
    <el-dialog
      :visible.sync="uploaddialog"
      title="上传"
      width="400px">
      <el-upload
        :headers="token"
        :on-success="handlesuccess"
        :action="urls + '/donate/upload_documentation'"
        class="upload-demo"
        drag
        name="donate_file"
        multiple>
        <i class="el-icon-upload"/>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <div slot="tip" class="el-upload__tip">文件大小不超过10M</div>
      </el-upload>
    </el-dialog>
  </div>
</template>

<script>
import Tinymce from '@/components/Tinymce'
import store from '@/store'
import { getToken } from '@/utils/auth'
import waves from '@/directive/waves' // 水波纹指令

export default {
  name: 'Guide',
  directives: {
    waves
  },
  components: { Tinymce },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: null,
      value4: '',
      urls: store.getters.url,
      token: {
        Authorization: 'Bearer ' + getToken()
      },
      addloading: false,
      editloading: false,
      typedata: [
        { label: '捐赠说明', value: 1 },
        { label: '捐赠方法', value: 2 },
        { label: '现场捐赠', value: 3 },
        { label: '快递捐赠', value: 4 }
      ],
      listLoading: true,
      listQuery: {
        page: 1
      },
      api: {
        fetch: '/donate-settings',
        info: '/donate-setting',
        edit: '/donate-setting'
      },
      statusOptions: ['published', 'draft', 'deleted'],
      showReviewer: false,
      temp: {},
      uploaddialog: false,
      dialogFormVisible: true,
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
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      this.$r.get(this.api.fetch, this.listQuery).then(response => {
        this.list = response.data.result

        // Just to simulate the time of the request
        this.listLoading = false
      })
    },
    handleModifyStatus(row, status) {
      this.$refs.querycomponent.handleModifyStatus(row, status)
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
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.$r.post(this.api.add, this.temp).then(() => {
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '创建成功',
              type: 'success',
              duration: 2000
            })
          }).catch(errs => { console.log(errs) })
        }
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.editloading = true
          const tempData = Object.assign({}, this.temp)
          this.$r.put(this.api.edit + '/' + tempData.id, tempData).then((re) => {
            if (re.data.status === 'success') {
              this.dialogFormVisible = true
              this.getList()
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
            this.editloading = false
          }).catch(errs => {
            this.editloading = false
            console.log(errs)
          })
        }
      })
    },
    handleUpdate(row) {
      this.$refs.querycomponent.handleUpdate(row)
    },
    handleDelete(row) {
      this.$refs.querycomponent.handleDelete(row)
    },
    handleDownload() {
      this.$refs.querycomponent.handleDownload()
    },
    view(d) {
      this.$r.get(this.api.info + '/' + d).then(re => {
        if (re.data.status === 'success') {
          this.dialogFormVisible = false
          this.temp = re.data.result
          this.$refs.tiny.setContent(re.data.result.value || '')
        } else {
          this.$notify.error({
            title: '失败',
            message: '获取失败',
            duration: 2000
          })
        }
      }).catch(errs => { console.log(errs) })
    },
    handlesuccess(re, file, filelist) {
      if (re.status === 'success') {
        this.$notify({
          title: '成功',
          type: 'success',
          message: re.msg || '上传成功'
        })
      } else {
        this.$notify.error({
          title: '失败',
          message: re.msg || '获取失败'
        })
      }
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
</style>
