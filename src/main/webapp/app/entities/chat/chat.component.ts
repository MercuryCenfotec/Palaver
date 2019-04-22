import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { IChat } from 'app/shared/model/chat.model';
import { IMessage } from 'app/shared/model/message.model';
import { MessageService } from 'app/entities/message';
import { ChatService } from 'app/entities/chat/chat.service';
import { UserService } from 'app/core';
import { ParticipantService } from 'app/entities/participant';
import { FocusGroupService } from 'app/entities/focus-group';
import * as moment from 'moment';
import { UserAppService } from 'app/entities/user-app';

@Component({
    selector: 'jhi-chat',
    templateUrl: './chat.component.html',
    styleUrls: ['./chat-component.scss']
})
export class ChatComponent implements OnInit {
    chats: IChat[];
    messages: IMessage[];
    activeChatUser: string;
    activeChatUserImg: string;
    newMessage: IMessage;
    activeChat: IChat;
    item = 0;
    searchText;
    isFocusGroup: boolean;
    @ViewChild('messageInput') messageInputRef: ElementRef;
    isSending = false;
    timeLeft = 15;
    interval;

    constructor(
        private elRef: ElementRef,
        private userService: UserService,
        private messageService: MessageService,
        private chatService: ChatService,
        private focusGroupService: FocusGroupService,
        private participantService: ParticipantService,
        private userAppService: UserAppService
    ) {}

    ngOnInit() {
        this.newMessage = new class implements IMessage {
            chat: IChat;
            id: number;
            isFocusGroup: boolean;
            isRead: boolean;
            message: string;
            send: moment.Moment;
        }();
        this.userService.getUserWithAuthorities().subscribe(user => {
            if (user.authorities.includes('ROLE_GROUP')) {
                this.focusGroupService.findByCode(user.login).subscribe(focusGroup => {
                    this.chatService.findByFocusGroup(focusGroup.body.id).subscribe(chats => {
                        this.chats = chats.body;
                        this.isFocusGroup = true;
                        this.activeChat = chats.body[0];
                        this.activeChatUser = chats.body[0].participant.user.name;
                        this.activeChatUserImg = chats.body[0].participant.picture;
                        this.messageService.findAllByChat(this.activeChat.id).subscribe(messages => {
                            this.messages = messages.body;
                            this.startTimer();
                        });
                    });
                });
            } else if (user.authorities.includes('ROLE_PARTICIPANT')) {
                this.userAppService.findByUserId(user.id).subscribe(userApp => {
                    this.participantService.findByUser(userApp.id).subscribe(res => {
                        this.chatService.findByParticipant(res.id).subscribe(chats => {
                            this.chats = chats.body;
                            this.isFocusGroup = false;
                            this.activeChat = chats.body[0];
                            this.activeChatUser = chats.body[0].focusGroup.name;
                            this.activeChatUserImg = chats.body[0].focusGroup.institution.logo;
                            this.messageService.findAllByChat(this.activeChat.id).subscribe(messages => {
                                this.messages = messages.body;
                                this.startTimer();
                            });
                        });
                    });
                });
            }
        });
    }

    isChatEmpty() {
        if (this.chats === null || this.chats.length === 0) {
            return true;
        } else {
            return false;
        }
    }

    // send button function calls
    onAddMessage() {
        if (this.messageInputRef.nativeElement.value !== '') {
            let message;
            this.isSending = true;
            this.newMessage.send = moment();
            this.newMessage.isFocusGroup = this.isFocusGroup;
            this.newMessage.message = this.messageInputRef.nativeElement.value;
            this.newMessage.chat = this.activeChat;
            this.messageService.create(this.newMessage).subscribe(mes => {
                this.activeChat.lastSend = this.newMessage.send;
                this.activeChat.lastMessage = this.newMessage.message;
                message = mes.body;
                this.chatService.update(this.activeChat).subscribe(chat => {
                    this.messages.push(message);
                    this.isSending = false;
                    this.messageInputRef.nativeElement.value = '';
                    this.messageInputRef.nativeElement.focus();
                });
            });
        } else {
            this.messageInputRef.nativeElement.value = '';
            this.messageInputRef.nativeElement.focus();
        }
    }

    startTimer() {
        this.interval = setInterval(() => {
            if (this.timeLeft > 0) {
                this.timeLeft--;
            } else {
                this.timeLeft = 15;
                this.loadActiveChatMessages();
                this.pauseTimer();
            }
        }, 1000);
    }

    pauseTimer() {
        clearInterval(this.interval);
        this.startTimer();
    }

    // chat user list click event function
    setActive(event, chat: IChat) {
        const hElement: HTMLElement = this.elRef.nativeElement;
        // now you can simply get your elements with their class name
        const allAnchors = hElement.getElementsByClassName('list-group-item');
        // do something with selected elements
        [].forEach.call(allAnchors, function(item: HTMLElement) {
            item.setAttribute('class', 'list-group-item no-border');
        });
        // set active class for selected item
        event.currentTarget.setAttribute('class', 'list-group-item bg-blue-grey bg-lighten-5 border-right-primary border-right-2');
        this.loadActiveChatMessages();
        this.startTimer();
    }

    loadActiveChatMessages() {
        this.messageService.findAllByChat(this.activeChat.id).subscribe(messages => {
            this.messages = messages.body;
            if (this.isFocusGroup) {
                this.activeChatUser = this.activeChat.participant.user.name;
                this.activeChatUserImg = this.activeChat.participant.picture;
            } else {
                this.activeChatUser = this.activeChat.focusGroup.name;
                this.activeChatUserImg = this.activeChat.focusGroup.institution.logo;
            }
        });
    }
}
