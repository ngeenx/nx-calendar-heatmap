import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NxAngularCalendarHeatmapComponent } from './nx-angular-calendar-heatmap.component';

describe('NxAngularCalendarHeatmapComponent', () => {
  let component: NxAngularCalendarHeatmapComponent;
  let fixture: ComponentFixture<NxAngularCalendarHeatmapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NxAngularCalendarHeatmapComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(NxAngularCalendarHeatmapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
