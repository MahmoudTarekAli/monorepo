import {State, Action, StateContext, Selector, createSelector, Store} from '@ngxs/store'
import {Injectable} from "@angular/core";
import { Router} from '@angular/router'
import {CustomArenaService} from "../services/custom-arena.service";
import {GetCustomArenaGames, GetCustomArenaTournaments} from "./custom-arenas.action";

export class CustomArenasStateModel {
  ArenaTournaments: any;
  ArenaGames: any;

}

@State<CustomArenasStateModel>({
  name: 'customArenas',
  defaults: {
    ArenaTournaments:{
      upcomingTournaments:{},
      pastTournaments:{}
    },
    ArenaGames: []

  }
})

@Injectable()
export class CustomArenasState {
  gameCode: string;
  constructor(private customArenaService: CustomArenaService, private router: Router, private store: Store) {

  }

  @Selector()
  static getArenaTournaments(state: CustomArenasStateModel) {
    return state.ArenaTournaments;
  }
  @Selector()
  static getCustomArenaGames(state: CustomArenasStateModel) {
    return state.ArenaGames;
  }


  @Action(GetCustomArenaTournaments)
  getCustomArenaTournaments({getState, setState}: StateContext<CustomArenasStateModel> , payload: any){
    const state = getState()
    if (state.ArenaTournaments.upcomingTournaments?.data?.length > 0 && state.ArenaTournaments.pastTournaments?.data?.length > 0 && this.gameCode === payload.gameCode) {
      return
    }
    this.gameCode = payload.gameCode
    return this.customArenaService.getCustomArenaTournaments(payload.arenaSlug , payload.status , payload.gameCode).subscribe((res: any) => {
      if(payload.statusType === 'upcoming'){
        state.ArenaTournaments.upcomingTournaments = res
      } else{
        state.ArenaTournaments.pastTournaments = res
      }
      setState({
        ...state,
        ArenaTournaments: state.ArenaTournaments
      })
    })
  }
  @Action(GetCustomArenaGames)
  getCustomArenaGames({getState, setState}: StateContext<CustomArenasStateModel> , payload: any){
    const state = getState()
    if(state.ArenaGames.length > 0){
      return
    }
    return this.customArenaService.getCustomArenaGames(payload.arenaSlug).subscribe((res: any) => {
      console.log('here' , res)
      setState({
        ...state,
        ArenaGames: res
      })
    })
  }


}







