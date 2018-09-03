<template>
    <div id="product" class="product">
        <div class="product-top text-center">产品动态</div>
        <div class="product-content" :style="{'height': height + 'px'}">
            <div class="list_container">
                <ul>
                    <li>
                        <el-row class="name link-item">
                            <el-col :span="1">
                                <i class="iconfont icon-chaolianjie font9"></i>
                            </el-col>
                            <el-col :span="20">
                                <span class="font12 color666 finger-cursor text-ellipsis link-item__content" >【系统通知】媒体云1.0版本已发布完成</span>
                                <div class="timelinedate">2017-11-30</div>
                            </el-col>
                            <el-col :span="3">
                                <zt-icon class="font32 new-tip" :icon="'zticon-new'" type="svg"></zt-icon>
                            </el-col>
                        </el-row>
                    </li>
                    <li>
                        <el-row class="name link-item">
                            <el-col :span="1">
                                <i class="iconfont icon-chaolianjie font9"></i>
                            </el-col>
                            <el-col :span="20">
                                <span class="font12 color666 finger-cursor text-ellipsis link-item__content">【新功能】媒体云项目组正在加班赶工ing</span>
                                <div class="timelinedate">2017-11-30</div>
                            </el-col>
                            <el-col :span="3">
                                <zt-icon class="font32 new-tip" :icon="'zticon-new'" type="svg"></zt-icon>
                            </el-col>
                        </el-row>
                    </li>
                    <li>
                        <el-row class="name link-item">
                            <el-col :span="1">
                                <i class="iconfont icon-chaolianjie font9"></i>
                            </el-col>
                            <el-col :span="20">
                                <span class="font12 color666 finger-cursor text-ellipsis link-item__content">【活动推荐】人民日报媒体云将在5月13日展开内部演示及项目研讨会</span>
                                <div class="timelinedate">2018-05-16</div>
                            </el-col>
                            <el-col :span="3">
                                <zt-icon class="font32 new-tip" :icon="'zticon-new'" type="svg"></zt-icon>
                            </el-col>
                        </el-row>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    name: 'Product',
    data() {
        return {};
    },
    props: {
        height: Number
    },
    created() {}
};
</script>
<style src="./index.scss" lang="scss" scoped>