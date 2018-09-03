import LinkmanDialog from './dialog/LinkmanDialog';
import MobileCodeDialog from '@/components/dialog/MobileCodeDialog';
import Timer from '@/components/common/Timer.vue';
import {sendMobilecode, checkMobileCode} from '@/service/mobile';
import {sendContactEmail, getContactList, delContact, amendContact} from '@/service/user';
import {mapGetters} from 'vuex';
let cols = [
    { column: 'name', text:'姓名' },
    { column: 'email', text: '邮箱', width: '100' },
    { column: 'mobile', text: '手机', width: '100' },
    { column: 'position', text: '职位', width: '8%' }
];

export default {
    components: {
        LinkmanDialog,
        Timer,
        MobileCodeDialog
    },
    data() {
        return {
            cols,
            tableDataList: [],
            validateUser: false,
            codeType: '',
            mobileVal: '',
            time: [],
            messageInput: false,
            mobileCodeState: false,
            loadingState: true,
            mobileNumber: '' // 当前操作手机号码
        };
    }, 
    computed: {
        ...mapGetters(['userInfo']),
        userLinkman() {
            return {
                name: '账号联系人',
                email: this.userInfo.email,
                mobile: this.userInfo.mobile,
                position: '',
                type: 1
            };
        }
    },   
    created() {
        this.getLinkManFn();
    },
    methods: {
        getTimer(mobile) {
            return this.time.findIndex(e => e && e.mobile === mobile);
        },
        /**
         * 添加联系人
         */
        addLinkman(rowItem, type) {
            console.log('addLinkman:', rowItem);
            this.$refs.LinkmanDialog.show(rowItem, type)
                .then((ret) => {
                    if (ret && ret.code && ret.code === this.CODE.SUCCESS_CODE) {
                        console.log('操作成功', ret);
                        if (type === 1) {
                            this.getMobileCode(ret.result.mobile);
                            this.sendEmailValidateFn(ret.result);
                        }
                        this.getLinkManFn();
                    }
                })
                .catch(err => {
                    if (err) {
                        console.log('Error', err);
                    } else {
                        console.log('取消');
                    }
                });
        },
        // 身份验证
        mobileCodeDialogFn(linkId) {
            this.$refs.MobileCodeDialog.show()
                .then((ret) => {
                    if (ret && ret.code && ret.code === this.CODE.SUCCESS_CODE) {
                        console.log('验证身份', ret);
                        this.delLinkManBox(linkId);
                    }
                })
                .catch(err => {
                    if (err) {
                        console.log('Error', err);
                    } else {
                        console.log('取消');
                    }
                });
        },
        // 删除联系人弹窗
        delLinkManBox(linkId) {
            this.$confirm('确认删除该联系人吗?', '删除', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.delLinkManFn(linkId);
            }).catch(() => {         
            });
        },
        // 删除联系人
        delLinkManFn(linkId) {
            let data = {
                id: linkId
            };
            try {
                delContact(data)
                    .then(ret => {
                        $log('删除联系人', ret);
                        if(ret && ret.code && ret.code === '0000')
                            this.$message({
                                type: 'success',
                                message: '删除成功!'
                            });
                        this.getLinkManFn();
                    })
                    .catch((err) => {
                    });
            } catch (error) {
                $log('delLInkMan 执行失败', error.message);
            }
        },
        // 获取短信验证码 => 验证联系人
        async getMobileCode(mobile) {

            try {
                sendMobilecode(mobile, this.codeType, this.validateUser)
                    .then(ret => {
                        $log(ret);
                        if (ret && ret.code && ret.code === '0000') {
                            this.mobileCodeState = true;
                            this.mobileNumber = mobile;
                            let index = this.getTimer(mobile);
                            if (index >= 0) {
                                this.time[index] = {
                                    mobile: mobile,
                                    time: 60,
                                    mobileVal: ''
                                };
                            } else {
                                this.time.push({
                                    mobile: mobile,
                                    time: 60,
                                    mobileVal: ''
                                });
                            }
                        }
                    })
                    .catch((err) => {
                    });
            } catch (error) {
                $log('beforeSend 执行失败', error.message);
            }
        },
        // 发送验证邮箱链接
        sendEmailValidateFn(rowItem, emailType) {
            $log('发送验证邮箱链接');
            try {
                sendContactEmail(rowItem)
                    .then(ret => {
                        $log(ret);
                        
                        if (ret && ret.data && ret.data.code && ret.data.code === '0000') {
                            let message = emailType === 1 ? '邮件发送成功，请注意查收' : '短信验证码和邮件发送成功，请注意查收';
                            this.$message.success(message);
                        }
                    })
                    .catch((err) => {
                    });
            } catch (error) {
                $log('beforeSend 执行失败', error.message);
            }
        },
        // 校验短信验证码
        checkmobileCode(rowItem, value, mobile) {
            $log('校验短信验证码', rowItem);
            this.mobileNumber = mobile;
            if (value === '') {
                this.$message.error('请输入验证码');
                this.messageInput = true;
                return;
            } 
            checkMobileCode(rowItem.mobile, value, '')
                .then(ret => {
                    $log(ret);
                    if (ret && ret.code && ret.code === '0000') {
                        this.hideInput(rowItem.mobile);
                        // this.mobileCodeState = false;
                        // this.mobileVal = '';
                        this.amendLinkManState(rowItem);
                        this.messageInput = false;
                    } else {
                        this.messageInput = true;
                        this.$message.error(ret.msg);
                    }
                })
                .catch((err) => {
                    // this.$message.error();
                });
        },
        hideInput(mobile) {
            let index = this.getTimer(mobile);
            if (index >= 0) {
                delete this.time[index];
            }
        },
        // 查询联系人列表
        getLinkManFn() {
            let data = {
                pageIndex: 1,
                limit: 100
            };
            this.loadingState = true;
            this.tableDataList = [];
            try {
                getContactList(data)
                    .then(ret => {
                        this.tableDataList.push(this.userLinkman);
                        if (ret && ret.code && ret.code === this.CODE.SUCCESS_CODE) {
                            let resData = ret.result;
                            for(let a in resData.records) {
                                this.tableDataList.push(resData.records[a]);
                            }
                        }
                        this.loadingState = false;
                    })
                    .catch((err) => {
                        $log('getContactList 执行失败', err);
                    });
            } catch (error) {
                $log('getContactList 执行失败', error.message);
            }
        },
        // 修改新增联系人的状态
        amendLinkManState(rowItem) {
            let params = {
                id: rowItem.id,
                name: rowItem.name,
                mobile: rowItem.mobile,
                email: rowItem.email,
                position: rowItem.position,
                mobileStatus: 1
            };
            try {
                amendContact(params)
                    .then(ret => {
                        $log('修改新增联系人的状态', ret);
                        if (ret && ret.code && ret.code === '0000') {
                            this.$message.success('验证成功');
                            this.getLinkManFn();
                        }
                    })
                    .catch((err) => {
                    });
            } catch (error) {
                $log('beforeSend 执行失败', error.message);
            }
        }
    }
};
