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
                <el-table-column prop="fingerprint" label="密钥对指纹"></el-table-column>
                <!-- 操作 -->
                <el-table-column label="操作" key="op" width="250" class-name="option-column">
                    <template slot-scope="scope">
                        <a @click="viewInfo(scope.row)" class="btn-linker">详情</a>
                        <b class="link-division-symbol"></b>
                        <!-- 删除 -->
                        <a @click="deleteExample(scope.row.name)" class="btn-linker">删除</a>
                    </template>
                </el-table-column>
            </zt-table>
        </div>
        <el-dialog title="密钥对详情" :visible.sync="dialogVisible" width="600px">
            <zt-form label-width="80px">
                <zt-form-item label="名称：">
                    {{get(currentKey, 'name')}}
                </zt-form-item>
                <zt-form-item label="指纹：">
                    {{get(currentKey, 'fingerprint')}}
                </zt-form-item>
                <zt-form-item label="公钥：">
                    <span class="text-break-all">{{get(currentKey, 'public_key')}}</span>
                </zt-form-item>
            </zt-form>
            <span slot="footer" class="dialog-footer">
                <el-button size="small" type="info" @click="dialogVisible = false">关 闭</el-button>
            </span>
        </el-dialog>
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
            dialogVisible: false,
            fields,
            tableData: [],
            currentKey: {},
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
        viewInfo(row) {
            this.currentKey = row;
            this.dialogVisible = true;
        },
        /**
         * 删除密钥对的弹窗
         */

        deleteExample(params) {
            this.$messageBox
                .confirm('确定要对该密钥对进行删除操作吗？', '删除', {
                    type: 'warning',
                    alertMessage: '删除操作无法恢复，请谨慎操作',
                    subMessage: params
                })
                .then(() => {
                    this.deleteKeypairsFn(params);
                })
                .catch(() => {});
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
            getKeypairList(params)
                .then(res => {
                    if (res.code && res.code === this.CODE.SUCCESS_CODE) {
                        let resData = res.data;
                        this.tableData = resData.data;
                        this.searchObj.paging.totalItems = resData.total;
                    }
                })
                .catch(err => {
                    $log(err);
                })
                .finally(() => {
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
