/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Observable, of } from 'rxjs';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { PalaverTestModule } from '../../../test.module';
import { SystemVariableComponent } from 'app/entities/system-variable/system-variable.component';
import { SystemVariableService } from 'app/entities/system-variable/system-variable.service';
import { SystemVariable } from 'app/shared/model/system-variable.model';

describe('Component Tests', () => {
    describe('SystemVariable Management Component', () => {
        let comp: SystemVariableComponent;
        let fixture: ComponentFixture<SystemVariableComponent>;
        let service: SystemVariableService;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [PalaverTestModule],
                declarations: [SystemVariableComponent],
                providers: []
            })
                .overrideTemplate(SystemVariableComponent, '')
                .compileComponents();

            fixture = TestBed.createComponent(SystemVariableComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(SystemVariableService);
        });

        it('Should call load all on init', () => {
            // GIVEN
            const headers = new HttpHeaders().append('link', 'link;link');
            spyOn(service, 'query').and.returnValue(
                of(
                    new HttpResponse({
                        body: [new SystemVariable(123)],
                        headers
                    })
                )
            );

            // WHEN
            comp.ngOnInit();

            // THEN
            expect(service.query).toHaveBeenCalled();
            expect(comp.systemVariables[0]).toEqual(jasmine.objectContaining({ id: 123 }));
        });
    });
});
