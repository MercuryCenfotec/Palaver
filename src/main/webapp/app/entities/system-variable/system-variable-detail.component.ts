import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ISystemVariable } from 'app/shared/model/system-variable.model';

@Component({
    selector: 'jhi-system-variable-detail',
    templateUrl: './system-variable-detail.component.html'
})
export class SystemVariableDetailComponent implements OnInit {
    systemVariable: ISystemVariable;

    constructor(protected activatedRoute: ActivatedRoute) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ systemVariable }) => {
            this.systemVariable = systemVariable;
        });
    }

    previousState() {
        window.history.back();
    }
}
