<template>
    <div class="filemrg mt10">
        <!-- <el-alert title="欢迎使用对象存储OSS客户端，管理文件更轻松！  OSS客户端下载" type="success" :closable="false">
        </el-alert> -->
        <el-row>
            <el-col :span="6">
                <span class="font16 lh32">文件管理</span>
            </el-col>
            <el-col :span="18" class="text-right lh32">
                <zt-form :inline="true" size="small" class="search-form-inline">
                    <zt-form-item>
                        <el-button type="primary" size="small" @click="showUpload">上传文件</el-button>
                    </zt-form-item>
                    <zt-form-item>
                        <el-button type="info" size="small" @click="createFolder">新建目录</el-button>
                    </zt-form-item>
                    <!-- <zt-form-item>
                        <el-input size="small" v-model="searchText" placeholder="输入文件名前缀匹配"></el-input>
                    </zt-form-item>
                    <zt-form-item>
                        <el-button type="primary" size="small" icon="el-icon-search" @click="search(currentPath)">
                            搜索
                        </el-button>
                    </zt-form-item> -->
                </zt-form>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="24" class="font12">
                <span v-if="currentPath === ''">全部文件，共{{fileNums}}个({{fileSize}})</span>
                <span v-if="currentPath !== ''">
                    <a href="javascript:;" class="font12" @click="returnLast">返回上一级</a>
                    <b class="link-division-symbol"></b>
                    <a href="javascript:;" @click="selectFolder('')" class="font12">全部文件</a>
                    <template v-for="dir in folderPath">
                        &gt;
                        <a href="javascript:;" :key="dir.name" @click="selectFolder(dir.path)">{{dir.name}}</a>
                    </template>
                </span>
                <span v-if="multipleSelection.length" class="ml20">已选择：
                    <font class="color-primary">{{multipleSelection.length}}</font> / {{fileNums}}</span>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="24">
                <el-table ref="fileTable" :data="fileList" v-loading="loading" stripe border empty-text="还没有上传文件" class="data-list mt10" @selection-change="handleSelectionChange">
                    <el-table-column type="selection" width="55" :selectable="selectable">
                    </el-table-column>
                    <el-table-column label="文件名(Object Name)" :show-overflow-tooltip="true">
                        <template slot-scope="scope">
                            <span v-if="getRowType(scope.row)">
                                <img src="statics/images/bucket/filemgr/folder.svg" width="24px" height="24px">
                                <a href="javascript:;" @click="selectFolder(scope.row)">{{scope.row.replace(currentPath, "")}}</a>
                            </span>
                            <span v-else>
                                <img :src="scope.row.key|getFileIcon" width="24px" height="24px">
                                <a href="javascript:;" @click="downloadFile(scope.row.key)">{{scope.row.key.replace(currentPath, "")}}</a>
                            </span>
                        </template>

                    </el-table-column>
                    <el-table-column prop="" label="文件大小">
                        <template slot-scope="scope">
                            {{scope.row.size|convertByteSize(2, 'string') || '-'}}
                        </template>
                    </el-table-column>
                    <el-table-column prop="mimeType" label="存储类型" :show-overflow-tooltip="true">
                        <template slot-scope="scope">
                            <span v-if="getRowType(scope.row)">
                                -
                            </span>
                            <span v-else>
                                <!-- {{scope.row.storageClass}} -->
                                标准存储
                            </span>
                        </template>
                    </el-table-column>
                    <el-table-column label="更新时间">
                        <template slot-scope="scope">
                            <span v-if="getRowType(scope.row)">
                                -
                            </span>
                            <span v-else>
                                {{scope.row.lastModified|date('YYYY-MM-DD HH:mm:ss')}}
                            </span>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" min-width="120" class-name="option-column">
                        <template slot-scope="scope">
                            <span v-if="getRowType(scope.row)" class="inline-block">
                                <a href="javascript:;" @click="removeFileOne(scope.row, 'folder', scope.$index)">删除</a>
                            </span>
                            <span v-else class="inline-block">
                                <a href="javascript:;" @click="preview(scope.row)">详情</a>
                                <b class="link-division-symbol"></b>
                                <a href="javascript:;" @click="removeFileOne(scope.row, 'one', scope.$index)">删除</a>
                            </span>
                        </template>
                    </el-table-column>
                </el-table>
            </el-col>
        </el-row>
        <el-row class="mt20">
            <el-col :span="24" style="padding-left:30px;">
                <el-checkbox v-model="allSelect" @change="toggleAllSelection"></el-checkbox>
                <el-button type="info" class="ml20" :disabled="multipleSelection.length === 0" size="small" @click="batchRemoveFile">
                    删除文件
                </el-button>
            </el-col>
        </el-row>
        <upload-file ref="uploadFile" :bucketId="bucketId" :path="currentPath" :bucketName="headerInfo.name" @success="search(currentPath)"></upload-file>
        <create-folder ref="createFolder" :path="currentPath" :bucketId="bucketId" @success="search"></create-folder>
        <preview ref="preview" :bucketId="bucketId" :file-list="previewFiles"></preview>
        <delete-file-dialog ref="DeleteFileDialog" :bucketId="bucketId"></delete-file-dialog>
    </div>
