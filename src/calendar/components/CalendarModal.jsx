// import ReactModal from "react-modal"

import { addHours, differenceInSeconds } from 'date-fns';
import { useEffect, useState } from 'react';
import Modal from 'react-modal';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.css';
import { useMemo } from 'react';
import { useCalendarStore, useUiStore } from '../../hooks';
const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
    },
};
Modal.setAppElement('#root');
export const CalendarModal = () => {
    const [formSubmitted, setFormSubmitted] = useState(false);
    const { closeDateModal } = useUiStore();
    const { activeEvent, startSavingEvent } = useCalendarStore();
    // console.log(activeEvent);
    const [formValues, setFormValues] = useState({
        title: '',
        notes: '',
        start: new Date(),
        end: addHours(new Date(), 2),
    });
    const titleClass = useMemo(() => {
        if (!formSubmitted) return '';
        return formValues.title.length > 0 ? 'is-valid' : 'is-invalid';
    }, [formValues.title, formSubmitted]);

    useEffect(() => {
        if (activeEvent !== null) {
            setFormValues({ ...activeEvent });
        }
    }, [activeEvent]);

    const { isDateModalOpen } = useUiStore();
    const oncloseModal = () => {
        closeDateModal();
    };
    const onInputChange = ({ target }) => {
        setFormValues({
            ...formValues,
            [target.name]: target.value,
        });
    };
    const onDateChange = (event, changing) => {
        setFormValues({
            ...formValues,
            [changing]: event,
        });
    };
    const onSubmit = async (e) => {
        e.preventDefault();
        setFormSubmitted(true);
        const difference = differenceInSeconds(
            formValues.end,
            formValues.start
        );
        if (isNaN(difference) || difference <= 0) {
            console.log('Error in dates');
            Swal.fire('Incorrect dates', 'Review the entered dates', 'error');
            return;
        }
        if (formValues.title.length <= 0) return;

        console.log({ formValues });
        //TODO:Close modal
        await startSavingEvent(formValues);
        closeDateModal();
        setFormSubmitted(false);
    };
    return (
        <Modal
            className='modal'
            overlayClassName='modal-fondo'
            closeTimeoutMS={200}
            isOpen={isDateModalOpen}
            onRequestClose={oncloseModal}
            style={customStyles}
        >
            <h1>New event</h1>
            <hr />
            <form onSubmit={onSubmit} className='container'>
                <div className='form-group mb-2'>
                    <label>Start date and time</label>
                    <DatePicker
                        selected={formValues.start}
                        className='form-control'
                        onChange={(e) => onDateChange(e, 'start')}
                        dateFormat='Pp'
                        showTimeSelect
                    ></DatePicker>
                </div>

                <div className='form-group mb-2'>
                    <label>End date and time</label>
                    <DatePicker
                        minDate={formValues.start}
                        selected={formValues.end}
                        className='form-control'
                        onChange={(e) => onDateChange(e, 'end')}
                        dateFormat='Pp'
                        showTimeSelect
                    ></DatePicker>
                </div>

                <hr />
                <div className='form-group mb-2'>
                    <label>Title and notes</label>
                    <input
                        type='text'
                        className={`form-control ${titleClass}`}
                        placeholder='Event title'
                        name='title'
                        autoComplete='off'
                        value={formValues.title}
                        onChange={onInputChange}
                    />
                    <small id='emailHelp' className='form-text text-muted'>
                        A short description
                    </small>
                </div>

                <div className='form-group mb-2'>
                    <textarea
                        type='text'
                        className='form-control'
                        placeholder='Notes'
                        rows='5'
                        name='notes'
                        value={formValues.notes}
                        onChange={onInputChange}
                    ></textarea>
                    <small id='emailHelp' className='form-text text-muted'>
                        Additional Information
                    </small>
                </div>

                <button
                    type='submit'
                    className='btn btn-outline-primary btn-block'
                >
                    <i className='far fa-save'></i>
                    <span>Save</span>
                </button>
            </form>
        </Modal>
    );
};
