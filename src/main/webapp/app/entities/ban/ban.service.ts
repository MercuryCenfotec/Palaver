import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared';
import { IBan } from 'app/shared/model/ban.model';

type EntityResponseType = HttpResponse<IBan>;
type EntityArrayResponseType = HttpResponse<IBan[]>;

@Injectable({ providedIn: 'root' })
export class BanService {
    public resourceUrl = SERVER_API_URL + 'api/bans';

    constructor(protected http: HttpClient) {}

    create(ban: IBan): Observable<EntityResponseType> {
        return this.http.post<IBan>(this.resourceUrl, ban, { observe: 'response' });
    }

    update(ban: IBan): Observable<EntityResponseType> {
        return this.http.put<IBan>(this.resourceUrl, ban, { observe: 'response' });
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<IBan>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }

    query(req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http.get<IBan[]>(this.resourceUrl, { params: options, observe: 'response' });
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }
}
