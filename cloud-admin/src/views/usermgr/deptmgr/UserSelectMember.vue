<template>
    <el-dialog title="关联租户" :visible.sync="isShow" width="600px"  v-dialogDrag>
        <el-row>
            <el-col :span="12" style="padding:10px;border:1px solid #BBB;height:400px;overflow-y: auto">
                <div class="mb10">所有未关联成员：</div>
                <div class="item" v-for="(user,index) in allProject" :key="user.id" v-if="allProject.length>0">
                    <span>{{user.name}}</span>
                    <el-button type="primary pull-right selectBtn" size="small" style="font-size: 18px;" @click="chooseCur(user,index)">关联</el-button>
                </div>
            </el-col>
            <el-col :span="12" style="padding:10px;border:1px solid #BBB;border-left:0;height:400px;overflow-y: auto">
                <div class="mb10">已关联成员：</div>
                <div class="item" v-for="(user,index) in selectedProject" :key="user.id" v-if="selectedProject.length>0">
                    <span>{{user.name}}</span>
                    <el-button type="primary pull-right selectBtn" size="small" style="font-size: 18px;" @click="delCur(user,index)">取消关联</el-button>
                </div>
            </el-col>
        </el-row>
        <span slot="footer" class="dialog-footer">
            <el-button type="info" class="font12" size="small" @click="isShow = false">关 闭</el-button>
        </span>
    </el-dialog>
</template>
<script>
import { mapState } from 'vuex';
import {searchProjectByuserId,projectList,relateProject,delRelateProject} from '@/service/usermgr/deptmgr.js';
export default {
    data() {
        return{
            isShow: false,
            resolve: null,
            reject: null,
            item:{},
            brunch:{},
            allProject:[],
            selectedProject:[],
            confirmBtn:false
        };
    },
    props: {},
    computed:{
        ...mapState({
            user: state => state.user.userInfo,
        }),
    },
    methods: {
        show(item,brunch) {
            this.isShow = true;
            this.item = item;
            this.brunch = brunch;
            console.log('item????',item);
            console.log('item????,,,,',brunch);
            this.searchByUserId();

            return new Promise((resolve, reject) => {
                this.reject = reject;
                this.resolve = resolve;
            });

        },
        //通过用户租户id查找用户
        searchByUserId(){
            let param = {
                deptId:this.brunch.id,
                limit: 999,
                userId:this.item.id,
            };
            searchProjectByuserId(param).then(ret => {
                $log('list....searchByProjectId', ret);
                let resData = ret.data;
                if(resData){
                    this.getprojectList();
                    this.selectedProject = resData.data || [];
                }
            });
        },
        //获取租户列表
        getprojectList(){
            let param = {
                limit: 999,
                deptId:this.brunch ? this.brunch.id : this.user.deptId
            };
            $log('params', param);
            projectList(param).then(ret => {
                $log('list', ret);
                let resData = ret.data.data;
                if(resData){
                    let selectedProject = this.selectedProject;
                    for(let i = 0;i < resData.length;i++){
                        if(selectedProject.length > 0){
                            let curId = resData[i].id;
                            console.log('curId',curId);
                            for(let x = 0 ;x < selectedProject.length ; x++){
                                if(selectedProject[x].id === curId){
                                    resData.splice(i,1);
                                }
                            }
                        }
                    }
                    console.log('allArr',resData);
                    this.allProject = resData || [];
                }
            });
        },
        hide() {
            this.isShow = false;

        },
        cancel() {
            this.hide();
            typeof this.reject() === 'function' && this.reject();
        },
        setting() {
            return new Promise(resolve => {
                setTimeout(() => {
                    typeof this.resolve(this.form) === 'function' && this.resolve(this.form);
                }, 1000);
            });
        },
        chooseCur(user,i){
            let param = {
                userId:this.item.id,
                projectId:user.id
            };
            relateProject(param).then(ret => {
                $log('result...', ret);
                if(ret.data.code === '0000'){
                    let item = this.allProject.splice(i,1);
                    for(let j = 0;j < this.selectedProject.length;j++){
                        if(this.selectedProject[j].id === item.id){
                            this.$alert('已有重复成员', '提示', {
                                type: 'error'
                            });
                            return;
                        }
                    }
                    this.selectedProject.push(item[0]);
                    return this.$alert('操作成功','提示');
                }else{
                    this.$alert('操作失败', '提示', {
                        type: 'error'
                    });
                }

            });

        },
        delCur(user,i){
            let param = {
                userId:this.item.id,
                projectId:user.id
            };
            delRelateProject(param).then(ret => {
                $log('result...', ret);
                if(ret.data.code === '0000'){
                    let item = this.selectedProject.splice(i,1);
                    for(let j = 0;j < this.allProject.length;j++){
                        if(this.allProject[j].id === item.id){
                            this.$alert('已有重复成员', '提示', {
                                type: 'error'
                            });
                            return;
                        }
                    }
                    this.allProject.push(item[0]);
                    return this.$alert('操作成功','提示');
                }else{
                    this.$alert('操作失败', '提示', {
                        type: 'error'
                    });
                }

            });

        },

    },
    mounted(){
    }
};
</script>
<style lang="scss">
    .item{
        &:last-child{
            border-bottom:1px solid #BBB;
        }
        border: 1px solid #BBB;
        border-bottom:0;
        background-color: #f9f9f9;
        overflow: hidden;
        padding:5px;
        p{
            margin-bottom:10px;
        }
    }
    .selectBtn{
        span{
            line-height: 1;
            font-size: 12px;
        }
        padding:6px;
        vertical-align: middle;
    }
</style>
