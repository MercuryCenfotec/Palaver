/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';

import { PalaverTestModule } from '../../../test.module';
import { FocusGroupUpdateComponent } from 'app/entities/focus-group/focus-group-update.component';
import { FocusGroupService } from 'app/entities/focus-group/focus-group.service';
import { FocusGroup } from 'app/shared/model/focus-group.model';

describe('Component Tests', () => {
    describe('FocusGroup Management Update Component', () => {
        let comp: FocusGroupUpdateComponent;
        let fixture: ComponentFixture<FocusGroupUpdateComponent>;
        let service: FocusGroupService;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [PalaverTestModule],
                declarations: [FocusGroupUpdateComponent]
            })
                .overrideTemplate(FocusGroupUpdateComponent, '')
                .compileComponents();

            fixture = TestBed.createComponent(FocusGroupUpdateComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(FocusGroupService);
        });

        describe('save', () => {
            it(
                'Should call update service on save for existing entity',
                fakeAsync(() => {
                    // GIVEN
                    const entity = new FocusGroup(123);
                    spyOn(service, 'update').and.returnValue(of(new HttpResponse({ body: entity })));
                    comp.focusGroup = entity;
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
                    const entity = new FocusGroup();
                    spyOn(service, 'create').and.returnValue(of(new HttpResponse({ body: entity })));
                    comp.focusGroup = entity;
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
