export function getMenu(values: any): any[] {
  return [
    {
      title: values['sys']['title'],
      open: true,
      children: [
        {
          title: values['sys']['tag'],
          link: '/pages/sys/tag',
        },
        {
          title: values['sys']['env'],
          link: '/pages/sys/env',
        },
        {
          title: values['sys']['credential'],
          link: '/pages/sys/credential',
        },
      ],
      link: '/pages/certificate',
      menuIcon: 'icon icon-system',
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
      menuIcon: 'icon icon-safe-setting',
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
      menuIcon: 'icon icon-unarchived-item',
    },
    {
      title: values['trafficLayer']['title'],
      open: true,
      children: [
        {
          title: values['trafficLayer']['domain'],
          link: '/pages/traffic-layer/domain',
        },
        {
          title: values['trafficLayer']['recordDetails'],
          link: '/pages/traffic-layer/record-details',
        },
      ],
      link: '/pages/traffic-layer',
      menuIcon: 'icon icon-domain',
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
      menuIcon: 'icon icon-member',
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
      menuIcon: 'icon icon-module',
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
      ],
      link: '/pages/rbac',
      menuIcon: 'icon icon-license',
    },
  ];
}

