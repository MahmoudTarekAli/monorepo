import { Pipe, PipeTransform } from '@angular/core';
import {Observable, interval, Subscription, startWith} from 'rxjs';

@Pipe({
  name: 'countdown',
  standalone: true
})
export class CountdownPipe implements PipeTransform {
  private subscription: Subscription;

  transform(value: string , isDays?:boolean , isClaimed?:boolean):  Observable<any> {
    const targetDate = new Date(value).getTime();
    const now = new Date().getTime();
    const timeLeft = targetDate - now;

    if (timeLeft < 0) {
      return new Observable<string>((observer) => {
        observer.next('00:00:00');
        observer.complete();
      });
    }
    const countdown = interval(1000).pipe(startWith(0));
    return new Observable<string>((observer) => {
      this.subscription = countdown.subscribe(() => {
        const currentTime = new Date().getTime();
        const remainingTime = targetDate - currentTime;

        if (remainingTime <= 0) {
          observer.next('Countdown expired!');
          observer.complete();
        } else {
          const days = Math.floor(remainingTime / (1000 * 60 * 60 * 24));
          const hours = Math.floor((remainingTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          const minutes = Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((remainingTime % (1000 * 60)) / 1000);
          const formattedTime = this.formatTime(days, hours, minutes, seconds , isClaimed);
          observer.next(formattedTime);
        }
      });
    });

  }
  formatTime(days: number, hours: number, minutes: number, seconds: number , isClaimed:boolean): string {
    const formattedDays = this.padNumber(days);
    const formattedHours = this.padNumber(hours);
    const formattedMinutes = this.padNumber(minutes);
    const formattedSeconds = this.padNumber(seconds);
    return  isClaimed ? `${formattedMinutes}m ${formattedSeconds}s` :`${formattedDays}d ${formattedHours}h ${formattedMinutes}m ${formattedSeconds}s`;
  }

  padNumber(num: number): string {
    return num.toString().padStart(2, '0');
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }

  }
}
