<template>
  <div class="app-container">

    <div class="filter-container">
      <slot name="queryCount"/>
    </div>

    <div class="queryFilters">
      <slot name="queryFilter"/>
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
    </el-table>

    <div class="pagination-container">
      <el-pagination v-show="total>0" :current-page="listQuery.page" :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit" :total="total" background layout="total, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange"/>
    </div>

  </div>
</template>

<script>
import { fetchList, createData, updateData, deleteData } from '@/api/article'

export default {
  name: 'QueryTable',
  props: {
    listQuery: {
      type: Object,
      default: () => {
        return {
          page: 1,
          limit: 10
        }
      }
    },
    dialogWidth: {
      type: String,
      default: '400px'
    },
    api: {
      type: Object,
      default: () => {
        return {
          add: '',
          edit: '',
          fetch: '',
          info: '',
          delete: ''
        }
      }
    },
    redatatype: {
      type: String,
      default: '1'
    }
  },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: null,
      imageUrl: '',
      value4: '',
      listLoading: false,
      statusOptions: ['published', 'draft', 'deleted'],
      showReviewer: false,
      temp: {
        id: undefined,
        importance: 1,
        remark: '',
        timestamp: new Date(),
        title: '',
        type: '',
        status: 'published'
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
  methods: {
    getList(n) {
      this.listLoading = true
      if (n) {
        this.listQuery.page = n
      }
      var params = {}
      for (var i in this.listQuery) {
        if (this.listQuery[i] !== '') {
          params[i] = this.listQuery[i]
        }
      }
      fetchList(this.api.fetch, params).then(response => {
        if (response.data.result) {
          this.list = response.data.result.data
          this.total = response.data.result.total
          if (response.data.result.data === undefined) {
            this.list = response.data.result
            this.total = 0
          }
        }
        // Just to simulate the time of the request
        this.listLoading = false
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleSizeChange(val) {
      this.listQuery.limit = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.listQuery.page = val
      this.getList()
    },
    resetTemp() {
      this.temp = {}
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          createData(this.api.add, this.temp).then(() => {
            this.list.unshift(this.temp)
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '创建成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleUpdate(id) {
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          tempData.timestamp = +new Date(tempData.timestamp) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
          updateData(this.api.edit, tempData).then(() => {
            for (const v of this.list) {
              if (v.id === this.temp.id) {
                const index = this.list.indexOf(v)
                this.list.splice(index, 1, this.temp)
                break
              }
            }
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '更新成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    deleteData(id) {
      this.$confirm('您确定删除所选项?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteData(this.api.delete + '/' + id).then((re) => {
          if (re.data.status === 'success') {
            this.$notify({
              title: '成功',
              message: '删除成功',
              type: 'success',
              duration: 2000
            })
            this.getList()
          } else {
            this.$message.error({
              title: '失败',
              message: re.data.msg || '删除失败'
            })
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    handleDownload() {
      this.downloadLoading = true
        import('@/vendor/Export2Excel').then(excel => {
          const tHeader = ['timestamp', 'title', 'type', 'importance', 'status']
          const filterVal = ['timestamp', 'title', 'type', 'importance', 'status']
          const data = this.formatJson(filterVal, this.list)
          excel.export_json_to_excel({
            header: tHeader,
            data,
            filename: 'table-list'
          })
          this.downloadLoading = false
        })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal)
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>

</style>
