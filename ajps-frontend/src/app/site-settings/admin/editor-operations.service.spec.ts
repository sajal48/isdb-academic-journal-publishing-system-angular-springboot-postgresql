import { TestBed } from '@angular/core/testing';

import { EditorOperationsService } from './editor-operations.service';

describe('EditorOperationsService', () => {
  let service: EditorOperationsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EditorOperationsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
