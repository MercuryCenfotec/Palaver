import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { JhiAlertService } from 'ng-jhipster';
import { IFocusGroup } from 'app/shared/model/focus-group.model';
import { FocusGroupService } from './focus-group.service';
import { IIncentive } from 'app/shared/model/incentive.model';
import { IncentiveService } from 'app/entities/incentive';
import { IInstitution } from 'app/shared/model/institution.model';
import { InstitutionService } from 'app/entities/institution';
import { ICategory } from 'app/shared/model/category.model';
import { CategoryService } from 'app/entities/category';
import { IParticipant } from 'app/shared/model/participant.model';
import { ParticipantService } from 'app/entities/participant';
import { UserService } from 'app/core';
import { IAptitudeTest } from 'app/shared/model/aptitude-test.model';
import { AptitudeTestService } from 'app/entities/aptitude-test';
import { ITestAnswerOption } from 'app/shared/model/test-answer-option.model';
import { ITestQuestion } from 'app/shared/model/test-question.model';
import { NgbDatepickerConfig } from '@ng-bootstrap/ng-bootstrap';
import { Subscriber } from 'app/shared/util/subscriber';
import { BalanceAccountService } from 'app/entities/balance-account';
import { IBalanceAccount } from 'app/shared/model/balance-account.model';

@Component({
    selector: 'jhi-focus-group-form',
    templateUrl: './focus-group-form.component.html'
})
export class FocusGroupFormComponent implements OnInit {
    focusGroup: IFocusGroup;
    isSaving: boolean;
    incentives: IIncentive[] = [];
    institutions: IInstitution[];
    institution: IInstitution;
    categories: ICategory[];
    aptitudeTests: IAptitudeTest[];
    participants: IParticipant[];
    endDateSelected: boolean;
    clonedTest: boolean;
    isMember = false;
    userBalance: IBalanceAccount;
    groupCost: number;
    formatedCost: string;
    baseGroupCost = 30000;
    baseParticipantCost = 25000;

    constructor(
        protected jhiAlertService: JhiAlertService,
        protected focusGroupService: FocusGroupService,
        protected incentiveService: IncentiveService,
        protected institutionService: InstitutionService,
        protected participantService: ParticipantService,
        protected activatedRoute: ActivatedRoute,
        protected userService: UserService,
        protected aptitudeTestService: AptitudeTestService,
        protected balanceService: BalanceAccountService,
        protected config: NgbDatepickerConfig,
        private __router: Router,
        protected subscriber: Subscriber<boolean>
    ) {
        subscriber.subscribe(cloningAccepted => {
            if (!cloningAccepted) {
                this.focusGroup.aptitudeTest = null;
                this.clonedTest = false;
            } else {
                this.clonedTest = true;
                for (const question of this.focusGroup.aptitudeTest.questions) {
                    for (const answer of question.answers) {
                        answer.desired = false;
                    }
                }
            }
        });
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
        this.isSaving = false;
        this.endDateSelected = false;
        this.activatedRoute.data.subscribe(({ focusGroup }) => {
            this.focusGroup = focusGroup;
            this.calculateCost();
            this.focusGroup.aptitudeTest = null;
        });
        this.userService.getUserWithAuthorities().subscribe(user => {
            console.log(user);
            this.institutionService.getByUserUser(user.id).subscribe(institution => {
                if (institution.body.membership.id === 2) {
                    this.isMember = true;
                } else {
                    this.isMember = false;
                }
                this.institution = institution.body;
                this.aptitudeTestService.findAllByInstitution(institution.body.id).subscribe(aptitudeTests => {
                    this.aptitudeTests = aptitudeTests.body;
                });
                this.balanceService.findByUserId(institution.body.user.id).subscribe(balance => {
                    this.userBalance = balance.body;
                    console.log(balance.body);
                });
            });
        });
    }

    previousState() {
        this.__router.navigate(['/', 'focus-group']);
    }

    save() {
        this.isSaving = true;
        this.userService.getUserWithAuthorities().subscribe(data => {
            console.log(data);
            this.institutionService.getByUserUser(data.id).subscribe(institution => {
                console.log(institution);
                this.focusGroup.institution = institution.body;
                if (!this.focusGroup.aptitudeTest) {
                    this.focusGroup.passingGrade = 100;
                }
                if (institution.body.membership.id === 2) {
                    this.focusGroup.incentive.quantity -= this.focusGroup.participantsAmount;
                    this.incentiveService.update(this.focusGroup.incentive).subscribe(res => {
                        this.subscribeToSaveResponse(this.focusGroupService.create(this.focusGroup));
                    });
                } else {
                    this.subscribeToSaveResponse(this.focusGroupService.create(this.focusGroup));
                }
            });
        });
    }

    protected subscribeToSaveResponse(result: Observable<HttpResponse<IFocusGroup>>) {
        result.subscribe((res: HttpResponse<IFocusGroup>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
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

    desiredAnswer(question: ITestQuestion, desiredAnswer: ITestAnswerOption) {
        question.answers.forEach(function(answer: ITestAnswerOption) {
            answer.desired = answer.id === desiredAnswer.id;
        });
    }

    validateAnswers(): boolean {
        if (this.focusGroup.aptitudeTest) {
            let ind: number;
            for (const question of this.focusGroup.aptitudeTest.questions) {
                ind = 0;
                for (const answer of question.answers) {
                    if (!answer.desired) {
                        ind++;
                    }
                }
                if (ind === question.answers.length) {
                    return false;
                }
            }
        }
        return true;
    }

    validEndDate(): boolean {
        return this.focusGroup.endDate > this.focusGroup.beginDate;
    }

    validateTest() {
        if (this.focusGroup.aptitudeTest !== null) {
            this.focusGroupService.testIsAvailable(this.focusGroup.aptitudeTest.id).subscribe(group => {
                if (!group.body) {
                    this.__router.navigate(['/', 'focus-group', { outlets: { popup: 'clone-test' } }]);
                }
            });
        } else {
            this.focusGroup.passingGrade = null;
        }
    }

    validatePassingGrade(): boolean {
        if (this.focusGroup.passingGrade !== null) {
            if (this.focusGroup.passingGrade > 100 || this.focusGroup.passingGrade < 1) {
                return false;
            }
            return true;
        }
        return true;
    }

    validateParticipantsAmount(): boolean {
        if (this.focusGroup.participantsAmount < 4 || this.focusGroup.participantsAmount > 12) {
            return false;
        }
        this.calculateCost();
        return true;
    }

    calculateCost() {
        const formatter = new Intl.NumberFormat('es', {
            style: 'currency',
            currency: 'CRC',
            minimumFractionDigits: 2
        });
        if (this.focusGroup.participantsAmount) {
            this.groupCost = this.focusGroup.participantsAmount * this.baseParticipantCost + this.baseGroupCost;
            this.formatedCost = formatter.format(this.groupCost);
        }
    }

    insufficientBalance(): boolean {
        return this.groupCost > this.userBalance.balance;
    }

    validateIncentive() {
        if (this.focusGroup.incentive.quantity < this.focusGroup.participantsAmount || !this.isMember) {
            this.focusGroup.incentive = null;
        }
    }

    loadIncentives() {
        this.incentiveService
            .findAllByInstitutionAndQuantity(this.institution.id, this.focusGroup.participantsAmount - 1)
            .subscribe(incentives => {
                this.incentives = incentives.body;
                this.focusGroup.incentive = null;
            });
    }
}
