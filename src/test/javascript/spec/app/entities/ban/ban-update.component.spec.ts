/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';

import { PalaverTestModule } from '../../../test.module';
import { BanUpdateComponent } from 'app/entities/ban/ban-update.component';
import { BanService } from 'app/entities/ban/ban.service';
import { Ban } from 'app/shared/model/ban.model';

describe('Component Tests', () => {
    describe('Ban Management Update Component', () => {
        let comp: BanUpdateComponent;
        let fixture: ComponentFixture<BanUpdateComponent>;
        let service: BanService;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [PalaverTestModule],
                declarations: [BanUpdateComponent]
            })
                .overrideTemplate(BanUpdateComponent, '')
                .compileComponents();

            fixture = TestBed.createComponent(BanUpdateComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(BanService);
        });

        describe('save', () => {
            it('Should call update service on save for existing entity', fakeAsync(() => {
                // GIVEN
                const entity = new Ban(123);
                spyOn(service, 'update').and.returnValue(of(new HttpResponse({ body: entity })));
                comp.ban = entity;
                // WHEN
                comp.save();
                tick(); // simulate async

                // THEN
                expect(service.update).toHaveBeenCalledWith(entity);
                expect(comp.isSaving).toEqual(false);
            }));

            it('Should call create service on save for new entity', fakeAsync(() => {
                // GIVEN
                const entity = new Ban();
                spyOn(service, 'create').and.returnValue(of(new HttpResponse({ body: entity })));
                comp.ban = entity;
                // WHEN
                comp.save();
                tick(); // simulate async

                // THEN
                expect(service.create).toHaveBeenCalledWith(entity);
                expect(comp.isSaving).toEqual(false);
            }));
        });
    });
});
