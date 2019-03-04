/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, of } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';

import { PalaverTestModule } from '../../../test.module';
import { SystemVariableDeleteDialogComponent } from 'app/entities/system-variable/system-variable-delete-dialog.component';
import { SystemVariableService } from 'app/entities/system-variable/system-variable.service';

describe('Component Tests', () => {
    describe('SystemVariable Management Delete Component', () => {
        let comp: SystemVariableDeleteDialogComponent;
        let fixture: ComponentFixture<SystemVariableDeleteDialogComponent>;
        let service: SystemVariableService;
        let mockEventManager: any;
        let mockActiveModal: any;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [PalaverTestModule],
                declarations: [SystemVariableDeleteDialogComponent]
            })
                .overrideTemplate(SystemVariableDeleteDialogComponent, '')
                .compileComponents();
            fixture = TestBed.createComponent(SystemVariableDeleteDialogComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(SystemVariableService);
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
