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
                    <el-select v-model="form.osType" :placeholder="$t('form.input.ostype')" size="small" :popper-append-to-body="false" value-key="categoryId" style="width:170px;" @change="getImages">
                        <el-option v-for="item in sysTypes" :key="item.categoryId" :value="item" :label="item.name">
                            <zt-icon :icon="item.pic" type="svg"></zt-icon> {{item.name}}
                        </el-option>
                    </el-select>
                </zt-form-item>
                <zt-form-item id="imageObj" label="" class="mb0 hide-star" prop="imageObj">
                    <el-select v-model="form.imageObj" :placeholder="$t('form.input.osversion')" size="small" :popper-append-to-body="false" value-key="id" style="width:436px;" no-data-text="暂无镜像">
                        <el-option v-for="item in versions" :key="item.id" :label="item.name" :value="item">
                        </el-option>
                    </el-select>
                </zt-form-item>
            </zt-form>
        </div>
    </div>
</template>
<script>
// import {getImagesGroups} from '@/service/ecs/image';
import {getImageList, getImages} from '@/service/ecs/newimage';
export default {
    name: 'SelectMirror',
    data() {
        return {
            loading: false,
            sysTypes: [],
            imagesGroups: {},
            versions: [],
            form: {
                mirrorType: '1',
                osType: '',
                imageObj: ''
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
    // computed: {
    //     versions: function() {
    //         // let ostype = this.form.osType.toLowerCase();
    //         let arr = [
    //             {
    //                 id: 'fdsafdsaf-fdsajsh',
    //                 name: '7.4 32bit'
    //             }
    //         ];
    //         // return this.imagesGroups[ostype] || arr;
    //         return arr;
    //     }
    // },
    methods: {
        getImagesGroups() {
            this.loading = true;
            getImageList()
                .then(res => {
                    if (res.code === this.CODE.SUCCESS_CODE) {
                        this.sysTypes = res.result.records;
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
