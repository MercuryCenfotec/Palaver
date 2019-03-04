import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: 'user-app',
                loadChildren: './user-app/user-app.module#PalaverUserAppModule'
            },
            {
                path: 'participant',
                loadChildren: './participant/participant.module#PalaverParticipantModule'
            },
            {
                path: 'institution',
                loadChildren: './institution/institution.module#PalaverInstitutionModule'
            },
            {
                path: 'incentive',
                loadChildren: './incentive/incentive.module#PalaverIncentiveModule'
            },
            {
                path: 'aptitude-test',
                loadChildren: './aptitude-test/aptitude-test.module#PalaverAptitudeTestModule'
            },
            {
                path: 'test-result',
                loadChildren: './test-result/test-result.module#PalaverTestResultModule'
            },
            {
                path: 'test-question',
                loadChildren: './test-question/test-question.module#PalaverTestQuestionModule'
            },
            {
                path: 'test-answer-option',
                loadChildren: './test-answer-option/test-answer-option.module#PalaverTestAnswerOptionModule'
            },
            {
                path: 'focus-group',
                loadChildren: './focus-group/focus-group.module#PalaverFocusGroupModule'
            },
            {
                path: 'meeting',
                loadChildren: './meeting/meeting.module#PalaverMeetingModule'
            },
            {
                path: 'membership',
                loadChildren: './membership/membership.module#PalaverMembershipModule'
            },
            {
                path: 'payment-method',
                loadChildren: './payment-method/payment-method.module#PalaverPaymentMethodModule'
            },
            {
                path: 'system-variable',
                loadChildren: './system-variable/system-variable.module#PalaverSystemVariableModule'
            },
            {
                path: 'category',
                loadChildren: './category/category.module#PalaverCategoryModule'
            },
            {
                path: 'balance-account',
                loadChildren: './balance-account/balance-account.module#PalaverBalanceAccountModule'
            },
            {
                path: 'payment',
                loadChildren: './payment/payment.module#PalaverPaymentModule'
            }
            /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
        ])
    ],
    declarations: [],
    entryComponents: [],
    providers: [],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class PalaverEntityModule {}
