/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { PalaverTestModule } from '../../../test.module';
import { IncentiveDetailComponent } from 'app/entities/incentive/incentive-detail.component';
import { Incentive } from 'app/shared/model/incentive.model';

describe('Component Tests', () => {
    describe('Incentive Management Detail Component', () => {
        let comp: IncentiveDetailComponent;
        let fixture: ComponentFixture<IncentiveDetailComponent>;
        const route = ({ data: of({ incentive: new Incentive(123) }) } as any) as ActivatedRoute;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [PalaverTestModule],
                declarations: [IncentiveDetailComponent],
                providers: [{ provide: ActivatedRoute, useValue: route }]
            })
                .overrideTemplate(IncentiveDetailComponent, '')
                .compileComponents();
            fixture = TestBed.createComponent(IncentiveDetailComponent);
            comp = fixture.componentInstance;
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(comp.incentive).toEqual(jasmine.objectContaining({ id: 123 }));
            });
        });
    });
});