</template>
<script>
import {getFileList, getFileLink} from '@/service/oss/filemgr';
import {isEmpty, isObject} from '@/utils/utils';
import UploadFile from './UploadFile';
import CreateFolder from './CreateFolder';
import Preview from './Preview';
import DeleteFileDialog from './components/DeleteFileDialog';
export default {
    name: 'Filemrg',
    data() {
        return {
            loading: true,
            fileList: [],
            multipleSelection: [], // 所选文件
            currentPath: '',
            searchText: '',
            allSelect: false
        };
    },
    props: {
        bucketId: {
            type: String,
            default: ''
        },
        headerInfo: Object
    },
    components: {
        UploadFile,
        CreateFolder,
        Preview,
        DeleteFileDialog
    },
    watch: {
        multipleSelection: function(newval) {
            this.allSelect = newval.length && newval.length === this.fileNums;
        },
        bucketId: function() {
            this.currentPath = '';
            this.getFileList();
        }
    },
    computed: {
        fileNums: function() {
            try {
                return this.headerInfo.usage.rgwMain.num_objects;
            } catch (err) {
                return 0;
            }
        },
        fileSize: function() {
            try {
                return this.$options.filters.convertByteSize(this.headerInfo.usage.rgwMain.size, 2, 'string');
            } catch (err) {
                return 0;
            }
        },
        // 目录路径
        folderPath: function() {
            if (this.currentPath !== '') {
                let arr = this.currentPath.split('/');
                let path = '';
                let newarr = [];
                arr.forEach(key => {
                    path = path ? path + key + '/' : key + '/';
                    newarr.push({
                        path: path,
                        name: key
                    });
                });
                return newarr;
            }
            return [];
        },
        // 获取需要预览的文件列表
        previewFiles: function() {
            let files = [];
            this.fileList.forEach(file => {
                if (isObject(file)) files.push(file);
            });
            return files;
        }
    },
    created() {
        if (!isEmpty(this.bucketId)) {
            this.getFileList();
        }
    },
    methods: {
        // 判断表内容是文件还是文件夹 row对象为字符串时表示文件夹,否则为文件
        getRowType(row) {
            if (typeof row === 'string') {
                return true;
            }
            return false;
        },
        toggleAllSelection() {
            this.$refs.fileTable.toggleAllSelection();
        },
        // 加载文件列表数据
        getFileList() {
            this.loading = true;
            let post = {
                prefix: '',
                marker: '',
                delimiter: '',
                // limit: 10,
                bucketId: this.bucketId
            };
            getFileList(post)
                .then(res => {
                    if (res.code === this.CODE.SUCCESS_CODE) {
                        let dataList = res.data.objectSummaries || [];
                        let prefixes = res.data.commonPrefixes || [];
                        this.fileList = prefixes.concat(dataList);
                        $log(this.fileList);
                    }
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        // 搜索指定目录下的文件列表
        search(path = '') {
            this.loading = true;
            let post = {
                prefix: path,
                bucketId: this.bucketId,
                searchText: this.searchText
            };
            getFileList(post)
                .then(res => {
                    if (res.code === this.CODE.SUCCESS_CODE) {
                        let dataList = res.data.objectSummaries || [];
                        let prefixes = res.data.commonPrefixes || [];
                        this.fileList = prefixes.concat(dataList).filter(item => {
                            return item.key !== path;
                        });

                        $log(this.fileList);
                    }
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        // 点击目录事件
        selectFolder(path) {
            this.currentPath = path;
            this.search(path);
        },
        // 返回上一级目录
        returnLast() {
            let currentPath = this.currentPath;
            if (currentPath.indexOf('/') === -1 || currentPath.split('/').length === 2) {
                this.currentPath = '';
                this.search();
            } else if (currentPath.split('/').length > 2) {
                var path = this.currentPath.substring(0, currentPath.lastIndexOf('/'));
                var lastPath = path.substring(0, path.lastIndexOf('/') + 1);
                this.currentPath = lastPath;
                this.search(lastPath);
            }
        },
        // 显示上传文件弹框
        showUpload() {
            this.$refs.uploadFile.show();
        },
        // 创建目录弹框
        createFolder() {
            this.$refs.createFolder.show().then(res => {
                this.search(this.currentPath);
            });
        },
        // 当选择项发生变化时会触发该事件
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        // 返回值用来决定这一行的 CheckBox 是否可以勾选
        selectable(row, index) {
            return !this.getRowType(row);
        },
        // 删除单个文件或目录
        removeFileOne(file, type, index) {
            let files = [file];
            this.$refs.DeleteFileDialog.show(files, type).then(res => {
                this.search();
            });
            // let tips = '您确定要删除所选文件吗？';
            // tips += `<br/>${fileName}`;
            // tips += '<br/>共1个';
            // this.$confirm(tips, '删除', {
            //     type: 'warning',
            //     dangerouslyUseHTMLString: true
            // }).then(() => {
            //     removeFile(this.bucketId, [fileName], type)
            //         .then(res => {
            //             if (res.code === this.CODE.SUCCESS_CODE) {
            //                 this.$message.success('文件删除成功');
            //                 this.fileList.splice(index, 1);
            //             }
            //         })
            //         .catch(err => {
            //             $log(err);
            //         });
            // });
        },
        // 批量删除文件
        batchRemoveFile() {
            if (this.multipleSelection.length <= 0) {
                this.$message.info('请选择要删除的文件');
                return;
            }
            this.$refs.DeleteFileDialog.show(this.multipleSelection, 'more').then(res => {
                this.search();
            });
            // let tips = '您确定要删除所选文件吗？';
            // let fileName = [];
            // this.multipleSelection.forEach(file => {
            //     tips += `<br/>${file.key}`;
            //     fileName.push(file.key);
            // });
            // tips += '<br/>共' + this.multipleSelection.length + '个';

            // this.$confirm(tips, '删除', {
            //     type: 'warning',
            //     dangerouslyUseHTMLString: true
            // }).then(() => {
            //     removeFile(this.bucketId, fileName, 'more')
            //         .then(res => {
            //             if (res.code === this.CODE.SUCCESS_CODE) {
            //                 this.$message.success('文件删除成功');
            //                 this.search();
            //             }
            //         })
            //         .catch(err => {
            //             $log(err);
            //         });
            // });
        },
        // 下载文件
        downloadFile(fileKey, mimeType) {
            getFileLink(this.bucketId, fileKey)
                .then(res => {
                    if (res.code === this.CODE.SUCCESS_CODE) {
                        window.open(res.data);
                    }
                })
                .catch(err => {
                    $log(err);
                });
        },
        // 文件预览
        preview(file) {
            this.$refs.preview.show(file);
        }
    }
};
</script>
<style scoped>
</style>
