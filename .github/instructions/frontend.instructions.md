---
name: Frontend Coding Rules
applyTo: "*.ts,*.tsx"
---

# Frontend Coding Rules

## Language

- Use TypeScript strictly.
- Avoid `any` unless absolutely necessary.
- All components must have explicit prop types.

## Component Props Guidelines

- When a component has **more than 3 props**, it must accept a **single props object**:

```ts
type ZoomControlsProps = {
  onZoomIn: () => void;
  onZoomOut: () => void;
  resetZoom: () => void;
  zoomLevel: number;
};

function ZoomControls(p: ZoomControlsProps) {
  return (
    <div>
      <button onClick={p.onZoomIn}>+</button>
      <button onClick={p.onZoomOut}>-</button>
      <button onClick={p.resetZoom}>Reset</button>
      <span>{p.zoomLevel}</span>
    </div>
  );
}
```

- **Props Destructuring**
  - Only use destructuring to **resolve TypeScript typing issues** or **reduce local verbosity**.
  - Destructuring should be done inside the component body, and avoid destructuring entire deeply nested objects.
  - **Example**:

```ts
function UserCard(p: { user: { name: string; age: number } }) {
  const { name } = p.user; // destructure only necessary fields
  return <div>{name}</div>;
}
```

## Self-Check

- For every `t("key")` added in new code, verify the key exists in both `src/lib/i18n/en.json` and `src/lib/i18n/zh.json`.
