<template>
    <el-dialog :title="item.name" :visible.sync="isShow" width="600px"  v-dialogDrag>
        <div class="detailbox">
            <p class="top">镜像</p>
            <div class="orderIntro">
                <p> 
                    <span>ID:</span>
                    <span>{{item.id }}</span>
                </p>
                <p> 
                    <span>类型:</span>
                    <span>镜像</span>
                </p>
                <p> 
                    <span>状态:</span> <span>{{convertStatus(item.status)}}</span>
                </p>
                <p> <span>镜像格式:</span> <span>{{item.disk_format}}</span></p>
                <p> <span>容器格式:</span> <span>{{item.container_format}}</span></p>
                <p> <span>创建于:</span> <span>{{item.created_at | date}}</span></p>
            </div>
            <hr>
            <p class="top mt10">安全</p>
            <div class="orderIntro">
                <p>
                    <span>可见性:</span>
                    <span>{{item.visibility == 'public'?'公有':'私有' }}</span>
                </p>
                <p>
                    <span>受保护的:</span>
                    <span>{{item.protected?'是':'否'}}</span>
                </p>
                <p>
                    <span>校验和:</span> <span>{{item.checksum}}</span>
                </p>
            </div>
            <hr>
            <p class="top mt10">定制属性</p>
            <div class="orderIntro">
                <p>
                    <span>标签:</span>
                    <span>{{item.tags.length==0?"":item.tags }}</span>
                </p>
                <p>
                    <span>地址:</span> <span>{{item.locations.length==0?"":item.locations[0].url}}</span>
                </p>
                <p> <span>文件:</span> <span>{{item.file}}</span></p>
                <p> <span>图式:</span> <span>{{item.schema}}</span></p>
            </div>
        </div>
        <span slot="footer" class="dialog-footer">            
        </span>
    </el-dialog>
</template>
<script>

export default {
    data() {
        let imageStatusArr = [
            {key: 'ACTIVE', value: '运行中'},
            {key: 'QUEUED', value: '已排队'},
            {key: 'SAVING', value: '保存中'},
            {key: 'KILLED', value: '破坏的'},
            {key: 'DELETED', value: '已删除'},
            {key: 'PENDING_DELETE', value: '删除中'}
        ];
        return{
            imageStatusArr,
            isShow: false,
            resolve: null,
            reject: null,
            item:{}
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
        convertStatus(status) {
            let upperCase = status.toUpperCase();
            for (let i = 0, ii = this.imageStatusArr.length; i < ii; i++) {
                let item = this.imageStatusArr[i];
                if (item.key == upperCase) {
                    return item.value;
                }
            }
            return status;
        },
        calcSize(size) {
            if (size < 1024) {
                return size + 'B';
            }
            if (size < 1024 * 1024) {
                return size / 1024 + 'KB';
            }
            if (size < 1024 * 1024 * 1024) {
                return size / (1024 * 1024) + 'MB';
            }
            return size / (1024 * 1024 * 1024) + 'GB';
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
            margin-left:20px;
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
