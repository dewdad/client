<template>
    <el-card class="box-card create-form-item create-form-item__name" shadow="hover">
        <div class="create-form-item__label">
            <label>
                <zt-icon icon="icon-ic_create_name"></zt-icon>
                主实例信息
            </label>
        </div>
        <div class="create-form-item__content"  style="margin-top: -12px;">
            <div class="border"  style="padding: 0px 20px; ">
                <el-row :gutter="20">
                    <el-col :span="12">
                        <zt-col-item title="实例ID/名称：">{{get(instance, 'id')}}/{{get(instance, 'name')}}</zt-col-item>
                    </el-col>
                    <el-col :span="12">
                        <zt-col-item title="可用区：">{{get(instance, 'availabilityZone')|zone}}</zt-col-item>
                    </el-col>
                    <el-col :span="12">
                        <zt-col-item title="系列：">{{get(instance ,'ha') ? "高可用" : "单机"}}</zt-col-item>
                    </el-col>
                    <el-col :span="12">
                        <zt-col-item title="数据库引擎：">{{get(instance, 'dataStoreInfo.type')}}</zt-col-item>
                    </el-col>
                    <el-col :span="12">
                        <zt-col-item title="版本：">{{get(instance, 'dataStoreInfo.version')}}</zt-col-item>
                    </el-col>
                    <el-col :span="12">
                        <zt-col-item title="CPU/内存："><template v-if="flavorInfo">{{get(flavorInfo, 'cpu')}} 核 {{get(flavorInfo, 'mem')}} GiB</template></zt-col-item>
                    </el-col>
                    <el-col :span="12">
                        <zt-col-item title="存储空间：">{{get(instance, 'volume.type')|volume}} {{get(instance,'volume.size')}} GiB</zt-col-item>
                    </el-col>
                </el-row>
            </div>

        </div>
    </el-card>
</template>
<script>
import {mapState} from 'vuex';
import {getRdsFlavorInfo, isEmpty} from '@/utils/utils';
export default {
    data() {
        return {};
    },
    computed: {
        ...mapState({
            instance: state => state.rds.instance,
            dataStoreType: state => state.rds.dataStoreType
        }),
        flavorInfo: function() {
            if (!isEmpty(this.dataStoreType) && !isEmpty(this.instance)) {
                return getRdsFlavorInfo(this.dataStoreType, this.instance.dataStoreInfo.type,this.instance.dataStoreInfo.version, this.instance.flavor.id);
            } else {
                return false;
            }
        }
    },
    created() {
    }
};
</script>
<style lang="scss">
.label {
    display: inline-block;
    text-align: left;
    color: #999;
    width: 120px;
}
</style>
