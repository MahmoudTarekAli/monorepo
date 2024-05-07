import {Pipe, PipeTransform} from '@angular/core';
import {BRACKET_MATCH_TYPES} from "../../core/tournament.enum";

@Pipe({
  name: 'showHideRounds',
  standalone: true
})
export class ShowHideRoundsPipe implements PipeTransform {
  transform(rounds: any, bracketType: string) {
    if (bracketType === BRACKET_MATCH_TYPES.LOWER) {
      return rounds.filter(round => {
        return round.losers_matches.every(lowerMatch => {
          return !lowerMatch.home ? (lowerMatch.home = {}) : !lowerMatch.away ? (lowerMatch.away = {}) : lowerMatch.home.participant_id !== 1 || lowerMatch.away.participant_id !== 1

        });
      });
    }
    if (bracketType === BRACKET_MATCH_TYPES.UPPER) {
      return rounds.filter(round => {
        return round.winners_matches.every(lowerMatch => {
          return !lowerMatch.home ? (lowerMatch.home = {}) : !lowerMatch.away ? (lowerMatch.away = {}) : lowerMatch.home.participant_id !== 1 || lowerMatch.away.participant_id !== 1
        });
      });
    } else {
      return rounds
    }
  }


}

