import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared';
import { IUserApp } from 'app/shared/model/user-app.model';

type EntityResponseType = HttpResponse<IUserApp>;
type EntityArrayResponseType = HttpResponse<IUserApp[]>;

@Injectable({ providedIn: 'root' })
export class UserAppService {
    public resourceUrl = SERVER_API_URL + 'api/user-apps';

    constructor(protected http: HttpClient) {}

    create(userApp: IUserApp): Observable<EntityResponseType> {
        return this.http.post<IUserApp>(this.resourceUrl, userApp, { observe: 'response' });
    }

    update(userApp: IUserApp): Observable<EntityResponseType> {
        return this.http.put<IUserApp>(this.resourceUrl, userApp, { observe: 'response' });
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<IUserApp>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }

    query(req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http.get<IUserApp[]>(this.resourceUrl, { params: options, observe: 'response' });
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }
}
