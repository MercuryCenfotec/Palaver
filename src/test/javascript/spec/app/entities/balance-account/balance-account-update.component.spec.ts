/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';

import { PalaverTestModule } from '../../../test.module';
import { BalanceAccountUpdateComponent } from 'app/entities/balance-account/balance-account-update.component';
import { BalanceAccountService } from 'app/entities/balance-account/balance-account.service';
import { BalanceAccount } from 'app/shared/model/balance-account.model';

describe('Component Tests', () => {
    describe('BalanceAccount Management Update Component', () => {
        let comp: BalanceAccountUpdateComponent;
        let fixture: ComponentFixture<BalanceAccountUpdateComponent>;
        let service: BalanceAccountService;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [PalaverTestModule],
                declarations: [BalanceAccountUpdateComponent]
            })
                .overrideTemplate(BalanceAccountUpdateComponent, '')
                .compileComponents();

            fixture = TestBed.createComponent(BalanceAccountUpdateComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(BalanceAccountService);
        });

        describe('save', () => {
            it(
                'Should call update service on save for existing entity',
                fakeAsync(() => {
                    // GIVEN
                    const entity = new BalanceAccount(123);
                    spyOn(service, 'update').and.returnValue(of(new HttpResponse({ body: entity })));
                    comp.balanceAccount = entity;
                    // WHEN
                    comp.save();
                    tick(); // simulate async

                    // THEN
                    expect(service.update).toHaveBeenCalledWith(entity);
                    expect(comp.isSaving).toEqual(false);
                })
            );

            it(
                'Should call create service on save for new entity',
                fakeAsync(() => {
                    // GIVEN
                    const entity = new BalanceAccount();
                    spyOn(service, 'create').and.returnValue(of(new HttpResponse({ body: entity })));
                    comp.balanceAccount = entity;
                    // WHEN
                    comp.save();
                    tick(); // simulate async

                    // THEN
                    expect(service.create).toHaveBeenCalledWith(entity);
                    expect(comp.isSaving).toEqual(false);
                })
            );
        });
    });
});
