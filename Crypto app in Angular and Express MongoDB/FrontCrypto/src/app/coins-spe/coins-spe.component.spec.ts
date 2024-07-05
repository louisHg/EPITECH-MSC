import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoinsSpeComponent } from './coins-spe.component';

describe('CoinsSpeComponent', () => {
  let component: CoinsSpeComponent;
  let fixture: ComponentFixture<CoinsSpeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CoinsSpeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CoinsSpeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
