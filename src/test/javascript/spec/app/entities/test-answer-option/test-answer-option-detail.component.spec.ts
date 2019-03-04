/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { PalaverTestModule } from '../../../test.module';
import { TestAnswerOptionDetailComponent } from 'app/entities/test-answer-option/test-answer-option-detail.component';
import { TestAnswerOption } from 'app/shared/model/test-answer-option.model';

describe('Component Tests', () => {
    describe('TestAnswerOption Management Detail Component', () => {
        let comp: TestAnswerOptionDetailComponent;
        let fixture: ComponentFixture<TestAnswerOptionDetailComponent>;
        const route = ({ data: of({ testAnswerOption: new TestAnswerOption(123) }) } as any) as ActivatedRoute;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [PalaverTestModule],
                declarations: [TestAnswerOptionDetailComponent],
                providers: [{ provide: ActivatedRoute, useValue: route }]
            })
                .overrideTemplate(TestAnswerOptionDetailComponent, '')
                .compileComponents();
            fixture = TestBed.createComponent(TestAnswerOptionDetailComponent);
            comp = fixture.componentInstance;
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(comp.testAnswerOption).toEqual(jasmine.objectContaining({ id: 123 }));
            });
        });
    });
});
