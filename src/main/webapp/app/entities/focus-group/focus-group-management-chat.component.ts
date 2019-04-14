import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
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
import * as moment from 'moment';
import { MessageService } from 'app/entities/message';
import { IMessage } from 'app/shared/model/message.model';

@Component({
    selector: 'jhi-focus-group-management',
    templateUrl: './focus-group-management.component.html'
})
export class FocusGroupManagementComponent implements OnInit {
    message: IMessage[];
    activeChatUser: string;
    activeChatUserImg: string;
    @ViewChild('messageInput') messageInputRef: ElementRef;

    messages = new Array();
    item: number = 0;
    constructor(private elRef: ElementRef, private messageService: MessageService) {
        this.chat = messageService.findAll;
        this.activeChatUser = 'Elizabeth Elliott';
        this.activeChatUserImg = 'assets/img/portrait/small/avatar-s-3.png';
    }

    ngOnInit() {}

    //send button function calls
    onAddMessage() {
        if (this.messageInputRef.nativeElement.value != '') {
            this.messages.push(this.messageInputRef.nativeElement.value);
        }
        this.messageInputRef.nativeElement.value = '';
        this.messageInputRef.nativeElement.focus();
    }

    //chat user list click event function
    setActive(event, chatId: string) {
        var hElement: HTMLElement = this.elRef.nativeElement;
        //now you can simply get your elements with their class name
        var allAnchors = hElement.getElementsByClassName('list-group-item');
        //do something with selected elements
        [].forEach.call(allAnchors, function(item: HTMLElement) {
            item.setAttribute('class', 'list-group-item no-border');
        });
        //set active class for selected item
        event.currentTarget.setAttribute('class', 'list-group-item bg-blue-grey bg-lighten-5 border-right-primary border-right-2');

        this.messages = [];

        if (chatId === 'chat1') {
            this.chat = this.chatService.chat1;
            this.activeChatUser = 'Elizabeth Elliott';
            this.activeChatUserImg = 'assets/img/portrait/small/avatar-s-3.png';
        }
    }
}
