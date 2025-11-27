/* eslint-disable @typescript-eslint/no-explicit-any */

import {Accessor, JSX, ParentComponent } from "solid-js";

/**
 * Options passed to modal control functions (open/toggle/close)
 */
interface IModalStateHandlerProps {
    /** Data that will be passed as props to the modal component */
    payload?: any;
    /** If true — closes all other open modals before opening this one */
    withCloseAll?: boolean;
}

/**
 * State and controls for a single modal window
 */
interface IModalWindowState {
    /** Modal component (function that receives props and returns JSX) */
    component: (props?: any) => JSX.Element;

    /** Whether the modal is currently open */
    isOpen: Accessor<boolean>;

    /** Current props passed to the modal component */
    props: Accessor<any | undefined>;

    /**
     * Toggle modal visibility
     * @param options.payload - Props to pass when opening
     * @param options.withCloseAll - Close all other modals first
     */
    handleToggleVisibility(options?: IModalStateHandlerProps): void;

    /**
     * Open the modal
     * @param options.payload - Props to pass to the component
     * @param options.withCloseAll - Close all other modals first
     */
    handleOpen(options?: IModalStateHandlerProps): void;

    /**
     * Close the modal
     * @param options.withCloseAll - Close all other modals too
     */
    handleClose(options?: IModalStateHandlerProps): void;
}

/**
 * Context return value — provides access to modal states by key
 */
interface IModalWindowContextReturn<T extends string = string> {
    /**
     * Get modal state and controls by its unique key
     * @param key - Modal identifier (must exist in `modals` prop of provider)
     * @throws Error if modal with given key is not registered
     */
    getModalState(key: T): IModalWindowState;
}

/**
 * Props for `<ModalWindowProvider />`
 */
interface IModalWindowContextBaseProps<T extends string = string> {
    /**
     * Object mapping modal keys to their components
     * @example
     * {
     *   registration: () => <RegisterModal />,
     *   depositBonus: (props) => <DepositBonusModal amount={props.amount} />
     * }
     */
    modals: Record<T, (props?: any) => JSX.Element>;

    /** Content rendered inside the provider (your app) */
    children?: JSX.Element;

    /**
     * Optional shared layout wrapper for all modals (e.g. with close button, animation)
     * @example (children) => <FadeIn>{children}</FadeIn>
     */
    layout?: ParentComponent;
}

export type {
    IModalWindowContextBaseProps,
    IModalWindowState,
    IModalWindowContextReturn,
    IModalStateHandlerProps,
};
