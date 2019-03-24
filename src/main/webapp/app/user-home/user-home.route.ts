import { Route } from '@angular/router';
import { UserHomeComponent } from 'app/user-home/user-home.component';

export const USER_HOME_ROUTE: Route = {
    path: 'participant-home',
    component: UserHomeComponent,
    data: {
        authorities: ['ROLE_USER']
    }
};
