/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { PalaverTestModule } from '../../../test.module';
import { UserAppDetailComponent } from 'app/entities/user-app/user-app-detail.component';
import { UserApp } from 'app/shared/model/user-app.model';

describe('Component Tests', () => {
    describe('UserApp Management Detail Component', () => {
        let comp: UserAppDetailComponent;
        let fixture: ComponentFixture<UserAppDetailComponent>;
        const route = ({ data: of({ userApp: new UserApp(123) }) } as any) as ActivatedRoute;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [PalaverTestModule],
                declarations: [UserAppDetailComponent],
                providers: [{ provide: ActivatedRoute, useValue: route }]
            })
                .overrideTemplate(UserAppDetailComponent, '')
                .compileComponents();
            fixture = TestBed.createComponent(UserAppDetailComponent);
            comp = fixture.componentInstance;
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(comp.userApp).toEqual(jasmine.objectContaining({ id: 123 }));
            });
        });
    });
});
