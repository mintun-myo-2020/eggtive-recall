import { Button, Modal } from "flowbite-react";
import { TrashIcon } from "lucide-react";
import { useState } from "react";
import { HiOutlineExclamationCircle } from "react-icons/hi";

type ConfirmDeleteModalProps = {
  setConfirmDelete: React.Dispatch<React.SetStateAction<boolean>>;
  setNoteToDelete: React.Dispatch<React.SetStateAction<string | undefined>>;
  noteIdToDelete: string | undefined;
};

const ConfirmDeleteModal = ({
  setConfirmDelete,
  noteIdToDelete,
  setNoteToDelete,
}: ConfirmDeleteModalProps) => {
  setNoteToDelete(noteIdToDelete);
  const [openModal, setOpenModal] = useState(false);

  const handleClickYes = () => {
    setConfirmDelete(true);
    setOpenModal(false);
  };
  const handleClickNo = () => {
    setConfirmDelete(false);
    setOpenModal(false);
  };

  return (
    <>
      <TrashIcon
        className="h-5 w-5 justify-center align-middle cursor-pointer"
        color="brown"
        onClick={() => setOpenModal(true)}
      >
        Toggle modal
      </TrashIcon>
      <Modal
        dismissible
        show={openModal}
        size="md"
        onClose={() => setOpenModal(false)}
        popup
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
              Are you sure you want to delete this note?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={() => handleClickYes()}>
                {"Yes, I'm sure"}
              </Button>
              <Button color="gray" onClick={() => handleClickNo()}>
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default ConfirmDeleteModal;
