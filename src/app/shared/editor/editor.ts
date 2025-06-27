import { Component, AfterViewInit, Inject, PLATFORM_ID, Output, EventEmitter } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

declare const ace: any;

@Component({
  selector: 'app-code-editor',
  standalone: true,
  templateUrl: './editor.html',
  styleUrls: ['./editor.css'],
})
export class CodeEditor implements AfterViewInit {
  @Output() codeChanged = new EventEmitter<string>();

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const editor = ace.edit('editor');
    editor.setTheme('ace/theme/monokai');
    editor.session.setMode('ace/mode/javascript');
    editor.setOptions({
      fontSize: '16px',
      showPrintMargin: false,
    });

    editor.setValue(`function greet() {\n  console.log("Hello Ace Editor!");\n}`, -1);

    // 👇 Emit changes
    editor.session.on('change', () => {
      this.codeChanged.emit(editor.getValue());
    });
  }
}
