import './vendor.ts';
import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgbDatepickerConfig } from '@ng-bootstrap/ng-bootstrap';
import { Ng2Webstorage } from 'ngx-webstorage';
import { NgJhipsterModule } from 'ng-jhipster';
import { AuthInterceptor } from './blocks/interceptor/auth.interceptor';
import { AuthExpiredInterceptor } from './blocks/interceptor/auth-expired.interceptor';
import { ErrorHandlerInterceptor } from './blocks/interceptor/errorhandler.interceptor';
import { NotificationInterceptor } from './blocks/interceptor/notification.interceptor';
import { PalaverSharedModule } from 'app/shared';
import { PalaverCoreModule } from 'app/core';
import { PalaverAppRoutingModule } from './app-routing.module';
import { PalaverHomeModule } from './home/home.module';
import { PalaverAccountModule } from './account/account.module';
import { PalaverEntityModule } from './entities/entity.module';
import * as moment from 'moment';
// jhipster-needle-angular-add-module-import JHipster will add new module here
import { JhiMainComponent, NavbarComponent, FooterComponent, PageRibbonComponent, ErrorComponent } from './layouts';
import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es-CR';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { UserHomeComponent } from './user-home/user-home.component';
import { PalaverUserHomeModule } from 'app/user-home/user-home.module';
import { DashboardInstitutionComponent } from './dashboard-institution/dashboard-institution.component';
import { PalaverDashboardInstitutionModule } from 'app/dashboard-institution/dashboard-institution.module';
import { ParticipantExpulsionsComponent } from './participant-expulsions/participant-expulsions.component';
import {PalaverParticipantExpulsionsModule} from 'app/participant-expulsions/participant-expulsions.module';

registerLocaleData(localeEs);

@NgModule({
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        Ng2Webstorage.forRoot({ prefix: 'jhi', separator: '-' }),
        NgJhipsterModule.forRoot({
            // set below to true to make alerts look like toast
            alertAsToast: false,
            alertTimeout: 5000
        }),
        PalaverSharedModule.forRoot(),
        PalaverCoreModule,
        PalaverHomeModule,
        PalaverUserHomeModule,
        PalaverParticipantExpulsionsModule,
        PalaverAccountModule,
        PalaverDashboardInstitutionModule,
        Ng2SearchPipeModule,
        // jhipster-needle-angular-add-module JHipster will add new module here
        PalaverEntityModule,
        PalaverAppRoutingModule
        // jhipster-needle-angular-add-module JHipster will add new module here
    ],
    declarations: [JhiMainComponent, NavbarComponent, ErrorComponent, PageRibbonComponent, FooterComponent],
    providers: [
        {
            provide: HTTP_INTERCEPTORS,
            useClass: AuthInterceptor,
            multi: true
        },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: AuthExpiredInterceptor,
            multi: true
        },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: ErrorHandlerInterceptor,
            multi: true
        },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: NotificationInterceptor,
            multi: true
        },
        { provide: LOCALE_ID, useValue: 'es-CR' }
    ],
    bootstrap: [JhiMainComponent]
})
export class PalaverAppModule {
    constructor(private dpConfig: NgbDatepickerConfig) {
        this.dpConfig.minDate = { year: moment().year() - 100, month: 1, day: 1 };
    }
}
