import type { AppRouteModule } from '/@/router/types'

import { LAYOUT } from '/@/router/constant'
import { t } from '/@/hooks/web/useI18n'

const about: AppRouteModule = {
  path: '/about',
  name: 'About',
  component: LAYOUT,
  redirect: '/about/index',
  meta: {
    hideChildrenInMenu: true,
    icon: 'mingcute:alert-diamond-fill',
    title: '日志',
    orderNo: 100000,
  },
  children: [
    {
      path: 'index',
      name: 'Log',
      component: () => import('/@/views/sys/about/index.vue'),
      meta: {
        title: '日志分析',
        icon: 'mingcute:alert-diamond-fill',
        hideMenu: true,
      },
    },
  ],
}

export default about
