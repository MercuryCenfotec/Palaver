/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';

import { PalaverTestModule } from '../../../test.module';
import { TestAnswerOptionUpdateComponent } from 'app/entities/test-answer-option/test-answer-option-update.component';
import { TestAnswerOptionService } from 'app/entities/test-answer-option/test-answer-option.service';
import { TestAnswerOption } from 'app/shared/model/test-answer-option.model';

describe('Component Tests', () => {
    describe('TestAnswerOption Management Update Component', () => {
        let comp: TestAnswerOptionUpdateComponent;
        let fixture: ComponentFixture<TestAnswerOptionUpdateComponent>;
        let service: TestAnswerOptionService;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [PalaverTestModule],
                declarations: [TestAnswerOptionUpdateComponent]
            })
                .overrideTemplate(TestAnswerOptionUpdateComponent, '')
                .compileComponents();

            fixture = TestBed.createComponent(TestAnswerOptionUpdateComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(TestAnswerOptionService);
        });

        describe('save', () => {
            it(
                'Should call update service on save for existing entity',
                fakeAsync(() => {
                    // GIVEN
                    const entity = new TestAnswerOption(123);
                    spyOn(service, 'update').and.returnValue(of(new HttpResponse({ body: entity })));
                    comp.testAnswerOption = entity;
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
                    const entity = new TestAnswerOption();
                    spyOn(service, 'create').and.returnValue(of(new HttpResponse({ body: entity })));
                    comp.testAnswerOption = entity;
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
