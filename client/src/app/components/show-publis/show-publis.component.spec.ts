import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowPublisComponent } from './show-publis.component';

describe('ShowPublisComponent', () => {
  let component: ShowPublisComponent;
  let fixture: ComponentFixture<ShowPublisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShowPublisComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShowPublisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
