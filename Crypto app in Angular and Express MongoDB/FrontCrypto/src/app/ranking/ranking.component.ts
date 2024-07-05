import { Component, OnInit } from '@angular/core';

export interface PeriodicElement {
  name: string;
  position: number;
  argent: number;
}

var ELEMENT_DATA: PeriodicElement[] = [
  {position: 4, name: 'Anonymous', argent: 1000},
  {position: 2, name: 'Laurent', argent: 2680},
  {position: 5, name: 'Louis', argent: 628},
  {position: 3, name: 'Maximus', argent: 1201},
  {position: 1, name: 'JimmyCrypto', argent: 6000},
];

@Component({
  selector: 'app-ranking',
  templateUrl: './ranking.component.html',
  styleUrls: ['./ranking.component.scss']
})
export class RankingComponent implements OnInit {
  title = 'CustomTable';
  displayedColumns: string[] = ['position', 'name', 'argent'];
  dataSource = ELEMENT_DATA;

  constructor() {}

  ngOnInit(): void {
    ELEMENT_DATA.sort((a,b) => a.argent - b.argent)
    var token = localStorage.getItem("token")// correspond au token de connexion
    console.log(token);
  }

}
