import { Component, OnInit } from '@angular/core';
import { IFocusGroup } from 'app/shared/model/focus-group.model';
import { FocusGroupService } from 'app/entities/focus-group';
import { filter, map } from 'rxjs/operators';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { JhiAlertService } from 'ng-jhipster';

@Component({
    selector: 'jhi-user-home',
    templateUrl: './user-home.component.html',
    styles: []
})
export class UserHomeComponent implements OnInit {
    focusGroups: IFocusGroup[];

    constructor(protected focusGroupService: FocusGroupService, protected jhiAlertService: JhiAlertService) {}

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
                },
                (res: HttpErrorResponse) => this.onError(res.message)
            );
    }

    ngOnInit() {
        this.loadAll();
    }

    protected onError(errorMessage: string) {
        this.jhiAlertService.error(errorMessage, null, null);
    }
}
