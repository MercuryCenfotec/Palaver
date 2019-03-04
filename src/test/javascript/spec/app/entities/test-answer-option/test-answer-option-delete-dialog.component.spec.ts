/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, of } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';

import { PalaverTestModule } from '../../../test.module';
import { TestAnswerOptionDeleteDialogComponent } from 'app/entities/test-answer-option/test-answer-option-delete-dialog.component';
import { TestAnswerOptionService } from 'app/entities/test-answer-option/test-answer-option.service';

describe('Component Tests', () => {
    describe('TestAnswerOption Management Delete Component', () => {
        let comp: TestAnswerOptionDeleteDialogComponent;
        let fixture: ComponentFixture<TestAnswerOptionDeleteDialogComponent>;
        let service: TestAnswerOptionService;
        let mockEventManager: any;
        let mockActiveModal: any;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [PalaverTestModule],
                declarations: [TestAnswerOptionDeleteDialogComponent]
            })
                .overrideTemplate(TestAnswerOptionDeleteDialogComponent, '')
                .compileComponents();
            fixture = TestBed.createComponent(TestAnswerOptionDeleteDialogComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(TestAnswerOptionService);
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
