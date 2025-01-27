import { Component } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DialogComponent } from '../../shared/dialog/dialog.component';
import { AddAppUserComponent } from '../../shared/add-app-user/add-app-user.component';
import { AppUserService } from '../../services/app-user.service';
import { UpAppvlistComponent } from '../../shared/up-appvlist/up-appvlist.component';
import { ComponettitleService } from '../../services/componenttitle.service';
import { LanguageDailogComponent } from '../../shared/language-dailog/language-dailog.component';
import { MatTableDataSource } from '@angular/material/table';
import { LanguageService } from '../../services/language.service';
import { SnackbarService } from '../../services/snackbar.service';

@Component({
  selector: 'app-language-dashboard',
  templateUrl: './language-dashboard.component.html',
  styleUrl: './language-dashboard.component.scss'
})
export class LanguageDashboardComponent {
   ActiveUser: any;
    BlockUser: any;
    displayedColumns: string[] = ['language', 'Name', 'Messages'];
  dataSource = new MatTableDataSource<any>([]);

  // Available languages
  languages: { id: number; languageName: string }[] = [];
    // dataSource: any[];
    langId: number;
    loader: boolean;
    Operator: any;
    role: string = "APPROVEDEPOSIT";
    obj: any;
    editingElementId: number | null = null; // ID of the element being edited
    editedMessage: string = ''; // Message being edited
    constructor(public dialog: MatDialog, private appuserserv: AppUserService, private titleService: ComponettitleService,private langservice: LanguageService,private snackbarService: SnackbarService) {
      this.titleService.changeTitle('Language Dashboard');
      
    }
    ngOnInit(): void {
      
      this.loadLanguages();
      this.onLanguageChange(0)
    }
  
    
    isApproveDeposit = true; // Default role
  
    
    loadLanguages(): void {
      this.loader=true;
      this.langservice.getLanguage().subscribe(data => {
        this.languages = data.map(language => ({ ...language, isEditing: false }));
        this.loader=false;
      },error=>{
        console.log(error);
        this.loader=false;
      });
    }
  
    openlanguageDailog(){
      const dialogConfig = new MatDialogConfig();
            dialogConfig.width = '67%';
            dialogConfig.data = {
              type: 'Add',
            };
            const dialogRef = this.dialog.open(LanguageDailogComponent, dialogConfig);
            dialogRef.afterClosed().subscribe((result) => {
  
            });
    }
    onLanguageChange(languageId: number): void {
      this.loader=true;
      // Fetch replies for the selected language
      this.langservice.getReplybyLanguage(languageId).subscribe(data => {
      this.dataSource.data = data;
      this.langId = languageId;

      this.loader=false;
    },error=>{
      console.log(error);
      this.loader=false;
    });
  }
  
  enableEdit(element: any): void {
    this.editingElementId = element.id;
    this.editedMessage = element.message;
    
  }
 
  
  onInputChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.editedMessage = input.value;
   
  }
  saveMessage(element: any): void {
    const updatedElement = { ...element, message: this.editedMessage };
 
    this.loader=true;
    this.langservice.updateReplyMessage(element.id, this.langId, this.editedMessage).subscribe(data=> {
      this.snackbarService.snackbar(`Message updated successfully `, 'success');
      this.onLanguageChange(this.langId);
      this.loader=false;
    },error=>{
      console.log(error);
      this.loader=false;
    })
  }

  cancelEdit(): void {
    this.editingElementId = null;
  }

  
  
    
   
  
    filterData(searchTerm: string) {
      this.loader = true;
       this.langservice.searchReply(searchTerm).subscribe(data => {
        this.dataSource.data = data;
        this.loader = false;
      },error=>{
        console.log(error);
        this.loader = false;
      });

  
      
    }
  
  

}
