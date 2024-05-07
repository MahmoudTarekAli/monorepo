import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {GlobalService} from "../../../../../shared/service/global.service";
import {NzDividerModule} from "ng-zorro-antd/divider";

@Component({
  selector: 'app-prizes-playgrounds',
  standalone: true,
  imports: [CommonModule, NzDividerModule],
  templateUrl: './prizes-playgrounds.component.html',
  styleUrls: ['./prizes-playgrounds.component.scss']
})
export class PrizesPlaygroundsComponent {

  prizesCategories = []
  constructor(public globalService: GlobalService) {
  }

  ngOnInit(): void {
    if (this.globalService.selectedGame === 'league-of-legends'){
      this.prizesCategories = [
        {gameName:'League Of Legends' , name: 'Elite Prizes' , prizes: [{rank: '1st', prize: '$2000'}, {rank: '2nd', prize: '$1500'}, {rank: '3rd', prize: '$1000'}]},
        {name: 'Contenders Prizes' , prizes: [{rank: '1st', prize: '$500'}, {rank: '2nd', prize: '569,178' , icon: 'true'}, {rank: '3rd', prize: '379,452', icon: 'true'}, {rank: '4th', prize: '379,452', icon: 'true'}, {rank: 'Giveaways', prize: '758,904', icon: 'true'}]},
        {name: 'Raising Stars Prizes' , prizes: [{rank: '1st', prize: '758,898', icon: 'true'}, {rank: '2nd', prize: '569,178', icon: 'true'}, {rank: '3rd', prize: '379,452', icon: 'true'}, {rank: '4th', prize: '379,452', icon: 'true'}, {rank: 'Giveaways', prize: '758,904', icon: 'true'}]}
      ]
    } else if (this.globalService.selectedGame === 'valorant'){
      this.prizesCategories = [
        {gameName:'Valorant (NA/Levant)', name: 'Elite Prizes' , prizes: [{rank: '1st', prize: '$2000'}, {rank: '2nd', prize: '$1500'}, {rank: '3rd', prize: '$1000'}]},
        {name: 'Contenders Prizes' , prizes: [{rank: '1st', prize: '$500'}, {rank: '2nd', prize: '1,008,000' , icon: 'true'}, {rank: '3rd', prize: '504,000', icon: 'true'}, {rank: '4th', prize: '504,000', icon: 'true'}, {rank: 'Giveaways', prize: '1,008,000 ', icon: 'true'}]},
        {name: 'Raising Stars Prizes' , prizes: [{rank: '1st', prize: '1,512,000', icon: 'true'}, {rank: '2nd', prize: '1,008,000', icon: 'true'}, {rank: '3rd', prize: '504,000', icon: 'true'}, {rank: '4th', prize: '504,000', icon: 'true'}, {rank: 'Giveaways', prize: '1,008,000', icon: 'true'}]},
        {gameName:'VALORANT (GCC)',name: 'Elite Prizes' , prizes: [{rank: '1st', prize: '$2000'}, {rank: '2nd', prize: '$1500'}, {rank: '3rd', prize: '$1000'}]},
        {name: 'Contenders Prizes' , prizes: [{rank: '1st', prize: '$500'}, {rank: '2nd', prize: '1,008,000' , icon: 'true'}, {rank: '3rd', prize: '504,000', icon: 'true'}, {rank: '4th', prize: '504,000', icon: 'true'}, {rank: 'Giveaways', prize: '1,008,000 ', icon: 'true'}]},
        {name: 'Raising Stars Prizes' , prizes: [{rank: '1st', prize: '1,512,000', icon: 'true'}, {rank: '2nd', prize: '1,008,000', icon: 'true'}, {rank: '3rd', prize: '504,000', icon: 'true'}, {rank: '4th', prize: '504,000', icon: 'true'}, {rank: 'Giveaways', prize: '1,008,000', icon: 'true'}]},

      ]
    }
  }
}
