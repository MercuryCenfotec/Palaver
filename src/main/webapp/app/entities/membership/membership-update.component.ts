import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { IMembership } from 'app/shared/model/membership.model';
import { MembershipService } from './membership.service';

@Component({
    selector: 'jhi-membership-update',
    templateUrl: './membership-update.component.html'
})
export class MembershipUpdateComponent implements OnInit {
    membership: IMembership;
    isSaving: boolean;

    constructor(protected membershipService: MembershipService, protected activatedRoute: ActivatedRoute) {}

    ngOnInit() {
        this.isSaving = false;
        this.activatedRoute.data.subscribe(({ membership }) => {
            this.membership = membership;
        });
    }

    previousState() {
        window.history.back();
    }

    save() {
        this.isSaving = true;
        if (this.membership.id !== undefined) {
            this.subscribeToSaveResponse(this.membershipService.update(this.membership));
        } else {
            this.subscribeToSaveResponse(this.membershipService.create(this.membership));
        }
    }

    protected subscribeToSaveResponse(result: Observable<HttpResponse<IMembership>>) {
        result.subscribe((res: HttpResponse<IMembership>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
    }

    protected onSaveSuccess() {
        this.isSaving = false;
        this.previousState();
    }

    protected onSaveError() {
        this.isSaving = false;
    }
}
