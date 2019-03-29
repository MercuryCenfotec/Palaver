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
import { UserService } from 'app/core';
import {NgbDatepickerConfig} from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'jhi-meeting-create',
    templateUrl: './meeting-create.component.html'
})
export class MeetingCreateComponent implements OnInit {
    meeting: IMeeting;
    isSaving: boolean;
    dateDp: any;
    time: string;

    constructor(
        protected jhiAlertService: JhiAlertService,
        protected meetingService: MeetingService,
        protected focusGroupService: FocusGroupService,
        protected activatedRoute: ActivatedRoute,
        protected userService: UserService,
        protected config: NgbDatepickerConfig
    ) {
        const current = new Date();
        config.minDate = {
            year: current.getFullYear(),
            month: current.getMonth() + 1,
            day: current.getDate()
        };
        config.maxDate = { year: 2099, month: 12, day: 31 };
        config.outsideDays = 'hidden';
    }

    ngOnInit() {
        this.meeting = new class implements IMeeting {
            callCode: string;
            callURL: string;
            date: moment.Moment;
            description: string;
            focusGroup: IFocusGroup;
            id: number;
            name: string;
            time: moment.Moment;
        }();
        this.isSaving = false;
        this.userService.getUserWithAuthorities().subscribe(user => {
            this.focusGroupService.findByCode(user.login).subscribe(group => {
                this.meeting.focusGroup = group.body;
            });
        });
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
}
