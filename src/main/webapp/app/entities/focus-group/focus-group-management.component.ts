import { Component, OnInit } from '@angular/core';
import { IParticipant, Participant } from 'app/shared/model/participant.model';
import { IMeeting } from 'app/shared/model/meeting.model';
import { UserService } from 'app/core';
import { FocusGroupService } from 'app/entities/focus-group/focus-group.service';
import { MeetingService } from 'app/entities/meeting';
import { ParticipantService } from 'app/entities/participant';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { IFocusGroup } from 'app/shared/model/focus-group.model';
import { filter, map } from 'rxjs/operators';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { ClipboardService } from 'ngx-clipboard';
import moment = require('moment');

@Component({
    selector: 'jhi-focus-group-management',
    templateUrl: './focus-group-management.component.html'
})
export class FocusGroupManagementComponent implements OnInit {
    private meeting: IMeeting;
    private participants: Participant[];
    private meetings: IMeeting[];
    private participant: IParticipant;
    private focusGroup: IFocusGroup;
    searchText;

    constructor(
        protected userService: UserService,
        private _clipboardService: ClipboardService,
        protected focusGroupService: FocusGroupService,
        protected meetingsService: MeetingService,
        protected participantService: ParticipantService,
        protected modalService: NgbModal
    ) {}

    ngOnInit() {
        this.userService.getUserWithAuthorities().subscribe(user => {
            this.focusGroupService.findByCode(user.login).subscribe(data => {
                this.focusGroup = data.body;
                this.participantService.findByFocusGroup(data.body.id).subscribe(participants => {
                    this.focusGroup.participants = participants.body;
                });
                this.meetingsService.findByGroupId(data.body.id).subscribe(meetings => {
                    this.meeting = meetings.body.length ? meetings.body[0] : null;
                });
            });
        });
    }

    copy() {
        this._clipboardService.copyFromContent(this.meeting.callCode);
    }

    expulsion(participant, modalToDisplay) {
        this.participant = participant;
        this.openModal(modalToDisplay);
    }

    openModal(content) {
        this.modalService.open(content).result.then(
            result => {
                console.log(`Closed with: ${result}`);
            },
            reason => {
                console.log(`Dismissed ${this.getDismissReason(reason)}`);
            }
        );
    }

    private getDismissReason(reason: any): string {
        if (reason === ModalDismissReasons.ESC) {
            return 'by pressing ESC';
        } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
            return 'by clicking on a backdrop';
        } else {
            return `with: ${reason}`;
        }
    }

    sendExpulsionMotive(input) {
        for (let i = 0; i < this.focusGroup.participants.length; i++) {
            if (this.focusGroup.participants[i].id === this.participant.id) {
                this.focusGroup.participants.splice(i, 1);
            }
        }

        this.focusGroupService.update(this.focusGroup).subscribe(data => {
            this.ngOnInit();
            this.ngOnInit();
        });
    }

    checkDate() {
        return (
            this.meeting.date.toDate().getDate() ===
            moment()
                .toDate()
                .getDate()
        );
    }
}
