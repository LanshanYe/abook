<template>
  <div class="dashboard-editor-container">

    <panel-group :data="indexdata" @handleSetLineChartData="handleSetLineChartData"/>

    <!--<el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">-->
    <!--<line-chart :chart-data="lineChartData"/>-->
    <!--</el-row>-->

    <el-row :gutter="32">
      <!--<el-col :xs="24" :sm="24" :lg="8">-->
      <!--<div class="chart-wrapper">-->
      <!--<raddar-chart/>-->
      <!--</div>-->
      <!--</el-col>-->
      <!--<el-col :xs="24" :sm="24" :lg="8">-->
      <!--<div class="chart-wrapper">-->
      <!--<pie-chart/>-->
      <!--</div>-->
      <!--</el-col>-->
      <el-col :xs="24" :sm="24" :lg="24">
        <div class="chart-wrapper">
          <bar-chart :data="bardata"/>
        </div>
      </el-col>
    </el-row>

  </div>
</template>

<script>
import PanelGroup from './components/PanelGroup'
// import LineChart from './components/LineChart'
// import RaddarChart from './components/RaddarChart'
// import PieChart from './components/PieChart'
import BarChart from './components/BarChart'

// const lineChartData = {
//   newVisitis: {
//     expectedData: [100, 120, 161, 134, 105, 160, 165],
//     actualData: [120, 82, 91, 154, 162, 140, 145]
//   },
//   messages: {
//     expectedData: [200, 192, 120, 144, 160, 130, 140],
//     actualData: [180, 160, 151, 106, 145, 150, 130]
//   },
//   purchases: {
//     expectedData: [80, 100, 121, 104, 105, 90, 100],
//     actualData: [120, 90, 100, 138, 142, 130, 130]
//   },
//   shoppings: {
//     expectedData: [130, 140, 141, 142, 145, 150, 160],
//     actualData: [120, 82, 91, 154, 162, 140, 130]
//   }
// }

export default {
  name: 'DashboardAdmin',
  components: {
    PanelGroup,
    // LineChart,
    // RaddarChart,
    // PieChart,
    BarChart
  },
  data() {
    return {
      // lineChartData: lineChartData.newVisitis,
      indexdata: {},
      bardata: {}
    }
  },
  created() {
    this.$r.get('/index').then(re => {
      this.indexdata = re.data.result
      var arr = []
      var arr2 = []
      re.data.result.todayBorrowRank.rows.forEach(v => {
        arr.push(v.title)
        arr2.push(v.totalNum)
      })
      this.bardata = {
        titledata: arr,
        datas: arr2,
        titles: '今日借出书籍排行榜',
        color: '#40c9c6'
      }
    }).catch(errs => { console.log(errs) })
  },
  methods: {
    handleSetLineChartData(type) {
      var arr = []
      var arr2 = []
      if (type === 'day') {
        this.indexdata.todayBorrowRank.rows.forEach(v => {
          arr.push(v.title)
          arr2.push(v.totalNum)
        })
        this.bardata = {
          titledata: arr,
          datas: arr2,
          titles: '今日借出书籍排行榜',
          color: '#40c9c6'
        }
      } else if (type === 'month') {
        this.indexdata.monthBorrowRank.rows.forEach(v => {
          arr.push(v.title)
          arr2.push(v.totalNum)
        })
        this.bardata = {
          titledata: arr,
          datas: arr2,
          titles: '本月借出书籍排行榜',
          color: '#36a3f7'
        }
      } else if (type === 'year') {
        this.indexdata.yearBorrowRank.rows.forEach(v => {
          arr.push(v.title)
          arr2.push(v.totalNum)
        })
        this.bardata = {
          titledata: arr,
          datas: arr2,
          titles: '本年借出书籍排行榜',
          color: '#f4516c'
        }
      }
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.dashboard-editor-container {
  padding: 32px;
  background-color: rgb(240, 242, 245);
  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 32px;
  }
}
</style>
