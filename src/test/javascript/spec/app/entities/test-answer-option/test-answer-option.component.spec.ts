/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Observable, of } from 'rxjs';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { PalaverTestModule } from '../../../test.module';
import { TestAnswerOptionComponent } from 'app/entities/test-answer-option/test-answer-option.component';
import { TestAnswerOptionService } from 'app/entities/test-answer-option/test-answer-option.service';
import { TestAnswerOption } from 'app/shared/model/test-answer-option.model';

describe('Component Tests', () => {
    describe('TestAnswerOption Management Component', () => {
        let comp: TestAnswerOptionComponent;
        let fixture: ComponentFixture<TestAnswerOptionComponent>;
        let service: TestAnswerOptionService;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [PalaverTestModule],
                declarations: [TestAnswerOptionComponent],
                providers: []
            })
                .overrideTemplate(TestAnswerOptionComponent, '')
                .compileComponents();

            fixture = TestBed.createComponent(TestAnswerOptionComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(TestAnswerOptionService);
        });

        it('Should call load all on init', () => {
            // GIVEN
            const headers = new HttpHeaders().append('link', 'link;link');
            spyOn(service, 'query').and.returnValue(
                of(
                    new HttpResponse({
                        body: [new TestAnswerOption(123)],
                        headers
                    })
                )
            );

            // WHEN
            comp.ngOnInit();

            // THEN
            expect(service.query).toHaveBeenCalled();
            expect(comp.testAnswerOptions[0]).toEqual(jasmine.objectContaining({ id: 123 }));
        });
    });
});
