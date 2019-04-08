/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Observable, of } from 'rxjs';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { PalaverTestModule } from '../../../test.module';
import { BanComponent } from 'app/entities/ban/ban.component';
import { BanService } from 'app/entities/ban/ban.service';
import { Ban } from 'app/shared/model/ban.model';

describe('Component Tests', () => {
    describe('Ban Management Component', () => {
        let comp: BanComponent;
        let fixture: ComponentFixture<BanComponent>;
        let service: BanService;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [PalaverTestModule],
                declarations: [BanComponent],
                providers: []
            })
                .overrideTemplate(BanComponent, '')
                .compileComponents();

            fixture = TestBed.createComponent(BanComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(BanService);
        });

        it('Should call load all on init', () => {
            // GIVEN
            const headers = new HttpHeaders().append('link', 'link;link');
            spyOn(service, 'query').and.returnValue(
                of(
                    new HttpResponse({
                        body: [new Ban(123)],
                        headers
                    })
                )
            );

            // WHEN
            comp.ngOnInit();

            // THEN
            expect(service.query).toHaveBeenCalled();
            expect(comp.bans[0]).toEqual(jasmine.objectContaining({ id: 123 }));
        });
    });
});
