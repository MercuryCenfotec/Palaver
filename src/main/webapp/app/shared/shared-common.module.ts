import { NgModule } from '@angular/core';
import { DragulaModule } from 'ng2-dragula';
import { ClipboardModule } from 'ngx-clipboard';
import { PalaverSharedLibsModule, JhiAlertComponent, JhiAlertErrorComponent } from './';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { NgbDatepickerModule, NgbModalModule, NgbPopoverModule, NgbTimepickerModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
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
        NgbTimepickerModule.forRoot(),
        DragulaModule.forRoot(),
        ClipboardModule,
        NgbTooltipModule,
        NgbPopoverModule
    ],
    declarations: [JhiAlertComponent, JhiAlertErrorComponent],
    exports: [
        JhiAlertComponent,
        PalaverSharedLibsModule,
        JhiAlertErrorComponent,
        CalendarModule,
        NgbModalModule,
        NgbDatepickerModule,
        NgbTimepickerModule,
        DragulaModule,
        ClipboardModule
    ]
})
export class PalaverSharedCommonModule {}
