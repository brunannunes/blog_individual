import { Component } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { CardsComponent } from '../cards/cards.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [HeaderComponent, CardsComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

}
