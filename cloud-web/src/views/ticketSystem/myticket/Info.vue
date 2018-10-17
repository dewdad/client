<template>
    <div class="page-main">
        <!-- 头部 -->
        <page-header>
            <b class="leftBlueBox"></b>
            工单编号：{{myticketInfo && myticketInfo.orderNO}}
            <div slot="right">
                <el-button type="primary" size="small" icon="el-icon-edit-outline" @click="supplementFn" :disabled="myticketInfo.status == 3 ">补充</el-button>
                <el-button type="info" size="small" icon="el-icon-delete" @click="deleteOrder()">
                    删除
                </el-button>
            </div>
        </page-header>
        <!-- 基本信息 -->
        <div class="basicInfo panel panel-default mt20">
            <div class="panel-heading">
                <i class="iconfont icon-user_profile_people mr10"></i>工单详情
            </div>
            <div class="panel-body zt-panel-body-info">
                <table class="table zt-table-info">
                    <tbody>
                        <tr>
                            <td class="br"><span>问题标题：</span> <span class="color333 ml10">{{myticketInfo && myticketInfo.title}}</span></td>
                            <td><span>优先级：</span><span class="color333 ml10">{{ myticketInfo && myticketInfo.orderLevel === 2 ? '重要' : '一般'}}</span></td>
                        </tr>
                        <tr>
                            <td class="br"><span>提交时间：</span> <span class="color333 ml10">{{myticketInfo && myticketInfo.createTime | date}}</span></td>
                            <td><span>实例ID：</span><span class="color333 ml10">{{myticketInfo && myticketInfo.resourceId}}</span></td>
                        </tr>
                        <tr>
                            <td class="br"><span>状态：</span>
                                <span class="color333 ml10" v-if="myticketInfo.status == 1">待处理</span>
                                <span class="color333 ml10" v-if="myticketInfo.status == 2">已处理</span>
                                <span class="color333 ml10" v-if="myticketInfo.status == 3">关闭</span>
                            </td>
                            <td><span>产品类型：</span><span class="color333 ml10">{{productType[0] && productType[0].label}}</span></td>
                        </tr>
                        <tr>
                            <td class="br"><span>故障类型：</span><span class="color333 ml10">{{faultType[0] && faultType[0].label}}</span></td>
                            <td class="br"><span>机密信息：</span><span class="color333 ml10">***</span></td>
                        </tr>
                        <tr>
                            <td class="br"><span>手机号码：</span><span class="color333 ml10">{{myticketInfo && myticketInfo.mobile}}</span></td>
                            <td><span>邮箱：</span><span class="color333 ml10">{{myticketInfo && myticketInfo.email}}</span></td>
                            
                        </tr>
                        <tr>
                            <td class="br"><span>问题描述：</span><span class="color333 ml10">{{myticketInfo && myticketInfo.remark}}</span></td>
                            <td></td>

                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
        <!-- 附件 -->
        <!-- <div class="basicInfo panel panel-default mt20">
            <div class="panel-heading">
                <i class="iconfont icon-user_profile_people mr10"></i>附件
            </div>
            <div class="panel-body zt-panel-body-info">
                <div class="ml20 mb20 mt20">
                </div>
            </div>
        </div> -->
        <!-- 补充记录 -->
        <div class="basicInfo panel panel-default mt20">
            <div class="panel-heading">
                <i class="iconfont icon-user_profile_people mr10"></i>补充记录
            </div>
            <div class="panel-body zt-panel-body-info">
                <div class="ml20 mb20 mt20 supplementaryRecord" >
                    <ul class="font12 ml20 color999">
                        <li v-if="item.suppleContent" v-for="(item, index) in addData" :key="index" class="clearfix mb10" style="border-bottom:1px dashed #ddd">
                            <img src="@/assets/images/ecs/top-head.svg" width="50" class="pull-left" alt="">
                            <div class=" mb10 pull-left ml20" >
                                <p>补充的内容：{{item.suppleContent}}</p>
                                <p>补充时间：{{item.createTime | date}}</p>
                                <p>附件：</p>
                                <div v-if="item.attachUrl" style="margin-left: 35px;">
                                    <div v-for="(file,index) in addDataFile[index]" :key="index">
                                        {{returnName(file)}}
                                        <a class="btn-link ml5" @click="searchFile(file)">查看</a>
                                    </div>
                                </div>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
        <!-- 沟通记录 -->
        <div class="basicInfo panel panel-default mt20">
            <div class="panel-heading">
                <i class="iconfont icon-user_profile_people mr10"></i>沟通记录
            </div>
            <div class="panel-body zt-panel-body-info">
                <div class="ml20 mb20 mt20">
                </div>
            </div>
        </div>
        <!--  -->
        <supplement-dialog ref="SupplementDialog"></supplement-dialog>
    </div>
