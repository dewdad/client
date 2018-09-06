<template>
    <li role="menuitem" aria-haspopup="true" class="el-submenu is-opened oss-ul" aria-expanded="true">
        <div class="el-submenu__title" style="padding-left: 30px;">
            <span>{{$t('oss.ossName')}}</span>
            <span class="pull-right inline-block rotatex">
                <el-dropdown placement="top" @command="handleCommand" size="small">
                    <i class="iconfont icon-changeconfiguration" @click="sortData"></i>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item :class="{'is-active': sortBy === 'default'}" command="default">{{$t('oss.sortText.default')}}
                            <i v-if="sortBy === 'default'" class="el-icon-check"></i>
                        </el-dropdown-item>
                        <el-dropdown-item :class="{'is-active': sortBy === 'name'}" command="name">{{$t('oss.sortText.name')}}
                            <i v-if="sortBy === 'name'" class="el-icon-check"></i>
                        </el-dropdown-item>
                        <el-dropdown-item :class="{'is-active': sortBy === 'date'}" command="date">{{$t('oss.sortText.time')}}
                            <i v-if="sortBy === 'date'" class="el-icon-check"></i>
                        </el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </span>
            <span class="pull-right inline-block  search-btn" v-clickoutside="hiddenSearchBox">
                <el-tooltip :content="$t('oss.searchTips')" placement="top" effect="light" transition="scale">
                    <span style="display:inline-block;width:8px;line-height:12px;">
                        <i class="iconfont icon-sousuo- font14" @click="showSearchBox"></i>
                    </span>
                </el-tooltip>
                <transition name="scale-in">
                    <div v-if="showSearchInput" class="search-form">
                        <span class="arrow-up"></span>
                        <zt-form size="small">
                            <zt-form-item class="is-active">
                                <el-input v-model="searchKeyords" clearable placeholder="搜索"></el-input>
                            </zt-form-item>
                        </zt-form>
                    </div>
                </transition>
            </span>
        </div>
        <!-- 储存空间列表 -->
        <ul class="el-menu el-menu--inline oss-menu">
            <li class="el-menu-item oss-menu-item">
                <el-button type="primary" style="width:105px;height: 32px;margin-top:-10px;" size="small" @click="createBucket">{{$t('oss.createOss')}}</el-button>
            </li>
            <router-link v-for="bucket in bucketList" :key="bucket.name" tag="li" :class="{'el-menu-item': true, 'oss-menu-item': true,'router-link-active': bucket.name === $route.params.bucketId} " :to="{'name': 'app.oss.bucket', 'params': {'view': 'overview', 'bucketId': bucket.name}}">
                <div>
                    <i class="iconfont icon-dot small-font"></i> {{bucket.name}}
                </div>
            </router-link>
            <create-bucket ref="createBucketDailog"></create-bucket>
        </ul>
    </li>
