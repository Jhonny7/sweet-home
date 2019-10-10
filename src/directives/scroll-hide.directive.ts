import { Content } from 'ionic-angular';
import { Directive, ElementRef, Input, Renderer2, SimpleChanges, OnDestroy } from '@angular/core';
import { log } from 'util';


@Directive({
    selector: '[scrollHide]'
})
export class ScrollHideDirective implements OnDestroy {
    ngOnDestroy(): void {
        this.a.style.marginTop = `${this.config.maxValue}px`;
    }

    @Input('scrollHide') config: ScrollHideConfig;
    @Input('scrollContent') scrollContent: Content;

    contentHeight: number;
    scrollHeight: number;
    lastScrollPosition: number;
    lastValue: number = 0;
    lastValueMax: number = 0;
    public a: any;
    constructor(private element: ElementRef, private renderer: Renderer2) {
        this.a = document.getElementsByClassName("scroll-content");
    }

    ngOnChanges(changes: SimpleChanges) {
        let posicion: number = 0;
        for (let index = 0; index < this.a.length; index++) {
            const element: any = this.a[index];
            for (let j = 0; j < element.children.length; j++) {
                const element2 = element.children[j];
                //console.log(element2);
                if (element2.id) {
                    if (element2.id == this.config.property) {
                        posicion = index;
                    }
                }
            }
        }
        this.a = this.a[posicion];
        //console.log(this.a);

        if (this.scrollContent && this.config) {
            this.lastValueMax = this.config.maxValue;
            console.log(this.lastValueMax);
            this.scrollContent.ionScrollStart.subscribe((ev) => {
                this.contentHeight = this.scrollContent.getScrollElement().offsetHeight;
                this.scrollHeight = this.scrollContent.getScrollElement().scrollHeight;
                if (this.config.maxValue === undefined) {
                    this.config.maxValue = this.element.nativeElement.offsetHeight;
                }
                this.lastScrollPosition = ev.scrollTop;
            });
            this.scrollContent.ionScroll.subscribe((ev) => this.adjustElementOnScroll(ev));
            this.scrollContent.ionScrollEnd.subscribe((ev) => this.adjustElementOnScroll(ev));
        }
    }

    private adjustElementOnScroll(ev) {
        if (ev) {
            ev.domWrite(() => {
                let scrollTop: number = ev.scrollTop > 0 ? ev.scrollTop : 0;

                let scrolldiff: number = scrollTop - this.lastScrollPosition;
                let scrolldiff2: number = scrollTop + this.lastScrollPosition;
                //console.log(scrolldiff2);

                //console.log("--------------");

                //console.log(scrolldiff);
                //console.log("..............");


                this.lastScrollPosition = scrollTop;
                //console.log("ScrollPosition: "+this.lastScrollPosition);

                let newValue = this.lastValue + scrolldiff;

                let newValue2 = this.lastValueMax + scrolldiff2;

                newValue = Math.max(0, Math.min(newValue, this.config.maxValue));

                newValue2 = Math.min(this.config.maxValue, Math.max(newValue2, 0));
                newValue2 = Math.min(this.config.maxValue, Math.min(newValue, 0));
                console.log("--------------");
                console.log(newValue);
                console.log("..............");
                console.log(newValue2);

                console.log("--------------");
                this.renderer.setStyle(this.element.nativeElement, this.config.cssProperty, `-${newValue}px`);

                let valor

                this.a.style.marginTop = `-${newValue}px`;

                this.lastValue = newValue;
            });
        }
    }
}
export interface ScrollHideConfig {
    cssProperty: string;
    maxValue: number;
    property: string;
}