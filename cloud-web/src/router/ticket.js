const MyTicketList = () => import('@/views/ticketSystem/MyTicketList.vue');
const Submitticket = () => import('@/views/ticketSystem/Submitticket.vue');
const Info = () => import('@/views/ticketSystem/myticket/Info.vue');

export default [
    {
        path: 'ticketSystem',
        name: 'app.ticketSystem',
        redirect: '/people/ticketSystem/myTicket-list',
        meta: {
            moduleName: '工单系统'
        },
        component: {
            render (c) { 
                return c('router-view'); 
            }
        },
        children: [
            {
                path: 'myTicket-list',
                name: 'app.ticketSystem.myTicket-list',
                component: MyTicketList
            },
            {
                path: 'submitticket',
                name: 'app.ticketSystem.submitticket',
                component: Submitticket
            },
            {
                path: 'myticket/info/:id',
                name: 'app.ticketSystem.myticket.info',
                component: Info
            }
        ]
    }
];
