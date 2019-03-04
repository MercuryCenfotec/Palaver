import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IUserApp } from 'app/shared/model/user-app.model';

@Component({
    selector: 'jhi-user-app-detail',
    templateUrl: './user-app-detail.component.html'
})
export class UserAppDetailComponent implements OnInit {
    userApp: IUserApp;

    constructor(protected activatedRoute: ActivatedRoute) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ userApp }) => {
            this.userApp = userApp;
        });
    }

    previousState() {
        window.history.back();
    }
}
