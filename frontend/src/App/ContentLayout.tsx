import { Outlet } from 'react-router-dom';

import { Menu } from '@/components/Menu/Menu';

import { FOOTER_ITEMS, NAV_ITEMS } from '@/utils/navigation';

export function ContentLayout() {
  return (
    <Menu items={NAV_ITEMS} footerItems={FOOTER_ITEMS} title='База стандартов'>
      <Outlet />
    </Menu>
  );
}
