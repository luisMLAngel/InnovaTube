import { Component } from '@angular/core';
import {
  CompactSearchComponent,
  SearchEvent,
} from '../../../shared/components/ui/compact-search.component';
import { VideoListComponent } from '../../../shared/components/video-list.component';

@Component({
  selector: 'app-videos',
  templateUrl: './videos.page.html',
  imports: [CompactSearchComponent, VideoListComponent],
})
export class VideosPage {
  constructor() {}

  onSearch(query: SearchEvent) {
    // Aquí puedes manejar la lógica de búsqueda con el query recibido
    console.log('Búsqueda realizada con el query:', query);
  }
}
