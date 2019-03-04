/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';

import { PalaverTestModule } from '../../../test.module';
import { SystemVariableUpdateComponent } from 'app/entities/system-variable/system-variable-update.component';
import { SystemVariableService } from 'app/entities/system-variable/system-variable.service';
import { SystemVariable } from 'app/shared/model/system-variable.model';

describe('Component Tests', () => {
    describe('SystemVariable Management Update Component', () => {
        let comp: SystemVariableUpdateComponent;
        let fixture: ComponentFixture<SystemVariableUpdateComponent>;
        let service: SystemVariableService;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [PalaverTestModule],
                declarations: [SystemVariableUpdateComponent]
            })
                .overrideTemplate(SystemVariableUpdateComponent, '')
                .compileComponents();

            fixture = TestBed.createComponent(SystemVariableUpdateComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(SystemVariableService);
        });

        describe('save', () => {
            it(
                'Should call update service on save for existing entity',
                fakeAsync(() => {
                    // GIVEN
                    const entity = new SystemVariable(123);
                    spyOn(service, 'update').and.returnValue(of(new HttpResponse({ body: entity })));
                    comp.systemVariable = entity;
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
                    const entity = new SystemVariable();
                    spyOn(service, 'create').and.returnValue(of(new HttpResponse({ body: entity })));
                    comp.systemVariable = entity;
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
