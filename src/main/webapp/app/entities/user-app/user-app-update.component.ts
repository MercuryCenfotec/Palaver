import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { IUserApp } from 'app/shared/model/user-app.model';
import { UserAppService } from './user-app.service';

@Component({
    selector: 'jhi-user-app-update',
    templateUrl: './user-app-update.component.html'
})
export class UserAppUpdateComponent implements OnInit {
    userApp: IUserApp;
    isSaving: boolean;

    constructor(protected userAppService: UserAppService, protected activatedRoute: ActivatedRoute) {}

    ngOnInit() {
        this.isSaving = false;
        this.activatedRoute.data.subscribe(({ userApp }) => {
            this.userApp = userApp;
        });
    }

    previousState() {
        window.history.back();
    }

    save() {
        this.isSaving = true;
        if (this.userApp.id !== undefined) {
            this.subscribeToSaveResponse(this.userAppService.update(this.userApp));
        } else {
            this.subscribeToSaveResponse(this.userAppService.create(this.userApp));
        }
    }

    protected subscribeToSaveResponse(result: Observable<HttpResponse<IUserApp>>) {
        result.subscribe((res: HttpResponse<IUserApp>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
    }

    protected onSaveSuccess() {
        this.isSaving = false;
        this.previousState();
    }

    protected onSaveError() {
        this.isSaving = false;
    }
}
