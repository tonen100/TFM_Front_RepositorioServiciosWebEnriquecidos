import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { ProviderService } from 'src/app/services/provider.service';
import { HistoryContributionService } from 'src/app/services/historyContribution.service';
import { UserService } from 'src/app/services/user.service';
import { APIService } from 'src/app/services/api.service';
import { TranslatableComponent } from '../../shared/translatable/translatable.component';
import { User } from 'src/app/models/user';
import * as moment from 'moment';
import { Provider } from 'src/app/models/provider';
import { HistoryContribution } from 'src/app/models/historyContribution';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { API } from 'src/app/models/api';

@Component({
  selector: 'app-details-provider',
  templateUrl: './details-provider.component.html',
  styleUrls: ['./details-provider.component.css']
})
export class DetailsProviderComponent extends TranslatableComponent implements OnInit {

  currentUser: User;
  activeRole: string;
  provider: Provider;
  contributions: HistoryContribution[];
  lastContribution: HistoryContribution;
  lastContributor: User;
  restApis: API[];
  displayMode = 'columns';

  constructor(
    public translateService: TranslateService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private modalService: NgbModal,
    private authService: AuthService,
    private providerService: ProviderService,
    private apiService: APIService,
    private historyContributionService: HistoryContributionService,
    private userService: UserService) {
      super(translateService);
    }

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    if (this.currentUser && this.authService.getIdToken()) {
      this.activeRole = this.currentUser.role.toString();
    }
    this.activatedRoute.params.subscribe(
      (params: Params) =>
        this.providerService.getProvider(params.id).then(provider =>  {
          if (!provider) {
            this.router.navigate(['404']);
          } else {
            this.provider = provider;
            this.historyContributionService.getAllhistoryContributionsByContribution(this.provider._id, 'Provider')
            .then(contributions => {
              contributions.forEach(contribution => contribution.date = new Date(contribution.date));
              this.contributions = contributions;
              this.lastContribution = contributions.sort((a, b) => b.date.getTime() - a.date.getTime())[0];
              this.userService.getUser(this.lastContribution.contributor_id)
              .then(contributor => this.lastContributor = contributor);
            });
            this.apiService.getApisByProvider(this.provider).then(apis => {
              this.restApis = apis;
            });
          }
        }, err => {
          this.router.navigate(['404']);
        })
    );
  }

  goToAPI(api) {
    this.router.navigate(['api', api._id]);
  }

  goToContributor() {
    this.router.navigate(['user', this.lastContributor._id]);
  }

  getMomentFromNow() {
    return moment(this.lastContribution.date).fromNow();
  }

  goToEditProvider() {
    this.router.navigate(['provider', this.provider._id, 'edit']);
  }

  deleteProvider() {
    this.providerService.deleteProvider(this.provider._id);
    this.router.navigate(['']);
  }

  openModalDeleteProvider(content) {
    this.modalService.open(content, { centered: true });
  }
}
