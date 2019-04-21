/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { PalaverTestModule } from '../../../test.module';
import { TestResultDetailComponent } from 'app/entities/test-result/test-result-detail.component';
import { TestResult } from 'app/shared/model/test-result.model';

describe('Component Tests', () => {
    describe('TestResult Management Detail Component', () => {
        let comp: TestResultDetailComponent;
        let fixture: ComponentFixture<TestResultDetailComponent>;
        const route = ({ data: of({ testResult: new TestResult(null, '123') }) } as any) as ActivatedRoute;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [PalaverTestModule],
                declarations: [TestResultDetailComponent],
                providers: [{ provide: ActivatedRoute, useValue: route }]
            })
                .overrideTemplate(TestResultDetailComponent, '')
                .compileComponents();
            fixture = TestBed.createComponent(TestResultDetailComponent);
            comp = fixture.componentInstance;
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(comp.testResult).toEqual(jasmine.objectContaining({ id: 123 }));
            });
        });
    });
});
