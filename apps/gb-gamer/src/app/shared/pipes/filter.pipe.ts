import {Pipe, PipeTransform} from '@angular/core';

@Pipe({name: 'appFilter', standalone: true})
export class FilterPipe implements PipeTransform {
  transform(searchList: any[], searchValue: string, source: string): any[] {
    if (source === 'ffa') {
      if (searchValue) {
        if (searchList.filter(item => item?.original?.participant_name?.toLowerCase().includes(searchValue.toLowerCase())).length > 0) {
          return searchList.filter(item => item?.original?.participant_name?.toLowerCase().includes(searchValue.toLowerCase()));
        } else {
          return searchList.filter(item =>
            item?.tournament_participant?.supported_required_inputs?.filter(items => items.value.toLowerCase().includes(searchValue?.toLowerCase())).length > 0)
        }
      } else {
        console.log(searchList)

        return searchList.sort((a, b) => b.score - a.score);
      }
    } else {
      if (searchValue) {
        const arr = [];
        searchList.forEach(item => {
          if (item.home?.original?.participant_name?.toLowerCase().includes(searchValue.toLowerCase()) || item.away?.original?.participant_name?.toLowerCase().includes(searchValue.toLowerCase())) {
            if (!arr.includes(item)) {
              arr.push(item);
            }
          }
        });
        return arr;
      } else {
        return searchList;
      }
    }

  }

}
