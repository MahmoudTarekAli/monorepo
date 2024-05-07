import {State, Action, StateContext, Selector, Store} from '@ngxs/store'
import {
  GetChallengesGames,
  GetGameSettings,
  GetChallengesList,
  CreateChallenge,
  GetChallenge,
  UpdateChallenge,
  GetChallengeSettings
} from './challenges.action'
import {tap} from 'rxjs/operators';
import {Injectable} from "@angular/core";
import {ActivatedRoute, Router} from '@angular/router'
import {HandleError, SetNotifications} from '../../../shared/state/global.action'
import {ChallengesService} from "../service/challenges.service";

export class ChallengeStateModel {
  challengesList: any;
  challenge: any;
  challengesSettings: [];
  arenas: [];
  challengesGames: [];
  gameSettings: [];
  duplicatedChallenge: any;
  challengeSettings: [];

}

@State<ChallengeStateModel>({
  name: 'challenge',
  defaults: {
    challengesList: [],
    challenge: null,
    challengesSettings: [],
    arenas: [],
    challengesGames: [],
    gameSettings: [],
    duplicatedChallenge: null,
    challengeSettings: []
  }
})

@Injectable()
export class ChallengesState {
  page: number;
  type: string;
  gameCode: string;
  challengeGameCode: string;
  startAt;
  endDate;

  constructor(private challengeService: ChallengesService, private router: Router, private store: Store ) {

  }

  @Selector()
  static getChallengesList(state: ChallengeStateModel) {
    return state.challengesList;
  }

  @Selector()
  static getChallenge(state: ChallengeStateModel) {
    return state.challenge;
  }
 @Selector()
  static getDuplicatedChallenge(state: ChallengeStateModel) {
    return state.duplicatedChallenge;
  }
  @Selector()
  static getChallengeGames(state: ChallengeStateModel) {
    return state.challengesGames;
  }

  @Selector()
  static getGameSettings(state: ChallengeStateModel) {
    return state.gameSettings;
  }
  @Selector()
  static getChallengeSettings(state: ChallengeStateModel) {
    return state.challengeSettings;
  }

  @Action(GetChallengesList)
  getChallenges({getState, setState, patchState}: StateContext<ChallengeStateModel>, payload) {
    const state = getState();
    if (state.challengesList?.data?.length > 0 && Number(payload.page) === this.page && payload.type === this.type && payload.gameCode === this.gameCode && this.startAt === payload.startAt && this.endDate === payload.endDate) {
      return true
    } else {
      this.page = Number(payload.page);
      this.type = payload.type;
      this.gameCode = payload.gameCode;
      this.startAt = payload.startAt;
      this.endDate = payload.endDate;
      return this.challengeService.getChallengesList(payload.page, payload.type , payload.gameCode , payload.startAt , payload.endDate).pipe(tap((result) => {
        setState({
          ...getState(),
          challengesList: result,
        });
      }));
    }
  }
  @Action(GetChallenge)
  getChallenge({getState, setState, patchState}: StateContext<ChallengeStateModel>, payload) {
      return this.challengeService.getChallenge(payload.challengeId).pipe(tap((result) => {
        setState({
            ...getState(),
            challenge: result,
          });
      }));
  }



  @Action(CreateChallenge)
  createChallenge({getState, patchState, setState}: StateContext<ChallengeStateModel>, payload){

    return this.challengeService.createChallenges(payload.payload).pipe(tap((result) => {
        const state = getState();
        this.router.navigate(['/challenges' , result.data.id]);
        setState({
          ...state,
          challenge: result,
        });
        this.store.dispatch(new SetNotifications('Success', 'Challenge created Successfully', 'success'))
      }
    , error => {
      this.store.dispatch(new HandleError(error))

    }));
  }
  @Action(UpdateChallenge)
  updateChallenge({getState, patchState, setState}: StateContext<ChallengeStateModel>, payload){
    return this.challengeService.updateChallenge(payload.id , payload.payload).pipe(tap((result) => {
        const state = getState();
        setState({
          ...state,
          challenge: result,
        });
        this.store.dispatch(new SetNotifications('Success', 'Challenge updated Successfully', 'success'))
    }, error => {
      this.store.dispatch(new HandleError(error))

    }));
  }



  @Action(GetChallengesGames)
  getChallengesGames({getState, setState}: StateContext<ChallengeStateModel>) {
    const state = getState();
    if (state.challengesGames.length > 0) {
      return true
    } else {
      return this.challengeService.getChallengesGames().pipe(tap((result) => {
        console.log(result)
        setState({
          ...getState(),
          challengesGames: result,
        });
      }));
    }
  }

  @Action(GetGameSettings)
  getSettingsLeagueOfLegends({getState, setState}: StateContext<ChallengeStateModel>, payload) {
    const state = getState();
    if (state.gameSettings.length > 0 && this.challengeGameCode === payload.gameCode) {
      return true
    }
    this.challengeGameCode = payload.gameCode;
    return this.challengeService.getChallengesGameSettings(payload.gameCode).pipe(tap((result) => {
      setState({
        ...getState(),
        gameSettings: result,
      });
    }));
  }
  @Action(GetChallengeSettings)
  getChallengeSettings({getState, setState}: StateContext<ChallengeStateModel>, payload) {
    const state = getState();
    if (state.gameSettings.length > 0 && this.challengeGameCode === payload.gameCode) {
      return true
    }
    this.challengeGameCode = payload.gameCode;
    return this.challengeService.getChallengesSettings().pipe(tap((result) => {
      setState({
        ...getState(),
        challengeSettings: result,
      });
    }));
  }

}

