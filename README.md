# veera-ng-ui-kit

Angular component library built on the white + orange design tokens: **Button, Chip, Tabs, Sidenav, Checkbox, Radio, Toggle, Select, Dropdown, Modal, Tooltip, Alert, Toast, Progress, Card, Badge, Avatar.**

All components are **standalone** (Angular 15+), so you import only what you use — no giant `SharedModule` needed.

## Pick your own colors

When someone installs this package, `postinstall` runs a small interactive prompt (no dependencies, just Node's built-in `readline`) asking for a primary color, plus optional background/text colors. It derives the full tint/shade ramp (50/100/300/500/600/700) with HSL math and writes `src/ui-kit-theme.css` in the consuming project.

```
$ npm install veera-ng-ui-kit

ng-ui-kit — theme setup
Press Enter to accept the default shown in [brackets].

Primary color hex [#FF7A1A]: #2563EB
Background (white) color hex [#FFFFFF]:
Text (black) color hex [#14171C]:

✔ Wrote src/ui-kit-theme.css
```

Then import it **after** `tokens.css`:
```json
"styles": [
  "node_modules/veera-ng-ui-kit/tokens.css",
  "src/ui-kit-theme.css"
]
```

Re-run it any time to change colors: `npx ng-ui-kit-theme`.

**Safety notes:**
- In CI or any non-interactive shell, it detects there's no TTY and silently writes the default orange theme instead of hanging the install. Confirmed by testing an actual `npm install` end-to-end.
- Skip it entirely with `UI_KIT_SKIP_PROMPT=1 npm install`.
- Some teams/lockfiles run installs with `--ignore-scripts`, which skips `postinstall` entirely — in that case just run `npx ng-ui-kit-theme` manually after install.


## Build & publish

This is source, not a pre-built package — build it with `ng-packagr` before publishing:

```bash
cd ng-ui-kit
npm install
npm run build          # ng-packagr build, then re-attaches the postinstall hook

cd ../dist/ng-ui-kit
npm publish --access public   # after renaming "name" in package.json to something you own
```

> **Why two steps under the hood?** `ng-packagr` strips `scripts` and `devDependencies` from the built `package.json` for security reasons — that would silently delete our `postinstall` hook. `npm run build` also runs `scripts/prepare-dist.js` afterward, which copies `bin/init-theme.js` into the dist package and re-adds `"postinstall"` to `dist/ng-ui-kit/package.json`. This was verified with a real `npm install` of the built package — the theme file was generated correctly.

To use it locally in an Angular app before publishing:

```bash
npm run build
cd your-angular-app
npm link ../ng-ui-kit/dist/ng-ui-kit
```

## Install the tokens

Add the stylesheet once, globally, in `angular.json`:

```json
"styles": [
  "node_modules/veera-ng-ui-kit/tokens.css",
  "src/styles.scss"
]
```

(All component styles reference these CSS custom properties — without this file loaded, components render unstyled.)

## Usage

Import each component directly into your standalone component's `imports` array (or an `NgModule`'s `imports` if you're not using standalone components).

### Button
```ts
import { ButtonComponent } from 'veera-ng-ui-kit';

@Component({
  standalone: true,
  imports: [ButtonComponent],
  template: `<ui-button variant="primary" size="md" (click)="save()">Save changes</ui-button>`
})
```
`variant`: `primary | secondary | ghost | danger` · `size`: `sm | md | lg` · `disabled`, `iconOnly`: boolean

### Chip
```html
<ui-chip [selectable]="true" [(selectedChange)]="isSelected">Active</ui-chip>
<ui-chip [removable]="true" (remove)="onRemove(tag)">{{ tag }}</ui-chip>
<ui-chip dotColor="var(--color-semantic-success)">Online</ui-chip>
```

### Tabs
```ts
tabs = [{ id: 'overview', label: 'Overview' }, { id: 'activity', label: 'Activity' }];
activeTab = 'overview';
```
```html
<ui-tabs [tabs]="tabs" [(activeIdChange)]="activeTab" variant="underline"></ui-tabs>
```

### Sidenav
```ts
groups = [{
  label: 'Workspace',
  items: [
    { id: 'dashboard', label: 'Dashboard', icon: '▦' },
    { id: 'projects', label: 'Projects', icon: '▤', badge: '12' },
  ],
}];
```
```html
<ui-sidenav [groups]="groups" [(activeIdChange)]="activeId"></ui-sidenav>
```

### Checkbox / Radio / Toggle
All three implement `ControlValueAccessor`, so they work with `ngModel` and reactive forms:
```html
<ui-checkbox [(ngModel)]="emailNotifications">Email notifications</ui-checkbox>
<ui-radio name="plan" value="monthly" [checked]="plan === 'monthly'" (checkedChange)="plan = $event">Monthly</ui-radio>
<ui-toggle formControlName="darkMode">Dark mode</ui-toggle>
```

### Select
```ts
options = [{ label: 'Free plan', value: 'free' }, { label: 'Pro plan', value: 'pro' }];
```
```html
<ui-select [options]="options" [(ngModel)]="selectedPlan"></ui-select>
```

### Dropdown
```html
<ui-dropdown>
  <button trigger class="my-trigger">Actions ▾</button>
  <ng-container menu>
    <ui-dropdown-item (click)="edit()">Edit</ui-dropdown-item>
    <ui-dropdown-item [danger]="true" (click)="delete()">Delete</ui-dropdown-item>
  </ng-container>
</ui-dropdown>
```

### Modal
```html
<ui-button (click)="modalOpen = true">Delete project</ui-button>

<ui-modal [open]="modalOpen" [(openChange)]="modalOpen" title="Delete this project?">
  This will permanently remove the project. This action can't be undone.
  <div actions>
    <ui-button variant="secondary" (click)="modalOpen = false">Cancel</ui-button>
    <ui-button variant="danger" (click)="confirmDelete()">Delete</ui-button>
  </div>
</ui-modal>
```

### Tooltip
```html
<button [uiTooltip]="'Runs the export job'">Hover me</button>
```

### Alert
```html
<ui-alert type="success" title="Deployment succeeded">All checks passed and the build is live.</ui-alert>
<ui-alert type="danger" title="Payment failed">Update your billing details.</ui-alert>
```

### Toast
Inject the service anywhere, mount `<ui-toast-container>` once near your app root:
```ts
constructor(private toast: ToastService) {}
save() { this.toast.show('Changes saved successfully'); }
```
```html
<!-- app.component.html, once -->
<ui-toast-container></ui-toast-container>
```

### Progress
```html
<ui-progress [value]="62" label="Uploading assets"></ui-progress>
<ui-progress [value]="100" label="Migration complete" variant="success"></ui-progress>
<ui-progress [value]="94" label="Storage used" variant="danger"></ui-progress>
```

### Card
```html
<ui-card title="Latency" subtitle="Last 24 hours" variant="elevated">
  Median response time across all active endpoints: 142ms.
  <div footer>
    <ui-button variant="ghost" size="sm">View details</ui-button>
  </div>
</ui-card>
```
`variant`: `flat | bordered | elevated` · `clickable`: boolean · slots: default content, `header-actions`, `footer`, `media`

### Badge
```html
<ui-badge variant="success">Passing</ui-badge>
<ui-badge variant="danger">Failed</ui-badge>
<ui-badge variant="neutral">Draft</ui-badge>
```
Note: `Badge` is a static status label; `Chip` (above) is for interactive/selectable/removable tags.

### Avatar
```html
<ui-avatar name="Jordan Lee" size="md" status="online"></ui-avatar>
<ui-avatar src="https://example.com/photo.jpg" name="Priya Shah" size="lg"></ui-avatar>
```
Falls back to initials automatically if `src` is empty or the image fails to load.

## Component reference

| Component | Selector | Key inputs |
|---|---|---|
| Button | `ui-button` | `variant`, `size`, `disabled`, `iconOnly` |
| Chip | `ui-chip` | `selected`, `selectable`, `removable`, `dotColor` |
| Tabs | `ui-tabs` | `tabs`, `activeId`, `variant` |
| Sidenav | `ui-sidenav` | `groups`, `activeId` |
| Checkbox | `ui-checkbox` | `checked`, `disabled` (CVA-compatible) |
| Radio | `ui-radio` | `name`, `value`, `checked` |
| Toggle | `ui-toggle` | `checked`, `disabled` (CVA-compatible) |
| Select | `ui-select` | `options`, `value` (CVA-compatible) |
| Dropdown | `ui-dropdown` + `ui-dropdown-item` | content-projected `trigger` / `menu` slots |
| Modal | `ui-modal` | `open`, `title`, `closeOnOverlayClick` |
| Tooltip | `[uiTooltip]` directive | `uiTooltip` (text) |
| Alert | `ui-alert` | `type`, `title` |
| Toast | `ToastService` + `ui-toast-container` | `.show(message, duration?)` |
| Progress | `ui-progress` | `value`, `label`, `variant` |
| Card | `ui-card` | `title`, `subtitle`, `variant`, `clickable` |
| Badge | `ui-badge` | `variant` |
| Avatar | `ui-avatar` | `src`, `name`, `size`, `status` |

## Notes

- All components are `standalone: true` — Angular 15+ required (peer dependency).
- Form controls (`Checkbox`, `Toggle`, `Select`) implement `ControlValueAccessor` for full forms support.
- `Modal` is a simple presentational component (`*ngIf`-driven), not an Angular CDK overlay — good for most cases; swap in `@angular/cdk/overlay` if you need advanced positioning, focus trapping, or stacking multiple modals.
- `Tooltip` builds its bubble with `Renderer2` rather than a component, to keep it a lightweight zero-dependency directive.
