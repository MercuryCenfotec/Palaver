import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IIncentive } from 'app/shared/model/incentive.model';

@Component({
    selector: 'jhi-incentive-detail',
    templateUrl: './incentive-detail.component.html'
})
export class IncentiveDetailComponent implements OnInit {
    incentive: IIncentive;

    constructor(protected activatedRoute: ActivatedRoute) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ incentive }) => {
            this.incentive = incentive;
        });
    }

    previousState() {
        window.history.back();
    }
}
