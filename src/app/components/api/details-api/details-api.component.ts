import { Component, OnInit, AfterViewInit } from '@angular/core';
import { TranslatableComponent } from '../../shared/translatable/translatable.component';
import { TranslateService } from '@ngx-translate/core';
import { APIService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/models/user';
import { Params, ActivatedRoute, Router } from '@angular/router';
import { API } from 'src/app/models/api';
import { VersionService } from 'src/app/services/version.service';
import { Version } from 'src/app/models/version';
import { ProviderService } from 'src/app/services/provider.service';
import { Provider } from 'src/app/models/provider';
import { UserService } from 'src/app/services/user.service';
import { HistoryContributionService } from 'src/app/services/historyContribution.service';
import { HistoryContribution } from 'src/app/models/historyContribution';
import { faCaretSquareDown } from '@fortawesome/free-solid-svg-icons';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import * as fileDownload from 'js-file-download';

declare class NestedVersion {
  version: Version;
  subVersions: NestedVersion[];
}

@Component({
  selector: 'app-details-api',
  templateUrl: './details-api.component.html',
  styleUrls: ['./details-api.component.css']
})
export class DetailsAPIComponent extends TranslatableComponent implements OnInit {

  currentUser: User;
  activeRole: string;
  restApi: API;
  provider: Provider;
  versions: NestedVersion[];
  selectedVersion: Version;
  contributions: HistoryContribution[];
  lastContribution: HistoryContribution;
  lastContributionDateFromNow: Date;
  lastContributor: User;

  apiDocName: string;
  linkBlobDoc: string;

  faCaretSquareDown = faCaretSquareDown;

  constructor(
    public translateService: TranslateService,
    private modalService: NgbModal,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private apiService: APIService,
    private providerService: ProviderService,
    private versionService: VersionService,
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
        this.apiService.getApi(params.id).then(api =>  {
          if (!api) {
            this.router.navigate(['404']);
          } else {
            this.restApi = api;
            this.providerService.getProvider(this.restApi.provider_id).then(provider => this.provider = provider);
            this.selectedVersion = this.restApi.versions[0];
            this.versionService.getAllVersions(this.restApi).then(versions => this.versions = this.nestSubVersions(versions));
            this.apiDocName = this.restApi.name + '-documentation.txt';
            this.historyContributionService.getAllhistoryContributionsByContribution(this.restApi._id, 'RestAPI')
            .then(contributions => {
              contributions.forEach(contribution => contribution.date = new Date(contribution.date));
              this.contributions = contributions;
              this.lastContribution = contributions.sort((a, b) => b.date.getTime() - a.date.getTime())[0];
              this.userService.getUser(this.lastContribution.contributor_id)
              .then(contributor => this.lastContributor = contributor);
            });
          }
        }, err => {
          this.router.navigate(['404']);
        })
    );
  }

  extractCategories(restApi: API) {
    return restApi.metadata.category != null ?
      typeof restApi.metadata.category === 'string' ?
        restApi.metadata.category : restApi.metadata.category.join(', ') : '';
  }

  goToProvider() {
    this.router.navigate(['provider', this.provider._id]);
  }

  goToContributor() {
    this.router.navigate(['user', this.lastContributor._id]);
  }

  getMomentFromNow() {
    return moment(this.lastContribution.date).fromNow();
  }

  popupToS() {
    window.open(this.restApi.metadata.termsOfService);
  }

  downloadOriginalDocumentation() {
    fileDownload.default(this.restApi.versions[0].originalDocumentation, this.apiDocName);
  }

  redirectToAPIRoot() {
    if (typeof(this.restApi.metadata.url) === 'string') {
      window.location.replace(this.restApi.metadata.url);
    } else {
      window.location.replace(this.restApi.metadata.url[0]);
    }
  }

  goToEditAPI() {
    this.router.navigate(['api', this.restApi._id, 'edit']);
  }

  deleteAPI() {
    this.apiService.deleteApi(this.restApi._id);
    this.router.navigate(['']);
  }

  openModalDeleteAPI(content) {
    this.modalService.open(content, { centered: true });
  }

  nestSubVersions(versions: Version[]): NestedVersion[] {
    const result: NestedVersion[] = [];
    versions.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()).forEach(version => {
      if (version.number.match(/^v[0-9]+\.[0-9]+\.[0-9]+$/)) {
        const nestedVersion = result.find(
          v => v.version.number.slice(0, v.version.number.indexOf('.')) === version.number.slice(0, version.number.indexOf('.'))
        );
        if (nestedVersion) {
          const subNestedVersion = result.find(
            v => v.version.number.slice(0, v.version.number.lastIndexOf('.')) === version.number.slice(0, version.number.lastIndexOf('.'))
          );
          if (subNestedVersion) {
            subNestedVersion.subVersions.push({ version, subVersions: null });
          } else {
            nestedVersion.subVersions.push({ version, subVersions: [] });
          }
        } else {
          result.push({ version, subVersions: [] });
        }
      } else {
        result.push({ version, subVersions: [] });
      }
    });
    return result;
  }
}
