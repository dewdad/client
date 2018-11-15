<template>
    <div style="width: 100%;position:relative;">
        <!-- <div class="mb10">
            <el-radio-group v-model="platform" size="small">
                <el-radio-button v-for="plat in PLAT_FORM" :key="plat.text" :label="plat.value" :disabled="plat.disabled">{{plat.text}}</el-radio-button>
            </el-radio-group>
        </div> -->
        <div class="mb10">
            <el-radio-group v-model="flavor_type" size="small">
                <el-radio-button v-for="flavor in FLAVOR_TYPE" :key="flavor.value" :label="flavor.label">{{flavor.label}}</el-radio-button>
            </el-radio-group>
        </div>
        <el-table ref="singleTable" max-height="358" :loading="loading" class="data-list" :data="tableDataList" highlight-current-row @current-change="handleCurrentChange" style="width: 100%;">
            <el-table-column prop="id" label="" width="50" class-name="raido-column">
                <template slot-scope="scope">
                    <el-radio v-model="currentFlavor" :label="scope.row"></el-radio>
                </template>
            </el-table-column>
            <el-table-column prop="types" :label="$t('common.flavor')" >
                <template slot-scope="scope">
                    {{scope.row.types}}
                    <!-- <el-popover placement="top" :title="tipsContent[flavor_type].title" :content="tipsContent[flavor_type].content" popper-class="el-popover--custom" width="318" trigger="hover">
                        <span class="tips-help ml20" slot="reference">
                            <zt-icon icon="icon-iconfontwenhao1 font16"></zt-icon>
                        </span>
                    </el-popover> -->
                </template>
            </el-table-column>
            <el-table-column prop="name" :label="$t('common.instSpec')" >
            </el-table-column>
            <el-table-column prop="vCPU" :label="$t('abbr.vcpu')">
                <template slot-scope="scope">
                    {{scope.row.vCpu}} {{$t('abbr.vcpu')}}
                </template>
            </el-table-column>
            <el-table-column prop="ram" :label="$t('common.memory')" >
                <template slot-scope="scope">
                    {{parseInt(scope.row.ram/1024)}} GiB
                </template>
            </el-table-column>
            <!-- <el-table-column prop="cpuType" :label="$t('common.cpuType')" min-width="180px">
            </el-table-column>
            <el-table-column prop="cpuSpeed" :label="$t('common.cpuSpeed')" width="120px">
                <template slot-scope="scope">
                    {{scope.row.cpuSpeed}}
                </template>
            </el-table-column> -->
            <!-- <el-table-column prop="band" :label="$t('common.wapNet')" width="80">
                <template slot-scope="scope">
                    {{scope.row.band || '8'}} Gbps
                </template>
            </el-table-column>
            <el-table-column prop="price" :label="$t('ecs.create.priceColumn')" width="140px">
                <template slot-scope="scope">
                    -{{$t('common.priceUnit')}}
                </template>
            </el-table-column> -->
        </el-table>
        <div v-if="currentFlavor.id" class="mt15 font12">
            <span class="color666">当前实例：</span>{{get(currentFlavor, 'types')}}，{{get(currentFlavor, 'vCpu')}} {{$t('abbr.vcpu')}} &nbsp;&nbsp;{{parseInt(get(currentFlavor, 'ram')/1024)}} {{$t('abbr.gb')}}内存</div>
    </div>
</template>
<script>
import {getInstFlavor} from '@/service/ecs/list';
import {PLAT_FORM, FLAVOR_TYPE} from '@/constants/dicts/ecs';
const tipsContent = {
    generalType: {
        title: 'CPU / 内存比为 1:4',
        content: '用于中小型数据库、需要一定内存的数据处理、缓存集群和其他企业应用程序的后端服务器场景'
    },
    largeCpuType: {
        title: 'CPU / 内存比为 1:2',
        content: '为重计算负载型应用场景设计，可适用于批量计算，Web 前端服务器，数据分析，游戏服务等场景'
    },
    largeMemoryType: {
        title: 'CPU / 内存比为 1:8',
        content: '为重内存负载型应用场景设计，可广泛适用于高性能数据库、数据分析与挖掘、内存数据库、分布式内存缓存、Hadoop、Spark群集以及其他企业大内存需求应用'
    }
};
export default {
    name: 'FlavorTable',
    data() {
        return {
            PLAT_FORM,
            FLAVOR_TYPE,
            loading: false,
            platform: PLAT_FORM[0].value,
            flavor_type: FLAVOR_TYPE[0].label,
            tableData: [],
            currentFlavor: {},
            tipsContent
        };
    },
    props: {
        value: Object,
        filterId: {
            type: String,
            default: ''
        }
    },
    watch: {
        flavor_type: function(newval) {
            this.currentFlavor = this.tableDataList.length ? this.tableDataList[0] : {};
        },
        currentFlavor: function(newval) {
            this.$emit('input', newval);
        },
        loading: function(newval) {
            this.$emit('loading', newval);
        },
        tableDataList: function() {
            this.currentFlavor = this.tableDataList.length ? this.tableDataList[0] : {};
        }
    },
    computed: {
        tableDataList: function() {
            return this.tableData.filter(item => {
                return item.types === this.flavor_type;
            });
        }
    },
    created() {
        this.getInstFlavor();
        // this.currentFlavor = this.tableData[0];
    },
    methods: {
        handleCurrentChange(val) {
            this.currentFlavor = val;
        },
        getInstFlavor() {
            this.loading = true;
            this.tableData = [];
            getInstFlavor()
                .then(res => {
                    if (res.code === this.CODE.SUCCESS_CODE) {
                        this.tableData = res.data.data || [];
                    }
                })
                .catch(err => {
                    $log(err);
                })
                .finally(() => {
                    this.loading = false;
                });
        }
    }
};
</script>
<style scoped lang="scss">
.el-radio-group .el-radio-button {
    margin-right: 5px;
}
.tips-help {
    display: inline-block;
    height: 14px;
    & > span {
        display: none;
    }
}
.el-table__row {
    &:hover {
        .tips-help {
            & > span {
                display: inline;
            }
        }
    }
}
</style>
