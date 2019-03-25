import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { startOfDay, endOfDay, subDays, addDays, endOfMonth, isSameDay, isSameMonth, addHours } from 'date-fns';
import { CalendarEvent, CalendarEventAction } from 'angular-calendar';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs';
import { MeetingService } from 'app/entities/meeting';
import { IMeeting } from 'app/shared/model/meeting.model';
import { ParticipantService } from 'app/entities/participant';
import { UserService } from 'app/core';
import { UserAppService } from 'app/entities/user-app/user-app.service';
import { Router } from '@angular/router';

const colors: any = {
    red: {
        primary: '#ad2121',
        secondary: '#FAE3E3'
    },
    blue: {
        primary: '#1e90ff',
        secondary: '#D1E8FF'
    },
    yellow: {
        primary: '#e3bc08',
        secondary: '#FDF1BA'
    }
};

@Component({
    selector: 'jhi-activities-detail',
    templateUrl: './activities-detail.component.html'
})
export class ActivitiesDetailComponent implements OnInit {
    @ViewChild('modalContent') modalContent: TemplateRef<any>;

    view = 'month';

    viewDate: Date = new Date();
    activeDayIsOpen = false;

    actions: CalendarEventAction[] = [
        {
            label: '<i class="ft ft-video"></i>',
            onClick: ({ event }: { event: CalendarEvent }): void => {
                this.goToGroup(event);
            }
        }
    ];

    refresh: Subject<any> = new Subject();

    events: CalendarEvent[];

    constructor(
        private modal: NgbModal,
        private meetingService: MeetingService,
        private participantService: ParticipantService,
        private userService: UserService,
        private userAppService: UserAppService,
        private router: Router
    ) {}

    ngOnInit() {
        this.userService.getUserWithAuthorities().subscribe(user => {
            this.userAppService.findByUserId(user.id).subscribe(userApp => {
                this.participantService.findByUser(userApp.id).subscribe(participant => {
                    this.meetingService.findAllByParticipantId(participant.id).subscribe(meetings => {
                        this.events = meetings.body.map((meeting: IMeeting) => this.setCalendarEvent(meeting));
                    });
                });
            });
        });
    }

    dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
        if (isSameMonth(date, this.viewDate)) {
            if ((isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) || events.length === 0) {
                this.activeDayIsOpen = false;
            } else {
                this.activeDayIsOpen = true;
                this.viewDate = date;
            }
        }
    }

    private goToGroup(event: CalendarEvent) {
        this.router.navigate([event.meta]);
    }

    setCalendarEvent(meeting: IMeeting): any {
        const calendarEvent: CalendarEvent = new class implements CalendarEvent {
            end: Date;
            start: Date;
            title: string;
        }();
        const end = meeting.time.toDate();
        end.setHours(end.getHours() + 2);

        calendarEvent.id = meeting.id;
        calendarEvent.actions = this.actions;
        calendarEvent.start = meeting.time.toDate();
        calendarEvent.end = end;
        calendarEvent.title = meeting.name;
        calendarEvent.color = colors.blue;
        calendarEvent.meta = meeting.callCode;

        return calendarEvent;
    }
}
