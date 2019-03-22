import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IFocusGroup } from 'app/shared/model/focus-group.model';
import { ParticipantService } from 'app/entities/participant';

@Component({
    selector: 'jhi-focus-group-detail',
    templateUrl: './focus-group-detail.component.html'
})
export class FocusGroupDetailComponent implements OnInit {
    focusGroup: IFocusGroup;

    constructor(protected activatedRoute: ActivatedRoute, protected participantService: ParticipantService) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ focusGroup }) => {
            this.focusGroup = focusGroup;
        });
        this.participantService.findByFocusGroup(this.focusGroup.id).subscribe(participants => {});
    }

    previousState() {
        window.history.back();
    }
}
