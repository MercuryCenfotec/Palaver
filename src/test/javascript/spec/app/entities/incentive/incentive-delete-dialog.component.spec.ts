/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, of } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';

import { PalaverTestModule } from '../../../test.module';
import { IncentiveDeleteDialogComponent } from 'app/entities/incentive/incentive-delete-dialog.component';
import { IncentiveService } from 'app/entities/incentive/incentive.service';

describe('Component Tests', () => {
    describe('Incentive Management Delete Component', () => {
        let comp: IncentiveDeleteDialogComponent;
        let fixture: ComponentFixture<IncentiveDeleteDialogComponent>;
        let service: IncentiveService;
        let mockEventManager: any;
        let mockActiveModal: any;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [PalaverTestModule],
                declarations: [IncentiveDeleteDialogComponent]
            })
                .overrideTemplate(IncentiveDeleteDialogComponent, '')
                .compileComponents();
            fixture = TestBed.createComponent(IncentiveDeleteDialogComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(IncentiveService);
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
