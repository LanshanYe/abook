<template>
  <div>
    <div v-show="!dialogFormVisible">
      <query ref="querycomponent" :list-query="listQuery" :api="api">
        <div slot="queryFilter">
          <el-radio-group v-model="listQuery.type" size="small" class="filter-item" @change="typechange">
            <el-radio-button :label="1">{{ $t('table.noticeNew') }}</el-radio-button>
            <el-radio-button :label="2">{{ $t('table.infonews') }}</el-radio-button>
          </el-radio-group>
          <el-button v-waves class="filter-item" size="small" type="primary" icon="el-icon-edit" @click="handleCreate">{{ $t('table.add') }}</el-button>
        </div>
        <el-table-column slot="tableColumn" :label="$t('table.title')" prop="title" align="center"/>
        <el-table-column slot="tableColumn" :label="$t('table.abstract')" prop="abstract" align="center"/>
        <el-table-column slot="tableColumn" :label="$t('table.type')" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.type | filterType }}</span>
          </template>
        </el-table-column>
        <el-table-column slot="tableColumn" :label="$t('table.releaseDate')" prop="created_at" align="center"/>
        <el-table-column slot="tableColumn" :label="$t('table.actions')" align="center" width="230" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="handleUpdate(scope.row.notice_id)">{{ $t('table.edit') }}</el-button>
            <el-button size="mini" type="danger" @click="deleteData(scope.row.notice_id)">{{ $t('table.delete') }}
            </el-button>
          </template>
        </el-table-column>
      </query>
    </div>
    <div v-show="dialogFormVisible" class="app-container">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="right" label-width="80px" style="width: 100%;">
        <el-form-item :label="$t('table.type')">
          <el-select v-model="temp.type" :placeholder="$t('table.status')" size="small" clearable>
            <el-option v-for="item in typedata" :key="item.value" :label="item.label" :value="item.value"/>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('table.title')">
          <el-input v-model="temp.title" type="text"/>
        </el-form-item>
        <el-form-item :label="$t('table.abstract')">
          <el-input v-model="temp.abstract" type="text"/>
        </el-form-item>
        <el-form-item :label="$t('table.content')">
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
import waves from '@/directive/waves' // 水波纹指令
const typedata = [
  { value: 1, label: '通知公告' },
  { value: 2, label: '资讯动态' }
]

export default {
  name: 'InfoManage',
  directives: {
    waves
  },
  components: {
    query,
    Tinymce
  },
  filters: {
    filterType(t) {
      return typedata[t - 1].label
    }
  },
  data() {
    return {
      tableKey: 0,
      list: null,
      addloading: false,
      editloading: false,
      api: {
        add: '/notice',
        edit: '/notice',
        fetch: '/notice',
        info: '/notice',
        delete: '/notice'
      },
      total: null,
      value4: '',
      typedata: typedata,
      listLoading: true,
      listQuery: {
        page: 1,
        type: 1
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
    deleteData(id) {
      this.$confirm('您确定删除所选项?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$r.delete(this.api.delete + '/' + id).then((re) => {
          if (re.data.status === 'success') {
            this.$refs.querycomponent.getList()
            this.$notify({
              title: '成功',
              message: '删除成功',
              type: 'success',
              duration: 2000
            })
          } else {
            this.$notify.error({
              title: '失败',
              message: '删除失败'
            })
          }
        }).catch(errs => console.log(errs))
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
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
          this.addloading = true
          this.$r.post(this.api.add, this.temp).then((re) => {
            if (re.data.status === 'success') {
              this.$refs.querycomponent.getList()
              this.dialogFormVisible = false
              this.$notify({
                title: '成功',
                message: '创建成功',
                type: 'success',
                duration: 2000
              })
            } else {
              this.$notify.error({
                title: '失败',
                message: '创建失败',
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
      this.$r.get(this.api.info + '/' + row).then(re => {
        if (re.data.status === 'success') {
          this.dialogStatus = 'update'
          this.temp = re.data.result
          this.$refs.tiny.setContent(re.data.result.content || '')
          this.dialogFormVisible = true
          this.$nextTick(() => {
            this.$refs['dataForm'].clearValidate()
          })
        } else {
          this.$notify.error({
            title: '失败',
            message: re.data.msg
          })
        }
      }).catch(errs => console.log(errs))
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.editloading = true
          var tempData = Object.assign({}, this.temp)
          this.$r.put(this.api.edit + '/' + tempData.notice_id, tempData).then((re) => {
            if (re.data.status === 'success') {
              this.dialogFormVisible = false
              this.$refs.querycomponent.getList()
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
    typechange(d) {
      this.$refs.querycomponent.getList(1)
    },
    handleDelete(row) {
      this.$refs.querycomponent.handleDelete(row)
    },
    handleDownload() {
      this.$refs.querycomponent.handleDownload()
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>

</style>
