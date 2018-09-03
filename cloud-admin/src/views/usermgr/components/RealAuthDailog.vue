<template>
    <div v-if="dialogVisible">
        <el-dialog title="1511148366" top="40px" :visible.sync="dialogVisible" :close-on-click-modal="false" :close-on-press-escape="false">
            <div class="">
                <el-card class="box-card card-info" shadow="never">
                    <div slot="header" class="clearfix">
                        <span>企业信息</span>
                    </div>
                    <el-row>
                        <el-col :span="12">企业注册地：湖南省长沙市岳麓区</el-col>
                        <el-col :span="12">企业性质：企业</el-col>
                    </el-row>
                    <el-row class="mt10">
                        <el-col :span="12">企业名称：证通电子</el-col>
                        <el-col :span="12">营业执照注册号：91430111MA4L16JQ9B</el-col>
                    </el-row>
                    <el-row class="mt10">
                        <el-col :span="12">部门：-</el-col>
                        <el-col :span="12">业务组：-</el-col>
                    </el-row>
                    <el-row class="mt10">
                        <el-col :span="24">营业执照</el-col>
                    </el-row>
                </el-card>
                <el-card class="box-card card-info" shadow="never">
                    <div slot="header" class="clearfix">
                        <span>对公账户材料</span>
                    </div>
                    <el-row>
                        <el-col :span="24">银行开户名： 证通电子</el-col>
                    </el-row>
                    <el-row class="mt10">
                        <el-col :span="24">对公账号开户行：中国银行</el-col>
                    </el-row>
                    <el-row class="mt10">
                        <el-col :span="24">企业对公账号： 914301112342424</el-col>
                    </el-row>
                </el-card>
                <el-card class="box-card card-info" shadow="never">
                    <div slot="header" class="clearfix">
                        <span>审批内容</span>
                    </div>
                    <el-row>
                        <el-col :span="24">审批结果： 不通过</el-col>
                    </el-row>
                    <el-row class="mt10">
                        <el-col :span="24">原因：获取租户资源失败</el-col>
                    </el-row>
                </el-card>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
export default {
    name: 'app',
    data() {
        return {
            dialogVisible: true,
            reslove: null,
            reject: null
        };
    },
    methods: {
        show(data) {
            this.dialogVisible = true;
            return new Promise((reslove, reject) => {
                this.reslove = reslove;
                this.reslove = reject;
            });
        }
    }
};
</script>
<style scoped>
</style>
