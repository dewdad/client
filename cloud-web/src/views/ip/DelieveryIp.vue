<template>
    <div>
        <el-dialog title="释放弹性公网IP" :visible="true" @close="cancel">
            <div class="createBody text-center">
                弹性公网IP释放后无法恢复，你确定要释放弹性公网IP：{{ipadd}}吗
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="confirm" :loading="isSubmit" size="small">确定</el-button>
                <el-button type="info" @click="cancel" size="small">取消</el-button>
            </div>
        </el-dialog>
        <mobile-code-dialog ref="mobileCodeDialog" :code-type="KEY_AUTH_CODE_FLAG"></mobile-code-dialog>
    </div>
</template>
<script>
import {KEY_AUTH_CODE_FLAG} from '@/constants/const';
import MobileCodeDialog from '@/components/dialog/MobileCodeDialog';
import {mapGetters} from 'vuex';
import { deleteFloatIp } from '@/service/ecs/floating';
export default {
    name: 'delieveryIp',
    data() {
        return {
            isSubmit: false,
            reject: null,
            resolve: null,
            KEY_AUTH_CODE_FLAG
        };
    },
    props: {
        id: {
            type: String,
            default: ''
        },
        ipadd: {
            type: String,
            default: ''
        }
    },
    components: {
        MobileCodeDialog
    },
    computed: {
        ...mapGetters(['token','userInfo'])
    },
    methods: {
        show() {
            // this.isShow = true;
            return new Promise((resolve, reject) => {
                this.reject = reject;
                this.resolve = resolve;
            });
        },
        close() {
            // 关闭对话框时执行组件的v-model事件
            this.$emit('input', false);
        },
        cancel() {
            this.close();
        },
        showMobileDialog() {
            this.$refs.mobileCodeDialog.show().then(res => {
                this.DelieveryIp();
            });
        },
        DelieveryIp() {
            console.log('删除IP',this.userInfo.uid);
            this.isSubmit = true;
            deleteFloatIp({id:this.id})
                .then(res => {
                    // todo...
                    console.log('res',res);
                    if(res.code === this.CODE.SUCCESS_CODE)
                    {
                        this.isSubmit = false;
                        this.$message({
                            type: 'success',
                            message: '操作成功!'
                        });
                    }
                    // 刷新列表数据
                    this.$parent.getList();
                    this.close();
                })
                .catch(err => {
                    this.isSubmit = false;
                    console.log(err);
                });
        },
        confirm() {
            this.showMobileDialog();
        }
    }
};
</script>
<style scoped>
.createBody {
    padding: 10px;
}
</style>
