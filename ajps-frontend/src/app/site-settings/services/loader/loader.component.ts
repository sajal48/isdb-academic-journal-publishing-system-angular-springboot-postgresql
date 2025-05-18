import { Component, OnInit } from '@angular/core';
import { LoaderService } from '../loader.service';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-loader',
  imports: [NgIf],
  templateUrl: './loader.component.html',
  styleUrl: './loader.component.css'
})
export class LoaderComponent implements OnInit {
  loading = false;

  constructor(private loaderService: LoaderService) {}

  ngOnInit(): void {
    this.loaderService.isLoading.subscribe(status => {
      this.loading = status;
    });
  }
}
