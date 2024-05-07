import { Component, OnInit } from '@angular/core';
import {TournamentBracketService} from "../service/tournament-bracket.service";
import {ActivatedRoute, Router} from "@angular/router";
import {Store} from "@ngxs/store";
import {UpdateTournament} from "../../state/tournament-process.action";
import {TOURNAMENT_UPDATE_TYPE} from "../../../../../core/tournament.enum";
import {SharedService} from "../../../service/shared.service";
import {HandleError, SetNotifications} from "../../../../../shared/state/global.action";

@Component({
  selector: 'app-view-bracket-template',
  templateUrl: './view-bracket-template.component.html',
  styleUrls: ['./view-bracket-template.component.scss']
})
export class ViewBracketTemplateComponent implements OnInit {
  bracketTemplates = [] ;
  type;
  stage
  stageType
  choosenTemplate = '';
  rankPoints = []
  statusSelected = ''
  routeType
  constructor(private tournamentBracketService: TournamentBracketService , private activatedRoute: ActivatedRoute ,  private router: Router ,
              private store: Store , private sharedService: SharedService) {
    this.stage = activatedRoute.snapshot.queryParams?.stage
    this.stageType = activatedRoute.snapshot.queryParams?.stageType
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      console.log(params)
      this.routeType = params.type
      this.type = params.type === 'free-for-all' ? 'free_for_all' : 'round_robin' ;

    })

    this.tournamentBracketService.getBracketSettings(this.type).subscribe(data => {
      this.bracketTemplates = data;
    })
  }
  changeStatus(status){
    this.tournamentBracketService.getBracketSettings(this.type , status).subscribe(data => {
      this.bracketTemplates = data;
    })
  }
  saveTemplate(){
    console.log( this.bracketTemplates[this.choosenTemplate].settings)
    if(this.bracketTemplates[this.choosenTemplate].settings?.rank_points?.length > 0) {
      this.getStageRankPoints()
    }
    console.log( this.bracketTemplates[this.choosenTemplate].settings)
    const template = {...this.bracketTemplates[this.choosenTemplate].settings}

    if (template?.rank_points?.length > 0) {
      template.rank_points = Array.from(this.rankPoints, item => item || 0)
    }
    const payload = {
      [this.stage]: this.stageType,
      group_settings: template
    }
    this.tournamentBracketService.updateBracket(payload, this.sharedService.tournamentCode).subscribe(bracket => {
      console.log(bracket)
      this.store.dispatch(new UpdateTournament(bracket.data, this.sharedService.tournamentCode, TOURNAMENT_UPDATE_TYPE.BRACKET_TOURNAMENT_UPDATE))
      this.router.navigate(['tournament/' + this.sharedService.tournamentCode + '/process/tournament-bracket/bracketType/' + this.routeType ] , {queryParams: {stage: this.stage , stageType: this.stageType}})
    }, error => {
      this.store.dispatch(new HandleError(error))
    })
  }
  removeTemplate(index , id){
    const temp = [...this.bracketTemplates]
    this.bracketTemplates.splice(index , 1);

    this.tournamentBracketService.deleteBracketSetting(id).subscribe(data => {
    this.store.dispatch(new SetNotifications('Success', 'Bracket Template Deleted Successfully' , 'success'))
    if (index === this.choosenTemplate){
        this.choosenTemplate = ''
      }
    }, error => {
      this.bracketTemplates = temp;
      this.store.dispatch(new HandleError(error))
    })
  }
  getStageRankPoints() {
    const templates =  this.bracketTemplates[this.choosenTemplate].settings.rank_points
    templates.forEach((rank, index) => {
      for (let Rank = parseInt(rank.fromRank); Rank <= parseInt(rank.toRank); Rank++) {
        const tempRank = {};
        tempRank[Rank - 1] = parseInt(rank.points);
        this.rankPoints = Object.assign(this.rankPoints, tempRank);
      }
      if (this.rankPoints.length > rank.toRank) {
        this.rankPoints.splice(rank.toRank, this.rankPoints.length - rank.toRank)
      }
      console.log(this.rankPoints)
    });
  }
}
