import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import * as moment from 'moment';
import { DATE_TIME_FORMAT } from 'app/shared/constants/input.constants';
import { JhiAlertService } from 'ng-jhipster';
import { IMeeting } from 'app/shared/model/meeting.model';
import { MeetingService } from './meeting.service';
import { IFocusGroup } from 'app/shared/model/focus-group.model';
import { FocusGroupService } from 'app/entities/focus-group';

@Component({
    selector: 'jhi-meeting-create',
    templateUrl: './meeting-create.component.html'
})
export class MeetingCreateComponent implements OnInit {
    meeting: IMeeting;
    isSaving: boolean;

    focusgroups: IFocusGroup[];
    dateDp: any;
    time: string;

    constructor(
        protected jhiAlertService: JhiAlertService,
        protected meetingService: MeetingService,
        protected focusGroupService: FocusGroupService,
        protected activatedRoute: ActivatedRoute
    ) {}

    ngOnInit() {
        this.isSaving = false;
        this.activatedRoute.data.subscribe(({ meeting }) => {
            this.meeting = meeting;
            this.time = this.meeting.time != null ? this.meeting.time.format('LT') : null;
        });
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
        this.meeting.time = this.time != null ? moment(this.time, 'LT') : null;
        if (this.meeting.id !== undefined) {
            this.subscribeToSaveResponse(this.meetingService.update(this.meeting));
        } else {
            this.subscribeToSaveResponse(this.meetingService.create(this.meeting));
        }
    }

    protected subscribeToSaveResponse(result: Observable<HttpResponse<IMeeting>>) {
        result.subscribe((res: HttpResponse<IMeeting>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
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
}
