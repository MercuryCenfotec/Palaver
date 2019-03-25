import { Component, OnInit } from '@angular/core';
import { IParticipant, Participant } from 'app/shared/model/participant.model';
import { IMeeting } from 'app/shared/model/meeting.model';
import { UserService } from 'app/core';
import { FocusGroupService } from 'app/entities/focus-group/focus-group.service';
import { MeetingService } from 'app/entities/meeting';
import { ParticipantService } from 'app/entities/participant';
import { ClipboardService } from 'ngx-clipboard';
import { IFocusGroup } from 'app/shared/model/focus-group.model';

@Component({
    selector: 'jhi-focus-group-management',
    templateUrl: './focus-group-management.component.html'
})
export class FocusGroupManagementComponent implements OnInit {
    private meeting: IMeeting;
    focusGroup: IFocusGroup;
    searchText;

    constructor(
        protected userService: UserService,
        private _clipboardService: ClipboardService,
        protected focusGroupService: FocusGroupService,
        protected meetingsService: MeetingService,
        protected participantService: ParticipantService
    ) {}

    ngOnInit() {
        this.userService.getUserWithAuthorities().subscribe(user => {
            this.focusGroupService.findByCode(user.login).subscribe(data => {
                this.focusGroup = data.body;
                console.log(data.body);
                this.meetingsService.findByGroupId(data.body.id).subscribe(meetings => {
                    this.meeting = meetings.body.length ? meetings.body[0] : null;
                });
            });
        });
    }

    copy() {
        this._clipboardService.copyFromContent(this.meeting.callCode);
    }
}
