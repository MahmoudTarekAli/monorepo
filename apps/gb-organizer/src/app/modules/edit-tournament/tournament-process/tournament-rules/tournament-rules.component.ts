import {Component, OnInit} from '@angular/core';
import * as DecoupledEditor from '../../../../../assets/js/ckeditor5-build-decoupled-document/ckeditor.js';
import {UntypedFormArray, UntypedFormBuilder, UntypedFormGroup, Validators} from '@angular/forms'
import {Select, Store} from '@ngxs/store'
import {TournamentProcessState} from '../state/tournament-process.state'
import {Observable} from 'rxjs'
import {UpdateTournament} from '../state/tournament-process.action'
import {TournamentProcessService} from '../services/tournament-process.service'

@Component({
  selector: 'app-tournament-rules',
  templateUrl: './tournament-rules.component.html',
  styleUrls: ['./tournament-rules.component.scss']
})
export class TournamentRulesComponent implements OnInit {
  public Editor = DecoupledEditor;
  TournamentRules: UntypedFormGroup
  tournamentCode
  isSave = false
  @Select(TournamentProcessState.getTournament) getTournament: Observable<any>;

  constructor(private fb: UntypedFormBuilder, private store: Store, private tournamentProcessService: TournamentProcessService) {
    this.TournamentRules = this.fb.group({
      rules: this.fb.group({
        general_rules: ['', Validators.required],
        game_settings: this.fb.array([])
      })
    })
  }

  ngOnInit(): void {
    this.getTournament.subscribe(tournament => {
      this.tournamentCode = tournament.code
      // set general_rules value to tournament.general_rules
      if (tournament?.game) {
        this.TournamentRules.get('rules.general_rules').patchValue(tournament.general_rules)
        // set game_settings value to tournament.game_settings
        if (this.isSave === false) {

          if (tournament.game_settings) {
            tournament.game_settings?.forEach((group, i) => {
              this.addGameSettings();
              console.log(this.game_settings)
              const y = this.game_settings.at(i) as UntypedFormGroup;
              y.patchValue(group);

            })

            this.TournamentRules.get('rules.game_settings').patchValue(tournament.game_settings)
          }
        }
      }

    })
  }

  get game_settings(): UntypedFormArray {
    return this.TournamentRules.get('rules.game_settings') as UntypedFormArray
  }

  addGameSettings() {
    const control = (this.TournamentRules.get('rules.game_settings') as UntypedFormArray)
    control.push(
      this.fb.group({
        key: ['', Validators.required],
        value: ['', Validators.required],
      })
    );
  }

  deleteGameSetting(index: number) {
    this.game_settings.removeAt(index)
  }

  create() {
    this.tournamentProcessService.removeEmptyKeys(this.TournamentRules.value)
    this.isSave = true
    this.store.dispatch(new UpdateTournament(this.TournamentRules.value, this.tournamentCode))
  }

  public onReady(editor) {
    editor.ui.getEditableElement().parentElement.insertBefore(
      editor.ui.view.toolbar.element,
      editor.ui.getEditableElement(),
    );
  }

}
