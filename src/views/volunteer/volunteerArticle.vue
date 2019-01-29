<template>
  <div>
    <div v-show="!dialogFormVisible">
      <query ref="querycomponent" :list-query="listQuery" :api="api">
        <div slot="queryFilter">
          <el-input v-model="listQuery.title" placeholder="标题" size="small" style="width: 200px;" clearable class="filter-item" @keyup.enter.native="handleFilter"/>
          <el-select v-model="listQuery.model_id" size="small" clearable class="filter-item" placeholder="所属模块">
            <el-option v-for="(it, index) in modelData" :key="index" :label="it.model_name" :value="it.model_id"/>
          </el-select>
          <el-button v-waves class="filter-item" size="small" type="primary" icon="el-icon-search" @click="handleFilter">{{ $t('table.search') }}</el-button>
          <el-button v-waves class="filter-item" size="small" type="primary" icon="el-icon-edit" @click="handleCreate">{{ $t('table.add') }}</el-button>
        </div>
        <el-table-column slot="tableColumn" :label="$t('table.title')" prop="title" align="center"/>
        <el-table-column slot="tableColumn" :label="$t('table.module')" prop="model" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.model?scope.row.model.model_name:'' }}</span>
          </template>
        </el-table-column>
        <el-table-column slot="tableColumn" :label="$t('table.sort')" prop="sort" align="center"/>
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
        <el-form-item :label="$t('table.title')" prop="title">
          <el-input v-model="temp.title" type="text"/>
        </el-form-item>
        <el-form-item :label="$t('table.abstract')" prop="abstract">
          <el-input v-model="temp.abstract" type="text"/>
        </el-form-item>
        <el-form-item :label="$t('table.sort')">
          <el-input v-model="temp.sort" type="text"/>
        </el-form-item>
        <el-form-item :label="$t('table.module')">
          <el-select v-model="temp.model_id" size="small">
            <el-option v-for="(it, index) in modelData" :key="index" :label="it.model_name" :value="it.model_id"/>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('table.content')" prop="content">
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
import uploadimg from '@/components/Upload/uploadImg'
import Tinymce from '@/components/Tinymce'
import waves from '@/directive/waves' // 水波纹指令

export default {
  name: 'VolunteerArticle',
  directives: {
    waves
  },
  components: {
    query,
    uploadimg,
    Tinymce
  },
  data() {
    return {
      tableKey: 0,
      list: null,
      addloading: false,
      editloading: false,
      api: {
        add: '/volunteer',
        edit: '/volunteer',
        fetch: '/volunteer',
        info: '/volunteer',
        delete: '/volunteer'
      },
      total: null,
      value4: '',
      imglist: [],
      imglist2: [],
      listLoading: true,
      listQuery: {
        page: 1,
        model_id: ''
      },
      statusOptions: ['published', 'draft', 'deleted'],
      showReviewer: false,
      temp: {
        content: '',
        model_id: ''
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '修改',
        create: '新增'
      },
      typedata: [
        { value: 1, label: '公告' },
        { value: 2, label: '本省动态' },
        { value: 3, label: '全国动态' },
        { value: 4, label: '文件汇编' },
        { value: 5, label: '在线培训' }
      ],
      dialogPvVisible: false,
      modelData: [],
      rules: {
        sort: [{ required: true, message: '请填写链接排序', trigger: 'blur' }],
        link_name: [{ required: true, message: '请填写链接描述', trigger: 'blur' }],
        link_address: [{ required: true, message: '请填写链接地址', trigger: 'blur' }],
        type: [{ required: true, message: '请选择类型', trigger: 'change' }]
      },
      downloadLoading: false
    }
  },
  mounted() {
    this.$refs.querycomponent.getList()
    this.$r.get('/volunteer_model').then(re => {
      this.modelData = re.data.result
    })
  },
  methods: {
    typeformate(r, i, c) {
      let vl = c
      for (let i = 0; i < this.typedata.length; i++) {
        if (c === this.typedata[i].value) {
          vl = this.typedata[i].label
          break
        }
      }
      return vl
    },
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
        content: '',
        model_id: ''
      }
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
          const tempData = Object.assign({}, this.temp)
          this.$r.post(this.api.add, tempData).then((re) => {
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
          const tempData = Object.assign({}, this.temp)
          this.$r.post(this.api.edit, tempData).then((re) => {
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
