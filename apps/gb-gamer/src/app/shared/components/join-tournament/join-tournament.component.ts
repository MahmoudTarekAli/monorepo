import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  Input, OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild
} from '@angular/core';
import {AsyncPipe, NgForOf, NgIf, NgStyle, NgTemplateOutlet, UpperCasePipe} from '@angular/common';
import {Actions, ofActionCompleted, Select, Store} from "@ngxs/store";
import {CompareRequiredInputs, IsJoined, UpdateIsJoinedData,} from "../../../modules/tournament/state/join-tournament/join-tournament.action";
import {StepperStep} from "../../../modules/tournament/models/stepper-step";
import {NzStepsModule} from "ng-zorro-antd/steps";
import {TournamentState} from "../../../modules/tournament/state/tournament.state";
import {Observable, of, Subject, switchMap, take, takeUntil} from "rxjs";
import {Tournament} from "../../models/tournament";
import {JoinTournamentState} from "../../../modules/tournament/state/join-tournament/join-tournament.state";
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators
} from "@angular/forms";
import {User} from "../../../modules/authentication/models/user";
import {AuthenticationState} from "../../../modules/authentication/state/authentication.state";
import {TournamentService} from "../../../modules/tournament/service/tournament.service";
import {UpdateUser} from "../../../modules/authentication/state/authentication.action";
import {CountryISO, NgxIntlTelInputModule} from "ngx-intl-tel-input";
import {ButtonComponent} from "../../../components/button/button.component";
import {NzFormModule} from "ng-zorro-antd/form";
import {NzDatePickerModule} from "ng-zorro-antd/date-picker";
import {LeagueAccountsComponent} from "../league-accounts/league-accounts.component";
import {QuillViewHTMLComponent} from "ngx-quill";
import {NzRadioModule} from "ng-zorro-antd/radio";
import {NzInputModule} from "ng-zorro-antd/input";
import {NzModalModule, NzModalService} from "ng-zorro-antd/modal";
import {GamerService} from "../../../modules/gamer/service/gamer.service";
import {HandleError, SetNotifications} from "../../state/global.action";
import {GetTeamAuthority} from "../../../modules/tournament/state/tournament.action";
import {NzSelectModule} from "ng-zorro-antd/select";
import {TranslateModule} from "@ngx-translate/core";
import {UploadPhotosComponent} from "../upload-photos/upload-photos.component";
import {TeamsService} from "../../../modules/teams/service/teams.service";
import {NzDividerModule} from "ng-zorro-antd/divider";
import {LoadingIndicatorComponent} from "../loading-indicator/loading-indicator.component";
import {Router} from "@angular/router";
import {Team} from "../../models/team";
import {NoResultComponent} from "../no-result/no-result.component";
import {NgScrollbar} from "ngx-scrollbar";


