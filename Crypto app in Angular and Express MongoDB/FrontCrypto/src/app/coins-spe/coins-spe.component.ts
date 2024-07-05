import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/Axios.service';
import axios from 'axios';
import * as Highcharts from 'highcharts';

@Component({
  selector: 'app-coins-spe',
  templateUrl: './coins-spe.component.html',
  styleUrls: ['./coins-spe.component.scss'],
})
export class CoinsSpeComponent implements OnInit {
  options: any;
  uuid: any;
  data: any;
  json: any;
  selectedItem: any;
  avPrice: any = 100;
  name: any;
  rank: any;
  argent: any;
  title = 'CustomTable';
  displayedColumns: string[] = [
    'rang',
    'symbole',
    'prix',
    'différence de prix (h24)',
    'en %',
    'market cap',
  ];

  constructor(private axiosService: UserService) {
    this.getcoin();
  }
  ngOnInit(): void {

    this.options =  {
      chart: {
        renderTo: 'container',
        type: 'column',
      },
      title: {
        text: 'Comparaison Prix',
      },
      xAxis: {
        tickInterval: 1,
      },
      yAxis: {
        title: {
          text: 'Valeur',
        },
        tickInterval: 1,
      },
      series: [
        {
          name: '24h',
          data: [3],
        },
        {
          name: 'une semaine',
          data: [],
        },
        {
          name: '1mois',
          data: [],
        },
        {
          name: '1an',
          data: [],
        },
      ],
    };


    this.axiosService.getCoin(this.uuid).subscribe((x: any) => {
      this.data = x.data.priceDiff.evolution;
      this.options['series'][0]["data"] = [this.data['24h'].flat];
      this.options['series'][1]["data"] = [this.data['30d'].flat];
      this.options['series'][2]["data"] = [this.data['7d'].flat];
      this.options['series'][3]["data"] = [this.data['1y'].flat];
      Highcharts.chart('graphique', this.options);
      this.json = x;
    });
  }

  getcoin() {
    var url = window.location.href;
    var split = url.split('?');
    var split2 = split[1].split('=');
    url = split2[1];
    this.uuid = url;
    // this.months= 1
  }
}
