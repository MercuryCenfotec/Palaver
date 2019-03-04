/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';

import { PalaverTestModule } from '../../../test.module';
import { UserAppUpdateComponent } from 'app/entities/user-app/user-app-update.component';
import { UserAppService } from 'app/entities/user-app/user-app.service';
import { UserApp } from 'app/shared/model/user-app.model';

describe('Component Tests', () => {
    describe('UserApp Management Update Component', () => {
        let comp: UserAppUpdateComponent;
        let fixture: ComponentFixture<UserAppUpdateComponent>;
        let service: UserAppService;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [PalaverTestModule],
                declarations: [UserAppUpdateComponent]
            })
                .overrideTemplate(UserAppUpdateComponent, '')
                .compileComponents();

            fixture = TestBed.createComponent(UserAppUpdateComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(UserAppService);
        });

        describe('save', () => {
            it(
                'Should call update service on save for existing entity',
                fakeAsync(() => {
                    // GIVEN
                    const entity = new UserApp(123);
                    spyOn(service, 'update').and.returnValue(of(new HttpResponse({ body: entity })));
                    comp.userApp = entity;
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
                    const entity = new UserApp();
                    spyOn(service, 'create').and.returnValue(of(new HttpResponse({ body: entity })));
                    comp.userApp = entity;
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
