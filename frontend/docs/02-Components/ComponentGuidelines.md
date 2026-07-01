# Component Guidelines

To ensure maximum performance and reusability, Workora components are strictly divided into two categories: **Smart (Container)** and **Dumb (Presentational)** components.

## 1. Smart Components (Pages)
Located in `presentation/features/{module}/pages/`.

- **Responsibility**: Connect to the NgRx Store or Signals to fetch state. Dispatch actions to mutate state.
- **Rule**: They should have minimal to no HTML/CSS of their own. Their template should mostly consist of passing `[data]` down to Dumb components and listening to `(events)`.
- **Naming**: Suffixed with `Page` (e.g., `EmployeeListPageComponent`).

## 2. Dumb Components (Presentational)
Located in `presentation/features/{module}/components/` or `presentation/shared/components/`.

- **Responsibility**: Pure UI rendering. 
- **Rule**: They must NEVER inject the Store, HttpClient, or API services.
- **Data Flow**: They receive data solely via `@Input()` and communicate changes solely via `@Output()` EventEmitter.
- **Performance**: Must strictly use `ChangeDetectionStrategy.OnPush`.

```typescript
@Component({
  selector: 'app-employee-card',
  templateUrl: './employee-card.component.html',
  styleUrls: ['./employee-card.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush // Mandatory for Dumb Components
})
export class EmployeeCardComponent {
  @Input() employee!: Employee;
  @Output() viewDetails = new EventEmitter<string>();
}
```

## 3. General Best Practices
- **TrackBy**: Always use `trackBy` in `*ngFor` loops to prevent unnecessary DOM destruction/recreation.
- **Async Pipe**: Always use the `| async` pipe in templates to subscribe to Observables. Never `.subscribe()` manually in a component unless absolutely necessary (and if so, manage the teardown in `ngOnDestroy` using `takeUntilDestroyed`).
- **Strict Typing**: Avoid `any` in inputs and outputs. Use the Domain models.
