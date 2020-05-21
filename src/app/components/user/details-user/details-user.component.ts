import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { User } from 'src/app/models/user';
import { faUserCircle, faPlusCircle, faEdit, faMinusCircle, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { TranslateService } from '@ngx-translate/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';
import { TranslatableComponent } from '../../shared/translatable/translatable.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HistoryContributionService } from 'src/app/services/historyContribution.service';
import { HistoryContribution } from 'src/app/models/historyContribution';
import * as moment from 'moment';
import { APIService } from 'src/app/services/api.service';
import { ToastrService } from 'ngx-toastr';
import { ProviderService } from 'src/app/services/provider.service';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-details-user',
  templateUrl: './details-user.component.html',
  styleUrls: ['./details-user.component.css']
})
export class DetailsUserComponent extends TranslatableComponent implements OnInit {

  faUserCircle = faUserCircle;
  faEye = faEye;
  faEyeSlash = faEyeSlash;

  user: User;
  currentUser: User;
  activeRole: string;
  contributions: HistoryContribution[];
  showContributions = false;

  constructor(
    public translateService: TranslateService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private userService: UserService,
    private authService: AuthService,
    private apiService: APIService,
    private providerService: ProviderService,
    private historyContributionService: HistoryContributionService,
    private toastr: ToastrService,
    private modalService: NgbModal,
    @Inject(PLATFORM_ID) private platformId
    ) {
    super(translateService);
    this.currentUser = this.authService.getCurrentUser();
    if (this.currentUser && this.authService.getIdToken()) {
      this.activeRole = this.currentUser.role.toString();
    }
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.currentUser = this.authService.getCurrentUser();
      if (this.currentUser && this.authService.getIdToken()) {
        this.activeRole = this.currentUser.role.toString();
      }
      this.activatedRoute.params.subscribe(
        (params: Params) =>
          this.userService.getUser(params.id).then(user =>  {
            if (!user) {
              this.router.navigate(['404']);
            } else {
              this.user = user;
            }
          }, err => {
            this.router.navigate(['404']);
          })
      );
    }
  }

  getMomentFromNow(contribution: HistoryContribution) {
    return moment(contribution.date).fromNow();
  }

  goToEditUser() {
    this.router.navigate(['user', this.user._id, 'edit']);
  }

  goToContribution(contribution: HistoryContribution) {
    switch (contribution.typeContribution) {
      case 'RestAPI':
        this.apiService.getApi(contribution.contribution_id).then(_ =>
          this.router.navigate(['api', contribution.contribution_id])
        ).catch(_ => this.toastr.warning(this.translateService.instant('contribution.deleted')));

        break;
      case 'Version':
        this.apiService.getApisByName(contribution.name).then(
          apis => this.router.navigate(['api', apis[0]._id])
        ).catch(_ => this.toastr.warning(this.translateService.instant('contribution.deleted')));
        break;
      case 'Provider':
        this.providerService.getProvider(contribution.contribution_id).then(_ =>
          this.router.navigate(['provider', contribution.contribution_id])
        ).catch(_ => this.toastr.warning(this.translateService.instant('contribution.deleted')));
        break;
    }
  }

  switchDisplayContributions() {
    this.showContributions = !this.showContributions;
    if (this.showContributions && !this.contributions) {
      this.historyContributionService.getAllhistoryContributionsByContributor(this.user._id)
        .then(contributions => {
          contributions.forEach(contribution => contribution.date = new Date(contribution.date));
          this.contributions = contributions.sort((a, b) => b.date.getTime() - a.date.getTime());
        });
    }
  }

  getIconContribution(contribution: HistoryContribution) {
    switch (contribution.action) {
      case 'ADD':
        return faPlusCircle;
      case 'EDIT':
        return faEdit;
      case 'DELETE':
        return faMinusCircle;
    }
  }

  getColorContribution(contribution: HistoryContribution) {
    switch (contribution.action) {
      case 'ADD':
        return '#228B22';
      case 'EDIT':
        return '#FF8C00';
      case 'DELETE':
        return '#FF6347';
    }
  }

  banUser() {
    this.userService.banUser(this.user._id, !this.user.banned, this.authService.getIdToken());
    this.router.navigate(['']);
  }

  openModalBanUser(content) {
    this.modalService.open(content, { centered: true });
  }

}
