<template>
  <div>
    <query ref="querycomponent" :list-query="listQuery" :dialog-width="'1000px'" :api="api">
      <div slot="queryFilter">
        <el-input :placeholder="$t('table.resourcetypename')" v-model="listQuery.name" size="small" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter"/>
        <el-button v-waves class="filter-item" size="small" type="primary" icon="el-icon-search" @click="handleFilter">{{ $t('table.search') }}</el-button>
        <el-button v-waves class="filter-item" size="small" type="primary" icon="el-icon-edit" @click="handleCreate">{{ $t('table.add') }}</el-button>
      </div>
      <el-table-column slot="tableColumn" :label="$t('table.rid')" align="center" width="160" prop="id"/>
      <el-table-column slot="tableColumn" :label="$t('table.resourcetypename')" prop="name"/>
      <el-table-column slot="tableColumn" :label="$t('table.sort')" prop="sort"/>
      <el-table-column slot="tableColumn" :label="$t('table.parent')" prop="pid"/>
      <el-table-column slot="tableColumn" :label="$t('table.actions')" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleUpdate(scope.row.id)">{{ $t('table.edit') }}</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.row.id)">{{ $t('table.delete') }}</el-button>
        </template>
      </el-table-column>
    </query>
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="600px" min-width="1200px">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="right" label-width="120px" style="width: 100%;">
        <el-form-item :label="$t('table.resourcetypename')">
          <el-input v-model="temp.name"/>
        </el-form-item>
        <el-form-item :label="$t('table.sort')">
          <el-input v-model="temp.sort" placeholder="数字越大排序越在前"/>
        </el-form-item>
        <el-form-item :label="$t('table.parent')">
          <el-select v-model="temp.pid" class="width100">
            <el-option v-for="(it,index) in iddata" :key="index" :value="it.id" :label="it.name"/>
          </el-select>
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
import waves from '@/directive/waves' // 水波纹指令

export default {
  name: 'Resourcetype',
  directives: {
    waves
  },
  components: {
    query
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
        fetch: '/video-cate',
        add: '/video-cate',
        info: '/video-cate',
        edit: '/video-cate',
        delete: '/video-cate'
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
      iddata: [],
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
    this.getfetchs()
  },
  methods: {
    getfetchs() {
      this.$r.get(this.api.fetch).then(re => {
        this.iddata = re.data.result
      }).catch(errs => {
        console.log(errs)
      })
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
          this.listLoading = true
          this.addloading = true
          this.$r.post(this.api.add, this.temp).then((re) => {
            if (re.data.status === 'success') {
              this.dialogFormVisible = false
              this.$refs.querycomponent.getList()
              this.getfetchs()
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
          this.$r.post(this.api.edit, this.temp).then((re) => {
            if (re.data.status === 'success') {
              this.$refs.querycomponent.getList()
              this.getfetchs()
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
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>

</style>
