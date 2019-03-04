/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { PalaverTestModule } from '../../../test.module';
import { SystemVariableDetailComponent } from 'app/entities/system-variable/system-variable-detail.component';
import { SystemVariable } from 'app/shared/model/system-variable.model';

describe('Component Tests', () => {
    describe('SystemVariable Management Detail Component', () => {
        let comp: SystemVariableDetailComponent;
        let fixture: ComponentFixture<SystemVariableDetailComponent>;
        const route = ({ data: of({ systemVariable: new SystemVariable(123) }) } as any) as ActivatedRoute;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [PalaverTestModule],
                declarations: [SystemVariableDetailComponent],
                providers: [{ provide: ActivatedRoute, useValue: route }]
            })
                .overrideTemplate(SystemVariableDetailComponent, '')
                .compileComponents();
            fixture = TestBed.createComponent(SystemVariableDetailComponent);
            comp = fixture.componentInstance;
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(comp.systemVariable).toEqual(jasmine.objectContaining({ id: 123 }));
            });
        });
    });
});
