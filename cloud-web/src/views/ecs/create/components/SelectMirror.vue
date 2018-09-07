<template>
    <div>
        <div class="mb10">
            <el-radio-group v-model="form.mirrorType" size="small">
                <el-radio-button label="1">{{$t('ecs.image.list.publicImage')}}</el-radio-button>
            </el-radio-group>
            <el-popover placement="top" title="" width="340" trigger="hover">
                <div>
                    <span class="font14 is-bold">{{$t('ecs.image.list.publicImage')}}</span><br> {{$t('ecs.create.imageTips')}}
                </div>
                <span class="tips-help" slot="reference">
                    <zt-icon icon="icon-iconfontwenhao1"></zt-icon>
                </span>
            </el-popover>
        </div>
        <div>
            <zt-form ref="imageForm" :inline="true" :show-message="false" inline-message size="small" :model="form" :rules="rules" label-width="0">
                <zt-form-item id="osType" label="" class="mb0 hide-star" prop="osType">
                    <el-select v-model="form.osType" :placeholder="$t('form.input.ostype')" size="small" :popper-append-to-body="false" style="width:170px;">
                        <el-option v-for="item in sysTypes" :key="item.pic" :value="item.name" :label="item.name">
                            <zt-icon :icon="item.pic" type="font"></zt-icon> {{item.name}}
                        </el-option>
                    </el-select>
                </zt-form-item>
                <zt-form-item id="imageObj" label="" class="mb0 hide-star" prop="imageObj">
                    <el-select v-model="form.imageObj" :placeholder="$t('form.input.osversion')" size="small" :popper-append-to-body="false" value-key="id" style="width:320px;" no-data-text="暂无镜像">
                        <el-option v-for="item in versions" :key="item.id" :label="item.name" :value="item">
                        </el-option>
                    </el-select>
                    <el-checkbox class="ml10" v-model="form.secure_selected">安全加固</el-checkbox>
                    <el-popover placement="top" title="" width="340" trigger="hover">
                        <div>
                            免费加载云服务器安全组件，提供网站后门检测、异地登录提醒、暴力破解拦截等安全功能
                        </div>
                        <span class="tips-help ml5" slot="reference">
                            <zt-icon icon="icon-iconfontwenhao1"></zt-icon>
                        </span>
                    </el-popover>
                </zt-form-item>

            </zt-form>
        </div>
    </div>
</template>
<script>
// import {getImagesGroups} from '@/service/ecs/image';
import {getImageList, getImages} from '@/service/ecs/newimage';
const sysTypes = [
    {
        pic: 'icon-centos',
        name: 'CentOS'
    },
    {
        pic: 'icon-windows',
        name: 'Windows'
    },
    {
        pic: 'icon-redhat',
        name: 'Redhat'
    },
    {
        pic: 'icon-ubuntu',
        name: 'Ubuntu'
    },
    {
        pic: 'icon-freebsd',
        name: 'FreeBSD'
    }
];
export default {
    name: 'SelectMirror',
    data() {
        return {
            loading: false,
            sysTypes,
            imagesGroups: {},
            form: {
                mirrorType: '1',
                osType: '',
                imageObj: '',
                secure_selected: true
            },
            rules: {
                osType: [
                    {
                        required: true,
                        message: '请选择操作系统类别',
                        trigger: ['submit', 'change']
                    }
                ],
                imageObj: [
                    {
                        required: true,
                        message: '请选择镜像',
                        trigger: ['submit', 'change']
                    }
                ]
            }
        };
    },
    watch: {
        loading: function(newval) {
            this.$emit('loading', newval);
        },
        form: {
            deep: true,
            handler: function(newval) {
                this.$emit('input', newval);
                this.$nextTick(() => {
                    this.$refs.imageForm.clearValidate();
                });
            }
        }
    },
    created() {
        this.getImagesGroups();
        this.$emit('input', this.form);
    },
    computed: {
        versions: function() {
            let ostype = this.form.osType.toLowerCase();
            return this.imagesGroups[ostype] || [];
        }
    },
    methods: {
        getImagesGroups() {
            this.loading = true;
            getImageList()
                .then(res => {
                    if (res.code === this.CODE.SUCCESS_CODE) {
                        this.imagesGroups = res.data;
                    }
                })
                .catch(err => {
                    $log(err);
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        getImages(value) {
            this.form.imageObj = '';
            this.versions = [];
            this.loading = true;
            getImages(value.categoryId)
                .then(res => {
                    if (res.code === this.CODE.SUCCESS_CODE) {
                        this.versions = res.result;
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
<style scoped>
</style>
