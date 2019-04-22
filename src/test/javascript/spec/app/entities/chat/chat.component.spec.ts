/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Observable, of } from 'rxjs';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { PalaverTestModule } from '../../../test.module';
import { ChatComponent } from 'app/entities/chat/chat.component';
import { ChatService } from 'app/entities/chat/chat.service';
import { Chat } from 'app/shared/model/chat.model';

describe('Component Tests', () => {
    describe('Chat Management Component', () => {
        let comp: ChatComponent;
        let fixture: ComponentFixture<ChatComponent>;
        let service: ChatService;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [PalaverTestModule],
                declarations: [ChatComponent],
                providers: []
            })
                .overrideTemplate(ChatComponent, '')
                .compileComponents();

            fixture = TestBed.createComponent(ChatComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(ChatService);
        });

        it('Should call load all on init', () => {
            // GIVEN
            const headers = new HttpHeaders().append('link', 'link;link');
            spyOn(service, 'query').and.returnValue(
                of(
                    new HttpResponse({
                        body: [new Chat(123)],
                        headers
                    })
                )
            );

            // WHEN
            comp.ngOnInit();

            // THEN
            expect(service.query).toHaveBeenCalled();
            expect(comp.chats[0]).toEqual(jasmine.objectContaining({ id: 123 }));
        });
    });
});
