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
                <p> <span>附件:</span> <span>{{item.email}}</span></p>
            </div>
            <hr>
            <p class="top mt20" >最新回复</p>
            <div class="reply mb10" v-for="(item, index) in replayData" :key="index">
                <p>回复内容：{{item.suppleContent}}</p>
                <p>{{item.createTime | date}}</p>
                <!-- <p v-if="item.attachUrl">附件：<a :href="API_URL + 'fileProcess/getFile?fileName=' + item.attachUrl" :download="" mce_href="#" target="_blank">{{item.attachUrl}}</a> </p> -->
                
            </div>
        </div>
        <span slot="footer" class="dialog-footer">            
        </span>
    </el-dialog>
</template>
<script>
import {getSupplement} from '@/service/order.js';
export default {
    data() {
        return{
            isShow: false,
            resolve: null,
            reject: null,
            API_URL,
            item:{},
            replayData: []
        };
    },
    props: {},
    methods: {
        show(item) {
            this.isShow = true;
            this.item = item;
            console.log('item',item);
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
