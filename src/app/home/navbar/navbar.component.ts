import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
  Renderer2,
  OnInit,
} from '@angular/core';
import { Router } from '@angular/router';
import { ComponettitleService } from '../../services/componenttitle.service';
import { admin, APPROVEADMIN, APPROVEDEPOSIT, APPROVEWITHDRAW, BANKER, DEPOSIT, navDomain, SUPPORT, USER } from './navDomain';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements AfterViewInit ,OnInit {
  @ViewChild('navbarToggler') navbarToggler!: ElementRef;
  @Input() isExpanded: boolean = false;
  @Output() toggleSidebar: EventEmitter<boolean> = new EventEmitter<boolean>();
  handleSidebarToggle = () => this.toggleSidebar.emit(!this.isExpanded);
  title: string = 'Default Title';
  userRole: string;
  userName: string ="Username";
  navDomains:navDomain[] = [];
  constructor(public route: Router, private renderer: Renderer2,private   titleService:ComponettitleService,
  ) {}
  ngOnInit(): void {
    this.titleService.currentTitle.subscribe((title) => (this.title = title));
    this.getrole();
    this.setRoleData();
  }

  ngAfterViewInit() {
    if (this.navbarToggler && this.navbarToggler.nativeElement) {
      this.renderer.listen(this.navbarToggler.nativeElement, 'click', () => {
        // Your Bootstrap toggler code here
      });
    }
  }

  logout() {
    localStorage.setItem('user', '');
    localStorage.clear();
    this.route.navigateByUrl('');
  }

  setRoleData() {
    
  
    switch (this.userRole) {

      case 'USER':
        this.navDomains = USER;
  
        break;

      case 'ADMIN':
        this.navDomains = admin;
       
        break;
  
      case 'APPROVEDEPOSIT':
        this.navDomains = APPROVEDEPOSIT;
   
        break;

    case 'APPROVEWITHDRAW':
          this.navDomains = APPROVEWITHDRAW;
       
          break;  
  
      case 'DEPOSIT':
        this.navDomains = DEPOSIT;
     
        break;
  
      case 'APPROVEADMIN':
        this.navDomains = APPROVEADMIN;
       
        break;

      case 'SUPPORT':
        this.navDomains = SUPPORT;
       
        break;

      case 'BANKER':
        this.navDomains = BANKER;
       
        break;
  
      default:
        console.log('No matching role found, setting default role data');
        // You can handle any default case here if needed
        break;
    }
  
    // Use the `roleNavData` array as per your needs in your component
    // console.log('Navigation Data:', this.navDomains);
  }
  
  


  getrole(){
    const userString = localStorage.getItem('user');
    if (userString) {
      // Step 2: Access user_role attribute
      const user = JSON.parse(userString);
      this.userRole = user.role_user;
      this.userName = user.user_email;
     
    }
  }
}
