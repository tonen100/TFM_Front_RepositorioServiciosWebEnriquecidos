import { Component, OnInit, Inject, PLATFORM_ID, ViewChild } from '@angular/core';
import { TranslatableComponent } from '../../shared/translatable/translatable.component';
import { UserService } from 'src/app/services/user.service';
import { TranslateService } from '@ngx-translate/core';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { Table } from 'primeng/table/table';

@Component({
  selector: 'app-list-user',
  templateUrl: './list-user.component.html',
  styleUrls: ['./list-user.component.scss']
})
export class ListUserComponent extends TranslatableComponent implements OnInit {

  roles: [{
    value: 'Contributor',
    label: 'Contributor'
  }, {
    value: 'Administrator',
    label: 'Administrator'
  }];
  currentUser: User;
  users: User[];
  selectedUsers: User[];
  loading = true;

  @ViewChild('dt') table: Table;

  constructor(
    public translateService: TranslateService,
    private router: Router,
    private authService: AuthService,
    private userService: UserService,
    @Inject(PLATFORM_ID) private platformId
    ) {
    super(translateService);
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.currentUser = this.authService.getCurrentUser();
      if (this.currentUser && this.currentUser.role === 'Administrator') {
        this.userService.getUsersList(this.authService.getIdToken()).then(users => {
          users.forEach(user => user.createdAt = new Date(user.createdAt));
          this.users = users;
          this.selectedUsers = [];
          this.loading = false;
        }).catch(_ => this.router.navigate(['']));
      } else {
        this.router.navigate(['']);
      }
    }
  }

  onDateSelect(value) {
    this.table.filter(this.formatDate(value), 'createdAt', 'equals');
  }

  formatDate(date) {
    let month = date.getMonth() + 1;
    let day = date.getDate();

    if (month < 10) {
        month = '0' + month;
    }

    if (day < 10) {
        day = '0' + day;
    }

    return date.getFullYear() + '-' + month + '-' + day;
  }

  goToProfil(user: User) {
    this.router.navigate(['user', user._id]);
  }

  banUser(user: User) {
    this.userService.banUser(user._id, !user.banned, this.authService.getIdToken())
      .then(newUser => this.users.find(u => u._id === user._id).banned = newUser.banned);
  }

}
