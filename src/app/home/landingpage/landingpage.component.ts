import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ComponettitleService } from '../../services/componenttitle.service';

@Component({
  selector: 'app-landingpage',

  templateUrl: './landingpage.component.html',
  styleUrl: './landingpage.component.scss',
})
export class LandingpageComponent implements OnInit {
  constructor(
    private route: Router,
    private titleService: ComponettitleService
  ) {}

  Operator: string;

  ngOnInit(): void {
    this.titleService.changeTitle('Dashboard');
    this.getrole();
  }
  navigateToPage(component: String): void {
    this.route.navigateByUrl(`home/${component}`);
  }

  getrole() {
    const userString = localStorage.getItem('user');
    if (userString) {
      // Step 2: Access user_role attribute
      const user = JSON.parse(userString);
      this.Operator = user.role_user;
    }
  }
}
