import {Component, OnDestroy, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SectionComponent} from "../../../components/section/section.component";
import {TimelineCardComponent} from "../timeline-card/timeline-card.component";
import {Select} from "@ngxs/store";
import {TournamentState} from "../../../modules/tournament/state/tournament.state";
import {Observable, Subject, takeUntil} from "rxjs";
import {Tournament} from "../../models/tournament";
import {Timeline, TimeLineKeys, TimelineStatus} from "../../../modules/tournament/models/timeline";
import {JoinTournamentState} from "../../../modules/tournament/state/join-tournament/join-tournament.state";
import {untilDestroyed} from "@ngneat/until-destroy";
import {ButtonComponent} from "../../../components/button/button.component";
import {NgScrollbar} from "ngx-scrollbar";

@Component({
  selector: 'app-timeline',
  standalone: true,
  imports: [CommonModule, SectionComponent, TimelineCardComponent, ButtonComponent, NgScrollbar],
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.scss']
})
export class TimelineComponent implements OnInit, OnDestroy {
  @Select(TournamentState.getTournament) tournament$: Observable<Tournament>;
  @Select(JoinTournamentState.getIsJoinedData) getIsJoinedData$: Observable<any>;
  tournament: Tournament
  timeline: Timeline[] = [
    {
      key: TimeLineKeys.JOINED,
      title: 'Joined',
      status: TimelineStatus.INACTIVE,
      subTitle: '',
      show: true
    },
    {
      key: TimeLineKeys.COMPLETE_TEAM,
      title: 'Complete Your Team',
      status: TimelineStatus.INACTIVE,
      subTitle: '',
      show: false
    },
    {
      key: TimeLineKeys.APPROVED,
      title: 'Approved',
      status: TimelineStatus.INACTIVE,
      subTitle: '',
      show: false

    },
    {
      key: TimeLineKeys.CHECK_IN,
      title: 'CheckIn',
      status: TimelineStatus.INACTIVE,
      subTitle: '',
      show: false

    },
    {
      key: TimeLineKeys.TOURNAMENT_STARTS,
      title: 'Tournament Starts',
      status: TimelineStatus.INACTIVE,
      subTitle: '',
      show: true

    },
    {
      key: TimeLineKeys.FINISHED,
      title: 'Finished',
      status: TimelineStatus.INACTIVE,
      subTitle: '',
      show: true
    },
  ]
  private ngUnsubscribe = new Subject<void>();

  constructor() {
  }

  ngOnInit() {
    this.tournament$.pipe(takeUntil(this.ngUnsubscribe)).subscribe(tournament => {
      this.tournament = tournament
    })
    this.isUserJoined()
    this.isCompleteYourTeam()
    this.isApproved()
    this.isCheckIn()
    this.isTournamentStart()
    this.isFinished()
  }

  getVisibleIndex(index: number): number {
    let visibleIndex = 0;
    for (let i = 0; i <= index; i++) {
      if (this.timeline[i].show) {
        visibleIndex++;
      }
    }
    return visibleIndex;
  }

  isUserJoined() {
    const joinedIndex = this.timeline.findIndex(item => item.key === TimeLineKeys.JOINED);
    if (joinedIndex !== -1) {
      this.getIsJoinedData$.subscribe(isJoined => {
        if (isJoined.is_joined) {
          this.timeline[joinedIndex].status = TimelineStatus.COMPLETED;
        } else {
          this.timeline[joinedIndex].status = TimelineStatus.INACTIVE;
        }
      })
    }
  }

  isCompleteYourTeam() {
    const joinedIndex = this.timeline.findIndex(item => item.key === TimeLineKeys.COMPLETE_TEAM);
    if (joinedIndex !== -1) {
      if (this.tournament.participants_type === 'teams') {
        this.timeline[joinedIndex].show = true
        this.getIsJoinedData$.subscribe(isJoined => {
          if (isJoined.members_count >= this.tournament.no_of_participants_per_team) {
            this.timeline[joinedIndex].status = TimelineStatus.COMPLETED;
          } else {
            this.timeline[joinedIndex].status = TimelineStatus.INACTIVE;
          }
        })

      }
    }

  }

  isApproved() {
    const joinedIndex = this.timeline.findIndex(item => item.key === TimeLineKeys.APPROVED);
    if (joinedIndex !== -1) {
      if (this.tournament.join_privacy === 'confirmation') {
        this.timeline[joinedIndex].show = true
        this.getIsJoinedData$.subscribe(isJoined => {
          if (isJoined.status === 1) {
            this.timeline[joinedIndex].status = TimelineStatus.COMPLETED;
          } else {
            this.timeline[joinedIndex].status = TimelineStatus.INACTIVE;
          }
        })
      }
    }
  }

  isCheckIn() {
    const joinedIndex = this.timeline.findIndex(item => item.key === TimeLineKeys.CHECK_IN);
    if (joinedIndex !== -1) {
      if (this.tournament.participants_must_check_in) {
        this.timeline[joinedIndex].show = true
        this.getIsJoinedData$.subscribe(isJoined => {
          if (isJoined.has_checked_in) {
            this.timeline[joinedIndex].status = TimelineStatus.COMPLETED;
          } else {
            this.timeline[joinedIndex].status = TimelineStatus.INACTIVE;
          }
        })
      }
    }
  }

  isTournamentStart() {
    const joinedIndex = this.timeline.findIndex(item => item.key === TimeLineKeys.TOURNAMENT_STARTS);
    if (joinedIndex !== -1) {
      if (this.tournament.has_started) {
        this.timeline[joinedIndex].status = TimelineStatus.COMPLETED;
      }
    }
  }

  isFinished() {
    const joinedIndex = this.timeline.findIndex(item => item.key === TimeLineKeys.FINISHED);
    this.timeline[joinedIndex].show = true;
    if (joinedIndex !== -1) {
      if (this.tournament.status === 'Finished') {
        this.timeline[joinedIndex].status = TimelineStatus.COMPLETED;
      }
    }
  }


  ngOnDestroy() {
    this.ngUnsubscribe.next()
    this.ngUnsubscribe.complete()
  }

}
