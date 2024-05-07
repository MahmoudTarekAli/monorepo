import {Component, Input, OnChanges, OnInit, SimpleChanges, TemplateRef, ViewChild} from '@angular/core';
import {AngularFirestore,} from '@angular/fire/compat/firestore';
import {AngularFireFunctions} from "@angular/fire/compat/functions";
import {Actions, ofActionErrored, ofActionSuccessful, Select, Store} from "@ngxs/store";
import {Observable} from "rxjs";
import {IPageInfo, VirtualScrollerComponent} from "ngx-virtual-scroller";
import {ActivatedRoute, Router} from "@angular/router";
import {take} from "rxjs/operators";
import {FormGroup} from "@angular/forms";
import {NzModalService} from "ng-zorro-antd/modal";
import {GetMatch, UpdateMatchScore} from "../../edit-tournament/manage-tournaments/match-list/state/match-list.action";
import {MatchListService} from "../../edit-tournament/manage-tournaments/match-list/services/match-list.service";
import {SetScoreComponent} from "../../edit-tournament/manage-tournaments/match-list/set-score/set-score.component";
import {HandleError, SetNotifications} from "../../../shared/state/global.action";
import {MatchListState} from "../../edit-tournament/manage-tournaments/match-list/state/match-list.state";
import {TournamentProcessState} from "../../edit-tournament/tournament-process/state/tournament-process.state";
import {AuthenticationState} from "../../authentication/state/authentication.state";
import {GlobalService} from "../../../shared/services/global.service";
import {ActionsExecuting, hasActionsExecuting} from "@ngxs-labs/actions-executing";

import {AngularFireAuth} from "@angular/fire/compat/auth";
import {TeamViewComponent} from "../../../shared/components/team-view/team-view.component";
import {NzDrawerService} from "ng-zorro-antd/drawer";

@Component({
  selector: 'app-match-chat',
  templateUrl: './match-chat.component.html',
  styleUrls: ['./match-chat.component.scss']
})
export class MatchChatComponent implements OnInit{
  conversations = []
  Limitconversations = []
  message: any = null;
  lastMessage: any;
  isMobileView: any;
  @Input() match: any;
  @Select(AuthenticationState.getAuth) getUser: Observable<any>;
  id: string;
  @ViewChild(VirtualScrollerComponent)
  private virtualScroller: VirtualScrollerComponent;
  @Select(MatchListState.getSelectedMatch) getSelectedMatch: Observable<any>;
  @Select(MatchListState.getSelectedTournament) getSelectedTournament$: Observable<any>;
  @Select(MatchListState.getErrorMatch) getErrorMatch: Observable<any>;
  @ViewChild('file1Input') file1Input;
  @Select(TournamentProcessState.getTournament) getTournament$: Observable<any>;
  @Select(hasActionsExecuting([GetMatch])) getMatchIsExecuting$: Observable<ActionsExecuting>

  loading: boolean
  isFirstTimeMessage = true
  isVisible = false
  issueDescription = ''
  conversationsId = ''
  form: FormGroup;
  imageSrcs = [];
  files = [];
  tournamentCode: string
  isMatchVisible = false
  tournament
  matchDrawer
  private chatLoading: boolean;
  @ViewChild('drawerFooter', {static: true}) drawerFooter: TemplateRef<any>;
  @ViewChild('drawerTitle', {static: true}) drawerTitle: TemplateRef<any>;

  constructor(public afs: AngularFirestore, private drawerService: NzDrawerService, public afAuth: AngularFireAuth,
              private modalService: NzModalService, private router: Router, public fns: AngularFireFunctions, private activatedRoute: ActivatedRoute, private store: Store,
              private matchListService: MatchListService, private actions$: Actions, private globalService: GlobalService) {
    this.form = new FormGroup({});

  }

  ngOnInit(): void {
    this.createUser();
    this.conversationsId = this.activatedRoute.snapshot.params.id
    this.isMatchVisible = true
    this.store.dispatch(new GetMatch(this.conversationsId))

    this.actions$.pipe(ofActionSuccessful(GetMatch)).subscribe(res => {
      this.getSelectedMatch.subscribe(res => {
        console.log(res)
        this.match = res
        this.tournamentCode = this.match.tournament_code
        this.getMessages(this.conversationsId)
      })
      this.getSelectedTournament$.subscribe(res => {
        if (res) {
          this.tournament = res
        }
      })
    })

    this.actions$.pipe(ofActionErrored(GetMatch)).subscribe(res => {
      this.isMatchVisible = false
    })
    this.actions$.pipe(ofActionSuccessful(UpdateMatchScore)).subscribe(res => {
      this.globalService.matchScore$.pipe(take(1)).subscribe(score => {
        if (score) {
          this.match.home.score = score.score_home
          this.match.away.score = score.score_away
        }
      })

    })

    this.store.select(state => state.setting).subscribe(data => {
      const state = data.setting;
      this.isMobileView = state.isMobileView;
    });

  }


  getMessages(matchCode) {
    this.afs.collection('message').doc(matchCode).collection('messages').ref.orderBy('created_at').limitToLast(100).onSnapshot(res => {
      console.log(res.docs[0])
      this.lastMessage = res.docs[0]
      res.docChanges().forEach((doc, index) => {
        if (doc.type === 'added') {
          this.getUserData(doc.doc.data().sender, index, doc.doc.data())

          this.focusOnAnItem()
          console.log(doc.doc.data())
        }
      })
      this.chatLoading = false
    }, (error) => {
      this.chatLoading = false
    })
  }

