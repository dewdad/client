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
                <div  class="mb20">
                    <el-radio-group v-model="form.databaseType" size="small">
                        <el-radio-button label="MariaDB" border>MariaDB</el-radio-button>
                        <el-radio-button v-for="(db, type) in dataStoreType" :key="type" :label="type" border></el-radio-button>
                    </el-radio-group>
                </div>
                <div class="mb20">
                    <el-radio-group v-model="form.databaseVersion" size="small">
                        <el-radio-button label="5.6" border>5.6</el-radio-button>
                        <el-radio-button label="5.7" border>5.7</el-radio-button>
                        <el-radio-button v-for="db in dataStoreType[form.databaseType]" v-if="(isRead && db.name === get(instance, 'dataStoreInfo.version')) || !isRead" :key="db.name" :label="db.name" border>{{isRead ? 'MySQL ' + formateVersion(db.name) : formateVersion(db.name)}}</el-radio-button>
                    </el-radio-group>
                </div>
                <div >
                    <el-radio-group v-model="form.ha" size="small">
                        <el-radio-button :label="true" border>高可用</el-radio-button>
                        <el-radio-button :label="false" border>单机版</el-radio-button>
                    </el-radio-group>
                </div>
            </div>
        </el-card>
        <el-card class="box-card create-form-item" shadow="hover"  element-loading-spinner="el-icon-loading">
            <div class="create-form-item__label">
                <label>
                    <zt-icon icon="icon-ic_create_specificat"></zt-icon>
                    配置规格
                </label>
            </div>
            <div class="create-form-item__content">
              <el-select v-model="form.currentFlavor" placeholder="请选择规格" size="small" popper-class="el-popper--small" value-key="id" style="width:300px;" class="mr10">
                <el-option  label="1核 1GiB" >
                </el-option>
            </el-select>
            </div>
        </el-card>
    </div>
</template>
<script>
import {getReadFlavor} from '@/service/rds/datastore';
import {isEmpty} from '@/utils/utils';
import {mapState} from 'vuex';
export default {
    data() {
        return {
            loading: false,
            form: {
                databaseType: 'MariaDB',
                databaseVersion: '5.6',
                ha: true,
                currentFlavor: {},
                applyNumber: 1
            },
            // dataStoreType: {}
            readFlavorList: []
        };
    },
    props: {
        value: Object
    },
    computed: {
        ...mapState({
            instance: state => state.rds.instance,
            dataStoreType: state => state.rds.dataStoreType
        }),
        tableData: function() {
            if (this.isRead) {
                return this.readFlavorList.filter(item => {
                    return item.type === this.flavorType;
                });
            }
            if (!isEmpty(this.dataStoreType)) {
                let obj = this.dataStoreType[this.form.databaseType].find(item => {
                    return item.name === this.form.databaseVersion;
                });
                $log(obj);
                if (obj !== undefined) {
                    return obj.flavorList.filter(item => {
                        return (
                            item.type === this.flavorType &&
                            ((this.form.ha && item.dataStoreType === 'ha') ||
                                (!this.form.ha && item.dataStoreType !== 'ha' && item.dataStoreType !== 'rr') ||
                                (this.isRead && item.dataStoreType === 'rr'))
                        );
                    });
                } else {
                    return [];
                }
            } else {
                return [];
            }
        },
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
        // 类型及版本默认设置选中第一个
        dataStoreType: function(newval) {
            if (!isEmpty(newval)) {
                let keys = Object.keys(newval);
                this.form.databaseType = keys[0];
                this.form.databaseVersion = newval[keys[0]][0].name;
            }
        },
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
        },
        tableData: function(newval) {
            this.$nextTick(function() {
                if (newval.length) this.form.currentFlavor = newval[0];
            });
        }
    },
    created() {
        this.getDataStoreType();
        if (this.isRead) this.getReadFlavor();
    },
    methods: {
        /**
         * 格式化数据库版本号
         */
        formateVersion(str) {
            if (str) {
                let arr = str.split('.');
                arr.pop();
                return arr.join('.');
            }
            return str;
        },
        handleCurrentChange(val) {
            this.form.currentFlavor = val;
        },
        getDataStoreType() {
            // this.loading = true;
            // getDataStoreType()
            //     .then(res => {
            //         this.loading = false;
            //         this.dataStoreType = res;
            //         this.$store.commit('rds/SET_DATASTORE', res);
            //     })
            //     .catch(err => {
            //         this.loading = false;
            //     });
            this.$store.dispatch('rds/GET_DATASTORE');
        },
        getReadFlavor() {
            getReadFlavor().then(res => {
                this.readFlavorList = res.result.result;
            });
        }
    }
};
</script>
<style scoped>
</style>
