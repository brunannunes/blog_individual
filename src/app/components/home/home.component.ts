import { Component } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { CardsComponent } from '../cards/cards.component';
import { CardsServicesService } from '../../services/cards-services/cards-services.service';
import { ServiceModel } from '../../models/ServiceModel';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [HeaderComponent, CardsComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

  cards: ServiceModel[] = [];

  constructor(private cardsService: CardsServicesService) {}

  ngOnInit() {
    this.cards = this.cardsService.get_services();
  }
}
