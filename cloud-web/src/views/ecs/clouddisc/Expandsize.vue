<template>
    <div class="page-main">
        <!-- 返回上一级 -->
        <page-header>
            <el-button size="mini" type="info" @click="goBack">
                <i class="iconfont icon-fanhui"></i> {{ $t('common.goback') }}</el-button>
        </page-header>
        <el-alert type="warning" :closable="false" title>
            <span class="font12">
                重要提示：“磁盘挂载”执行成功后，您还需要登录本实例对挂载的磁盘进行“分区格式化和挂载新分区”的操作。 分区格式化/挂载数据盘操作指南:
                <a class="font12">Window</a>>,
                <a class="font12">Linux</a>>
            </span>
        </el-alert>
        <!-- 列表 -->
        <div class="mt20">
            <el-table class="font12 data-list" :data="tableData" header-row-class-name="data-list" style="width: 100%">
                <template v-for="col in cols">
                    <!-- 磁盘名称 -->
                    <template v-if="col.column=='name'">
                        <el-table-column :prop="col.column" :label="col.text" :key="col.column">

                        </el-table-column>
                    </template>
                    <!-- 磁盘类型 -->
                    <template v-if="col.column=='isSupport'">
                        <el-table-column width="100px" :prop="col.column" :label="col.text" :key="col.column">
                            <template slot-scope="scope">
                                <span>{{rowItem.type}}云盘</span>
                            </template>
                        </el-table-column>
                    </template>
                    <!-- 支持卸载 -->
                    <template v-if="col.column=='diskType'">
                        <el-table-column width="100px" :prop="col.column" :label="col.text" :key="col.column">
                            <template slot-scope="scope">
                                <span>支持</span>
                            </template>                             
                        </el-table-column>
                    </template>
                    <!-- 付费方式 -->
                    <template v-if="col.column=='paytype'">
                        <el-table-column width="100px" :prop="col.column" :label="col.text" :key="col.column">
                            <template slot-scope="scope">
                                <span>按量付费</span>
                            </template>                            
                        </el-table-column>
                    </template>
                    <!-- 当前容量 -->
                    <template v-if="col.column=='orignSize'">
                        <el-table-column width="100px" :prop="col.column" :label="col.text" :key="col.column">
                            <template slot-scope="scope">
                                <span>{{rowItem.diskSize}}GB云盘</span>
                            </template>

                        </el-table-column>
                    </template>
                    <!-- 扩容后容量 最大2048G-->
                    <template v-if="col.column=='size'">
                        <el-table-column width="300" :prop="col.column" :label="col.text" :key="col.column">
                            <template slot-scope="scope">
                                <el-input-number v-model="discsize" size="small" :min="minsize" :max="2048" controls-position="right">
                                </el-input-number>
                                <span class="unit color999">GB</span>
                                <span class="color999">容量范围：{{minsize}}-2048</span>
                            </template>
                        </el-table-column>
                    </template>
                    <!-- 费用 -->
                    <template v-if="col.column=='con'">
                        <el-table-column :prop="col.column" :label="col.text" :key="col.column">
                            <template slot-scope="scope">
                                <span v-show="isComputing">正在计算价格...</span>
                                <span v-show="!isComputing" class="color-warning">￥0.31/时</span>
                            </template>
                        </el-table-column>
                    </template>
                </template>
            </el-table>
        </div>
        <!-- 确定扩容 -->
        <div class="Cost" :class="{
            'cost1': (navCollapse && !collapse),
            'cost2': (navCollapse && collapse),
            'cost3': (!navCollapse && collapse),
            }">
            <div class="pull-left">
                <span ng-if="!isComputing" style="color:#FF6600;font-size:24px" class="ng-binding ng-scope">¥&nbsp;8,700.00</span>
            </div>
            <div class="pull-right">
                <button type="button" class="mr20 zt-next font12" @click="resizeDisk">确定扩容</button>
                <button class="btn ng-cancle font12" @click="goBack">{{ $t('common.cancel') }}</button>
            </div>
        </div>
    </div>
</template>
<script>
import {mapGetters} from 'vuex';
import { getDiskList,resizeDisk } from '@/service/ecs/disk/disk.js';

export default {
    data() {  
        let cols = [
            {column: 'name', text: '磁盘名称', width: '20%'},
            {column: 'diskType', text: '磁盘类型', width: '4%'},
            {column: 'isSupport', text: '支持卸载', width: '4%'},
            {column: 'paytype', text: '付费方式', width: '4%'},
            {column: 'orignSize', text: '当前容量', width: '4%'},
            {column: 'size', text: '扩容后容量', width: '4%'},
            {column: 'con', text: '费用', width: '10%'}
        ];      
        return {
            stateParams:{},           
            cols,
            tableData:[],
            rowItem:{},
            isComputing:false,
            discsize: 0,
            minsize:1,
        };
    },
    computed: {
        ...mapGetters(['navCollapse', 'collapse'])
    },
    created() {
        let stateParams = this.$route.params || {};
        if (stateParams && stateParams.item) {
            this.rowItem = stateParams.item;  
            this.tableData = [this.rowItem];         
        } else {
            //刷新页面，路由参数item会丢失，则通过id查询磁盘信息
            this.getDiskInfoById();            
        }
        this.discsize = parseInt(this.rowItem.diskSize) + 10;
        this.minsize = this.discsize - 9;
    },
    methods: {
        //获取云盘数据
        getDiskInfoById() {
            let params = {
                paging: {
                    pageIndex: 1,
                    limit: 10
                },
                id: this.$route.params.id //传入磁盘id
            };
            getDiskList(params).then(res => {
                if (res.code && res.code === this.CODE.SUCCESS_CODE) {
                    let resData = res.result;
                    if (resData && resData.records) {
                        this.rowItem = resData.records[0] || {};
                        this.tableData = resData.records || []; 
                        this.discsize = parseInt(this.rowItem.diskSize) + 10;
                        this.minsize = this.discsize - 9;
                    }
                }
            });
        },
        //确定提交
        resizeDisk(){
            let data = {
                disk_id:this.rowItem.id,
                size:this.discsize
            };
            //提交后台
            resizeDisk(data)
                .then( res => {
                    if ( res && res.code === this.CODE.SUCCESS_CODE) { 
                        this.$message.success('操作成功');
                        this.$router.push({name:'app.ecs.clouddisc-list'});                                                                    
                    }else {

                    }                                 
                })
                .catch(
                    err => {
                        this.$alert(err, '提示', {
                            type: 'error'
                        });
                    }
                );
        },

        //返回
        goBack(){
            this.$router.push({name:'app.ecs.clouddisc-list'});
        }

    }
};
</script>
<style lang="scss" scoped>
.GoBack {
    height: 50px;
    line-height: 50px;
}
.Cost {
    position: fixed;
    width: auto;
    bottom: 0;
    left: 300px;
    right: 0;
    padding: 20px 40px;
    box-shadow: 0 -3px 3px #ebecec;
    background-color: #fff;
    z-index: 90;
    transition: all 0.4s;
    button {
        width: 120px;
        height: 36px;
        box-sizing: border-box;
    }
    button:first-child {
        border: 0;
        margin-right: 30px;
        color: #fff;
        background: #ff8a00;
    }
    button:last-child {
        color: #333;
    }
}
.cost1 {
    left: 150px;
}
.cost2 {
    left: 50px;
}
.cost3 {
    left: 200px;
}
.unit {
    position: relative;
    left: -52px;
}
</style>

