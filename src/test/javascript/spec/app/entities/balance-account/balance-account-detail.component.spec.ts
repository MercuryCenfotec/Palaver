/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { PalaverTestModule } from '../../../test.module';
import { BalanceAccountDetailComponent } from 'app/entities/balance-account/balance-account-detail.component';
import { BalanceAccount } from 'app/shared/model/balance-account.model';

describe('Component Tests', () => {
    describe('BalanceAccount Management Detail Component', () => {
        let comp: BalanceAccountDetailComponent;
        let fixture: ComponentFixture<BalanceAccountDetailComponent>;
        const route = ({ data: of({ balanceAccount: new BalanceAccount(123) }) } as any) as ActivatedRoute;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [PalaverTestModule],
                declarations: [BalanceAccountDetailComponent],
                providers: [{ provide: ActivatedRoute, useValue: route }]
            })
                .overrideTemplate(BalanceAccountDetailComponent, '')
                .compileComponents();
            fixture = TestBed.createComponent(BalanceAccountDetailComponent);
            comp = fixture.componentInstance;
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(comp.balanceAccount).toEqual(jasmine.objectContaining({ id: 123 }));
            });
        });
    });
});
