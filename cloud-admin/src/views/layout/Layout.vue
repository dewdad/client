<template>
  <el-container>
    <el-aside width="200px">
      <side-bar></side-bar>
    </el-aside>
    <el-container>
      <el-header style="background-color:#001529">
        <nav-bar></nav-bar>
      </el-header>
      <el-main id="setHeightAuto" >
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
        return {
            screenHeight: 0
        };
    },

    props: {},

    components: {
        AppMain,
        NavBar,
        SideBar
    },

    computed: {

    },
    watch:{
        screenHeight (val) {
            this.screenHeight = val;
            console.log(this.screenHeight);
            let el = document.getElementById('setHeightAuto');
            el.style.maxHeight = this.screenHeight + 'px';
            el.style.overflow = 'auto';
        }

    },
    created() {},

    methods: {
        setHeightAuto(){
            let el = document.getElementById('setHeightAuto');
            el.style.maxHeight = this.screenHeight + 'px';
        }
    },
    mounted(){
        const that = this;
        window.onresize = () => {
            return (() => {
                this.screenHeight = document.documentElement.clientHeight - 60;
                // console.log(this.screenHeight);
                that.screenWidth = this.screenHeight;
            })();
        };

    }
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