</template>
<script>
import { getOrderList, deleteOrder, getOrderDetailByOrderNO} from '@/service/ticket.js';
import SupplementDialog from './SupplementDialog';
export default {
    data() {
        let orderStatus = [
            {key:1,'text':'待处理',value:'1'},
            {key:2,'text':'已处理',value:'2'},
            {key:3,'text':'关闭',value:'3'},
        ];
        let moduleTypes = [
            {value: '1', label: '弹性云主机',
                orderTypes: [
                    {value: 10, label: '远程连接'},
                    {value: 11, label: '镜像'},
                    {value: 12, label: '安全组配置'},
                    {value: 13, label: '升降配'},
                    {value: 14, label: '磁盘扩容'},
                    {value: 15, label: '挂载磁盘'}
                ]
            },
            // {value: '2', label: '云数据库RDS',
            //     orderTypes: [
            //         {value: 20, label: '版本/规格'},
            //         {value: 21, label: '只读实例'},
            //         {value: 22, label: '监控与报警'},
            //         {value: 23, label: '日志'},
            //         {value: 24, label: '参数设置'},
            //         {value: 25, label: '备份恢复'}
            //     ]
            // },
            {value: '3', label: '对象存储OSS',
                orderTypes: [
                    {value: 30, label: '文件上传/下载'},
                    {value: 31, label: '读写限制'},
                    {value: 32, label: 'SDK/API'},
                    {value: 33, label: '图片处理服务'},
                    {value: 34, label: '域名/监控'},
                    {value: 35, label: '静态页面'},
                    {value: 36, label: '防盗链'},
                    {value: 37, label: '镜像回源'}
                ]
            },
            // {value: '4', label: '云数据库Redis', orderTypes: []},
            // {value: '5', label: '弹性伸缩', orderTypes: []},
            {value: '6', label: '专有网络VPC',
                orderTypes: [
                    {value: 60, label: 'VPC使用场景'},
                    {value: 61, label: 'VPC配置'},
                    {value: 62, label: '对等连接'},
                    {value: 63, label: '虚拟防火墙'}
                ]
            },            
        ];
        return {
            myticketList: [],
            addDataFile: [],
            orderStatus,
            moduleTypes,
            addData: [],
            myticketInfo:{}
        };
    },
    components: { 
        SupplementDialog
    },
    computed: {
        productType () {
            if(!this.myticketInfo) return [];
            return this.moduleTypes.filter(
                item => item.value == this.myticketInfo.moduleType
            );
        },
        faultType() {
            if(!this.productType[0]) return [];
            return this.productType[0].orderTypes.filter(
                item => item.value == this.myticketInfo.orderType
            );
        },

        // orderStatusVal() {
        //     return this.orderStatus.filter(
        //         item => item.key == this.myticketInfo.status
        //     );
        // }
    },
    methods: {
        //查询
        getOrder(){
            let data = {
                pageIndex: 1,
                orderNO:this.$route.params.id,
            };           
            this.loading = true;
            getOrderList(data)
                .then( res => {     
                    this.loading = false;              
                    if (res && res.code && res.code === this.CODE.SUCCESS_CODE) {
                        let resData = res.data || {};
                        if(resData.total){
                            this.myticketList = resData.data;
                            this.myticketInfo = this.myticketList.filter(
                                item => item.orderNO === this.$route.params.id
                            )[0];
                            this.getOrderDetail();
                        } else {
                            this.$alert('您查询的工单不存在', {
                                title: '提示',
                                type: 'error'
                            }).then(() => {
                                this.$store.commit('SET_PAGE_LOAD_ERROR', '您查询的工单不存在');
                            });
                        }                       
                    }else {
                        $log(res.msg);
                    }                   
                })
                .catch(err => {
                    $log('getOrderList', err);
                    this.loading = false;
                });

        },
        // 获得工单图片
        searchFile(val) {
            let encode = encodeURIComponent(val);
            let url = API_URL + '/fileProcess/getFile?fileName=' + encode;
            return window.open(url);
        },
        // 删除工单
        deleteOrder(id){
            this.$confirm('删除后，您将无法恢复和查看该工单，请谨慎操作。您确定要删除该工单吗?', '删除确认', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            })
                .then(() => {
                    let date = {
                        req_param: this.$route.params.id
                    };
                    deleteOrder(date)
                        .then( res => {
                            if (res && res.code && res.code === this.CODE.SUCCESS_CODE) {
                                this.$message.success('删除成功');
                                this.$router.push({ name: 'app.ticketSystem.myTicket-list'});
                            }                        
                        })
                        .catch( (err) => {
                            $log(err);                          
                        });
                })
                .catch( () => {
                            
                });
        },
        returnName(file){
            let item = file.split('/');
            return item[item.length - 1];
        },
        // 问题补充
        supplementFn() {
            console.warn(this.$refs['SupplementDialog']);
            this.$refs['SupplementDialog'].show({...this.myticketInfo})
                .then((ret) => {
                    console.warn(ret);
                    this.getOrderDetail();
                });
        },
        // 根据工单编号查询工单详情
        getOrderDetail() {
            getOrderDetailByOrderNO(this.myticketInfo.orderNO)
                .then((ret) => {
                    console.warn(ret);
                    if(ret && ret.code && ret.code === this.CODE.SUCCESS_CODE) {
                        this.addData = ret.data.supplement;
                        if(this.addData){
                            for(let i = 0;i < this.addData.length;i++){
                                let arr = [];
                                if(this.addData[i].attachUrl){
                                    arr = this.addData[i].attachUrl.split(',');
                                }
                                this.addDataFile.push(arr);
                            }
                        }
                    }
                })
                .catch((err) => {

                });
        }
    },
    async created(){
        await this.getOrder();

    }
};
</script>
<style lang="scss" scoped>
.br{
     border-right: 1px solid #ddd;
 }
.zt-table-info td{
     width: 50%;
     color: #999999;
     padding-left: 20px;
     span:first-child{
        width: 80px;
        color: #999999;
        display: inline-block;
     }
 }
 .zt-table-info tbody tr td:nth-of-type(2n - 1){
     width: auto !important;
 }
 .supplementaryRecord{
     &::after{
         content: '';
         display: block;
         clear: both;
     }
     ul, img{
        float: left;
     }
 }
</style>
