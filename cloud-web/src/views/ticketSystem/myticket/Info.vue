<template>
    <div class="page-main">
        <!-- 头部 -->
        <page-header>
            <b class="leftBlueBox"></b>
            工单编号：201806281447409078
            <div slot="right">
                <el-button type="primary" size="small" icon="el-icon-edit-outline">补充</el-button>                
                <el-button type="info" size="small" icon="el-icon-delete">
                    删除
                </el-button>
            </div>
        </page-header>
        <!-- 基本信息 -->
        <div class="basicInfo panel panel-default mt20">
            <div class="panel-heading">
                <i class="iconfont icon-user_profile_people mr10"></i>工单详情
            </div>
            <div class="panel-body zt-panel-body-info">
                <table class="table zt-table-info">
                    <tbody>
                        <tr>
                            <td class="br"><span>问题标题：</span> <span class="color333 ml30">上传文件漏洞</span></td>
                            <td><span>优先级：</span><span class="color333 ml30">重要</span></td>
                        </tr>
                        <tr>
                            <td class="br"><span>提交时间：</span> <span class="color333 ml30">2018-06-28 14:47:40</span></td>
                            <td><span>状态：</span><span class="color333 ml30">待审核</span></td>
                        </tr>
                        <tr>
                            <td class="br"><span>受理时长：</span><span class="color090 ml30">25天20小时</span></td>
                            <td><span>产品类型：</span><span class="color333 ml30">文件上传/下载</span></td>
                        </tr>
                        <tr>
                            <td class="br"><span>故障类型：</span><span class="color333 ml30">对象存储OSS</span></td>
                            <td><span>实例ID：</span><span class="color333 ml30"></span></td>
                        </tr>
                        <tr>
                            <td class="br"><span>手机号码：</span><span class="color333 ml30">13875881590</span></td>
                            <td><span>邮箱：</span><span class="color333 ml30">87387q6678@qq.com</span></td>
                        </tr>
                        <tr>
                            <td class="br"><span>机密信息：</span><span class="color333 ml30">***</span></td>
                            <td></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
        <!-- 附件 -->
        <div class="basicInfo panel panel-default mt20">
            <div class="panel-heading">
                <i class="iconfont icon-user_profile_people mr10"></i>附件
            </div>
        </div>
        <!-- 补充记录 -->
        <div class="basicInfo panel panel-default mt20">
            <div class="panel-heading">
                <i class="iconfont icon-user_profile_people mr10"></i>补充记录
            </div>
            <div class="panel-body zt-panel-body-info">
                <div class="ml20 mb20 mt20 supplementaryRecord">
                    <img src="@/assets/images/ecs/top-head.svg" width="50" alt="">
                    <ul class="font12 ml20 color999">
                        <li>补充说明：</li>
                        <li>2018-06-28 14:47:40</li>
                        <li>附件：
                            <p><a class="zt-detail font12" href="https://www.meitiyun.com/people-web/file/getFile.do?fileName=Hello+World.jsp">Hello+World.jsp</a></p>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
        <!-- 沟通记录 -->
        <div class="basicInfo panel panel-default mt20">
            <div class="panel-heading">
                <i class="iconfont icon-user_profile_people mr10"></i>沟通记录
            </div>
            <div class="panel-body zt-panel-body-info">
                <div class="ml20 mb20 mt20">
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    
};
</script>
<style lang="scss" scoped>
.br{
     border-right: 1px solid #ddd;
 }
.zt-table-info td{
     width: 50%;
     color: #999999;
     padding-left: 20px;
     span:first-child{
        width: 100px;
        color: #999999;
        display: inline-block;
     }
 }
 .supplementaryRecord{
     &::after{
         content: '';
         display: block;
         clear: both;
     }
     ul, img{
        float: left;
     }
 }
</style>
