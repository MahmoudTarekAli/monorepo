import {Component, OnInit} from '@angular/core'
import {UntypedFormArray, UntypedFormBuilder, FormControl, UntypedFormGroup, Validators} from '@angular/forms'
import {Select, Store} from '@ngxs/store'
import {TournamentProcessState} from '../state/tournament-process.state'
import {Observable} from 'rxjs'
import {TournamentProcessService} from '../services/tournament-process.service'
import {UpdateTournament} from '../state/tournament-process.action'
import {TOURNAMENT_UPDATE_TYPE} from '../../../../core/tournament.enum'

@Component({
  selector: 'app-participants',
  templateUrl: './participants.component.html',
  styleUrls: ['./participants.component.scss'],
})
export class ParticipantsComponent implements OnInit {
  participantForm: UntypedFormGroup
  accept_particpant = false
  isCheckin = false
  requiredInputs
  control: any
  selectedRequiredInputs = []
  teamSelectedRequiredInputs = []
  tournamentCode: string
  @Select(TournamentProcessState.getTournament) getTournament: Observable<any>
  isSave = false
  loadingRequiredInfo = false
  tournament: any

  constructor(private fb: UntypedFormBuilder, private tournamentProcessService: TournamentProcessService, private store: Store) {
    // allow_pending_check_in: [true],

      this.participantForm = this.fb.group({
      join_privacy: [],
      show_pending: [false],
      check_in_margin: ['', [Validators.required]],
      show_flags: [false, [Validators.required]],
      show_rules: [false],
      participants_must_check_in: [false],
      team_member_supported_required_inputs_keys: fb.array([]),
      supportedRequiredInputsKeys: fb.array([]),
      team_edit_open: [false],
      pending_message: ['']
    })
  }

  get RequiredInputs() {
    return this.participantForm.get('supportedRequiredInputsKeys') as UntypedFormArray
  }

  ngOnInit(): void {

    this.getTournament.subscribe(tournament => {
      this.tournament = tournament
      this.tournamentCode = tournament?.code
      if (tournament?.game) {
          if (tournament?.join_privacy && tournament?.join_privacy === 'confirmation') {
            this.accept_particpant = true;
          }
          if (tournament?.participants_must_check_in  == true) {
            this.isCheckin = true;
          }
          if (this.isSave === false) {
            // patchValue tournament to form
            this.participantForm.patchValue(tournament)
            this.loadingRequiredInfo = true
            this.tournamentProcessService.getRequiredInputs(tournament?.game?.data?.id, tournament?.platformSlug, 'for_user' , this.tournamentCode).subscribe(res => {
              const requiredInputs = res
              this.loadingRequiredInfo = false

              requiredInputs.forEach(input => {
                // check if input exist in supportedRequiredInputsKeys array
                const index = tournament?.supportedRequiredInputsKeys?.findIndex(supportedInput => supportedInput.key === input.key)
                if (index !== -1) {
                  input.is_selected = true
                  this.addRequiredInputs('supportedRequiredInputsKeys', input)
                }
                if (index === -1) {
                  input.is_selected = false
                  this.addRequiredInputs('supportedRequiredInputsKeys', input)
                }
                // check if participant type is team and if it is add input to team_member_supported_required_inputs_keys
                if (tournament?.participants_type === 'team') {
                  const teamIndex = tournament?.team_member_supported_required_inputs_keys?.findIndex(supportedInput => supportedInput.key === input.key)
                  if (teamIndex !== -1) {
                    input.is_team_selected = true
                    this.addRequiredInputs('team_member_supported_required_inputs_keys', input)
                  }
                  if (teamIndex === -1) {
                    input.is_team_selected = false
                    this.addRequiredInputs('team_member_supported_required_inputs_keys', input)
                  }
                }
              })
              this.getRequiredValue()
            })
            if (tournament?.participants_type === 'teams') {

              this.tournamentProcessService.getRequiredInputs(tournament?.game?.data?.id, tournament?.platformSlug, 'for_team' ,  this.tournamentCode).subscribe(res => {
                const teamRequiredInputs = res
                teamRequiredInputs.forEach(input => {
                  const index2 = tournament?.teamMembersSupportedRequiredInputsKeys?.findIndex(supportedInput => supportedInput.key === input.key)
                  if (index2 !== -1) {
                    input.is_team_selected = true
                    this.addRequiredInputs('team_member_supported_required_inputs_keys', input)
                  }
                  if (index2 === -1) {
                    input.is_team_selected = false
                    this.addRequiredInputs('team_member_supported_required_inputs_keys', input)
                  }
                })
                this.getRequiredTeamValue()

              })
            }

          }
        }
      },
    )
  }

  getRequiredValue() {
    this.selectedRequiredInputs = this.participantForm.value.supportedRequiredInputsKeys.filter(input => input.is_selected === true).map(input => input.key)
  }

  getRequiredTeamValue() {
    this.teamSelectedRequiredInputs = this.participantForm.value.team_member_supported_required_inputs_keys.filter(input => input.is_team_selected === true).map(input => input.key)

  }

  addRequiredInputs(formControl, payload) {
    this.control = this.participantForm.get([formControl]) as UntypedFormArray
    this.control.push(this.fb.group(payload))
    // return this.control;
  }


  create() {
    if (this.accept_particpant){
      this.participantForm.value.join_privacy = 'confirmation'
    } else {
      this.participantForm.value.join_privacy = 'public'
    }
    // console.log(this.participantForm.value.supportedRequiredInputsKeys)
    if (this.isCheckin) {
      this.participantForm.value.participants_must_check_in = true
    } else {
      this.participantForm.value.participants_must_check_in = false
    }
    this.participantForm.value.supportedRequiredInputsKeys = this.selectedRequiredInputs
    this.participantForm.value.team_member_supported_required_inputs_keys = this.teamSelectedRequiredInputs
    Object.keys(this.participantForm.value).forEach(key => {
      if (this.participantForm.value[key] === '' || this.participantForm.value[key] === null) {
        delete this.participantForm.value[key]
      }
    })
    this.isSave = true
    this.store.dispatch(new UpdateTournament(this.participantForm.value, this.tournamentCode))
  }

  setFormGroup() {

    console.log(this.participantForm)
  }

}
