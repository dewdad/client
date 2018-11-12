<template>
    <zt-form ref="instNameForm" :show-message="false" inline-message size="small" :model="form" :rules="rules" label-width="0" style="width:300px;">
        <zt-form-item id="instname" label="" class="hide-star" prop="instname" :showRule="true" has-help>
            <el-input ref="instname" v-model="form.instname" :placeholder="$t('form.input.instname')" maxlength="64" :clearable="true"></el-input>
            <!-- <span class="input-help text-nowrap">{{$t('ecs.create.instname.tips')}}</span> -->
        </zt-form-item>
        <zt-form-item label="" class="mb0 hide-star" prop="desc">
            <el-input type="textarea" v-model="form.desc" maxlength="300" autosize :placeholder="$t('form.input.instdesc')" :clearable="true"></el-input>
            <span slot="help" class="input-help">{{$t('ecs.create.instdesc.tips')}}</span>
        </zt-form-item>
    </zt-form>
</template>
<script>
export default {
    name: 'InstName',
    data() {
        return {
            form: {
                instname: '',
                desc: ''
            },
            rules: {
                instname: [
                    {
                        required: true,
                        message: '请输入名称',
                        trigger: ['submit']
                    },
                    {
                        min: 2,
                        max: 64,
                        show: true,
                        tipsMessage: '2-64位',
                        message: '实例名称格式不正确',
                        // message: '名称输入有误',
                        trigger: ['submit', 'blur']
                    },
                    {
                        pattern: /^[a-zA-Z][a-zA-Z0-9 _.-]{2,64}$/,
                        show: true,
                        tipsMessage: '必须以ASCII字母开头, 只能包含字母，数字，下划线，句点和连字符',
                        message: '实例名称格式不正确',
                        // message: '名称输入有误',
                        trigger: ['submit', 'blur']
                    }
                ]
            }
        };
    },
    props: {
        value: Object
    },
    watch: {
        form: {
            deep: true,
            handler: function(newval) {
                this.$emit('input', newval);
            }
        }
    },
    created() {
    }
};
</script>
<style scoped>
.el-form-item:not(:last-child) {
    margin-bottom: 16px;
}
</style>
