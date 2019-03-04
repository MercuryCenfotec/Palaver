/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Observable, of } from 'rxjs';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { PalaverTestModule } from '../../../test.module';
import { TestQuestionComponent } from 'app/entities/test-question/test-question.component';
import { TestQuestionService } from 'app/entities/test-question/test-question.service';
import { TestQuestion } from 'app/shared/model/test-question.model';

describe('Component Tests', () => {
    describe('TestQuestion Management Component', () => {
        let comp: TestQuestionComponent;
        let fixture: ComponentFixture<TestQuestionComponent>;
        let service: TestQuestionService;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [PalaverTestModule],
                declarations: [TestQuestionComponent],
                providers: []
            })
                .overrideTemplate(TestQuestionComponent, '')
                .compileComponents();

            fixture = TestBed.createComponent(TestQuestionComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(TestQuestionService);
        });

        it('Should call load all on init', () => {
            // GIVEN
            const headers = new HttpHeaders().append('link', 'link;link');
            spyOn(service, 'query').and.returnValue(
                of(
                    new HttpResponse({
                        body: [new TestQuestion(123)],
                        headers
                    })
                )
            );

            // WHEN
            comp.ngOnInit();

            // THEN
            expect(service.query).toHaveBeenCalled();
            expect(comp.testQuestions[0]).toEqual(jasmine.objectContaining({ id: 123 }));
        });
    });
});
