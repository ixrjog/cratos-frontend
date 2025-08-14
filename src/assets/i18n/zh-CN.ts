import pages from './zh-CN/page';
import start from './zh-CN/start';
import personalize from './zh-CN/personalize';
import authGuard from './zh-CN/auth-guard';
import footer from './zh-CN/footer';
import header from './zh-CN/header';
import login from './zh-CN/login';
import register from './zh-CN/register';
import workOrderTicket from './zh-CN/work-order-ticket';
import kubernetes from './zh-CN/kubernetes';
import { webTerminal } from './zh-CN/web-terminal';

export default {
  ...pages,
  ...start,
  ...personalize,
  ...authGuard,
  ...footer,
  ...header,
  ...login,
  ...register,
  ...workOrderTicket,
  ...kubernetes,
  webTerminal,
};
