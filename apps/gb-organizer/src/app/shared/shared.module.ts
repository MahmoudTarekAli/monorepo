import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {AntdModule} from './antd.module';
import {TranslateModule} from '@ngx-translate/core';
import {IsViewerDirective} from "./isViewer.directive";
import {TimeDifferencePipe} from "./pipes/time-difference.pipe";
import {DefaultImagePipe} from "./pipes/default-image.pipe";
import {SectionContainerComponent} from "./components/section-container/section-container.component";
import {NzSpaceModule} from 'ng-zorro-antd/space'
import {MatchListContainerComponent} from "./components/match-list-container/match-list-container.component";
import {TruncatePipe} from "./pipes/truncate.pipe";
import {
  ReactBracketViewWrapperComponent,
} from "./components/my-react-component/react-bracket-view-wrapper";
import {FilterPipe} from "./pipes/filter.pipe";
import {NoResultComponent} from "./components/no-result/no-result.component";
import {LottieModule} from "ngx-lottie";
import {NzAffixModule} from "ng-zorro-antd/affix";
import {StopPropagationDirective} from "./directives/stop-propagation.directive";
import {CountryPipe} from "./pipes/country.pipe";
import {MatchesPipe} from "./pipes/matches.pipe";
import {ConfirmationDialogComponent} from "./dialogs/confirmation-dialog/confirmation-dialog.component";
import {FormsModule} from "@angular/forms";
import {HideReportIssueButtonDirective} from "./directives/hide-report-issue-button.directive";
import {MarqueeDirective} from "./directives/marquee.directive";
import {MarqueeComponent} from "./components/marquee/marquee.component";
import {ShowHideRoundsPipe} from "./pipes/show-hide-rounds.pipe";
import {UploadPhotosComponent} from "./components/upload-photos/upload-photos.component";
import {ImageCropperModule} from "ngx-image-cropper";
import {ParticipantSortPipe} from "./pipes/participant-sort.pipe";
import {IsSuperAdminDirective} from "./directives/is-super-admin.directive";
import {ProductionServerAlertComponent} from "./components/production-server-alert/production-server-alert.component";
import {NzAlertModule} from "ng-zorro-antd/alert";

const MODULES = [CommonModule, RouterModule, AntdModule, TranslateModule];

@NgModule({
  imports: [...MODULES, NzSpaceModule, LottieModule, NzAffixModule, FormsModule, ImageCropperModule, NzAlertModule],
  declarations: [IsViewerDirective, TimeDifferencePipe, FilterPipe, MatchesPipe, MarqueeComponent, ProductionServerAlertComponent, ParticipantSortPipe, ShowHideRoundsPipe, MarqueeDirective, CountryPipe, NoResultComponent, ReactBracketViewWrapperComponent, DefaultImagePipe, TruncatePipe, SectionContainerComponent, MatchListContainerComponent, StopPropagationDirective, ConfirmationDialogComponent, HideReportIssueButtonDirective, IsSuperAdminDirective, UploadPhotosComponent],
  exports: [...MODULES, IsViewerDirective, TimeDifferencePipe, MatchesPipe, FilterPipe, ParticipantSortPipe, MarqueeComponent, MarqueeDirective, ShowHideRoundsPipe, CountryPipe, NoResultComponent, ReactBracketViewWrapperComponent, TruncatePipe, DefaultImagePipe, SectionContainerComponent, MatchListContainerComponent, StopPropagationDirective, ConfirmationDialogComponent, HideReportIssueButtonDirective, IsSuperAdminDirective, UploadPhotosComponent, ProductionServerAlertComponent
  ],

})
export class SharedModule {
}
