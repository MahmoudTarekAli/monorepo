import { Component, OnInit } from '@angular/core';
import {environment} from "../../../../environments/environment";

@Component({
  selector: 'app-share-modal',
  templateUrl: './share-modal.component.html',
  styleUrls: ['./share-modal.component.scss']
})
export class ShareModalComponent implements OnInit {
  tournamentCode;
  shareLink
  constructor() { }

  ngOnInit(): void {
    console.log(this.tournamentCode)
    this.shareLink = environment.production ? `www.gbarena.com/tournaments/${this.tournamentCode}/summary` : `staging.gbarena.com/tournaments/${this.tournamentCode}/summary`
  }

}