</template>
<script>
import Clickoutside from '@/utils/clickoutside.js';
import {getDom} from '@/utils/utils';
import {getBucketListByUid} from '@/service/oss/index';
import CreateBucket from './bucket/Create';
import {mapState} from 'vuex';
export default {
    name: 'SideBar',
    data() {
        return {
            // 是否显示搜索输入框
            showSearchInput: false,
            // 搜索关键字
            searchKeyords: '',
            sortBy: 'default',
            // 升序or降序 true升序 false降序
            orderBy: true,
            // 过滤后的bucket数据
            bucketList: [],
            // 存放bucket原数据 默认等于bucketList
            oldBucketList: []
        };
    },
    components: {
        CreateBucket
    },
    directives: {
        clickoutside: Clickoutside
    },
    watch: {
        // 显示搜索框时设置自动获取焦点
        showSearchInput: function(newval) {
            if (newval) {
                this.$nextTick(() => {
                    getDom.getClass('el-input__inner')[0].focus();
                });
            }
        },
        searchKeyords: function(newval) {
            // oldBucketList为空时将bucketList赋给oldBucketList
            this.oldBucketList = this.oldBucketList || this.bucketList;
            // 从oldBucketList数据中搜索匹配数据
            this.bucketList = this.oldBucketList.filter(arr => {
                return arr.name.includes(newval);
            });
        },
        refreshBucket: function() {
            // refreshBucket改变时重新加载bucket
            this.getBucketListByUid();
        }
    },
    computed: {
        ...mapState({
            refreshBucket: state => state.oss.refreshBucket
        })
    },
    created() {
        this.getBucketListByUid();
    },
    methods: {
        // 显示 or 隐藏搜索框
        showSearchBox() {
            this.showSearchInput = !this.showSearchInput;
        },
        // outsideclick隐藏搜索框
        hiddenSearchBox() {
            this.showSearchInput = false;
        },
        // 排序选择
        handleCommand(command) {
            this.sortBy = command;
            this.sortData();
        },
        sortData() {
            this.orderBy = !this.orderBy;
            if (this.sortBy === 'default') {
                this.bucketList = this.orderBy ? this.bucketList.sort() : this.bucketList.reverse();
                return;
            }
            this.bucketList = this.bucketList.sort((a, b) => {
                switch (this.sortBy) {
                    case 'name':
                        return this.orderBy ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
                    case 'date':
                        return this.orderBy ? a.createTime - b.createTime : b.createTime - a.createTime;
                }
            });
        },
        createBucket() {
            this.$refs.createBucketDailog.show().then(res => {
                if (res.code === this.CODE.SUCCESS_CODE) {
                    // this.bucketList.push(res.result);
                    this.getBucketListByUid();
                }
            });
        },
        getBucketListByUid() {
            getBucketListByUid()
                .then(res => {
                    if (res.code === this.CODE.SUCCESS_CODE) {
                        this.bucketList = res.data;
                        this.$nextTick();
                        this.$forceUpdate();
                        console.log('bucketList', this.bucketList);
                        // this.oldBucketList = res.result;
                    }
                })
                .catch(err => {
                    console.log(err);
                });
        }
    }
};
</script>
<style scoped lang="scss">
.el-button--small {
    width: 120px;
}
.rotatex {
    transition: rotate 0.3;
    transform: rotate(90deg);
}
.search-btn {
    width: 20px;
    position: relative;
}
.search-form {
    position: absolute;
    top: 54px;
    left: -66px;
    right: 0px;
    z-index: 1;
    width: 105px;
}
.arrow-up {
    position: absolute;
    left: 85px;
    top: 3px;
    z-index: 2;
    &::before {
        content: '';
        position: absolute;
        left: 50%;
        margin-left: -10px;
        bottom: 100%;
        border-width: 10px;
        border-style: solid;
        border-color: transparent transparent #0d7ef2;
    }
    &::after {
        content: '';
        position: absolute;
        left: 50%;
        margin-left: -9px;
        bottom: 100%;
        border-width: 9px;
        border-style: solid;
        border-color: transparent transparent #fff;
    }
}
.el-menu-item.oss-menu-item {
    min-width: 150px !important;
    width: 150px;
    padding-right: 15px;
    &.router-link-active {
        color: #2b65c5;
        background: #ffffff !important;
        i {
            color: inherit;
        }
    }
}
.submenu .el-menu .el-submenu .el-menu-item.oss-menu-item {
    padding-left: 15px !important;
    &:hover:not(:first-child),
    &:active {
        background: #fff;
    }
    &.router-link-active {
        color: #2b65c5;
        background: #ffffff !important;
        i {
            color: inherit;
        }
    }
}

.oss-ul {
    width: 150px;
    overflow: hidden;
    display: flex;
    flex: 1px;
    overflow-y: auto;
    flex-direction: column;
    .oss-menu {
        flex: 1;
        overflow-y: auto;
    }
}

.el-dropdown-menu {
    border-radius: 0;
    border-color: #d4dce2;
    overflow-y: visible;
    .el-dropdown-menu__item:not(.is-disabled):hover,
    .el-dropdown-menu__item:focus,
    .el-dropdown-menu__item.is-active {
        color: #2b65c5 !important;
        background-color: #fafafa;
    }
    .el-dropdown-menu__item {
        position: relative;
        i {
            display: inline-block;
            position: absolute;
            top: 6px;
            right: 3px;
        }
    }
}
</style>
