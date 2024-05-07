import {Pipe, PipeTransform} from '@angular/core';

@Pipe({name: 'appFilter'})
export class FilterPipe implements PipeTransform {
  transform(searchList: any[], searchValue: string, source: string): any[] {
    if (source === 'ffa') {
      if (searchValue) {
        // const participantsNameArray = searchList.filter(item => item?.original?.participant_name?.toLowerCase().includes(searchValue.toLowerCase()));
        // const ingameNameArray = searchList.filter(item => item?.tournament_participant?.supported_required_inputs?.filter(items => items.value.toLowerCase().includes(searchValue?.toLowerCase())).length > 0)
        // return participantsNameArray.concat(ingameNameArray);
        const filteredArray: any[] = [];
        for (const item of searchList) {
          const participantName = item?.original?.participant_name?.toLowerCase();
          const ingameNameMatch = item?.tournament_participant?.supported_required_inputs?.some(
            (items) => items.value.toLowerCase().includes(searchValue.toLowerCase())
          );
          if (participantName && participantName.includes(searchValue.toLowerCase())) {
            filteredArray.push(item);
          } else if (ingameNameMatch) {
            filteredArray.push(item);
          }
        }

        return filteredArray;
      } else {
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
