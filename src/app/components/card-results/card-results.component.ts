import { Component, Input } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { CodeBlockComponent } from '../code-block/code-block.component';

@Component({
  selector: 'app-card-results',
  standalone: true,
  imports: [CodeBlockComponent],
  templateUrl: './card-results.component.html',
  styleUrl: './card-results.component.scss'
})
export class CardResultsComponent {
  @Input() image_url: string = '';
  @Input() code_url: string = '';

  constructor(private sanitizer: DomSanitizer) {}
 
  sanitize(url: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}
