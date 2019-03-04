/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, of } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';

import { PalaverTestModule } from '../../../test.module';
import { TestResultDeleteDialogComponent } from 'app/entities/test-result/test-result-delete-dialog.component';
import { TestResultService } from 'app/entities/test-result/test-result.service';

describe('Component Tests', () => {
    describe('TestResult Management Delete Component', () => {
        let comp: TestResultDeleteDialogComponent;
        let fixture: ComponentFixture<TestResultDeleteDialogComponent>;
        let service: TestResultService;
        let mockEventManager: any;
        let mockActiveModal: any;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [PalaverTestModule],
                declarations: [TestResultDeleteDialogComponent]
            })
                .overrideTemplate(TestResultDeleteDialogComponent, '')
                .compileComponents();
            fixture = TestBed.createComponent(TestResultDeleteDialogComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(TestResultService);
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
