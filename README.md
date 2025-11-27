# solid-modal-manager

Minimal, type-safe modal manager for SolidJS.

## Install

```bash
npm install solid-modal-manager
# or
pnpm add solid-modal-manager
# or
yarn add solid-modal-manager
```

Make sure `solid-js` is installed (peer dependency).

## Quick usage

Wrap your app with the provider and register modals:

```tsx
import { render } from "solid-js/web";
import { ModalWindowProvider } from "solid-modal-manager";
import "solid-modal-manager/style/index.css";
import App from "./App";
import LoginModal from "./modals/LoginModal";

const MODALS = {
  [EModalKeys.LOGIN]: (props?: ILoginModalProps) => <LoginModal {...props} />
} as const;

render(
  () => (
    <ModalWindowProvider modals={MODALS}
    >
      <App />
    </ModalWindowProvider>
  ),
  document.getElementById("root")!
);
```

Open / close modal from any component:

```tsx
import { useModalWindow } from "solid-modal-manager";

const OpenLoginButton = () => {
  const login = useModalWindow(EModalKeys.LOGIN);
  // pass payload (optional)
  return <button onClick={() => login.handleOpen({ payload: { userId: 123 } })}>Open</button>;
};
```

Inside modal component you can read `props` passed from the manager:

```tsx
const LoginModal = (props: ILoginModalProps) => {
  // props contains payload set by handleOpen / handleToggleVisibility
  return <div>Modal content - {JSON.stringify(props)}</div>;
};
```

## Notes

- Use `as const` on `modals` to keep type-safe keys.
- Import the provided CSS or copy `.modal-backdrop` styles to your project.
- API: `ModalWindowProvider`, `useModalWindow(key) -> IModalWindowState` (access `handleOpen`, `handleClose`, `handleToggleVisibility`, `isOpen`, `props`).

