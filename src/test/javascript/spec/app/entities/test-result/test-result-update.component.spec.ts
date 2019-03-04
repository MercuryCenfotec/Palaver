/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';

import { PalaverTestModule } from '../../../test.module';
import { TestResultUpdateComponent } from 'app/entities/test-result/test-result-update.component';
import { TestResultService } from 'app/entities/test-result/test-result.service';
import { TestResult } from 'app/shared/model/test-result.model';

describe('Component Tests', () => {
    describe('TestResult Management Update Component', () => {
        let comp: TestResultUpdateComponent;
        let fixture: ComponentFixture<TestResultUpdateComponent>;
        let service: TestResultService;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [PalaverTestModule],
                declarations: [TestResultUpdateComponent]
            })
                .overrideTemplate(TestResultUpdateComponent, '')
                .compileComponents();

            fixture = TestBed.createComponent(TestResultUpdateComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(TestResultService);
        });

        describe('save', () => {
            it(
                'Should call update service on save for existing entity',
                fakeAsync(() => {
                    // GIVEN
                    const entity = new TestResult(123);
                    spyOn(service, 'update').and.returnValue(of(new HttpResponse({ body: entity })));
                    comp.testResult = entity;
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
                    const entity = new TestResult();
                    spyOn(service, 'create').and.returnValue(of(new HttpResponse({ body: entity })));
                    comp.testResult = entity;
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
