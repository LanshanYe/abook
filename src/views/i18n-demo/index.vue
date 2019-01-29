<template>
  <div>
    <div v-show="!dialogFormVisible">
      <query ref="querycomponent" :list-query="listQuery" :api="api" :temp="temp">
        <div slot="queryFilter">
          <el-button v-waves class="filter-item" size="small" type="primary" icon="el-icon-edit" @click="handleCreate">{{ $t('table.add') }}</el-button>
        </div>
        <el-table-column slot="tableColumn" :label="$t('table.adminName')" :formatter="formatadmin" prop="display_name" align="center"/>
        <el-table-column slot="tableColumn" :label="$t('table.avatar')" prop="avatar" align="center"/>
        <el-table-column slot="tableColumn" :label="$t('table.username')" prop="email" align="center"/>
        <el-table-column slot="tableColumn" :label="$t('table.createTime')" prop="created_at" align="center"/>
        <el-table-column slot="tableColumn" :label="$t('table.actions')" align="center" width="230" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="handleUpdate(scope.row.user_id)">{{ $t('table.edit') }}</el-button>
            <el-button size="mini" type="danger" @click="deleteData(scope.row.user_id)">{{ $t('table.delete') }}
            </el-button>
          </template>
        </el-table-column>
      </query>
    </div>
    <div v-show="dialogFormVisible" class="app-container">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="right" label-width="80px" style="width: 100%;">
        <el-form-item :label="$t('table.nickname')">
          <el-input v-model="temp.nickname" type="text"/>
        </el-form-item>
        <el-form-item :label="$t('table.realname')">
          <el-input v-model="temp.real_name" type="text"/>
        </el-form-item>
        <el-form-item :label="$t('table.email')">
          <el-input v-model="temp.email" type="text" placeholder="邮箱可以作为用户账号登录"/>
        </el-form-item>
        <el-form-item :label="$t('table.phone')">
          <el-input v-model="temp.phone" type="text" placeholder="手机号可以作为用户账号登录"/>
        </el-form-item>
        <el-form-item :label="$t('login.password')">
          <el-input v-model="temp.password" type="password"/>
        </el-form-item>
        <!--<el-form-item :label="$t('table.avatar')">-->
        <!--<el-upload-->
        <!--:auto-upload="false"-->
        <!--:show-file-list="false"-->
        <!--:http-request="imageUpload"-->
        <!--class="avatar-uploader"-->
        <!--action="https://jsonplaceholder.typicode.com/posts/">-->
        <!--<img v-if="imageUrl" :src="imageUrl" class="avatar">-->
        <!--<i v-else class="el-icon-plus avatar-uploader-icon"/>-->
        <!--</el-upload>-->
        <!--</el-form-item>-->
        <el-form-item :label="$t('table.adminName')">
          <el-radio-group v-model="temp.role_id">
            <el-radio v-for="(it, index) in roledata" :label="it.role_id" :key="index" border>{{ it.display_name }}</el-radio>
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
import waves from '@/directive/waves' // 水波纹指令

export default {
  name: 'I18n',
  directives: {
    waves
  },
  components: {
    query
  },
  data() {
    return {
      permissiondata: [
        { label: '1', value: '管理员' },
        { label: '2', value: '普通用户' }
      ],
      api: {
        fetch: 'sys-user',
        info: 'sys-user',
        add: 'sys-user',
        edit: 'sys-user',
        delete: 'sys-user'
      },
      addloading: false,
      editloading: false,
      imageUrl: '',
      checkList: [],
      list: null,
      total: null,
      value4: '',
      listLoading: true,
      listQuery: {
        page: 1
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
      roledata: [],
      rules: {
        type: [{ required: true, message: 'type is required', trigger: 'change' }],
        timestamp: [{ type: 'date', required: true, message: 'timestamp is required', trigger: 'change' }],
        title: [{ required: true, message: 'title is required', trigger: 'blur' }]
      },
      downloadLoading: false
    }
  },
  created() {
    this.$r.get('role').then(re => {
      this.roledata = re.data.result.data
      this.$refs.querycomponent.getList()
    }).catch(errs => console.log(errs))
  },
  methods: {
    deleteData(id) {
      this.$refs.querycomponent.deleteData(id)
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
        this.dialogStatus = 'update'
        this.temp = re.data.result
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
    formatadmin(d) {
      var vl = d.role_id
      for (var i = 0; i < this.roledata.length; i++) {
        if (d.role_id === this.roledata[i].role_id) {
          vl = this.roledata[i].display_name
          break
        }
      }
      return vl
    },
    imageUpload() {},
    handleDownload() {
      this.$refs.querycomponent.handleDownload()
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>

</style>
