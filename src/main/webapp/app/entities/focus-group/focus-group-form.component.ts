import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
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

@Component({
    selector: 'jhi-focus-group-form',
    templateUrl: './focus-group-form.component.html'
})
export class FocusGroupFormComponent implements OnInit {
    focusGroup: IFocusGroup;
    isSaving: boolean;
    incentives: IIncentive[];
    institutions: IInstitution[];
    categories: ICategory[];
    aptitudeTests: IAptitudeTest[];
    participants: IParticipant[];
    beginDateDp: any;
    endDateDp: any;

    constructor(
        protected jhiAlertService: JhiAlertService,
        protected focusGroupService: FocusGroupService,
        protected incentiveService: IncentiveService,
        protected institutionService: InstitutionService,
        protected categoryService: CategoryService,
        protected participantService: ParticipantService,
        protected activatedRoute: ActivatedRoute,
        protected userService: UserService,
        protected aptitudeTestService: AptitudeTestService
    ) {}

    ngOnInit() {
        this.isSaving = false;
        this.activatedRoute.data.subscribe(({ focusGroup }) => {
            this.focusGroup = focusGroup;
            this.focusGroup.aptitudeTest = null;
        });
        this.userService.getUserWithAuthorities().subscribe(user => {
            this.institutionService.getByUserUser(user.id).subscribe(institution => {
                this.aptitudeTestService.findAllByInstitution(institution.body.id).subscribe(aptitudeTests => {
                    this.aptitudeTests = aptitudeTests.body;
                });
            });
        });
        this.incentiveService
            .query()
            .pipe(
                filter((mayBeOk: HttpResponse<IIncentive[]>) => mayBeOk.ok),
                map((response: HttpResponse<IIncentive[]>) => response.body)
            )
            .subscribe((res: IIncentive[]) => (this.incentives = res), (res: HttpErrorResponse) => this.onError(res.message));
        this.institutionService
            .query()
            .pipe(
                filter((mayBeOk: HttpResponse<IInstitution[]>) => mayBeOk.ok),
                map((response: HttpResponse<IInstitution[]>) => response.body)
            )
            .subscribe((res: IInstitution[]) => (this.institutions = res), (res: HttpErrorResponse) => this.onError(res.message));
        this.categoryService
            .query()
            .pipe(
                filter((mayBeOk: HttpResponse<ICategory[]>) => mayBeOk.ok),
                map((response: HttpResponse<ICategory[]>) => response.body)
            )
            .subscribe((res: ICategory[]) => (this.categories = res), (res: HttpErrorResponse) => this.onError(res.message));
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
        this.userService.getUserWithAuthorities().subscribe(data => {
            this.institutionService.getByUserUser(data.id).subscribe(innerData => {
                this.focusGroup.institution = innerData.body;
                this.subscribeToSaveResponse(this.focusGroupService.create(this.focusGroup));
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

    trackIncentiveById(index: number, item: IIncentive) {
        return item.id;
    }

    trackInstitutionById(index: number, item: IInstitution) {
        return item.id;
    }

    trackCategoryById(index: number, item: ICategory) {
        return item.id;
    }

    trackParticipantById(index: number, item: IParticipant) {
        return item.id;
    }

    getSelected(selectedVals: Array<any>, option: any) {
        if (selectedVals) {
            for (let i = 0; i < selectedVals.length; i++) {
                if (option.id === selectedVals[i].id) {
                    return selectedVals[i];
                }
            }
        }
        return option;
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
                console.log(question.answers);
                for (const answer of question.answers) {
                    if (!answer.desired) {
                        ind++;
                        console.log(ind);
                        console.log(answer);
                    }
                }
                if (ind === question.answers.length) {
                    return false;
                }
            }
        }
        return true;
    }
}
