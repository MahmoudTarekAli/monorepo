import {Component, Input, OnInit} from '@angular/core';
import {NzModalRef} from "ng-zorro-antd/modal";
import {ManageTournamentService} from "../../services/manage-tournament.service";
import {SharedService} from "../../../service/shared.service";
import * as DecoupledEditor from '../../../../../../assets/js/ckeditor5-build-decoupled-document/ckeditor.js';
import {Actions, ofActionSuccessful, Store} from "@ngxs/store";
import {SendMessage} from "../../participants/state/participants.action";
import {AngularEditorConfig} from "@kolkov/angular-editor";

@Component({
  selector: 'app-send-message',
  templateUrl: './send-message.component.html',
  styleUrls: ['./send-message.component.scss']
})
export class SendMessageComponent implements OnInit {
  @Input() participants;
  message = ''
  public Editor = DecoupledEditor;
  participantIdList = []
  copyParticipantList = []

  constructor(private modal: NzModalRef, private manangeTournamentService: ManageTournamentService, private actions$: Actions,
              private sharedService: SharedService, private store: Store) {
  }

  ngOnInit(): void {
    console.log(this.participants)
    this.copyParticipantList = this.participants
    this.participantIdList = this.participants.map(data => data?.original?.id)
  }

  sendMessage(message) {
    // tslint:disable-next-line:no-shadowed-variable
    const data = this.copyParticipantList.map(data => data?.original?.id)
    const payload = {
      data: {
        author: 'user',
        message,
        tournament_code: this.sharedService.tournamentCode,
        type: 'tournament_message',
        user_ids: data
      }
    }
    console.log(payload)
    this.store.dispatch(new SendMessage(this.sharedService.tournamentCode, payload))
    this.actions$.pipe(ofActionSuccessful(SendMessage)).subscribe(() => this.destroyModal());

  }

  onClose(participant) {
    this.participants = this.participants.filter(x => x.participant_id !== participant.participant_id)

  }

  destroyModal(): void {
    this.modal.destroy();
  }

  public onReady(editor) {
    editor.ui.getEditableElement().parentElement.insertBefore(
      editor.ui.view.toolbar.element,
      editor.ui.getEditableElement(),
    );
  }
  changeSelect(event){
    this.copyParticipantList = this.participants.filter(x => event.includes(x?.original?.id))
    console.log(event)
  }
}
