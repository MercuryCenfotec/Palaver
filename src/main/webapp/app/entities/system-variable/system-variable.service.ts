import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared';
import { ISystemVariable } from 'app/shared/model/system-variable.model';

type EntityResponseType = HttpResponse<ISystemVariable>;
type EntityArrayResponseType = HttpResponse<ISystemVariable[]>;

@Injectable({ providedIn: 'root' })
export class SystemVariableService {
    public resourceUrl = SERVER_API_URL + 'api/system-variables';

    constructor(protected http: HttpClient) {}

    create(systemVariable: ISystemVariable): Observable<EntityResponseType> {
        return this.http.post<ISystemVariable>(this.resourceUrl, systemVariable, { observe: 'response' });
    }

    update(systemVariable: ISystemVariable): Observable<EntityResponseType> {
        return this.http.put<ISystemVariable>(this.resourceUrl, systemVariable, { observe: 'response' });
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<ISystemVariable>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }

    query(req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http.get<ISystemVariable[]>(this.resourceUrl, { params: options, observe: 'response' });
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }
}
