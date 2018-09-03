<template>
    <div id="overview" class="homeoverview">
        <el-row :gutter="20" class="overview">
            <el-col :span="18">
                <el-row :gutter="20">
                    <el-col :span="12">
                        <div class="info-box">
                            <div class="info-box-head">安全预警</div>
                            <div class="info-box-content">
                                <el-row :gutter="10">
                                    <el-col :span="8">
                                        <div class="info-box-content-info text-center">
                                            <span>云监控告警</span>
                                            <span class="number">0</span>
                                        </div>
                                    </el-col>
                                    <el-col :span="8">
                                        <div class="info-box-content-info text-center">
                                            <span>云主机安全</span>
                                            <span class="number">0</span>
                                        </div>
                                    </el-col>
                                    <el-col :span="8">
                                        <div class="info-box-content-info text-center">
                                            <span>攻击</span>
                                            <span class="number">0</span>
                                        </div>
                                    </el-col>
                                </el-row>
                            </div>
                        </div>
                    </el-col>
                    <el-col :span="12">
                        <div class="info-box">
                            <div class="info-box-head">待办事项</div>
                            <div class="info-box-content">
                                <el-row :gutter="10">
                                    <el-col :span="8">
                                        <div class="info-box-content-info text-center">
                                            <span>工单</span>
                                            <span class="number">0</span>
                                        </div>
                                    </el-col>
                                    <el-col :span="8">
                                        <div class="info-box-content-info text-center">
                                            <span>续费</span>
                                            <span class="number">0</span>
                                        </div>
                                    </el-col>
                                    <el-col :span="8">
                                        <div class="info-box-content-info text-center">
                                            <span>过期</span>
                                            <span class="number">0</span>
                                        </div>
                                    </el-col>
                                </el-row>
                            </div>
                        </div>
                    </el-col>
                </el-row>
                <el-row :gutter="20" class="mt20">
                    <el-col :span="12">
                        <div class="info-box">
                            <div class="info-box-head">账户信息</div>
                            <div class="info-box-content">
                                <el-row :gutter="10">
                                    <el-col :span="12">
                                        <div class="info-box-content-info text-center">
                                            <span>可用余额(元)</span>
                                            <span class="number1">0.00</span>
                                            <a href="" class="recharge text-center">充值</a>
                                        </div>
                                    </el-col>
                                    <el-col :span="12">
                                        <div class="info-box-content-info text-center">
                                            <span>我的订单</span>
                                            <span class="number">0</span>
                                        </div>
                                    </el-col>
                                </el-row>
                            </div>
                        </div>
                    </el-col>
                    <el-col :span="12">
                        <div class="info-box">
                            <div class="info-box-head">消息中心</div>
                            <div class="info-box-content">
                                <el-row :gutter="10">
                                    <el-col :span="12">
                                        <div class="info-box-content-info text-center">
                                            <span>未读消息</span>
                                            <span class="number">0</span>
                                        </div>
                                    </el-col>
                                    <el-col :span="12">
                                        <div class="info-box-content-info text-center">
                                            <span>已读消息</span>
                                            <span class="number">0</span>
                                        </div>
                                    </el-col>
                                </el-row>
                            </div>
                        </div>
                    </el-col>
                </el-row>
                <el-row class="mt20">
                    <el-col :span="24">
                        <div class="info-box">
                            <div class="info-box-head">您可能感兴趣的产品</div>
                            <div class="info-box-content products-flex" :style="{'height': productHeight + 'px !important'}">
                                <el-row :gutter="10">
                                    <el-col :span="8">
                                        <div class="products">
                                            <div class="products-inner">
                                                <i class="icon-ecs_people font16 color3"></i>
                                                <span class="font12 products-name">云服务器ECS</span>
                                                <div class="products-count">0</div>
                                            </div>
                                        </div>
                                    </el-col>
                                    <el-col :span="8">
                                        <div class="products">
                                            <div class="products-inner">
                                                <i class="icon-oss_people font16 color3"></i>
                                                <span class="font12 products-name">对象存储OSS</span>
                                                <div class="products-count">0</div>
                                            </div>
                                        </div>
                                    </el-col>
                                    <el-col :span="8">
                                        <div class="products">
                                            <div class="products-inner">
                                                <i class="icon-vpc_people font16 color3"></i>
                                                <span class="font12 products-name">专有网络</span>
                                                <div class="products-count">0</div>
                                            </div>
                                        </div>
                                    </el-col>
                                </el-row>
                                <el-row :gutter="10" class="mt10">
                                    <el-col :span="8">
                                        <div class="products">
                                            <div class="products-inner">
                                                <i class="icon-ip_people font16 color3"></i>
                                                <span class="font12 products-name">弹性公网IP</span>
                                                <div class="products-count">0</div>
                                            </div>
                                        </div>
                                    </el-col>
                                    <el-col :span="8">
                                        <div class="products">
                                            <div class="products-inner">
                                                <i class="icon-slb_people font16 color3"></i>
                                                <span class="font12 products-name">负载均衡</span>
                                                <div class="products-count">0</div>
                                            </div>
                                        </div>
                                    </el-col>
                                    <el-col :span="8">
                                        <div class="products">
                                            <div class="products-inner">
                                                <i class="ecs-menu_rds_people font16 color3"></i>
                                                <span class="font12 products-name">云数据库RDS</span>
                                                <div class="products-count">0</div>
                                            </div>
                                        </div>
                                    </el-col>
                                </el-row>
                                <el-row :gutter="10" class="mt10">
                                    <el-col :span="8">
                                        <div class="products">
                                            <div class="products-inner">
                                                <i class="icon-security_people font16 color3"></i>
                                                <span class="font12 products-name">云安全</span>
                                                <div class="products-count">0</div>
                                            </div>
                                        </div>
                                    </el-col>
                                    <el-col :span="8">
                                        <div class="products">
                                            <div class="products-inner">
                                                <i class="icon-monitor_people font16 color3"></i>
                                                <span class="font12 products-name">云监控</span>
                                                <div class="products-count">0</div>
                                            </div>
                                        </div>
                                    </el-col>
                                    <el-col :span="8">
                                        <div class="products">
                                            <div class="products-inner">
                                                <i class="ecs-menu_redis_people font16 color3"></i>
                                                <span class="font12 products-name">云安全</span>
                                                <div class="products-count">0</div>
                                            </div>
                                        </div>
                                    </el-col>
                                </el-row>
                            </div>
                        </div>
                    </el-col>
                </el-row>
            </el-col>
            <el-col :span="6">
                <product />
            </el-col>
        </el-row>
    </div>
