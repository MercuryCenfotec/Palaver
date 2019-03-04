/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';

import { PalaverTestModule } from '../../../test.module';
import { AptitudeTestUpdateComponent } from 'app/entities/aptitude-test/aptitude-test-update.component';
import { AptitudeTestService } from 'app/entities/aptitude-test/aptitude-test.service';
import { AptitudeTest } from 'app/shared/model/aptitude-test.model';

describe('Component Tests', () => {
    describe('AptitudeTest Management Update Component', () => {
        let comp: AptitudeTestUpdateComponent;
        let fixture: ComponentFixture<AptitudeTestUpdateComponent>;
        let service: AptitudeTestService;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [PalaverTestModule],
                declarations: [AptitudeTestUpdateComponent]
            })
                .overrideTemplate(AptitudeTestUpdateComponent, '')
                .compileComponents();

            fixture = TestBed.createComponent(AptitudeTestUpdateComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(AptitudeTestService);
        });

        describe('save', () => {
            it(
                'Should call update service on save for existing entity',
                fakeAsync(() => {
                    // GIVEN
                    const entity = new AptitudeTest(123);
                    spyOn(service, 'update').and.returnValue(of(new HttpResponse({ body: entity })));
                    comp.aptitudeTest = entity;
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
                    const entity = new AptitudeTest();
                    spyOn(service, 'create').and.returnValue(of(new HttpResponse({ body: entity })));
                    comp.aptitudeTest = entity;
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
