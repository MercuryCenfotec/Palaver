import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiAlertService } from 'ng-jhipster';
import { ITestResult } from 'app/shared/model/test-result.model';
import { TestResultService } from './test-result.service';
import { IFocusGroup } from 'app/shared/model/focus-group.model';
import { FocusGroupService } from 'app/entities/focus-group';
import { IParticipant } from 'app/shared/model/participant.model';
import { ParticipantService } from 'app/entities/participant';

@Component({
    selector: 'jhi-test-result-update',
    templateUrl: './test-result-update.component.html'
})
export class TestResultUpdateComponent implements OnInit {
    testResult: ITestResult;
    isSaving: boolean;

    focusgroups: IFocusGroup[];

    participants: IParticipant[];

    constructor(
        protected jhiAlertService: JhiAlertService,
        protected testResultService: TestResultService,
        protected focusGroupService: FocusGroupService,
        protected participantService: ParticipantService,
        protected activatedRoute: ActivatedRoute
    ) {}

    ngOnInit() {
        this.isSaving = false;
        this.activatedRoute.data.subscribe(({ testResult }) => {
            this.testResult = testResult;
        });
        this.focusGroupService
            .query()
            .pipe(
                filter((mayBeOk: HttpResponse<IFocusGroup[]>) => mayBeOk.ok),
                map((response: HttpResponse<IFocusGroup[]>) => response.body)
            )
            .subscribe((res: IFocusGroup[]) => (this.focusgroups = res), (res: HttpErrorResponse) => this.onError(res.message));
        this.participantService
            .query()
            .pipe(
                filter((mayBeOk: HttpResponse<IParticipant[]>) => mayBeOk.ok),
                map((response: HttpResponse<IParticipant[]>) => response.body)
            )
            .subscribe((res: IParticipant[]) => (this.participants = res), (res: HttpErrorResponse) => this.onError(res.message));
    }

    previousState() {
        window.history.back();
    }

    save() {
        this.isSaving = true;
        if (this.testResult.id !== undefined) {
            this.subscribeToSaveResponse(this.testResultService.update(this.testResult));
        } else {
            this.subscribeToSaveResponse(this.testResultService.create(this.testResult));
        }
    }

    protected subscribeToSaveResponse(result: Observable<HttpResponse<ITestResult>>) {
        result.subscribe((res: HttpResponse<ITestResult>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
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

    trackFocusGroupById(index: number, item: IFocusGroup) {
        return item.id;
    }

    trackParticipantById(index: number, item: IParticipant) {
        return item.id;
    }
}
