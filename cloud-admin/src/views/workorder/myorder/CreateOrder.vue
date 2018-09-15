<template>
    <el-dialog title="创建工单" :visible.sync="isShow" width="600px"   v-dialogDrag>
        <el-form size="small" :model="form" ref="form" :rules="rules" label-width="120px">
            <!-- 标题 -->
            <el-form-item label="标题" prop="orderTitle"  >
                <el-input   v-model="form.orderTitle" placeholder="问题标题，不得超过100字!"></el-input>
            </el-form-item>
            <!-- 产品类型 -->
            <el-form-item label="产品类型" prop="productType"  >
                <el-select v-model="form.productType" value-key="value" placeholder="请选择产品类型">
                    <el-option
                            v-for="item in productTypes"
                            :key="item.value"
                            :label="item.label"
                            :value="item">
                    </el-option>
                </el-select>
            </el-form-item>
            <!-- 故障类型 -->
            <el-form-item label="故障类型" prop="productType"  >
                <el-select v-model="form.faultType" placeholder="请选择故障类型">
                    <el-option
                            v-for="item in form.productType.faultTypes"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <!-- 优先级 -->
            <el-form-item label="优先级"  >
                <el-radio v-model="radio2" :label="3">重要</el-radio>
                <el-radio v-model="radio2" :label="6">一般</el-radio>
                <div class="prioritytip" v-show="radio2 === 3">关键业务受影响，需要紧急协助</div>
                <div class="prioritytip" v-show="radio2 === 6">业务咨询或普通业务受影响，需要协助</div>
            </el-form-item>

            <!-- 描述 -->
            <el-form-item label="问题描述" prop="problemDescribe" >
                <el-input clearable type="textarea" v-model="form.problemDescribe" placeholder="问题描述，不得超过100字，若提交密码或AccessKeys等信息，请通过“机密信息”方式添加，并在问题处理完毕后及时修改"></el-input>
            </el-form-item>
            <!-- 补充说明 -->
            <el-form-item label="补充说明" prop="extraDesc" >
                <el-input type="textarea" v-model="form.extraDesc" resize="none" rows="5"
                          placeholder="补充说明，不得超过100字，若为弹性云服务器相关问题，请补充说明IP端口、网站地址、web目录等；若为RDS相关问题，请补充说明账号等，并尽快提交充分信息便于排查">
                </el-input>
            </el-form-item>
            <!-- 实例 -->
            <el-form-item label="实例" prop="id" >
                <el-input clearable  v-model="form.id" ></el-input>
            </el-form-item>
            <!-- 机密信息 -->
            <el-form-item label="机密信息" prop="orderDesc" >
                <el-input type="textarea" v-model="form.orderDesc" resize="none" rows="5"
                          placeholder="请在此处填写实例名、账号、密码等机密信息，提交后，机密信息将做加密处理">
                </el-input>
            </el-form-item>
            <!-- 联系方式 -->
            <el-form-item label="联系方式" prop="phone"  >
                <el-input clearable v-model="form.phone"></el-input>
            </el-form-item>

            <!-- 邮箱 -->
            <el-form-item label="邮箱" prop="email"  >
                <el-input clearable v-model="form.email"></el-input>
            </el-form-item>
            <!-- 附件 -->
            <el-form-item label="附件"  >
                <el-upload
                        class="upload-demo"
                        action="http://10.11.3.99:7100/fileProcess/upload"
                        :on-change="change"
                        :limit="5"
                        :on-exceed="handleExceed"
                        list-type="picture"
                        :file-list="fileList">
                    <el-button size="small" type="primary">点击上传</el-button>
                    <div slot="tip" class="el-upload__tip" style="word-break: break-all">可上传 5个，附件每个附件大小不得超过8M。附件支持的格式有：'jpg','jpeg','bmp','png','gif','txt','rar','zip','doc','docx','ini','conf','eml','xlsx','xls','pdf'</div>
                </el-upload>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button type="info" class="font12" size="small" @click="isShow = false">取 消</el-button>
            <el-button type="primary" class="font12" size="small" @click="submitForm" :loading="confirmBtn">确 定</el-button>
        </span>
    </el-dialog>
