<template>
    <div class="page-main">
        <!-- 头部 -->
        <page-header>
            密钥对管理
            <div slot="right">
                <el-button @click="createKey" type="primary" size="small">创建密钥对</el-button>
            </div>
        </page-header>
        <!-- 主体 -->
        <div class="page-body">
            <!-- 列表 -->
            <zt-table :loading="loading" :data="tableData" :search="true" :search-condition="fields" @search="getKeypairFn" :paging="searchObj.paging">
                <el-table-column prop="name" label="密钥对名称"></el-table-column>
                <el-table-column prop="name" label="密钥对指纹"></el-table-column>
                <!-- 操作 -->
                <el-table-column label="操作" key="op" width="250" class-name="option-snaplist">
                    <template slot-scope="scope">
                        <!-- 删除 -->
                        <span @click="deleteExample(scope.row.id)" class="btn-linker">删除</span>
                    </template>
                </el-table-column>
            </zt-table>
        </div>

        <!-- 对话框 创建密钥对-->
        <create-keypair ref="CreateKeypair" />
    </div>
</template>
<script>
import CreateKeypair from './dialog/CreateKeypair';

import {getKeypairList, deleteKeypairs} from '@/service/ecs/keypairs.js';

let fields = [{field: 'status', label: '密钥对名称', inputval: '', tagType: 'INPUT'}];

let searchObj = {
    //分页
    paging: {
        pageIndex: 1,
        limit: 10,
        totalItems: 0
    },
    ////需要放入的其它参数
    //params: {},
    //附加查询条件
    extra: {
        //startTime:'',
        //endTime:'',
        //orderBy:'', //排序字段
        //ascOrDesc: '', //'DESC'、'ASC'  //descend 降序,ascend 升序
    }
};

export default {
    data() {
        return {
            loading: false,
            fields,
            tableData: [],
            searchObj
        };
    },
    components: {
        CreateKeypair
    },
    mounted() {
        this.getKeypairFn();
    },
    methods: {
        getScreenVal(params) {
            console.log(params);
            this.searchVal = params.selInputValue;
            this.getKeypairFn();
        },
        /**
         * 删除密钥对的弹窗
         */

        deleteExample(params) {
            this.$confirm('确定要进行删除操作吗？', '删除', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            })
                .then(() => {
                    this.deleteKeypairsFn(params);
                })
                .catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
        },
        /**
         * 创建密钥对
         */

        createKey(rowItem) {
            console.log('CreateKeypair:', rowItem);
            this.$refs.CreateKeypair.show(rowItem)
                .then(ret => {
                    this.getKeypairFn();
                })
                .catch(err => {
                    if (err) {
                        console.log('Error', err);
                    } else {
                        console.log('取消');
                    }
                });
        },
        /**
         * 获取秘钥对列表
         */

        getKeypairFn(params) {
            params = params || this.searchObj.paging;
            this.loading = true;
            getKeypairList(params).then(res => {
                if (res.code && res.code === this.CODE.SUCCESS_CODE) {
                    let resData = res.data;
                    if (resData && resData.total) {
                        this.tableData = resData.data;
                        this.searchObj.paging.totalItems = resData.total;
                    }
                }
            }).catch(err => {
                $log(err);
            }).finally(() => {
                this.loading = false;
            });
        },
        /**
         * 删除密钥对
         */

        deleteKeypairsFn(params) {
            deleteKeypairs(params)
                .then(ret => {
                    if (ret.code === '0000') {
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
                        this.getKeypairFn();
                    }
                })
                .catch(err => {
                    $log(err);
                });
        }
    }
};
</script>
<style lang="scss" scoped>
</style>
