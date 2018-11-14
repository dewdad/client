<template>
    <div class="height-all">
        <div class="sidebar-menu" :class="{'sidebar-menu--collapse':isCollapse}"  @mouseenter="isCollapse = false" @mouseleave="isCollapse = true">
            <el-menu :default-active="activeMenuCode" @select="handleSelect">           
                <template v-for="(menu) in menuList" >
                    <el-menu-item  :index="menu.menuCode" :key="menu.menuCode" @click="clickMenu(menu)">
                        <em v-if="menu.menuIcon"  :class="menu.menuIcon"></em>
                        <span v-if="!isCollapse" slot="title">{{menu.menuName}}</span>   
                    </el-menu-item> 
                </template> 

                <!-- 这里写一个空的是为了返回控制台首页清空activeIndex的时候菜单选中状态不变化的问题 -->
                <el-menu-item v-show="false" index="0000"></el-menu-item>          
            </el-menu>
        </div>
        <div class="sidebar-submenu" v-if="submenus.length">
            <el-menu :default-active="activeRouteHref" unique-opened @select="goto">           
                <template v-for="submenu in submenus">
                    <el-menu-item  :index="submenu.routeHref" :key="submenu.menuCode" v-if="submenu.menuName != '网络'&&submenu.menuName != '磁盘管理'">
                        <em v-if="submenu.menuIcon" :class="submenu.menuIcon"></em>
                        <span slot="title">{{submenu.menuName}}</span>
                    </el-menu-item>
                    <el-submenu index="1-4" v-if="submenu.submenus.length&&submenu.menuName != '网络'" :key="submenu.menuCode" >
                        <span slot="title">{{submenu.menuName}}</span>
                        <el-menu-item :index="bottomMenu.routeHref" @click="saveParentMenu(submenus)" v-for="bottomMenu in submenu.submenus" :key="bottomMenu.menuCode">{{bottomMenu.menuName}}</el-menu-item>
                    </el-submenu>
                    <el-submenu index="1-3" v-if="submenu.submenus.length&&submenu.menuName != '磁盘管理'" :key="submenu.menuCode" >
                        <span slot="title">{{submenu.menuName}}</span>
                        <el-menu-item :index="bottomMenu.routeHref" v-for="bottomMenu in submenu.submenus" :key="bottomMenu.menuCode">{{bottomMenu.menuName}}</el-menu-item>
                    </el-submenu>
                </template>              
            </el-menu>
        </div>       
    </div>
</template>
<script>
import { mapState } from 'vuex';
//import {GetmenuList} from '@/service/overview.js';
export default {
    name: 'sidebar',
    data() {
        return {
            submenus:[],
            navList: [],
            activeRouteHref: '',
            isCollapse: true,
            activeMenuCode: '0000', //menuCode
        };
    },
    computed: {
        ...mapState({
            user: state => state.user.userInfo,
            sidebarCollapse: state => state.sidebarCollapse,

        }),
        menuList: function() {            
            return window.navList || [];
        },
    },
    watch: {
        '$route': function(newVal) {
            if(newVal) {
                console.log('newVal',newVal);
                this.parseActivemenu(this.menuList);
            }
        }
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
        saveParentMenu(saveParentMenu){
            let submenuItemsStr = JSON.stringify(saveParentMenu);
            localStorage.setItem('submenuItems', submenuItemsStr);
        },
        clickMenu(menu){
            this.submenus = menu.submenus;
            console.log('thismenu',menu);
        },
        parseRouterName(){
            let routerName = '';
            if (this.$route.meta && this.$route.meta.parentName) {
                routerName = this.$route.meta.parentName;
            }else {
                routerName = this.$route.name;
            }
            return routerName;
        },
        //处理激活的一二级菜单；
        parseActivemenu(menuList){

            if(menuList && menuList.length){
                this.activeRouteHref = this.parseRouterName();
                menuList.forEach( (menu) =>{
                    if(menu.submenus && menu.submenus.length){                        
                        let submenu = menu.submenus.find( (submenu) => {
                            if(submenu.routeHref && submenu.routeHref !== '#'){
                                return submenu.routeHref === this.activeRouteHref;
                            }                           
                        });

                        if(submenu) {
                            this.activeMenuCode = menu.menuCode;
                            // 收展侧边菜单
                            this.submenus = menu.submenus;
                            console.log('this.submenus',this.submenus);
                        }else{
                            // 收展侧边菜单
                            this.activeMenuCode = '0000';
                        }
                    }
                }); 
            }
        },
        getMenus(){
            if(window.navList.length){
                // let submenus = [];
                let navlist = window.navList;
                let that = this;
                console.log();
                let submenuItems = localStorage.getItem('submenuItems');
                if(navlist && navlist.length){
                    this.activeRouteHref = this.parseRouterName();

                    console.log('this.activeRouteHref',this.activeRouteHref);
                    if( 'app.overview' == this.activeRouteHref){
                        if(submenuItems) localStorage.removeItem('submenuItems');
                        this.submenus = [];
                        console.log('removedItems',submenuItems);
                    }
                    navlist.forEach( (menu) =>{
                        if(menu.submenus && menu.submenus.length){
                            // let hsSubmenu = false;
                            let submenu = menu.submenus.find( (submenu) => {
                                if(submenu.routeHref && submenu.routeHref !== '#'){
                                    return submenu.routeHref === this.activeRouteHref;
                                }
                            });
                            if(submenu) {
                                that.activeMenuCode = menu.menuCode;
                                console.log('that.activeMenuCode',that.activeMenuCode);

                                let me = navlist.find( (me) => {
                                    return me.menuCode === that.activeMenuCode;
                                });
                                let submenuItemsStr = JSON.stringify(me.submenus);
                                localStorage.setItem('submenuItems', submenuItemsStr);
                                that.submenus = me.submenus;
                            }else{
                                //从localStorage中读取条件并赋值给查询表单
                                if (submenuItems) {
                                    this.submenus = JSON.parse(submenuItems);
                                }
                                console.log('this.oooooo',this.activeRouteHref);
                                that.activeMenuCode = '0000';
                            }
                        }
                    });
                }
            }
        },
        handleSelect(active) {
            console.log('active',active);
            this.activeMenuCode = active;

            if(this.menuList.length){                
                let menu = this.menuList.find( (menu) => {
                    return menu.menuCode === this.activeMenuCode;
                });
                let submenus = menu.submenus || [];
                if(submenus.length){
                    let submenu = submenus[0];                   
                    this.goto(submenu.routeHref);
                }else if(menu.menuCode === '2000' || menu.routeHref.includes('http://') || menu.menuName === '概览'){
                    this.goto(menu.routeHref);
                }
            } 
        }
    },
    mounted(){

        this.getMenus();
    }
};
</script>
<style  lang="scss">
    .el-aside .el-menu .el-submenu .el-submenu__title{
        color: #333;
    }
    .el-submenu__title:hover{
        span{
            color: #2d8cf0 !important;
        }
        background-color:#fff !important;
    }
    /*.sidebar-submenu .is-active.is-opened{*/
        /*background-color:#2d8cf0 !important;*/
    /*}*/
</style>
