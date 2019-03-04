import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared';
import { ITestResult } from 'app/shared/model/test-result.model';

type EntityResponseType = HttpResponse<ITestResult>;
type EntityArrayResponseType = HttpResponse<ITestResult[]>;

@Injectable({ providedIn: 'root' })
export class TestResultService {
    public resourceUrl = SERVER_API_URL + 'api/test-results';

    constructor(protected http: HttpClient) {}

    create(testResult: ITestResult): Observable<EntityResponseType> {
        return this.http.post<ITestResult>(this.resourceUrl, testResult, { observe: 'response' });
    }

    update(testResult: ITestResult): Observable<EntityResponseType> {
        return this.http.put<ITestResult>(this.resourceUrl, testResult, { observe: 'response' });
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<ITestResult>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }

    query(req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http.get<ITestResult[]>(this.resourceUrl, { params: options, observe: 'response' });
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }
}
