<template>
  <el-container>
    <el-aside width="200px">
      <side-bar></side-bar>
    </el-aside>
    <el-container>
      <el-header style="background-color:#001529">
        <nav-bar></nav-bar>
      </el-header>
      <el-main>
        <app-main></app-main>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import NavBar from './NavBar';
import AppMain from './AppMain';
import SideBar from './SideBar';
export default {
    data() {
        return {};
    },

    props: {},

    components: {
        AppMain,
        NavBar,
        SideBar
    },

    computed: {},

    created() {},

    methods: {}
};
</script>
<style lang='scss' scoped>
.el-container {
    height: 100%;
}
.el-header {
    background-color: #fff;
    border-bottom: 1px solid #e9eef3;
    color: #333;
    text-align: center;
    line-height: 60px;
}

.el-aside {
    background-color: #001529;
    text-align: center;
}

.el-main {
    background-color:#fff; // #e9eef3;
    color: #333;
    min-width: 1166px;
}

body > .el-container {
    margin-bottom: 40px;
}
</style>
