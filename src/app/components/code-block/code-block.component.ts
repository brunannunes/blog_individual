import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, Input } from '@angular/core';
import { ViewEncapsulation } from '@angular/core';
import hljs from 'highlight.js';

@Component({
  selector: 'app-code-block',
  standalone: true,
  templateUrl: './code-block.component.html',
  imports: [CommonModule],
  styleUrl: './code-block.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class CodeBlockComponent implements AfterViewInit {
  
  @Input() code: string = '';
  @Input() language: string = 'language-python';

  constructor(private el: ElementRef) {}

  ngAfterViewInit() {
    const codeElement = this.el.nativeElement.querySelector('code');
    if (codeElement) {
      hljs.highlightElement(codeElement);
    }
  }
}
