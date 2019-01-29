<template>
  <div>
    <query ref="querycomponent" :list-query="listQuery" :api="api">
      <div slot="queryCount">
        <el-input :value="queryInputdata.people" readonly class="queryInput" size="large">
          <template slot="prepend">捐赠人数</template>
        </el-input>
        <el-input :value="queryInputdata.book" readonly class="queryInput" size="large">
          <template slot="prepend">捐赠图书数量</template>
        </el-input>
        <el-input :value="queryInputdata.money" readonly class="queryInput" size="large">
          <template slot="prepend">捐赠总价</template>
        </el-input>
      </div>
      <div slot="queryFilter">
        <el-input :placeholder="$t('table.name')" v-model="listQuery.real_name" size="small" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter"/>
        <el-input :placeholder="$t('table.phone')" v-model="listQuery.phone" size="small" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter"/>
        <el-input :placeholder="$t('table.bookname')" v-model="listQuery.book_name" size="small" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter"/>
        <el-input :placeholder="$t('table.press')" v-model="listQuery.book_press" size="small" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter"/>
        <el-date-picker
          v-model="value4"
          class="filter-item"
          size="small"
          type="datetimerange"
          range-separator="至"
          value-format="yyyy-MM-dd HH:mm:ss"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          @change="timechange"/>
        <el-button v-waves class="filter-item" size="small" type="primary" icon="el-icon-search" @click="handleFilter">{{ $t('table.search') }}</el-button>
        <el-button v-waves class="filter-item" size="small" type="primary" icon="el-icon-edit" @click="handleCreate">{{ $t('table.add') }}</el-button>
        <el-button v-waves :loading="downloadLoading" class="filter-item" size="small" type="primary" icon="el-icon-download" @click="handleDownload">{{ $t('table.download') }}</el-button>
      </div>
      <el-table-column slot="tableColumn" :label="$t('table.name')" align="center" prop="real_name"/>
      <el-table-column slot="tableColumn" :label="$t('table.phone')" align="center" prop="phone"/>
      <el-table-column slot="tableColumn" :label="$t('table.bookname')" align="center" prop="book_name"/>
      <el-table-column slot="tableColumn" :label="$t('table.giveword')" align="center" prop="content"/>
      <el-table-column slot="tableColumn" :label="$t('table.press')" align="center" prop="book_press"/>
      <el-table-column slot="tableColumn" :label="$t('table.price')" prop="book_price" align="center"/>
      <el-table-column slot="tableColumn" :label="$t('table.number')" prop="book_num" align="center"/>
      <el-table-column slot="tableColumn" :label="$t('table.donationDate')" prop="donate_time" align="center"/>
      <el-table-column slot="tableColumn" :label="$t('table.actions')" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleUpdate(scope.row.donate_id)">{{ $t('table.edit') }}</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.row.donate_id)">{{ $t('table.delete') }}</el-button>
        </template>
      </el-table-column>
    </query>
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="500px" min-width="1200px">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="right" label-width="80px" style="width: 100%;">
        <el-form-item :label="$t('table.name')">
          <el-input v-model="temp.real_name"/>
        </el-form-item>
        <el-form-item :label="$t('table.phone')">
          <el-input v-model="temp.phone"/>
        </el-form-item>
        <el-form-item :label="$t('table.bookname')">
          <el-input v-model="temp.book_name"/>
        </el-form-item>
        <el-form-item :label="$t('table.press')">
          <el-input v-model="temp.book_press"/>
        </el-form-item>
        <el-form-item :label="$t('table.giveword')">
          <el-input v-model="temp.content"/>
        </el-form-item>
        <el-form-item :label="$t('table.price')">
          <el-input v-model="temp.book_price"/>
        </el-form-item>
        <el-form-item :label="$t('table.number')">
          <el-input v-model="temp.book_num"/>
        </el-form-item>
        <el-form-item :label="$t('table.donationDate')">
          <el-date-picker v-model="temp.donate_time" value-format="yyyy-MM-dd" placeholder="选择日期" type="date"/>
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
  name: 'DonationList',
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
      addloading: false,
      editloading: false,
      total: null,
      api: {
        fetch: '/donate/search',
        add: '/donate-book/add',
        edit: '/donate_book',
        delete: '/donate_book',
        info: '/donate_book_show'
      },
      value4: '',
      listLoading: true,
      queryInputdata: {
        people: '',
        book: '',
        money: ''
      },
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
    this.getcountData()
  },
  methods: {
    getcountData() {
      this.$r.get('/donate_index').then(re => {
        this.queryInputdata = re.data.result
      }).catch(errs => console.log(errs))
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
          this.listLoading = true
          this.$r.post(this.api.add, this.temp).then((re) => {
            if (re.data.status === 'success') {
              this.dialogFormVisible = false
              this.$refs.querycomponent.getList()
              this.getcountData()
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
            this.listLoading = false
          }).catch(errs => {
            this.addloading = false
            this.listLoading = false
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
          if (re.data.result.images) {
            this.imgList.push({ name: re.data.result.title, url: re.data.result.images })
          }
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
          const tempData = Object.assign({}, this.temp)
          this.$r.put(this.api.edit + '/' + tempData.donate_id, tempData).then((re) => {
            if (re.data.status === 'success') {
              this.$refs.querycomponent.getList()
              this.getcountData()
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
            this.editloading = true
          }).catch(errs => {
            this.listLoading = false
            this.editloading = true
            console.log(errs)
          })
        }
      })
    },
    handleDelete(row) {
      this.$refs.querycomponent.deleteData(row)
    },
    handleDownload() {
      this.downloadLoading = true
      this.$r.get('/donateExcel').then(re => {
        console.log(re)
        import('@/vendor/Export2Excel').then(excel => {
          const tHeader = ['姓名', '手机号', '书名', '寄语', '出版社', '价格', '数量', '捐赠日期']
          const filterVal = ['real_name', 'phone', 'book_name', 'content', 'book_press', 'book_price', 'book_num', 'donate_time']
          const data = this.formatJson(filterVal, re.data.result)
          excel.export_json_to_excel({
            header: tHeader,
            data,
            filename: '捐赠图书列表'
          })
          this.downloadLoading = false
        })
      }).catch(errs => {
        console.log(errs)
        this.downloadLoading = false
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]))
    },
    timechange(d) {
      if (d) {
        this.listQuery.start = d[0]
        this.listQuery.end = d[1]
      } else {
        this.listQuery.start = ''
        this.listQuery.end = ''
      }
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>

</style>
