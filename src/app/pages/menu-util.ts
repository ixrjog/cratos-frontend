export function getMenu(values: any): any[] {
  return [
    {
      title: values['gettingStarted']['title'],
      open: false,
      children: [
        {
          title: values['gettingStarted']['sample'],
          link: '/pages/getting-started/sample',
        },
      ],
      link: '/pages/getting-started',
      menuIcon: 'icon icon-console',
    },
    {
      title: values['sys']['title'],
      open: true,
      children: [
        {
          title: values['sys']['tag'],
          link: '/pages/sys/tag',
        },
        {
          title: values['sys']['credential'],
          link: '/pages/sys/credential',
        },
      ],
      link: '/pages/certificate',
      menuIcon: 'icon icon-console',
    },
    {
      title: values['certificate']['title'],
      open: true,
      children: [
        {
          title: values['certificate']['list'],
          link: '/pages/certificate/list',
        },
      ],
      link: '/pages/certificate',
      menuIcon: 'icon icon-console',
    },
    {
      title: values['channelNetwork']['title'],
      open: true,
      children: [
        {
          title: values['channelNetwork']['list'],
          link: '/pages/channel-network/list',
        },
      ],
      link: '/pages/channel-network',
      menuIcon: 'icon icon-console',
    },
    {
      title: values['user']['title'],
      open: true,
      children: [
        {
          title: values['user']['list'],
          link: '/pages/user/list',
        },
      ],
      link: '/pages/user',
      menuIcon: 'icon icon-console',
    },
    {
      title: values['eds']['title'],
      open: true,
      children: [
        {
          title: values['eds']['instance'],
          link: '/pages/eds/instance',
        },
        {
          title: values['eds']['config'],
          link: '/pages/eds/config',
        },
      ],
      link: '/pages/eds',
      menuIcon: 'icon icon-console',
    },
    {
      title: values['rbac']['title'],
      open: true,
      children: [
        {
          title: values['rbac']['resource'],
          link: '/pages/rbac/resource',
        },
        {
          title: values['rbac']['role'],
          link: '/pages/rbac/role',
        },
        {
          title: values['rbac']['userRole'],
          link: '/pages/rbac/user-role',
        },
      ],
      link: '/pages/rbac',
      menuIcon: 'icon icon-console',
    },
  ];
}

