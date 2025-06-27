import {
  Component,
  OnInit
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CodeEditor } from "../../shared/editor/editor";


@Component({
  selector: 'app-roast',
  standalone: true,
  imports: [CommonModule, FormsModule, CodeEditor],
  templateUrl: './roast.html',
  styleUrls: ['./roast.css'],
})
export class Roast implements OnInit {
  userCode = '';
  roastMessage = '';
  challenge = 'Write a function that adds two numbers.';

  ngOnInit(): void {}

  submitCode() {
    this.roastMessage = 'ბრავო! ამ კოდს ჩემი ბებიაც დაწერდა.';
  }

  handleCodeChange(newCode: string) {
    this.userCode = newCode;
  }
}
