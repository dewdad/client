<template>
    <el-dialog
        title="更换系统磁盘"
        :visible.sync="isShow"
        width="45%"
        class="RepSysDiskDialog">
        <!-- tip提示 -->
        <div class="tip font14">
            <ul>
                <li>ECS实例更换系统盘后，磁盘ID会变更，原系统盘会被释放。</li>
            </ul>
        </div>
        <!-- 注意事项 -->
        <div class="careful mt30">
            <el-row>
                <el-col :span="4">
                    <span class="ml20">请注意:</span>
                </el-col>
                <el-col :span="18">
                    <ul>
                        <li>
                            原系统盘的快照会随系统盘释放。
                        </li>
                        <li>
                            您在操作前做好相关备份，以免数据丢失给您造成损失。
                        </li>
                    </ul>
                </el-col>
            </el-row>
        </div>
        <span slot="footer" class="dialog-footer">
            <el-button type="primary" class="font12" @click="isShow = false">确认更换</el-button>
            <el-button type="info" class="font12" @click="isShow = false">取 消</el-button>
        </span>
    </el-dialog>
</template>
<script>
export default {
    data() {
        return {
            isShow: false,
            resolve: null,
            reject: null
        };
    },
    props:{

    },
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
                    typeof this.resolve(this.form) === 'function' &&
                        this.resolve(this.form);
                }, 1000);
            });
        },
        confirm() {
            this.hide();
            this.setting();
        }
    }
};
</script>
<style lang="scss">
.RepSysDiskDialog{
    .tip{
        background-color: #FBF7CF;
        padding: 15px 30px;
        color: #F68300;
        border: 1px solid #F6E0C4;
    }
    .careful{
        ul li{
            list-style-type:decimal;
        }
    }
}
</style>
