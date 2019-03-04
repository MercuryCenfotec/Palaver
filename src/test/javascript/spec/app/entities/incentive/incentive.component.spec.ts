/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Observable, of } from 'rxjs';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { PalaverTestModule } from '../../../test.module';
import { IncentiveComponent } from 'app/entities/incentive/incentive.component';
import { IncentiveService } from 'app/entities/incentive/incentive.service';
import { Incentive } from 'app/shared/model/incentive.model';

describe('Component Tests', () => {
    describe('Incentive Management Component', () => {
        let comp: IncentiveComponent;
        let fixture: ComponentFixture<IncentiveComponent>;
        let service: IncentiveService;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [PalaverTestModule],
                declarations: [IncentiveComponent],
                providers: []
            })
                .overrideTemplate(IncentiveComponent, '')
                .compileComponents();

            fixture = TestBed.createComponent(IncentiveComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(IncentiveService);
        });

        it('Should call load all on init', () => {
            // GIVEN
            const headers = new HttpHeaders().append('link', 'link;link');
            spyOn(service, 'query').and.returnValue(
                of(
                    new HttpResponse({
                        body: [new Incentive(123)],
                        headers
                    })
                )
            );

            // WHEN
            comp.ngOnInit();

            // THEN
            expect(service.query).toHaveBeenCalled();
            expect(comp.incentives[0]).toEqual(jasmine.objectContaining({ id: 123 }));
        });
    });
});
