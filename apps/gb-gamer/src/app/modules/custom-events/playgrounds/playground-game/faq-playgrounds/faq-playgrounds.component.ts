import {Component, Input} from '@angular/core';
import { CommonModule } from '@angular/common';
import {FaqComponent} from "../../../../arena/custom-arenas/etisalat-arena/modals/faq/faq.component";
import {NzCollapseModule} from "ng-zorro-antd/collapse";
import {TranslateModule} from "@ngx-translate/core";

@Component({
  selector: 'app-faq-playgrounds',
  standalone: true,
  imports: [CommonModule, FaqComponent, NzCollapseModule, TranslateModule],
  templateUrl: './faq-playgrounds.component.html',
  styleUrls: ['./faq-playgrounds.component.scss']
})
export class FaqPlaygroundsComponent {
  @Input() isTitle = true
  @Input() tournamentQuestion = [
    {question: 'playgrounds_question_one', answer: 'playgrounds_answer_one'},
    {question: 'playgrounds_question_two', answer: 'playgrounds_answer_two'},
    {question: 'playgrounds_question_three', answer: 'playgrounds_answer_three'},
    {question: 'playgrounds_question_four', answer: 'playgrounds_answer_four'},
    {question: 'playgrounds_question_five', answer: 'playgrounds_answer_five'},
    {question: 'playgrounds_question_six', answer: 'playgrounds_answer_six'},
    {question: 'playgrounds_question_seven', answer: 'playgrounds_answer_seven'},
    {question: 'playgrounds_question_eight', answer: 'playgrounds_answer_eight'},
    {question: 'playgrounds_question_nine', answer: 'playgrounds_answer_nine'},
    {question: 'playgrounds_question_ten', answer: 'playgrounds_answer_ten'},
  ]
}
