const MyTicketList = () => import('@/views/ticketSystem/MyTicketList.vue');
const Submitticket = () => import('@/views/ticketSystem/Submitticket.vue');
const Info = () => import('@/views/ticketSystem/myticket/Info.vue');

export default [
    {
        path: 'ticketSystem',
        name: 'app.ticketSystem',
        redirect: '/people/ticketSystem/myTicket',
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
                path: 'myTicket',
                name: 'app.ticketSystem.myTicket',
                component: MyTicketList
            },
            {
                path: 'myTicket/info/:id',
                name: 'app.ticketSystem.info',
                // component: Info,
                component: {
                    render(c) {
                        return c('router-view');
                    }
                },
                redirect: '/ticketSystem/myTicket/info',
                meta: {
                    showBack: true,
                    backUrl: 'app.ticketSystem.myTicket'
                },
                children: [
                    {
                        path: 'info',
                        name: 'app.ticketSystem.info',
                        component: Info
                    }
                ]
            }
        ]
    },
    {
        path: 'myTicket/submitticket',
        name: 'app.ticketSystem.submitticket',
        component: Submitticket
    },
];
