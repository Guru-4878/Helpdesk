import { Component, ChangeDetectorRef, OnInit, ViewChild, ElementRef, AfterViewInit, Renderer2, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html'
})
export class SidebarComponent implements OnInit {
  menuList: any;
  selected: any;
  thistoggleclass: string;
  display: string = 'none';
  selectedclass: string;
  pcodedtrigger: string = '0';
  breadcrumbs: string[] = [];
  constructor(private renderer: Renderer2, router: Router, private cdr: ChangeDetectorRef, private el: ElementRef) {
    var bc = this.breadcrumbs;
    router.events.subscribe((evt) => {
      if (evt instanceof NavigationEnd) {
        var url = evt.url;
        if (url === '' || url === '/') {
          bc.length = 0;
        } else {
          bc.push(evt.url.substr(1));
        }
      }
    });
    //console.log(bc);
  }

  ngOnInit(): void {
    this.menuList = this.MENU;
  }
  ngAfterViewInit() {

    this.cdr.detectChanges();
  }
  MENU: MenuItem[] = [
    {
      label: 'Registration',
      link: '/HelpDesk/Process/Registration',
      icon: 'fa fa-home',
      subItems: []
    },
    {
      label: 'Dash Board',
      link: '/HelpDesk/Process/Dashboard',
      icon: 'fa fas fa-tachometer-alt',
      subItems: []
    },
    {
      label: 'Search',
      link: '/HelpDesk/Process/search',
      icon: 'fa fa-search',
      subItems: []
    }
    //{
    //  label: 'Reports',
    //  icon: 'fas fa-chart-pie',
    //  subItems: [
    //    {
    //      label: 'Duration Report',
    //      link: '/apps/Reports/Duration',
    //    },
    //    {
    //      label: 'Weekend Staff Report',
    //      link: '/apps/Reports/Weekend'
    //    },
    //    {
    //      label: 'Critical Incident Report',
    //      link: '/apps/Reports/Critical'
    //    },
    //  ]
    //}
  ];
  collapseClickEvent(config) {

  }
  toggleClass(classstring: string) {
    this.thistoggleclass = classstring;
    let myTag = this.el.nativeElement.querySelector('ul_' + classstring);
    this.getColor(this.thistoggleclass);
  }
  getColor(expmad) {
    if (expmad === this.thistoggleclass) {
      if (this.display == 'none') {
        this.display = 'block';
        return 'block'
      }
      else {
        this.display = 'none';
        return 'none'
      }
    }
    //return expmad === this.thistoggleclass ? 'block' : 'none'
  }
  select(item) {
    this.selected = item;
  };
  isActive(item) {
    return this.selected === item;
  };
  selectaddcss(item) {
    this.selectedclass = item;
    this.pcodedtrigger = 'pcoded-trigger';
  }
  addcss(item) {
    if (this.selectedclass == item) {
      if (this.pcodedtrigger == '0') {
        this.pcodedtrigger = 'pcoded-trigger';
        //pcoded-trigger
        return 'pcoded-trigger';
      }
      else {
        this.pcodedtrigger = '';
        return '';
      }
    }

  }

}

export interface MenuItem {
  id?: number;
  label?: string;
  icon?: string;
  link?: string;
  expanded?: boolean;
  subItems?: any;
  isTitle?: boolean;
  badge?: any;
  parentId?: number;
}
