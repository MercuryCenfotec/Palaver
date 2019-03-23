import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'testParticipantFilter'
})
export class TestParticipantFilterPipe implements PipeTransform {
    transform(items: any[], searchText: string): any[] {
        if (!items) {
            return [];
        }

        if (!searchText) {
            return items;
        }

        searchText = searchText.toString().toLowerCase();
        return items.filter(it => {
            if (it.participant.user.user.firstName.toLowerCase().includes(searchText)) {
                return it;
            } else if (it.participant.user.user.lastName.toLowerCase().includes(searchText)) {
                return it;
            } else {
                return false;
            }
        });
    }
}