  getMoreMessages(event: IPageInfo, match) {
    if (event.startIndex === 1) {
      const oldLength = this.conversations.length
      this.loading = true
      this.afs.collection('message').doc(match.match_code).collection('messages').ref.orderBy('created_at').endBefore(this.lastMessage).limitToLast(100).onSnapshot(res => {
        this.lastMessage = res.docs[0]
        if (res.docs.length > 0) {
          res.docChanges().forEach((doc, index) => {
            if (doc.type === 'added') {
              this.conversations.unshift({...doc.doc.data(), id: doc.doc.id})
              this.conversations.sort((a, b) => a.created_at - b.created_at)
              this.conversations = this.conversations.filter((t, index, self) => index === self.findIndex((t1) => (t1.id === t.id)))
              this.getUserData(doc.doc.data().sender, index, doc.doc.data())

              this.loading = false
            }
          })
          if (this.virtualScroller) {
            this.virtualScroller.scrollToIndex(this.conversations.length - oldLength, true, 0, 0);

          }
        }
      })
    }


  }

  focusOnAnItem() {
    this.virtualScroller.scrollToIndex(this.conversations.length - 1);
  }

  sendMessage(message) {
    console.log(this.match)
    const data = this.fns.httpsCallable('sendMessage');
    data({
      authorization: 'Bearer ' + localStorage.getItem('token'),
      type: 'match',
      author: 'user',
      message,
      group_id: this.match.code,
    }).subscribe(res => {
      this.message = ''
      this.focusOnAnItem()
    }, err => {
    });
  }

  getUserData(id: string, index: number, data: any) {
    let participant = this.getParticipant(id);


    const avatar = participant?.avatar;
    let username = participant?.username;

    if (this.match.participants_type === 'teams') {
      if (participant?.original?.participant_name) {
        username = participant?.original?.participant_name + ' - (' + participant?.members?.find(member => member.id === id)?.username + ')';
      }
    }

    this.conversations.push({...data, id: data.id, avatar, username});
    this.conversations.sort((a, b) => a.created_at - b.created_at);

  }

  getParticipant(id: string) {
    if (this.match.participants_type === 'single') {
      if (this.match?.away?.participant_id === id) {
        return this.match.away;
      } else if (this.match?.home?.participant_id === id) {
        return this.match.home;
      }
    } else if (this.match.participants_type === 'teams') {
      if (this.match?.away?.members.find(member => member.id === id)) {
        return this.match.away;
      } else if (this.match?.home?.members?.find(member => member.id === id)) {
        return this.match.home;
      }
    }
    return null;
  }


  openReportIssueModal() {
    this.isVisible = true;
  }

  handleCancel() {
    this.files = []
    this.imageSrcs = []
    this.isVisible = false;
    this.issueDescription = ''

  }

  reportIssue() {
    const user = JSON.parse(localStorage.getItem('userAuth'))
    const formData = new FormData();
    const body = {
      reason: this.issueDescription,
      username: user.username
    }
    this.files.forEach(file => {
      formData.append('images', file);
    })
    formData.append('data', JSON.stringify(body))
    this.matchListService.reportIssue(this.match.code, formData).subscribe(res => {
      this.store.dispatch(new SetNotifications('Success', 'Issue reported successfully', 'success'))
      this.isVisible = false;
    }, error => {

      this.store.dispatch(new HandleError(error))
    })

  }

  resolveIssue() {
    this.matchListService.resolveIssue(this.match.code).subscribe(res => {
      this.store.dispatch(new SetNotifications('Success', 'Issue reported successfully', 'success'))
      this.isVisible = false;
    }, error => {
      this.store.dispatch(new HandleError(error))
    })
  }

  previewImages(event) {
    const files = event.target.files;
    console.log(files, event.target.files)
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      this.files.push(file);
      const reader = new FileReader();
      reader.onload = e => this.imageSrcs.push(reader.result as string);
      reader.readAsDataURL(file);
    }
    this.file1Input.nativeElement.value = '';

  }

  deleteImage(index) {
    console.log(this.files)
    this.files.splice(index, 1);
    this.imageSrcs.splice(index, 1);
  }


  openSetScoreModal(match) {
    console.log(match)
    this.modalService.create({
      nzTitle: 'Set Score',
      nzContent: SetScoreComponent,
      nzFooter: null,
      nzData: {
        selectedBracketMatchType: match.current_stage === 'DoubleElimination' ? (match.is_losers_match === true ? 'losers_matches' : 'winners_matches') : ('matches'),
        match,
        roundOrGroup: 'groups',
        stage: match.current_stage.name === 'first_stage' ? 0 : 1,
        roundIndex: match.round.order,
      },
      nzWidth: '800px',
      nzBodyStyle: {padding: '0px'},
      nzCentered: true,
    });
  }

  openTeamDrawer(data) {
    if (this.match?.participants_type === 'single') {
      return;
    }
    this.matchDrawer = data
    this.drawerService.create<TeamViewComponent, { value: string }, string>({
      nzTitle: this.drawerTitle,
      nzFooter: this.drawerFooter,
      nzContent: TeamViewComponent,
      nzContentParams: {
        data: data?.members,
        tournament: this.match.tournament,
        leader: data?.original?.leader,
        componentName: 'participants'
      },
      nzWidth: '550px',
    })
  }

  createUser() {
    const data = this.fns.httpsCallable('createUser');
    data({
      authorization: 'Bearer '
        + localStorage.getItem('token'),
    }).subscribe(res => {
      this.afAuth.signInWithCustomToken(res).then(res => {
        console.log(res)
      })
    })

  }

}
