import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IBan } from 'app/shared/model/ban.model';

@Component({
    selector: 'jhi-ban-detail',
    templateUrl: './ban-detail.component.html'
})
export class BanDetailComponent implements OnInit {
    ban: IBan;

    constructor(protected activatedRoute: ActivatedRoute) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ ban }) => {
            this.ban = ban;
        });
    }

    previousState() {
        window.history.back();
    }
}
