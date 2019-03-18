import { NgModule } from '@angular/core';
import { PalaverSharedLibsModule, JhiAlertComponent, JhiAlertErrorComponent } from './';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { NgbDatepickerModule, NgbModalModule, NgbTimepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';

@NgModule({
    imports: [
        PalaverSharedLibsModule,
        CalendarModule.forRoot({
            provide: DateAdapter,
            useFactory: adapterFactory
        }),
        NgbModalModule.forRoot(),
        NgbDatepickerModule.forRoot(),
        NgbTimepickerModule.forRoot()
    ],
    declarations: [JhiAlertComponent, JhiAlertErrorComponent],
    exports: [
        JhiAlertComponent,
        PalaverSharedLibsModule,
        JhiAlertErrorComponent,
        CalendarModule,
        NgbModalModule,
        NgbDatepickerModule,
        NgbTimepickerModule
    ]
})
export class PalaverSharedCommonModule {}
