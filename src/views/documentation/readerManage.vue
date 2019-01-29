<template>
  <query ref="querycomponent" :list-query="listQuery" :api="api">
    <div slot="queryFilter">
      <el-input :placeholder="$t('table.name')" v-model="listQuery.RDNAME" size="small" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter"/>
      <el-input :placeholder="$t('table.bookname')" v-model="listQuery.PHONE" size="small" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter"/>
      <el-select v-model="listQuery.RDCFSTATE" :placeholder="$t('table.status')" size="small" clearable style="width: 90px" class="filter-item">
        <el-option v-for="item in statusdata" :key="item.value" :label="item.label" :value="item.value"/>
      </el-select>
      <el-date-picker
        v-model="value4"
        class="filter-item"
        size="small"
        type="datetimerange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        @change="timechange"/>
      <el-button v-waves class="filter-item" size="small" type="primary" icon="el-icon-search" @click="handleFilter">{{ $t('table.search') }}</el-button>
    </div>
    <el-table-column slot="tableColumn" :label="$t('table.name')" prop="RDNAME" align="center"/>
    <el-table-column slot="tableColumn" :label="$t('table.phone')" prop="PHONE" align="center"/>
    <el-table-column slot="tableColumn" :label="$t('table.readCard')" prop="RDID" align="center"/>
    <el-table-column slot="tableColumn" :label="$t('table.endTime')" prop="RDENDDATE" align="center"/>
    <el-table-column slot="tableColumn" :label="$t('table.status')" :formatter="state" prop="RDCFSTATE" align="center"/>
  </query>
</template>

<script>
import query from '@/components/queryTable'
import waves from '@/directive/waves' // 水波纹指令

export default {
  name: 'Rcard',
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
        fetch: 'users',
        info: 'users'
      },
      statusdata: [
        { label: '有效', value: 1 },
        { label: '验证', value: 2 },
        { label: '丢失', value: 3 },
        { label: '暂停', value: 4 },
        { label: '注销', value: 5 },
        { label: '信用有效', value: 10 }
      ],
      value4: '',
      listLoading: true,
      listQuery: {
        page: 1,
        rows: 10,
        RDCFSTATE: '',
        STARDATE: '',
        ENDDATE: '',
        specialType: ''
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
    deleteData(id) {
      this.$refs.querycomponent.deleteData(id)
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
    handleUpdate(id) {
      this.$refs.querycomponent.handleUpdate(id)
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
        this.listQuery.RDSTARTDATE = d[0]
        this.listQuery.RDENDDATE = d[1]
      } else {
        this.listQuery.RDSTARTDATE = ''
        this.listQuery.RDENDDATE = ''
      }
    },
    state(d) {
      var vl = d.RDCFSTATE
      for (var i = 0; i < this.statusdata.length; i++) {
        if (d.RDCFSTATE === this.statusdata[i].value) {
          vl = this.statusdata[i].label
          break
        }
      }
      return vl
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>

</style>
