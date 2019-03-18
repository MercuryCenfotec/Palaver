import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IFocusGroup } from 'app/shared/model/focus-group.model';

@Component({
    selector: 'jhi-focus-group-management',
    templateUrl: './focus-group-management.component.html'
})
export class FocusGroupManagementComponent implements OnInit {
    focusGroup: IFocusGroup;

    constructor(protected activatedRoute: ActivatedRoute) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ focusGroup }) => {
            this.focusGroup = focusGroup;
        });
    }

    previousState() {
        window.history.back();
    }
}
