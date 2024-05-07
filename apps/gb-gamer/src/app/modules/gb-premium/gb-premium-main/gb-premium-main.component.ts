import {Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import {ButtonComponent} from "../../../components/button/button.component";
import {environment} from "../../../../environments/environment";
import {NzButtonModule} from "ng-zorro-antd/button";
import {FaqComponent} from "../../arena/custom-arenas/etisalat-arena/modals/faq/faq.component";
import {
  FaqPlaygroundsComponent
} from "../../custom-events/playgrounds/playground-game/faq-playgrounds/faq-playgrounds.component";
import {TranslateModule} from "@ngx-translate/core";

@Component({
  selector: 'app-gb-premium-main',
  standalone: true,
    imports: [CommonModule, ButtonComponent, NzButtonModule, FaqComponent, FaqPlaygroundsComponent, TranslateModule],
  templateUrl: './gb-premium-main.component.html',
  styleUrls: ['./gb-premium-main.component.scss']
})
export class GbPremiumMainComponent implements OnInit{
  environment = environment;
  tournamentQuestion = [
    {question: 'premium.premiumQuestionOne', answer: 'premium.premiumAnswerOne'},
    {question: 'premium.premiumQuestionTwo', answer: 'premium.premiumAnswerTwo'},
    {question: 'premium.premiumQuestionThree', answer: 'premium.premiumAnswerThree'},
    {question: 'premium.premiumQuestionFour', answer: 'premium.premiumAnswerFour'},

  ]
constructor() {
}
ngOnInit() {
}
}
