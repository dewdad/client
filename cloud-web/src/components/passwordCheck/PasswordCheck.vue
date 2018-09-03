<template>
    <div class="check-rules">
        <ul class="list-unstyled">
            <!-- <li>
                <span class="safe">安全等级：
                    <strong class="s s1" :style="{'background': getColor('s1')}"></strong>
                    <strong class="s s2" :style="{'background': getColor('s2')}"></strong>
                    <strong class="s s3" :style="{'background': getColor('s3')}"></strong>
                    <strong class="word">{{levalName}}</strong>
                </span>
            </li> -->
            <li>
                <span>
                    <i :class="{'iconfont icon-cross': !condition1, 'iconfont icon-Correct': condition1}"></i> {{$t("account.pwdManage.tips.tips1")}}</span>
            </li>
            <li>
                <span>
                    <i :class="{'iconfont icon-cross': !condition2, 'iconfont icon-Correct': condition2}"></i> {{$t("account.pwdManage.tips.tips2")}}</span>
            </li>
            <li>
                <span>
                    <i :class="{'iconfont icon-cross': !condition3, 'iconfont icon-Correct': condition3}"></i> {{$t("account.pwdManage.tips.tips3")}}</span>
            </li>
        </ul>
    </div>
</template>
<script>
export default {
    name: 'PasswordCheck',
    data() {
        return {
            level: 0,
            levalName: '',
            condition1: false,
            condition2: false,
            condition3: false
        };
    },
    props: {
        password: String
    },
    watch: {
        password: function(newval, oldval) {
            this.validatePass(newval);
        }
    },
    methods: {
        validatePass(pass) {
            // 校验密码条件1
            let len = 0;
            if (pass != '' && pass != undefined) {
                len = pass.length;
            }
            if (len >= 8 && len <= 32) {
                this.condition1 = true;
            } else {
                this.condition1 = false;
            }

            // 校验密码条件2
            if (pass != '' && pass != undefined) {
                if (
                    pass.indexOf(' ') > -1 ||
                    pass.indexOf('>') > -1 ||
                    pass.indexOf('<') > -1
                ) {
                    this.condition2 = false;
                } else {
                    this.condition2 = true;
                }
            } else {
                this.condition2 = false;
            }

            // 校验密码条件3
            // regex1是否包含数字
            // regex2是否包含字母
            // regex3是否包含特殊字符
            let [regex1, regex2, regex3] = [
                /(?=.*[0-9])/g,
                /(?=.*[a-zA-Z])/g,
                /(?=.*[^a-zA-Z0-9])/g
            ];
            let cnt = 0;
            //每满足一个cnt自动加1
            if (regex1.test(pass)) cnt++;
            if (regex2.test(pass)) cnt++;
            if (regex3.test(pass)) cnt++;
            if (cnt >= 3) {
                this.condition3 = true;
            } else {
                this.condition3 = false;
            }

            this.level = this.safeTest(pass);
            switch (this.level) {
                case 0:
                    break;
                case 1:
                    this.levalName = '低';
                    break;
                case 2:
                    this.levalName = '中';
                    break;
                case 3:
                    this.levalName = '高';
                    break;
                default:
                    break;
            }
        },
        safeTest(str) {
            if (!str) {
                return 0;
            }
            //长度小于8  直接返回 低
            var len = str.length;
            if (len < 8) {
                return 1;
            }
            //计算大写字母、小写字母、数字、特殊字符 包含了几种  2种-中 3、4种-高 小于2种-低
            var cnt = this.regexCnt(str) + this.regexSpecial(str);
            if (
                cnt >= 3 &&
                this.condition1 &&
                this.condition2 &&
                this.condition3
            ) {
                return 3;
            } else if (cnt == 1) {
                return 1;
            } else {
                return 2;
            }
        },
        regexCnt(str) {
            if (!str) return 0;
            var regex1 = /(?=.*[0-9])/g; //是否包含数字
            var regex2 = /(?=.*[a-z])/g; //是否包含小写字母
            var regex3 = /(?=.*[A-Z])/g; //是否包含大写字母

            var cnt = 0;
            //每满足一个cnt自动加1
            if (regex1.test(str)) cnt++;
            if (regex2.test(str)) cnt++;
            if (regex3.test(str)) cnt++;
            return cnt;
        },
        regexSpecial(str) {
            if (!str) return 0;
            var regex4 = /(?=.*[^a-zA-Z0-9])/g; //是否包含特殊字符
            var cnt = 0;
            if (regex4.test(str)) cnt++;
            return cnt;
        },
        getColor(obj) {
            let color = '#E6E6E6';
            if (obj === 's1') {
                switch (this.level) {
                    case 0:
                        break;
                    case 1:
                        color = '#EC7561';
                        break;
                    case 2:
                        color = '#F4BC46';
                        break;
                    case 3:
                        color = '#ABD037';
                        break;
                }
            }
            if (obj === 's2') {
                switch (this.level) {
                    case 0:
                        break;
                    case 1:
                        color = '#E6E6E6';
                        break;
                    case 2:
                        color = '#F4BC46';
                        break;
                    case 3:
                        color = '#ABD037';
                        break;
                }
            }
            if (obj === 's3') {
                switch (this.level) {
                    case 0:
                        break;
                    case 1:
                        color = '#E6E6E6';
                        break;
                    case 2:
                        color = '#ccc';
                        break;
                    case 3:
                        color = '#ABD037';
                        break;
                }
            }
            return color;
        }
    }
};
</script>
