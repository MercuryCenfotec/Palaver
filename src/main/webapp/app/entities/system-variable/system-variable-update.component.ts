import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { ISystemVariable } from 'app/shared/model/system-variable.model';
import { SystemVariableService } from './system-variable.service';

@Component({
    selector: 'jhi-system-variable-update',
    templateUrl: './system-variable-update.component.html'
})
export class SystemVariableUpdateComponent implements OnInit {
    systemVariable: ISystemVariable;
    isSaving: boolean;

    constructor(protected systemVariableService: SystemVariableService, protected activatedRoute: ActivatedRoute) {}

    ngOnInit() {
        this.isSaving = false;
        this.activatedRoute.data.subscribe(({ systemVariable }) => {
            this.systemVariable = systemVariable;
        });
    }

    previousState() {
        window.history.back();
    }

    save() {
        this.isSaving = true;
        if (this.systemVariable.id !== undefined) {
            this.subscribeToSaveResponse(this.systemVariableService.update(this.systemVariable));
        } else {
            this.subscribeToSaveResponse(this.systemVariableService.create(this.systemVariable));
        }
    }

    protected subscribeToSaveResponse(result: Observable<HttpResponse<ISystemVariable>>) {
        result.subscribe((res: HttpResponse<ISystemVariable>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
    }

    protected onSaveSuccess() {
        this.isSaving = false;
        this.previousState();
    }

    protected onSaveError() {
        this.isSaving = false;
    }
}
