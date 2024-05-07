import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core'
import {UntypedFormBuilder, UntypedFormGroup, Validators} from '@angular/forms'
import {Select, Store} from '@ngxs/store'
import {CancelTournament, DeleteTournament, GetEvents, GetThirdParties, ResetTournament, UpdateTournament} from '../state/tournament-process.action'
import {TournamentProcessState} from '../state/tournament-process.state'
import {fromEvent, Observable, Subject} from 'rxjs'
import {TournamentProcessService} from '../services/tournament-process.service'
import {debounceTime, distinctUntilChanged, filter, map} from 'rxjs/operators'
import {NzNotificationService} from 'ng-zorro-antd/notification'
import {TournamentSettingsService} from './tournament-settings.service'
import {GetCountries, HandleError, SetNotifications} from '../../../../shared/state/global.action'
import {GetArenas} from "../../../tournaments/state/tournament.action";
import {GlobalState} from "../../../../shared/state/global.state";
import {ConfirmationDialogComponent} from "../../../../shared/dialogs/confirmation-dialog/confirmation-dialog.component";
import {NzModalService} from "ng-zorro-antd/modal";
import { ResetBracket} from "../../manage-tournaments/match-list/state/match-list.action";
import {environment} from "../../../../../environments/environment";

@Component({
  selector: 'app-tournament-settings',
  templateUrl: './tournament-settings.component.html',
  styleUrls: ['./tournament-settings.component.scss']
})
export class TournamentSettingsComponent implements OnInit, AfterViewInit {
  TournamentSettingsForm: UntypedFormGroup;
  tournamentCode;
  moderatorFormGroup: UntypedFormGroup;
  moderatorType;
  moderatorName;
  users;
  moderatorList;
  eventArray;
  arenaObj;
  sponsorType;
  thirdParties;
  arenas;
  tournamentId;
  sponsorsList = []
  abbrCountries
  tournament: any;
  private organizerUrl = environment.organizerUrl

  contactDetails = [
    {name: 'email', value: 'email', placeholder: 'email_placeholder'},
    {name: 'phone', value: 'phone', placeholder: 'phone_placeholder'},
    {name: 'website', value: 'website', placeholder: 'website_placeholder'},
    {name: 'facebook', value: 'facebook', placeholder: 'facebook_placeholder'},
    {name: 'twitch', value: 'twitch', placeholder: 'twitch_placeholder'},
    {name: 'discord', value: 'discord', placeholder: 'discord_placeholder'},
    {name: 'twitter', value: 'twitter', placeholder: 'twitter_placeholder'},
    {name: 'instagram', value: 'instagram', placeholder: 'instagram_placeholder'},
    {name: 'youtube', value: 'youtube', placeholder: 'youtube_placeholder'},
  ]
  @ViewChild('searchInput', {static: false}) search: ElementRef;
  @ViewChild('searchArenaInput', {static: false}) searchArena: ElementRef;
  @Select(GlobalState.getCountriesList) Countries: Observable<any>;
  @Select(TournamentProcessState.getTournament) getTournament: Observable<any>
  @Select(TournamentProcessState.getEventList) getEvents$: Observable<any>
  @Select(TournamentProcessState.getThirdPartiesList) getThirdParties$: Observable<any>
  tabName: string;
  constructor(private fb: UntypedFormBuilder, private store: Store, private tournamentSettingsService: TournamentSettingsService, private modalService: NzModalService,
              private tournamentProcessService: TournamentProcessService) {
    this.TournamentSettingsForm = fb.group({
      visibility: [false],
      event_id: [null],
      contact_details: fb.group({
        phone: [null],
        facebook: [null, Validators.pattern('^(http(s?):\\/\\/)?(www\\.)?(facebook)(\\.[a-zA-Z]{2,3})+(\\/[a-zA-Z0-9\\_\\-\\s\\.\\/\\?\\%\\#\\&\\=]*)?$')],
        twitch: [null, Validators.pattern('^(http(s?):\\/\\/)?(www\\.)?(twitch)(\\.[a-zA-Z]{2,3})+(\\/[a-zA-Z0-9\\_\\-\\s\\.\\/\\?\\%\\#\\&\\=]*)?$')],
        discord: [null, Validators.pattern('^(http(s?):\\/\\/)?(www\\.)?(discord|discordapp)(\\.[a-zA-Z]{2,3})+(\\/[a-zA-Z0-9\\_\\-\\s\\.\\/\\?\\%\\#\\&\\=]*)?$')],
        twitter: [null, Validators.pattern('^(http(s?):\\/\\/)?(www\\.)?(twitter)(\\.[a-zA-Z]{2,3})+(\\/[a-zA-Z0-9\\_\\-\\s\\.\\/\\?\\%\\#\\&\\=]*)?$')],
        instagram: [null, Validators.pattern('^(http(s?):\\/\\/)?(www\\.)?(instagram)(\\.[a-zA-Z]{2,3})+(\\/[a-zA-Z0-9\\_\\-\\s\\.\\/\\?\\%\\#\\&\\=]*)?$')],
        website: [null, Validators.pattern('^(http(s?):\\/\\/)?(www\\.)?[a-zA-Z0-9\\.\\-\\_]+(\\.[a-zA-Z]{2,3})+(\\/[a-zA-Z0-9\\_\\-\\s\\.\\/\\?\\%\\#\\&\\=]*)?$')],
        email: [null, Validators.pattern('^[a-zA-Z0-9]+(\.[_a-zA-Z0-9]+)*@[a-zA-Z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,15})$')],
        youtube: [null, Validators.pattern('^(http(s?):\\/\\/)?(www\\.)?(youtube)(\\.[a-zA-Z]{2,3})+(\\/[a-zA-Z0-9\\_\\-\\s\\.\\/\\?\\%\\#\\&\\=]*)?$')],
      }),
      allow_third_party: [false],
      third_party_subscriptions: fb.group({
        operator: [''],
        service: ['phoneSubscription'],
        status: ['Subscribed'],
        subscription: ['']
      })
    });

  }


