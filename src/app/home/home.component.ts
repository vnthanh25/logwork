import { Component, OnInit } from '@angular/core';
import { ChartDataSets, ChartOptions } from 'chart.js';
import { Color, Label } from 'ng2-charts';
import { LogCountService } from '../services/logcount.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  public lineChartData: ChartDataSets[] = 
  [
/*
    { "data": [5, 1, 0, 0, 0, 0], "label": "dunghq3" },
    { "data": [5, 1, 0, 0, 0, 0], "label": "phuongntl6" },
    { "data": [5, 1, 0, 0, 0, 0], "label": "manhbv1" },
    { "data": [5, 1, 0, 0, 0, 0], "label": "hocdd" },
    { "data": [5, 1, 0, 0, 0, 0], "label": "bactn" },
    { "data": [5, 1, 0, 0, 0, 0], "label": "longndp" },
    { "data": [5, 1, 0, 0, 0, 0], "label": "lamtt6" },
    { "data": [5, 1, 0, 0, 0, 0], "label": "anhhdt1" },
    { "data": [5, 1, 0, 0, 0, 0], "label": "thanhvn5" },
    { "data": [5, 1, 0, 0, 0, 0], "label": "nghiath5" },
    { "data": [5, 1, 0, 0, 0, 0], "label": "thanhvq" },
    { "data": [5, 1, 0, 0, 0, 0], "label": "tuantm13" },
    { "data": [5, 1, 0, 0, 0, 0], "label": "liemntt" },
    { "data": [5, 1, 0, 0, 0, 0], "label": "truongln" }
*/
  ];
  public lineChartLabels: Label[] = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];

  public lineChartOptions: ChartOptions = {
    responsive: true,
    scales: {
      yAxes: [{
        scaleLabel: {
          display: true,
          labelString: 'Log count'
        }
      }]
    }
  };
  public lineChartColors: Color[] = [
    {
      borderColor: 'black',
      backgroundColor: 'Blue',
    },
    {
      borderColor: 'black',
      backgroundColor: 'Green',
    },
    {
      borderColor: 'black',
      backgroundColor: 'Brown',
    },
    {
      borderColor: 'black',
      backgroundColor: 'Gray',
    },
    {
      borderColor: 'black',
      backgroundColor: 'Indigo',
    },
    {
      borderColor: 'black',
      backgroundColor: 'Magenta',
    },
    {
      borderColor: 'black',
      backgroundColor: 'Olive',
    },
    {
      borderColor: 'black',
      backgroundColor: 'Orange',
    },
    {
      borderColor: 'black',
      backgroundColor: '#E0115F',
    },
    {
      borderColor: 'black',
      backgroundColor: '#D1E231',
    },
    {
      borderColor: 'black',
      backgroundColor: 'Pink',
    },
    {
      borderColor: 'black',
      backgroundColor: 'Purple',
    },
    {
      borderColor: 'black',
      backgroundColor: 'Rose',
    },
    {
      borderColor: 'black',
      backgroundColor: 'Yellow',
    },
  ];
  public lineChartLegend = true;
  public lineChartType = 'bar';
  public lineChartPlugins = [];

  constructor(private logCountService: LogCountService) {
    this.logCountService.getAll().subscribe((response: any) => {
      this.lineChartData = JSON.parse(response[0].payload.doc.data().data);
    });
  }

  ngOnInit() {
  }
}
