import {State, Action, StateContext, Selector, createSelector, Store} from '@ngxs/store'

import {tap} from 'rxjs/operators';
import {Injectable} from "@angular/core";
import {ActivatedRoute, Router} from '@angular/router'
import {Tournament, TournamentList} from "../../../shared/models/tournament";
import {Game} from "../../../shared/models/game";
import {ArenaService} from "../service/arena.service";
import {HandleError, SetNotifications} from "../../../shared/state/global.action";
import {GlobalService} from "../../../shared/service/global.service";
import {Arena} from "../../../shared/models/arena";
import {
  AssignUnassignRole,
  CreateArena,
  FollowUnFollowArena,
  GetArena, GetArenaEvents,
  GetArenasList, GetChallengesArena, GetControllers,
  GetFeaturedArenas,
  GetTournamentsArena, ManageArenaActions,
  SearchArenas, UpdateArena
} from "./arenas.action";
import {HomeStateModel} from "../../home/state/home.state";
import {GetChallengesGame} from "../../games/state/games.action";
import {GameStateModel} from "../../games/state/games.state";
import {ChallengeList} from "../../../shared/models/challenge";
import {UpdateIsArenaFollowed} from "../../tournament/state/tournament.action";

export class ArenaStateModel {
  arenas: Arena[];
  featuredArenas: Arena[];
  arena: Arena | null;
  tournaments: TournamentList;
  controllers: any;
  challenges: ChallengeList;
  events: any[]
}

@State<ArenaStateModel>({
  name: 'arena',
  defaults: {
    arenas: [],
    featuredArenas: [],
    arena: null,
    tournaments: null,
    controllers: null,
    challenges: null,
    events: []
  }
})

@Injectable()
export class ArenasState {
  featuredArenaArray: Arena[] = [];

  constructor(private arenaService: ArenaService, private router: Router, private store: Store, private globalService: GlobalService) {

  }

  @Selector()
  static getAllArenas(state: ArenaStateModel) {
    return state.arenas;
  }

  @Selector()
  static getArena(state: ArenaStateModel) {
    return state.arena;
  }

  @Selector()
  static getTournamentsArena(state: ArenaStateModel) {
    return state.tournaments;
  }

  @Selector()
  static getFeaturedArenas(state: ArenaStateModel) {
    return state.featuredArenas;
  }

  @Selector()
  static getControllers(state: ArenaStateModel) {
    return state.controllers;
  }

  @Selector()
  static getArenaChallenges(state: ArenaStateModel) {
    return state.challenges;
  }
  @Selector()
  static getArenaEvents(state: ArenaStateModel) {
    return state.events;
  }

  @Action(CreateArena)
  createArena({getState, setState}: StateContext<ArenaStateModel>, payload: any) {
    const state = getState()
    return this.arenaService.createArena(payload.payload).pipe(tap((result: any) => {
      this.store.dispatch(new SetNotifications('Success', 'Arena is created successfully', 'success'))
      this.router.navigateByUrl(`/arenas/${result.arena.data.slug}`)
      setState({
        ...getState(),
        arena: result.arena.data,
      });
    }, error => {
      this.store.dispatch(new HandleError(error))
    }));

  }

  @Action(UpdateArena)
  updateArena({getState, setState}: StateContext<ArenaStateModel>, payload: any) {
    const state = getState()

    return this.arenaService.updateArena(payload.code, payload.payload).pipe(tap((result: any) => {
      this.store.dispatch(new SetNotifications('Success', 'Arena is updated successfully', 'success'))
      setState({
        ...getState(),
        arena: result.arena.data,
      });
    }, error => {
      this.store.dispatch(new HandleError(error))
    }));

  }

  @Action(GetArenasList)
  getArenasList({getState, setState}: StateContext<ArenaStateModel>, payload: any) {
    const state = getState()
    console.log(payload.search)
    if (state.arenas && state.arenas?.length > 0 && !payload?.search && payload.search !== '') {
      return
    }
    console.log(payload)
    return this.arenaService.getAllArenas(payload.page, payload.search).pipe(tap((result: Arena[]) => {
      setState({
        ...getState(),
        arenas: result,
      });
    }));


  }

  @Action(GetChallengesArena)
  getChallenges({getState, setState, patchState}: StateContext<ArenaStateModel>, payload: any) {
    return this.arenaService.getArenaChallenges(payload.arenaSlug, payload.page, payload.per_page, payload.status).pipe(tap((result: any) => {
      const state = getState();
      if (payload.page > 1) {
        state.challenges.data = state.challenges.data.concat(result.data)
        state.challenges.meta = result.meta
      } else {
        state.challenges = result
      }
      setState({
        ...getState(),
        challenges: state.challenges,
      });
    }));
  }

