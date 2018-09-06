<template>
    <div class="page-main">
        <el-row :gutter="15" class="overview">
            <el-col :span="24">
                <!-- 基础数据 -->
                <base-data></base-data>
                <!-- 特色服务 -->
                <div class="services oss-box">
                    <div class="oss-box-header">{{$t('oss.overview.specialService.name')}}</div>
                    <div class="oss-box-content">
                        <zt-card class="mb10">
                            <i class="iconfont icon-tupianchuli" slot="icon"></i>
                            <template slot="content">
                                <div class="title">{{$t('oss.overview.specialService.pictureProcessing')}}</div>
                                <div class="desc">{{$t('oss.overview.specialService.pictureProcessingDesc')}}</div>
                            </template>
                            <router-link class="view" slot="right" to="/">{{$t('oss.overview.specialService.viewLinkText')}}</router-link>
                        </zt-card>
                        <zt-card class="mb10">
                            <i class="iconfont icon-yinshipinchuli" slot="icon"></i>
                            <template slot="content">
                                <div class="title">{{$t('oss.overview.specialService.videoProcessing')}}</div>
                                <div class="desc">{{$t('oss.overview.specialService.videoProcessingDesc')}}</div>
                            </template>
                            <router-link class="view" slot="right" to="/">{{$t('oss.overview.specialService.viewLinkText')}}</router-link>
                        </zt-card>
                        <zt-card class="mb10">
                            <i class="iconfont icon-zhandianpinghuaqianyi" slot="icon"></i>
                            <template slot="content">
                                <div class="title">{{$t('oss.overview.specialService.siteMove')}}</div>
                                <div class="desc">{{$t('oss.overview.specialService.siteMoveDesc')}}</div>
                            </template>
                            <router-link class="view" slot="right" to="/">{{$t('oss.overview.specialService.viewLinkText')}}</router-link>
                        </zt-card>
                        <zt-card class="mb10">
                            <i class="iconfont icon-tongchengshuanghuo" slot="icon"></i>
                            <template slot="content">
                                <div class="title">{{$t('oss.overview.specialService.highAvailability')}}</div>
                                <div class="desc">{{$t('oss.overview.specialService.highAvailabilityDesc')}}</div>
                            </template>
                            <router-link class="view" slot="right" to="/">{{$t('oss.overview.specialService.viewLinkText')}}</router-link>
                        </zt-card>
                        <zt-card class="mb10">
                            <i class="iconfont icon-jingtaiwangzhantuoguan" slot="icon"></i>
                            <template slot="content">
                                <div class="title">{{$t('oss.overview.specialService.websiteTrusteeship')}}</div>
                                <div class="desc">{{$t('oss.overview.specialService.websiteTrusteeshipDesc')}}</div>
                            </template>
                            <router-link class="view" slot="right" to="/">{{$t('oss.overview.specialService.viewLinkText')}}</router-link>
                        </zt-card>
                        <zt-card class="mb10">
                            <i class="iconfont icon-fangdaolian" slot="icon"></i>
                            <template slot="content">
                                <div class="title">{{$t('oss.overview.specialService.antiStealingLink')}}</div>
                                <div class="desc">{{$t('oss.overview.specialService.antiStealingLinkDesc')}}</div>
                            </template>
                            <router-link class="view" slot="right" to="/">{{$t('oss.overview.specialService.viewLinkText')}}</router-link>
                        </zt-card>
                    </div>
                </div>
            </el-col>
        </el-row>
    </div>
</template>
<script>
import BaseData from './BaseData.vue';
import Product from '@/components/product/Index.vue';
import ZtCard from '@/components/common/ZtCard';
export default {
    name: 'Overview',
    data() {
        return {};
    },
    components: {
        Product,
        BaseData,
        ZtCard
    }
};
</script>
<style  scoped>
.title {
                height: 32px;
                font-size: 16px;
            }
            .desc {
                color: #999;
                font-size: 12px;
                text-align: justify;
            }
.view {
    display: block;
    padding-left: 30px;
    width: 80px;
    height: 30px;
    line-height: 30px;
    border-left: 1px solid #e4e5e9;
}
</style>
