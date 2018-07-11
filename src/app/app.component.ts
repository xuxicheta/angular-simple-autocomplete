import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit, OnDestroy {
  private sub: Subscription;
  public items1 = this.getArray();
  public items2 = this.getArray();

  public item: string;
  public control = new FormControl('');

  constructor() { }

  ngOnInit() {
    this.sub = this.control.valueChanges
      .subscribe(item2 => {
        this.items2 = item2
          ? this.getArray().filter(el => el.indexOf(item2) !== -1)
          : this.getArray();
      });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  private getArray() {
    return [
      'Moscow',
      'Oslo',
      'Tver',
      'Odessa',
      'Laaperanta',
      'Kiev',
      'London',
      'Paris',
      'Torzhok',
      'Lissabon',
      'Chicago',
      'Los-Angeles',
      'Dubrovnik',
    ];
  }

  public onItem1Change(item1: string) {
    this.item = item1;
    this.items1 = item1
      ? this.getArray().filter(el => el.indexOf(item1) !== -1)
      : this.getArray();
  }
}
