<template>
    <el-dialog title="工单详情" :visible.sync="isShow" width="600px"  v-dialogDrag>
        <div class="detailbox">
            <p class="top">工单详情</p>
            <div class="orderIntro">
                <p> 
                    <span>工单号:</span>
                    <span>{{item.orderNO }}</span>
                </p>
                <p> 
                    <span>标题:</span>
                    <span>{{item.title }}</span> 
                </p>
                <p> 
                    <span>描述:</span> <span>{{item.orderDesc}}</span> 
                </p>
                <p> <span>电话:</span> <span>{{item.mobile}}</span></p>
                <p> <span>邮箱:</span> <span>{{item.email}}</span></p>
                <div class="clearfix">
                    <div class="pull-left">附件:</div>
                    <div v-if="item.attach" class="pull-left ml10">
                        <p v-for="attach in attachArr" :key="attach">
                        {{returnAttach(attach)}}
                        <a class="btn-link ml5" @click="searchFile(attach)">查看</a>
                        </p>
                    </div>
                    <span v-else class="pull-left">无</span>
                </div>
            </div>
            <hr class="mt10">
            <p class="top mt20" >最新补充</p>
            <div class="reply mb10" v-for="(item, index) in addData" :key="index">
                <p>补充的内容：{{item.suppleContent}}</p>
                <p>补充时间：{{item.createTime | date}}</p>
                <div v-if="item.attachUrl">
                        {{returnAttach(item.attachUrl)}}
                        <a class="btn-link ml5" @click="searchFile(item.attachUrl)">查看</a>
                    </div>

            </div>
            <hr class="mt10">
            <p class="top mt20" >最新回复</p>
            <div class="reply mb10" v-for="reply in replayData" :key="reply.orderNO">
                <p>回复的内容：{{reply.replyContent}}</p>
                <p>回复时间：{{reply.replyTime | date}}</p>

            </div>
        </div>
        <span slot="footer" class="dialog-footer">            
        </span>
    </el-dialog>
</template>
<script>
import {searchFile,detail} from '@/service/order.js';
export default {
    data() {
        return{
            isShow: false,
            resolve: null,
            reject: null,
            API_URL,
            attachArr:[],
            item:{},
            replayData: [],
            addData: []
        };
    },
    props: {},
    methods: {
        show(item) {
            this.isShow = true;
            this.item = item;
            if(item.attach){
                this.attachArr = item.attach.split(',');
            }
            console.log('item',item);
            this.detail(item.orderNO);
            // this.getOrderSupple(item.orderNO);
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
        returnAttach(attach){
            if(attach){
                let arr = attach.split('/');
                return arr[arr.length - 1];
            }
        },
        setting() {
            return new Promise(resolve => {
                setTimeout(() => {
                    typeof this.resolve(this.form) === 'function' && this.resolve(this.form);
                }, 1000);
            });
        },
        // // 获得工单补充内容
        // getOrderSupple(val) {
        //     let params = {
        //         orderNo: val
        //     };
        //     getSupplement(params)
        //         .then(res =>{
        //             if(res && res.code && res.code === this.CODE.SUCCESS_CODE) {
        //                 console.warn(res);
        //                 this.replayData = res.data || [];
        //             }else{
        //                 $log(res.msg);
        //             }
        //         })
        //         .catch(err => {
        //             $log(err);
        //         });
        // },
        // 获得工单补充内容
        detail(id) {
            detail(id)
                .then(res =>{
                    if(res && res.code && res.code === this.CODE.SUCCESS_CODE) {
                        if(res.data){
                            this.replayData = res.data.orderReply;
                            this.addData = res.data.supplement;
                        }

                    }else{
                        $log(res.msg);
                    }
                })
                .catch(err => {
                    $log(err);
                });
        },
        // 获得工单图片
        searchFile(val) {
            let params = {
                fileName: val
            };
            searchFile(params);
        }

    }
};
</script>
<style lang="scss">
    .detailbox{
        .top{
            border-left: 3px solid #4895d7;
            height: 16px;
            font-size: 14px;
            color: #333333;
            padding-left: 10px;
            margin-bottom: 16px;
            line-height: 100%;
        }
        color:#666;
        p{
            margin-bottom:10px;
        }
        .reply{
            border: 1px solid #999;
            padding: 20px 10px;
            p{
                margin: 0;
            }
        }
        .orderIntro{
            p{
                display: flex;
                span:first-child{
                    margin-right: 10px;
                }
                span:last-child{
                    flex: 1;
                }
            } 
        }
    }
</style>
