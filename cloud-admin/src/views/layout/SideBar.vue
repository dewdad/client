<template>
    <div class="zt-sidebar">
        <div class="logo-con">
            <img src="@/assets/images/logo_open.svg" width="85px" alt="">
        </div>
        <el-menu :default-active="active" unique-opened @select="goto">           
            <template v-for="menu in menuList">
                <el-menu-item v-if="!menu.submenus || menu.submenus.length ===0" :index="menu.routeHref" :key="menu.menuCode">                    
                    <em :class="menu.menuIcon"></em>
                    <span slot="title">{{menu.menuName}}</span>                  
                </el-menu-item>

                <el-submenu v-else :index="menu.id"  :key="menu.menuCode" >
                    <template slot="title">
                        <em :class="menu.menuIcon" v-if="menu.menuIcon"></em>
                        {{menu.menuName}}
                    </template>
                    <el-menu-item v-for="(submenu,idx) in menu.submenus" :index="submenu.routeHref" :key="idx">
                        {{submenu.menuName}}
                    </el-menu-item>               
                </el-submenu>
            </template>
        </el-menu>
    </div>
</template>
<script>
import { mapState } from 'vuex';
import {GetmenuList} from '@/service/overview.js';
export default {
    name: 'sidebar',
    data() {
        return {          
            navList: []
        };
    },
    computed: {
        ...mapState({
            user: state => state.user.userInfo,
        }),
        active: function() {
            return this.$route.name;
        },
        menuList: function() {
            return this.navList;
        },
    },
    methods: { 
        goto(index) {
            console.log(index);
            if(index && (index.includes('http://') || index.includes('https://')) ){
                window.location.href = index;
            }else {
                this.$router.push({name: index});
            }
        },
        getmenuList(){
            let param = { roleId:this.user.roleId };
            //let reg = /http:/;
            GetmenuList(param)
                .then( res => {
                    this.navList = res || [];
                });
        }
    },
    created(){
        this.getmenuList();
    }
};
</script>
<style  lang="scss">
.zt-sidebar {
    height: 100%;    

    .logo-con {
        height: 59px;
        line-height: 59px;
        border-bottom: 1px solid #000c17;
        img {
            vertical-align: middle;
        }
    }  
    .el-menu {
        border-right: 0;
        text-align: left;
        background: #001529;
        color: #cfcfd1;
        em {
            font-size:14px;
            vertical-align: middle;
            margin-right:5px;
        }
        .el-menu-item {
            height: 40px;
            line-height: 40px;
            font-size:14px;    
            color:#cfcfd1;        
            &.is-active {                    
                //color: #fff !important;
                border-right: 4px solid #2d8cf0 !important;
            }
            &:hover,
            &.is-active {
                color: #fff;
                background: #000c17;
            }
        }
        
        .el-submenu {
            .el-menu-item {             
                padding-left:50px !important;                
            }
            .el-submenu__title {
                height: 40px;
                line-height: 40px;
                font-size:14px;
                color: #cfcfd1;
                &:hover {
                    background: #000c17;
                    color: #fff;
                }
            }                       
        }       
    }
}

</style>
