<!--
    Administrator
    2018/9/15 15:05
 -->
<template>
  <div>
    <div v-show="!dialogFormVisible">
      <query ref="querycomponent" :list-query="listQuery" :api="api">
        <div slot="queryFilter">
          <el-button v-waves class="filter-item" size="small" type="primary" icon="el-icon-edit" @click="handleCreate">{{ $t('table.add') }}</el-button>
        </div>
        <el-table-column slot="tableColumn" :label="$t('table.showName')" prop="display_name" align="center"/>
        <el-table-column slot="tableColumn" :label="$t('table.nameinfo')" prop="description" align="center"/>
        <el-table-column slot="tableColumn" :label="$t('table.adminName')" prop="name" align="center"/>
        <el-table-column slot="tableColumn" :label="$t('table.actions')" align="center" width="230" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="handleUpdate(scope.row.role_id)">{{ $t('table.edit') }}</el-button>
            <el-button size="mini" type="danger" @click="handleModifyStatus(scope.row.role_id)">{{ $t('table.delete') }}
            </el-button>
          </template>
        </el-table-column>
      </query>
    </div>
    <div v-show="dialogFormVisible" class="app-container">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="right" label-width="120px" style="width: 100%;">
        <el-form-item :label="$t('table.adminName')" prop="name">
          <el-input v-model="temp.name" type="text" placeholder="如：admin"/>
        </el-form-item>
        <el-form-item :label="$t('table.showName')" prop="display_name">
          <el-input v-model="temp.display_name" type="text" placeholder="如：管理员"/>
        </el-form-item>
        <el-form-item :label="$t('table.nameinfo')" prop="description">
          <el-input v-model="temp.description" type="text" placeholder="如：该管理员的权限范围"/>
        </el-form-item>
        <el-form-item :label="$t('table.permission')" prop="permissions">
          <el-row class="border" style="border-top: 1px solid #DCDFE6">
            <el-col :span="4">
              主菜单
            </el-col>
            <el-col :span="20" style="border-left: 1px solid #DCDFE6;;padding: 0 10px">
              子菜单
            </el-col>
          </el-row>
          <el-row v-for="(it, index) in addRouters" v-show="index < addRouters.length - 1" :key="index" class="border">
            <el-row>
              <el-col :span="4">
                <el-checkbox-group v-model="temp.permissions">
                  <el-checkbox :label="it.promiss" :key="index">{{ it.zhname }}</el-checkbox>
                </el-checkbox-group>
              </el-col>
              <el-col v-if="it.children && it.children.length > 1" :span="20" style="border-left: 1px solid #DCDFE6;padding: 0 10px">
                <el-checkbox-group v-model="temp.permissions">
                  <el-checkbox v-for="it2 in it.children" :label="it2.promiss" :key="it2.path">{{ it2.zhname }}</el-checkbox>
                </el-checkbox-group>
              </el-col>
            </el-row>
          </el-row>
        </el-form-item>
        <div class="filter-container">
          <el-button @click="dialogFormVisible = false">{{ $t('table.cancel') }}</el-button>
          <el-button v-if="dialogStatus=='create'" :loading="addloading" type="primary" @click="createData">{{ $t('table.confirm') }}</el-button>
          <el-button v-else :loading="editloading" type="primary" @click="updateData">{{ $t('table.confirm') }}</el-button>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import query from '@/components/queryTable'
import waves from '@/directive/waves' // 水波纹指令
export default {
  name: 'AddAdmin',
  directives: {
    waves
  },
  components: {
    query
  },
  data() {
    const checkPermissions = (rule, value, callback) => {
      if (value.length === 0) {
        return callback(new Error(this.$t('rules.permissions')))
      } else {
        callback()
      }
    }
    return {
      temp: {
        name: '',
        display_name: '',
        description: '',
        permissions: []
      },
      addloading: false,
      editloading: false,
      dialogStatus: '',
      dialogFormVisible: false,
      api: {
        fetch: '/role',
        add: '/role',
        edit: '/role',
        info: '/role',
        delete: '/role'
      },
      listQuery: {},
      listLoading: true,
      rules: {
        name: [{ required: true, message: this.$t('rules.name'), trigger: 'blur' }],
        display_name: [{ required: true, message: this.$t('rules.display_name'), trigger: 'blur' }],
        description: [{ required: true, message: this.$t('rules.description'), trigger: 'blur' }],
        permissions: [{ required: true, validator: checkPermissions, trigger: 'change' }]
      }
    }
  },
  computed: {
    ...mapGetters([
      'addRouters'
    ])
  },
  mounted() {
    this.$refs.querycomponent.getList()
  },
  methods: {
    handleModifyStatus(id) {
      this.$refs.querycomponent.deleteData(id)
    },
    handleFilter() {
      this.$refs.querycomponent.handleFilter()
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
              this.$refs.querycomponent.getList(1)
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
      })
    },
    handleUpdate(row) {
      this.listLoading = true
      this.dialogStatus = 'update'
      this.$r.get(this.api.info + '/' + row).then(re => {
        if (re.data.status === 'success') {
          this.dialogFormVisible = true
          this.temp = re.data.result
          this.$nextTick(() => {
            this.$refs['dataForm'].clearValidate()
          })
        } else {
          this.$notify.error({
            title: '失败',
            message: '获取失败',
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
          this.$r.post(this.api.edit, tempData).then((re) => {
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
                message: '修改失败',
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
    resetTemp() {
      this.temp = {
        name: '',
        display_name: '',
        description: '',
        permissions: []
      }
    }
  }
}
</script>

<style scoped>
  .border{
    border-bottom: 1px solid #DCDFE6;
    border-left: 1px solid #DCDFE6;
    border-right: 1px solid #DCDFE6;
    padding: 0 10px;
  }
</style>
