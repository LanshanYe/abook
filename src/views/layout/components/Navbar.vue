<template>
  <div class="navbar">
    <hamburger :toggle-click="toggleSideBar" :is-active="sidebar.opened" class="hamburger-container"/>

    <breadcrumb class="breadcrumb-container"/>
    <div class="right-menu" style="margin-right: 30px;">
      {{ name }}
    </div>
    <div class="right-menu">
      <template v-if="device!=='mobile'">
        <error-log class="errLog-container right-menu-item"/>

        <el-tooltip :content="$t('navbar.screenfull')" effect="dark" placement="bottom">
          <screenfull class="screenfull right-menu-item"/>
        </el-tooltip>
        <el-tooltip :content="$t('navbar.langs')" effect="dark" placement="bottom">
          <lang-select class="international right-menu-item"/>
        </el-tooltip>
      </template>

      <el-dropdown class="avatar-container right-menu-item" placement="bottom">
        <div class="avatar-wrapper">
          <img v-if="avatar" :src="avatar+'?imageView2/1/w/80/h/80'" class="user-avatar">
          <svg-icon v-else icon-class="user" class="user-avatar" />
        </div>
        <el-dropdown-menu slot="dropdown">
          <router-link to="/">
            <el-dropdown-item>
              {{ $t('navbar.dashboard') }}
            </el-dropdown-item>
          </router-link>
          <el-dropdown-item divided>
            <span style="display:block;" @click="logout">{{ $t('navbar.logOut') }}</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <template v-if="device!=='mobile'">
      <div class="middel-menu">
        <div class="middel-menu-logo">
          <img src="@/assets/image/LOGO.png" alt="">
        </div>
        <div class="middle-lines"/>
        <div class="middel-menu-title">
          {{ $t('login.title') }}
        </div>
      </div>
    </template>
    <div class="interleb">
      <a href="http://218.75.147.231:8090/interlib3/login" target="_blank">
        <img src="http://218.75.147.231:8090/interlib3/media/images/login/logo_interlib.png" style="height: 100%" alt="">
      </a>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import ErrorLog from '@/components/ErrorLog'
import Screenfull from '@/components/Screenfull'
import LangSelect from '@/components/LangSelect'

export default {
  components: {
    Breadcrumb,
    Hamburger,
    ErrorLog,
    Screenfull,
    LangSelect
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'name',
      'avatar',
      'device'
    ])
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('toggleSideBar')
    },
    logout() {
      this.$store.dispatch('LogOut').then(() => {
        location.reload()// In order to re-instantiate the vue-router object to avoid bugs
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.navbar {
  height: 50px;
  line-height: 50px;
  border-radius: 0px !important;
  .interleb{
    float: right;
    padding-top: 10px;
    font-size: 0;
    height: 40px;
    margin-right: 20px;
  }
  .hamburger-container {
    line-height: 58px;
    height: 50px;
    float: left;
    padding: 0 10px;
  }
  .breadcrumb-container{
    float: left;
  }
  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }
  .middel-menu{
    float: right;
    height: 100%;
    margin-right: 10px;
    .middel-menu-logo{
      height: 100%;
      text-align: right;
      float: left;
      margin-right: 10px;
      img{
        height: 100%;
      }
    }
    .middle-lines{
      height: 20px;
      width: 1px;
      float: left;
      margin-top: 15px;
      background-color: #595959;
    }
    .middel-menu-title{
      height: 100%;
      float: left;
      margin-left: 10px;
    }
  }
  .right-menu {
    float: right;
    height: 100%;
    &:focus{
     outline: none;
    }
    .right-menu-item {
      display: inline-block;
      margin: 0 8px;
    }
    .screenfull {
      height: 20px;
    }
    .international{
      vertical-align: top;
    }
    .theme-switch {
      vertical-align: 15px;
    }
    .avatar-container {
      height: 50px;
      .avatar-wrapper {
        cursor: pointer;
        margin-top: 5px;
        position: relative;
        .user-avatar {
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }
      }
    }
  }
}
</style>
