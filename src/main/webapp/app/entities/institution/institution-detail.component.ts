import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IInstitution } from 'app/shared/model/institution.model';

@Component({
    selector: 'jhi-institution-detail',
    templateUrl: './institution-detail.component.html'
})
export class InstitutionDetailComponent implements OnInit {
    institution: IInstitution;

    constructor(protected activatedRoute: ActivatedRoute) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ institution }) => {
            this.institution = institution;
        });
    }

    previousState() {
        window.history.back();
    }
}
