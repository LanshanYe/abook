<template>
  <el-row :gutter="40" class="panel-group">
    <el-col :xs="24" :sm="12" :lg="8" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('day')">
        <div class="card-panel-icon-wrapper icon-people">
          <svg-icon icon-class="peoples" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">今日办证人数：<span><count-to :start-val="0" :end-val="parseInt(data.todayCertificate) || 0" :duration="1000" class="card-panel-num"/></span></div>
          <div class="card-panel-text">今日借出图书数：<span><count-to :start-val="0" :end-val="parseInt(data.todayBorrow) || 0" :duration="1000" class="card-panel-num"/></span></div>
        </div>
      </div>
    </el-col>
    <el-col :xs="24" :sm="12" :lg="8" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('month')">
        <div class="card-panel-icon-wrapper icon-message">
          <svg-icon icon-class="peoples" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">本月办证人数：<span><count-to :start-val="0" :end-val="parseInt(data.monthCertificate) || 0" :duration="1000" class="card-panel-num"/></span></div>
          <div class="card-panel-text">本月借出图书数：<span><count-to :start-val="0" :end-val="parseInt(data.monthBorrow) || 0" :duration="1000" class="card-panel-num"/></span></div>
        </div>
      </div>
    </el-col>
    <el-col :xs="24" :sm="12" :lg="8" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('year')">
        <div class="card-panel-icon-wrapper icon-money">
          <svg-icon icon-class="peoples" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">本年办证人数：<span><count-to :start-val="0" :end-val="parseInt(data.yearCertificate) || 0" :duration="1000" class="card-panel-num"/></span></div>
          <div class="card-panel-text">本年借出图书数：<span><count-to :start-val="0" :end-val="parseInt(data.yearBorrow) || 0" :duration="1000" class="card-panel-num"/></span></div>
        </div>
      </div>
    </el-col>
    <!--<el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">-->
    <!--<div class="card-panel" @click="handleSetLineChartData('newVisitis')">-->
    <!--<div class="card-panel-icon-wrapper icon-people">-->
    <!--<svg-icon icon-class="peoples" class-name="card-panel-icon" />-->
    <!--</div>-->
    <!--<div class="card-panel-description">-->
    <!--<div class="card-panel-text">New Visits</div>-->
    <!--<count-to :start-val="0" :end-val="102400" :duration="2600" class="card-panel-num"/>-->
    <!--</div>-->
    <!--</div>-->
    <!--</el-col>-->
    <!--<el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">-->
    <!--<div class="card-panel" @click="handleSetLineChartData('messages')">-->
    <!--<div class="card-panel-icon-wrapper icon-message">-->
    <!--<svg-icon icon-class="message" class-name="card-panel-icon" />-->
    <!--</div>-->
    <!--<div class="card-panel-description">-->
    <!--<div class="card-panel-text">Messages</div>-->
    <!--<count-to :start-val="0" :end-val="81212" :duration="3000" class="card-panel-num"/>-->
    <!--</div>-->
    <!--</div>-->
    <!--</el-col>-->
    <!--<el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">-->
    <!--<div class="card-panel" @click="handleSetLineChartData('purchases')">-->
    <!--<div class="card-panel-icon-wrapper icon-money">-->
    <!--<svg-icon icon-class="money" class-name="card-panel-icon" />-->
    <!--</div>-->
    <!--<div class="card-panel-description">-->
    <!--<div class="card-panel-text">Purchases</div>-->
    <!--<count-to :start-val="0" :end-val="9280" :duration="3200" class="card-panel-num"/>-->
    <!--</div>-->
    <!--</div>-->
    <!--</el-col>-->
    <!--<el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">-->
    <!--<div class="card-panel" @click="handleSetLineChartData('shoppings')">-->
    <!--<div class="card-panel-icon-wrapper icon-shoppingCard">-->
    <!--<svg-icon icon-class="shoppingCard" class-name="card-panel-icon" />-->
    <!--</div>-->
    <!--<div class="card-panel-description">-->
    <!--<div class="card-panel-text">Shoppings</div>-->
    <!--<count-to :start-val="0" :end-val="13600" :duration="3600" class="card-panel-num"/>-->
    <!--</div>-->
    <!--</div>-->
    <!--</el-col>-->
  </el-row>
</template>

<script>
import CountTo from 'vue-count-to'

export default {
  components: {
    CountTo
  },
  props: {
    data: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  methods: {
    handleSetLineChartData(type) {
      this.$emit('handleSetLineChartData', type)
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.panel-group {
  margin-top: 18px;
  .card-panel-col{
    margin-bottom: 32px;
    min-width: 315px;
  }
  .card-panel {
    height: 108px;
    cursor: pointer;
    font-size: 12px;
    position: relative;
    overflow: hidden;
    color: #666;
    background: #fff;
    box-shadow: 4px 4px 40px rgba(0, 0, 0, .05);
    border-color: rgba(0, 0, 0, .05);
    &:hover {
      .card-panel-icon-wrapper {
        color: #fff;
      }
      .icon-people {
         background: #40c9c6;
      }
      .icon-message {
        background: #36a3f7;
      }
      .icon-money {
        background: #f4516c;
      }
      .icon-shoppingCard {
        background: #34bfa3
      }
    }
    .icon-people {
      color: #40c9c6;
    }
    .icon-message {
      color: #36a3f7;
    }
    .icon-money {
      color: #f4516c;
    }
    .icon-shoppingCard {
      color: #34bfa3
    }
    .card-panel-icon-wrapper {
      float: left;
      margin: 14px 0 0 14px;
      padding: 16px;
      transition: all 0.38s ease-out;
      border-radius: 6px;
    }
    .card-panel-icon {
      float: left;
      font-size: 48px;
    }
    .card-panel-description {
      float: right;
      font-weight: bold;
      margin-top: 16px;
      margin-right: 32px;
      .card-panel-text {
        line-height: 36px;
        color: rgba(0, 0, 0, 0.45);
        font-size: 16px;
      }
      .card-panel-num {
        font-size: 20px;
        color: black;
      }
    }
  }
}
</style>
