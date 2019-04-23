import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { ITestResult } from 'app/shared/model/test-result.model';
import { AccountService, UserService } from 'app/core';
import { TestResultService } from './test-result.service';
import { FocusGroupService } from 'app/entities/focus-group';
import { IFocusGroup } from 'app/shared/model/focus-group.model';
import { NotificationService } from 'app/entities/notification';
import { Notification } from 'app/shared/model/notification.model';
import { ChatService } from 'app/entities/chat';
import { Chat, IChat } from 'app/shared/model/chat.model';
import { IParticipant } from 'app/shared/model/participant.model';
import { IMessage } from 'app/shared/model/message.model';
import moment = require('moment');

@Component({
    selector: 'jhi-test-result',
    templateUrl: './test-result.component.html'
})
export class TestResultComponent implements OnInit, OnDestroy {
    testResults: ITestResult[];
    focusGroups: IFocusGroup[];
    currentAccount: any;
    eventSubscriber: Subscription;
    gradeInput;
    nameInput;

    constructor(
        protected testResultService: TestResultService,
        protected jhiAlertService: JhiAlertService,
        protected eventManager: JhiEventManager,
        protected accountService: AccountService,
        protected userService: UserService,
        protected focusGroupService: FocusGroupService,
        protected notificationService: NotificationService,
        protected chatService: ChatService
    ) {}

    loadAll() {
        this.userService.getUserWithAuthorities().subscribe(user => {
            this.focusGroupService.findByCode(user.login).subscribe(group => {
                this.testResultService.findAllByFocusGroupAndStatus(group.body.id, 'EnCurso').subscribe(results => {
                    this.testResults = results.body;
                });
            });
        });
    }

    ngOnInit() {
        this.loadAll();
        this.loadAllFocusGroups();
        this.accountService.identity().then(account => {
            this.currentAccount = account;
        });
        this.registerChangeInTestResults();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: ITestResult) {
        return item.id;
    }

    registerChangeInTestResults() {
        this.eventSubscriber = this.eventManager.subscribe('testResultListModification', response => this.loadAll());
    }

    protected onError(errorMessage: string) {
        this.jhiAlertService.error(errorMessage, null, null);
    }

    loadAllFocusGroups() {
        this.focusGroupService
            .query()
            .pipe(
                filter((res: HttpResponse<IFocusGroup[]>) => res.ok),
                map((res: HttpResponse<IFocusGroup[]>) => res.body)
            )
            .subscribe(
                (res: IFocusGroup[]) => {
                    this.focusGroups = res;
                },
                (res: HttpErrorResponse) => this.onError(res.message)
            );
    }

    acceptParticipant(event: ITestResult) {
        const chat: Chat = new Chat(null, null, null, event.participant, event.focusGroup, null);
        for (let i = 0; i < this.focusGroups.length; i++) {
            if (event.focusGroup.id === this.focusGroups[i].id) {
                event.focusGroup = this.focusGroups[i];
            }
        }
        event.focusGroup.participants.push(event.participant);
        this.focusGroupService.update(event.focusGroup).subscribe(data => {
            event.status = 'Aceptado';
            this.testResultService.update(event).subscribe(data2 => {
                const newNotification = new Notification(
                    null,
                    event.participant.user.user.id.toString(),
                    'GroupAccepted',
                    false,
                    event.focusGroup.id
                );
                this.notificationService.create(newNotification).subscribe(createdNoti => {
                    this.chatService.create(chat).subscribe(resChat => {
                        this.loadAll();
                    });
                });
            });
        });
    }

    rejectParticipant(event: ITestResult) {
        event.status = 'Rechazado';
        this.testResultService.update(event).subscribe(data => {
            const newNotification = new Notification(
                null,
                event.participant.user.user.id.toString(),
                'GroupRejected',
                false,
                event.focusGroup.id
            );
            this.notificationService.create(newNotification).subscribe(createdNoti => {
                this.loadAll();
            });
        });
    }
}
