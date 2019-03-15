import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared';
import { ITestQuestion } from 'app/shared/model/test-question.model';

type EntityResponseType = HttpResponse<ITestQuestion>;
type EntityArrayResponseType = HttpResponse<ITestQuestion[]>;

@Injectable({ providedIn: 'root' })
export class TestQuestionService {
    public resourceUrl = SERVER_API_URL + 'api/test-questions';

    constructor(protected http: HttpClient) {}

    create(testQuestion: ITestQuestion): Observable<EntityResponseType> {
        return this.http.post<ITestQuestion>(this.resourceUrl, testQuestion, { observe: 'response' });
    }

    update(testQuestion: ITestQuestion): Observable<EntityResponseType> {
        return this.http.put<ITestQuestion>(this.resourceUrl, testQuestion, { observe: 'response' });
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<ITestQuestion>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }

    query(req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http.get<ITestQuestion[]>(this.resourceUrl, { params: options, observe: 'response' });
    }

    findAllByAptituteTest(id: number): Observable<EntityArrayResponseType> {
        return this.http.get<ITestQuestion[]>(`${this.resourceUrl}/aptitude/${id}`, { observe: 'response' });
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }
}
