<template>
    <el-dialog title="回复" :visible.sync="isShow" width="600px"  class="CreateRole" v-dialogDrag>
        <el-form size="small" :model="form" ref="form" :rules="rules">
            <el-form-item label="工单标题 "  :label-width="formLabelWidth">
                <el-input disabled :value="order.title"></el-input>
            </el-form-item>
            <el-form-item label="工单描述 " :label-width="formLabelWidth">
                <el-input disabled :value="order.orderDesc" type="textarea"></el-input>
            </el-form-item>
            <el-form-item label="补充 " :label-width="formLabelWidth">
                <div class="reply mb10" v-for="(item, index) in replayData" :key="index" v-if="replayData.length>0">
                    <p>回复内容：{{item.suppleContent}}</p>
                    <p>{{item.createTime | date}}</p>
                    <span v-if="item.attachUrl">
                        {{returnAttach(item.attachUrl)}}
                        <a class="btn-link ml5" @click="searchFile(item.attachUrl)">查看</a>
                    </span>
                </div>
                <div v-else class="font12 color333">
                    暂无补充内容
                </div>
            </el-form-item>
            <el-form-item label="回复 " prop="suppleContent" :label-width="formLabelWidth">
                <el-input placeholder="输入回复内容" type="textarea" v-model="form.suppleContent"></el-input>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button type="info" class="font12" size="small" @click="isShow = false">取 消</el-button>
            <el-button type="primary" class="font12" size="small" @click="confirm" :loading="confirmBtn">确 定</el-button>
        </span>
    </el-dialog>
</template>
<script>
import { mapState } from 'vuex';
import {getSupplement,searchFile,delReply} from '@/service/order.js';
export default {
    data() {
        return{
            formLabelWidth: '120px',
            isShow: false,
            resolve: null,
            reject: null,
            confirmBtn: false,
            order:{},
            replayData:[],
            form:{
                suppleContent:''
            },
            rules:{
                suppleContent: [
                    { required: true, message: '请输入回复内容', trigger: 'blur' }
                ]

            }
        };
    },
    computed:{
        ...mapState({
            user: state => state.user.userInfo,
        }),
    },
    props: {},
    methods: {
        show(item) {
            this.isShow = true;
            this.order = item;
            this.getOrderSupple(item.orderNO);
            return new Promise((resolve, reject) => {
                this.reject = reject;
                this.resolve = resolve;
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
        confirm() {
            this.confirmBtn = true;
            this.$refs.form.validate((valid) => {
                if (valid) {
                    let param = {
                        orderNO:this.order.orderNO,
                        replyContent:this.form.replyContent
                    };
                    delReply(param).then(ret=>{
                        if(ret.code === '0000'){
                            this.hide();
                            this.setting();
                            this.confirmBtn = false;
                            return this.$alert('操作成功','提示');
                        }else{
                            this.$alert('操作失败', '提示', {
                                type: 'error'
                            });
                            return;
                        }
                    });
                } else {
                    this.confirmBtn = false;
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        // 获得工单图片
        searchFile(val) {
            let params = {
                fileName: val
            };
            searchFile(params)
                .then(res =>{
                    if(res && res.code && res.code === this.CODE.SUCCESS_CODE) {
                        console.warn(res);
                        this.replayData = res.data || [];
                    }else{
                        $log(res.msg);
                    }
                })
                .catch(err => {
                    $log(err);
                });
        },
        // 获得工单补充内容
        getOrderSupple(val) {
            let params = {
                orderNo: val
            };
            getSupplement(params)
                .then(res =>{
                    if(res && res.code && res.code === this.CODE.SUCCESS_CODE) {
                        console.warn(res);
                        this.replayData = res.data || [];
                    }else{
                        $log(res.msg);
                    }
                })
                .catch(err => {
                    $log(err);
                });
        },

    }
};
</script>
<style lang="scss" scoped>
    .reply{
        border: 1px solid #999;
        padding: 20px 10px;
        p{
            margin: 0;
        }
    }
</style>
