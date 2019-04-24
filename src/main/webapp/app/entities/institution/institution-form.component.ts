import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiAlertService } from 'ng-jhipster';
import { IInstitution } from 'app/shared/model/institution.model';
import { InstitutionService } from './institution.service';
import { IUserApp } from 'app/shared/model/user-app.model';
import { UserAppService } from 'app/entities/user-app';
import { IMembership, Membership } from 'app/shared/model/membership.model';
import { MembershipService } from 'app/entities/membership';
import { IUser, LoginModalService, LoginService, UserService } from 'app/core';
import { BalanceAccountService } from 'app/entities/balance-account';
import { BalanceAccount } from 'app/shared/model/balance-account.model';
import { ImageService } from 'app/shared/util/image.service';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'jhi-institution-form',
    templateUrl: './institution-form.component.html'
})
export class InstitutionFormComponent implements OnInit {
    institution: IInstitution;
    isSaving: boolean;
    user: IUser;
    userApp: IUserApp;
    users: IUserApp[];
    memberships: IMembership[];
    membership: IMembership;
    success: boolean;
    balanceAccount = new BalanceAccount(null, 0, 0, 0, 'Cuenta interna', null);
    image: any;
    modalRef: NgbModalRef;

    constructor(
        protected jhiAlertService: JhiAlertService,
        protected institutionService: InstitutionService,
        private loginService: LoginService,
        protected router: Router,
        protected userAppService: UserAppService,
        protected membershipService: MembershipService,
        protected activatedRoute: ActivatedRoute,
        protected userService: UserService,
        private balanceService: BalanceAccountService,
        protected imageService: ImageService,
        protected loginModalService: LoginModalService
    ) {}

    ngOnInit() {
        this.success = false;
        this.userService.getUserWithAuthorities().subscribe(data => {
            this.user = data;
            this.userAppService.findByUserId(this.user.id).subscribe(userAppData => {
                this.userApp = userAppData;
            });
        });
        this.isSaving = false;
        this.activatedRoute.data.subscribe(({ institution }) => {
            this.institution = institution;
        });
        this.membershipService.find(1).subscribe(membership => {
            this.membership = membership.body;
        });
        this.userAppService
            .query({ filter: 'institution-is-null' })
            .pipe(
                filter((mayBeOk: HttpResponse<IUserApp[]>) => mayBeOk.ok),
                map((response: HttpResponse<IUserApp[]>) => response.body)
            )
            .subscribe(
                (res: IUserApp[]) => {
                    if (!this.institution.user || !this.institution.user.id) {
                        this.users = res;
                    } else {
                        this.userAppService
                            .find(this.institution.user.id)
                            .pipe(
                                filter((subResMayBeOk: HttpResponse<IUserApp>) => subResMayBeOk.ok),
                                map((subResponse: HttpResponse<IUserApp>) => subResponse.body)
                            )
                            .subscribe(
                                (subRes: IUserApp) => (this.users = [subRes].concat(res)),
                                (subRes: HttpErrorResponse) => this.onError(subRes.message)
                            );
                    }
                },
                (res: HttpErrorResponse) => this.onError(res.message)
            );
        this.membershipService
            .query()
            .pipe(
                filter((mayBeOk: HttpResponse<IMembership[]>) => mayBeOk.ok),
                map((response: HttpResponse<IMembership[]>) => response.body)
            )
            .subscribe((res: IMembership[]) => (this.memberships = res), (res: HttpErrorResponse) => this.onError(res.message));
    }

    previousState() {
        // window.history.back();
        window.location.href = '';
        this.loginService.logout();
    }

    save() {
        this.isSaving = true;
        this.institution.user = this.userApp;
        this.institution.membership = this.membership;
        this.imageService.save(this.image).subscribe(
            res => {},
            url => {
                this.institution.logo = url.error.text;
                this.subscribeToSaveResponse(this.institutionService.create(this.institution));
            }
        );
    }

    protected subscribeToSaveResponse(result: Observable<HttpResponse<IInstitution>>) {
        result.subscribe(
            (res: HttpResponse<IInstitution>) => {
                this.userService.updateUserRole('institution', this.user).subscribe(data => this.onSaveSuccess());
            },
            (res: HttpErrorResponse) => this.onSaveError()
        );
    }

    protected onSaveSuccess() {
        this.isSaving = false;
        this.userAppService.findByUserId(this.userApp.user.id).subscribe(newUser => {
            this.balanceAccount.user = newUser;
            this.balanceService.create(this.balanceAccount).subscribe(() => {
                this.loginService.logout();
                this.success = true;
            });
        });
    }

    protected onSaveError() {
        this.isSaving = false;
    }

    protected onError(errorMessage: string) {
        this.jhiAlertService.error(errorMessage, null, null);
    }

    onFileChange(event) {
        if (event.target.files.length === 0) {
            this.image = null;
        } else {
            this.image = event.target.files[0];
        }
    }

    validateImage() {
        if (!this.image) {
            return false;
        } else {
            return true;
        }
    }

    closeMe(target) {
        target.hidden = true;
    }

    login() {
        this.modalRef = this.loginModalService.open();
    }
}
