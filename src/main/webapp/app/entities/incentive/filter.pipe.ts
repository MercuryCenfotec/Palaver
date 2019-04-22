import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'incentiveFilter'
})
export class IncentiveFilterPipe implements PipeTransform {
    transform(items: any[], searchText: string): any[] {
        if (!items) {
            return [];
        }

        if (!searchText) {
            return items;
        }

        searchText = searchText.toString().toLowerCase();
        return items.filter(it => {
            if (it.name.toLowerCase().includes(searchText)) {
                return it;
            } else {
                return false;
            }
        });
    }
}
