/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';

import { PalaverTestModule } from '../../../test.module';
import { IncentiveUpdateComponent } from 'app/entities/incentive/incentive-update.component';
import { IncentiveService } from 'app/entities/incentive/incentive.service';
import { Incentive } from 'app/shared/model/incentive.model';

describe('Component Tests', () => {
    describe('Incentive Management Update Component', () => {
        let comp: IncentiveUpdateComponent;
        let fixture: ComponentFixture<IncentiveUpdateComponent>;
        let service: IncentiveService;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [PalaverTestModule],
                declarations: [IncentiveUpdateComponent]
            })
                .overrideTemplate(IncentiveUpdateComponent, '')
                .compileComponents();

            fixture = TestBed.createComponent(IncentiveUpdateComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(IncentiveService);
        });

        describe('save', () => {
            it(
                'Should call update service on save for existing entity',
                fakeAsync(() => {
                    // GIVEN
                    const entity = new Incentive(123);
                    spyOn(service, 'update').and.returnValue(of(new HttpResponse({ body: entity })));
                    comp.incentive = entity;
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
                    const entity = new Incentive();
                    spyOn(service, 'create').and.returnValue(of(new HttpResponse({ body: entity })));
                    comp.incentive = entity;
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
