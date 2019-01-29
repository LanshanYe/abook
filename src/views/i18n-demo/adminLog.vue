<template>
  <query ref="querycomponent" :list-query="listQuery" :api="api">
    <el-table-column slot="tableColumn" :label="$t('table.username')" align="center" prop="real_name"/>
    <el-table-column slot="tableColumn" :label="$t('table.phone')" align="center" prop="phone"/>
    <el-table-column slot="tableColumn" :label="$t('table.option')" align="center" prop="desc"/>
    <el-table-column slot="tableColumn" :label="$t('table.optionTime')" align="center" prop="created_at"/>
  </query>
</template>

<script>
import query from '@/components/queryTable'
import waves from '@/directive/waves' // 水波纹指令

export default {
  name: 'AdminLog',
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
      listLoading: true,
      listQuery: {
        page: 1
      },
      api: {
        fetch: '/option'
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
      this.$refs.querycomponent.handleModifyStatus(row, status)
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
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>

</style>
