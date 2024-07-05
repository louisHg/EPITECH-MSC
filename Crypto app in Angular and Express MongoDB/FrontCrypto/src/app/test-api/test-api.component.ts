import { Component, OnInit } from '@angular/core';
import { testAPIService } from '../../services/testAPI.service';

@Component({
  selector: 'app-test-api',
  templateUrl: './test-api.component.html',
  styleUrls: ['./test-api.component.scss']
})
export class TestAPIComponent implements OnInit {
  constructor(private testApi:testAPIService) { 

  }

  ngOnInit(): void {
    this.testApi.testAPI()
  }

}
