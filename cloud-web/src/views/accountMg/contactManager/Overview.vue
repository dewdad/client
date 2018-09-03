<template>
    <div>
        <!-- 联系人管理： 头部 -->
        <page-header>
            联系人管理
            <div slot="right">
                <el-button type="primary" size="small" @click="addLinkman('', 1)">添加联系人</el-button>
                <el-button type="info" size="small" @click="getLinkManFn()">
                    <i class="iconfont icon-refresh_people"></i>
                </el-button>
            </div>
        </page-header>
        <!-- 主体 -->
        <div class="page-body contactBody">
            <!-- 提示 -->
            <el-alert  title="" type="warning" :closable="false">
                <span class="font12">以下联系人都可以设置为消息接收人，媒体云不会将这些信息对外披露或向第三方提供</span>
            </el-alert>
            <!-- table列表 -->
            <div class="mt10" v-loading="loadingState">
                <el-table :data="tableDataList" style="width: 100%" row-class-name="data-list" header-row-class-name="data-list" border class="data-list">
                    <template v-for="col in cols">
                        <!-- 姓名 -->
                        <template v-if="col.column=='name'">
                            <el-table-column :prop="col.column" :label="col.text" :key="col.column" resizable>
                                <template slot-scope="scope">
                                    <i class="iconfont icon-lianxirenguanli font14 mr5"  v-show="scope.row.type === 1"></i>
                                    <span class="mr5">{{scope.row.name}}</span>
                                </template>
                            </el-table-column>
                        </template>
                        <!-- 邮箱 -->
                        <template v-if="col.column=='email'">
                            <el-table-column :prop="col.column" :label="col.text" :key="col.column" resizable>
                                <template slot-scope="scope">
                                    <span class="mr5 mt5 mb5 inline-block">{{scope.row.email}}</span>
                                    <span v-show="scope.row.type !== 1 && scope.row.email">
                                        <i class="iconfont icon-chenggong color-success" v-show="scope.row.emailStatus === '1'"></i>
                                        <el-popover placement="right" trigger="hover">
                                                <span class="lh14">邮箱未验证，不能接受消息</span><br>
                                                <a class="font12" @click="sendEmailValidateFn(scope.row, 1)">重新发送验证邮件</a>
                                            <i slot="reference" class="iconfont icon-wuuiconsuotanhao color-warning" v-show="scope.row.emailStatus === '0'"></i>
                                        </el-popover>
                                    </span>
                                    <!-- 修改 (账号联系人信息栏出现) -->
                                    <router-link v-show="scope.row.type === 1 && scope.row.email" class="padding0" :to="{name: 'user.changeMailBox'}">修改</router-link>
                                </template>
                            </el-table-column>
                        </template>
                        <!-- 手机 -->
                        <template v-if="col.column=='mobile'">
                            <el-table-column :prop="col.column" :label="col.text" width="280px" :key="col.column" resizable>
                                <template slot-scope="scope">
                                    <span class="mr5">{{scope.row.mobile | mobileReplace}}</span>
                                    <span v-show="scope.row.type !== 1">
                                        <i class="iconfont icon-chenggong color-success" v-show="scope.row.mobileStatus !== '0'"></i>
                                        <el-popover placement="right" trigger="hover">
                                                <span class="lh14">手机号码未验证，不能接受消息</span><br>
                                                <a class="font12" @click="getMobileCode(scope.row.mobile)" :disabled="time > 0">重新发送验证码</a>
                                                <timer class="color-secondary" v-if="time[getTimer(scope.row.mobile)] && time[getTimer(scope.row.mobile)].time"  v-model="time[getTimer(scope.row.mobile)].time">s</timer>
                                            <i slot="reference" class="iconfont icon-wuuiconsuotanhao color-warning" v-show="scope.row.mobileStatus === '0'"></i>
                                        </el-popover>
                                        <!-- 填写短信验证码 -->
                                        <span v-if="getTimer(scope.row.mobile) >= 0 && time[getTimer(scope.row.mobile)]">
                                            <el-input placeholder="短信验证码" :class="{'messageInput': messageInput && mobileNumber === scope.row.mobile}"  class="note-input ml10" size="small" v-model="time[getTimer(scope.row.mobile)].mobileVal"></el-input>
                                            <el-button class="ml10" type="primary" @click="checkmobileCode(scope.row, time[getTimer(scope.row.mobile)].mobileVal)" size="small">确定</el-button>
                                        </span>
                                    </span>
                                    <!-- 修改 (账号联系人信息栏出现) -->
                                    <router-link v-show="scope.row.type === 1" class="padding0" :to="{name: 'user.bindmobile'}">修改</router-link>
                                </template>
                            </el-table-column>
                        </template>
                        <!-- 职位 -->
                        <template v-if="col.column=='position'">
                            <el-table-column :prop="col.column" :label="col.text" :key="col.column" resizable>
                            </el-table-column>
                        </template>
                    </template>
                    <el-table-column :label="$t('common.tableHeaderOperateText')" key="op" width="150" class-name="option-column">
                        <template slot-scope="scope">
                            <span v-if="scope.row.type === 1">
                                <!-- <a class="pad-r0" @click="addLinkman(scope.row, 0)">修改</a> -->
                            </span>
                            <span v-else>
                                <a @click="addLinkman(scope.row, 2)">修改</a>
                                <b class="link-division-symbol"></b>
                                <a class="pad-r0" @click="mobileCodeDialogFn(scope.row.id)">删除</a>
                            </span>
                            
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </div>
        <!-- 添加联系人 -->
        <linkman-dialog ref="LinkmanDialog"></linkman-dialog>
        <!-- 手机身份验证 -->
        <mobile-code-dialog ref="MobileCodeDialog"></mobile-code-dialog>
    </div>
</template>
<script src="./Manager.js"></script>
<style lang="scss">
.contactBody {
  .messageInput {
    .el-input__inner {
      border: 1px solid red;
    }
  }
  .note-input {
    width: 100px;
    display: inline-block;
  }
}

.pad-r0 {
  padding-right: 0 !important;
}
</style>