@Component({
  selector: 'app-join-tournament',
  templateUrl: './join-tournament.component.html',
  styleUrls: ['./join-tournament.component.scss'],
  standalone: true,
  imports: [AsyncPipe, NzStepsModule,
    NgTemplateOutlet, NgForOf, NgIf, QuillViewHTMLComponent, NzRadioModule, FormsModule, LeagueAccountsComponent,
    NzFormModule, ReactiveFormsModule, NzDatePickerModule, NgxIntlTelInputModule, NzInputModule, ButtonComponent, UpperCasePipe, NzModalModule, NzSelectModule, TranslateModule, UploadPhotosComponent, NzDividerModule, LoadingIndicatorComponent, NoResultComponent, NgStyle, NgScrollbar]
})
export class JoinTournamentComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('rules') rules: TemplateRef<any>;
  @ViewChild('accounts') accounts: TemplateRef<any>;
  @ViewChild('inputs') inputs: TemplateRef<any>;
  @ViewChild('teams') teams: TemplateRef<any>;
  currentIndex = 0;
  currentTemplate: TemplateRef<any>
  @Input() tournamentId: string
  @Input() team: Team
  @Select(TournamentState.getTournament) tournament$: Observable<Tournament>;
  @Select(AuthenticationState.getUser) user$: Observable<User>;
  @Select(JoinTournamentState.getActiveStepId) activeStepId: Observable<number>;
  @Select(JoinTournamentState.getMissingRequiredInputs) missingRequiredInputs$: Observable<any>;
  steps: StepperStep[] = []
  index = 'First-content';
  isMobileView: boolean;
  requiredInputsForm: FormGroup;
  profileForm: FormGroup;
  private ngUnsubscribe = new Subject<void>();
  control: any;
  protected readonly CountryISO = CountryISO;
  selectedLeagueAccount: any
  teamsList: any
  tournament: Tournament
  selectedTeam: any
  isSubscription = false
  accountsLength: number
  isCreateTeam: boolean
  teamForm: FormGroup
  isSelectOrCreateTeam = 'select'
  loadingTeams: boolean
  isRequiredInfoDisabled: boolean

  constructor(private store: Store, private tournamentService: TournamentService, private gamerService: GamerService,
              private router: Router,
              private changeDetectorRef: ChangeDetectorRef, private teamService: TeamsService, private formBuilder: FormBuilder, private actions: Actions, private nzModalService: NzModalService) {
    this.requiredInputsForm = this.formBuilder.group({
      userSupportedRequiredInputsKey: formBuilder.array([], Validators.required)
    });
    this.profileForm = this.formBuilder.group({})
    this.steps = [
      // {key: 'inputs', label: 'Required Inputs'},
    ]
    this.requiredInputsForm.get('userSupportedRequiredInputsKey').valueChanges.subscribe(data => {
      const hasNullOrEmptyKey = data.some(obj => obj.value === null || obj.value === '');
      if (!hasNullOrEmptyKey) {
        const teamStep = this.steps.findIndex(step => step.key === 'inputs')
        this.steps[teamStep].disabled = false
      } else {
        const teamStep = this.steps.findIndex(step => step.key === 'inputs')
        this.steps[teamStep].disabled = true
      }

    })

    this.store.select(state => state.setting).subscribe(data => {
      const state = data.setting
      this.isMobileView = state.isMobileView;
    });
    const user = JSON.parse(localStorage.getItem('userAuth'))

    this.teamForm = this.formBuilder.group({
      name: ['', Validators.compose([Validators.required])],
      game_code: [''],
      contact: this.formBuilder.group({
        email: [user.email ? user.email : '', Validators.compose([Validators.required, Validators.email])],
        phone: [user.phone ? user.phone : '', Validators.required],
      })
    })
    this.teamForm.valueChanges.subscribe(data => {
      if (this.teamForm.valid) {
        const teamStep = this.steps.findIndex(step => step.key === 'teams')
        this.steps[teamStep].disabled = false
      } else {
        const teamStep = this.steps.findIndex(step => step.key === 'teams')
        this.steps[teamStep].disabled = true
      }
    })
    this.profileForm.valueChanges.subscribe(data => {
      if (this.profileForm.valid) {
        const teamStep = this.steps.findIndex(step => step.key === 'inputs')
        if (this.steps[teamStep]) {
          this.steps[teamStep].disabled = false
        }
      } else {
        const teamStep = this.steps.findIndex(step => step.key === 'inputs')
        if (this.steps[teamStep]) {
          this.steps[teamStep].disabled = true
        }
      }
    })
  }


  ngOnInit() {
    this.store.dispatch(new CompareRequiredInputs(this.tournamentId))
    this.actions.pipe(ofActionCompleted(CompareRequiredInputs)).subscribe(() => {
      this.missingRequiredInputs$.pipe(takeUntil(this.ngUnsubscribe)).subscribe(data => {
        if (data) {
          data.forEach((item: any) => {
            this.addRequiredInputs(item)
          });
        }
      })
    })
    this.user$.subscribe(user => {
      if (user) {
        if (!user.birthdate) {
          this.addFormControl('birthdate')
        }
        if (!user.phone) {
          this.addFormControl('phone')
        }
        if (!user.gender) {
          this.addFormControl('gender')
        }

      }
    })
  }

  addFormControl(control: string) {
    const newControl = new FormControl('', Validators.required);
    this.profileForm.addControl(control, newControl);
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next()
    this.ngUnsubscribe.complete()
    const inputsArray = this.requiredInputsForm.get('userSupportedRequiredInputsKey') as FormArray;
    inputsArray.clear();
  }

  RequiredInputs(): FormArray {
    return this.requiredInputsForm.get('userSupportedRequiredInputsKey') as FormArray
  }

  addRequiredInputs(payload: any) {
    // const control = new FormControl(payload, Validators.required);
    const group = this.formBuilder.group({});
    for (const key in payload) {
      if (payload.hasOwnProperty(key)) {
        // For each key in the payload, create a control with Validators.required
        group.addControl(key, this.formBuilder.control(payload[key], Validators.required));
        group.markAsTouched()
      }
    }
    (this.requiredInputsForm.get('userSupportedRequiredInputsKey') as FormArray).push(group)
    for (let control of (this.requiredInputsForm.get('userSupportedRequiredInputsKey') as FormArray).controls) {
      if (control.status === 'INVALID') {
        control.get('value').markAsTouched()
        control.get('value').markAsDirty()
        console.log(control)
      }

    }
    // return this.control;
  }

  ngAfterViewInit() {
    this.getSteps()
    this.setStepTemplate(this.currentIndex, this.steps[0])
    this.changeDetectorRef.detectChanges();
  }

  getSteps(): StepperStep[] {
    this.tournament$.pipe(takeUntil(this.ngUnsubscribe)).subscribe(tournament => {
      this.tournament = tournament
      if (tournament.supportedRequiredInputsKeys.length > 0 || Object.keys(this.profileForm.controls).length > 0) {
        this.steps.unshift({key: 'inputs', label: 'Required Inputs', disabled: this.requiredInputsForm.invalid},)
      }
      if (tournament.participants_type === 'teams') {
        this.steps.unshift({key: 'teams', label: 'Select Team', disabled: !this.selectedTeam})
        this.getLeaderTeams()
      }
      if (tournament.required_accounts.length > 0) {
        this.steps.unshift({key: 'accounts', label: 'Connect Account', disabled: !this.selectedLeagueAccount})
      }
      if (tournament.show_rules) {
        this.steps.unshift({key: 'rules', label: 'Rules'})
      }

      return this.steps;
    })
    return this.steps
  }

  getLeaderTeams() {
    this.loadingTeams = true
    this.tournamentService.getLeaderTeams().subscribe(teams => {
      this.loadingTeams = false
      this.teamsList = teams.filter((team: any) => team.game.data.code === this.tournament.game.data.code)
    }, error => {
      this.loadingTeams = false
    })
  }

  change(event) {
    this.isCreateTeam = event === 'create';
  }

  setStepTemplate(index: number, step: StepperStep) {
    this.currentIndex = index
    if (step) {
      this.currentTemplate = this[step.key as keyof this] as TemplateRef<any>;
    }
  }

  onSelectTeam(event) {
    const teamStep = this.steps.findIndex(step => step.key === 'teams')
    this.steps[teamStep].disabled = false
  }

  onSetSelectedAccount(account: any) {
    this.selectedLeagueAccount = account.id
    if (this.selectedLeagueAccount) {
      const teamStep = this.steps.findIndex(step => step.key === 'accounts')
      this.steps[teamStep].disabled = false
    }

  }

  nextStep(steps: StepperStep, isJoin: boolean, isCreatTeam?: boolean) {
    if (isCreatTeam) {
      const data = this.teamForm.value
      data.game_code = this.tournament.game.data.code
      const formData = new FormData();
      formData.append('data', JSON.stringify(data));
      this.teamService.createTeam(formData).subscribe((data: any) => {
        this.selectedTeam = data.id
        if (this.currentIndex + 1 < this.steps.length) {
          this.currentIndex++
          this.setStepTemplate(this.currentIndex, this.steps[this.currentIndex])
        }
        if (this.selectedLeagueAccount) {
          this.requiredInputsForm.value.required_accounts = [{
            account_id: this.selectedLeagueAccount,
            connectable_account_id: 2
          }]
        }
        if (isJoin) {
          this.joinTournament(isJoin)
        }
      }, error => {
        this.store.dispatch(new HandleError(error))
        return true
      })
    } else {
      if (this.currentIndex + 1 < this.steps.length && !isCreatTeam) {
        this.currentIndex++
        this.setStepTemplate(this.currentIndex, this.steps[this.currentIndex])
      }
      if (this.selectedLeagueAccount) {
        this.requiredInputsForm.value.required_accounts = [{
          account_id: this.selectedLeagueAccount,
          connectable_account_id: 2
        }]
      }
      if (isJoin) {
        this.joinTournament(isJoin)
      }
    }


  }

  joinTournament(isJoin) {
    if (isJoin) {
      this.profileForm.get('birthdate')?.setValue(this.profileForm.value.birthdate.getTime())
      this.profileForm.get('phone')?.setValue(this.profileForm.value.phone.e164Number)
      const data = this.profileForm.value
      const formData = new FormData();
      formData.append('data', JSON.stringify(data));
      const updateProfile$ = Object.keys(this.profileForm.value).length !== 0
        ? this.gamerService.updateProfile(formData)
        : of(null);
      updateProfile$
        .pipe(
          switchMap(data => {
            console.log(this.profileForm.value)
            if (Object.keys(this.profileForm.value).length > 0) {
              this.store.dispatch(new UpdateUser(this.profileForm.value))
            }
            if (this.tournament.participants_type === 'teams') {
              this.requiredInputsForm.value.team_id = this.selectedTeam
            }
            return this.tournamentService.joinTournament(this.tournamentId, this.requiredInputsForm.value);
          })
        )
        .subscribe(data => {
          this.nzModalService.closeAll()
          const joinTournamentState = this.store.selectSnapshot(JoinTournamentState); // Get the current state snapshot
          joinTournamentState.isJoinedData.is_joined = true
          joinTournamentState.isJoinedData.is_joinable = false
          this.store.dispatch(new UpdateIsJoinedData(joinTournamentState.isJoinedData))
          this.store.dispatch(new IsJoined(this.tournamentId))
          if (this.tournament.participants_type === 'teams') {
            this.store.dispatch(new GetTeamAuthority(this.tournamentId, this.selectedTeam))
          }
          this.store.dispatch(new SetNotifications('Join Tournament', 'You have Joined Tournament Successfully', 'success'))
          if (this.tournament.participants_type === 'teams' && this.team?.owner?.id === parseInt(localStorage.getItem('User'))) {
            this.router.navigateByUrl(`/tournaments/${this.tournamentId}/team-settings`)
          }
        }, error => {
          if (error.error.code === 'ThirdPartySubscriptionRequired') {
            this.isSubscription = true
          }
          this.store.dispatch(new HandleError(error))

        });
    }
  }

}
