import type { Component } from "vue";
import ConfirmationModal from "../components/ConfirmationModal.vue";

export type ModalCallbackType<T extends ModalType> = (
  event: ModalEvents[T],
  close: () => void
) => Promise<void> | void;

export interface ModalStackElement<T extends ModalType> {
  component: Component;
  type: T;
  callback: ModalCallbackType<T>;
  loading: Ref<boolean>;
  data: ModalDatas[T];
}

export enum ModalType {
  Confirmation,
}

export type ModalEvents = {
  [ModalType.Confirmation]: "confirm" | "cancel";
};

export type ModalDatas = {
  [ModalType.Confirmation]: {
    title: string;
    description: string;
  };
};

const modalComponents: { [key in ModalType]: Component } = {
  [ModalType.Confirmation]: ConfirmationModal,
};

export function createModal<T extends ModalType>(
  type: T,
  data: ModalDatas[T],
  callback: ModalCallbackType<T>
) {
  const modalStack = useModalStack();
  modalStack.value.push({
    type,
    component: modalComponents[type],
    data,
    callback,
    loading: ref(false),
  });
}

export const useModalStack = () =>
  useState<Array<ModalStackElement<any>>>("modal-stack", () => []);