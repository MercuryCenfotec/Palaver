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
        protected focusGroupService: FocusGroupService
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
        for (let i = 0; i < this.focusGroups.length; i++) {
            if (event.focusGroup.id === this.focusGroups[i].id) {
                event.focusGroup = this.focusGroups[i];
            }
        }
        event.focusGroup.participants.push(event.participant);
        this.focusGroupService.update(event.focusGroup).subscribe(data => {
            event.status = 'Aceptado';
            this.testResultService.update(event).subscribe(data2 => {
                this.loadAll();
            });
        });
    }

    rejectParticipant(event: ITestResult) {
        event.status = 'Rechazado';
        this.testResultService.update(event).subscribe(data => {
            this.loadAll();
        });
    }
}
