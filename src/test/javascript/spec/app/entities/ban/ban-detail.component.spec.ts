/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { PalaverTestModule } from '../../../test.module';
import { BanDetailComponent } from 'app/entities/ban/ban-detail.component';
import { Ban } from 'app/shared/model/ban.model';

describe('Component Tests', () => {
    describe('Ban Management Detail Component', () => {
        let comp: BanDetailComponent;
        let fixture: ComponentFixture<BanDetailComponent>;
        const route = ({ data: of({ ban: new Ban(123) }) } as any) as ActivatedRoute;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [PalaverTestModule],
                declarations: [BanDetailComponent],
                providers: [{ provide: ActivatedRoute, useValue: route }]
            })
                .overrideTemplate(BanDetailComponent, '')
                .compileComponents();
            fixture = TestBed.createComponent(BanDetailComponent);
            comp = fixture.componentInstance;
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(comp.ban).toEqual(jasmine.objectContaining({ id: 123 }));
            });
        });
    });
});
