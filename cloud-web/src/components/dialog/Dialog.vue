<template>
    <el-dialog :title="title" :visible="true" @close="cancel" append-to-body="true">
        <slot name="default"></slot>
        <div slot="footer" class="dialog-footer">
            <slot name="footer"></slot>
        </div>
    </el-dialog>
</template>
<script>
// import {mapState} from 'vuex';
export default {
    name: 'Dialog',
    data() {
        return {
            reject: null,
            resolve: null
        };
    },
    props: {
        title: {
            type: String,
            default: ''
        }
    },
    methods: {
        show() {
            this.isShow = true;
            return new Promise((resolve, reject) => {
                this.reject = reject;
                this.resolve = resolve;
            });
        },
        close() {
            this.isShow = false;
        },
        cancel() {
            this.close();
        },
        confirm() {
            this.close();
            typeof this.resolve === 'function' && this.resolve();
        }
    }
};
</script>
<style scoped>
</style>
