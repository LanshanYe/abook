<template>
  <div>
    <div v-show="!dialogFormVisible">
      <query ref="querycomponent" :list-query="listQuery" :api="api">
        <div slot="queryFilter">
          <el-button v-waves class="filter-item" size="small" type="primary" icon="el-icon-search" @click="handleFilter">{{ $t('table.search') }}</el-button>
          <el-button v-waves class="filter-item" size="small" type="primary" icon="el-icon-edit" @click="handleCreate">{{ $t('table.add') }}</el-button>
        </div>
        <el-table-column slot="tableColumn" :label="$t('table.showName')" prop="display_name" align="center"/>
        <el-table-column slot="tableColumn" :label="$t('table.configdescript')" prop="value" align="center">
          <template slot-scope="scope">
            <img :src="scope.row.value" max-width="100%" alt="">
          </template>
        </el-table-column>
        <el-table-column slot="tableColumn" :label="$t('table.actions')" align="center" width="110" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="handleUpdate(scope.row.id)">{{ $t('table.edit') }}</el-button>
          </template>
        </el-table-column>
      </query>
    </div>
    <div v-show="dialogFormVisible" class="app-container">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="right" label-width="80px" style="width: 100%;">
        <el-form-item :label="$t('table.configname')">
          <el-input v-model="temp.key" type="text" placeholder="如：site.index"/>
        </el-form-item>
        <el-form-item :label="$t('table.showName')">
          <el-input v-model="temp.display_name" placeholder="请填写四至十六个的汉字" type="text"/>
        </el-form-item>
        <el-form-item :label="$t('table.configtype')">
          <el-radio-group v-model="temp.type">
            <el-radio v-for="(it,index) in typedata" :label="it.value" :key="index" border>{{ it.label }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item :label="$t('table.configdescript')">
          <el-input v-show="temp.type==='text'" v-model="temp.value" type="text"/>
          <tinymce v-show="temp.type==='rich_text'" ref="tiny" :height="400" v-model="temp.value"/>
          <uploadimg v-show="temp.type==='image'" :imglist="imglist" @getimg="getImgurl"/>
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
import uploadimg from '@/components/Upload/uploadImg'
import waves from '@/directive/waves' // 水波纹指令

export default {
  name: 'ConfigureManage',
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
      api: {
        add: '/setting',
        edit: '/setting',
        fetch: '/setting',
        info: '/setting',
        delete: '/setting'
      },
      addloading: false,
      editloading: false,
      total: null,
      value4: '',
      typedata: [
        { value: 'text', label: '文字' },
        { value: 'image', label: '图片' },
        { value: 'rich_text', label: '富文本' }
      ],
      listLoading: true,
      listQuery: {
        page: 1,
        group: 'Sharing'
      },
      statusOptions: ['published', 'draft', 'deleted'],
      showReviewer: false,
      temp: {
        type: 'text',
        group: 'Sharing'
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '修改',
        create: '新增'
      },
      imglist: [],
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
      this.temp = {
        type: 'text',
        group: 'Sharing'
      }
    },
    handleCreate() {
      this.resetTemp()
      this.$refs.tiny.setContent('')
      this.imglist = []
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
          if (this.temp.type === 'image') {
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
              this.addloading = false
            }).catch(errs => {
              this.addloading = false
              console.log(errs)
            })
          } else {
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
                  message: re.data.msg,
                  duration: 2000
                })
              }
              this.addloading = false
            }).catch(errs => {
              this.addloading = false
              console.log(errs)
            })
          }
        }
      })
    },
    handleUpdate(row) {
      this.imglist = []
      this.$r.get(this.api.info + '/' + row).then(re => {
        this.dialogStatus = 'update'
        this.temp = re.data.result
        this.$refs.tiny.setContent(re.data.result.value || '')
        if (re.data.result.type === 'image') {
          this.imglist.push({ name: re.data.result.display_name, url: re.data.result.value })
        } else {
          this.imglist = []
        }
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      }).catch(errs => console.log(errs))
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.editloading = true
          if (this.temp.type === 'image') {
            var formData = new FormData()
            for (var j in this.temp) {
              formData.append(j, this.temp[j])
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
              this.editloading = false
            }).catch(errs => {
              this.editloading = false
              console.log(errs)
            })
          } else {
            var tempData = Object.assign({}, this.temp)
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
                  message: re.data.msg,
                  duration: 2000
                })
              }
              this.editloading = false
            }).catch(errs => {
              this.editloading = false
              console.log(errs)
            })
          }
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
    getImgurl(d) {
      this.temp.image = d
    },
    downloadVideo() {
      this.$confirm('您确定执行同步视频资源?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const loading = this.$loading({
          lock: true,
          text: '正在同步中。。。'
        })
        this.$r.get('/importvideo').then((re) => {
          if (re.data.status === 'success') {
            this.$notify({
              title: '成功',
              message: re.data.msg || '同步成功',
              type: 'success',
              duration: 2000
            })
          } else {
            this.$notify.error({
              title: '失败',
              message: re.data.msg || '同步失败'
            })
          }
          loading.close()
        }).catch(errs => {
          console.log(errs)
          loading.close()
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        })
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>

</style>
