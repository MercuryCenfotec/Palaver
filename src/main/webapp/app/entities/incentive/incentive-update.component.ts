import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { IIncentive } from 'app/shared/model/incentive.model';
import { IncentiveService } from './incentive.service';

@Component({
    selector: 'jhi-incentive-update',
    templateUrl: './incentive-update.component.html'
})
export class IncentiveUpdateComponent implements OnInit {
    incentive: IIncentive;
    isSaving: boolean;

    constructor(protected incentiveService: IncentiveService, protected activatedRoute: ActivatedRoute) {}

    ngOnInit() {
        this.isSaving = false;
        this.activatedRoute.data.subscribe(({ incentive }) => {
            this.incentive = incentive;
        });
    }

    previousState() {
        window.history.back();
    }

    save() {
        this.isSaving = true;
        if (this.incentive.id !== undefined) {
            this.subscribeToSaveResponse(this.incentiveService.update(this.incentive));
        } else {
            this.subscribeToSaveResponse(this.incentiveService.create(this.incentive));
        }
    }

    protected subscribeToSaveResponse(result: Observable<HttpResponse<IIncentive>>) {
        result.subscribe((res: HttpResponse<IIncentive>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
    }

    protected onSaveSuccess() {
        this.isSaving = false;
        this.previousState();
    }

    protected onSaveError() {
        this.isSaving = false;
    }
}
