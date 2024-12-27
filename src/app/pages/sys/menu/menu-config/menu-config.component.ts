import { Component, OnInit, ViewChild } from '@angular/core';
import { DataTableComponent, DValidateRules, SplitterOrientation } from 'ng-devui';
import { MenuService } from '../../../../@core/services/menu.service';
import { MenuEdit, MenuTypeEnum, MenuVO } from '../../../../@core/data/menu';
import { DIALOG_DATA, DialogUtil } from '../../../../@shared/utils/dialog.util';
import { FormLayout } from 'ng-devui/form';
import { TOAST_CONTENT, ToastUtil } from '../../../../@shared/utils/toast.util';
import { LANGUAGES } from '../../../../../config/language-config';

@Component({
  selector: 'app-menu-config',
  templateUrl: './menu-config.component.html',
  styleUrls: [ './menu-config.component.less' ],
})
export class MenuConfigComponent implements OnInit {
  @ViewChild(DataTableComponent, { static: true }) datatable: DataTableComponent;
  // splitter input
  orientation: SplitterOrientation = 'horizontal';
  splitBarSize = '2px';
  // splitter pane input
  size = '40%';
  minSize = '40%';
  maxSize = '40%';

  menuTypeOptions = [ MenuTypeEnum.MAIN, MenuTypeEnum.SUB ];
  menuData: Array<MenuVO> = [];

  rootMenu = [ {
    id: 0,
    name: 'Root',
    title: 'Root',
    link: '/pages',
    children: [],
    open: true,
    active: false,
  } ];

  langOptions = [ ...LANGUAGES ];
  selectMenu: MenuVO | MenuEdit = null;
  layoutDirection: FormLayout = FormLayout.Vertical;

  menuTitles = [];
  menuTitleJson = '';

  dialogDate = {
    warningOperateData: {
      ...DIALOG_DATA.warningOperateData,
    },
    content: {
      ...DIALOG_DATA.content,
    },
  };

  formRules: { [key: string]: DValidateRules } = {
    rule: { message: 'The form verification failed, please check.', messageShowType: 'text' },
    name: {
      validators: [ { required: true } ],
      message: 'name can not be null.',
    },
    link: {
      validators: [ { required: true } ],
      message: 'link can not be null.',
    },
    seq: {
      validators: [ { required: true } ],
      message: 'seq can not be null.',
    },
  };

  constructor(private menuService: MenuService,
              private dialogUtil: DialogUtil,
              private toastUtil: ToastUtil) {
  }

  ngOnInit() {
    this.getNavMenu();
  }

  getNavMenu() {
    this.menuService.getNavMenu()
      .subscribe(({ body }) => {
        body.items.map(item => this.deleteProperty(item));
        this.menuData = body.items;
        this.rootMenu[0].children = this.menuData;
        this.selectMenu = null;
      });
  }

  deleteProperty(menu: MenuVO) {
    if (!menu.children) {
      delete menu.children;
    } else {
      menu.children.map(res => this.deleteProperty(res));
    }
  }

  itemClick(event) {
    this.selectMenu = event.item;
    this.getMenuTitleJson();
  }

  menuToggle(event) {
    this.selectMenu = event.item;
    this.getMenuTitleJson();
  }

  getMenuTitleJson() {
    this.menuTitles = this.selectMenu['menuTitles'];
    this.menuTitleJson = '';
    setTimeout(() => {
      this.menuTitleJson = JSON.stringify(this.menuTitles, [ 'title', 'lang' ], 4);
    }, 500);
  }

  submitForm({ valid, directive }) {
    if (valid) {
      const param: MenuEdit = {
        ...this.selectMenu,
      };
      param.titles = JSON.parse(this.menuTitleJson);
      if (param.id) {
        this.menuService.updateMenu(param)
          .subscribe(() => {
            this.toastUtil.onSuccessToast(TOAST_CONTENT.UPDATE);
            this.getNavMenu();
          });
      } else {
        this.menuService.addMenu(param)
          .subscribe(() => {
            this.toastUtil.onSuccessToast(TOAST_CONTENT.ADD);
            this.getNavMenu();
          });
      }
    } else {
      console.log(directive);
    }
  }

  protected readonly JSON = JSON;
  protected readonly MenuTypeEnum = MenuTypeEnum;

  onRowNew() {
    this.selectMenu = {
      id: undefined,
      icon: '',
      link: this.selectMenu.link,
      menuType: this.selectMenu.id === 0 ? MenuTypeEnum.MAIN : MenuTypeEnum.SUB,
      name: this.selectMenu.name,
      parentId: this.selectMenu.id,
      seq: 1,
      valid: true,
    };
    this.getMenuTitleJson();
  }

  onRowDelete() {
    const dialogDate = {
      ...this.dialogDate.warningOperateData,
      content: this.dialogDate.content.delete,
    };
    this.dialogUtil.onDialog(dialogDate, () => {
      this.menuService.deleteMenuById({ menuId: this.selectMenu.id })
        .subscribe(() => {
          this.toastUtil.onSuccessToast(TOAST_CONTENT.DELETE);
          this.getNavMenu();
        });
    });
  }

  onMenuTitleChange(content: string) {
    this.menuTitleJson = content;
  }
}
