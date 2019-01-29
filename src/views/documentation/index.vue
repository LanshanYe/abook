<template>
  <query ref="querycomponent" :list-query="listQuery" :api="api">
    <div slot="queryFilter">
      <el-input :placeholder="$t('table.readCard')" v-model="listQuery.rdid" size="small" style="width: 200px;" class="filter-item" clearable @keyup.enter.native="handleFilter"/>
      <el-select v-model="listQuery.typename" :placeholder="$t('table.status')" size="small" clearable style="width: 90px" class="filter-item">
        <el-option v-for="(item,index) in statusdata" :key="index" :label="item" :value="item"/>
      </el-select>
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
    <el-table-column slot="tableColumn" :label="$t('table.readCard')" prop="DATA2" align="center"/>
    <el-table-column slot="tableColumn" :label="$t('table.bookname')" prop="TITLE" align="center"/>
    <el-table-column slot="tableColumn" :label="$t('table.time')" prop="REGTIME" align="center"/>
    <el-table-column slot="tableColumn" :label="$t('table.status')" prop="TYPENAME" align="center"/>
    <template slot="dataForms">
      <el-form-item :label="$t('table.title')">
        <el-input v-model="temp.title" type="text"/>
      </el-form-item>
    </template>
  </query>
</template>

<script>
import query from '@/components/queryTable'
import waves from '@/directive/waves' // 水波纹指令

export default {
  name: 'Documentation',
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
      imageUrl: '',
      api: {
        fetch: 'userborrow',
        info: 'userborrow'
      },
      statusdata: ['借书', '还书', '续借'],
      value4: '',
      listLoading: true,
      listQuery: {
        rows: 10
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
    deleteData(status) {
      this.$refs.querycomponent.deleteData(status)
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
      this.$r.get(this.api.info + '/' + row).then(re => {
      }).catch(errs => console.log(errs))
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
        this.listQuery.startDate = d[0]
        this.listQuery.endDate = d[1]
      } else {
        this.listQuery.startDate = ''
        this.listQuery.endDate = ''
      }
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>

</style>
