import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IFocusGroup } from 'app/shared/model/focus-group.model';
import { ParticipantService } from 'app/entities/participant';
import { ClipboardService } from 'ngx-clipboard';
import { FocusGroupService } from 'app/entities/focus-group/focus-group.service';

@Component({
    selector: 'jhi-focus-group-detail',
    templateUrl: './focus-group-detail.component.html'
})
export class FocusGroupDetailComponent implements OnInit {
    focusGroup: IFocusGroup;
    searchText;

    isCancelable: boolean;
    constructor(
        protected activatedRoute: ActivatedRoute,
        private _clipboardService: ClipboardService,
        protected focusGroupService: FocusGroupService,
        protected participantService: ParticipantService
    ) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ focusGroup }) => {
            this.focusGroup = focusGroup;
        });
        this.participantService.findByFocusGroup(this.focusGroup.id).subscribe(participants => {
            console.log(participants.body);
            this.focusGroup.participants = participants.body;
        });
        this.validateCancelable();
    }

    previousState() {
        window.history.back();
    }

    copy() {
        this._clipboardService.copyFromContent(this.focusGroup.code);
    }

    validateCancelable() {
        this.focusGroupService.isCancelable(this.focusGroup.id).subscribe(data => {
            this.isCancelable = data.body;
        });
    }
}
