/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { PalaverTestModule } from '../../../test.module';
import { TestQuestionDetailComponent } from 'app/entities/test-question/test-question-detail.component';
import { TestQuestion } from 'app/shared/model/test-question.model';

describe('Component Tests', () => {
    describe('TestQuestion Management Detail Component', () => {
        let comp: TestQuestionDetailComponent;
        let fixture: ComponentFixture<TestQuestionDetailComponent>;
        const route = ({ data: of({ testQuestion: new TestQuestion(123) }) } as any) as ActivatedRoute;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [PalaverTestModule],
                declarations: [TestQuestionDetailComponent],
                providers: [{ provide: ActivatedRoute, useValue: route }]
            })
                .overrideTemplate(TestQuestionDetailComponent, '')
                .compileComponents();
            fixture = TestBed.createComponent(TestQuestionDetailComponent);
            comp = fixture.componentInstance;
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(comp.testQuestion).toEqual(jasmine.objectContaining({ id: 123 }));
            });
        });
    });
});
