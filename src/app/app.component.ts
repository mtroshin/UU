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
  combined: string[][] = [];
  columnUser: Column[] = [];
  columnsAction: Column[] = [];

  constructor(private httpService: HttpService) {
  }

  ngOnInit() {
    //вытаскиваем данные из базы посредством подписки на событие
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

  //выводим столбцы в зависимости от того какая таблица выбрана
  switchTable() {
    this.tableName = (<HTMLSelectElement>document.querySelector('select')).value;
    const getColumnsSubscription = this.httpService
      .getColumnsTable(this.tableName)
      .subscribe((columns: Column[]) => {
        this.columns = columns;
        getColumnsSubscription.unsubscribe();
      });
  }

  // функция добавление полей в "выбранные"
  fieldsForward() {
    document.getElementById('result').style.display = 'none';
    const flags = (document.querySelectorAll<HTMLInputElement>('.availableFields input[type="checkbox"]'));
    const len = flags.length;
    for (let i = 0; i < len; i++) {
      if ((flags[i].checked) && (!(this.selectedColumns.includes(flags[i].value)))) { //если поле
        // чекнуто и его еще нет в массиве выбранных полей
        this.selectedColumns.push(flags[i].value);
        flags[i].checked = false;
      }
    }
  }

  //удаление поля из массива
  deleteColumn() {
    const flags = Array.from(document.querySelectorAll<HTMLInputElement>('.selectedFields > input[type="checkbox"]'));
    const len = flags.length;
    for (let i = 0; i < len; i++) {
      if (flags[i].checked) {
        const ind = this.selectedColumns.indexOf(flags[i].value);
        this.selectedColumns.splice(ind, 1);
      }
    }
  }

  //перемещение поля вверх
  upColumns() {
    const flags = Array.from(document.querySelectorAll<HTMLInputElement>('.selectedFields > input[type="checkbox"]'));
    const len = flags.length;
    for (let i = 0; i < len; i++) {
      if (flags[i].checked) {
        const ind = this.selectedColumns.indexOf(flags[i].value);
        this.selectedColumns[ind] = [this.selectedColumns[ind - 1], this.selectedColumns[ind - 1] = this.selectedColumns[ind]] [0];
      }
    }
  }

  //перемещение поля вниз
  dawnColumns() {
    const flags = Array.from(document.querySelectorAll<HTMLInputElement>('.selectedFields > input[type="checkbox"]'));
    const len = flags.length;
    for (let i = 0; i < len; i++) {
      if (flags[i].checked) {
        const ind = this.selectedColumns.indexOf(flags[i].value);
        this.selectedColumns[ind] = [this.selectedColumns[ind + 1], this.selectedColumns[ind + 1] = this.selectedColumns[ind]] [0];
      }
    }
  }

  //функция запроса к базе анных
  makeRequest() {
    console.log(this.selectedColumns)
    document.getElementById('result').style.display = 'block';
    this.combined = []; //очищаем массив
    for (let i = 0; i < this.selectedColumns.length; i++) { //проходим по массивы выбранных столбцов
      this.combined[i] = new Array<string>(); // каждый i-ый элимент делаем массивом
      
      for (let key in this.columnUser) { // проходим по массиву столбцов user
        if (this.selectedColumns[i] === this.columnUser[key].name) { //если в user найден такой столбец
          for (let j = 0; j < this.users.length; j++) {
            this.combined[i][j] = ' ' + this.users[j][key];  // кладем данные таблицы выбранного столбце по индексу в новый массив
          }
        } else {
          for (let keyy in this.columnsAction) {  // проходим по массиву столбцов action
            if (this.selectedColumns[i] === this.columnsAction[keyy].name) {  //если найден такой столбец
              for (let q = 0; q < this.actions.length; q++) {
                this.combined[i][q] = ' ' + this.actions[q][keyy];  // кладем данные таблицы выбранного столбце по индексу в новый массив
              }
            }
          }
        }
      }
    }
  }

  ngOnDestroy(): void {
    // отписываемся от событий
    this.receiveDataUser.unsubscribe();
    this.receiveDataActions.unsubscribe();
    this.receiveColumnsUser.unsubscribe();
    this.receiveColumnsActions.unsubscribe();
  }
}


