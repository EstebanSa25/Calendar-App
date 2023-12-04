import { useDispatch, useSelector } from "react-redux";
import { onCloseDateModal, onOpenDateModal } from "../store/ui/uiSlice";

export const useUiStore = () => {
    const Dispatch = useDispatch();
    const { isDateModalOpen } = useSelector((state) => state.ui);

    const openDateModal = () => {
        Dispatch(onOpenDateModal());
    };
    const closeDateModal = () => {
        Dispatch(onCloseDateModal());
    };
    const toggleDateModal = () => {
        isDateModalOpen ? Dispatch(openDateModal()) : closeDateModal();
    };
    return {
        //*Properties
        isDateModalOpen,

        //*Methods
        openDateModal,
        closeDateModal,
        toggleDateModal,
    };
};
