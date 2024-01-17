export function getMenu(values: any): any[] {
  return [
    {
      title: values['gettingStarted']['title'],
      open: true,
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
          title: values['certificate']['manage'],
          link: '/pages/certificate/manage',
        },
      ],
      link: '/pages/certificate',
      menuIcon: 'icon icon-console',
    },
  ];
}

