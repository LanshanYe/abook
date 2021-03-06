<template>
  <div>
    <div v-show="!dialogFormVisible">
      <query ref="querycomponent" :list-query="listQuery" :api="api">
        <div slot="queryFilter">
          <el-radio-group v-model="listQuery.type" class="filter-item" size="small" @change="typechange">
            <el-radio-button label="Sharing">共享</el-radio-button>
            <el-radio-button label="Sharing_left">共享左</el-radio-button>
          </el-radio-group>
          <el-button v-waves class="filter-item" size="small" type="primary" icon="el-icon-search" @click="handleFilter">{{ $t('table.search') }}</el-button>
          <el-button v-waves class="filter-item" size="small" type="primary" icon="el-icon-edit" @click="handleCreate">{{ $t('table.add') }}</el-button>
        </div>
        <el-table-column slot="tableColumn" :label="$t('table.link_name')" prop="link_name" align="center"/>
        <el-table-column slot="tableColumn" :label="$t('table.link_address')" prop="link_address" align="center"/>
        <el-table-column slot="tableColumn" :label="$t('table.link_sort')" prop="sort" align="center"/>
        <el-table-column slot="tableColumn" :label="$t('table.actions')" align="center" width="230" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="handleUpdate(scope.row.id)">{{ $t('table.edit') }}</el-button>
            <el-button size="mini" type="danger" @click="deleteData(scope.row.id)">{{ $t('table.delete') }}
            </el-button>
          </template>
        </el-table-column>
      </query>
    </div>
    <div v-show="dialogFormVisible" class="app-container">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="right" label-width="80px" style="width: 100%;">
        <el-form-item :label="$t('table.type')" prop="type">
          <el-radio-group v-model="temp.type" class="filter-item" size="small">
            <el-radio-button label="Sharing">共享</el-radio-button>
            <el-radio-button label="Sharing_left">共享左</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item :label="$t('table.link_name')" prop="link_name">
          <el-input v-model="temp.link_name" type="text"/>
        </el-form-item>
        <el-form-item :label="$t('table.link_address')" prop="link_address">
          <el-input v-model="temp.link_address" type="text"/>
        </el-form-item>
        <el-form-item :label="$t('table.link_sort')" prop="sort">
          <el-input v-model="temp.sort" type="text"/>
        </el-form-item>
        <el-form-item :label="$t('table.photo')">
          <uploadimg key="1" :imglist="imglist" @getimg="getImgurl"/>
        </el-form-item>
        <el-form-item :label="$t('table.link_icon')">
          <uploadimg key="2" :imglist="imglist2" @getimg="getImgurl2"/>
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
  name: 'Links',
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
      addloading: false,
      editloading: false,
      api: {
        add: '/link',
        edit: '/link',
        fetch: '/link',
        info: '/link',
        delete: '/link'
      },
      total: null,
      value4: '',
      imglist: [],
      imglist2: [],
      listLoading: true,
      listQuery: {
        page: 1,
        type: 'Sharing'
      },
      statusOptions: ['published', 'draft', 'deleted'],
      showReviewer: false,
      temp: {
        type: 'Sharing'
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
        sort: [{ required: true, message: '请填写链接排序', trigger: 'blur' }],
        link_name: [{ required: true, message: '请填写链接描述', trigger: 'blur' }],
        link_address: [{ required: true, message: '请填写链接地址', trigger: 'blur' }],
        type: [{ required: true, message: '请选择类型', trigger: 'change' }]
      },
      types: [
        { value: 'address', label: '常用地址' },
        { value: 'provinceInner', label: '省内' },
        { value: 'provinceOut', label: '省外' },
        { value: 'friend', label: '友情' },
        { value: 'party', label: '党' },
        { value: 'sql', label: '数据库' },
        { value: 'people', label: '便民' }
      ],
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
        type: this.listQuery.type
      }
    },
    handleCreate() {
      this.resetTemp()
      this.imglist = []
      this.imglist2 = []
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
      this.imglist = []
      this.imglist2 = []
      this.$r.get(this.api.info + '/' + row).then(re => {
        if (re.data.status === 'success') {
          this.dialogStatus = 'update'
          this.temp = re.data.result
          if (re.data.result.link_icon) {
            this.imglist2.push({ name: re.data.result.link_name, url: re.data.result.link_icon })
          }
          if (re.data.result.link_image) {
            this.imglist.push({ name: re.data.result.link_name, url: re.data.result.link_image })
          }
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
    },
    getImgurl(r) {
      this.temp.link_image = r
    },
    getImgurl2(r) {
      this.temp.link_icon = r
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>

</style>
