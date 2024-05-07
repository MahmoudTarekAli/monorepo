import {Component, Input, OnInit} from '@angular/core';
import {NzModalRef, NzModalService} from "ng-zorro-antd/modal";

@Component({
  selector: 'app-confirmation-dialog',
  templateUrl: './confirmation-dialog.component.html',
  styleUrls: ['./confirmation-dialog.component.scss']
})
export class ConfirmationDialogComponent implements OnInit {
  @Input() message: string;
  @Input() actionName;
  @Input() tournamentName;
  isCorrectTournamentName = false
  dubTournamentName = ''
  constructor(private modal: NzModalRef, private modalService: NzModalService) { }

  ngOnInit(): void {
    // this.dubTournamentName = this.tournamentName
  }
  closeDialog(value) {
    this.modal.close(value);
  }
  validateTournamentNameSpelling(event) {
    console.log(this.isCorrectTournamentName , event)
    if (this.actionName === 'duplicate_tournament'){
      this.isCorrectTournamentName = this.dubTournamentName !== this.tournamentName;
      console.log(this.isCorrectTournamentName)

    }else{
      this.isCorrectTournamentName = event.target.value === this.tournamentName;

    }
  }

}
