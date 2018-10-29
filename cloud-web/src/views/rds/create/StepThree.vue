<template>
    <div class="create-form">
        <!-- 所选配置 start -->
        <el-card  class="box-card create-form-item create-form-item__name" shadow="hover">
            <div class="create-form-item__label">
                <label>
                    <zt-icon icon="icon-head_console_people"></zt-icon>
                    {{$t('ecs.create.selectConfig')}}
                </label>
            </div>
            <div class="create-form-item__content">
                <div class="config-item">
                    <div>{{$t('ecs.create.basicConfig')}}
                        <zt-icon icon="color-primary font12 icon-edit_people1 ml5" @click.native="changStep(0)"></zt-icon>
                    </div>
                </div>
                <el-row class="mt5">
                    <el-col :span="12">
                        <span>云数据库名称：</span>{{get(createRdsFormData,'instance.instname')}}</el-col>
                    <el-col :span="12">
                        <span>可用区：</span>{{zone|zone}}</el-col>
                    <el-col :span="12">
                        <span>数据库引擎：</span></el-col>
                    <el-col :span="12">
                        <span>版本：</span></el-col>
                    <el-col :span="12">
                        <span>系列：</span></el-col>
                    <el-col :span="12">
                        <span>CPU：</span></el-col>
                    <el-col :span="24">
                        <span>存储空间：</span></el-col>
                    <el-col :span="24">
                        <span>描述：</span></el-col>
                </el-row>
                <div class="config-item mt10">
                    <div>{{$t('ecs.create.netAndSafe')}}
                        <zt-icon icon="color-primary font12 icon-edit_people1 ml5" @click.native="changStep(1)"></zt-icon>
                    </div>
                </div>
                <el-row class="mt5">
                    <el-col :span="12">
                        <span>私有网络：</span>net-m5ev5xnotzcyqbv/私有网咯-55631245245</el-col>
                    <el-col :span="12">
                        <span>子网：</span>net-m5ev5xnotzcyqbv/私有网咯-55631245245</el-col>
                    <el-col :span="12">
                        <span>子网网段：</span>net-m5ev5xnotzcyqbv/私有网咯-55631245245</el-col>
                    <el-col :span="12">
                        <span>访问端口：</span>net-m5ev5xnotzcyqbv/私有网咯-55631245245</el-col>
                </el-row>
            </div>
        </el-card>
        <!-- 所选配置 end -->
    </div>
</template>
<script>
import {mapState} from 'vuex';
export default {
    name: 'StepThree',
    data() {
        return {
            argee: false,
            created: false,
            isError: false
        };
    },
    props: {
        active: {
            type: Number,
            default: 0
        }
    },
    watch: {
        active: function(newval) {
            if (newval === 2) {
                this.created = true;
            }
        }
    },
    computed: {
        ...mapState({
            createRdsFormData: state => state.createRdsFormData
        }),
        ports() {
            return '';
        },
        zone: function() {
            let string = this.createRdsFormData.netWorkInfo.subNet && this.createRdsFormData.netWorkInfo.subNet.name;
            let zone = this.$options.filters.zone(string);
            return zone;
        }
    },
    methods: {
        changStep(active) {
            this.$parent.active = active;
        }
    }
};
</script>
<style scoped  lang="scss">
.el-col {
    font-size: 12px;
    line-height: 22px;
    span {
        color: #999;
    }
}
.el-form-item .el-form-item__content {
    line-height: 1;
}
</style>
