import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import * as moment from 'moment';
import { DATE_TIME_FORMAT } from 'app/shared/constants/input.constants';
import { JhiAlertService } from 'ng-jhipster';
import { IMessage } from 'app/shared/model/message.model';
import { MessageService } from './message.service';
import { IChat } from 'app/shared/model/chat.model';
import { ChatService } from 'app/entities/chat';

@Component({
    selector: 'jhi-message-update',
    templateUrl: './message-update.component.html'
})
export class MessageUpdateComponent implements OnInit {
    message: IMessage;
    isSaving: boolean;

    chats: IChat[];
    send: string;

    constructor(
        protected jhiAlertService: JhiAlertService,
        protected messageService: MessageService,
        protected chatService: ChatService,
        protected activatedRoute: ActivatedRoute
    ) {}

    ngOnInit() {
        this.isSaving = false;
        this.activatedRoute.data.subscribe(({ message }) => {
            this.message = message;
            this.send = this.message.send != null ? this.message.send.format(DATE_TIME_FORMAT) : null;
        });
        this.chatService
            .query()
            .pipe(
                filter((mayBeOk: HttpResponse<IChat[]>) => mayBeOk.ok),
                map((response: HttpResponse<IChat[]>) => response.body)
            )
            .subscribe((res: IChat[]) => (this.chats = res), (res: HttpErrorResponse) => this.onError(res.message));
    }

    previousState() {
        window.history.back();
    }

    save() {
        this.isSaving = true;
        this.message.send = this.send != null ? moment(this.send, DATE_TIME_FORMAT) : null;
        if (this.message.id !== undefined) {
            this.subscribeToSaveResponse(this.messageService.update(this.message));
        } else {
            this.subscribeToSaveResponse(this.messageService.create(this.message));
        }
    }

    protected subscribeToSaveResponse(result: Observable<HttpResponse<IMessage>>) {
        result.subscribe((res: HttpResponse<IMessage>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
    }

    protected onSaveSuccess() {
        this.isSaving = false;
        this.previousState();
    }

    protected onSaveError() {
        this.isSaving = false;
    }

    protected onError(errorMessage: string) {
        this.jhiAlertService.error(errorMessage, null, null);
    }

    trackChatById(index: number, item: IChat) {
        return item.id;
    }
}
