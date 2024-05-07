import {State, Action, StateContext, Selector, createSelector, Store} from '@ngxs/store'
import {Injectable} from "@angular/core";
import {ActivatedRoute, Router} from '@angular/router'
import {
  CompareRequiredInputs, IsJoined,
  OpenJoinTournamentDialog,
  SetActiveStepId, UpdateIsJoined, UpdateIsJoinedData,
  UpdateStepperState
} from "./join-tournament.action";
import {tap} from "rxjs/operators";
import {NzModalRef, NzModalService} from "ng-zorro-antd/modal";
import {TournamentService} from "../../service/tournament.service";
import {JoinTournamentComponent} from "../../../../shared/components/join-tournament/join-tournament.component";
import {StepperStep} from "../../models/stepper-step";

export class JoinTournamentStateModel {
  steps: StepperStep[];
  activeStepId: number;
  missingRequiredInputs: null;
  isJoined: boolean;
  isJoinedData: any

}

@State<JoinTournamentStateModel>({
  name: 'joinTournament',
  defaults: {
    steps: [],
    activeStepId: 0,
    missingRequiredInputs: null,
    isJoined: false,
    isJoinedData: {}
  }
})

@Injectable()
export class JoinTournamentState {

  constructor(private tournamentService: TournamentService,
              private router: Router, private store: Store,
              private activatedRoute: ActivatedRoute, private modalService: NzModalService) {

  }

  @Selector()
  static getMissingRequiredInputs(state: JoinTournamentStateModel) {
    return state.missingRequiredInputs;
  }


  @Selector()
  static getActiveStepId(state: JoinTournamentStateModel) {
    return state.activeStepId;
  }

  @Selector()
  static getIsJoined(state: JoinTournamentStateModel) {
    return state.isJoined;
  }

  @Selector()
  static getIsJoinedData(state: JoinTournamentStateModel) {
    return state.isJoinedData;
  }

  @Action(CompareRequiredInputs)
  compareRequiredInputs({
                          getState,
                          setState,
                          patchState
                        }: StateContext<JoinTournamentStateModel>, payload: CompareRequiredInputs) {
    return this.tournamentService.compareRequiredInputs(payload.tournamentId).pipe(tap((result) => {
      console.log(result)
      setState({
        ...getState(),
        missingRequiredInputs: result,
      });
    }));
  }

  @Action(IsJoined)
  isJoined({getState, setState, patchState}: StateContext<JoinTournamentStateModel>, payload: IsJoined) {
    return this.tournamentService.isJoined(payload.tournamentId).pipe(tap((result) => {
      console.log(result.is_joined)
      setState({
        ...getState(),
        isJoined: result.is_joined,
        isJoinedData: result
      });
    }));
  }

  @Action(UpdateIsJoined)
  updateIsJoined(ctx: StateContext<JoinTournamentStateModel>, payload: UpdateIsJoined) {
    const state = ctx.getState();
    console.log(payload)
    ctx.setState({
      ...state,
      isJoinedData: payload,
    });
  }

  @Action(UpdateIsJoinedData)
  UpdateIsJoinedData(ctx: StateContext<JoinTournamentStateModel>, payload: UpdateIsJoinedData) {
    const state = ctx.getState();
    ctx.setState({
      ...state,
      isJoinedData: payload.isJoinedData,
    });
  }

  @Action(UpdateStepperState)
  updateStepperState(ctx: StateContext<JoinTournamentStateModel>, action: UpdateStepperState): void {
    const state = ctx.getState();
    ctx.setState({
      ...state,
      steps: action.payload,
    });
  }

  @Action(SetActiveStepId)
  setStepperActiveId(ctx: StateContext<JoinTournamentStateModel>, action: SetActiveStepId): void {
    const state = ctx.getState();
    ctx.setState({
      ...state,
      activeStepId: action.id,
    });
  }
}

