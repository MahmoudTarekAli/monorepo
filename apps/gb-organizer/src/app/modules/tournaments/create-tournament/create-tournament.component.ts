import {Component, OnInit} from '@angular/core';
import {UntypedFormBuilder, UntypedFormGroup, Validators} from '@angular/forms'
import {TournamentService} from '../services/tournament.service';
import {map} from "rxjs/operators";
import {Actions, ofActionSuccessful, Select, Store} from "@ngxs/store";
import {TournamentState} from "../state/tournament.state";
import {Observable} from "rxjs";
import {GlobalState} from "../../../shared/state/global.state";
import {GetCountries} from "../../../shared/state/global.action";
import {
  AddTournament,
  GetArenas,
  GetFeaturedGames,
  GetGames,
  GetGameSettings,
  GetTournaments
} from "../state/tournament.action";
import {ActionsExecuting, hasActionsExecuting} from "@ngxs-labs/actions-executing";
import {ActivatedRoute, Router} from "@angular/router";
import {GetTournament, UpdateTournament} from '../../edit-tournament/tournament-process/state/tournament-process.action'
import {TournamentProcessState} from '../../edit-tournament/tournament-process/state/tournament-process.state'
import {StateReset} from "ngxs-reset-plugin";
import * as DecoupledEditor from '../../../../assets/js/ckeditor5-build-decoupled-document/ckeditor.js';
import {fadeInDownOnEnterAnimation, fadeOutUpOnLeaveAnimation} from "angular-animations";
import {AuthenticationState, UserStateModel} from "../../authentication/state/authentication.state";
import {ScrollStrategy, ScrollStrategyOptions} from '@angular/cdk/overlay';
import {base64ToFile} from "ngx-image-cropper";
import {set} from "@angular/fire/database";
import {GlobalService} from "../../../shared/services/global.service";

@Component({
  selector: 'app-create-tournament',
  templateUrl: './create-tournament.component.html',
  styleUrls: ['./create-tournament.component.scss'],
  animations: [
    fadeInDownOnEnterAnimation({anchor: 'enter', duration: 800, translate: '30px'}),
    fadeOutUpOnLeaveAnimation({anchor: 'leave', duration: 400, translate: '30px'}),
  ],
})
export class CreateTournamentComponent implements OnInit {
  games: any
  loading = true
  skeleton = [0, 1, 2, 3, 4, 5]
  platforms: any
  createTournamentForm: UntypedFormGroup
  arenas$: Observable<any>;
  isEditable = false;
  tournamentId: string
  tournament: any;
  public Editor = DecoupledEditor;
  user: any
  featuredGames = [];

  @Select(GlobalState.getCountriesList) Countries: Observable<any>;
  @Select(hasActionsExecuting([AddTournament])) addTournamentIsExecuting$: Observable<ActionsExecuting>;
  @Select(hasActionsExecuting([UpdateTournament])) updateTournamentIsExecuting$: Observable<ActionsExecuting>;
  @Select(TournamentProcessState.getTournament) getTournament: Observable<any>;
  @Select(AuthenticationState.getAuth) getUser: Observable<any>;
  @Select(TournamentState.getArenasList) getArenas$: Observable<any>;
  @Select(TournamentState.getGamesList) getGames$: Observable<any>;
  @Select(TournamentState.getFeaturedGamesList) getFeaturedGames$: Observable<any>;
  @Select(TournamentState.getLeagueSettings) getLeagueSettings: Observable<any>;

  // upload images variables
  profileCroppedImage: any
  coverCroppedImage: any
  scrollStrategy: ScrollStrategy;
  isTimeEdit = false;
  leagueSettings: any
  profileSelected
  coverSelected

  constructor(private readonly sso: ScrollStrategyOptions, private tournamentService: TournamentService, private fb: UntypedFormBuilder, public globalService: GlobalService,
              private store: Store, private router: Router, private activatedRoute: ActivatedRoute, private actions$: Actions) {
    // reset tournamentProcessState When change the tournament
    // actions$.pipe(ofActionSuccessful(GetTournaments)).subscribe(() => {
    //   this.platforms = []
    // });
    this.actions$.pipe(ofActionSuccessful(GetFeaturedGames)).subscribe(() => {
      if (window.innerWidth < 1650) {
        this.featuredGames = this.featuredGames.slice(0, 6)
      }
    })
  }

