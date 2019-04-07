import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
import { IUser, LoginService, UserService } from 'app/core';
import { NgbDatepickerConfig } from '@ng-bootstrap/ng-bootstrap';
import {BalanceAccountService} from "app/entities/balance-account";
import {BalanceAccount} from "app/shared/model/balance-account.model";

@Component({
    selector: 'jhi-participant-create',
    templateUrl: './participant-create.component.html'
})
export class ParticipantCreateComponent implements OnInit {
    public image;

    participant: IParticipant;
    isSaving: boolean;
    user: IUser;
    userApp: IUserApp;
    users: IUserApp[];
    success: boolean;
    balanceAccount = new BalanceAccount(null, 0, 0, 0, 'Cuenta interna', null);
    categories: ICategory[];
    focusgroups: IFocusGroup[];
    birthdateDp: any;

    constructor(
        protected jhiAlertService: JhiAlertService,
        private loginService: LoginService,
        protected participantService: ParticipantService,
        protected userAppService: UserAppService,
        protected router: Router,
        protected categoryService: CategoryService,
        protected focusGroupService: FocusGroupService,
        protected activatedRoute: ActivatedRoute,
        protected userService: UserService,
        protected config: NgbDatepickerConfig,
        private balanceService: BalanceAccountService
    ) {}

    ngOnInit() {
        this.success = false;
        // Deshabilitar fechas futuras
        const currentDate = new Date();
        this.config.maxDate = { year: currentDate.getFullYear() - 5, month: 12, day: 31 };
        this.config.outsideDays = 'hidden';

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
        window.location.href = '';
        this.loginService.logout();
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
        result.subscribe(
            (res: HttpResponse<IParticipant>) => {
                this.userService.updateUserRole('participant', this.user).subscribe(data => this.onSaveSuccess());
            },
            (res: HttpErrorResponse) => this.onSaveError()
        );
    }

    protected onSaveSuccess() {
        this.isSaving = false;
        this.userAppService.findByUserId(this.userApp.user.id).subscribe(newUser =>{
            this.balanceAccount.user = newUser;
            this.balanceService.create(this.balanceAccount).subscribe( () =>{
                this.loginService.logout();
                this.success = true;
            });
        });
        // this.router.navigate(['/participant-home']);
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

    fileEvent(fileInput: any) {
        /*
        const file = fileInput.target.files[0];

        console.log(file);

        AWS.config.region = 'us-east-1'; // Region
        AWS.config.credentials = new AWS.CognitoIdentityCredentials({
            IdentityPoolId: 'us-east-1:68b4abc4-89a0-4c98-b8ad-481d305b5eca'
        });

        const s3 = new AWS.S3({
            apiVersion: '2006-03-01',
            params: { Bucket: 'palaverapp' }
        });

        this.image = file.name;

        s3.upload({ Key: file.name, Bucket: 'palaverapp', Body: file, ACL: 'public-read' }, function(err, data) {
            if (err) {
                console.log(err, 'there was an error uploading your file');
            }
        });*/
    }
}
