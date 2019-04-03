import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { PalaverSharedModule } from 'app/shared';
import { USER_HOME_ROUTE } from 'app/user-home/user-home.route';
import { UserHomeComponent } from 'app/user-home/user-home.component';
import { ParticipantFGFilterPipe } from 'app/user-home/filter.pipe';

@NgModule({
    imports: [PalaverSharedModule, RouterModule.forChild([USER_HOME_ROUTE])],
    declarations: [UserHomeComponent, ParticipantFGFilterPipe],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class PalaverUserHomeModule {}
