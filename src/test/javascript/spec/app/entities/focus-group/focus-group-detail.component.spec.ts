/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { PalaverTestModule } from '../../../test.module';
import { FocusGroupDetailComponent } from 'app/entities/focus-group/focus-group-detail.component';
import { FocusGroup } from 'app/shared/model/focus-group.model';

describe('Component Tests', () => {
    describe('FocusGroup Management Detail Component', () => {
        let comp: FocusGroupDetailComponent;
        let fixture: ComponentFixture<FocusGroupDetailComponent>;
        const route = ({ data: of({ focusGroup: new FocusGroup(123) }) } as any) as ActivatedRoute;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [PalaverTestModule],
                declarations: [FocusGroupDetailComponent],
                providers: [{ provide: ActivatedRoute, useValue: route }]
            })
                .overrideTemplate(FocusGroupDetailComponent, '')
                .compileComponents();
            fixture = TestBed.createComponent(FocusGroupDetailComponent);
            comp = fixture.componentInstance;
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(comp.focusGroup).toEqual(jasmine.objectContaining({ id: 123 }));
            });
        });
    });
});
