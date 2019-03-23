import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'testResultFilter'
})
export class TestResultFilterPipe implements PipeTransform {
    transform(items: any[], searchText: string): any[] {
        if (!items) {
            return [];
        }

        if (!searchText) {
            return items;
        }

        searchText = searchText.toString().toLowerCase();
        return items.filter(it => {
            if (it.grade.toLowerCase().includes(searchText)) {
                return it;
            } else {
                return false;
            }
        });
    }
}
