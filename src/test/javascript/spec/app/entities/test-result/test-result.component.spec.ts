/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Observable, of } from 'rxjs';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { PalaverTestModule } from '../../../test.module';
import { TestResultComponent } from 'app/entities/test-result/test-result.component';
import { TestResultService } from 'app/entities/test-result/test-result.service';
import { TestResult } from 'app/shared/model/test-result.model';

describe('Component Tests', () => {
    describe('TestResult Management Component', () => {
        let comp: TestResultComponent;
        let fixture: ComponentFixture<TestResultComponent>;
        let service: TestResultService;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [PalaverTestModule],
                declarations: [TestResultComponent],
                providers: []
            })
                .overrideTemplate(TestResultComponent, '')
                .compileComponents();

            fixture = TestBed.createComponent(TestResultComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(TestResultService);
        });

        it('Should call load all on init', () => {
            // GIVEN
            const headers = new HttpHeaders().append('link', 'link;link');
            spyOn(service, 'query').and.returnValue(
                of(
                    new HttpResponse({
                        body: [new TestResult('20')],
                        headers
                    })
                )
            );

            // WHEN
            comp.ngOnInit();

            // THEN
            expect(service.query).toHaveBeenCalled();
            expect(comp.testResults[0]).toEqual(jasmine.objectContaining({ id: 123 }));
        });
    });
});
