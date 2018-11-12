import {Component, OnInit, OnDestroy} from '@angular/core';
import {HttpService} from './http.service';
import {Column} from './models/columns';
import {Actions} from './models/actions';
import {Users} from './models/users';
import {Subscription} from 'rxjs';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']

})
export class AppComponent implements OnInit, OnDestroy {

  columns: Column[] = [];
  users: Users[] = [];
  actions: Actions[] = [];
  receiveDataUser: Subscription;
  receiveDataActions: Subscription;
  receiveColumnsUser: Subscription;
  receiveColumnsActions: Subscription;
  tableName: string;
  selectedColumns: string[] = [];
  combined: string[] = [];
  columnUser: Column[] = [];
  columnsAction: Column[] = [];

  constructor(private httpService: HttpService) {
  }

  ngOnInit() {
    this.receiveDataUser = this.httpService
      .getDataUsers()
      .subscribe((users) => this.users = users['data']);
    this.receiveDataActions = this.httpService
      .getDataActions()
      .subscribe((actions) => this.actions = actions['data']);
    this.receiveColumnsUser = this.httpService
      .getColumnsUser()
      .subscribe((columns: Column[]) => this.columnUser = columns);
    this.receiveColumnsActions = this.httpService
      .getColumnsActions()
      .subscribe((columns: Column[]) => this.columnsAction = columns);

  }

  switchTable() {
    this.tableName = (<HTMLSelectElement>document.querySelector('select')).value;
    const getColumnsSubscription = this.httpService
      .getColumnsTable(this.tableName)
      .subscribe((columns: Column[]) => {
        this.columns = columns;
        getColumnsSubscription.unsubscribe();
      });
  }

  fieldsForward() {
    const flags = document.querySelectorAll('input[type="checkbox"]');
    const len = flags.length;
    for (let i = 0; i < len; i++) {
      if ((flags[i].checked) && (!(this.selectedColumns.includes(flags[i].value)))) {
        this.selectedColumns.push(flags[i].value);
        flags[i].checked = false;
      }
    }
  }

  deleteColumn() {
    const flags = document.querySelectorAll('.choose > input[type="checkbox"]');
    const len = flags.length;
    for (let i = 0; i < len; i++) {
      if (flags[i].checked) {
        const ind = this.selectedColumns.indexOf(flags[i].value);
        this.selectedColumns.splice(ind, 1);
      }
    }
  }

  upColumns() {
    const flags = document.querySelectorAll('.choose > input[type="checkbox"]');
    const len = flags.length;
    for (let i = 0; i < len; i++) {
      if (flags[i].checked) {
        const ind = this.selectedColumns.indexOf(flags[i].value);
        this.selectedColumns[ind] = [this.selectedColumns[ind - 1], this.selectedColumns[ind - 1] = this.selectedColumns[ind]] [0];
      }
    }
  }

  dawnColumns() {
    const flags = document.querySelectorAll('.choose > input[type="checkbox"]');
    const len = flags.length;
    for (let i = 0; i < len; i++) {
      if (flags[i].checked) {
        const ind = this.selectedColumns.indexOf(flags[i].value);
        this.selectedColumns[ind] = [this.selectedColumns[ind + 1], this.selectedColumns[ind + 1] = this.selectedColumns[ind]] [0];
      }
    }
  }

  makeRequest() {
    this.combined = [];
    for (let i = 0; i < this.selectedColumns.length; i++) {
      for (let key in this.columnUser) {
        if (this.selectedColumns[i] === this.columnUser[key].name) {
          for (let j = 0; j < this.users.length; j++) {
            // console.log(this.users[j][key]);
            // this.combined[i] = this.users[j][key];
            this.combined.push(this.users[j][key]);
            // console.log(this.combined);
          }
        } else {
          for (let keyy in this.columnsAction) {
          if (this.selectedColumns[i] === this.columnsAction[keyy].name) {
              for (let j = 0; j < this.actions.length; j++) {
                this.combined.push(this.actions[j][keyy]);
                // console.log(this.combined);
              }
            }
          }
        }
      }}
   console.log(this.combined);
  }
  ngOnDestroy(): void {
    this.receiveDataUser.unsubscribe();
    this.receiveDataActions.unsubscribe();
    this.receiveColumnsUser.unsubscribe();
    this.receiveColumnsActions.unsubscribe();
  }
}


