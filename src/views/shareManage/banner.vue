<template>
  <div v-loading="listLoading">
    <div v-show="!dialogFormVisible">
      <query ref="querycomponent" :list-query="listQuery" :api="api">
        <div slot="queryFilter">
          <el-button v-waves class="filter-item" size="small" type="primary" icon="el-icon-edit" @click="handleCreate">{{ $t('table.add') }}</el-button>
          <el-button v-waves class="filter-item" size="small" type="primary" icon="el-icon-search" @click="handleFilter">{{ $t('table.search') }}</el-button>
        </div>
        <el-table-column slot="tableColumn" :label="$t('table.description')" prop="name" align="center"/>
        <el-table-column slot="tableColumn" :label="$t('table.photo')" prop="iamge" align="center">
          <template slot-scope="scope">
            <img :src="scope.row.image" style="max-width:100%" alt="">
          </template>
        </el-table-column>
        <el-table-column slot="tableColumn" :label="$t('table.type')" prop="type" align="center"/>
        <el-table-column slot="tableColumn" :label="$t('table.sort')" prop="sort" align="center"/>
        <el-table-column slot="tableColumn" :label="$t('table.actions')" align="center" width="230" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="handleUpdate(scope.row.banner_id)">{{ $t('table.edit') }}</el-button>
            <el-button size="mini" type="danger" @click="deleteData(scope.row.banner_id)">{{ $t('table.delete') }}</el-button>
          </template>
        </el-table-column>
      </query>
    </div>
    <div v-show="dialogFormVisible" class="app-container">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="right" label-width="80px" style="width: 100%;">
        <el-form-item :label="$t('table.terminal')">
          <el-radio-group v-model="temp.is_mobile" size="small" class="filter-item">
            <el-radio :label="1" border>{{ $t('table.mobile') }}</el-radio>
            <el-radio :label="0" border>{{ $t('table.PC') }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item :label="$t('table.description')">
          <el-input v-model="temp.name"/>
        </el-form-item>
        <el-form-item :label="$t('table.photo')">
          <uploadimg :imglist="imglist" @getimg="getImgurl"/>
        </el-form-item>
        <el-form-item :label="$t('table.sort')">
          <el-input v-model="temp.sort" placeholder="数字越大越在前"/>
        </el-form-item>
        <el-form-item :label="$t('table.target')">
          <el-input v-model="temp.target"/>
        </el-form-item>
        <el-form-item :label="$t('table.type')">
          <el-radio-group v-model="temp.type" size="small" class="filter-item">
            <el-radio label="user" border>用户</el-radio>
            <el-radio label="url" border>链接</el-radio>
            <el-radio label="article" border>文章</el-radio>
            <el-radio label="activity" border>活动</el-radio>
          </el-radio-group>
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
import uploadimg from '@/components/Upload/uploadImg'
import waves from '@/directive/waves' // 水波纹指令

export default {
  name: 'Banner',
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
      imglist: [],
      api: {
        add: '/banner',
        edit: '/banner',
        fetch: '/banner',
        info: '/banner',
        delete: '/banner'
      },
      addloading: false,
      editloading: false,
      total: null,
      value4: '',
      listLoading: false,
      listQuery: {
        page: 1,
        is_mobile: 0
      },
      statusOptions: ['published', 'draft', 'deleted'],
      showReviewer: false,
      temp: {
        is_mobile: 0,
        type: 'user',
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
        image: [{ required: true, trigger: 'change' }]
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
      this.temp = {
        is_mobile: 0,
        type: 'user',
        image: ''
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.imglist = []
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
          this.$r.post(this.api.edit, formData, config).then((re) => {
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
      this.imglist = []
      this.$r.get(this.api.info + '/' + row).then(re => {
        if (re.data.status === 'success') {
          this.dialogStatus = 'update'
          this.temp = re.data.result
          if (re.data.result.image) {
            this.imglist.push({ name: re.data.result.name, url: re.data.result.image })
          }
          this.dialogFormVisible = true
          this.$nextTick(() => {
            this.$refs['dataForm'].clearValidate()
          })
        } else {
          this.$notify.error({
            title: '失败',
            message: re.data.msg || '获取失败'
          })
        }
      }).catch(errs => console.log(errs))
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
              this.dialogFormVisible = false
              this.$refs.querycomponent.getList()
              this.$notify({
                title: '成功',
                message: re.data.msg || '更新成功',
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
    typechange(d) {
      this.$refs.querycomponent.getList(1)
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
