import {Component, OnDestroy, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import {SharedModule} from "../../../shared/shared.module";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {NzAffixModule} from "ng-zorro-antd/affix";
import {Actions, ofActionCompleted, ofActionSuccessful, Select, Store} from "@ngxs/store";
import {
  CreateChallenge,
  GetChallenge,
  GetChallengeSettings,
  GetChallengesGames,
  GetGameSettings,
  UpdateChallenge
} from "../state/challenges.action";
import {combineLatest, forkJoin, Observable, Subject} from "rxjs";
import {ChallengesState} from "../state/challenges.state";
import {OWL_DATE_TIME_FORMATS, OwlDateTimeModule, OwlNativeDateTimeModule} from "ng-pick-datetime";
import {ScrollStrategy, ScrollStrategyOptions} from "@angular/cdk/overlay";
import {GlobalService} from "../../../shared/services/global.service";
import {GetEvents} from "../../edit-tournament/tournament-process/state/tournament-process.action";
import {TournamentProcessState} from "../../edit-tournament/tournament-process/state/tournament-process.state";
import {ActivatedRoute} from "@angular/router";
import {MY_NATIVE_FORMATS} from "../../tournaments/create-tournament/create-tournament.module";
import {fadeInDownOnEnterAnimation, fadeOutUpOnLeaveAnimation} from "angular-animations";
import {AngularEditorModule} from "@kolkov/angular-editor";
import {ChallengesService} from "../service/challenges.service";
import {environment} from "../../../../environments/environment";
import {TournamentState} from "../../tournaments/state/tournament.state";
import {GetArenas} from "../../tournaments/state/tournament.action";
import {takeUntil} from "rxjs/operators";

@Component({
  selector: 'app-create-edit-challenge',
  standalone: true,
  imports: [CommonModule, SharedModule, ReactiveFormsModule, NzAffixModule, FormsModule, AngularEditorModule],
  providers: [{provide: OWL_DATE_TIME_FORMATS, useValue: MY_NATIVE_FORMATS}],
  templateUrl: './create-edit-challenge.component.html',
  styleUrls: ['./create-edit-challenge.component.scss'],
  animations: [
    fadeInDownOnEnterAnimation({anchor: 'enter', duration: 800, translate: '30px'}),
    fadeOutUpOnLeaveAnimation({anchor: 'leave', duration: 400, translate: '30px'}),
  ],
})
export class CreateEditChallengeComponent implements OnInit, OnDestroy{
  ChallengeForm: FormGroup
  isEditable = false;
  @Select(ChallengesState.getChallenge) challenge$: Observable<any>;
  @Select(ChallengesState.getGameSettings) gameSettings$: Observable<any>;
  @Select(ChallengesState.getChallengeSettings) challengeSettings$: Observable<any>;
  @Select(ChallengesState.getChallengeGames) challengeGames$: Observable<any>;
  @Select(TournamentProcessState.getEventList) events$: Observable<any>;
  @Select(TournamentState.getArenasList) arenas$: Observable<any>;
  scrollStrategy: ScrollStrategy;
  isShowRequiredInputs = false;
  challengeId: string;
  challenge
  environment = environment;
  bannerSelected
  bannerCropedImage
  restrictionRules = null
  private readonly unsubscribe$: Subject<void> = new Subject();

  constructor(private store: Store, private fb: FormBuilder, private readonly sso: ScrollStrategyOptions,
              private challengeService: ChallengesService, private actions$: Actions ,
              public globalService: GlobalService, private activatedRoute: ActivatedRoute) {

    this.ChallengeForm = fb.group({
      name: ['', Validators.compose([Validators.required])],
      description: [''],
      visibility: ['Public'],
      start_at: ['', Validators.compose([Validators.required])],
      end_date: ['', Validators.compose([Validators.required])],
      game_code: ['league-of-legends', Validators.compose([Validators.required])],
      rules: ['', Validators.compose([Validators.maxLength(100000)])],
      settings: this.fb.group({}),
      prizes: this.fb.array([]),
      prize_pool: [0],
      password_type: [null],
      password: [null , Validators.compose([Validators.min(1000), Validators.max(1000000000000)])],
      event_id: [null],
      arena_id: [null],
      allow_referrals: [true],
    });
  }
  ngOnInit(): void {
    this.scrollStrategy = this.sso.noop(); // or close()/block()/reposition()
    this.store.dispatch(new GetChallengesGames())
    this.store.dispatch(new GetEvents())
    this.store.dispatch(new GetArenas())
    this.store.dispatch(new GetChallengeSettings())
    this.activatedRoute.params.subscribe(param => {
      if (param.id) {
        this.challengeId = param.id;
        this.isEditable = true;
        this.store.dispatch(new GetChallenge(param.id))
        this.challenge$.subscribe(res => {
          if (res) {
            this.challenge = res.data
            this.selectGame(res.data.game.code)
            setTimeout(() => {
              this.patchFormValue(res.data)

            } , 500)
            // this.actions$.pipe(ofActionCompleted(GetGameSettings)).subscribe(() => {
            //
            //
            // })
          }
        })
      } else {
        this.selectGame('league-of-legends')

      }
    })
    this.gameSettings$.subscribe(gameSettings => {
      if (gameSettings) {
        this.appendControlsToSettingsFormGroup(gameSettings, 'settings');
      }
    })
    this.challengeSettings$.subscribe(challengeSettings => {
      if (challengeSettings) {
        this.appendControlsToSettingsFormGroup(challengeSettings);
        // const bonusTypeControl = this.ChallengeForm.get('bonus_type');
        // console.log(bonusTypeControl)
        // bonusTypeControl?.valueChanges.subscribe((bonusType: any[]) => {
        //   const bonusPrizeTypeControl = settingsFormGroup.get('bonus_prize_type');
        //   if (bonusPrizeTypeControl) {
        //     if (bonusType.length) {
        //       bonusPrizeTypeControl.setValidators([Validators.required]);
        //     } else {
        //       bonusPrizeTypeControl.clearValidators();
        //     }
        //     bonusPrizeTypeControl.updateValueAndValidity();
        //     console.log(bonusPrizeTypeControl)
        //   }
        // });
      }
    })

    if (this.challengeService.dublicateChallengeCode) {
        combineLatest([this.challenge$ , this.challengeSettings$]).pipe(takeUntil(this.unsubscribe$)).subscribe((res: any) => {
          if (res[0]?.data && res[1]){
            setTimeout(() => {
              this.patchFormValue(res[0].data)
              this.selectGame(res[0].data.game.code)
              this.ChallengeForm.controls.start_at.setValue('')
              this.ChallengeForm.controls.end_date.setValue('')
            } , 100)
          }
        });
    }
  }

  createChallenge() {
    if (this.bannerSelected?.cover) {
      this.ChallengeForm.value.banner = this.bannerSelected.cover
    }

    const payload = this.ChallengeForm.value
    payload.restrictions = payload.restrictions.map((restriction) => {
      return {
        type: restriction,
        rules: this.restrictionRules
      }
    })
    if (this.ChallengeForm.invalid){
      return
    }
    if (payload.password_type !== 'password') {
      payload.password = null
    }
    if (this.isShowRequiredInputs){
      payload.required_inputs = [
        {
          name: {
            en: "Cafe Name",
            ar: "Cafe Name"
          },
          type: "selection",
          is_shown: true,
          visibility: "Public",
          is_mandatory: true,
          possible_values: [
            "Cafe 1",
            "Cafe 2",
            "Cafe 3",
            "Cafe 4",
            "Cafe 5"
          ]
        }
      ]
    }
    if (this.isEditable){
      if (this.challenge.status === 'Live') {
        delete payload.settings
      }
      this.store.dispatch(new UpdateChallenge(this.challengeId , payload))
    } else {
      this.store.dispatch(new CreateChallenge(payload))
    }
  }
  selectGame(gameCode){
    if (gameCode){
      this.store.dispatch(new GetGameSettings(gameCode))
    }
  }
  appendControlsToSettingsFormGroup(gameSettings: any , formName?: string) {
    let  settingsFormGroup
    if (formName){
      settingsFormGroup = this.ChallengeForm.get(formName) as FormGroup;
    } else {
      settingsFormGroup = this.ChallengeForm as FormGroup;
    }
    gameSettings?.forEach((setting: any) => {
        settingsFormGroup.addControl(setting.name, this.fb.control(this.getControlValue(setting) ,
          setting.required ? Validators.required : null));
    });
  }
  getControlValue(control): any {
    if (control?.selectType === 'multiple') {
      return [];
    }
    if (control.type === 'checkbox') {
      return false;
    }
    // Set default value as null for other types of controls
    return null;
  }
  patchFormValue(value){
    this.ChallengeForm.patchValue(value)
    this.ChallengeForm.controls.arena_id.setValue(value.arena?.id)
    this.ChallengeForm.controls.event_id.setValue(value?.event?.id)
    this.ChallengeForm.controls.game_code.setValue(value?.game?.code)
    this.bannerCropedImage = value?.banner
    // console.log(value.restrictions[0].rules)

    this.restrictionRules = value?.restrictions[0]?.rules
    const restrictions = value?.restrictions.map(restriction => {
      return restriction.type
    })
    this.ChallengeForm.controls?.restrictions?.setValue(restrictions)
    if (value.required_inputs?.data && value.required_inputs?.data?.length > 0){
      this.isShowRequiredInputs = true;
    }
  }
  selectImages($event: any) {
    if ($event?.coverImageHolder) {
      this.bannerSelected = $event
      this.bannerCropedImage = $event.coverImageHolder
    }
  }

  ngOnDestroy(): void {
    this.challengeService.dublicateChallengeCode = null;
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

}
