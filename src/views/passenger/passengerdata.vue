<template>
  <query ref="querycomponent" :list-query="listQuery" :api="api">
    <div slot="queryFilter">
      <el-input :placeholder="$t('table.equip')" v-model="listQuery.SN" clearable size="small" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter"/>
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
    </div>
    <el-table-column slot="tableColumn" :label="$t('table.identifier')" prop="count_id" align="center"/>
    <el-table-column slot="tableColumn" :label="$t('table.equip')" prop="SN" align="center"/>
    <el-table-column slot="tableColumn" :label="$t('table.count_in')" align="center" prop="count_in"/>
    <el-table-column slot="tableColumn" :label="$t('table.count_out')" align="center" prop="count_out"/>
    <el-table-column slot="tableColumn" :label="$t('table.uploadtime')" align="center" prop="upload_time"/>
  </query>
</template>

<script>
import query from '@/components/queryTable'
import waves from '@/directive/waves' // 水波纹指令

export default {
  name: 'Passengdata',
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
      total: null,
      value4: '',
      settledata: [
        { label: '已结算', value: 1 },
        { label: '未结算', value: 2 }
      ],
      api: {
        fetch: '/passengercount'
      },
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
    handleModifyStatus(row, status) {
      this.$refs.querycomponent.deleteData(row, status)
    },
    handleFilter() {
      this.$refs.querycomponent.handleFilter()
    },
    resetTemp() {
      this.$refs.querycomponent.resetTemp()
    },
    handleCreate() {
      this.$refs.querycomponent.handleCreate()
    },
    createData() {
      this.$refs.querycomponent.createData()
    },
    handleUpdate(row) {
      this.$refs.querycomponent.handleUpdate(row)
    },
    updateData() {
      this.$refs.querycomponent.updateData()
    },
    handleDelete(row) {
      this.$refs.querycomponent.handleDelete(row)
    },
    handleDownload() {
      this.$refs.querycomponent.handleDownload()
    },
    timechange(d) {
      if (d) {
        this.listQuery.start_time = d[0]
        this.listQuery.end_time = d[1]
      } else {
        delete this.listQuery.start_time
        delete this.listQuery.end_time
      }
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>

</style>
