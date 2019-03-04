/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, of } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';

import { PalaverTestModule } from '../../../test.module';
import { FocusGroupDeleteDialogComponent } from 'app/entities/focus-group/focus-group-delete-dialog.component';
import { FocusGroupService } from 'app/entities/focus-group/focus-group.service';

describe('Component Tests', () => {
    describe('FocusGroup Management Delete Component', () => {
        let comp: FocusGroupDeleteDialogComponent;
        let fixture: ComponentFixture<FocusGroupDeleteDialogComponent>;
        let service: FocusGroupService;
        let mockEventManager: any;
        let mockActiveModal: any;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [PalaverTestModule],
                declarations: [FocusGroupDeleteDialogComponent]
            })
                .overrideTemplate(FocusGroupDeleteDialogComponent, '')
                .compileComponents();
            fixture = TestBed.createComponent(FocusGroupDeleteDialogComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(FocusGroupService);
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
