import {Component, AfterViewInit} from '@angular/core';
import {AppConfig} from "../../../../app.config";
import {PermissionResolverService, UrebalPermissions} from "../../../services/permission-resolver.service";
import {Router} from "@angular/router";
import {URebalService} from "../../../services/urebal.service";


@Component({
    selector: 'urebal-sidebar',
    templateUrl: './urebal-sidebar.component.html',
    styleUrls: ['./urebal-sidebar.component.css']
})
export class UrebalSidebarComponent extends UrebalPermissions implements AfterViewInit {

    private tomsURL: string;
    dataImportAllowed: boolean = false;
    isSecurityAttributesAllowed: boolean = false;

    constructor(permissionResolverService: PermissionResolverService,
                public urebalService: URebalService,
    ) {
        super(permissionResolverService);
        this.tomsURL = AppConfig.TOMS_URL;
        this.dataImportAllowed = this.isAllowed('importData');
        this.isSecurityAttributesAllowed = this.isAllowed('modelViewAssetModel');
    }


    ngAfterViewInit() {
        this.activeMainMenu();
        let manageTradesLink = "manageTradesLink";
        $('#manageTradesLink').css("display", this.urebalService.config(manageTradesLink));
        if (!this.dataImportAllowed && this.urebalService.config(manageTradesLink) == 'none') {
            $('ul > .quicklinks').removeClass('quicklinks');
        }

    }

    toggleMenuItem = function (e) {
        let target = e.target;
        $('.drawer-items li').find('.drawer-item-label').css('color', '#36454f');
        if ($(target).parent().parent().hasClass('open')) {

            $(target).parent().parent().removeClass('open');
            $(target).removeClass('rotate-caret');
            $(target).parent().parent().find('.drawer-item-label').css('color', '#36454f');

            $('.drawer-submenu-level-2').find('.arrow').removeClass('rotate-caret');

        } else {
            $('.drawer-items li').removeClass('open');
            $('.drawer-items li').not('.active.open').find('.caret').removeClass('rotate-caret');

            $(target).parent().parent().addClass('open');
            $(target).addClass('rotate-caret');
            $(target).parent().parent().find('.drawer-item-label').css('color', '#007dc4');

            $('.drawer-submenu-level-2').find('.arrow').removeClass('rotate-caret');
            $('.drawer-items li').not('.active.open').find('.drawer-submenu-level-2 .drawer-submenu-level-2-items')
            .removeClass('open');
        }

    }


    /*
      Sidebar Main menu route link
     */
    routeMenuItem(e) {
        let target = e.target;
        let parentItem = e.target.parentElement;
        let routeStr = "";
        let parentMenu = "";

        $('.drawer-item-submenu li a').removeClass('active');

        if ($(target).data("route")) {
            routeStr = $(target).data("route");
            $(target).addClass('active');
            parentMenu = $(target).data("parent");

        } else {
            routeStr = $(parentItem).data("route");
            $(parentItem).removeClass('active');
            parentMenu = $(parentItem).data("parent");
        }


        let enRoute = [];
        enRoute.push(routeStr);

        $('#' + parentMenu).addClass('active open');
        //$(target).parent().parent().find('.toggleMenuItem').css('color', '#36454f');
        $('#' + parentMenu).find('.caret').addClass('rotate-caret');

        if ($('#' + parentMenu).hasClass('has-submenu')) {
            $('#' + parentMenu).find('.drawer-item-label').css('color', '#007dc4');
        }
        $('.drawer-items li').not('#' + parentMenu).find('.drawer-item-label').css('color', '#36454f');
        //$('.drawer-items li').not('.active.open').find('.caret').removeClass('rotate-caret');
        $('.drawer-items li').not('#' + parentMenu).find('.caret').removeClass('rotate-caret');

        $('.drawer-items li').not('#' + parentMenu).removeClass('active open');
        $('.drawer-items li').not('.active.open').find('.drawer-submenu-level-2 .drawer-submenu-level-2-items')
        .removeClass('open');
        $('.drawer-submenu-level-2').find('.arrow').removeClass('rotate-caret');


        if ($(parentItem).parent().hasClass('drawer-submenu-level-2-items open')) {
            $(parentItem).parent().prev().addClass('active');
            $(parentItem).parent().prev().find('.arrow').removeClass('rotate-caret');
            console.log($(parentItem).parent().prev());
        }
    }

    //submenu level two
    toggleSubmenu2(e) {

        let target = e.target;
        let hasKlass = null;

        if ($(target).hasClass('arrow')) {
            hasKlass = <boolean>$(target).parent().parent().find('.drawer-submenu-level-2-items').hasClass('open');

        } else {
            hasKlass = <boolean>$(target).parent().find('.drawer-submenu-level-2-items').hasClass('open');
        }

        if (hasKlass) {
            $('.drawer-submenu-level-2-items').removeClass('open');
            //$('.drawer-submenu-level-2-items').parent().parent().find('a').removeClass('active');
            $(target).find('.arrow').removeClass('rotate-caret');
            $(target).removeClass('rotate-caret');
            $('.drawer-submenu-level-2').find('a').removeClass('active');
            console.log('hasClass', $(target));


        } else {
            $('.drawer-submenu-level-2-items').removeClass('open');
            $('.drawer-submenu-level-2-items').parent().parent().find('a').removeClass('active');
            $('.drawer-submenu-level-2-items').parent().find('.arrow').removeClass('rotate-caret'); //all rotate-caret
            console.log('197');
            if ($(target).hasClass('arrow')) {
                $(target).parent().parent().find('.drawer-submenu-level-2-items').addClass('open');
                $(target).parent().addClass('active');
                $(target).addClass('rotate-caret');
                console.log('201');

            } else {
                $(target).parent().find('.drawer-submenu-level-2-items').addClass('open');
                $(target).addClass('active');
                $(target).find('.arrow').addClass('rotate-caret');
                //$('.drawer-submenu-level-2 a').find('.arrow').css({ transform: 'rotate(0deg)'});
                console.log('206');
            }

        }

    }


    activeMainMenu() {
        $('.drawer-items li a').each(function (i, v) {
            let href = window.location.pathname.replace('/app/', "");
            let r = $(v).data("route");

            if (href == r) {

                //Parent Menu
                let parentMenu = $(v).data("parent");
                $('#' + parentMenu).addClass('active open');

                //submenu level one
                $(v).addClass('active');

                //submenu level two
                if ($(v).parent().parent().hasClass('drawer-submenu-level-2-items')) {
                    $('.drawer-submenu-level-2-items').removeClass('open');
                    $('.drawer-submenu-level-2-items').parent().find('.arrow').removeClass('rotate-caret');
                    $(v).parent().parent().addClass('open');
                    $(v).parent().parent().prev().addClass('active');
                    console.log('v', $(v));
                    $(v).parent().parent().prev().find('.arrow').addClass('rotate-caret');
                }
            } else { //open parent default menu item when route link doesn't match
                let selectedItem = href.split('/');
                let parentMenu = '#' + selectedItem[0] + 'Link';
                $(parentMenu).addClass('active open');
            }

        });
    }


}
