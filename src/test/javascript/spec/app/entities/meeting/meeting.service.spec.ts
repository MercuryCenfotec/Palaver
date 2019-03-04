/* tslint:disable max-line-length */
import { TestBed, getTestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { of } from 'rxjs';
import { take, map } from 'rxjs/operators';
import * as moment from 'moment';
import { DATE_FORMAT, DATE_TIME_FORMAT } from 'app/shared/constants/input.constants';
import { MeetingService } from 'app/entities/meeting/meeting.service';
import { IMeeting, Meeting } from 'app/shared/model/meeting.model';

describe('Service Tests', () => {
    describe('Meeting Service', () => {
        let injector: TestBed;
        let service: MeetingService;
        let httpMock: HttpTestingController;
        let elemDefault: IMeeting;
        let currentDate: moment.Moment;
        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [HttpClientTestingModule]
            });
            injector = getTestBed();
            service = injector.get(MeetingService);
            httpMock = injector.get(HttpTestingController);
            currentDate = moment();

            elemDefault = new Meeting(0, currentDate, currentDate, 'AAAAAAA', 'AAAAAAA', 'AAAAAAA', 'AAAAAAA');
        });

        describe('Service methods', async () => {
            it('should find an element', async () => {
                const returnedFromService = Object.assign(
                    {
                        date: currentDate.format(DATE_FORMAT),
                        time: currentDate.format(DATE_TIME_FORMAT)
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

            it('should create a Meeting', async () => {
                const returnedFromService = Object.assign(
                    {
                        id: 0,
                        date: currentDate.format(DATE_FORMAT),
                        time: currentDate.format(DATE_TIME_FORMAT)
                    },
                    elemDefault
                );
                const expected = Object.assign(
                    {
                        date: currentDate,
                        time: currentDate
                    },
                    returnedFromService
                );
                service
                    .create(new Meeting(null))
                    .pipe(take(1))
                    .subscribe(resp => expect(resp).toMatchObject({ body: expected }));
                const req = httpMock.expectOne({ method: 'POST' });
                req.flush(JSON.stringify(returnedFromService));
            });

            it('should update a Meeting', async () => {
                const returnedFromService = Object.assign(
                    {
                        date: currentDate.format(DATE_FORMAT),
                        time: currentDate.format(DATE_TIME_FORMAT),
                        name: 'BBBBBB',
                        description: 'BBBBBB',
                        callURL: 'BBBBBB',
                        callCode: 'BBBBBB'
                    },
                    elemDefault
                );

                const expected = Object.assign(
                    {
                        date: currentDate,
                        time: currentDate
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

            it('should return a list of Meeting', async () => {
                const returnedFromService = Object.assign(
                    {
                        date: currentDate.format(DATE_FORMAT),
                        time: currentDate.format(DATE_TIME_FORMAT),
                        name: 'BBBBBB',
                        description: 'BBBBBB',
                        callURL: 'BBBBBB',
                        callCode: 'BBBBBB'
                    },
                    elemDefault
                );
                const expected = Object.assign(
                    {
                        date: currentDate,
                        time: currentDate
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

            it('should delete a Meeting', async () => {
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
