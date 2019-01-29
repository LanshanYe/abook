<template>
  <div>
    <query ref="querycomponent" :list-query="listQuery" :dialog-width="'1000px'" :api="api">
      <div slot="queryFilter">
        <el-button v-waves class="filter-item" size="small" type="primary" icon="el-icon-edit" @click="handleCreate">{{ $t('table.add') }}</el-button>
      </div>
      <el-table-column slot="tableColumn" :label="$t('table.name')" align="center" prop="real_name"/>
      <el-table-column slot="tableColumn" :label="$t('table.title')" align="center" prop="title"/>
      <el-table-column slot="tableColumn" :label="$t('table.photo')" align="center" width="150px">
        <template slot-scope="scope">
          <img :src="scope.row.images" style="width: 100%" alt="">
        </template>
      </el-table-column>
      <el-table-column slot="tableColumn" :label="$t('table.abstract')" align="center" prop="abstract"/>
      <el-table-column slot="tableColumn" :label="$t('table.actions')" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleUpdate(scope.row.donate_id)">{{ $t('table.edit') }}</el-button>
          <!--<el-button size="mini" type="danger" @click="handleModifyStatus(scope.row.donate_id)">{{ $t('table.delete') }}</el-button>-->
        </template>
      </el-table-column>
    </query>
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="80%" min-width="1200px">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="right" label-width="80px" style="width: 100%;">
        <el-form-item :label="$t('table.name')">
          <el-input v-model="temp.real_name"/>
        </el-form-item>
        <el-form-item :label="$t('table.title')">
          <el-input v-model="temp.title"/>
        </el-form-item>
        <el-form-item :label="$t('table.abstract')">
          <el-input v-model="temp.abstract"/>
        </el-form-item>
        <el-form-item :label="$t('table.photo')">
          <uploadimg :imglist="imgList" @getimg="getImgurl"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">{{ $t('table.cancel') }}</el-button>
        <el-button v-if="dialogStatus=='create'" :loading="addloading" type="primary" @click="createData">{{ $t('table.confirm') }}</el-button>
        <el-button v-else :loading="editloading" type="primary" @click="updateData">{{ $t('table.confirm') }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import query from '@/components/queryTable'
import uploadimg from '@/components/Upload/uploadImg'
import waves from '@/directive/waves' // 水波纹指令

export default {
  name: 'MainDonation',
  directives: {
    waves
  },
  components: {
    query,
    uploadimg
  },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: null,
      addloading: false,
      editloading: false,
      value4: '',
      listLoading: true,
      api: {
        fetch: '/donate',
        add: '/donate-add',
        info: '/donate_show',
        edit: '/donate',
        delete: '/donate'
      },
      imgList: [],
      listQuery: {
        page: 1,
        is_important: 1
      },
      statusOptions: ['published', 'draft', 'deleted'],
      showReviewer: false,
      temp: {
        image: ''
      },
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
    handleModifyStatus(row, status) {
      this.$refs.querycomponent.handleModifyStatus(row, status)
    },
    handleFilter() {
      this.$refs.querycomponent.handleFilter()
    },
    resetTemp() {
      this.temp = {
        image: ''
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.imgList = []
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.addloading = true
          this.listLoading = true
          this.temp.is_important = 1
          var formData = new FormData()
          for (var j in this.temp) {
            formData.append(j, this.temp[j])
          }
          const config = {
            headers: { 'Content-Type': 'multipart/form-data' }
          }
          this.$r.post(this.api.add, formData, config).then((re) => {
            console.log(re)
            if (re.data.status === 'success') {
              this.dialogFormVisible = false
              this.$refs.querycomponent.getList()
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
            this.listLoading = false
          }).catch(errs => {
            this.addloading = false
            this.listLoading = false
            console.log(errs)
          })
        }
      })
    },
    handleUpdate(row) {
      this.listLoading = true
      this.dialogStatus = 'update'
      this.imgList = []
      this.$r.get(this.api.info + '/' + row).then(re => {
        console.log(re)
        if (re.data.status === 'success') {
          this.dialogFormVisible = true
          this.temp = re.data.result
          if (re.data.result.images) {
            this.imgList.push({ name: re.data.result.title, url: re.data.result.images })
          }
        } else {
          this.$notify.error({
            title: '失败',
            message: re.data.msg || '获取失败',
            duration: 2000
          })
        }
        this.listLoading = false
      }).catch(errs => {
        this.listLoading = false
        console.log(errs)
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.listLoading = true
          this.editloading = true
          const tempData = Object.assign({}, this.temp)
          var formData = new FormData()
          for (var j in tempData) {
            formData.append(j, tempData[j])
          }
          const config = {
            headers: { 'Content-Type': 'multipart/form-data' }
          }
          this.$r.post(this.api.edit, formData, config).then((re) => {
            if (re.data.status === 'success') {
              this.$refs.querycomponent.getList()
              console.log(re)
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
                message: re.data.msg || '修改失败',
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
    getImgurl(r) {
      this.temp.image = r
      console.log(this.temp.image)
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>

</style>
