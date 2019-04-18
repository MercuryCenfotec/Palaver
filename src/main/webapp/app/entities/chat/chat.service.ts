import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared';
import { IChat } from 'app/shared/model/chat.model';

type EntityResponseType = HttpResponse<IChat>;
type EntityArrayResponseType = HttpResponse<IChat[]>;

@Injectable({ providedIn: 'root' })
export class ChatService {
    public resourceUrl = SERVER_API_URL + 'api/chats';

    constructor(protected http: HttpClient) {}

    create(chat: IChat): Observable<EntityResponseType> {
        return this.http.post<IChat>(this.resourceUrl, chat, { observe: 'response' });
    }

    update(chat: IChat): Observable<EntityResponseType> {
        return this.http.put<IChat>(this.resourceUrl, chat, { observe: 'response' });
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<IChat>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }

    query(req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http.get<IChat[]>(this.resourceUrl, { params: options, observe: 'response' });
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }

    findByParticipant(id: number): Observable<EntityArrayResponseType> {
        return this.http.get<IChat[]>(`${this.resourceUrl}/find_by_participant/${id}`, { observe: 'response' });
    }

    findByFocusGroup(id: number): Observable<EntityArrayResponseType> {
        return this.http.get<IChat[]>(`${this.resourceUrl}/find_by_focus_group/${id}`, { observe: 'response' });
    }
}
