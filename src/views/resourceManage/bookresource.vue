<template>
  <div>
    <query ref="querycomponent" :list-query="listQuery" :dialog-width="'1000px'" :api="api">
      <div slot="queryFilter">
        <el-input :placeholder="$t('table.bookname')" v-model="listQuery.title" size="small" style="width: 200px;" clearable class="filter-item" @keyup.enter.native="handleFilter"/>
        <el-input :placeholder="$t('table.author')" v-model="listQuery.author" size="small" style="width: 200px;" clearable class="filter-item" @keyup.enter.native="handleFilter"/>
        <el-input v-model="listQuery.classno" :placeholder="$t('table.kinds')" size="small" style="width: 200px;" clearable class="filter-item" @keyup.enter.native="handleFilter"/>
        <el-button v-waves class="filter-item" size="small" type="primary" icon="el-icon-search" @click="handleFilter">{{ $t('table.search') }}</el-button>
      </div>
      <el-table-column slot="tableColumn" :label="$t('table.bookname')" align="center" prop="title"/>
      <el-table-column slot="tableColumn" :label="$t('table.author')" align="center" prop="author"/>
      <el-table-column slot="tableColumn" :label="$t('table.press')" align="center" prop="publisher"/>
      <el-table-column slot="tableColumn" :label="$t('table.kinds')" align="center" prop="classno"/>
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
        <el-button v-if="dialogStatus=='create'" type="primary" @click="createData">{{ $t('table.confirm') }}</el-button>
        <el-button v-else type="primary" @click="updateData">{{ $t('table.confirm') }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import query from '@/components/queryTable'
import uploadimg from '@/components/Upload/uploadImg'
import waves from '@/directive/waves' // 水波纹指令

export default {
  name: 'Bookresource',
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
      value4: '',
      listLoading: true,
      api: {
        fetch: '/interbook',
        add: '/interbook',
        info: '/interbook',
        edit: '/interbook',
        delete: '/interbook'
      },
      imgList: [],
      listQuery: {
        page: 1,
        rows: 10,
        classno: '',
        title: '',
        author: ''
      },
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
          this.temp.is_important = 1
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
          }).catch(errs => { console.log(errs) })
        }
      })
    },
    handleUpdate(row) {
      this.listLoading = true
      this.dialogStatus = 'update'
      this.imgList = []
      this.$r.get(this.api.info + '/' + row).then(re => {
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
          }).catch(errs => {
            this.listLoading = false
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
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>

</style>
