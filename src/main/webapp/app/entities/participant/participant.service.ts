import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { DATE_FORMAT } from 'app/shared/constants/input.constants';
import { map } from 'rxjs/operators';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared';
import { IParticipant, Participant } from 'app/shared/model/participant.model';
import { IUserApp } from 'app/shared/model/user-app.model';

type EntityResponseType = HttpResponse<IParticipant>;
type EntityArrayResponseType = HttpResponse<IParticipant[]>;

@Injectable({ providedIn: 'root' })
export class ParticipantService {
    public resourceUrl = SERVER_API_URL + 'api/participants';

    constructor(protected http: HttpClient) {}

    create(participant: IParticipant): Observable<EntityResponseType> {
        const copy = this.convertDateFromClient(participant);
        return this.http
            .post<IParticipant>(this.resourceUrl, copy, { observe: 'response' })
            .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
    }

    update(participant: IParticipant): Observable<EntityResponseType> {
        const copy = this.convertDateFromClient(participant);
        return this.http
            .put<IParticipant>(this.resourceUrl, copy, { observe: 'response' })
            .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http
            .get<IParticipant>(`${this.resourceUrl}/${id}`, { observe: 'response' })
            .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
    }

    query(req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http
            .get<IParticipant[]>(this.resourceUrl, { params: options, observe: 'response' })
            .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }

    findByUser(id: number): Observable<IParticipant> {
        return this.http.get<IParticipant>(`${this.resourceUrl}/user/${id}`);
    }

    protected convertDateFromClient(participant: IParticipant): IParticipant {
        const copy: IParticipant = Object.assign({}, participant, {
            birthdate: participant.birthdate != null && participant.birthdate.isValid() ? participant.birthdate.format(DATE_FORMAT) : null
        });
        return copy;
    }

    protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
        if (res.body) {
            res.body.birthdate = res.body.birthdate != null ? moment(res.body.birthdate) : null;
        }
        return res;
    }

    protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
        if (res.body) {
            res.body.forEach((participant: IParticipant) => {
                participant.birthdate = participant.birthdate != null ? moment(participant.birthdate) : null;
            });
        }
        return res;
    }
}
