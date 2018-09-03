<template>
    <el-dialog title="修改密码" :visible.sync="isShow" width="700px" class="SetDiskDialog" v-dialogDrag>
        <!--<zt-form size="small">-->
            <!--<zt-form-item label="资产选择" :label-width="formLabelWidth">-->
                <!--<el-select v-model="server_id" placeholder="" multiple collapse-tags>-->
                    <!--&lt;!&ndash; <el-option label="172.16.0.251" value="172.16.0.251"></el-option> &ndash;&gt;-->
                    <!--<el-option v-for="item in assetList.data" :label="item.ip" :value="item.mac_address" :key="item.mac_address"></el-option>-->
                <!--</el-select>-->
            <!--</zt-form-item>-->
            <!--<zt-form-item label="扫描漏洞等级范围" :label-width="formLabelWidth">-->
                <!--严重度：-->
                <!--<el-checkbox-group v-model="leak_level" class="inline-block">-->
                    <!--<el-checkbox v-for="item in levelList" :disabled="item.value > 2" :label="item.value" :key="item.value">{{item.label}}</el-checkbox>-->
                <!--</el-checkbox-group>-->
            <!--</zt-form-item>-->
            <!--<zt-form-item label="失效漏洞自动删除" :label-width="formLabelWidth">-->
                <!--<el-select v-model="day" placeholder="请选择活动区域">-->
                    <!--<el-option label="7天" value="7"></el-option>-->
                    <!--<el-option label="30天" value="30"></el-option>-->
                <!--</el-select>-->
            <!--</zt-form-item>-->
        <!--</zt-form>-->
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
