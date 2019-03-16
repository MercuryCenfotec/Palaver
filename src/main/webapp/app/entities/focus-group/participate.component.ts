import {Component, OnInit, OnDestroy} from '@angular/core';
import {HttpErrorResponse, HttpResponse} from '@angular/common/http';
import {Subscription} from 'rxjs';
import {filter, map} from 'rxjs/operators';
import {JhiEventManager, JhiAlertService} from 'ng-jhipster';

import {IFocusGroup} from 'app/shared/model/focus-group.model';
import {AccountService, IUser, UserService} from 'app/core';
import {FocusGroupService} from './focus-group.service';
import {UserAppService} from 'app/entities/user-app';
import {ParticipantService} from 'app/entities/participant';
import {IParticipant, Participant} from 'app/shared/model/participant.model';
import {ITestResult, TestResult} from 'app/shared/model/test-result.model';
import {TestResultService} from 'app/entities/test-result';

@Component({
    selector: 'jhi-participate',
    templateUrl: './participate.component.html'
})
export class ParticipateComponent implements OnInit, OnDestroy {
    focusGroups: IFocusGroup[];
    testResults: ITestResult[];
    focusGroup: IFocusGroup;
    participant: IParticipant;
    testResult = new TestResult('', this.focusGroup, this.participant);
    currentAccount: any;
    eventSubscriber: Subscription;
    asd2: number;

    constructor(
        protected focusGroupService: FocusGroupService,
        protected jhiAlertService: JhiAlertService,
        protected eventManager: JhiEventManager,
        protected accountService: AccountService,
        protected userService: UserService,
        protected userAppService: UserAppService,
        protected participantService: ParticipantService,
        protected testResultsService: TestResultService
    ) {
    }

    loadAll() {
        this.focusGroupService
            .query()
            .pipe(
                filter((res: HttpResponse<IFocusGroup[]>) => res.ok),
                map((res: HttpResponse<IFocusGroup[]>) => res.body)
            )
            .subscribe(
                (res: IFocusGroup[]) => {
                    this.focusGroups = res;
                    this.loadAllTests();
                },
                (res: HttpErrorResponse) => this.onError(res.message)
            );
    }

    loadAllTests() {
        this.testResultsService
            .query()
            .pipe(
                filter((res: HttpResponse<ITestResult[]>) => res.ok),
                map((res: HttpResponse<ITestResult[]>) => res.body)
            )
            .subscribe(
                (res: ITestResult[]) => {
                    this.testResults = res;
                    this.testX();
                },
                (res: HttpErrorResponse) => this.onError(res.message)
            );
    }

    ngOnInit() {
        this.loadAll();
        this.accountService.identity().then(account => {
            this.currentAccount = account;
        });
        this.registerChangeInFocusGroups();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: IFocusGroup) {
        return item.id;
    }

    registerChangeInFocusGroups() {
        this.eventSubscriber = this.eventManager.subscribe('focusGroupListModification', response => this.loadAll());
    }

    protected onError(errorMessage: string) {
        this.jhiAlertService.error(errorMessage, null, null);
    }

    participate(asd) {
        this.focusGroupService.find(asd).subscribe(data3 => {
            this.focusGroup = data3.body;
            this.testResult.participant = this.participant;
            this.testResult.focusGroup = this.focusGroup;
            this.testResult.grade = '100';
            this.testResultsService.create(this.testResult).subscribe(data => {
                this.loadAllTests();
            });
        });

    }

    testX() {
        this.currentAccount = this.userService.getUserWithAuthorities().forEach(erg => {
                this.asd2 = erg.id;
                this.userAppService.findByUserId(erg.id).subscribe(data => {
                    const bla2 = data.id;
                    this.participantService.findByUser(bla2).subscribe(data2 => {
                        this.asd2 = data2.id;
                        this.participant = data2;
                        this.amI();
                    });
                });
            }
        );
    }

    amI() {
        const list = this.testResults;
        for (let i = 0; i < list.length; i++) {
            if (this.participant.id === list[i].participant.id) {
                document.getElementById('btn-' + list[i].focusGroup.id).hidden = true;
            }
        }
    }

}
