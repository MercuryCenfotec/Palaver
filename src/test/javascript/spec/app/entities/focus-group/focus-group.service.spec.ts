/* tslint:disable max-line-length */
import { TestBed, getTestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { of } from 'rxjs';
import { take, map } from 'rxjs/operators';
import * as moment from 'moment';
import { DATE_FORMAT } from 'app/shared/constants/input.constants';
import { FocusGroupService } from 'app/entities/focus-group/focus-group.service';
import { IFocusGroup, FocusGroup } from 'app/shared/model/focus-group.model';

describe('Service Tests', () => {
    describe('FocusGroup Service', () => {
        let injector: TestBed;
        let service: FocusGroupService;
        let httpMock: HttpTestingController;
        let elemDefault: IFocusGroup;
        let currentDate: moment.Moment;
        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [HttpClientTestingModule]
            });
            injector = getTestBed();
            service = injector.get(FocusGroupService);
            httpMock = injector.get(HttpTestingController);
            currentDate = moment();

            elemDefault = new FocusGroup(0, 'AAAAAAA', 'AAAAAAA', currentDate, currentDate, 'AAAAAAA');
        });

        describe('Service methods', async () => {
            it('should find an element', async () => {
                const returnedFromService = Object.assign(
                    {
                        beginDate: currentDate.format(DATE_FORMAT),
                        endDate: currentDate.format(DATE_FORMAT)
                    },
                    elemDefault
                );
                service
                    .find(123)
                    .pipe(take(1))
                    .subscribe(resp => expect(resp).toMatchObject({ body: elemDefault }));

                const req = httpMock.expectOne({ method: 'GET' });
                req.flush(JSON.stringify(returnedFromService));
            });

            it('should create a FocusGroup', async () => {
                const returnedFromService = Object.assign(
                    {
                        id: 0,
                        beginDate: currentDate.format(DATE_FORMAT),
                        endDate: currentDate.format(DATE_FORMAT)
                    },
                    elemDefault
                );
                const expected = Object.assign(
                    {
                        beginDate: currentDate,
                        endDate: currentDate
                    },
                    returnedFromService
                );
                service
                    .create(new FocusGroup(null))
                    .pipe(take(1))
                    .subscribe(resp => expect(resp).toMatchObject({ body: expected }));
                const req = httpMock.expectOne({ method: 'POST' });
                req.flush(JSON.stringify(returnedFromService));
            });

            it('should update a FocusGroup', async () => {
                const returnedFromService = Object.assign(
                    {
                        name: 'BBBBBB',
                        description: 'BBBBBB',
                        beginDate: currentDate.format(DATE_FORMAT),
                        endDate: currentDate.format(DATE_FORMAT),
                        code: 'BBBBBB'
                    },
                    elemDefault
                );

                const expected = Object.assign(
                    {
                        beginDate: currentDate,
                        endDate: currentDate
                    },
                    returnedFromService
                );
                service
                    .update(expected)
                    .pipe(take(1))
                    .subscribe(resp => expect(resp).toMatchObject({ body: expected }));
                const req = httpMock.expectOne({ method: 'PUT' });
                req.flush(JSON.stringify(returnedFromService));
            });

            it('should return a list of FocusGroup', async () => {
                const returnedFromService = Object.assign(
                    {
                        name: 'BBBBBB',
                        description: 'BBBBBB',
                        beginDate: currentDate.format(DATE_FORMAT),
                        endDate: currentDate.format(DATE_FORMAT),
                        code: 'BBBBBB'
                    },
                    elemDefault
                );
                const expected = Object.assign(
                    {
                        beginDate: currentDate,
                        endDate: currentDate
                    },
                    returnedFromService
                );
                service
                    .query(expected)
                    .pipe(
                        take(1),
                        map(resp => resp.body)
                    )
                    .subscribe(body => expect(body).toContainEqual(expected));
                const req = httpMock.expectOne({ method: 'GET' });
                req.flush(JSON.stringify([returnedFromService]));
                httpMock.verify();
            });

            it('should delete a FocusGroup', async () => {
                const rxPromise = service.delete(123).subscribe(resp => expect(resp.ok));

                const req = httpMock.expectOne({ method: 'DELETE' });
                req.flush({ status: 200 });
            });
        });

        afterEach(() => {
            httpMock.verify();
        });
    });
});
