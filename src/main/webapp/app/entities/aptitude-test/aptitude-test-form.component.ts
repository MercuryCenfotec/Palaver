import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiAlertService } from 'ng-jhipster';
import { IAptitudeTest } from 'app/shared/model/aptitude-test.model';
import { AptitudeTestService } from './aptitude-test.service';
import { IInstitution } from 'app/shared/model/institution.model';
import { InstitutionService } from 'app/entities/institution';

@Component({
    selector: 'jhi-aptitude-test-form',
    templateUrl: './aptitude-test-form.component.html'
})
export class AptitudeTestFormComponent implements OnInit {
    aptitudeTest: IAptitudeTest;
    isSaving: boolean;

    institutions: IInstitution[];

    constructor(
        protected jhiAlertService: JhiAlertService,
        protected aptitudeTestService: AptitudeTestService,
        protected institutionService: InstitutionService,
        protected activatedRoute: ActivatedRoute
    ) {}

    ngOnInit() {
        this.isSaving = false;
        this.activatedRoute.data.subscribe(({ aptitudeTest }) => {
            this.aptitudeTest = aptitudeTest;
        });
        this.institutionService
            .query()
            .pipe(
                filter((mayBeOk: HttpResponse<IInstitution[]>) => mayBeOk.ok),
                map((response: HttpResponse<IInstitution[]>) => response.body)
            )
            .subscribe((res: IInstitution[]) => (this.institutions = res), (res: HttpErrorResponse) => this.onError(res.message));
    }

    previousState() {
        window.history.back();
    }

    save() {
        this.isSaving = true;
        if (this.aptitudeTest.id !== undefined) {
            this.subscribeToSaveResponse(this.aptitudeTestService.update(this.aptitudeTest));
        } else {
            this.subscribeToSaveResponse(this.aptitudeTestService.create(this.aptitudeTest));
        }
    }

    protected subscribeToSaveResponse(result: Observable<HttpResponse<IAptitudeTest>>) {
        result.subscribe((res: HttpResponse<IAptitudeTest>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
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

    trackInstitutionById(index: number, item: IInstitution) {
        return item.id;
    }
}
