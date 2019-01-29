<template>
  <div>
    <query ref="querycomponent" :list-query="listQuery" :api="api">
      <div slot="queryFilter">
        <el-input :placeholder="$t('table.equip')" v-model="listQuery.SN" clearable size="small" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter"/>
        <el-button v-waves class="filter-item" size="small" type="primary" icon="el-icon-edit" @click="handleCreate">{{ $t('table.add') }}</el-button>
        <el-button v-waves class="filter-item" size="small" type="primary" icon="el-icon-search" @click="handleFilter">{{ $t('table.search') }}</el-button>
      </div>
      <el-table-column slot="tableColumn" :label="$t('table.id')" type="index" align="center"/>
      <el-table-column slot="tableColumn" :label="$t('table.equipname')" type="name" align="center"/>
      <el-table-column slot="tableColumn" :label="$t('table.equip')" align="center" prop="SN"/>
      <el-table-column slot="tableColumn" :label="$t('table.version')" align="center" prop="version"/>
      <el-table-column slot="tableColumn" :label="$t('table.recordtime')" align="center" prop="record_cyc"/>
      <el-table-column slot="tableColumn" :label="$t('table.uploaddate')" align="center" prop="upload_cyc"/>
      <el-table-column slot="tableColumn" :label="$t('table.operation')" align="center" prop="run_style">
        <template slot-scope="scope">
          <span>{{ scope.row.run_style === '00' ? '联网' : '单机' }}</span>
        </template>
      </el-table-column>
      <el-table-column slot="tableColumn" :label="$t('table.displays')" align="center" prop="show_style">
        <template slot-scope="scope">
          <span>{{ scope.row.show_style === '01' ? '总数' : '双向' }}</span>
        </template>
      </el-table-column>
      <el-table-column slot="tableColumn" :label="$t('table.opentime')" align="center" prop="open_time"/>
      <el-table-column slot="tableColumn" :label="$t('table.endtime')" align="center" prop="end_time"/>
      <el-table-column slot="tableColumn" :label="$t('table.electric2')" align="center" prop="infrared_electric"/>
      <!--<el-table-column slot="tableColumn" :label="$t('table.electric')" align="center" prop="counted_electric"/>-->
      <el-table-column slot="tableColumn" :label="$t('table.createTime')" width="180" align="center" prop="created_at"/>
      <el-table-column slot="tableColumn" :label="$t('table.focustype')" align="center" prop="focus">
        <template slot-scope="scope">
          <span>{{ scope.row.focus === 0 ? '未失焦' : '失焦' }}</span>
        </template>
      </el-table-column>
      <el-table-column slot="tableColumn" :label="$t('table.actions')" align="center" width="180" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleUpdate(scope.row.passenger_id)">{{ $t('table.edit') }}</el-button>
          <el-button size="mini" type="danger" @click="deleteData(scope.row.passenger_id)">{{ $t('table.delete') }}
          </el-button>
        </template>
      </el-table-column>
    </query>
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="500px" min-width="1200px">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="right" label-width="80px" style="width: 100%;">
        <el-form-item :label="$t('table.equip')">
          <el-input v-model="temp.SN"/>
        </el-form-item>
        <el-form-item :label="$t('table.equipname')">
          <el-input v-model="temp.name"/>
        </el-form-item>
        <el-form-item :label="$t('table.version')">
          <el-input v-model="temp.version"/>
        </el-form-item>
        <el-form-item :label="$t('table.recordtime')">
          <el-input v-model="temp.record_cyc"/>
        </el-form-item>
        <el-form-item :label="$t('table.uploaddate')">
          <el-input v-model="temp.upload_cyc"/>
        </el-form-item>
        <el-form-item :label="$t('table.operation')">
          <el-radio-group v-model="temp.run_style">
            <el-radio label="00">联网</el-radio>
            <el-radio label="01">单机</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item :label="$t('table.displays')">
          <el-radio-group v-model="temp.show_style">
            <el-radio label="02">双向</el-radio>
            <el-radio label="01">总数</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item :label="$t('table.opentime')" prop="open_time">
          <el-input v-model="temp.open_time" placeholder="请输入四位数字，如早上八点开馆即输入0800"/>
        </el-form-item>
        <el-form-item :label="$t('table.endtime')" prop="end_time">
          <el-input v-model="temp.end_time" placeholder="请输入四位数字，如晚上十点闭馆即输入2200"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">{{ $t('table.cancel') }}</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="createData">{{ $t('table.confirm') }}</el-button>
        <el-button v-else type="primary" @click="updateData">{{ $t('table.confirm') }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import query from '@/components/queryTable'
import waves from '@/directive/waves' // 水波纹指令

export default {
  name: 'Passengerequipment',
  directives: {
    waves
  },
  components: {
    query
  },
  data() {
    const validatetime = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('内容不能为空'))
      } else {
        var regs = /^[0-9]{4}$/
        if (regs.test(value)) {
          if (parseInt(value) > 2400) {
            callback(new Error('输入的时间须在0000-2400之间'))
          } else {
            console.log(parseInt(value.substr(2)))
            if (parseInt(value.substr(2)) > 59) {
              callback(new Error('输入的时间须在0000-2400之间,且分钟须小于60'))
            } else {
              callback()
            }
          }
        } else {
          callback(new Error('请输入正确的格式，如八点为：0800'))
        }
      }
    }
    return {
      tableKey: 0,
      list: null,
      total: null,
      value4: '',
      addloading: false,
      editloading: false,
      settledata: [
        { label: '已结算', value: 1 },
        { label: '未结算', value: 2 }
      ],
      api: {
        fetch: '/passenger',
        add: '/passenger',
        delete: '/passenger',
        edit: '/passenger',
        info: '/passenger'
      },
      listLoading: true,
      listQuery: {
        page: 1
      },
      statusOptions: ['published', 'draft', 'deleted'],
      showReviewer: false,
      temp: {
        run_style: '00',
        show_style: '02'
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
        open_time: [
          { validator: validatetime, trigger: 'blur' }
        ],
        end_time: [
          { validator: validatetime, trigger: 'blur' }
        ]
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
        run_style: '00',
        show_style: '02'
      }
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
      console.log(this.api.add, this.temp)
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
          this.$r.post(this.api.edit, tempData).then((re) => {
            console.log(re)
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
    handleDelete(row) {
      this.$refs.querycomponent.handleDelete(row)
    },
    handleDownload() {
      this.$refs.querycomponent.handleDownload()
    },
    timechange(d) {
      if (d) {
        this.listQuery.purchase_time_start = d[0]
        this.listQuery.purchase_time_end = d[1]
      } else {
        this.listQuery.purchase_time_start = ''
        this.listQuery.purchase_time_end = ''
      }
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>

</style>
