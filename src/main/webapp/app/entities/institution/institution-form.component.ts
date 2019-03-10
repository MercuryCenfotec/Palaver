import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiAlertService } from 'ng-jhipster';
import { IInstitution } from 'app/shared/model/institution.model';
import { InstitutionService } from './institution.service';
import { IUserApp } from 'app/shared/model/user-app.model';
import { UserAppService } from 'app/entities/user-app';
import { IMembership } from 'app/shared/model/membership.model';
import { MembershipService } from 'app/entities/membership';

@Component({
    selector: 'jhi-institution-form',
    templateUrl: './institution-form.component.html'
})
export class InstitutionFormComponent implements OnInit {
    institution: IInstitution;
    isSaving: boolean;

    users: IUserApp[];

    memberships: IMembership[];

    constructor(
        protected jhiAlertService: JhiAlertService,
        protected institutionService: InstitutionService,
        protected userAppService: UserAppService,
        protected membershipService: MembershipService,
        protected activatedRoute: ActivatedRoute
    ) {}

    ngOnInit() {
        this.isSaving = false;
        this.activatedRoute.data.subscribe(({ institution }) => {
            this.institution = institution;
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
        window.history.back();
    }

    save() {
        debugger
        this.isSaving = true;
        this.subscribeToSaveResponse(this.institutionService.create(this.institution));
    }

    protected subscribeToSaveResponse(result: Observable<HttpResponse<IInstitution>>) {
        result.subscribe((res: HttpResponse<IInstitution>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
    }

    protected onSaveSuccess() {
        this.isSaving = false;
        this.previousState();
    }

    protected onSaveError() {
        this.isSaving = false;
    }

    protected onError(errorMessage: string) {
        this.jhiAlertService.error(errorMessage, null, null);
    }

    trackUserAppById(index: number, item: IUserApp) {
        return item.id;
    }

    trackMembershipById(index: number, item: IMembership) {
        return item.id;
    }
}
