import { Component, OnInit } from '@angular/core';
import { IParticipant, Participant } from 'app/shared/model/participant.model';
import { IMeeting } from 'app/shared/model/meeting.model';
import { UserService } from 'app/core';
import { FocusGroupService } from 'app/entities/focus-group/focus-group.service';
import { MeetingService } from 'app/entities/meeting';
import { ParticipantService } from 'app/entities/participant';

@Component({
    selector: 'jhi-focus-group-management',
    templateUrl: './focus-group-management.component.html'
})
export class FocusGroupManagementComponent implements OnInit {
    private participants: Participant[];
    private meetings: IMeeting[];
    searchText;

    constructor(
        protected userService: UserService,
        protected focusGroupService: FocusGroupService,
        protected meetingsService: MeetingService,
        protected participantService: ParticipantService
    ) {}

    ngOnInit() {
        this.userService.getUserWithAuthorities().subscribe(user => {
            this.focusGroupService.findByCode(user.email).subscribe(data => {
                console.log(data);
                this.participantService.findByGroupId(data.body.id).subscribe(participants => {
                    this.participants = participants.map((participant: IParticipant) => this.mapParticipants(participant));
                });

                this.meetingsService.findByGroupId(data.body.id).subscribe(meetings => {
                    this.meetings = meetings.body;
                });
            });
        });
    }

    private mapParticipants(p: IParticipant) {
        let newParticipant = new Participant(p.id, p.birthdate, p.gender, p.civilStatus, p.picture, p.user, p.categories, p.focusGroups);

        return newParticipant;
    }
}
