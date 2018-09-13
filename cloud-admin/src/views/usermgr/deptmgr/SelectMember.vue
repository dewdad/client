<template>
    <el-dialog title="关联用户" :visible.sync="isShow" width="600px"  v-dialogDrag>
        <el-row>
            <el-col :span="12" style="padding:10px;border:1px solid #BBB;height:400px;overflow-y: auto">
                <div class="mb10">所有未关联成员：</div>
                <div class="item" v-for="(user,index) in allUsers" :key="user.id" v-if="allUsers.length>0">
                    <span>{{user.name}}</span>
                    <el-button type="primary pull-right selectBtn" size="small" style="font-size: 18px;" @click="chooseCur(user,index)">关联</el-button>
                </div>
            </el-col>
            <el-col :span="12" style="padding:10px;border:1px solid #BBB;border-left:0;height:400px;overflow-y: auto">
                <div class="mb10">已关联成员：</div>
                <div class="item" v-for="(user,index) in selectedUser" :key="user.id" v-if="selectedUser.length>0">
                    <span>{{user.name}}</span>
                    <el-button type="primary pull-right selectBtn" size="small" style="font-size: 18px;" @click="delCur(user,index)">取消关联</el-button>
                </div>
            </el-col>
        </el-row>
        <span slot="footer" class="dialog-footer">
            <el-button type="info" class="font12" @click="isShow = false">关 闭</el-button>
        </span>
    </el-dialog>
</template>
<script>
import { mapState } from 'vuex';
import {listProjectByDomain,searchByProjectId,relateUser,delRelateUser} from '@/service/usermgr/deptmgr.js';
export default {
    data() {
        return{
            isShow: false,
            resolve: null,
            reject: null,
            item:{},
            brunch:{},
            allUsers:[],
            selectedUser:[],
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
            this.searchByProjectId();
            return new Promise((resolve, reject) => {
                this.reject = reject;
                this.resolve = resolve;
            });

        },
        //通过租户id查找用户
        searchByProjectId(){
            let param = {
                deptId:this.brunch.id,
                projectId:this.item.id,
            };
            searchByProjectId(param).then(ret => {
                $log('list....searchByProjectId', ret);
                let resData = ret.data;
                this.listProject();
                if(resData){
                    this.selectedUser = resData || [];
                }
            });
        },
        //查询所有用户
        listProject(){
            let param = {
                limit:9999,
                domain:this.brunch.id
            };
            console.log('param',param);
            listProjectByDomain(param).then(ret => {
                $log('list', ret);
                let resData = ret.data;
                if(resData && resData.data){
                    let allArr = [];
                    for(let i = 0;i < resData.data.length;i++){
                        if(this.selectedUser.length > 0){
                            for(let j = 0;j < this.selectedUser.length;j++){
                                if(this.selectedUser[j].id !== resData.data[i].id){
                                    allArr.push(resData.data[i]);
                                }
                            }
                        }else{
                            allArr.push(resData.data[i]);
                        }
                    }
                    console.log('allArr',allArr);
                    this.allUsers = allArr || [];
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
                userId:user.id,
                projectId:this.item.id
            };
            relateUser(param).then(ret => {
                $log('result...', ret);
                if(ret.data.code === '0000'){
                    let item = this.allUsers.splice(i,1);
                    for(let j = 0;j < this.selectedUser.length;j++){
                        if(this.selectedUser[j].id === item.id){
                            this.$alert('已有重复成员', '提示', {
                                type: 'error'
                            });
                            return;
                        }
                    }
                    this.selectedUser.push(item[0]);
                    return this.$confirm('操作成功','提示');
                }else{
                    this.$alert('操作失败', '提示', {
                        type: 'error'
                    });
                }

            });

        },
        delCur(user,i){
            let param = {
                userId:user.id,
                projectId:this.item.id
            };
            delRelateUser(param).then(ret => {
                $log('result...', ret);
                if(ret.data.code === '0000'){
                    let item = this.selectedUser.splice(i,1);
                    for(let j = 0;j < this.allUsers.length;j++){
                        if(this.allUsers[j].id === item.id){
                            this.$alert('已有重复成员', '提示', {
                                type: 'error'
                            });
                            return;
                        }
                    }
                    this.allUsers.push(item[0]);
                    return this.$confirm('操作成功','提示');
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
