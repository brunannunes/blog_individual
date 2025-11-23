import { Component, Input } from '@angular/core';
import { CardResultsComponent } from '../card-results/card-results.component';

@Component({
  selector: 'app-cards',
  standalone: true,
  imports: [CardResultsComponent],
  templateUrl: './cards.component.html',
  styleUrl: './cards.component.scss'
})
export class CardsComponent {
  @Input() title: string = '';
  @Input() short_description: string = '';
  @Input() image_url: string = '';
  @Input() code_url: string = '';

  showResults: boolean = false;

  toggleResults() {
    this.showResults = !this.showResults;
  }
}
