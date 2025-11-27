import {
    createContext,
    createEffect,
    createSignal,
    For,
    Show,
    useContext,
} from "solid-js";
import { Portal } from "solid-js/web";

import {
    IModalStateHandlerProps,
    IModalWindowContextBaseProps,
    IModalWindowContextReturn,
    IModalWindowState,
} from "./interface";

import "./style/index.css";

const ModalWindowContext = createContext<IModalWindowContextReturn | undefined>(
    undefined,
);

/**
 * Hook to control a specific modal by its key
 *
 * @param key - Unique modal identifier (same as used in `modals` object)
 * @returns Modal state and control functions
 *
 * @example
 * const { isOpen, handleOpen, handleClose } = useModalWindow("registration");
 */
const useModalWindow = <T extends string = string>(
    key: T,
): IModalWindowState => {
    const ctx = useContext(ModalWindowContext) as
        | IModalWindowContextReturn<T>
        | undefined;

    if (!ctx) throw new Error("useModalWindow must be used within provider");

    return ctx.getModalState(key as T);
};

/**
 * Provider that manages multiple modals declaratively
 *
 * @param props.modals - Object with modal components keyed by string
 * @param props.children - Your app content
 * @param props.layout - Optional wrapper component for all modals
 *
 * @example
 * <ModalWindowProvider
 *   modals={{
 *     login: () => <LoginModal />,
 *     alert: (props) => <AlertModal message={props.message} />
 *   }}
 * >
 *   <App />
 * </ModalWindowProvider>
 */
const ModalWindowProvider = <T extends string>(
    props: IModalWindowContextBaseProps<T>,
) => {
    type IModalKey = keyof typeof props.modals;
    type IModalsState = Partial<Record<IModalKey, IModalWindowState>>;

    const [modalsState, setModalState] = createSignal<IModalsState>({});
    const [isModalsStateLoaded, setIsModalsStateLoaded] =
        createSignal<boolean>(false);

    const handleCloseAll = () => {
        const state = modalsState();
        if (state === undefined) return;

        Object.keys(props.modals).forEach((key) => {
            state[key as IModalKey]?.handleClose();
        });
    };

    createEffect(() => {
        const bufferModalState: IModalsState = {};

        Object.keys(props.modals).forEach((key) => {
            const [isOpen, setIsOpen] = createSignal(false);
            const [modalWindowProps, setModalWindowProps] = createSignal();

            const handleToggleVisibility = ({
                                                payload = {},
                                                withCloseAll = false,
                                            }: IModalStateHandlerProps = {}) => {
                if (withCloseAll) handleCloseAll();
                setIsOpen((prev) => {
                    if (!prev) setModalWindowProps(payload);

                    return !prev;
                });
            };

            const handleOpen = ({
                                    payload = {},
                                    withCloseAll = false,
                                }: IModalStateHandlerProps = {}) => {
                if (withCloseAll) handleCloseAll();
                setModalWindowProps(payload);
                setIsOpen(true);
            };

            const handleClose = ({
                                     withCloseAll = false,
                                 }: IModalStateHandlerProps = {}) => {
                if (withCloseAll) handleCloseAll();
                setIsOpen(false);
            };

            bufferModalState[key as IModalKey] = {
                component: props.modals[key as IModalKey],
                props: modalWindowProps,
                isOpen,
                handleToggleVisibility,
                handleOpen,
                handleClose,
            };
        });

        setModalState((prev) => ({ ...prev, ...bufferModalState }));
        setIsModalsStateLoaded(true);
    });

    createEffect(() => {
        const anyOpen = Object.values(modalsState()).some((modal) =>
            (modal as IModalWindowState)?.isOpen(),
        );

        if (anyOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
    });

    const getModalState = (key: IModalKey) => {
        const state = modalsState()[key];
        if (!state) throw new Error(`No modal window by key "${key}" was found.`);
        return state;
    };

    return (
        <ModalWindowContext.Provider value={{ getModalState }}>
            <Show when={isModalsStateLoaded()}>{props.children}</Show>

            <For each={Object.keys(modalsState())}>
                {(key) => {
                    const modal = modalsState()[key as IModalKey];
                    if (!modal) return null;

                    return (
                        <Show when={modal.isOpen()}>
                            <Portal>
                                <div class="modal-backdrop">
                                    <Show
                                        when={props.layout}
                                        fallback={modal.component(modal.props())}
                                    >
                                        {(() => {
                                            const Layout = props.layout!;
                                            return <Layout>{modal.component(modal.props())}</Layout>;
                                        })()}
                                    </Show>
                                </div>
                            </Portal>
                        </Show>
                    );
                }}
            </For>
        </ModalWindowContext.Provider>
    );
};

export { ModalWindowProvider, useModalWindow };
