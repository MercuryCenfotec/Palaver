import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared';
import { IInstitution } from 'app/shared/model/institution.model';

type EntityResponseType = HttpResponse<IInstitution>;
type EntityArrayResponseType = HttpResponse<IInstitution[]>;

@Injectable({ providedIn: 'root' })
export class InstitutionService {
    public resourceUrl = SERVER_API_URL + 'api/institutions';

    constructor(protected http: HttpClient) {}

    create(institution: IInstitution): Observable<EntityResponseType> {
        return this.http.post<IInstitution>(this.resourceUrl, institution, { observe: 'response' });
    }

    update(institution: IInstitution): Observable<EntityResponseType> {
        return this.http.put<IInstitution>(this.resourceUrl, institution, { observe: 'response' });
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<IInstitution>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }

    query(req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http.get<IInstitution[]>(this.resourceUrl, { params: options, observe: 'response' });
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }

    getByUserUser(id: number): Observable<EntityResponseType> {
        return this.http.get<IInstitution>(`${this.resourceUrl}/user/${id}`, { observe: 'response' });
    }
}
