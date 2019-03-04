import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiAlertService } from 'ng-jhipster';
import { ICategory } from 'app/shared/model/category.model';
import { CategoryService } from './category.service';
import { IFocusGroup } from 'app/shared/model/focus-group.model';
import { FocusGroupService } from 'app/entities/focus-group';
import { IParticipant } from 'app/shared/model/participant.model';
import { ParticipantService } from 'app/entities/participant';

@Component({
    selector: 'jhi-category-update',
    templateUrl: './category-update.component.html'
})
export class CategoryUpdateComponent implements OnInit {
    category: ICategory;
    isSaving: boolean;

    focusgroups: IFocusGroup[];

    participants: IParticipant[];

    constructor(
        protected jhiAlertService: JhiAlertService,
        protected categoryService: CategoryService,
        protected focusGroupService: FocusGroupService,
        protected participantService: ParticipantService,
        protected activatedRoute: ActivatedRoute
    ) {}

    ngOnInit() {
        this.isSaving = false;
        this.activatedRoute.data.subscribe(({ category }) => {
            this.category = category;
        });
        this.focusGroupService
            .query()
            .pipe(
                filter((mayBeOk: HttpResponse<IFocusGroup[]>) => mayBeOk.ok),
                map((response: HttpResponse<IFocusGroup[]>) => response.body)
            )
            .subscribe((res: IFocusGroup[]) => (this.focusgroups = res), (res: HttpErrorResponse) => this.onError(res.message));
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
        if (this.category.id !== undefined) {
            this.subscribeToSaveResponse(this.categoryService.update(this.category));
        } else {
            this.subscribeToSaveResponse(this.categoryService.create(this.category));
        }
    }

    protected subscribeToSaveResponse(result: Observable<HttpResponse<ICategory>>) {
        result.subscribe((res: HttpResponse<ICategory>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
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

    trackFocusGroupById(index: number, item: IFocusGroup) {
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
}
