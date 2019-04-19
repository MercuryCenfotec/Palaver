import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiAlertService } from 'ng-jhipster';
import { IChat } from 'app/shared/model/chat.model';
import { ChatService } from './chat.service';
import { IParticipant } from 'app/shared/model/participant.model';
import { ParticipantService } from 'app/entities/participant';
import { IFocusGroup } from 'app/shared/model/focus-group.model';
import { FocusGroupService } from 'app/entities/focus-group';

@Component({
    selector: 'jhi-chat-update',
    templateUrl: './chat-update.component.html'
})
export class ChatUpdateComponent implements OnInit {
    chat: IChat;
    isSaving: boolean;

    participants: IParticipant[];

    focusgroups: IFocusGroup[];

    constructor(
        protected jhiAlertService: JhiAlertService,
        protected chatService: ChatService,
        protected participantService: ParticipantService,
        protected focusGroupService: FocusGroupService,
        protected activatedRoute: ActivatedRoute
    ) {}

    ngOnInit() {
        this.isSaving = false;
        this.activatedRoute.data.subscribe(({ chat }) => {
            this.chat = chat;
        });
        this.participantService
            .query()
            .pipe(
                filter((mayBeOk: HttpResponse<IParticipant[]>) => mayBeOk.ok),
                map((response: HttpResponse<IParticipant[]>) => response.body)
            )
            .subscribe((res: IParticipant[]) => (this.participants = res), (res: HttpErrorResponse) => this.onError(res.message));
        this.focusGroupService
            .query()
            .pipe(
                filter((mayBeOk: HttpResponse<IFocusGroup[]>) => mayBeOk.ok),
                map((response: HttpResponse<IFocusGroup[]>) => response.body)
            )
            .subscribe((res: IFocusGroup[]) => (this.focusgroups = res), (res: HttpErrorResponse) => this.onError(res.message));
    }

    previousState() {
        window.history.back();
    }

    save() {
        this.isSaving = true;
        if (this.chat.id !== undefined) {
            this.subscribeToSaveResponse(this.chatService.update(this.chat));
        } else {
            this.subscribeToSaveResponse(this.chatService.create(this.chat));
        }
    }

    protected subscribeToSaveResponse(result: Observable<HttpResponse<IChat>>) {
        result.subscribe((res: HttpResponse<IChat>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
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

    trackParticipantById(index: number, item: IParticipant) {
        return item.id;
    }

    trackFocusGroupById(index: number, item: IFocusGroup) {
        return item.id;
    }
}
