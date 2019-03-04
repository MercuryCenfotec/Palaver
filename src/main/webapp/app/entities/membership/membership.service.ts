import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared';
import { IMembership } from 'app/shared/model/membership.model';

type EntityResponseType = HttpResponse<IMembership>;
type EntityArrayResponseType = HttpResponse<IMembership[]>;

@Injectable({ providedIn: 'root' })
export class MembershipService {
    public resourceUrl = SERVER_API_URL + 'api/memberships';

    constructor(protected http: HttpClient) {}

    create(membership: IMembership): Observable<EntityResponseType> {
        return this.http.post<IMembership>(this.resourceUrl, membership, { observe: 'response' });
    }

    update(membership: IMembership): Observable<EntityResponseType> {
        return this.http.put<IMembership>(this.resourceUrl, membership, { observe: 'response' });
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<IMembership>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }

    query(req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http.get<IMembership[]>(this.resourceUrl, { params: options, observe: 'response' });
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }
}
