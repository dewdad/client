<template>
    <div class="bindEmailboxSuccess pull-page-main">
        <single-header></single-header>
        <div class='panal-body clearfix' v-loading.fullscreen="isSuccess === null">
            <el-row>
                <el-col :span='24'>
                    <div class="main-box" v-show="isSuccess">
                        <div class="bindSuccess text-center mb20">
                            <i class='iconfont icon-success color-success'></i>
                        </div>
                        <p class="font18 text-center mb10 title">{{$t('useremail.bind.success')}}</p>
                        <p class="text-center mb15 font12">{{$t('useremail.bind.bindSuccess')}}</p>
                        <router-link tag="button" to="/" class="el-button el-button--primary" long>{{$t('common.back')}}{{$t('common.console')}}</router-link>
                    </div>
                </el-col>
            </el-row>
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
            title: $t('useremail.bind.title'),
            isSuccess: null
        };
    },
    computed: {},
    methods: {
        async check() {
            try {
                let id = this.$route.params.id;
                if (id) {
                    let ret = await validateEmailCode({code: id});
                    // ret = {data: {
                    //     code: '0000',
                    //     result: {
                    //         uid: 'd977f72e4dca47678eb8f071c6499280',
                    //         emailStatus: 1,
                    //         authStatus: null,
                    //         mobile: '13054181654',
                    //         comName: '人民网前端部门',
                    //         userName: '屈晓明2018',
                    //         email: 'xm726@qq.com',
                    //         ext2: 'false',
                    //         status: 2,
                    //         ext1: null,
                    //         token:
                    //             'da3cbb383f04958a8cde7d3b06d1a17c9d90f0d031252f895fd6654384863de96f2b04180bf4cfa838ded4730001caf9'
                    //     },
                    //     msg: 'SUCCESS',
                    //     level: '0'
                    // },
                    // 'headers': {
                    //     'x-people-token': 'da3cbb383f04958a8cde7d3b06d1a17c9d90f0d031252f895fd6654384863de96f2b04180bf4cfa838ded4730001caf9'
                    // }};
                    console.log('validateEmailCode', ret);
                    let code = get(ret, 'data.code');
                    let user = get(ret, 'data.result');
                    if (code === '0000' && user.uid) {
                        this.isSuccess = true;
                        this.$store.commit('SET_LOGIN_STATUS', {
                            status: true,
                            token: ret.headers['x-people-token']
                        });
                        // 记录用户信息
                        this.$store.commit('user/SET_USERINFO', user);
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
                MessageBox.alert(msg, {
                    title: '提示',
                    type: 'error'
                }).finally(() => {
                    this.$router.push({
                        name: 'login'
                    });
                });
            }
        }
    },
    created() {
        this.check();
    },
    components: {
        SingleHeader,
        SingleFooter
    }
};
</script>
<style scoped lang='scss'>
.bindEmailboxSuccess {
    p {
        padding: 0;
        margin: 0;
    }
    .panal-body {
        padding-top: 10px;
        width: 450px;
        margin: auto;
        text-align: left;
        .title {
            font-weight: 600;
        }
        .main-box {
            margin-top: 166px;
            .bindSuccess {
                text-align: center;
                color: #333;
                .icon-success {
                    font-size: 40px;
                    line-height: 40px;
                }
            }
            .el-button {
                height: 38px;
                display: table-row-group;
            }
        }
    }
}
</style>
