<template>
<el-dialog class="setting-dialog" title="漏洞管理设置" :visible.sync="isShow">
    <zt-form size="small">
        <zt-form-item label="资产选择" :label-width="formLabelWidth">
            <el-select v-model="server_id" placeholder="" multiple collapse-tags>
                <!-- <el-option label="172.16.0.251" value="172.16.0.251"></el-option> -->
                <el-option v-for="item in assetList.data" :label="item.ip" :value="item.mac_address" :key="item.mac_address"></el-option>
            </el-select>
        </zt-form-item>
        <zt-form-item label="扫描漏洞等级范围" :label-width="formLabelWidth">
            严重度：
            <el-checkbox-group v-model="leak_level" class="inline-block">
                <el-checkbox v-for="item in levelList" :disabled="item.value > 2" :label="item.value" :key="item.value">{{item.label}}</el-checkbox>
            </el-checkbox-group>
        </zt-form-item>
        <zt-form-item label="失效漏洞自动删除" :label-width="formLabelWidth">
            <el-select v-model="day" placeholder="请选择活动区域">
                <el-option label="7天" value="7"></el-option>
                <el-option label="30天" value="30"></el-option>
            </el-select>
        </zt-form-item>
    </zt-form>
    <div slot="footer" class="dialog-footer">
        <el-button @click="cancel" size="small">取 消</el-button>
        <el-button type="primary" @click="confirm" size="small">确 定</el-button>
    </div>
</el-dialog>
</template>

<script>
import {SEVERITYS} from '@/constants/dicts/security.js';
import {leakManageSetLeakConfig} from '@/service/security';
import {mapState} from 'vuex';

export default {
    data() {
        return {
            formLabelWidth: '140px',
            isShow: false,
            levelList: SEVERITYS,
            day: '7',
            server_id: [],
            leak_level: ['3', '4'],
            leak_clean_cycle: '',
            resolve: null,
            reject: null
        };
    },
    computed: {
        ...mapState('security', ['assetList'])
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
            this.day = '7';
            this.server_id = [];
            this.leak_level = ['3', '4'];
            this.isShow = false;
        },
        cancel() {
            this.hide();
            typeof this.reject() === 'function' && this.reject();
        },
        async setting() {
            try {
                let ret = await leakManageSetLeakConfig({
                    server_id: this.server_id,
                    leak_level: this.leak_level,
                    leak_clean_cycle: parseInt(this.day) * 24
                });
                $log('leakManageSetLeakConfig', ret);
                if (ret) {
                    this.resolve(ret);
                }
            } catch (error) {
                console.warn('leakManageSetLeakConfig error', error.message);
            }
        },
        confirm() {
            this.hide();
            this.setting();
        }
    }
};
</script>

<style lang="scss">
.setting-dialog {
    .el-checkbox__label {
        padding-left: 5px;
        font-size: 12px;
    }
    .el-checkbox + .el-checkbox {
        margin-left: 10px;
    }
    .el-form-item--small .el-form-item__label {
        line-height: 41px;
    }
    .el-select--small {
        width: 310px;
    }
    .el-dialog__header {
        padding: 14px 20px;
        border-bottom: 1px solid #dde3ec;
    }
    .el-dialog__footer {
        border-top: 1px solid #dde3ec;
        padding: 14px 20px;
    }
    .el-dialog__headerbtn {
        top: 15px;
    }
}
</style>
