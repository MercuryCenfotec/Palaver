import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { DATE_FORMAT } from 'app/shared/constants/input.constants';
import { map } from 'rxjs/operators';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared';
import { IMessage } from 'app/shared/model/message.model';

type EntityResponseType = HttpResponse<IMessage>;
type EntityArrayResponseType = HttpResponse<IMessage[]>;

@Injectable({ providedIn: 'root' })
export class MessageService {
    public resourceUrl = SERVER_API_URL + 'api/messages';

    constructor(protected http: HttpClient) {}

    create(message: IMessage): Observable<EntityResponseType> {
        const copy = this.convertDateFromClient(message);
        return this.http
            .post<IMessage>(this.resourceUrl, copy, { observe: 'response' })
            .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
    }

    update(message: IMessage): Observable<EntityResponseType> {
        const copy = this.convertDateFromClient(message);
        return this.http
            .put<IMessage>(this.resourceUrl, copy, { observe: 'response' })
            .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http
            .get<IMessage>(`${this.resourceUrl}/${id}`, { observe: 'response' })
            .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
    }

    query(req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http
            .get<IMessage[]>(this.resourceUrl, { params: options, observe: 'response' })
            .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }

    protected convertDateFromClient(message: IMessage): IMessage {
        const copy: IMessage = Object.assign({}, message, {
            send: message.send != null && message.send.isValid() ? message.send.toJSON() : null
        });
        return copy;
    }

    protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
        if (res.body) {
            res.body.send = res.body.send != null ? moment(res.body.send) : null;
        }
        return res;
    }

    protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
        if (res.body) {
            res.body.forEach((message: IMessage) => {
                message.send = message.send != null ? moment(message.send) : null;
            });
        }
        return res;
    }

    findAllByChat(id: number): Observable<EntityArrayResponseType> {
        return this.http
            .get<IMessage[]>(`${this.resourceUrl}/find_by_chat/${id}`, { observe: 'response' })
            .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
    }
}
