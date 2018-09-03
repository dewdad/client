<template>
    <div class="el-scrollbar">
        <div class="logo-con">
            <img src="@/assets/images/logo_open.svg" width="85px" alt="">
        </div>
        <el-menu :default-active="active" unique-opened @select="goto" class="sidebar" >
            <div class="otherItem" v-if="menuText1" @click="toOverview">
                <em class="icon-new-概览"></em>
                {{menuText1}}
            </div>
            <el-submenu :index="menu.id" v-for="menu in menuList" :key="menu.routeHref" >
                <template slot="title" router="true">
                    <em :class="menu.menuIcon" v-if="menu.menuIcon"></em>
                    {{menu.menuName}}
                </template>
                <el-menu-item v-if="menu.submenus"  v-for="submenu in menu.submenus" :index="submenu.routeHref" :key="submenu.routeHref">
                    {{submenu.menuName}}
                </el-menu-item>
                <!--<el-submenu v-if="submenu.submenu"  router="true" :index="menu.id" v-for="menu in submenu">-->
                    <!--<span slot="title">{{submenu.text}}</span>-->
                    <!--<el-menu-item :index="bottommenu.sref" :index="bottommenu.sref" v-for="bottommenu in menu.submenu.submenu" :key="bottommenu.sref">-->
                        <!--{{bottommenu.text}}-->
                    <!--</el-menu-item>-->
                <!--</el-submenu>-->
                <!--<el-submenu index="2">-->
                <!--<template slot="title">用户管理</template>-->
                <!--<el-menu-item index="app.usermgr.list">-->
                <!--<img src="@/assets/images/icon_menu.svg" alt="">-->

                <!--租户管理-->
                <!--</el-menu-item>-->
                <!--<el-menu-item index="app.usermgr.account">管理员管理</el-menu-item>-->
                <!--<el-menu-item index="app.usermgr.userGroup">用户组管理</el-menu-item>-->
                <!--<el-menu-item index="app.usermgr.realAuth">实名认证管理</el-menu-item>-->
                <!--<el-menu-item index="app.usermgr.menu">菜单管理</el-menu-item>-->
                <!--</el-submenu>-->
            </el-submenu>
            <div class="otherItem" v-if="menuText2" @click="toContainer">
                <img src="@/assets/images/icon_menu.svg" alt="" width="14">
                {{menuText2}}
            </div>

        </el-menu>
    </div>
</template>
<script>
import { mapState } from 'vuex';
import {GetmenuList} from '@/service/overview.js';
export default {
    name: 'app',
    data() {
        return {
            menuList:[],
            menuText1:'',
            menuText2:'',
            menuItem1:[],
            menuItem2:[]

        };
    },
    computed: {
        ...mapState({
            user: state => state.user.userInfo,
        }),
        active: function() {
            return this.$route.name;
        }
    },
    methods: {
        toOverview(){
            this.$router.push({
                name:'app.dashboard'
            });
        },
        toContainer(){
            window.location.href = this.menuItem2.routeHref;
        },
        goto(index) {
            console.log(index);
            this.$router.push({name: index});
        },
        getmenuList(){
            let param = { roleId:this.user.roleId };
            let reg = /http:/;
            GetmenuList(param).then(ret => {
                $log('aaaaaa', ret);
                for(let i = 0;i < ret.length;i++){
                    if(reg.test(ret[i].routeHref)){
                        this.menuItem2 = ret[i];
                        ret.splice(i,1);
                    }
                }
                for(let n = 0;n < ret.length;n++){
                    if(ret[n].routeHref === 'app.overview.overview'){
                        this.menuItem1 = ret[n];
                        this.menuText1 = ret[n].menuName;
                        ret.splice(n,1);
                    }
                    let sub = ret[n].submenus;
                    for(let m = 0;m < sub.length;m++){
                        if(sub[m].routeHref === 'app.resources.mirror'){
                            this.menuText2 = sub[m].menuName;
                            sub.splice(m,1);
                        }
                    }
                }
                this.menuList = ret;

            }
            );
        }
    },
    mounted(){
        this.getmenuList();
    }
};
</script>
<style  lang="scss" >
.otherItem{
    img,em{
        margin-right:5px;
    }
    &:hover{
        background-color:#000c17;
    }
    height: 40px;
    line-height: 40px;
    font-size: 14px;
    color: #cfcfd1;
    padding: 0 20px;
    cursor: pointer;
    -webkit-transition: border-color .3s,background-color .3s,color .3s;
    transition: border-color .3s,background-color .3s,color .3s;
    box-sizing: border-box;
}
.el-scrollbar {
    height: 100%;
}
.sidebar em{
    font-size:14px;
    vertical-align: middle;
    margin-right:5px;
}
.el-menu {
    border-right: 0;
    text-align: left;
    background: #001529;
    color: #cfcfd1;
    .el-menu-item {
        color: #fff;
        font-size: 12px;
        &.is-active {
            background: #000c17;
            color: #fff !important;
            border-right: 4px solid #2d8cf0 !important;
        }
    }
    .el-submenu {
        &.is-active {
            .el-submenu__title {
                color: #fff !important;
            }
        }
        .el-menu-item {
            color: #cfcfd1;
            &:hover {
                color: #fff;
                background: #000c17;
            }
        }
    }
    .el-menu-item,
    .el-submenu__title {
        height: 40px;
        line-height: 40px;
    }
}
.el-submenu__title {
    color: #cfcfd1;
    &:hover {
        background: #000c17;
        color: #fff;
    }
}
.logo-con {
    height: 60px;
    line-height: 59px;
    border-bottom: 1px solid #000c17;
}
.logo-con img {
    vertical-align: middle;
}
</style>
