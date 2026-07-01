# State Management (NgRx & Signals)

Workora uses a hybrid approach to state management, combining the robust predictability of **NgRx** (Redux pattern) for global state with the reactivity of **Angular Signals** for local component state.

## 1. Global State (NgRx)
Use NgRx for state that is shared across multiple modules or components, such as:
- Authenticated User Profile & Permissions
- Global UI states (e.g., sidebar toggled, theme mode)
- Heavy data collections (e.g., a master list of departments used in multiple dropdowns)

### Architecture of a Slice
- **Actions**: Define the events (`[Employee API] Load Employees Success`).
- **Reducers**: Pure functions mutating state.
- **Effects**: Side-effects (API calls). **Important**: Effects should call Data layer repositories, which return Domain models.
- **Selectors**: Memoized queries fetching slices of state for the UI.

## 2. Local State (Angular Signals)
Use Angular Signals for state that is isolated to a single component or a small widget.
- Toggling a local modal.
- Tracking the currently selected tab.
- Simple counter or form derived values.

```typescript
@Component({...})
export class LocalWidgetComponent {
  // Local state via Signal
  isOpen = signal(false);

  toggle() {
    this.isOpen.update(v => !v);
  }
}
```

## 3. Connecting State to Components
Smart components should inject the NgRx `Store` and use `selectSignal` to seamlessly integrate NgRx with modern Angular templates.

```typescript
@Component({...})
export class EmployeeListPageComponent {
  private store = inject(Store);
  
  // Expose state to the template as a Signal
  employees = this.store.selectSignal(selectAllEmployees);
  isLoading = this.store.selectSignal(selectEmployeeLoading);

  ngOnInit() {
    this.store.dispatch(EmployeeActions.loadEmployees());
  }
}
```