  ngOnInit(): void {
    this.store.dispatch(new GetCountries())
    this.Countries.subscribe(res => {
      this.abbrCountries = res.map(country => country.abbr.toLowerCase())
      console.log(this.abbrCountries)
    })
    this.store.dispatch(new GetEvents())
    this.store.dispatch(new GetThirdParties())
    this.getThirdParty()
    this.getTournament.subscribe(res => {
      if (res?.code) {
        this.tournament = res
        this.tournamentCode = res?.code;
        this.tournamentId = res?.id;
        this.moderatorList = res?.moderators?.data
        if (res?.game) {
          // check if third_party_subscriptions is exist allow_third_party is true
          if (res?.third_party_subscriptions) {
            this.TournamentSettingsForm.patchValue({
              allow_third_party: true
            })
          }
          // console.log('hereee' , res.visibility)
          const formGroup = res
          formGroup.visibility = res.visibility === 'private' || res.visibility === true ? true : false
          formGroup.event_id = res.event?.data?.id
          console.log(formGroup)
          this.TournamentSettingsForm.patchValue(formGroup)
        }
      }

    })
  }

  ngAfterViewInit(): void {
    console.log(this.search)
    // userSearch
    fromEvent(this.search?.nativeElement, 'keyup').pipe(
      map((event: any) => {
        return event.target.value;
      })
      , filter(res => res.length >= 0)
      , debounceTime(300)
      , distinctUntilChanged()
    ).subscribe((text: string) => {
      if (text.length > 0) {
        this.getUsers(text)
      } else {
        this.users = []
      }

    });

  }
changeTab(tab) {

  if (tab.index === 1){
    this.tabName = 'advanced'
    if (this.searchArena?.nativeElement) {
      console.log('here')
      fromEvent(this.searchArena?.nativeElement, 'keyup').pipe(
        map((event: any) => {
          return event.target.value;
        })
        , filter(res => res.length >= 0)
        , debounceTime(300)
        , distinctUntilChanged()
      ).subscribe((text: string) => {
        if (text.length > 0) {
          this.getArenas(text)
        } else {
          this.arenas = []
        }

      });
    }
    this.tournamentSettingsService.getSponsors(this.tournamentCode).subscribe(res => {
      this.sponsorsList = res.data
      console.log(res)
    })
  }

  }
  getUsers(text) {
    this.tournamentSettingsService.getSearchUsers(text).subscribe(res => {
      console.log(res)
      this.users = res.data
    })
  }

  getArenas(text) {
    this.tournamentSettingsService.getArenas(text).subscribe(res => {
      this.arenas = res
    })
  }

  addModerator() {
    const payload = {
      type: this.moderatorType,
      moderator_slug: this.moderatorName
    }
    console.log([payload])
    this.tournamentSettingsService.addModerator(payload, this.tournamentCode).subscribe((res: any) => {
      this.store.dispatch(new UpdateTournament(res.data , this.tournamentCode , 'add_moderator'))
      this.store.dispatch(new SetNotifications('Success', 'Moderator is added successfully', 'success'));

    }, error => {
      this.store.dispatch(new HandleError(error))
    })
  }

