<template>
  <query ref="querycomponent" :list-query="listQuery" :api="api">
    <div slot="queryFilter">
      <el-input :placeholder="$t('table.bookname')" v-model="listQuery.book_title" size="small" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter"/>
      <el-input :placeholder="$t('table.press')" v-model="listQuery.book_press" size="small" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter"/>
      <el-input :placeholder="$t('table.borrower')" v-model="listQuery.user_name" size="small" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter"/>
      <el-input :placeholder="$t('table.phone')" v-model="listQuery.phone" size="small" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter"/>
      <el-select v-model="listQuery.status" :placeholder="$t('table.settleState')" class="filter-item" size="small" clearable>
        <el-option v-for="item in settledata" :key="item.value" :label="item.label" :value="item.value"/>
      </el-select>
      <el-date-picker
        v-model="value4"
        class="filter-item"
        size="small"
        type="daterange"
        value-format="yyyy-MM-dd HH:mm:ss"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        @change="timechange"/>
      <el-button v-waves class="filter-item" size="small" type="primary" icon="el-icon-search" @click="handleFilter">{{ $t('table.search') }}</el-button>
    </div>
    <el-table-column slot="tableColumn" :label="$t('table.id')" type="index" align="center"/>
    <el-table-column slot="tableColumn" :label="$t('table.bookname')" align="center" prop="book_title"/>
    <el-table-column slot="tableColumn" :label="$t('table.press')" align="center" prop="book_press"/>
    <el-table-column slot="tableColumn" :label="$t('table.price')" align="center" prop="book_price"/>
    <el-table-column slot="tableColumn" :label="$t('table.borrower')" align="center" prop="user_name"/>
    <el-table-column slot="tableColumn" :label="$t('table.readCard')" align="center" prop="reader_card_number"/>
    <el-table-column slot="tableColumn" :label="$t('table.phone')" align="center" prop="phone"/>
    <el-table-column slot="tableColumn" :label="$t('table.borrowDate')" align="center" prop="created_at"/>
    <el-table-column slot="tableColumn" :label="$t('table.settleState')" align="center" prop="status">
      <template slot-scope="scope">
        <el-tag :type="scope.row.status===1?'success':'danger'">{{ scope.row.status===1?'已结算':'未结算' }}</el-tag>
      </template>
    </el-table-column>
  </query>
</template>

<script>
import query from '@/components/queryTable'
import waves from '@/directive/waves' // 水波纹指令

export default {
  name: 'Clipboard',
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
        fetch: '/purchase'
      },
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 10,
        importance: undefined,
        title: undefined,
        type: undefined,
        sort: '+id'
      },
      statusOptions: ['published', 'draft', 'deleted'],
      showReviewer: false,
      temp: {
        id: undefined,
        importance: 1,
        remark: '',
        timestamp: new Date(),
        title: '',
        type: '',
        status: 'published'
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