</template>
<script>
import { mapState } from 'vuex';
import {createOrder} from '@/service/order.js';
export default {
    data() {
        let validateEmail = function(rule, value, callback){
            let reg = /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/;
            if (!reg.test(value)) {
                callback(new Error('请输入正确的邮箱格式'));
            } else {
                callback();
            }
        };
        let validatePhone = function(rule, value, callback){
            let reg = /^1[3|5|7|8|]\d{9}$/;
            if (!reg.test(value)) {
                callback(new Error('请输入正确的手机号码格式'));
            } else {
                callback();
            }
        };
        let productTypes = [
            {value: '1', label: '弹性云主机',
                faultTypes: [
                    {value: 10, label: '远程连接'},
                    {value: 11, label: '镜像'},
                    {value: 12, label: '安全组配置'},
                    {value: 13, label: '升降配'},
                    {value: 14, label: '磁盘扩容'},
                    {value: 15, label: '挂载磁盘'},
                ]
            },
            {value: '3', label: '对象存储OSS',
                faultTypes: [
                    {value: 30, label: '文件上传/下载'},
                    {value: 31, label: '读写限制'},
                    {value: 32, label: 'SDK/API'},
                    {value: 33, label: '图片处理服务'},
                    {value: 34, label: '域名/监控'},
                    {value: 35, label: '静态页面'},
                    {value: 36, label: '防盗链'},
                    {value: 37, label: '镜像回源'},
                ]
            },
            {value: '6', label: '专有网络VPC',
                faultTypes: [
                    {value: 60, label: 'VPC使用场景'},
                    {value: 61, label: 'VPC配置'},
                    {value: 62, label: '对等连接'},
                    {value: 63, label: '虚拟防火墙'},
                ]
            },
        ];
        return{
            isShow: false,
            resolve: null,
            reject: null,
            productTypes,
            confirmBtn: false,
            brunch:{},
            item:{},
            fileList: [],
            fileListArr: [],
            domainName:'',
            form:{
                orderTitle: '', //工单标题
                productType: '', //产品类型
                faultType: '', //缺陷类型
                problemDescribe: '', //问题描述
                id: '', //实例id
                extraDesc: '', //补充描述
                orderDesc: '', //工单描述
                phone: '',
                email: '',
                orderAttach:'', //附件文件
            },
            radio2: 3,
            rules:{
                'orderTitle':[
                    { required: true,message: '必填项',trigger: ['blur']}
                ],
                'problemDescribe':[
                    { required: true,message: '必填项',trigger: ['blur']}
                ],
                'phone':[
                    { required: true,message: '必填项',trigger: ['blur']},
                    { validator: validatePhone, trigger: 'blur' }
                ],
                'email':[
                    { required: true,message: '必填项',trigger: ['blur']},
                    { validator: validateEmail, trigger: 'blur' }
                ],
                productType: [
                    { required: true, message: '请选择产品类型', trigger: 'change' }
                ],
                faultType: [
                    { required: true, message: '请选择故障类型', trigger: 'change' }
                ],

            }
        };
    },
    computed:{
        ...mapState({
            user: state => state.user.userInfo,
        }),
    },
    props: {},
    methods: {
        show() {
            this.isShow = true;
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
        change(file,filelist){
            this.fileListArr = filelist;
        },
        handleExceed(files, fileList) {
            this.$alert(`当前限制选择 5 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
        },
        //保存（提交）
        submitForm() {
            this.confirmBtn = true;
            this.$refs.form.validate((valid) => {
                if (valid) {
                    let arr = [];
                    if(this.fileListArr.length > 0){
                        for(let i = 0;i < this.fileListArr.length ; i++){
                            arr.push(this.fileListArr[i].response.data[0]);
                        }
                    }

                    this.form.orderAttach = arr || [];
                    createOrder(this.form).then(ret => {
                        if(ret.data.code === '0000'){
                            this.confirmBtn = false;
                            this.hide();
                            this.setting();
                            this.$alert('操作成功','提示');
                            return;
                        }else{
                            this.$alert('操作失败', '提示', {
                                type: 'error'
                            });
                            this.confirmBtn = false;
                        }

                    });
                } else {
                    this.confirmBtn = false;
                    console.log('error submit!!');
                    return false;
                }
            });

        },

    },
    mounted(){

    }
};
</script>
<style lang="scss">
  .upload-demo input[type='file']{
      display: none;
  };
  .prioritytip {
      font-size: 12px;
      color: #333;
      padding: 10px 20px;
      border: 1px solid #8DACEB;
      background-color: #edf2fc;
      line-height: 1;
  }
</style>
