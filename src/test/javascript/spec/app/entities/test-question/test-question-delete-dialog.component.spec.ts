/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, of } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';

import { PalaverTestModule } from '../../../test.module';
import { TestQuestionDeleteDialogComponent } from 'app/entities/test-question/test-question-delete-dialog.component';
import { TestQuestionService } from 'app/entities/test-question/test-question.service';
import { ITestQuestion } from 'app/shared/model/test-question.model';

describe('Component Tests', () => {
    describe('TestQuestion Management Delete Component', () => {
        let comp: TestQuestionDeleteDialogComponent;
        let fixture: ComponentFixture<TestQuestionDeleteDialogComponent>;
        let service: TestQuestionService;
        let testQuestion: ITestQuestion;
        let mockEventManager: any;
        let mockActiveModal: any;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [PalaverTestModule],
                declarations: [TestQuestionDeleteDialogComponent]
            })
                .overrideTemplate(TestQuestionDeleteDialogComponent, '')
                .compileComponents();
            fixture = TestBed.createComponent(TestQuestionDeleteDialogComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(TestQuestionService);
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
                    comp.confirmDelete(testQuestion);
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
