<template>
    <div class="page-main">
        <page-header class="no-border">
            <!-- 返回上一级 -->
            <div class="GoBack">
                <b class="font16 mr10">添加报警规则</b>
                <el-button size="mini" type="info" @click="$router.go(-1)">
                    <i class="iconfont icon-fanhui"></i>返回</el-button>
            </div>
        </page-header>
        <div class="page-body">
            <zt-form inline-message :model="ruleForm" :rules="rules" ref="ruleForm" label-width="120px" size="small">
                <legend style="padding-bottom:5px" class="pt0">
                    <span style="line-height:2; margin-right:10px;" class="font14 iconfont icon-head_workorder_peop"></span>
                    <span class="color3 font16">关联资源</span>
                </legend>
                <zt-form-item label="产品" prop="">
                    <el-select>
                        <el-option label="云服务器ECS"></el-option>
                        <el-option label="云盘"></el-option>
                    </el-select>
                </zt-form-item>
                <zt-form-item label="资源" prop="">
                    <el-select>
                        <el-option label="全部资源"></el-option>
                        <el-option label="bucket维度"></el-option>
                    </el-select>
                </zt-form-item>
                <zt-form-item label="bucket" prop="">
                    <el-select>
                        <el-option label="全部资源"></el-option>
                        <el-option label="bucket维度"></el-option>
                    </el-select>
                </zt-form-item>
                <legend style="padding-bottom:5px" class="pt0">
                    <span style="line-height:2; margin-right:10px;" class="font14 iconfont icon-setting_people"></span>
                    <span class="color3 font16">设置规则</span>
                </legend>
                <zt-form-item label="规则名称" prop="">
                    <el-input placeholder="请输入规则名称"></el-input>
                </zt-form-item>
                <zt-form-item label="规则描述" prop="">
                    <el-select>
                        <el-option label="get请求"></el-option>
                        <el-option label="put请求"></el-option>
                    </el-select>
                    <el-select class="ml10" style="width: 100px">
                        <el-option label="5分钟"></el-option>
                        <el-option label="10分钟"></el-option>
                    </el-select>
                    <el-select class="ml10" style="width: 100px">
                        <el-option label="监控值"></el-option>
                    </el-select>
                    <el-select class="ml10" style="width: 100px">
                        <el-option label=">"></el-option>
                        <el-option label=">="></el-option>
                    </el-select>
                    <el-input class="ml10" style="width: 100px" type="number" placeholder="阀值"></el-input>
                    <el-popover placement="top" title="" width="200" trigger="hover">
                        <div>
                            该指标用于统计每秒从测量对象获取put请求的次数，以请求/秒为单位。
                        </div>
                        <span class="tips-help ml10" slot="reference">
                            <zt-icon icon="icon-iconfontwenhao1"></zt-icon>
                        </span>
                    </el-popover>
                </zt-form-item>
                <zt-form-item label="通道沉默时间" label-width="200px" prop="">
                    <el-select>
                        <el-option label="24小时"></el-option>
                        <el-option label="bucket维度"></el-option>
                    </el-select>
                </zt-form-item>
                <zt-form-item label="连续几次超过阈值后报警" label-width="200px" prop="">
                    <el-select>
                        <el-option label="1"></el-option>
                        <el-option label="3"></el-option>
                    </el-select>
                </zt-form-item>
                <zt-form-item label="生效时间" prop="">
                    <el-time-select style="width: 150px" :picker-options="{
                        start: '00:00',
                        step: '01:00',
                        end: '24:00'
                    }" placeholder="选择时间"></el-time-select>
                    至
                    <el-time-select style="width: 150px" :picker-options="{
                        start: '00:59',
                        step: '01:00',
                        end: '23:59'
                    }" placeholder="选择时间"></el-time-select>

                </zt-form-item>
                <legend style="padding-bottom:5px" class="pt0">
                    <span style="line-height:2; margin-right:10px;" class="font14 iconfont icon-inform_people"></span>
                    <span class="color3 font16">通知方式</span>
                </legend>
                <zt-form-item label="通知对象"  prop="">
                    <el-select>
                        <el-option label="1"></el-option>
                        <el-option label="3"></el-option>
                    </el-select>
                </zt-form-item>
                <zt-form-item label="通知方式"  prop="">
                    <el-select>
                        <el-radio label="1">邮箱</el-radio>
                        <el-radio label="2">手机+邮箱</el-radio>
                    </el-select>
                </zt-form-item>
                <zt-form-item prop="">
                    <el-button type="primary" size="small">创建</el-button>
                    <el-button type="info" size="small" @click="$router.go(-1)">
                       取消
                    </el-button>
                </zt-form-item>
            </zt-form>

        </div>
    </div>
</template>
<script>
export default {
    data() {
        return {};
    }
};
</script>
<style scoped>
.el-input,
.el-select {
    width: 300px;
}
</style>
