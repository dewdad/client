<template>
    <div class="page-main">
        <!-- 返回上一步 -->
        <div class="">
            <span>返回上一步</span>
        </div>
        <!-- 提交工单 -->
        <div class="submitTicket panel panel-default mt20">
            <div class="panel-heading">
                <i class="iconfont icon-user_profile_people mr10"></i>沟通记录
            </div>
            <div class="panel-body zt-panel-body-info font12">
                <zt-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
                    <zt-form-item label="标题" prop="name">
                        <el-input type="textarea" resize="none" rows="5" placeholder="问题标题，不得超过100字!" v-model="ruleForm.name"></el-input>
                    </zt-form-item>
                    <zt-form-item label="产品类型" prop="productType">
                        <el-select v-model="ruleForm.productType" placeholder="请选择产品类型">
                            <el-option
                            v-for="item in productTypeData"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                            </el-option>
                        </el-select>
                    </zt-form-item>
                    <zt-form-item label="故障类型" prop="faultType">
                        <el-select v-model="ruleForm.faultType" placeholder="请选择故障类型">
                            <el-option
                            v-for="item in faultTypeData"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                            </el-option>
                        </el-select>
                    </zt-form-item>
                    <zt-form-item label="优先级">
                        <el-radio v-model="radio2" :label="3">重要</el-radio>
                        <el-radio v-model="radio2" :label="6">一般</el-radio>
                        <div class="prioritytip" v-show="radio2 === 3">关键业务受影响，需要紧急协助</div>
                        <div class="prioritytip" v-show="radio2 === 6">业务咨询或普通业务受影响，需要协助</div>
                    </zt-form-item>
                    <zt-form-item label="问题描述" prop="delivery">
                        <el-input type="textarea" rows="5" resize="none" placeholder="问题描述，不得超过100字，若提交密码或AccessKeys等信息，请通过“机密信息”方式添加，并在问题处理完毕后及时修改" v-model="ruleForm.delivery"></el-input>
                        <div class="font12 color999 mt20 problemDescribe">
                            <span>温馨提示：如果您现在遇到登陆问题，您可以尝试使用“</span>
                            <a class="font12" href="">管理员终端登录</a>
                            <span>”，windows服务器登陆问题请点击查看：“</span>
                            <a class="font12" href="">登录 Windows 实例</a>
                            <span>”，linux服务器登陆问题请点击查看：“</span>
                            <a class="font12" href="">登录 Linux 实例</a>
                            <span>”，其他问题请查看：“</span>
                            <a class="font12" href="">无法访问云服务器</a>”
                        </div>
                    </zt-form-item>
                    <zt-form-item label="实例ID" prop="exampleID">
                        <el-input v-model="ruleForm.exampleID"></el-input>
                    </zt-form-item>
                    <zt-form-item label="补充说明" prop="resource">
                        <el-input type="textarea" resize="none" rows="5" placeholder="补充说明，不得超过100字，若为ECS相关问题，请补充说明IP端口、网站地址、web目录等；若为RDS相关问题，请补充说明账号等，并尽快提交充分信息便于排查" v-model="ruleForm.resource"></el-input>
                    </zt-form-item>
                    <zt-form-item label="机密信息" prop="desc">
                        <el-input type="textarea" resize="none" rows="5" placeholder="请在此处填写实例名、账号、密码等机密信息，提交后，机密信息将做加密处理" v-model="ruleForm.desc"></el-input>
                    </zt-form-item>
                    <zt-form-item label="手机号码" prop="phone">
                        <el-input v-model="ruleForm.name"></el-input>
                    </zt-form-item>
                    <zt-form-item label="邮箱" prop="email">
                        <el-input v-model="ruleForm.name"></el-input>
                    </zt-form-item>
                    <zt-form-item label="上传附件">
                        <el-upload
                            class="upload"
                            action="https://jsonplaceholder.typicode.com/posts/"
                            list-type="picture-card"
                            :on-remove="handleRemove">
                            <i class="el-icon-plus"></i>
                        </el-upload>
                    </zt-form-item>
                    <zt-form-item>
                        <el-button type="primary" @click="submitForm('ruleForm')">提交工单</el-button>
                        <el-button @click="resetForm('ruleForm')">取消</el-button>
                    </zt-form-item>
                </zt-form>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    data() {
        return {
            ruleForm: {
                name: '',
                productType: '',
                faultType: '',
                delivery: '',
                exampleID: '',
                resource: '',
                desc: '',
                phone: '',
                email: ''
            },
            rules: {
                name: [
                    { required: true, message: '请输入标题', trigger: 'blur' }
                ],
                productType: [
                    { required: true, message: '请选择产品类型', trigger: 'change' }
                ],
                faultType: [
                    { required: true, message: '请选择故障类型', trigger: 'change' }
                ],
                delivery: [
                    { required: true, message: '请输入问题描述', trigger: 'change' }
                ],
                exampleID: [
                    {required: false, message: '', trigger: 'change' }
                ],
                resource: [
                    { required: false, message: '请选择活动资源', trigger: 'change' }
                ],
                desc: [
                    { required: false, message: '', trigger: 'blur' }
                ],
                phone: [
                    { required: true, message: '请输入正确的手机号码', trigger: 'blur' }
                ],
                email: [
                    { required: true, message: '请输入正确的邮箱地址', trigger: 'blur' }
                ]
            },
            productTypeData: [
                {value : '1', label: '云服务器ECS'},
                {value : '2', label: '云数据库RDS'},
            ],
            faultTypeData: [
                {value : '1', label: '远程连接'},
                {value : '2', label: '云数据库RDS'},
            ],
            radio2: 3
        };
    },
    methods: {
        handleRemove(file, fileList) {
            console.log(file, fileList);
        }
    }
};
</script>
<style lang="scss" scoped>
.submitTicket{
    margin: 20px 30px;
    .panel-body{
        padding: 20px 60px;
    }
    .prioritytip {
        font-size: 12px;
        color: #333;
        padding: 10px 20px;
        border: 1px solid #8DACEB;
        background-color: #edf2fc;
        line-height: 1;
    }
    .problemDescribe{
        line-height: normal;
    }
    .el-form-item__label{
        font-size: 12px;
    }
}
</style>


