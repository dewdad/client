<template>
    <el-dialog
        title="更换系统磁盘"
        :visible.sync="isShow"
        width="45%"
        class="RepSysDiskOptionDialog">
 
        <div class="mt20">
            <el-row>
                <el-col :span="4">
                    <span class="font16">镜像</span>
                </el-col>
                <!-- 选项 -->
                <el-col :span="18">
                    <el-button type="primary" size="small">公共镜像</el-button>
                    <div class="mt20 mb50">
                        <el-row>
                            <el-col :span="10">
                                <el-select class="selSysType" v-model="intranet" size="small" placeholder="请选择系统类别">
                                    <el-option
                                    v-for="item in intranetData"
                                    :key="item.intranet"
                                    :label="item.label"
                                    :value="item.intranet">
                                    </el-option>
                                </el-select>
                            </el-col>
                            <el-col :span="12">
                                <el-select class="selOption" v-model="intranet" size="small" placeholder="请选择版本">
                                    <el-option
                                    v-for="item in intranetData"
                                    :key="item.intranet"
                                    :label="item.label"
                                    :value="item.intranet">
                                    </el-option>
                                </el-select>
                            </el-col>
                        </el-row>
                    </div>
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
let intranetData = [
    {
        intranet: '1',
        label: '黄金糕'
    }, {
        intranet: '2',
        label: '双皮奶'
    }];
export default {
    data() {
        return {
            isShow: false,
            resolve: null,
            reject: null,
            intranetData,
            intranet: ''
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
.RepSysDiskOptionDialog{
    .selSysType{
        width: 95%;
    }
    .selOption{
        width: 100%;
    }
}
</style>
