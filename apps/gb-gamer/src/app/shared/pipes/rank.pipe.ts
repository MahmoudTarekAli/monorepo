import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'rank',
  standalone: true
})
export class RankPipe implements PipeTransform {
  transform(rank: number): string {
    if (rank === 1) {
      return 'gold-border'; // Apply this class if rank is 1
    } else if (rank === 2) {
      return 'silver-border'; // Apply this class if rank is 2
    } else if (rank === 3) {
      return 'bronze-border'; // Apply this class if rank is 3
    } else {
      return ''; // No border class for other ranks
    }
  }
}


@Pipe({
  name: 'sortByRank',
  standalone: true
})
export class SortByRankPipe implements PipeTransform {
  transform(array: any[]): any[] {
    if (!Array.isArray(array)) {
      return array;
    }

    return array.sort((a, b) => {
      return a.rank - b.rank;
    });
  }
}
