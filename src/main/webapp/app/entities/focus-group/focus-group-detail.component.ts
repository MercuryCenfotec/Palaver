import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IFocusGroup } from 'app/shared/model/focus-group.model';

@Component({
    selector: 'jhi-focus-group-detail',
    templateUrl: './focus-group-detail.component.html'
})
export class FocusGroupDetailComponent implements OnInit {
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
