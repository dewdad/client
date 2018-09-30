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
                <p> <span>产品类型:</span> <span>{{returnModuleType(item.moduleType)}}</span></p>
                <p> <span>优先级:</span> <span>{{item.orderLevel === 2 ? '重要' : '一般'}}</span></p>
                <p> <span>问题类型:</span> <span>{{returnProblemType(item.orderType)}}</span></p>
                <p> <span>加密信息:</span> <span>{{item.secretInfo}}</span></p>
                <p> <span>补充说明:</span> <span>{{item.remark}}</span></p>
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
                    <div v-for="(file,index) in addDataFile[index]" :key="index">
                        {{returnName(file)}}
                        <a class="btn-link ml5" @click="searchFile(file)">查看</a>
                    </div>
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
        let problemType = [
            {value: 10, label: '远程连接'},
            {value: 11, label: '镜像'},
            {value: 12, label: '安全组配置'},
            {value: 13, label: '升降配'},
            {value: 14, label: '磁盘扩容'},
            {value: 15, label: '挂载磁盘'},
            {value: 30, label: '文件上传/下载'},
            {value: 31, label: '读写限制'},
            {value: 32, label: 'SDK/API'},
            {value: 33, label: '图片处理服务'},
            {value: 34, label: '域名/监控'},
            {value: 35, label: '静态页面'},
            {value: 36, label: '防盗链'},
            {value: 37, label: '镜像回源'},
            {value: 60, label: 'VPC使用场景'},
            {value: 61, label: 'VPC配置'},
            {value: 62, label: '对等连接'},
            {value: 63, label: '虚拟防火墙'},
        ];
        let moduleType = [
            {value: 1, label: '弹性云主机'},
            {value: 3, label: '对象存储OSS'},
            {value: 6, label: '专有网络VPC'},

        ];
        return{
            problemType,
            moduleType,
            isShow: false,
            resolve: null,
            reject: null,
            API_URL,
            attachArr:[],
            item:{},
            replayData: [],
            addData: [],
            addDataFile:[]
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
        returnProblemType(type){
            console.log('returnProblemType',type);

            if(type){
                for(let i = 0;i < this.problemType.length;i++){
                    if(this.problemType[i].value === type){
                        return this.problemType[i].label;
                    }
                }
            }
        },
        returnModuleType(type){
            console.log('returnModuleType',type);
            if(type){
                for(let i = 0;i < this.moduleType.length;i++){
                    if(this.moduleType[i].value === type){
                        return this.moduleType[i].label;
                    }
                }
            }

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
        returnName(file){
            let item = file.split('/');
            return item[item.length - 1];
        },
        setting() {
            return new Promise(resolve => {
                setTimeout(() => {
                    typeof this.resolve(this.form) === 'function' && this.resolve(this.form);
                }, 1000);
            });
        },
        // 获得工单补充内容
        detail(id) {
            detail(id)
                .then(res =>{
                    if(res && res.code && res.code === this.CODE.SUCCESS_CODE) {
                        if(res.data){
                            this.replayData = res.data.orderReply;
                            this.addData = res.data.supplement;
                            if(this.addData){
                                for(let i = 0;i < this.addData.length;i++){
                                    let arr = [];
                                    if(this.addData[i].attachUrl){
                                        arr = this.addData[i].attachUrl.split(',');
                                    }
                                    this.addDataFile.push(arr);
                                }
                            }
                            console.log('this.addDataFile',this.addDataFile);
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
