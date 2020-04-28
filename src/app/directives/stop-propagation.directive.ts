import { Directive, Input, OnInit, OnDestroy, ElementRef } from '@angular/core';
@Directive({
    // tslint:disable-next-line: directive-selector
    selector: '[stopPropagation]'
})
export class StopPropagationDirective implements OnInit, OnDestroy {
    @Input()
    private stopPropagation: string | string[];
    get element(): HTMLElement {
        return this.elementRef.nativeElement;
    }
    get events(): string[] {
        if (typeof this.stopPropagation === 'string') {
            return [this.stopPropagation];
        }
        return this.stopPropagation;
    }
    constructor(private elementRef: ElementRef) { }
    onEvent = (event: Event) => {
        event.stopPropagation();
    };
    ngOnInit() {
        for (const event of this.events) {
            this.element.addEventListener(event, this.onEvent);
        }
    }
    ngOnDestroy() {
        for (const event of this.events) {
            this.element.removeEventListener(event, this.onEvent);
        }
    }
}
