<template>
    <span>
        <i class="amendInfo finger-cursor iconfont icon-edit_people" @click="editinstname(scope.row)"></i>
        <!-- 对话框 修改实例名称 -->
        <amend-name-dialog ref="amendNameDialog" />
    </span>
</template>

<script>
import AmendNameDialog from '@/components/dialog/AmendNameDialog';
export default {
    props: {
        scope:{
            type: Object
        }
    },
    methods:{
        //编辑实例名称
        editinstname:function (rowItem){           
            console.log('editinstname:',rowItem); 
            this.$refs.amendNameDialog
                .show(rowItem.name)
                .then(ret => {
                    this.$emit('select', ret);                   
                })
                .catch(err => {
                    $log(err);
                }); 

        },
    },
    components: {
        AmendNameDialog
    }
};
</script>
<style lang="scss" scoped>
.amendInfo{
    display: none;
}
</style>

