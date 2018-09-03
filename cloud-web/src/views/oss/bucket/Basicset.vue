<template>
    <div class="basicset">
        <!-- 权限设置 -->
        <section class="section">
            <h3>权限设置</h3>
            <div class="section-inner">
                <div class="item">
                    <label class="name"></label>
                    <div class="item-content">OSS ACL提供Bucket级别的权限访问控制，了解
                        <a>读写权限设置</a>
                    </div>
                </div>
                <div class="item">
                    <label class="name">读写权限</label>
                    <div class="item-content">
                        <!-- <div>私有</div> -->
                        <div>
                            <el-radio-group v-model="rwAuth" class="primary" size="small">
                                <el-radio label="true" border>私有</el-radio>
                                <el-radio label="false" border>公开读</el-radio>
                            </el-radio-group>
                            <span class="helptips color-danger">公开：对文件写操作需要进行身份验证;可以对文件进行匿名读。</span>
                            <!-- <span  class="helptips">私有：对文件的所有访问操作需要进行身份验证。</span> -->
                        </div>
                        <el-button type="info" size="small">
                            设置
                        </el-button>
                        <el-button type="primary" size="small">
                            保存
                        </el-button>
                        <el-button type="info" size="small">
                            取消
                        </el-button>
                    </div>
                </div>
            </div>
        </section>
        <!-- 静态页面 -->
        <section class="section">
            <h3>静态页面</h3>
            <div class="section-inner">
                <div class="item">
                    <label class="name"></label>
                    <div class="item-content">对象存储支持将自己的存储空间配置成静态网站托管模式，了解
                        <a>静态网站托管使用指南</a>
                    </div>
                </div>
                <div class="item">
                    <label class="name">默认首页</label>
                    <div class="item-content">
                        <!-- <div>未设置</div> -->
                        <div>
                            <el-input placeholder="选择文件" size="small" style="width:400px;">
                                <template slot="append">选择文件</template>
                            </el-input>
                            <span class="helptips">仅支持 html 格式的文件，上传的文件将保存到存储空间根目录下，为空则不启用默认首页设置。</span>
                        </div>
                    </div>
                </div>
                <div class="item">
                    <label class="name">默认404</label>
                    <div class="item-content">
                        <!-- <div>未设置</div> -->
                        <div>
                            <el-input placeholder="选择文件" size="small" style="width:400px;">
                                <template slot="append">选择文件</template>
                            </el-input>
                            <span class="helptips">仅支持 html、jpg、png、bmp、webp 格式的文件，上传的文件将保存到存储空间根目录下，为空则不启用默认 404 页设置。</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
        <!-- 防盗链 -->
        <section class="section">
            <h3>防盗链</h3>
            <div class="section-inner">
                <div class="item">
                    <label class="name"></label>
                    <div class="item-content">对象存储提供 HTTP Referer 白名单配置，用于防止盗链，了解
                        <a>设置防盗链使用指南</a>
                    </div>
                </div>
                <div class="item">
                    <label class="name">Referer</label>
                    <div class="item-content">
                        <!-- <div>未设置</div> -->
                        <div>
                            <el-input type="textarea" style="width: 400px;" resize="none" placeholder="请输入内容">
                            </el-input>
                        </div>
                    </div>
                </div>
                <div class="item">
                    <label class="name">允许空Referer</label>
                    <div class="item-content">
                        <!-- <div>未设置</div> -->
                        <div>
                            <el-switch>
                            </el-switch>
                        </div>
                        <div>
                            <el-button type="primary" size="small">
                                保存
                            </el-button>
                            <el-button type="info" size="small">
                                取消
                            </el-button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
        <!-- 镜像回源 -->
        <section class="section">
            <h3>镜像回源</h3>
            <div class="section-inner">
                <div class="item">
                    <label class="name"></label>
                    <div class="item-content">设置镜像存储 ，源站资源（文件/图片等）根据初次访问自动同步到媒体云存储，数据平滑迁移。可使用绑定的自定义域名访问镜像存储的源站资源，了解
                        <a>回源设置使用指南</a>
                    </div>
                </div>
                <div class="item">
                    <label class="name">镜像源</label>
                    <div class="item-content">
                        <!-- <div>未设置</div> -->
                        <div>
                            <el-input placeholder="请输入内容" size="small" style="width: 400px;"></el-input>
                        </div>
                        <div>
                            <el-button type="primary" size="small">
                                保存
                            </el-button>
                            <el-button type="info" size="small">
                                取消
                            </el-button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </div>
</template>
<script>
export default {
    name: 'Basicset',
    data() {
        return {
            rwAuth: 'false'
        };
    }
};
</script>
<style scoped lang="scss">
.section {
    position: relative;
    &:not(:first-child) {
        padding-top: 10px;
    }
    padding-bottom: 15px;
    h3 {
        margin: 0px;
        font-size: 14px;
        line-height: 32px;
        font-weight: 500;
    }
    &::after {
        content: '';
        position: absolute;
        left: 0;
        bottom: 0;
        width: 100%;
        height: 2px;
        background-color: #e4e7ed;
        z-index: 1;
    }
    .section-inner {
        padding-left: 50px;
        .item {
            display: flex;
            margin-bottom: 10px;
            label.name {
                display: inline-block;
                width: 100px;
                font-weight: 500;
                margin-right: 24px;
                text-align: right;
                vertical-align: top;
                padding-top: 5px;
            }
            .item-content {
                color: #999;
                line-height: 30px;
                text-align: left;
                flex:1;
                display: inline-block;
                .el-button {
                    margin-top: 10px;
                }
                .helptips {
                    display: block;
                }
            }
        }
    }
}
</style>
