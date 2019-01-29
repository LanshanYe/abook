<!--
    Administrator
    2018/10/8 16:59
 -->
<template>
  <div>
    <div v-show="dialogFormVisible && !dialogVisible" class="app-container">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="right" label-width="100px" style="width: 100%;">
        <el-form-item :label="$t('table.resourcename')">
          <el-input v-model="temp.title"/>
        </el-form-item>
        <el-form-item :label="$t('table.mainword')">
          <el-input v-model="temp.keyword"/>
        </el-form-item>
        <el-form-item :label="$t('table.contentValidity')">
          <el-input v-model="temp.content"/>
        </el-form-item>
        <el-row :gutter="20">
          <el-col :xs="24" :sm="12" :lg="6">
            <el-form-item :label="$t('table.firstLevel')">
              <el-select :placeholder="$t('table.firstLevel')" v-model="temp.first_cate" size="small" @change="datachange2">
                <el-option v-for="(it,index) in firstdata" :key="index" :label="it.name" :value="it.id"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :lg="6">
            <el-form-item :label="$t('table.secondLevel')" prop="second_cate">
              <el-select :placeholder="$t('table.secondLevel')" v-model="temp.second_cate" size="small">
                <el-option v-for="(it,index) in seconddata2" :key="index" :label="it.name" :value="it.id"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :lg="12">
            <el-form-item label="是否为连续剧">
              <el-radio v-model="temp.is_series" :label="1">是</el-radio>
              <el-radio v-model="temp.is_series" :label="0">否</el-radio>
              <el-autocomplete
                v-show="temp.is_series===1"
                v-model="temp.name"
                :fetch-suggestions="querySearchAsync"
                style="margin-left: 10px;"
                clearable
                value-key="name"
                placeholder="可输入连续剧名称快速查找"
                @select="handleSelect">
                <template slot="prepend">{{ $t('table.kindname2') }}</template>
              </el-autocomplete>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item :label="$t('table.img')">
          <uploadimg :imgsrc="temp.cover" @upSuccess="upedsuccess"/>
        </el-form-item>
        <el-form-item :label="$t('table.file')" prop="url">
          <uploadfile ref="fileupload" @removefile="removefile" @fileuploadtype="getstatus"/>
        </el-form-item>
        <el-form-item :label="$t('table.path')">
          <el-input v-model="temp.url"/>
        </el-form-item>
        <el-form-item :label="$t('table.preview')">
          <video :src="temp.play_url" controls="controls" width="100%" height="300px">
            您的浏览器不支持 video 标签。
            <a :href="temp.play_url">点击查看视频</a>
          </video>
        </el-form-item>
      </el-form>
      <div class="filter-container">
        <el-button @click="dialogFormVisible = false">{{ $t('table.cancel') }}</el-button>
        <el-button v-if="dialogStatus=='create'" :loading="addloading" type="primary" @click="createData">{{ $t('table.confirm') }}</el-button>
        <el-button v-else :loading="editloading" type="primary" @click="updateData">{{ $t('table.confirm') }}</el-button>
      </div>
    </div>
    <div v-show="!dialogFormVisible && !dialogVisible">
      <query ref="querycomponent" :list-query="listQuery" :dialog-width="'1000px'" :api="api">
        <div slot="queryFilter">
          <el-select :placeholder="$t('table.firstLevel')" v-model="listQuery.first_cate" size="small" style="width: 200px;" class="filter-item" clearable @change="datachange">
            <el-option v-for="(it,index) in firstdata" :key="index" :label="it.name" :value="it.id"/>
          </el-select>
          <el-select :placeholder="$t('table.secondLevel')" v-model="listQuery.second_cate" size="small" style="width: 200px;" class="filter-item" clearable>
            <el-option v-for="(it,index) in seconddata" :key="index" :label="it.name" :value="it.id"/>
          </el-select>
          <el-input :placeholder="$t('table.resourcename')" v-model="listQuery.title" size="small" style="width: 200px;" class="filter-item" clearable @keyup.enter.native="handleFilter"/>
          <el-button v-waves class="filter-item" size="small" type="primary" icon="el-icon-search" @click="handleFilter">{{ $t('table.search') }}</el-button>
          <el-button v-waves class="filter-item" size="small" type="primary" icon="el-icon-edit" @click="handleCreate">{{ $t('table.add') }}</el-button>
          <el-button v-waves class="filter-item" size="small" type="success" icon="el-icon-edit" @click="createDatas">{{ $t('table.adds') }}</el-button>
        </div>
        <el-table-column slot="tableColumn" :label="$t('table.resourcename')" align="center" prop="title"/>
        <el-table-column slot="tableColumn" :label="$t('table.firstLevel')" :formatter="idformate" align="center" prop="first_cate"/>
        <el-table-column slot="tableColumn" :label="$t('table.secondLevel')" :formatter="idformate" align="center" prop="second_cate"/>
        <el-table-column slot="tableColumn" :label="$t('table.actions')" align="center" width="230" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="handleUpdate(scope.row.video_id)">{{ $t('table.edit') }}</el-button>
            <el-button size="mini" type="danger" @click="handleModifyStatus(scope.row.video_id)">{{ $t('table.delete') }}</el-button>
          </template>
        </el-table-column>
      </query>
    </div>
    <div v-show="dialogVisible && !dialogFormVisible" class="app-container">
      <el-row style="margin-bottom: 10px">
        <el-button type="primary" icon="el-icon-plus" @click="addData">{{ $t('table.add') }}</el-button>
      </el-row>
      <el-row v-for="(it, index) in formdatas" :key="index" class="borders">
        <el-row :gutter="10">
          <el-col :xs="18" :sm="22" :lg="3">
            <div class="box">
              <div class="left"><div class="tips">封面图:</div></div>
              <div class="right"><uploadimg :imgsrc="it.cover" :key="index" :theindex="index" @upSuccess="upedsuccess2"/></div>
            </div>
          </el-col>
          <el-col :xs="24" :sm="12" :lg="2">
            <el-input v-model="it.title" placeholder="资源名称"/>
          </el-col>
          <el-col :xs="24" :sm="12" :lg="3">
            <el-select v-model="it.first_cate" class="width100" placeholder="一级类目" @change="changedata($event, index)">
              <el-option v-for="(it,i1) in firstdata" :key="i1" :label="it.name" :value="it.id"/>
            </el-select>
          </el-col>
          <el-col :xs="24" :sm="12" :lg="3">
            <el-select v-model="it.second_cate" class="width100" placeholder="二级类目">
              <el-option v-for="(it,i2) in seconddatas[index].selectdata" :key="i2" :label="it.name" :value="it.id"/>
            </el-select>
          </el-col>
          <el-col :xs="24" :sm="12" :lg="3">
            <el-input v-model="it.url" placeholder="资源路径"/>
          </el-col>
          <el-col :xs="24" :sm="12" :lg="3">
            <el-input v-model="it.content" placeholder="内容简介"/>
          </el-col>
          <el-col :xs="24" :sm="12" :lg="6">
            <div class="box">
              <div class="left"><div class="tips">连续剧:</div></div>
              <div class="radiocheck">
                <el-radio-group v-model="it.is_series">
                  <el-radio-button :label="1">是</el-radio-button>
                  <el-radio-button :label="0">否</el-radio-button>
                </el-radio-group>
              </div>
              <div class="right">
                <el-select
                  v-show="it.is_series===1"
                  v-model="it.series_id"
                  placeholder="连续剧名称">
                  <el-option v-for="(option, i3) in soapdatas" :key="i3" :value="option.series_id" :label="option.name"/>
                </el-select>
              </div>
            </div>
          </el-col>
          <el-col :xs="6" :sm="2" :lg="1"><el-button size="mini" type="danger" icon="el-icon-close" circle @click="delData(index)"/></el-col>
        </el-row>
      </el-row>
      <div class="filter-container">
        <el-button @click="dialogVisible = false">{{ $t('table.cancel') }}</el-button>
        <el-button :loading="uploading" type="primary" @click="creates">{{ $t('table.confirm') }}</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import query from '@/components/queryTable'
