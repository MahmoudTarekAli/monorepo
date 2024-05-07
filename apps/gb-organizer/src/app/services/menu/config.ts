import {ActivatedRoute} from "@angular/router";
import {SetStateActionNgxs} from "../../store/setting_ngxs/actions";
import {Store} from "@ngxs/store";
import {SidebarEnum} from "../../core/sidebar.enum";

export class MenuConfig {
  id: string

  constructor(private activatedRoute?: ActivatedRoute, private store?: Store) {
    // this.id = this.activatedRoute?.firstChild?.snapshot?.params?.id
    // console.log(this.id)
  }

  calcMenu() {
    const getMenuData: any[] = [

      {
        title: SidebarEnum.my_tournaments,
        key: 'My Tournaments',
        icon: 'fe fe-home',
        url: `/my-tournaments`,
        img: 'assets/svg-icons/trophy-icon.svg',

      },
      {
        title: SidebarEnum.support,
        key: 'support',
        icon: 'fe fe-home',
        url: `/my-tournaments`,
        img: 'assets/svg-icons/solid question-circle.svg',

      },
      {
        title: SidebarEnum.my_plan,
        key: 'my_plan',
        icon: 'fe fe-home',
        url: `/my-tournaments`,
        img: 'assets/svg-icons/crown-icon.svg',

      },
      {
        title: SidebarEnum.merchants,
        key: 'merchants',
        icon: 'fe fe-home',
        url: `/my-tournaments`,
        img: 'assets/svg-icons/bank-account-icon.svg',

      },
    ];
    return getMenuData
  }

  calcTourMenu(id) {
    const getTourData: any[] = [
      {
        title: SidebarEnum.tournament_progress,
        key: 'Tournament Process',
        icon: 'fe fe-home',
        img: 'assets/svg-icons/progress-icon.svg',
        url: `/tournament/${id}/process/tournament-progress`,
      },
      {
        title: SidebarEnum.edit_participants,
        key: 'participants',
        url: `/tournament/${id}/manage/participants`,
        icon: 'fe fe-home',
        img: 'assets/svg-icons/users-icon.svg',
      },
      {
        title: SidebarEnum.manage_winners,
        key: 'Tournament Process',
        icon: 'fe fe-home',
        img: 'assets/svg-icons/winners-icon.svg',
        url: `/tournament/${id}/manage/winners`,
      },

      // {
      //   title: SidebarEnum.manage_winners,
      //   key: 'participants',
      //   url: `/tournament/${id}/manage/participants`,
      //   icon: 'fe fe-home',
      //   img: 'assets/svg-icons/winners-icon.svg',
      // },
      {
        title: SidebarEnum.manage_tournament,
        key: 'Manage Tournament',
        img: 'assets/svg-icons/game_pad-icon.svg',
        url: 'tournament',
        children: [
          {
            title: SidebarEnum.match_list,
            key: 'Match List',
            url: `/tournament/${id}/manage/match-list`,
            icon: 'fe fe-home',
            img: 'assets/svg-icons/battle-2-icon.svg',

          },
          {
            title: SidebarEnum.issues_claims,
            key: 'issues_claims',
            url: `/tournament/${id}/manage/issues-claims`,
            icon: 'fe fe-home',
            img: 'assets/svg-icons/flag-icon.svg',

          },
          {
            title: SidebarEnum.brackets_view,
            key: 'brackets_view',
            url: `/tournament/${id}/manage/brackets-view`,
            icon: 'fe fe-home',
            img: 'assets/svg-icons/bracket-icon.svg',

          },
        ]
      },

      {
        title: SidebarEnum.edit_tournament,
        key: 'Tournament Details',
        icon: 'fe fe-home',
        img: 'assets/svg-icons/edit_tournament-icon.svg',
        url: 'tournament',
        children: [
          {
            title: SidebarEnum.tournament_info,
            key: 'Tournament Info',
            url: `/tournament/${id}/process/tournament-info`,
            icon: 'fe fe-home',
            img: 'assets/svg-icons/info-icon.svg',

          },
          {
            title: SidebarEnum.tournament_bracket,
            key: 'Tournament Bracket',
            url: `/tournament/${id}/process/tournament-bracket`,
            icon: 'fe fe-home',
            img: 'assets/svg-icons/bracket-icon.svg',

          },
          {
            title: SidebarEnum.participant_settings,
            key: 'Participants',
            icon: 'fe fe-home',
            url: `/tournament/${id}/process/participants`,
            img: 'assets/svg-icons/participants_setting-icon.svg',

          },
          {
            title: SidebarEnum.prizes,
            key: 'Prizes',
            icon: 'fe fe-home',
            url: `/tournament/${id}/process/prizes`,
            img: 'assets/svg-icons/prizes-icon.svg',

          },
          {
            title: SidebarEnum.rules,
            key: 'Rules',
            icon: 'fe fe-home',
            url: `/tournament/${id}/process/rules`,
            img: 'assets/svg-icons/rules-icon.svg',

          },
          {
            title: SidebarEnum.tournament_setting,
            key: 'Tournament Settings',
            icon: 'fe fe-home',
            url: `/tournament/${id}/process/tournament-settings`,
            img: 'assets/svg-icons/settings-icon.svg',

          },
        ],
      },
      {
        title: SidebarEnum.tournament_logs,
        key: 'Tournament Logs',
        url: `/tournament/${id}/manage/tournament-logs`,
        icon: 'fe fe-home',
        img: 'assets/svg-icons/logs-icon.svg',

      },

    ];
    return getTourData
  }
}
