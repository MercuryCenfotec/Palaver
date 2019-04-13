import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IIncentive } from 'app/shared/model/incentive.model';
import { IncentiveService } from './incentive.service';
import { UserService } from 'app/core';
import { InstitutionService } from 'app/entities/institution';

@Component({
    selector: 'jhi-incentive-form',
    templateUrl: './incentive-form.component.html'
})
export class IncentiveFormComponent implements OnInit {
    incentive: IIncentive;
    isSaving: boolean;

    constructor(
        protected incentiveService: IncentiveService,
        protected activatedRoute: ActivatedRoute,
        protected userService: UserService,
        protected institutionService: InstitutionService
    ) {}

    ngOnInit() {
        this.isSaving = false;
        this.activatedRoute.data.subscribe(({ incentive }) => {
            this.incentive = incentive;
        });

        this.userService.getUserWithAuthorities().subscribe(user => {
            this.institutionService.getByUserUser(user.id).subscribe(institution => {
                this.incentive.institution.id = institution.body.id;
            });
        });
        this.incentive.quantity = 1;
    }

    previousState() {
        window.history.back();
    }

    save() {
        this.isSaving = true;
        this.subscribeToSaveResponse(this.incentiveService.create(this.incentive));
    }

    protected subscribeToSaveResponse(result: Observable<HttpResponse<IIncentive>>) {
        result.subscribe((res: HttpResponse<IIncentive>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
    }

    protected onSaveSuccess() {
        this.isSaving = false;
        this.previousState();
    }

    protected onSaveError() {
        this.isSaving = false;
    }

    validateQuantity() {
        if (this.incentive.quantity > 999 || this.incentive.quantity < 1) {
            return false;
        }
        return true;
    }
}
