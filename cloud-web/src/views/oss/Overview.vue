<template>
    <div class="page-main">
        <el-row :gutter="15" class="overview">
            <el-col :span="24">
                <h3 class="font16">监控数据</h3>
                <!-- 基础数据 -->
                <base-data></base-data>

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
