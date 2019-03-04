/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { PalaverTestModule } from '../../../test.module';
import { AptitudeTestDetailComponent } from 'app/entities/aptitude-test/aptitude-test-detail.component';
import { AptitudeTest } from 'app/shared/model/aptitude-test.model';

describe('Component Tests', () => {
    describe('AptitudeTest Management Detail Component', () => {
        let comp: AptitudeTestDetailComponent;
        let fixture: ComponentFixture<AptitudeTestDetailComponent>;
        const route = ({ data: of({ aptitudeTest: new AptitudeTest(123) }) } as any) as ActivatedRoute;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [PalaverTestModule],
                declarations: [AptitudeTestDetailComponent],
                providers: [{ provide: ActivatedRoute, useValue: route }]
            })
                .overrideTemplate(AptitudeTestDetailComponent, '')
                .compileComponents();
            fixture = TestBed.createComponent(AptitudeTestDetailComponent);
            comp = fixture.componentInstance;
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(comp.aptitudeTest).toEqual(jasmine.objectContaining({ id: 123 }));
            });
        });
    });
});
