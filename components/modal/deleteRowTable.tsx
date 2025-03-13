import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/react";
import { Trash2 } from "lucide-react";
import React from "react";

type Props = {
  onDelete: () => void;
  diclosure: { isOpen: boolean; onOpenChange: () => void };
  isLoading: boolean;
};

const ModalDeleteRowTable = ({ onDelete, diclosure, isLoading }: Props) => {
  const { isOpen, onOpenChange } = diclosure;
  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="lg">
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Apakah kamu yakin ingin menggapus data ini?
            </ModalHeader>
            <ModalBody>
              <p>
                Data yang dihapus akan hilang secara permanen dan tidak dapat
                dikembalikan.
              </p>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                Close
              </Button>
              <Button
                color="danger"
                isLoading={isLoading}
                onPress={() => {
                  onDelete();
                }}
                startContent={<Trash2 className="w-4 h-4" />}
              >
                Hapus
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default ModalDeleteRowTable;
