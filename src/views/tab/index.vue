<template>
  <query ref="querycomponent" :list-query="listQuery">
    <div slot="queryFilter">
      <el-button v-waves class="filter-item" size="small" type="primary" icon="el-icon-edit" @click="handleCreate">{{ $t('table.add') }}</el-button>
    </div>
    <el-table-column slot="tableColumn" :label="$t('table.activetheme')" align="center">
      <template slot-scope="scope">
        <span>{{ scope.row.id }}</span>
      </template>
    </el-table-column>
    <el-table-column slot="tableColumn" :label="$t('table.content')" align="center">
      <template slot-scope="scope">
        <span>{{ scope.row.timestamp | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
      </template>
    </el-table-column>
    <el-table-column slot="tableColumn" :label="$t('table.time')">
      <template slot-scope="scope">
        <span class="link-type" @click="handleUpdate(scope.row)">{{ scope.row.title }}</span>
        <el-tag>{{ scope.row.type | typeFilter }}</el-tag>
      </template>
    </el-table-column>
    <el-table-column slot="tableColumn" :label="$t('table.address')" align="center">
      <template slot-scope="scope">
        <span>{{ scope.row.author }}</span>
      </template>
    </el-table-column>
    <el-table-column slot="tableColumn" :label="$t('table.type')" align="center">
      <template slot-scope="scope">
        <span>{{ scope.row.author }}</span>
      </template>
    </el-table-column>
    <el-table-column slot="tableColumn" :label="$t('table.status')" align="center">
      <template slot-scope="scope">
        <el-button type="primary">{{ $t('table.registration') }}</el-button>
      </template>
    </el-table-column>
    <el-table-column slot="tableColumn" :label="$t('table.register')" align="center">
      <template slot-scope="scope">
        <el-button type="primary">{{ $t('table.registration') }}</el-button>
      </template>
    </el-table-column>
    <el-table-column slot="tableColumn" :label="$t('table.actions')" align="center" width="230" class-name="small-padding fixed-width">
      <template slot-scope="scope">
        <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">{{ $t('table.edit') }}</el-button>
        <el-button size="mini" type="danger" @click="handleModifyStatus(scope.row,'deleted')">{{ $t('table.delete') }}
        </el-button>
      </template>
    </el-table-column>
    <div slot="dataForms">
      <el-form-item :label="$t('table.type')">
        <el-select v-model="temp.importance" :placeholder="$t('table.type')" size="small" clearable>
          <el-option v-for="item in typedata" :key="item.value" :label="item.label" :value="item.value"/>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('table.activetheme')" prop="title">
        <el-input v-model="temp.title" type="text" />
      </el-form-item>
      <el-form-item :label="$t('table.contentValidity')" prop="title">
        <el-input v-model="temp.title" type="text" />
      </el-form-item>
      <el-form-item :label="$t('table.time')" prop="title">
        <el-input v-model="temp.title" type="text" />
      </el-form-item>
      <el-form-item :label="$t('table.address')" prop="title">
        <el-input v-model="temp.title" type="text" />
      </el-form-item>
      <el-form-item :label="$t('table.hostUnit')" prop="title">
        <el-input v-model="temp.title" type="text" />
      </el-form-item>
      <el-form-item :label="$t('table.coOperatingUnit')" prop="title">
        <el-input v-model="temp.title" type="text" />
      </el-form-item>
      <el-form-item :label="$t('table.activeObject')" prop="title">
        <el-input v-model="temp.title" type="text" />
      </el-form-item>
    </div>
  </query>
</template>

<script>
import query from '@/components/queryTable'
import waves from '@/directive/waves' // 水波纹指令

const calendarTypeOptions = [
  { key: 'CN', display_name: 'China' },
  { key: 'US', display_name: 'USA' },
  { key: 'JP', display_name: 'Japan' },
  { key: 'EU', display_name: 'Eurozone' }
]

// arr to obj ,such as { CN : "China", US : "USA" }
const calendarTypeKeyValue = calendarTypeOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})

export default {
  name: 'Tab',
  directives: {
    waves
  },
  components: {
    query
  },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'info',
        deleted: 'danger'
      }
      return statusMap[status]
    },
    typeFilter(type) {
      return calendarTypeKeyValue[type]
    }
  },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: null,
      value4: '',
      typedata: [
        { lable: '活动', value: 1 },
        { lable: '讲座', value: 2 }
      ],
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 10,
        importance: undefined,
        title: undefined,
        type: undefined,
        sort: '+id'
      },
      calendarTypeOptions,
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