</template>
<script>
import Product from '@/components/product/Index.vue';
export default {
    name: 'Overview',
    data() {
        return {
            rightHeight: 100 // 右侧产品动态高度
        };
    },
    computed: {
        // 设置您可能感兴趣的产品容器高度 使界面在大屏下撑满
        productHeight: function() {
            let clientHeight = document.documentElement.clientHeight;
            let scrollHeight = document.body.scrollHeight;
            if (scrollHeight > clientHeight) {
                // 网页高度大于浏览器可视高度
                return 188;
            } else {
                return clientHeight - 573;
            }
        }
    },
    components: {
        Product
    },
    methods: {},
    mounted() {}
};
</script>
<style scoped lang="scss">
.homeoverview {
    min-height: 710px;
    padding: 20px;
    background: rgb(237, 242, 249);
    display: flex;
    flex: 1;
    flex-direction: column;
    > .el-row {
        display: flex;
        > .el-col-6 {
            width: 260px;
        }
        > .el-col-18 {
            flex: 1;
        }
    }
}

.info-box {
    background-color: #fff;
    border: 1px solid #dee2ed;
    padding: 20px;
}

.info-box .info-box-head {
    height: 40px;
    font-size: 16px;
}

.info-box-content-info {
    padding: 15px 10px;
    background: #f6f7fb;
    font-size: 12px;
    color: #999;
    height: 100px;
    position: relative;
}

.info-box-content-info span {
    display: block;
}

.info-box-content-info .number {
    font-size: 36px;
    margin-top: 10px;
}

.info-box-content-info .number1 {
    font-size: 26px;
}

.recharge {
    position: absolute;
    bottom: 0px;
    left: 0px;
    width: 100%;
    height: 30px;
    line-height: 30px;
    background: #fa970c;
    color: #fff;
}

.products-flex {
    display: flex;
    flex-direction: column;
    min-height: 188px;
    height: 188px;
}

.products-flex .el-row {
    flex: 1;
}

.products-flex .el-row .el-col {
    height: 100%;
}

.products {
    padding: 14.5px 20px;
    height: 100%;
    line-height: 100%;
    position: relative;
    background: #f6f7fb;
}

.products .products-inner {
    position: absolute;
    left: 20px;
    right: 20px;
    top: 50%;
    line-height: 32px;
    margin-top: -16px;
}

.products .products-inner .products-name {
    margin-left: 10px;
}

.products .products-inner .products-count {
    margin-top: 5px;
    float: right;
    padding: 4px 8px;
    border-radius: 4px;
    line-height: 1;
    background: #e3e6ef;
    color: #656565;
    transition: all 0.1s linear;
}
</style>
