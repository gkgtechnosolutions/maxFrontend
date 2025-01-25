import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LanguageService } from '../../services/language.service';
import { SnackbarService } from '../../services/snackbar.service';

@Component({
  selector: 'app-language-dailog',
  templateUrl: './language-dailog.component.html',
  styleUrl: './language-dailog.component.scss'
})
export class LanguageDailogComponent {
  languageForm: FormGroup;
  languages ;
  displayedColumns: string[] = ['languageName', 'operation'];
  loader = false;

  constructor(private fb: FormBuilder ,private lanService: LanguageService,private snackbarService: SnackbarService) {
    this.languageForm = this.fb.group({
      languageName: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadLanguages();
  }

  onSubmit(): void {
    this.loader = true;
    if (this.languageForm.valid) {
      
      this.lanService.addLanguage(this.languageForm.value).subscribe(res => {
        this.snackbarService.snackbar(`Language added successfully `, 'success');
        this.loadLanguages();
        this.loader = false; 
      },error=>{
        this.loader = false; 
        console.log(error);
      });
    }
  }
  loadLanguages(): void {
    this.loader=true;
    this.lanService.getLanguage().subscribe(data => {
      this.languages = data.map(language => ({ ...language, isEditing: false }));
      this.loader=false;
    });
  }

  editLanguage(language: any): void {
    language.isEditing = true;
  }

  saveLanguage(language: any): void {
    this.loader = true;  
    language.isEditing = false;
    //===========================
    this.lanService.updateLanguage(language).subscribe(data=> {
      this.snackbarService.snackbar(`Language updated successfully `, 'success');
      this.loadLanguages();
      this.loader = false;
    }, error => {
      console.error('Error updating language', error);
      this.loader = false;
    });
    // console.log('Slot saved:', slot);
  }

  cancelEdit(language: any): void {
    language.isEditing = false;
  }
}
