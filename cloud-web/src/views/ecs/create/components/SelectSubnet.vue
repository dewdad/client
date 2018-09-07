<template>
    <zt-form ref="subNetForm" :inline="true" :show-message="false" inline-message size="small" :model="form" :rules="rules" label-width="0">
        <zt-form-item label="" id="netWork" class="mb10 hide-star" prop="netWork">
            <el-select v-model="form.netWork" key="newWork" :placeholder="$t('form.input.network')" :popper-append-to-body="false" value-key="name" size="small" class="mr10">
                <el-option v-for="net in netWorkList" :key="net.id" :label="net.name" :value="net">
                </el-option>
            </el-select>
            <i class="el-icon-refresh" v-tooltip="{content: $t('common.clickRefresh'), theme: 'is-light'}" @click="getNetwork"></i>
        </zt-form-item>
        <!-- <zt-form-item label="" id="subNet" class="mb10 hide-star" prop="subNet">
            <el-select v-model="form.subNet" ref="subNet" key="subnet" :placeholder="$t('form.input.subnet')" :popper-append-to-body="false" value-key="name" size="small" class="mr10">
                <el-option v-for="sub in subNetList" :key="sub.name"  :label="sub.name" :value="sub">
                </el-option>
            </el-select>
            <i class="el-icon-refresh" v-tooltip="{content: $t('common.clickRefresh'), theme: 'is-light'}" @click="getSubnetByNetId('')"></i>
        </zt-form-item> -->

    </zt-form>
</template>
<script>
import {getNetwork, getSubnetByNetId} from '@/service/ecs/network';
import {isEmpty} from '@/utils/utils';
export default {
    name: 'SlectSubnet',
    data() {
        return {
            netWorkList: [],
            subNetList: [],
            loading: false,
            form: {
                netWork: '',
                subNet: ''
            },
            rules: {
                netWork: [
                    {
                        required: true,
                        message: $t('form.input.network'),
                        trigger: ['submit', 'change']
                    }
                ],
                subNet: [
                    {
                        required: true,
                        message: $t('form.input.subnet'),
                        trigger: ['submit', 'change']
                    }
                ]
            }
        };
    },
    props: {
        value: Object
    },
    watch: {
        loading: function(newval) {
            this.$emit('loading', newval);
        },
        form: {
            deep: true,
            handler: function(newval) {
                this.setValue();
                this.$nextTick(() => {
                    this.$refs.subNetForm.clearValidate();
                });
            }
        }
    },
    created() {
        this.getNetwork();
    },
    methods: {
        getNetwork() {
            this.loading = true;
            this.subNetList = [];
            this.form.subNet = '';
            getNetwork().then(res => {
                if (res.code === this.CODE.SUCCESS_CODE) {
                    this.netWorkList = res.data;
                    if (!isEmpty(this.netWorkList)) {
                        this.form.netWork = this.netWorkList[0];
                        // this.getSubnetByNetId(this.form.netWork.id);
                    } else {
                        this.loading = false;
                    }
                }
            }).finally(() => {
                this.loading = false;
            });
        },
        getSubnetByNetId(netWorkId) {
            let id = netWorkId || this.form.netWork.id;
            if (typeof id === undefined) return;
            this.loading = true;
            getSubnetByNetId(id)
                .then(res => {
                    if (res.code === this.CODE.SUCCESS_CODE) {
                        this.subNetList = res.result.records;
                        $log('subnetlist', this.subNetList);
                        if (!isEmpty(this.subNetList)) this.form.subNet = this.subNetList[0];
                    }
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        netWorkHandleChange(value) {
            this.form.subNet = '';
            this.$refs.subNetForm.clearValidate();
            if (value) {
                this.form.netWork = value;
                this.getSubnetByNetId(value.id);
            }
        },
        setValue() {
            let obj = {
                netWork: this.form.netWork,
                subNet: this.form.subNet
            };
            this.$emit('input', obj);
        },
        getScrollWidth(id) {
            this.$nextTick(() => {
                let width = document.querySelector('#' + id).scrollWidth;
                alert(width);
                return width;
            });
        }
    }
};
</script>
<style scoped>
.el-select {
    width: 170px !important;
}
.el-form--inline .el-form-item {
    margin-right: 15px;
}
</style>
