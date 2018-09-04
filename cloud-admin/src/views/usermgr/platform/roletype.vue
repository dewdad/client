<template>
    <div>
        <el-row>
            <el-col :span="24">
                <el-form :inline="true"  size="small">
                    <!--<el-form-item>-->
                        <!--<el-select placeholder="请选择" v-model="type">-->
                            <!--<el-option label="角色名称" value="name"></el-option>-->
                        <!--</el-select>-->
                    <!--</el-form-item>-->
                    <!--<el-form-item label="关键字">-->
                        <!--<el-input placeholder="搜索关键字" v-model="formInline.searchText"></el-input>-->
                    <!--</el-form-item>-->
                    <!--<el-form-item label="选择日期">-->
                        <!--<el-date-picker-->
                                <!--v-model="formInline.date"-->
                                <!--type="datetimerange"-->
                                <!--size="small"-->
                                <!--style="width:300px"-->
                                <!--start-placeholder="开始日期"-->
                                <!--end-placeholder="结束日期"-->
                                <!--:default-time="['12:00:00']">-->
                        <!--</el-date-picker>-->
                    <!--</el-form-item>-->
                    <!--<el-form-item>-->
                        <!--<el-button type="primary" @click="getplatformList">查询</el-button>-->
                    <!--</el-form-item>-->
                    <el-form-item class="pull-right">
                        <el-button type="primary" class=" search-refresh-btn icon-new-刷新" @click="roleTypeList"></el-button>
                    </el-form-item>
                </el-form>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="24">
                <el-table :data="tableData"  header-row-class-name="data-list">
                    <template v-for="col in cols">
                        <!-- 角色id -->
                        <template v-if="col.column=='roleType'">
                            <el-table-column min-width="120" :prop="col.column" :label="col.text" :key="col.column">
                                <template slot-scope="scope">
                                    <span class="font12 mr10">{{scope.row.name}}</span>
                                </template>
                            </el-table-column>
                        </template>

                    </template>
                    <!-- 操作 -->
                    <template>
                        <el-table-column label="操作" key="op" min-width="200" class-name="option-snaplist">
                            <template slot-scope="scope">
                                <router-link :to="{name:'app.platform.bindPlatAuth',params:{val:scope.row.val,item:scope.row,fromstate:'app.platform.role'}}" class="btn-linker">绑定平台权限</router-link>
                            </template>
                        </el-table-column>
                    </template>
                </el-table>

            </el-col>
        </el-row>
    </div>
</template>
<script>

import {roleTypeList} from '@/service/platform.js';
export default {
    name: 'app',

    data() {
        let searchObj = {
            //分页
            paging: {
                pageIndex: 1,
                limit: 10,
                totalItems: 0
            },
        };
        let cols = [
            { column: 'roleType', text:'角色类型' , width: '70%'}
        ];

        return {
            cols,
            searchObj,

            tableData: []

        };
    },
    components: {


    },
    methods: {
        roleTypeList(){
            let params = {
                paging:this.searchObj.paging

            };
            $log('params', params);
            roleTypeList(params).then(ret => {
                $log('data', ret);
                let resData = ret.data;
                if(resData ){
                    this.tableData = resData || [];
                }

            });
        },




    },
    mounted(){
        this.roleTypeList();
    }
};
</script>
<style scoped>
</style>
