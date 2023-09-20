import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from "@angular/platform-browser";

@Pipe({
  name: 'video'
})
export class VideoPipe implements PipeTransform {

  constructor(private domSanitizer: DomSanitizer) {

  }

  transform(value: string, url: string): unknown {
    return this.domSanitizer.bypassSecurityTrustResourceUrl(url + value);
  }

}
