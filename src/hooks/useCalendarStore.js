import { useDispatch, useSelector } from 'react-redux';
import {
    onAddNewEvent,
    onDeleteEvent,
    onSetActiveEvent,
    onUpdateEvent,
    onLoadEvents,
} from '../store/calendar/calendarSlice';
import calendarApi from '../api/calendarApi';
import { convertEventsToDateEvents } from '../helpers';
import Swal from 'sweetalert2';

export const useCalendarStore = () => {
    const { events, activeEvent } = useSelector((state) => state.calendar);
    const { user } = useSelector((state) => state.auth);
    const dispatch = useDispatch();

    const setActiveEvent = (calendarEvent) => {
        dispatch(onSetActiveEvent(calendarEvent));
    };

    const startSavingEvent = async (calendarEvent) => {
        //TODO: Update event
        try {
            if (calendarEvent.id) {
                //actualizar
                await calendarApi.put(
                    `/events/${calendarEvent.id}`,
                    calendarEvent
                );
                dispatch(onUpdateEvent({ ...calendarEvent, user }));
                return;
            }
            //crear
            const { data } = await calendarApi.post('/events', calendarEvent);
            dispatch(
                onAddNewEvent({ ...calendarEvent, id: data.evento.id, user })
            );
        } catch (error) {
            console.log(error);
            Swal.fire('Error al guardar', error.response.data.msg, 'error');
        }
    };
    const startDeletingEvent = async () => {
        try {
            await calendarApi.delete(`/events/${activeEvent.id}`);
            dispatch(onDeleteEvent());
        } catch (error) {
            console.log(error);
            Swal.fire('Error al eliminar', error.response.data.msg, 'error');
        }
    };
    const starLoadingEvents = async () => {
        try {
            const { data } = await calendarApi.get('/events');
            const events = convertEventsToDateEvents(data.eventos);
            dispatch(onLoadEvents(events));
            console.log(events);
        } catch (error) {
            console.log('Error cargando eventos');
            console.log(error);
        }
    };
    return {
        //?Properties
        events,
        activeEvent,
        hasEventSelected: !!activeEvent,
        //?Methods
        setActiveEvent,
        starLoadingEvents,
        startDeletingEvent,
        startSavingEvent,
    };
};
