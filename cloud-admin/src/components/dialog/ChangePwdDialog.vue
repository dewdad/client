<template>
    <el-dialog title="修改密码" :visible.sync="isShow" width="700px" class="SetDiskDialog" v-dialogDrag>        
        <span slot="footer" class="dialog-footer">
            <el-button type="primary" class="font12" >确 定</el-button>
            <el-button type="info" class="font12" @click="isShow = false">取 消</el-button>
        </span>
    </el-dialog>
</template>
<script>

export default {
    data() {
        return{
            isShow: false,
        };
    },
    props: {},
    methods: {
        show() {
            this.isShow = true;

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



    }
};
</script>
<style lang="scss">
.SetDiskDialog {
    padding: 0 40px;
    .setDisk {
        display: flex;
        .set {
            flex: 1;
            .head {
                display: flex;
                width: 100%;
                line-height: 32px;
                .left {
                    flex: 1;
                }
                .right {
                    flex: 2;
                    text-align: right;
                }
                .el-select {
                    width: 100px;
                }
                .noSetInput {
                    width: 200px;
                }
            }
        }
        .notSet {
            border-right: 1px solid #e2e2e2;
            padding-right: 20px;
        }
        .alreadySet {
            padding-left: 20px;
        }
    }
}
</style>