  ngOnInit(): void {
    this.scrollStrategy = this.sso.noop(); // or close()/block()/reposition()

    const dt = new Date();
    this.createTournamentForm = this.fb.group({
      game_code: ['', [Validators.required]],
      name: ['', [Validators.required]],
      start_at: [new Date(dt.getTime() + 15 * 60000), [Validators.required]],
      participants_type: ['single', [Validators.required]],
      country: ['Global'],
      arena_slug: [''],
      platform_id: ['', [Validators.required]],
      description: [''],
      no_of_participants_per_team: ['', [Validators.max(7), Validators.min(2)]],
      no_of_substitutes_per_team: [''],
      is_trackable: [false],
      connected_accounts_required: [false],
      members_connected_accounts_required: [false],
    });
    console.log(this.createTournamentForm)
    // get value of start_at in createTournamentForm
    this.store.dispatch(new GetCountries())
    this.store.dispatch(new GetArenas())
    this.store.dispatch(new GetGames())
    this.store.dispatch(new GetFeaturedGames(true))
    this.getGames$.subscribe(res => {
      this.games = res
      this.loading = false
    })
    this.getFeaturedGames$.subscribe(res => {
      this.featuredGames = res
    })

    this.arenas$ = this.getArenas$.pipe(map(res => {
      return res.reverse()
    }))
    this.user = JSON.parse(localStorage.getItem('userAuth'))

    this.isEditable = this.router.url.includes('tournament-info');

    // to sync multiple input with same formControl
    this.createTournamentForm.controls.game_code.valueChanges.subscribe(game => {
      console.log(game)
      if (game === 'league-of-legends' || game === 'valorant') {
        this.store.dispatch(new GetGameSettings(game))
        this.getLeagueSettings.subscribe(res => {
          this.leagueSettings = res
          // add Form Group with name publisher_settings to createTournamentForm and has form controls with the name of keys in leagueSettings
          this.createTournamentForm.addControl('publisher_settings', this.fb.group({}))
          Object.keys(this.leagueSettings).forEach(setting => {
            this.createTournamentForm.controls.publisher_settings['addControl'](setting, this.fb.control(this.leagueSettings[setting].type === 'checkbox' ? false : ''))
          })
          if (this.isEditable) {
            this.createTournamentForm.get('publisher_settings').patchValue(this.tournament?.publisher_settings)
          }
        })
      } else if (this.createTournamentForm.value.publisher_settings) {
        this.createTournamentForm.removeControl('publisher_settings')
      }
      this.createTournamentForm.controls.game_code.setValue(game, {onlySelf: true, emitEvent: false});
    });
    if (this.isEditable) {
      this.getTournament.subscribe(res => {
        if (res.code) {
          this.tournament = res
          this.tournamentId = res.code
          if (this.tournament.is_published) {
            this.createTournamentForm.controls.arena_slug.disable()
          }
          this.setFormValues()
        }
      })
    }
    console.log(this.createTournamentForm.value.country)
  }


  selectGame(code) {
    this.getImageGame(code)
    console.log(code)
    if (code === 'league-of-legends' || code === 'valorant') {

      // this.store.dispatch(new GetGameSettings(code))
    }
    this.getGames$.subscribe(res => {
      if (res.length > 0) {
        this.platforms = this.games?.find(game => game.code === code)?.platformSlug
        this.createTournamentForm.controls.platform_id.setValue(this.platforms?.[0].id)
        console.log(this.createTournamentForm.controls.game_code)
      }
    })

  }

  getImageGame(code) {
    const codesOfGames = this.games.map(game => game.code)
    const index = codesOfGames.indexOf(code)
    const codeOfFeaturedGames = this.featuredGames.map(game => game.code)
    if (!codeOfFeaturedGames.includes(this.games[index]?.code)) {
      this.featuredGames[0] = this.games[index]

    }
    // if (!this.gamesIndex.includes(index)) {
    //   this.gamesIndex[0] = index
    // }
  }

  createTournament() {
    // this.createTournamentForm.get('start_at').setValue(this.convertDateToTimestamp(this.createTournamentForm.get('start_at').value))
    this.createTournamentForm.value.arena_slug === '' ? this.createTournamentForm.value.arena_slug = null : this.createTournamentForm.value.arena_slug
    if (this.profileSelected?.avatar) {
      this.createTournamentForm.value.profile_picture = this.profileSelected.avatar
    }
    if (this.coverSelected?.cover) {
      this.createTournamentForm.value.cover_picture = this.coverSelected.cover
    }
    this.isEditable ? this.store.dispatch(new UpdateTournament(this.createTournamentForm.value, this.tournamentId)) : this.store.dispatch(new AddTournament(this.createTournamentForm.value));

    // this.store.dispatch(new AddTournament(this.createTournamentForm.value))
  }

