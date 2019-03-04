/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';

import { PalaverTestModule } from '../../../test.module';
import { TestQuestionUpdateComponent } from 'app/entities/test-question/test-question-update.component';
import { TestQuestionService } from 'app/entities/test-question/test-question.service';
import { TestQuestion } from 'app/shared/model/test-question.model';

describe('Component Tests', () => {
    describe('TestQuestion Management Update Component', () => {
        let comp: TestQuestionUpdateComponent;
        let fixture: ComponentFixture<TestQuestionUpdateComponent>;
        let service: TestQuestionService;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [PalaverTestModule],
                declarations: [TestQuestionUpdateComponent]
            })
                .overrideTemplate(TestQuestionUpdateComponent, '')
                .compileComponents();

            fixture = TestBed.createComponent(TestQuestionUpdateComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(TestQuestionService);
        });

        describe('save', () => {
            it(
                'Should call update service on save for existing entity',
                fakeAsync(() => {
                    // GIVEN
                    const entity = new TestQuestion(123);
                    spyOn(service, 'update').and.returnValue(of(new HttpResponse({ body: entity })));
                    comp.testQuestion = entity;
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
                    const entity = new TestQuestion();
                    spyOn(service, 'create').and.returnValue(of(new HttpResponse({ body: entity })));
                    comp.testQuestion = entity;
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
