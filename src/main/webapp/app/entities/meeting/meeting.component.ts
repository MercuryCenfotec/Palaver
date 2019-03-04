import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { IMeeting } from 'app/shared/model/meeting.model';
import { AccountService } from 'app/core';
import { MeetingService } from './meeting.service';

@Component({
    selector: 'jhi-meeting',
    templateUrl: './meeting.component.html'
})
export class MeetingComponent implements OnInit, OnDestroy {
    meetings: IMeeting[];
    currentAccount: any;
    eventSubscriber: Subscription;

    constructor(
        protected meetingService: MeetingService,
        protected jhiAlertService: JhiAlertService,
        protected eventManager: JhiEventManager,
        protected accountService: AccountService
    ) {}

    loadAll() {
        this.meetingService
            .query()
            .pipe(
                filter((res: HttpResponse<IMeeting[]>) => res.ok),
                map((res: HttpResponse<IMeeting[]>) => res.body)
            )
            .subscribe(
                (res: IMeeting[]) => {
                    this.meetings = res;
                },
                (res: HttpErrorResponse) => this.onError(res.message)
            );
    }

    ngOnInit() {
        this.loadAll();
        this.accountService.identity().then(account => {
            this.currentAccount = account;
        });
        this.registerChangeInMeetings();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: IMeeting) {
        return item.id;
    }

    registerChangeInMeetings() {
        this.eventSubscriber = this.eventManager.subscribe('meetingListModification', response => this.loadAll());
    }

    protected onError(errorMessage: string) {
        this.jhiAlertService.error(errorMessage, null, null);
    }
}
