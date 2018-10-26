<template>
    <el-dialog title="申请详情" :visible.sync="isShow" width="600px"  v-dialogDrag>
        <div class="detailbox">
            <div class="orderIntro">
                <p> 
                    <span>审批备注:</span>
                    <span>{{item.approveRemark }}</span>
                </p>
                <p>
                    <span>账号:</span>
                    <span>{{item.userName }}</span>
                </p>
                <p>
                    <span>密码:</span>
                    <span>{{item.userPass }}</span>
                </p>
            </div>
        </div>
    </el-dialog>
</template>
<script>
export default {
    data() {

        return{
            isShow: false,
            resolve: null,
            reject: null,
            API_URL,
            attachArr:[],
            item:{},
            replayData: [],
            addData: [],
            addDataFile:[]
        };
    },
    props: {},
    methods: {
        show(item) {
            this.isShow = true;
            this.item = item;

            return new Promise((resolve, reject) => {
                this.reject = reject;
                this.resolve = resolve;
            });

        },


        hide() {
            this.isShow = false;

        },
        cancel() {
            this.hide();
            typeof this.reject() === 'function' && this.reject();
        },


        setting() {
            return new Promise(resolve => {
                setTimeout(() => {
                    typeof this.resolve(this.form) === 'function' && this.resolve(this.form);
                }, 1000);
            });
        },


    }
};
</script>
<style lang="scss">
    .detailbox{
        .top{
            border-left: 3px solid #4895d7;
            height: 16px;
            font-size: 14px;
            color: #333333;
            padding-left: 10px;
            margin-bottom: 16px;
            line-height: 100%;
        }
        color:#666;
        p{
            margin-bottom:10px;
        }
        .reply{
            border: 1px solid #999;
            padding: 20px 10px;
            p{
                margin: 0;
            }
        }
        .orderIntro{
            p{
                display: flex;
                span:first-child{
                    margin-right: 10px;
                }
                span:last-child{
                    flex: 1;
                }
            } 
        }
    }
</style>
