import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModificarTourComponent } from './modificar-tour.component';

describe('ModificarTourComponent', () => {
  let component: ModificarTourComponent;
  let fixture: ComponentFixture<ModificarTourComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModificarTourComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModificarTourComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
