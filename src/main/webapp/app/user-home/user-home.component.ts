import { Component, OnInit } from '@angular/core';
import { IFocusGroup } from 'app/shared/model/focus-group.model';
import { FocusGroupService } from 'app/entities/focus-group';
import { filter, map } from 'rxjs/operators';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { JhiAlertService, JhiEventManager } from 'ng-jhipster';
import { ITestResult, TestResult } from 'app/shared/model/test-result.model';
import { ITestQuestion } from 'app/shared/model/test-question.model';
import { IParticipant } from 'app/shared/model/participant.model';
import { Subscription } from 'rxjs';
import { AccountService, UserService } from 'app/core';
import { UserAppService } from 'app/entities/user-app';
import { ParticipantService } from 'app/entities/participant';
import { TestResultService } from 'app/entities/test-result';
import { TestQuestionService } from 'app/entities/test-question';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'jhi-user-home',
    templateUrl: './user-home.component.html',
    styles: []
})
export class UserHomeComponent implements OnInit {
    focusGroups: IFocusGroup[];
    testResults: ITestResult[];
    testQuestions: ITestQuestion[];
    focusGroup: IFocusGroup;
    participant: IParticipant;
    testResult = new TestResult(null, '', '', this.focusGroup, this.participant);
    currentAccount: any;
    eventSubscriber: Subscription;
    actualUserId: number;
    searchText;

    constructor(
        protected focusGroupService: FocusGroupService,
        protected jhiAlertService: JhiAlertService,
        protected eventManager: JhiEventManager,
        protected accountService: AccountService,
        protected userService: UserService,
        protected userAppService: UserAppService,
        protected participantService: ParticipantService,
        protected testResultsService: TestResultService,
        protected testQuestionsService: TestQuestionService,
        protected modalService: NgbModal
    ) {}

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
                    this.findActualParticipant();
                },
                (res: HttpErrorResponse) => this.onError(res.message)
            );
    }

    ngOnInit() {
        this.loadAllFocusGroups();
        this.accountService.identity().then(account => {
            this.currentAccount = account;
        });
        this.registerChangeInFocusGroups();
    }

    trackId(index: number, item: IFocusGroup) {
        return item.id;
    }

    registerChangeInFocusGroups() {
        this.eventSubscriber = this.eventManager.subscribe('focusGroupListModification', response => this.loadAllFocusGroups());
    }

    protected onError(errorMessage: string) {
        this.jhiAlertService.error(errorMessage, null, null);
    }

    askParticipation(group, modalToDisplay) {
        this.focusGroupService.find(group).subscribe(groupFound => {
            this.focusGroup = groupFound.body;
            this.testResult.participant = this.participant;
            this.testResult.focusGroup = this.focusGroup;
            if (this.focusGroup.aptitudeTest != null) {
                this.findQuestionsByAptitudeTests();
                this.openModal(modalToDisplay);
            } else {
                this.testResult.grade = '100';
                this.testResultsService.create(this.testResult).subscribe(data => {
                    this.loadAllTests();
                });
            }
        });
    }

    findQuestionsByAptitudeTests() {
        this.testQuestionsService
            .findAllByAptituteTest(this.focusGroup.aptitudeTest.id)
            .pipe(
                filter((res: HttpResponse<ITestQuestion[]>) => res.ok),
                map((res: HttpResponse<ITestQuestion[]>) => res.body)
            )
            .subscribe(
                (res: ITestQuestion[]) => {
                    this.testQuestions = res;
                },
                (res: HttpErrorResponse) => this.onError(res.message)
            );
    }

    findActualParticipant() {
        this.currentAccount = this.userService.getUserWithAuthorities().forEach(jhiUser => {
            this.actualUserId = jhiUser.id;
            this.userAppService.findByUserId(jhiUser.id).subscribe(userApp => {
                const participant = userApp.id;
                this.participantService.findByUser(participant).subscribe(foundParticipant => {
                    this.actualUserId = foundParticipant.id;
                    this.participant = foundParticipant;
                    this.findActualUserInOnHoldQueue();
                });
            });
        });
    }

    findActualUserInOnHoldQueue() {
        const testResultsList = this.testResults;
        for (let row = 0; row < testResultsList.length; row++) {
            if (this.participant.id === testResultsList[row].participant.id) {
                document.getElementById('btn-' + testResultsList[row].focusGroup.id).hidden = true;
            }
        }

        for (let i = 0; i < this.focusGroups.length; i++) {
            for (let j = 0; j < this.focusGroups[i].participants.length; j++) {
                if (this.participant.id === this.focusGroups[i].participants[j].id) {
                    document.getElementById('btn-' + this.focusGroups[i].id).hidden = true;
                }
            }
        }
    }

    openModal(content) {
        this.modalService.open(content).result.then(
            result => {
                console.log(`Closed with: ${result}`);
            },
            reason => {
                console.log(`Dismissed ${this.getDismissReason(reason)}`);
            }
        );
    }

    private getDismissReason(reason: any): string {
        if (reason === ModalDismissReasons.ESC) {
            return 'by pressing ESC';
        } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
            return 'by clicking on a backdrop';
        } else {
            return `with: ${reason}`;
        }
    }

    sendAptitudeTestAnswers(form) {
        this.testResult.grade = this.calculateAverageGrade(form).toString();
        this.testResultsService.create(this.testResult).subscribe(data => {
            this.loadAllTests();
        });
    }

    calculateAverageGrade(form): number {
        let grade = 0;
        for (let test = 0; test < form.childNodes[1].children.length; test++) {
            const elementAnswers = form.childNodes[1].children[test].getElementsByTagName('INPUT');
            for (let answer = 0; answer < elementAnswers.length; answer++) {
                if (elementAnswers[answer].checked === true) {
                    if (this.testQuestions[test].answers[answer].desired === true) {
                        grade = grade + 100;
                    } else {
                        grade = grade + 65;
                    }
                }
            }
        }
        grade = grade / this.testQuestions.length;
        return grade;
    }
}
