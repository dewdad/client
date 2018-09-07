<template>
    <el-dialog title="管理成员" :visible.sync="isShow" width="600px"  v-dialogDrag>
        <el-row>
            <el-col :span="12" style="padding:10px;border:1px solid #BBB;height:600px;overflow-y: auto">
                <div class="item" >
                    <span>ssss</span>
                    <el-button type="primary pull-right" size="small" style="font-size: 18px;">+</el-button>
                </div>
            </el-col>
            <el-col :span="12" style="padding:10px;border:1px solid #BBB;border-left:0;height:600px;overflow-y: auto"></el-col>
        </el-row>
    </el-dialog>
</template>
<script>
import { mapState } from 'vuex';

export default {
    data() {
        return{
            isShow: false,
            resolve: null,
            reject: null,
            item:[]
        };
    },
    props: {},
    computed:{
        ...mapState({
            user: state => state.user.userInfo,
        }),
    },
    methods: {
        show(item) {
            this.isShow = true;
            this.item = item.item;
            console.log('stataparams',item);
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

    },
    mounted(){

    }
};
</script>
<style lang="scss">
    .item{
        border: 1px solid #BBB;
        background-color: #f9f9f9;
        overflow: hidden;
        line-height:40px;
        padding:5px;
        p{
            margin-bottom:10px;
        }
    }
</style>
