import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'matches',
  standalone: true
})
export class MatchesPipe implements PipeTransform {
  transform(matches: any) {
    return matches.filter(match => (((match.away?.participant_type === 'teams' || match.home?.participant_type === 'teams') ? (match.away?.participant_id !== 2 && match?.home?.participant_id !== 2) : (match.away?.participant_id !== 1 && match?.home?.participant_id !== 1)) && (match.home || match.away)))
  }

}






