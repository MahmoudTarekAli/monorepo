import {Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import {TranslateModule} from "@ngx-translate/core";
import {NzInputModule} from "ng-zorro-antd/input";
import {ButtonComponent} from "../../../../components/button/button.component";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {Select, Store} from "@ngxs/store";
import {NzFormModule} from "ng-zorro-antd/form";
import {GetArena, UpdateArena} from "../../state/arenas.action";
import {ActivatedRoute} from "@angular/router";
import {ArenasState} from "../../state/arenas.state";
import {Observable} from "rxjs";
import {Arena} from "../../../../shared/models/arena";
import {ArenaService} from "../../service/arena.service";

@Component({
  selector: 'app-social-media',
  standalone: true,
  imports: [CommonModule, NzFormModule, TranslateModule, NzInputModule, ButtonComponent, ReactiveFormsModule],
  templateUrl: './social-media.component.html',
  styleUrls: ['./social-media.component.scss']
})
export class SocialMediaComponent implements OnInit{
  socialMedia = [
    { name: 'facebook', formName: 'facebook', placeholder: 'https://www.facebook.com/example' } ,
    { name: 'twitch', formName: 'twitch', placeholder: 'https://www.twitch.com/example' },
    { name: 'twitter', formName: 'twitter', placeholder: 'https://www.twitter.com/example' },
    { name: 'instagram', formName: 'instagram', placeholder: 'https://www.instagram.com/example' },
    { name: 'youtube', formName: 'youtube', placeholder: 'https://www.youtube.com/example' },
    { name: 'discord', formName: 'discord', placeholder: 'https://www.discord.com/example' },
  ]
  @Select(ArenasState.getArena) Arena$: Observable<Arena>;

  arenaForm: FormGroup
  constructor(private fb: FormBuilder, private store: Store, private activatedRoute:ActivatedRoute , private arenaService:ArenaService) {
    this.arenaForm = fb.group({
      social_media: fb.group({
        facebook: [null, Validators.pattern('^(http(s?):\\/\\/)?(www\\.)?(facebook)(\\.[a-zA-Z]{2,3})+(\\/[a-zA-Z0-9\\_\\-\\s\\.\\/\\?\\%\\#\\&\\=]*)?$')],
        twitch: [null, Validators.pattern('^(http(s?):\\/\\/)?(www\\.)?(twitch)(\\.[a-zA-Z]{2,3})+(\\/[a-zA-Z0-9\\_\\-\\s\\.\\/\\?\\%\\#\\&\\=]*)?$')],
        twitter: [null, Validators.pattern('^(http(s?):\\/\\/)?(www\\.)?(twitter)(\\.[a-zA-Z]{2,3})+(\\/[a-zA-Z0-9\\_\\-\\s\\.\\/\\?\\%\\#\\&\\=]*)?$')],
        youtube: [null, Validators.pattern('^(http(s?):\\/\\/)?(www\\.)?(youtube)(\\.[a-zA-Z]{2,3})+(\\/[a-zA-Z0-9\\_\\-\\s\\.\\/\\?\\%\\#\\&\\=]*)?$')],
        discord: [null, Validators.pattern('^(http(s?):\\/\\/)?(www\\.)?(discord|discordapp)(\\.[a-zA-Z]{2,3})+(\\/[a-zA-Z0-9\\_\\-\\s\\.\\/\\?\\%\\#\\&\\=]*)?$')],
        instagram: [null, Validators.pattern('^(http(s?):\\/\\/)?(www\\.)?(instagram)(\\.[a-zA-Z]{2,3})+(\\/[a-zA-Z0-9\\_\\-\\s\\.\\/\\?\\%\\#\\&\\=]*)?$')],
      }),
    })
  }
  ngOnInit(): void {
    this.Arena$.subscribe((res: any) => {
      console.log(res)
      this.arenaForm.patchValue(res)
    })
  }
  updateArena() {
    const formData = new FormData();
    formData.append('data', JSON.stringify(this.arenaForm.value));
    this.store.dispatch(new UpdateArena(this.arenaService.arenaSlug, formData))

  }
}
