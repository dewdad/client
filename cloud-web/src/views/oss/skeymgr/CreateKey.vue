<template>
    <div>
        <el-dialog title="创建秘钥" :visible="true" @close="cancel">
            <div class="createBody text-left">
                <div class="img-text-center">
                    <i class="iconfont icon-chenggong color-success" style="font-size: 30px;"></i> 请阅读并同意
                    <a href="#">《API使用规范》</a>
                </div>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="confirm" :loading="isSubmit" size="small">同意并创建</el-button>
                <el-button type="info" @click="cancel" size="small">取消</el-button>
            </div>
        </el-dialog>
        <mobile-code-dialog ref="mobileCodeDialog" :code-type="KEY_AUTH_CODE_FLAG"></mobile-code-dialog>
    </div>
</template>
<script>
import {createKey} from '@/service/oss/accessKey';
import {KEY_AUTH_CODE_FLAG} from '@/constants/const';
import MobileCodeDialog from '@/components/dialog/MobileCodeDialog';
import {mapState} from 'vuex';
export default {
    name: 'CreateKey',
    data() {
        return {
            isSubmit: false,
            reject: null,
            resolve: null,
            KEY_AUTH_CODE_FLAG
        };
    },
    components: {
        MobileCodeDialog
    },
    computed: {
        ...mapState({
            showPwdFlag: state => state.oss.showPwdFlag
        })
    },
    methods: {
        show() {
            this.isShow = true;
            return new Promise((resolve, reject) => {
                this.reject = reject;
                this.resolve = resolve;
            });
        },
        close() {
            // 关闭对话框时执行组件的v-model事件
            // this.isShow = false;
            this.$emit('input', false);
        },
        cancel() {
            this.close();
        },
        showMobileDialog() {
            // 验证是否获已验证过 如果没有先弹出获取检验码对话框
            if (this.showPwdFlag === 0) {
                this.$refs.mobileCodeDialog.show().then(res => {
                    // 设置手机验证标识true
                    this.$store.commit('oss/SET_SHOW_PWD_FLAG', 1);
                    this.createKey();
                });
            } else {
                // 如果有直接创建
                this.createKey();
            }
            // return createKey().then(res => {
            //     if (res.code === this.CODE.SUCCESS_CODE) {
            //         this.$message.success('秘钥创建成功');
            //     }
            // });
        },
        createKey() {
            this.isSubmit = true;
            createKey()
                .then(res => {
                    // todo...
                    this.isSubmit = false;
                    this.$message({
                        type: 'success',
                        message: '秘钥创建成功!'
                    });
                    // 刷新列表数据
                    this.$parent.getData();
                    this.close();
                })
                .catch(err => {
                    this.isSubmit = false;
                    console.log(err);
                    // this.$alert('秘钥创建成功', '提示', {type: 'error'});
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
