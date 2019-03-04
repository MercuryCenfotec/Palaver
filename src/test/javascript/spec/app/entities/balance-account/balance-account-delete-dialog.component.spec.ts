/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, of } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';

import { PalaverTestModule } from '../../../test.module';
import { BalanceAccountDeleteDialogComponent } from 'app/entities/balance-account/balance-account-delete-dialog.component';
import { BalanceAccountService } from 'app/entities/balance-account/balance-account.service';

describe('Component Tests', () => {
    describe('BalanceAccount Management Delete Component', () => {
        let comp: BalanceAccountDeleteDialogComponent;
        let fixture: ComponentFixture<BalanceAccountDeleteDialogComponent>;
        let service: BalanceAccountService;
        let mockEventManager: any;
        let mockActiveModal: any;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [PalaverTestModule],
                declarations: [BalanceAccountDeleteDialogComponent]
            })
                .overrideTemplate(BalanceAccountDeleteDialogComponent, '')
                .compileComponents();
            fixture = TestBed.createComponent(BalanceAccountDeleteDialogComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(BalanceAccountService);
            mockEventManager = fixture.debugElement.injector.get(JhiEventManager);
            mockActiveModal = fixture.debugElement.injector.get(NgbActiveModal);
        });

        describe('confirmDelete', () => {
            it('Should call delete service on confirmDelete', inject(
                [],
                fakeAsync(() => {
                    // GIVEN
                    spyOn(service, 'delete').and.returnValue(of({}));

                    // WHEN
                    comp.confirmDelete(123);
                    tick();

                    // THEN
                    expect(service.delete).toHaveBeenCalledWith(123);
                    expect(mockActiveModal.dismissSpy).toHaveBeenCalled();
                    expect(mockEventManager.broadcastSpy).toHaveBeenCalled();
                })
            ));
        });
    });
});
