<template>
  <div>
    <query ref="querycomponent" :list-query="listQuery" :dialog-width="'1000px'" :api="api">
      <div slot="queryFilter">
        <!--<el-input :placeholder="$t('table.wxname')" v-model="listQuery.title" size="small" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter"/>-->
        <!--<el-button v-waves class="filter-item" size="small" type="primary" icon="el-icon-search" @click="handleFilter">{{ $t('table.search') }}</el-button>-->
        <el-button v-waves class="filter-item" size="small" type="primary" icon="el-icon-edit" @click="handleCreate">{{ $t('table.add') }}</el-button>
        <el-button v-waves class="filter-item" size="small" type="primary" icon="el-icon-refresh" @click="handleFilter">{{ $t('table.refresh') }}</el-button>
      </div>
      <el-table-column slot="tableColumn" :label="$t('table.photo')" width="200px" align="center">
        <template slot-scope="scope">
          <img :src="scope.row.show_image" style="width: 100%;max-height: 250px" alt="">
        </template>
      </el-table-column>
      <el-table-column slot="tableColumn" :label="$t('table.description')" align="center" prop="description"/>
      <el-table-column slot="tableColumn" :label="$t('table.floor')" align="center" prop="floor"/>
      <el-table-column slot="tableColumn" :label="$t('table.actions')" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleUpdate(scope.row.id)">{{ $t('table.edit') }}</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.row.id)">{{ $t('table.delete') }}</el-button>
        </template>
      </el-table-column>
    </query>
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="600px" min-width="1200px">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="right" label-width="60px" style="width: 100%;">
        <el-form-item :label="$t('table.description')">
          <el-input v-model="temp.description"/>
        </el-form-item>
        <el-form-item :label="$t('table.floor')">
          <el-input v-model="temp.floor"/>
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
  name: 'Libraryoverall',
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
      addloading: false,
      editloading: false,
      listLoading: true,
      api: {
        fetch: '/libraryoverall',
        add: '/libraryoverall',
        info: '/libraryoverall',
        edit: '/libraryoverall',
        delete: '/libraryoverall'
      },
      imgList: [],
      listQuery: {
        page: 1
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
          this.listLoading = true
          this.addloading = true
          const tempData = Object.assign({}, this.temp)
          var formData = new FormData()
          for (var j in tempData) {
            formData.append(j, tempData[j])
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
            this.listLoading = false
            this.addloading = false
          }).catch(errs => {
            this.listLoading = false
            this.addloading = false
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
        if (re.data.status === 'success') {
          this.dialogFormVisible = true
          this.temp = re.data.result
          if (re.data.result.show_image) {
            this.imgList.push({ name: re.data.result.floor, url: re.data.result.show_image })
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
          this.$r.put(this.api.edit + '/' + tempData.id, formData, config).then((re) => {
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
      this.$refs.querycomponent.deleteData(row)
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
