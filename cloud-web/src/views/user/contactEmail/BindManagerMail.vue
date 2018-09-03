<template>
    <div class='pull-page-main managerSuccess' v-loading.fullscreen="isSuccess === null">
        <single-header></single-header>
        <div v-if="!isError" class='pull-page-body'>
            <div class="bindSuccess text-center mb20">
                <i  class='iconfont icon-success color-success font40'></i>
            </div>
            <p class="font18 text-center mb10 title is-bold">添加成功</p>
            <p class="text-center mb15 font12">您已成功为该邮箱设置接收消息功能</p>
            <router-link tag="button" :to="{'name': 'app'}" class="el-button el-button--primary" long>{{$t('common.back')}}{{$t('common.console')}}</router-link>
        </div>
        <single-footer></single-footer>
    </div>
</template>
<script>
import SingleHeader from '@/components/header/SingleHeader';
import SingleFooter from '@/components/footer/SingleFooter';
import {validateEmailCode} from '@/service/user.js';
import {MessageBox} from 'element-ui';
import {get} from '@/utils/utils';
export default {
    name: 'app',
    data() {
        return {
            id: this.$route.params.id,
            isSuccess: null,
            isError: true,
        };
    },
    methods: {
        async check() {
            try {
                let id = this.$route.params.id;
                if (id) {
                    let ret = await validateEmailCode({code: id});
                    console.log('validateEmailCode', ret);
                    let code = get(ret, 'data.code');
                    let user = get(ret, 'data.result');
                    if (code === '0000' && user.uid) {
                        this.isSuccess = true;
                        this.isError = false;
                    } else {
                        let msg = get(
                            ret,
                            'data.msg',
                            $t('useremail.errormsg')
                        );
                        throw new Error(msg);
                    }
                } else {
                    throw new Error($t('useremail.errormsg'));
                }
            } catch (error) {
                $log('bind Error', error.message);
                this.isSuccess = false;
                let msg = $t('useremail.errormsg');
                if (error && error.name === 'Error') {
                    msg = error.message;
                }
                if (msg === 'Internal Server Error'){
                    msg = $t('useremail.errormsg');
                }
                console.warn(error);
                console.warn(error.code);
                $log(msg);
                this.isError = true;
                MessageBox.alert(msg, {
                    title: '提示',
                    type: 'error'
                }).finally(() => {
                    this.$router.push({
                        name: 'accountMg.manager'
                    });
                });
            }
        }
    },
    components: {
        SingleFooter,
        SingleHeader
    },
    created() {
        this.check();
    }

};
</script>
<style scoped lang='scss'>
.managerSuccess{
    width: 100%;
    .pull-page-body{
        width: 450px;
        margin: auto;
    }
}
</style>
