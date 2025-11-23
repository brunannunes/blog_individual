import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardResultsComponent } from './card-results.component';

describe('CardResultsComponent', () => {
  let component: CardResultsComponent;
  let fixture: ComponentFixture<CardResultsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardResultsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CardResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
