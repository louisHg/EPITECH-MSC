import { Component, OnInit } from '@angular/core';
import * as Highcharts from 'highcharts';

declare var require: any;

@Component({
  selector: 'app-graphique',
  templateUrl: './graphique.component.html',
  styleUrls: ['./graphique.component.scss']
})
export class GraphiqueComponent implements OnInit {
  public options: any ={
    Chart: {
      type: 'area',
      height: 700
    },
    title: {
      text: 'Classement des traders'
    },
    credits: {
      enabled: false
    },
    xAxis: {
      categories: ['Janvier 2022','Février 2022','Mars 2022','Avril 2022','Mai 2022','Juin 2022','Juillet 2022'],
      tickmarkPlacement: 'on',
      title: {
        enabled: false
      },
    },
    series: [{
      name: 'Laurent',
      data: [502, 635, 809, 947, 1402, 3634, 2680]
    }, {
      name: 'Louis',
      data: [163, 203, 276, 408, 547, 729, 628],
    }, {
      name: 'Maximus',
      data: [18, 31, 54, 156, 339, 818, 1201]
    },  {
      name: 'JimmyCrypto',
      data: [100, 1500, 200, 1, 1000, 700, 6000]
    }, {
      name: 'Anonymous',
      data: [8000, 6000, 50, 1000, 300, 300, 1000]
    }]
  }
  constructor() { }

  ngOnInit(): void {
    Highcharts.chart('graphique', this.options);
  }

}
