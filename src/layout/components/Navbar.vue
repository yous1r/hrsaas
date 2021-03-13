<template>
  <div class="navbar" :style="{background: $store.state.settings.theme}">
    <hamburger :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />
    <div class="app-breadcrumb">
      {{ $t('navbar.title') }}
      <span class="breadBtn">{{ $t('navbar.version') }}</span>
    </div>

    <div class="right-menu">
      <lang class="right-icon" />
      <screen-full class="right-icon" />
      <theme-picker class="right-icon" style="padding-top: 8px" @change="changeTheme" />
      <el-dropdown class="avatar-container" trigger="click">
        <div class="avatar-wrapper">
          <img v-imgerror="defaultImg" :src="photo" class="user-avatar">
          <span class="name">{{ name }}</span>
          <i class="el-icon-caret-bottom" />
        </div>
        <template #dropdown>
          <el-dropdown-menu class="user-dropdown">
            <router-link to="/">
              <el-dropdown-item>
                {{ $t('navbar.dashboard') }}
              </el-dropdown-item>
            </router-link>
            <a target="_blank" href="https://gitee.com/hucongcong/hrsaas-76">
              <el-dropdown-item>{{ $t('navbar.github') }}</el-dropdown-item>
            </a>
            <el-dropdown-item divided @click.native="handleOut">
              <span style="display:block;">{{ $t('navbar.logOut') }}</span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import { mapGetters, createNamespacedHelpers } from 'vuex'
const { mapActions } = createNamespacedHelpers('user')
import Hamburger from '@/components/Hamburger'

export default {
  components: {
    Hamburger
  },
  data() {
    return {
      defaultImg: require('@/assets/common/head.jpg')
    }
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'avatar',
      'name',
      'photo'
    ])
  },
  // created() {
  //   this.$store.dispatch('user/getUserInfo')
  // },
  methods: {
    ...mapActions(['logout']),
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    async handleOut() {
      try {
        await this.$confirm('你确定要退出吗?', '温馨提示', {
          type: 'warning'
        })
      } catch {
        return
      }
      // this.$store.dispatch('user/logout')
      this.logout()
      // 提示消息
      this.$message.success('退出成功')
      this.$router.push('/login')
    },
    changeTheme(theme) {
      console.log('主题色发生了变化', theme)
      this.$store.dispatch('settings/changeSetting', {
        key: 'theme',
        value: theme
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background-image: linear-gradient(to left, #3d6df8, #5b8cff);
  box-shadow: 0 1px 4px rgba(0,21,41,.08);

  .app-breadcrumb {
    display: inline-block;
    font-size: 18px;
    line-height: 50px;
    margin-left: 10px;
    color: #ffffff;
    cursor: text;
    .breadBtn {
      background: #84a9fe;
      font-size: 14px;
      padding: 0 10px;
      display: inline-block;
      height: 30px;
      line-height: 30px;
      border-radius: 10px;
      margin-left: 15px;
    }
  }

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background .3s;
    -webkit-tap-highlight-color:transparent;

    &:hover {
      background: rgba(0, 0, 0, .025)
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;
    .right-icon {
      vertical-align: middle;
      margin-right: 10px;
    }
    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background .3s;

        &:hover {
          background: rgba(0, 0, 0, .025)
        }
      }
    }

    .avatar-container {
      margin-right: 30px;
      cursor: pointer;

      .avatar-wrapper {
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 30px;
          height: 30px;
          border-radius: 15px;
          vertical-align: middle;
          margin-right: 5px;
        }
        .name {
          color: #fff;
        }
        .el-icon-caret-bottom {
          color: #fff;
          margin-left: 5px;
          font-size: 16px;
        }
      }
    }
  }
}
</style>
