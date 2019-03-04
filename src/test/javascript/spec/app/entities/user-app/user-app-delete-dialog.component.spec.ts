/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, of } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';

import { PalaverTestModule } from '../../../test.module';
import { UserAppDeleteDialogComponent } from 'app/entities/user-app/user-app-delete-dialog.component';
import { UserAppService } from 'app/entities/user-app/user-app.service';

describe('Component Tests', () => {
    describe('UserApp Management Delete Component', () => {
        let comp: UserAppDeleteDialogComponent;
        let fixture: ComponentFixture<UserAppDeleteDialogComponent>;
        let service: UserAppService;
        let mockEventManager: any;
        let mockActiveModal: any;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [PalaverTestModule],
                declarations: [UserAppDeleteDialogComponent]
            })
                .overrideTemplate(UserAppDeleteDialogComponent, '')
                .compileComponents();
            fixture = TestBed.createComponent(UserAppDeleteDialogComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(UserAppService);
            mockEventManager = fixture.debugElement.injector.get(JhiEventManager);
            mockActiveModal = fixture.debugElement.injector.get(NgbActiveModal);
        });

        describe('confirmDelete', () => {
            it('Should call delete service on confirmDelete', inject(
                [],
                fakeAsync(() => {
                    // GIVEN
                    spyOn(service, 'delete').and.returnValue(of({}));

                    // WHEN
                    comp.confirmDelete(123);
                    tick();

                    // THEN
                    expect(service.delete).toHaveBeenCalledWith(123);
                    expect(mockActiveModal.dismissSpy).toHaveBeenCalled();
                    expect(mockEventManager.broadcastSpy).toHaveBeenCalled();
                })
            ));
        });
    });
});
