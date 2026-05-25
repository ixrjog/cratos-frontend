import { Component, OnInit } from '@angular/core';
import { Table, TABLE_DATA } from '../../../../@core/data/base-data';
import { onFetchData } from '../../../../@shared/utils/data-table.utli';
import { ApplicationCredentialPageQuery, ApplicationCredentialVO } from '../../../../@core/data/application-credential';
import { ApplicationCredentialService } from '../../../../@core/services/application-credential.service';
import { RELATIVE_TIME_LIMIT } from '../../../../@shared/constant/date.constant';
import { UserPageQuery, UserVO } from '../../../../@core/data/user';
import { map } from 'rxjs/operators';
import { UserService } from '../../../../@core/services/user.service';

@Component({
  selector: 'app-application-credential-data-table',
  templateUrl: './application-credential-data-table.component.html',
  styleUrls: [ './application-credential-data-table.component.less' ],
})
export class ApplicationCredentialDataTableComponent implements OnInit {

  isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

  protected readonly limit = RELATIVE_TIME_LIMIT;

  queryParam = {
    queryName: '',
    createdBy: '',
  };
  user: UserVO;

  table: Table<ApplicationCredentialVO> = JSON.parse(JSON.stringify(TABLE_DATA));

  constructor(private applicationCredentialService: ApplicationCredentialService,
              private userService: UserService) {
  }

  fetchData() {
    const param: ApplicationCredentialPageQuery = {
      ...this.queryParam,
      page: this.table.pager.pageIndex,
      length: this.table.pager.pageSize,
    };
    onFetchData(this.table, this.applicationCredentialService.queryCredentialPage(param));
  }

  onSearchUser = (term: string) => {
    const param: UserPageQuery = {
      length: 10, page: 1, queryName: term,
    };
    return this.userService.queryUserPage(param)
      .pipe(
        map(({ body }) =>
          body.data.map((user, index) => ({ id: index, option: user })),
        ),
      );
  };

  onUserChange(user: UserVO) {
    this.queryParam.createdBy = user?.username;
  }

  ngOnInit() {
    this.fetchData();
  }

  pageIndexChange(pageIndex) {
    this.table.pager.pageIndex = pageIndex;
    this.fetchData();
  }

  pageSizeChange(pageSize) {
    this.table.pager.pageSize = pageSize;
    this.fetchData();
  }

}
