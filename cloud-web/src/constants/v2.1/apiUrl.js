// ECS模块服务上下文为services-ecs
const ECS_CTRL = 'services-ecs';

// ecs模块
export const API_ECS = {
    network: {
        network: '/compute/v2.1/network/list',
        creatNetwork: '/compute/v2.1/network',
        networkID: '/compute/v2.1/network/{id}',
        flexIP: '/compute/floatip/list', // 查询浮动IP列表
        subnetList: '/compute/v2.1/network/subnet/list/{networkId}', // 查询子网列表
        bindFloatIP: '/compute/floatip/associateToPort/{floatIP}/{instIP}', // 绑定浮动IP
        routerList: '/compute/router/list', // 路由列表
        editRouter: '/compute/router/', // 添加或修改路由
        delRouter: '/compute/router/{id}', // 添加或修改路由
        getRouterInfo: '/compute/router/{routerId}', // 添加或修改路由
        applyFloatIP: '/compute/floatip', // 确认申请浮动IP
        delFloatIP: '/compute/floatip/{floatIP}', // 释放浮动IP
        networkCount: '/compute/network/{vpcId}', // 获取网络详情
        getNetwork: '/compute/server/getNetwork',
        addRoutePort: '/compute/router/router/addInterface',
        getSubnetByNetId: ECS_CTRL + '/networks/{networkId}/subnets',
        subnet: '/compute/v2.1/network/subnet/{networkId}',
        subnetID: '/compute/v2.1/network/subnet/{subnetId}'
    }
};
