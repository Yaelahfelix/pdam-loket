import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/react";
import React from "react";

type Props = {
  isOpen: boolean;
  onOpenChange: () => void;
  modalAlertDesc: string;
};

const AlertModal = ({ isOpen, onOpenChange, modalAlertDesc }: Props) => {
  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Peringatan
            </ModalHeader>
            <ModalBody>
              <p>{modalAlertDesc}</p>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" onPress={onClose}>
                Tutup
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default AlertModal;
