/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Observable, of } from 'rxjs';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { PalaverTestModule } from '../../../test.module';
import { BalanceAccountComponent } from 'app/entities/balance-account/balance-account.component';
import { BalanceAccountService } from 'app/entities/balance-account/balance-account.service';
import { BalanceAccount } from 'app/shared/model/balance-account.model';

describe('Component Tests', () => {
    describe('BalanceAccount Management Component', () => {
        let comp: BalanceAccountComponent;
        let fixture: ComponentFixture<BalanceAccountComponent>;
        let service: BalanceAccountService;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [PalaverTestModule],
                declarations: [BalanceAccountComponent],
                providers: []
            })
                .overrideTemplate(BalanceAccountComponent, '')
                .compileComponents();

            fixture = TestBed.createComponent(BalanceAccountComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(BalanceAccountService);
        });

        it('Should call load all on init', () => {
            // GIVEN
            const headers = new HttpHeaders().append('link', 'link;link');
            spyOn(service, 'query').and.returnValue(
                of(
                    new HttpResponse({
                        body: [new BalanceAccount(123)],
                        headers
                    })
                )
            );

            // WHEN
            comp.ngOnInit();

            // THEN
            expect(service.query).toHaveBeenCalled();
            expect(comp.balanceAccounts[0]).toEqual(jasmine.objectContaining({ id: 123 }));
        });
    });
});
