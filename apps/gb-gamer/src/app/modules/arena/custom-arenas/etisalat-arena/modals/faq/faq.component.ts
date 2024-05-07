import {Component, Input} from '@angular/core';
import { CommonModule } from '@angular/common';
import {NzCollapseModule} from "ng-zorro-antd/collapse";
import {TranslateModule} from "@ngx-translate/core";

@Component({
  selector: 'app-faq',
  standalone: true,
  imports: [CommonModule, NzCollapseModule, TranslateModule],
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.scss']
})
export class FaqComponent {
  @Input() tournamentQuestion = [
    {question: 'question_one', answer: 'answer_one'},
    {question: 'question_two', answer: 'answer_two'},
    {question: 'question_three', answer: 'answer_three'},
    {question: 'question_four', answer: 'answer_four'},
    {question: 'question_five', answer: 'answer_five'},
    {question: 'question_six', answer: 'answer_six'},
    {question: 'question_seven', answer: 'answer_seven'},
    {question: 'question_eight', answer: 'answer_eight'},
    {question: 'question_nine', answer: 'answer_nine'},
    {question: 'question_ten', answer: 'answer_ten'},
  ]}
