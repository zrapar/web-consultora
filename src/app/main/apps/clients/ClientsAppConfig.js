import React from 'react';
import {Redirect} from 'react-router-dom';

export const ClientsAppConfig = {
    settings: {
        layout: {
            config: {}
        }
    },
    routes  : [
        {
            path     : '/apps/clients/:id',
            component: React.lazy(() => import('./ClientsApp'))
        },
        {
            path     : '/apps/clients',
            component: () => <Redirect to="/apps/clients/all"/>
        }
    ]
};
