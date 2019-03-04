/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Observable, of } from 'rxjs';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { PalaverTestModule } from '../../../test.module';
import { MembershipComponent } from 'app/entities/membership/membership.component';
import { MembershipService } from 'app/entities/membership/membership.service';
import { Membership } from 'app/shared/model/membership.model';

describe('Component Tests', () => {
    describe('Membership Management Component', () => {
        let comp: MembershipComponent;
        let fixture: ComponentFixture<MembershipComponent>;
        let service: MembershipService;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [PalaverTestModule],
                declarations: [MembershipComponent],
                providers: []
            })
                .overrideTemplate(MembershipComponent, '')
                .compileComponents();

            fixture = TestBed.createComponent(MembershipComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(MembershipService);
        });

        it('Should call load all on init', () => {
            // GIVEN
            const headers = new HttpHeaders().append('link', 'link;link');
            spyOn(service, 'query').and.returnValue(
                of(
                    new HttpResponse({
                        body: [new Membership(123)],
                        headers
                    })
                )
            );

            // WHEN
            comp.ngOnInit();

            // THEN
            expect(service.query).toHaveBeenCalled();
            expect(comp.memberships[0]).toEqual(jasmine.objectContaining({ id: 123 }));
        });
    });
});
