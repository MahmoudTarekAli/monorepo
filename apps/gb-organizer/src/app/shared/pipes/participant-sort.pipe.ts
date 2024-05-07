import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'participantSort'
})
export class ParticipantSortPipe implements PipeTransform {

  transform(array: any[] , type?: string): unknown {
    if(type !== 'FreeForAll') {
      return array.sort((a, b) => {
        if (a.rank < b.rank) {
          return -1;
        } else if (a.rank > b.rank) {
          return 1;
        } else {
          return 0;
        }
      });
    } else {
      return array.sort((a, b) => {
        if (!a.game_rank || a.game_rank === 0) {
          return 1; // Move rank 0 to the end
        } else if (!b.game_rank || b.game_rank === 0) {
          return -1; // Move rank 0 to the end
        } else if (a.game_rank < b.game_rank) {
          return -1;
        } else if (a.game_rank > b.game_rank) {
          return 1;
        } else {
          return 0;
        }
      });
    }
  }

}