import uploadimg from '@/components/Upload/singleImage'
import waves from '@/directive/waves' // 水波纹指令
import uploadfile from '@/components/Upload/uploadFile'

export default {
  name: 'Resource',
  directives: {
    waves
  },
  components: {
    query,
    uploadimg,
    uploadfile
  },
  data() {
    return {
      tableKey: 0,
      dialogVisible: false,
      uploading: false,
      list: null,
      total: null,
      isSoap: false,
      soapname: '',
      soapid: '',
      value4: '',
      formdatas: [
        { title: '', content: '', first_cate: '', second_cate: '', url: '', cover: '', is_series: 0, series_id: '' }
      ],
      msg: { title: '资源名称', first_cate: '一级类目', second_cate: '二级类目', url: '路径', is_series: '连续剧名称' },
      searchdata: [],
      soapdatas: [],
      seconddatas: [
        { selectdata: [] }
      ],
      submits: {},
      addloading: false,
      editloading: false,
      listLoading: true,
      filedata: [],
      api: {
        fetch: '/video',
        add: '/video',
        info: '/video',
        edit: '/video',
        delete: '/video'
      },
      files: [],
      imgList: [],
      listQuery: {
        page: 1,
        second_cate: ''
      },
      statusOptions: ['published', 'draft', 'deleted'],
      showReviewer: false,
      checked: false,
      temp: {
        second_cate: '',
        cover: '',
        is_series: 0,
        play_url: ''
      },
      data1: [],
      data2: [],
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '修改',
        create: '新增'
      },
      dialogPvVisible: false,
      pvData: [],
      firstdata: [],
      seconddata: [],
      seconddata2: [],
      leveldata: [],
      iddata: [],
      rules: {
        second_cate: [{ required: true, message: '请选择二级类目', trigger: 'change' }],
        url: [{ required: true, message: '请上传视频文件', trigger: 'change' }]
        // timestamp: [{ type: 'date', required: true, message: 'timestamp is required', trigger: 'change' }],
        // title: [{ required: true, message: 'title is required', trigger: 'blur' }]
      },
      downloadLoading: false
    }
  },
  mounted() {
    this.$refs.querycomponent.getList()
    this.$r.get('/video_cate/0').then(re => {
      this.firstdata = re.data.result
    }).catch(errs => {
      console.log(errs)
    })
    this.$r.get('/video-cate').then(re => {
      this.iddata = re.data.result
    }).catch(errs => {
      console.log(errs)
    })
    this.$r.get('/video_series_query').then(re => {
      this.soapdatas = re.data.result
    })
  },
  methods: {
    handleModifyStatus(id) {
      this.$refs.querycomponent.deleteData(id)
    },
    upedsuccess(url) {
      this.temp.cover = url[0]
    },
    upedsuccess2(url) {
      this.formdatas[url[1]].cover = url[0]
    },
    serieschange(n) {
      if (n) {
        this.temp.is_series = 1
      } else {
        this.temp.is_series = 0
      }
    },
    addData() {
      if (this.formdatas.length >= 15) {
        this.$message({
          message: '一次最多添加15条',
          type: 'warning'
        })
        return false
      } else {
        this.formdatas.push({ title: '', content: '', first_cate: '', second_cate: '', url: '', cover: '', is_series: 0, series_id: '' })
        this.seconddatas.push({ selectdata: [] })
      }
    },
    delData(i) {
      this.formdatas.splice(i, 1)
      this.seconddatas.splice(i, 1)
    },
    removefile() {
      this.temp.play_url = ''
      this.temp.url = ''
    },
    getstatus(re) {
      if (re.status === 'done') {
        this.temp.play_url = re.result.source
        this.temp.url = re.result.file_path
      }
    },
    datachange(d) {
      this.listQuery.second_cate = ''
      this.seconddata = []
      if (d) {
        this.$r.get('video_cate/' + d).then(re => {
          this.seconddata = re.data.result
        }).catch(errs => {
          console.log(errs)
        })
      }
    },
    datachange2(d) {
      this.temp.second_cate = ''
      this.seconddata2 = []
      if (d) {
        this.$r.get('video_cate/' + d).then(re => {
          this.seconddata2 = re.data.result
        }).catch(errs => {
          console.log(errs)
        })
      }
    },
    createDatas() {
      this.formdatas = [
        { title: '', content: '', first_cate: '', second_cate: '', url: '', cover: '', is_series: 0, series_id: '' }
      ]
      this.seconddatas = [
        { selectdata: [] }
      ]
      this.dialogVisible = true
    },
    handleFilter() {
      this.$refs.querycomponent.handleFilter()
    },
    resetTemp() {
      this.temp = {
        second_cate: '',
        cover: '',
        is_series: 0,
        play_url: ''
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs.fileupload.removefile()
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.addloading = true
          this.listLoading = true
          if (this.temp.is_series === 1) {
            if (this.temp.name === '' || this.temp.name === undefined) {
              this.$notify({
                title: '提示',
                message: '分类名称不能为空',
                type: 'warning'
              })
              return false
            }
            for (var ii = 0; ii < this.searchdata.length; ii++) {
              if (this.searchdata[ii].name === this.temp.name) {
                this.temp.series_id = this.searchdata[ii].series_id
                break
              } else {
                this.temp.series_id = ''
              }
            }
          } else {
            this.temp.name = ''
            this.temp.series_id = ''
          }
          this.$r.post(this.api.add, this.temp).then((re) => {
            if (re.data.status === 'success') {
              this.dialogFormVisible = false
              this.$refs.querycomponent.getList()
              this.$notify({
                title: '成功',
                message: '创建成功',
                type: 'success'
              })
            } else {
              this.$notify.error({
                title: '失败',
                message: re.data.msg
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
      this.files = []
      this.$r.get(this.api.info + '/' + row).then(re => {
        if (re.data.status === 'success') {
          this.dialogFormVisible = true
          this.temp = re.data.result
          if (re.data.result) {
            if (re.data.result.first_cate) {
              this.$r.get('video_cate/' + re.data.result.first_cate).then(re => {
                this.seconddata2 = re.data.result
              }).catch(errs => {
                console.log(errs)
              })
            }
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
          if (this.temp.is_series === 1) {
            if (this.temp.name === '' || this.temp.name === undefined) {
              this.$notify({
                title: '提示',
                message: '分类名称不能为空',
                type: 'warning',
                duration: 2000
              })
              return false
            }
          } else {
            this.temp.name = ''
            this.temp.series_id = ''
          }
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
                message: re.data.msg || '修改失败',
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
    handleDelete(row) {
      this.$refs.querycomponent.handleDelete(row)
    },
    handleDownload() {
      this.$refs.querycomponent.handleDownload()
    },
    querySearchAsync(queryString, cb) {
      this.$r.get('/video_series_query', { name: queryString }).then(re => {
        var restaurants = re.data.result
        this.searchdata = re.data.result
        var results = queryString ? restaurants.filter(this.createStateFilter(queryString)) : restaurants
        cb(results)
      }).catch(errs => {
        console.log(errs)
      })
    },
    changedata(v, i) {
      this.formdatas[i].second_cate = ''
      this.seconddatas[i].selectdata = []
      if (v) {
        this.$r.get('video_cate/' + v).then(re => {
          this.seconddatas[i].selectdata = re.data.result
        }).catch(errs => {
          console.log(errs)
        })
      }
    },
    createStateFilter(queryString) {
      return (state) => {
        return (state.name.toLowerCase().indexOf(queryString.toLowerCase()) === 0)
      }
    },
    creates() {
      if (this.formdatas.length <= 0 || this.seconddatas.length <= 0) {
        this.$message({
          message: '至少添加一条数据',
          type: 'warning'
        })
      } else {
        var lists = []
        for (var n = 0; n < this.formdatas.length; n++) {
          for (var m in this.formdatas[n]) {
            if (m === 'title' || m === 'first_cate' || m === 'second_cate' || m === 'url') {
              if (this.formdatas[n][m] === '') {
                this.$message({
                  message: this.msg[m] + ' 为必填项',
                  type: 'warning'
                })
                return false
              }
            } else if (m === 'is_series') {
              if (this.formdatas[n][m] === 1) {
                if (this.formdatas[n].series_id === '') {
                  this.$message({
                    message: this.msg[m] + ' 为必填项',
                    type: 'warning'
                  })
                  return false
                }
              }
            }
          }
          lists.push(this.formdatas[n])
        }
        this.uploading = true
        this.$r.post('batchStore', { list: lists }).then(re => {
          if (re.data.status === 'success') {
            this.dialogVisible = false
            this.$refs.querycomponent.getList()
            this.$notify({
              title: '成功',
              message: '新增成功',
              type: 'success'
            })
          } else {
            this.$notify.error({
              title: '失败',
              message: re.data.msg || '新增失败'
            })
          }
          this.uploading = false
        }).catch(errs => {
          console.log(errs)
          this.uploading = false
        })
      }
    },
    handleSelect(item) {
      this.temp.series_id = item.series_id
      this.temp.name = item.name
    },
    inputclear() {
      this.temp.series_id = ''
    },
    idformate(r, c, v) {
      var vl = v
      for (var i = 0; i < this.iddata.length; i++) {
        if (v === this.iddata[i].id) {
          vl = this.iddata[i].name
          break
        }
      }
      return vl
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .tips{
    font-size: 12px;color: #595959;
    line-height: 36px;
  }
  .el-col{
    margin-top: 10px;
  }
  .borders{
    border-bottom: 1px dashed #bebebe;
    margin-bottom: 10px;
    padding-bottom: 10px;
  }
  .box{
    display: flex;
    .left{
      width: 45px;
    }
    .right{
      flex: 1;
    }
    .radiocheck{
      width: 115px;
    }
  }
</style>
