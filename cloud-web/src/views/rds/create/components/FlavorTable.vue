<template>
    <div>
        <el-card class="box-card create-form-item" shadow="hover" v-loading="loading" element-loading-spinner="el-icon-loading">
            <div class="create-form-item__label">
                <label>
                    <zt-icon icon="icon-ic_create_basicconf"></zt-icon>
                    基础配置
                </label>
            </div>
            <div class="create-form-item__content">
                <div class="mb20">
                    <el-radio-group v-model="form.databaseType" size="small">
                        <el-radio-button label="MariaDB" border>MariaDB</el-radio-button>
                        <!-- <el-radio-button v-for="(db, type) in dataStoreType" :key="type" :label="type" border></el-radio-button> -->
                    </el-radio-group>
                </div>
                <div class="mb20">
                    <el-radio-group v-model="form.databaseVersion" size="small">
                        <el-radio-button label="5.6" border>5.6</el-radio-button>
                        <el-radio-button label="5.7" border>5.7</el-radio-button>
                        <!-- <el-radio-button v-for="db in dataStoreType[form.databaseType]" v-if="(isRead && db.name === get(instance, 'dataStoreInfo.version')) || !isRead" :key="db.name" :label="db.name" border>{{isRead ? 'MySQL ' + formateVersion(db.name) : formateVersion(db.name)}}</el-radio-button> -->
                    </el-radio-group>
                </div>
                <div>
                    <el-radio-group v-model="form.ha" size="small">
                        <el-radio-button label="11413e41-164b-48e6-a208-8b9f9b24e77f" border>高可用</el-radio-button>
                        <el-radio-button :label="false" border>单机版</el-radio-button>
                    </el-radio-group>
                </div>
            </div>
        </el-card>
        <el-card class="box-card create-form-item" v-loading="loading" shadow="hover" element-loading-spinner="el-icon-loading">
            <div class="create-form-item__label">
                <label>
                    <zt-icon icon="icon-ic_create_specificat"></zt-icon>
                    配置规格
                </label>
            </div>
            <div class="create-form-item__content">
                 <zt-form ref="flavorForm" :show-message="false" inline-message size="small" :model="form"  label-width="0" style="width:300px;">
                     <zt-form-item id="currentFlavor" label="" class="hide-star mb0" prop="currentFlavor" :rules="{
                        required: true,
                        message: '请选择规格',
                        trigger: ['submit', 'change']
                    }">
                <el-select v-model="form.currentFlavor" placeholder="请选择规格" size="small" popper-class="el-popper--small" value-key="id" style="width:300px;" class="mr10">
                    <el-option v-for="item in flavorList"  :key="item.id" :label="item.name" :value="item">
                    </el-option>
                </el-select>
                </zt-form-item>
                </zt-form>
            </div>
        </el-card>
    </div>
</template>
<script>
// import {getReadFlavor} from '@/service/rds/datastore';
import {getInstFlavor} from '@/service/ecs/list';
import {isEmpty} from '@/utils/utils';
export default {
    data() {
        return {
            loading: false,
            form: {
                databaseType: 'MariaDB',
                databaseVersion: '5.7',
                ha: '11413e41-164b-48e6-a208-8b9f9b24e77f',
                currentFlavor: '',
                applyNumber: 1
            },
            // dataStoreType: {}
            flavorList: []
        };
    },
    props: {
        value: Object
    },
    computed: {
        isRead: function() {
            let route = this.$route;
            if (route.name === 'app.rds.create.read') {
                return true;
            } else {
                return false;
            }
        }
    },
    watch: {
        form: {
            deep: true,
            handler: function(newval) {
                this.$emit('input', newval);
            }
        },
        instance: {
            deep: true,
            handler: function(newval) {
                if (!isEmpty(newval)) this.form.databaseVersion = this.instance.dataStoreInfo.version;
            }
        }
    },
    created() {
        this.getInstFlavor();
    },
    methods: {
        getInstFlavor() {
            // this.loading = true;
            getInstFlavor({instanceType: 'RDS'})
                .then(res => {
                    this.loading = false;
                    this.flavorList = res.data.data;
                })
                .catch(err => {
                    this.loading = false;
                });
            // this.$store.dispatch('rds/GET_DATASTORE');
        }
    }
};
</script>
<style scoped>
</style>