  @Action(GetFeaturedArenas)
  getTopArenas({getState, setState}: StateContext<ArenaStateModel>) {
    return this.arenaService.getFeaturedArenas().pipe(tap((result) => {
      this.featuredArenaArray = result
      setState({
        ...getState(),
        featuredArenas: result,
      });
    }));
  }

  @Action(GetArena)
  getArena({getState, setState}: StateContext<ArenaStateModel>, payload: any) {
    const state = getState()
    if (state.arena && state.arena?.slug === payload.code) {
      return
    }
    return this.arenaService.getArena(payload.code).pipe(tap((result) => {
      setState({
        ...getState(),
        arena: result,
      });
    }));
  }

  @Action(GetArenaEvents)
  getArenaEvents({getState, setState}: StateContext<ArenaStateModel>, payload: GetArenaEvents) {
    return this.arenaService.getArenaEvents(payload.slug).pipe(tap((result) => {
      setState({
        ...getState(),
        events: result,
      });
    }));
  }

  @Action(GetTournamentsArena)
  getTournamentsArena({getState, setState}: StateContext<ArenaStateModel>, payload: any) {
    return this.arenaService.getArenaTournaments(payload.code, payload.page, payload.status).pipe(tap((result: any) => {
      setState({
        ...getState(),
        tournaments: result,
      });
    }));
  }

  @Action(GetControllers)
  getControllers({getState, setState}: StateContext<ArenaStateModel>, payload: any) {
    return this.arenaService.getArenaControllers(payload.code).pipe(tap((result: any) => {
      result.organizer.type = 'Organizer'
      result.admins.forEach((admin: any) => {
        admin['type'] = 'Admin';
      });
      result.moderators.forEach((moderator: any) => {
        moderator['type'] = 'Moderator';
      });
      const moderatorsAdmins = result.moderators.concat(result.admins)
      moderatorsAdmins.unshift(result.organizer)
      console.log(moderatorsAdmins)
      setState({
        ...getState(),
        controllers: moderatorsAdmins
      });
    }));
  }

  @Action(AssignUnassignRole)
  assignRole({getState, setState}: StateContext<ArenaStateModel>, payload: any) {
    return this.arenaService.assignRole(payload.code, payload.payload, payload.type).pipe(tap((result) => {
      this.store.dispatch(new SetNotifications('Success', 'Role is assigned successfully', 'success'))
      console.log(payload.type)
      result.organizer.type = 'Organizer'
      result.admins.forEach((admin: any) => {
        admin['type'] = 'Admin';
      });
      result.moderators.forEach((moderator: any) => {
        moderator['type'] = 'Moderator';
      });

      const moderatorsAdmins = result.moderators.concat(result.admins)
      moderatorsAdmins.unshift(result.organizer)

      setState({
        ...getState(),
        controllers: moderatorsAdmins
      });
    }));
  }

  @Action(ManageArenaActions)
  manageArenaActions({getState, setState}: StateContext<ArenaStateModel>, payload: any) {

    return this.arenaService.manageArenasActions(payload.slug, payload.payload).subscribe(response => {
      this.store.dispatch(new SetNotifications('success', 'Arena Updated Successfully', 'success'))
      setState({
        ...getState(),
        arena: response.arena,
      });
    }, error => {
      this.store.dispatch(new HandleError(error))

    })
  }

  @Action(SearchArenas)
  searchArenas({getState, setState}: StateContext<ArenaStateModel>, payload: any) {
    const state = getState()
    console.log(payload)
    if (state.featuredArenas && payload.type === 'featured') {
      const searchArray = this.featuredArenaArray.filter((item: any) => {
        return item.slug?.toLowerCase()?.includes(payload?.code?.toLowerCase())
      })
      // state.games.filtrationGames = searchArray
      console.log(searchArray)
      setState({
        ...getState(),
        featuredArenas: searchArray,
      });
      return;
    }
  }


  @Action(FollowUnFollowArena)
  followUnfollowArena({getState, setState}: StateContext<ArenaStateModel>, payload: any) {
    const state = getState()
    return this.arenaService.followUnfollowArena(payload.code, payload.type).subscribe((res: any) => {
      console.log(res.arena.data.is_following)
      this.store.dispatch(new UpdateIsArenaFollowed(res.arena.data.is_following))
      this.store.dispatch(new SetNotifications('Success', `arena is ${payload.type}ed successfully`, 'success'))
      state.featuredArenas?.forEach((item: any) => {
        if (item.slug === payload.code) {
          item.is_following = !item.is_following
        }
      });
      state.arenas?.forEach((item: any) => {
        if (item.slug === payload.code) {
          item.is_following = !item.is_following
        }
      });
      setState({
        ...getState(),
        arena: res.arena.data,
        arenas: state.arenas,
        featuredArenas: state.featuredArenas
      });
    }, error => {
      this.store.dispatch(new HandleError(error))
    })

  }


}







