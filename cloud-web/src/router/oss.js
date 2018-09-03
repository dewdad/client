const Index = () => import('@/views/oss/Index.vue');
const Overview = () => import('@/views/oss/Overview.vue');
const Skeymgr = () => import('@/views/oss/skeymgr/Skeymgr.vue');
const Bucket = () => import('@/views/oss/bucket/Index.vue');
export default [{
    path: 'oss',
    name: 'app.oss',
    meta: {
        moduleName: '对象存储OSS'
    },
    redirect: '/people/oss/overview',
    component: Index,
    children: [{
        path: 'overview',
        name: 'app.oss.overview',
        component: Overview
    }, {
        path: 'skeymgr',
        name: 'app.oss.skeymgr',
        component: Skeymgr
    }, {
        path: 'bucket/:name/:view/:bucketId',
        name: 'app.oss.bucket',
        // redirect: '/people/oss/bucket/overview',
        component: Bucket,
        meta: {
            parentName: 'app.oss'
        }
    }]
}];