  setFormValues() {
    // const dt = new Date(this.tournament.start_at);
    let dt;
    if (!this.isTimeEdit) {
      dt = new Date(this.tournament.start_at);
      dt = new Date(dt.getTime() + parseInt(this.globalService.clientTimezoneOffset) * 60 * 60 * 1000)
      this.isTimeEdit = true
    } else {
      dt = this.createTournamentForm.get('start_at').value
    }
    this.createTournamentForm.get('game_code').setValue(this.tournament?.game?.data?.code);
    this.createTournamentForm.get('name').setValue(this.tournament?.name);
    this.createTournamentForm.get('start_at').setValue(new Date(dt.getTime()));
    this.createTournamentForm.get('participants_type').setValue(this.tournament?.participants_type);
    this.createTournamentForm.get('country').setValue(this.tournament?.country);
    this.tournament?.arena_slug ? this.createTournamentForm.get('arena_slug').setValue(this.tournament?.arena_slug) : this.createTournamentForm.get('arena_slug').setValue('');
    this.createTournamentForm.get('description').setValue(this.tournament?.description);
    this.createTournamentForm.get('is_trackable').setValue(this.tournament?.is_trackable);
    this.createTournamentForm.get('connected_accounts_required').setValue(this.tournament.is_trackable ? true : this.tournament.connected_accounts_required);
    this.createTournamentForm.get('members_connected_accounts_required').setValue(this.tournament.members_connected_accounts_required);
    this.createTournamentForm.get('no_of_participants_per_team').setValue(this.tournament?.no_of_participants_per_team);
    this.createTournamentForm.get('no_of_substitutes_per_team').setValue(this.tournament?.no_of_substitutes_per_team);
    this.createTournamentForm.get('platform_id').setValue(this.tournament?.platform_id);
    this.createTournamentForm.get('country').setValue(this.tournament.country ? this.tournament.country : 'Global');
    this.selectGame(this.tournament?.game?.data?.code)
    this.coverCroppedImage = this.tournament?.cover_picture
    this.profileCroppedImage = this.tournament?.profile_picture
    console.log(this.platforms)
    console.log(this.createTournamentForm.invalid)
    console.log(this.createTournamentForm.value)
  }

  isGameAutomationChange(event) {
    if (event) {
      this.createTournamentForm.get('connected_accounts_required').setValue(event ? true : this.tournament.connected_accounts_required);
      this.createTournamentForm.get('connected_accounts_required').disable()
    } else {
      if (this.createTournamentForm.get('members_connected_accounts_required').value !== true) {
        this.createTournamentForm.get('connected_accounts_required').enable()
      }
    }
  }

  isMemberRequiredAccountChange(event) {
    if (event) {
      this.createTournamentForm.get('connected_accounts_required').setValue(event ? true : this.tournament.connected_accounts_required);
      this.createTournamentForm.get('connected_accounts_required').disable()
    } else {
      if (this.createTournamentForm.get('is_trackable').value !== true) {
        this.createTournamentForm.get('connected_accounts_required').enable()
      }
    }
  }

  changeParticipantsType(type) {
    if (type === 'teams') {
      // make required no_of_substitutes_per_team required
      // this.createTournamentForm.get('no_of_substitutes_per_team').setValidators([Validators.required])
      this.createTournamentForm.get('no_of_participants_per_team').setValidators([Validators.required])
    } else {
      // remove control no_of_substitutes_per_team from form
      this.createTournamentForm.get('no_of_substitutes_per_team').clearValidators()
      this.createTournamentForm.get('no_of_participants_per_team').clearValidators()
      this.createTournamentForm.get('no_of_substitutes_per_team').updateValueAndValidity()
      this.createTournamentForm.get('no_of_participants_per_team').updateValueAndValidity()

    }
  }

  onReady(editor) {
    editor.ui.getEditableElement().parentElement.insertBefore(
      editor.ui.view.toolbar.element,
      editor.ui.getEditableElement(),
    );
  }


  selectImages($event: any) {
    console.log($event)
    if ($event?.avatarImageHolder) {
      this.profileSelected = $event
      this.profileCroppedImage = $event.avatarImageHolder
    }
    if ($event?.coverImageHolder) {
      this.coverSelected = $event
      this.coverCroppedImage = $event.coverImageHolder
    }
    console.log(this.coverCroppedImage)
  }


  change(event) {
    console.log(event)
    console.log(this.createTournamentForm.value.publisher_settings)
  }
}