  removeModerator(id, i) {
    this.tournamentSettingsService.deleteModerator(id, this.tournamentCode).subscribe(res => {
      this.moderatorList.splice(i, 1)
      this.store.dispatch(new SetNotifications('Success', 'Moderator is removed successfully', 'success'));

    }, error => {
      this.store.dispatch(new HandleError(error))

    })
  }
  removeSponsor(id, i) {
    this.tournamentSettingsService.deleteSponsor(id, this.tournamentCode).subscribe(res => {
      this.sponsorsList.splice(i, 1)
      this.store.dispatch(new SetNotifications('Success', 'Moderator is removed successfully', 'success'));

    }, error => {
      this.store.dispatch(new HandleError(error))

    })
  }

  getThirdParty() {
    this.getThirdParties$.subscribe(res => {
      this.thirdParties = res
    })
  }
  allowthirdParty(value) {
    if (value) {
      // make operator and service required

      this.TournamentSettingsForm.get('third_party_subscriptions.operator').setValidators([Validators.required])
      this.TournamentSettingsForm.get('third_party_subscriptions.subscription').setValidators([Validators.required])
    } else {
      // remove third_party_subscriptions from TournamentSettingsForm
      console.log(this.TournamentSettingsForm.get('third_party_subscriptions.subscription'))
      console.log(this.TournamentSettingsForm.valid)
      this.TournamentSettingsForm.get('third_party_subscriptions.operator').clearValidators()
      this.TournamentSettingsForm.get('third_party_subscriptions.subscription').clearValidators()
      this.TournamentSettingsForm.get('third_party_subscriptions.operator').updateValueAndValidity()
      this.TournamentSettingsForm.get('third_party_subscriptions.subscription').updateValueAndValidity()
    }
  }

  create() {
    this.TournamentSettingsForm.value.visibility === true ? this.TournamentSettingsForm.controls.visibility.setValue('private') : this.TournamentSettingsForm.controls.visibility.setValue('public')
    this.tournamentProcessService.removeEmptyKeys(this.TournamentSettingsForm.value)
    this.tournamentProcessService.removeEmptyKeys(this.TournamentSettingsForm.value.contact_details)
    if (!this.TournamentSettingsForm.value.allow_third_party) {
      this.TournamentSettingsForm.value.third_party_subscriptions = null
    }
    this.store.dispatch(new UpdateTournament(this.TournamentSettingsForm.value, this.tournamentCode))
  }

  addSponsor() {
    console.log(this.arenaObj)
    const payload = {
      reason: this.sponsorType,
      type: 'BecomeSponsoredRequest',
      requester_type: 'Tournament',
      requester_id: this.tournamentId,
      requestable_id: this.arenaObj.id,
      requestable_type: 'Arena',
    }

    this.tournamentSettingsService.addSponsor(payload).subscribe(res => {
      this.store.dispatch(new SetNotifications('Success', `Your request has been sent successfully`, 'success'));

    }, error => {
      this.store.dispatch(new HandleError(error))
    })
  }
  openDialog(action) {
    this.modalService.create({
      nzTitle: null,
      nzContent: ConfirmationDialogComponent,
      nzData: {
        actionName: action,
        tournamentName: this.tournament.name
      },
      nzClassName: 'confirmation-modal',
      nzFooter: null,
      nzWidth: '400px',
    }).afterClose.subscribe((res) => {

      if (res?.actionName === 'reset_bracket') {
        this.store.dispatch(new ResetTournament(this.tournamentCode))
      }else if (res?.actionName === 'reset_second_stage_bracket'){
        this.store.dispatch(new ResetBracket(this.tournamentCode, 1))
      } else if (res?.actionName === 'delete_tournament') {
        this.store.dispatch(new DeleteTournament(this.tournamentCode))
      } else if (res?.actionName === 'cancel_tournament'){
        this.store.dispatch(new CancelTournament(this.tournamentCode , 'Cancelled'))
      } else if (res?.actionName === 'duplicate_tournament'){
        // tslint:disable-next-line:no-shadowed-variable
        this.tournamentSettingsService.duplicateTournament(this.tournamentCode , {name: res?.tournamentName}).subscribe((res: any) => {
          this.store.dispatch(new SetNotifications('Success', `Tournament is duplicated successfully`, 'success'));
          window.open(`${this.organizerUrl}/tournament/${res.tournament_code}/process/tournament-progress` , '_blank')

        }, error => {
          this.store.dispatch(new HandleError(error))
        })
      }
    })
  }

}
