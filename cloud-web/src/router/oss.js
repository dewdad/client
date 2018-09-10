const Index = () => import('@/views/oss/Index.vue');
const Empty = () => import('@/views/oss/Empty.vue');
const Overview = () => import('@/views/oss/Overview.vue');
const Skeymgr = () => import('@/views/oss/skeymgr/Skeymgr.vue');
const Bucket = () => import('@/views/oss/bucket/Index.vue');
export default [
    {
        path: 'oss',
        name: 'app.oss',
        meta: {
            moduleName: '对象存储OSS'
        },
        redirect: '/app/oss/overview',
        component: Index,
        children: [
            {
                path: 'empty',
                name: 'app.oss.empty',
                component: Empty
            },
            {
                path: 'overview',
                name: 'app.oss.overview',
                component: Overview
            },
            {
                path: 'skeymgr',
                name: 'app.oss.skeymgr',
                component: Skeymgr
            },
            {
                path: 'bucket/:bucketId/:view',
                name: 'app.oss.bucket',
                // redirect: '/people/oss/bucket/overview',
                component: Bucket,
                meta: {
                    parentName: 'app.oss'
                }
            }
        ]
    }
];
