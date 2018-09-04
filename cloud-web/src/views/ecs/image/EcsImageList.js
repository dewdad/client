/**
 * ecs镜像列表
 */
import {mapState} from 'vuex';
import RegionRadio from '@/components/regionRadio/RegionRadio';
// import RealNameVerify from '@/components/dialog/RealNameVerify';
import PageHeader from '@/components/pageHeader/PageHeader';
import searchBox from '@/components/search/SearchBox';
import AmendName from '@/components/amend/AmendName';
import ImportImageDialog from './dialog/ImportImageDialog';
import CustomImageDesc from './dialog/CustomImageDesc';

import {getImages, deleteImages} from '@/service/ecs/image.js';

export default {
    name: 'EcsImageList',
    data() {
        let searchObj = {
            //分页
            paging: {
                pageIndex: 1,
                limit: 10,
                totalItems: 0
            },
            type: 'private' //镜像类型： false 公共镜像； true:自定义镜像
        };

        let statusArr = [
            {
                value: 'active',
                text: '运行中',
                className: 'color-success',
                icon: 'zticon-running_people'
            },
            {
                value: 'queued',
                text: '已排队',
                className: 'color-primary',
                type: 'progress'
            },
            {
                value: 'saving',
                text: '保存中',
                className: 'color-success',
                type: 'progress'
            },
            {
                value: 'killed',
                text: '破坏的',
                className: 'color-danger',
                icon: 'zticon-overdue_people'
            },
            {
                value: 'deleted',
                text: '已删除',
                className: 'color-danger',
                type: 'zticon-overdue_people'
            },
            {
                value: 'pending_delete',
                text: '删除中',
                className: 'color-danger',
                icon: 'progress'
            }
        ];

        let fields = [{field: 'name', label: this.$t('ecs.image.list.imageName'), tagType: 'INPUT'}, {field: 'status', label: this.$t('common.status'), options: statusArr, tagType: 'SELECT'}];

        let searchObjExtra = {
            fields: fields,
            selField: fields[0]
        };
        // let tableData = [
        //     {
        //         name: 'd-yjtbeyhgsymp',
        //         id: 'd-yjtbeyhgsymp',
        //         empty: '',
        //         imageType: '公共镜像',
        //         platform: 'CentOS',
        //         os: 'CentOS 7.5 64位',
        //         createTime:'2018-05-23 15:27:24',
        //         status: '可用'
        //     }
        // ];
        let cols = [
            {column: 'name', text: '镜像ID/名称'},
            {column: 'disk_format', text: '镜像格式', width: '100'},
            {column: 'size', text: '大小', width: '8%'},
            {column: 'protected', text: '保护的', width: '10%'},
            {column: 'createTime', text: this.$t('common.createTime'), width: '8%'},
            {column: 'status', text: this.$t('common.status'), width: '10%', class: 'text-left'}
        ];

        let imageTypeArr = [{key: 'gold', text: '公共镜像'}, {key: 'private', text: '自定义镜像'}, {key: 'shared', text: '自定义镜像'}];

        return {
            loading: false,
            cols,
            searchObj,
            searchObjExtra,
            inlineForm: {
                field: '',
                value: ''
            },
            imageTypeArr,
            statusArr,
            dialogVisible: false,
            region: '',
            stateParams: this.$route.params,
            tableData: []
        };
    },
    computed: {
        ...mapState({
            user: state => state.user.userInfo
        })
    },
    components: {
        RegionRadio,
        PageHeader,
        searchBox,
        AmendName,
        ImportImageDialog,
        CustomImageDesc
    },
    mounted() {
        this.getEcsImageList();
    },
    methods: {
        search(params) {
            $log(params);
            this.inlineForm.field = params.selValue.field;
            this.inlineForm.value = params.selInputValue;
            this.this.searchObj.paging.pageIndex = 1;
            this.getEcsImageList();
        },

        //查询列表数据
        getEcsImageList: function() {
            let params = {
                paging: this.searchObj.paging,
                type: this.searchObj.type,
                fileds: {
                    [this.inlineForm.field]: this.inlineForm.value
                }
            };
            this.loading = true;
            this.tableData = [];
            getImages(params)
                .then(res => {
                    if (res.code && res.code === this.CODE.SUCCESS_CODE) {
                        console.log('getEcsImageList', res);
                        let resData = res.data;
                        if (resData && resData.data) {
                            this.tableData = resData.data || [];
                            this.searchObj.paging.totalItems = resData.total || 0;
                            console.log('getEcsImageList tableData', this.tableData);
                        }
                    }
                })
                .finally(() => {
                    this.loading = false;
                });
        },

        //删除镜像
        deleteImage(rowItem) {
            //删除确认
            this.$messageBox
                .confirm('确定要对该镜像进行删除操作吗？', '删除', {
                    type: 'warning',
                    alertMessage: '删除操作无法恢复，请谨慎操作',
                    subMessage: rowItem.id
                })
                .then(() => {
                    //提交后台,删除镜像
                    deleteImages(rowItem.id)
                        .then(res => {
                            if (res.code && res.code === this.CODE.SUCCESS_CODE) {
                                this.$message.success('操作成功');
                                this.getEcsImageList(); //查询刷新数据；
                            }
                        })
                        .catch(err => {
                            console.log('deleteImages err', err);
                        });
                });
        },

        //导入镜像
        importImage: function(rowItem) {
            console.log('importImage:', rowItem);
            this.$refs.ImportImageDialog.show(rowItem)
                .then(ret => {
                    this.getEcsImageList();
                })
                .catch(err => {
                    if (err) {
                        console.log('Error', err);
                    } else {
                        console.log('取消');
                    }
                });
        },
        // 编辑自定义镜像描述
        editImageDesc(rowItem) {
            console.log('importImage:', rowItem);
            this.$refs.CustomImageDesc.show(rowItem)
                .then(ret => {
                    this.getEcsImageList();
                })
                .catch(err => {
                    if (err) {
                        console.log('Error', err);
                    } else {
                        console.log('取消');
                    }
                });
        },
        // 选择镜像类型
        handleClick(tab, event) {
            console.log('tab:', tab);
            this.getEcsImageList();
        },

        handleSizeChange: function(params) {
            console.log('params:', params);
        },

        handleCurrentChange: function(params) {
            console.log('handleCurrentChange:', params);
        },
        handleSearch: function(labels) {
            console.log(labels);
        },
        getSysOsIcon: function(osType) {
            if (osType) {
                const sysname = osType.split(' ')[0];
                const sysname_lowercase = sysname.toLowerCase() || sysname;
                let out_osname = '';
                switch (sysname_lowercase) {
                    case 'debian': {
                        out_osname = 'icon-debian';
                        break;
                    }
                    case 'suse': {
                        out_osname = 'icon-suse';
                        break;
                    }
                    case 'coreos': {
                        out_osname = 'icon-coreos';
                        break;
                    }
                    case 'centos': {
                        out_osname = 'icon-centos';
                        break;
                    }
                    case 'ubuntu': {
                        out_osname = 'icon-ubuntu';
                        break;
                    }
                    case 'freebsd': {
                        out_osname = 'icon-freebsd';
                        break;
                    }
                    case 'redhat': {
                        out_osname = 'icon-redhat';
                        break;
                    }
                    case 'windows': {
                        out_osname = 'icon-windows';
                        break;
                    }
                    default: {
                    }
                }
                return out_osname;
            }
            return '';
        },
        convertMinSize(minSize) {
            if (typeof minSize === 'undefined') {
                return '创建中';
            }
            if (minSize && minSize.split(',').length == 2) {
                let diskSize = minSize.split(',')[0];
                if (diskSize != '0') diskSize = '磁盘' + diskSize + 'G';
                else diskSize = '';
                return diskSize;
            } else {
                return '创建中';
            }
        }
    }
};
