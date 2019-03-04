/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Observable, of } from 'rxjs';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { PalaverTestModule } from '../../../test.module';
import { UserAppComponent } from 'app/entities/user-app/user-app.component';
import { UserAppService } from 'app/entities/user-app/user-app.service';
import { UserApp } from 'app/shared/model/user-app.model';

describe('Component Tests', () => {
    describe('UserApp Management Component', () => {
        let comp: UserAppComponent;
        let fixture: ComponentFixture<UserAppComponent>;
        let service: UserAppService;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [PalaverTestModule],
                declarations: [UserAppComponent],
                providers: []
            })
                .overrideTemplate(UserAppComponent, '')
                .compileComponents();

            fixture = TestBed.createComponent(UserAppComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(UserAppService);
        });

        it('Should call load all on init', () => {
            // GIVEN
            const headers = new HttpHeaders().append('link', 'link;link');
            spyOn(service, 'query').and.returnValue(
                of(
                    new HttpResponse({
                        body: [new UserApp(123)],
                        headers
                    })
                )
            );

            // WHEN
            comp.ngOnInit();

            // THEN
            expect(service.query).toHaveBeenCalled();
            expect(comp.userApps[0]).toEqual(jasmine.objectContaining({ id: 123 }));
        });
    });
});
