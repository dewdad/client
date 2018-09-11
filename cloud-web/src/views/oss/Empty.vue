<template>
    <div class="PageError">
        <div class="error">
            <img src="@/assets/images/control/error.png" alt="">
            <span class="pull-left text-left text">
               您还没有创建存储空间! <br>
                <el-button type="primary" size="small" @click="createBucket">立即创建</el-button>
            </span>
           
        </div>
    <create-bucket ref="createBucketDailog"></create-bucket>
    </div>
</template>
<script>
import CreateBucket from './bucket/Create';
export default {
    data() {
        return {};
    },
    components: {
        CreateBucket
    },
    methods: {
        createBucket() {
            this.$refs.createBucketDailog.show().then(res => {
                if (res.code === this.CODE.SUCCESS_CODE) {
                    // this.bucketList.push(res.result);
                    this.$router.push({name: 'app.oss.bucket', params: {view: 'overview', bucketId: res.data.name}});
                }
            });
        }
    }
};
</script>
    <style scoped>
.error {
    width: 500px;
    height: 300px;
    margin: 0 auto;
    padding-top: 15%;
    text-align: center;
    font-size: 18px;
    font-weight: bold;
    color: #555;
}
.error img {
    float: left;
}
.error .text {
    padding-top: 50px;
}
</style>