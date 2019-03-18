import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared';
import { ITestAnswerOption } from 'app/shared/model/test-answer-option.model';
import { ITestQuestion } from 'app/shared/model/test-question.model';

type EntityResponseType = HttpResponse<ITestAnswerOption>;
type EntityArrayResponseType = HttpResponse<ITestAnswerOption[]>;

@Injectable({ providedIn: 'root' })
export class TestAnswerOptionService {
    public resourceUrl = SERVER_API_URL + 'api/test-answer-options';

    constructor(protected http: HttpClient) {}

    create(testAnswerOption: ITestAnswerOption): Observable<EntityResponseType> {
        return this.http.post<ITestAnswerOption>(this.resourceUrl, testAnswerOption, { observe: 'response' });
    }

    update(testAnswerOption: ITestAnswerOption): Observable<EntityResponseType> {
        return this.http.put<ITestAnswerOption>(this.resourceUrl, testAnswerOption, { observe: 'response' });
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<ITestAnswerOption>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }

    query(req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http.get<ITestAnswerOption[]>(this.resourceUrl, { params: options, observe: 'response' });
    }

    findAllByTestQuestion(id: number): Observable<EntityArrayResponseType> {
        return this.http.get<ITestQuestion[]>(`${this.resourceUrl}/test-question/${id}`, { observe: 'response' });
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }
}
