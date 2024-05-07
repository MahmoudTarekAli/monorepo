import {State, Action, StateContext, Selector, Store} from '@ngxs/store'
import {tap} from 'rxjs/operators';
import {Injectable} from "@angular/core";
import {Router} from '@angular/router'
import {Challenge, ChallengeList} from "../../../shared/models/challenge";
import {
  ClaimScore,
  GetChallenge,
  GetChallengesList,
  GetIsJoinedChallenge,
  GetParticipants,
  JoinChallenge, UpdateSocketChallenge
} from "./challenges.action";
import {ChallengesService} from "../service/challenges.service";
import {HandleError, SetNotifications} from "../../../shared/state/global.action";

export class ChallengesStateModel {

  challenges: ChallengeList | null;
  filtrationChallenges: Challenge[] | null;
  challenge: Challenge | null;
  participants: any;
  isJoined: any;

}

@State<ChallengesStateModel>({
  name: 'Challenges',
  defaults: {
    challenges: {data: [], meta: {current_page: 0, from: 0, last_page: 0, path: '', per_page: 0, total: 0}, links: {}},
    challenge: null,
    participants: null,
    isJoined: {},
    filtrationChallenges: []
  }
})

@Injectable()
export class ChallengesState {
  gameCode = ''
  status = ''

  constructor(private ChallengesService: ChallengesService, private router: Router, private store: Store) {

  }

  @Selector()
  static getAllChallenges(state: ChallengesStateModel) {
    return state.challenges;
  }

  @Selector()
  static getChallenge(state: ChallengesStateModel) {
    return state.challenge;
  }

  @Selector()
  static getParticipants(state: ChallengesStateModel) {
    return state.participants;
  }

  @Selector()
  static getIsJoined(state: ChallengesStateModel) {
    return state.isJoined;
  }


  @Action(GetChallengesList)
  getChallengesList({getState, setState}: StateContext<ChallengesStateModel>, payload: any) {
    const state = getState();
    if (state.challenges && state.challenges?.data?.length > 0 && payload.status === this.status && payload?.page === state.challenges?.meta?.current_page && payload.game_code === this.gameCode) {
      return;
    }
    this.gameCode = payload.game_code
    this.status = payload.status
    return this.ChallengesService.getChallengeList(payload?.page, payload?.status, payload.game_code).pipe(tap((result) => {
      setState({
        ...getState(),
        challenges: result,
        filtrationChallenges: result.data
      });
    }));

  }

  @Action(UpdateSocketChallenge)
  UpdateSocketChallenges({getState, setState}: StateContext<ChallengesStateModel>, payload: any) {
    console.log(payload)
    setState({
      ...getState(),
      // challenge: payload,
      // filtrationChallenges: payload.data
    });
  }

  @Action(GetChallenge)
  getChallenge({getState, setState}: StateContext<ChallengesStateModel>, payload: any) {
    return this.ChallengesService.getChallenge(payload.code).pipe(tap((result:any) => {
      setState({
        ...getState(),
        challenge: result
      });
    }));
  }

  @Action(GetIsJoinedChallenge)
  getJoinedChallenge({getState, setState}: StateContext<ChallengesStateModel>, payload: any) {
    return this.ChallengesService.getIsJoined(payload.code).pipe(tap((res) => {
      setState({
        ...getState(),
        isJoined: res,
      });
    }))
  }

  @Action(ClaimScore)
  claimScore({getState, setState}: StateContext<ChallengesStateModel>, payload: any) {
    const state = getState();
    console.log(payload)
    return this.ChallengesService.claimScore(payload.code, payload?.password).pipe(tap((res) => {
      if (res.warning === 'NoMatchesPlayed') {
        this.store.dispatch(new SetNotifications('Warning', 'You have not played any matches yet', 'warning'))
      } else {
        this.store.dispatch(new SetNotifications('Success', 'Score is Claimed Successfully', 'success'))
      }
      state.isJoined['next_score_claim_date'] = res.next_score_claim_date
      state.participants = res?.data
      this.addOwnerToParticipants(state.participants)
      setState({
        ...getState(),
        participants: state.participants,
        isJoined: state.isJoined
      });

    }, error => {
      this.store.dispatch(new HandleError(error))

    }))
  }

  @Action(GetParticipants)
  getParticipants({getState, setState}: StateContext<ChallengesStateModel>, payload: any) {
    const state = getState();
    return this.ChallengesService.getChallengeParticipants(payload.code, payload.page).pipe(tap((result) => {
      state.participants = result
      this.addOwnerToParticipants(state.participants)
      setState({
        ...getState(),
        participants:  state.participants
      });
    }));
  }

  @Action(JoinChallenge)
  joinChallenge({getState, setState}: StateContext<ChallengesStateModel>, payload: any) {
    const state = getState();
    return this.ChallengesService.joinChallenge(payload.id, payload.payload).pipe(tap((result) => {
      this.store.dispatch(new SetNotifications('Success', result.message, 'success'))
      state.isJoined.isJoined = true
      state.participants = result.data
      this.addOwnerToParticipants(state.participants)
      this.store.dispatch(new GetIsJoinedChallenge(payload.id))
      setState({
        ...getState(),
        participants: state.participants,
        isJoined: state.isJoined
      });
    }, error => {
      this.store.dispatch(new HandleError(error))
    }));
  }


  // @Action(FilterChallenges)
  // filterChallenges({getState, setState}: StateContext<ChallengesStateModel> , payload: any){
  //   const state = getState()
  //   const matchingGenres: any[] = []
  //   if(state.challenges){
  //     if(payload.genres === 'All'){
  //       setState({
  //         ...getState(),
  //         filtrationChallenges: state.challenges,
  //       });
  //       return
  //     }
  //     state.challenges.forEach((item:any) => {
  //       item.genres.forEach((genre:any) => {
  //         if (genre.name === payload.genres) {
  //           matchingGenres.push(item);
  //         }
  //       });
  //     });
  //     setState({
  //       ...getState(),
  //       filtrationChallenges: matchingGenres,
  //     });
  //   }
  //
  // }
  addOwnerToParticipants(participants){
    console.log(participants)
    const userAuth = JSON.parse(localStorage.getItem('userAuth'));
    const userIndex = participants.data.findIndex((item) => item.slug === userAuth?.slug);
    if (userIndex !== -1){
      participants.data[userIndex].isOwner = true
    }
  }

}







