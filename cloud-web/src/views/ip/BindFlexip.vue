<template>
    <div class='bindflexip'>
        <el-dialog title="绑定弹性公网IP" :visible="true" @close="cancel">
            <div class="createBody text-center">
                <zt-form label-width="120px">
                    <zt-form-item label="IP地址">
                        <el-input v-model="id" :disabled="true"></el-input>
                    </zt-form-item>
                    <zt-form-item label="实例类型" prop="sl">
                        <el-select v-model="sl" placeholder="请选择活动区域">
                            <el-option v-for="item in sloptions" :key="item.value" :label="item.label" :value="item.value">
                            </el-option>
                        </el-select>
                    </zt-form-item>
                    <zt-form-item :label="sl"  prop="sltype">
                        <el-select  v-model="selectSl" placeholder="请选择活动区域">
                            <el-option v-for="item in options" :key="item.instanceId" :label="item.instanceName" :value="item.portId">
                            </el-option>
                        </el-select>
                    </zt-form-item>
                </zt-form>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="bindIp" :loading="isSubmit" size="small">确定</el-button>
                <el-button type="info" @click="cancel" size="small">取消</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import { KEY_AUTH_CODE_FLAG } from '@/constants/const';
import { mapGetters } from 'vuex';
import { updateFloatingIp } from '@/service/ecs/floating';
import { getAllPortList } from '@/service/ecs/list';
export default {
    name: 'delieveryIp',
    data() {
        return {
            isSubmit: false,
            reject: null,
            resolve: null,
            KEY_AUTH_CODE_FLAG,
            sl: 'ECS实例',
            sloptions: [
                {
                    value: 'ECS实例',
                    label: 'ECS实例'
                },
                {
                    value: 'RDS实例',
                    label: 'RDS实例'
                },
                {
                    value: '负载均衡实例',
                    label: '负载均衡实例'
                }
            ],
            options:[],
            selectSl:''
        };
    },
    props: {
        id: {
            type: String,
            default: ''
        }
    },
    components: {},
    computed: {
        ...mapGetters(['token'])
    },
    created() {
        this.getAllPortList();
    },
    methods: {
        getAllPortList() {
            getAllPortList()
                .then(res => {
                    if(res.data.code === this.CODE.SUCCESS_CODE)
                    {
                        this.options = res.data.result;
                    }
                })
                .catch(err => {
                    this.isSubmit = false;
                    console.log(err);
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
        bindIp() {
            console.log('selectSl' + JSON.stringify(this.selectSl));
            let data = {
                type: 'bind',
                port: this.selectSl,
                id: this.id
            };
            this.isSubmit = true;
            updateFloatingIp(data)
                .then(res => {
                    // todo...
                    console.log('res', res);
                    this.isSubmit = false;
                    this.$message({
                        type: 'success',
                        message: '操作成功!'
                    });
                    // 刷新列表数据
                    this.$parent.getList();
                    this.close();
                })
                .catch(err => {
                    this.isSubmit = false;
                    console.log(err);
                });
        }
    }
};
</script>
<style  lang="scss">
.bindflexip {
    .createBody {
        padding: 10px;
        .el-input {
            width: 450px;
        }
    }
    element.style {
        margin-left: 0 !important;
    }
}
</style>
