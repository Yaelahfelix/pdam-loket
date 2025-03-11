interface MenuDetail {
  menu_id: number;
  menu_name: string;
  link: string;
}

export interface MenuGroup {
  group_name: string;
  menus: MenuDetail[];
}
