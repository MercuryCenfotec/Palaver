import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import * as moment from 'moment';
import { JhiAlertService } from 'ng-jhipster';
import { IParticipant } from 'app/shared/model/participant.model';
import { ParticipantService } from './participant.service';
import { IUserApp } from 'app/shared/model/user-app.model';
import { UserAppService } from 'app/entities/user-app';
import { ICategory } from 'app/shared/model/category.model';
import { CategoryService } from 'app/entities/category';
import { IFocusGroup } from 'app/shared/model/focus-group.model';
import { FocusGroupService } from 'app/entities/focus-group';
import { IUser, UserService } from 'app/core';

@Component({
    selector: 'jhi-participant-create',
    templateUrl: './participant-create.component.html'
})
export class ParticipantCreateComponent implements OnInit {
    participant: IParticipant;
    isSaving: boolean;
    user: IUser;
    userApp: IUserApp;
    users: IUserApp[];

    categories: ICategory[];

    focusgroups: IFocusGroup[];
    birthdateDp: any;

    constructor(
        protected jhiAlertService: JhiAlertService,
        protected participantService: ParticipantService,
        protected userAppService: UserAppService,
        protected categoryService: CategoryService,
        protected focusGroupService: FocusGroupService,
        protected activatedRoute: ActivatedRoute,
        protected userService: UserService
    ) {}

    ngOnInit() {
        this.userService.getUserWithAuthorities().subscribe(data => {
            this.user = data;
            this.userAppService.findByUserId(this.user.id).subscribe(userAppData => {
                this.userApp = userAppData;
            });
        });
        this.isSaving = false;
        this.activatedRoute.data.subscribe(({ participant }) => {
            this.participant = participant;
        });
        this.userAppService
            .query({ filter: 'participant-is-null' })
            .pipe(
                filter((mayBeOk: HttpResponse<IUserApp[]>) => mayBeOk.ok),
                map((response: HttpResponse<IUserApp[]>) => response.body)
            )
            .subscribe(
                (res: IUserApp[]) => {
                    if (!this.participant.user || !this.participant.user.id) {
                        this.users = res;
                    } else {
                        this.userAppService
                            .find(this.participant.user.id)
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
        this.categoryService
            .query()
            .pipe(
                filter((mayBeOk: HttpResponse<ICategory[]>) => mayBeOk.ok),
                map((response: HttpResponse<ICategory[]>) => response.body)
            )
            .subscribe((res: ICategory[]) => (this.categories = res), (res: HttpErrorResponse) => this.onError(res.message));
        this.focusGroupService
            .query()
            .pipe(
                filter((mayBeOk: HttpResponse<IFocusGroup[]>) => mayBeOk.ok),
                map((response: HttpResponse<IFocusGroup[]>) => response.body)
            )
            .subscribe((res: IFocusGroup[]) => (this.focusgroups = res), (res: HttpErrorResponse) => this.onError(res.message));
    }

    previousState() {
        window.history.back();
    }

    save() {
        this.isSaving = true;
        if (this.participant.id !== undefined) {
            this.subscribeToSaveResponse(this.participantService.update(this.participant));
        } else {
            this.participant.user = this.userApp;
            this.subscribeToSaveResponse(this.participantService.create(this.participant));
        }
    }

    protected subscribeToSaveResponse(result: Observable<HttpResponse<IParticipant>>) {
        result.subscribe((res: HttpResponse<IParticipant>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
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

    trackCategoryById(index: number, item: ICategory) {
        return item.id;
    }

    trackFocusGroupById(index: number, item: IFocusGroup) {
        return item.id;
    }

    getSelected(selectedVals: Array<any>, option: any) {
        if (selectedVals) {
            for (let i = 0; i < selectedVals.length; i++) {
                if (option.id === selectedVals[i].id) {
                    return selectedVals[i];
                }
            }
        }
        return option;
    }
}
