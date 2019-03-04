/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Observable, of } from 'rxjs';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { PalaverTestModule } from '../../../test.module';
import { FocusGroupComponent } from 'app/entities/focus-group/focus-group.component';
import { FocusGroupService } from 'app/entities/focus-group/focus-group.service';
import { FocusGroup } from 'app/shared/model/focus-group.model';

describe('Component Tests', () => {
    describe('FocusGroup Management Component', () => {
        let comp: FocusGroupComponent;
        let fixture: ComponentFixture<FocusGroupComponent>;
        let service: FocusGroupService;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [PalaverTestModule],
                declarations: [FocusGroupComponent],
                providers: []
            })
                .overrideTemplate(FocusGroupComponent, '')
                .compileComponents();

            fixture = TestBed.createComponent(FocusGroupComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(FocusGroupService);
        });

        it('Should call load all on init', () => {
            // GIVEN
            const headers = new HttpHeaders().append('link', 'link;link');
            spyOn(service, 'query').and.returnValue(
                of(
                    new HttpResponse({
                        body: [new FocusGroup(123)],
                        headers
                    })
                )
            );

            // WHEN
            comp.ngOnInit();

            // THEN
            expect(service.query).toHaveBeenCalled();
            expect(comp.focusGroups[0]).toEqual(jasmine.objectContaining({ id: 123 }));
        });
    });
});
