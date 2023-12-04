import { Calendar } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';

import {
    CalendarEvent,
    CalendarModal,
    FabAddNew,
    FabDelete,
    Navbar,
} from '../';
import { localizer, getMessagesES } from '../../helpers';
import { useState } from 'react';
import { useAuthStore, useCalendarStore, useUiStore } from '../../hooks';
import { useEffect } from 'react';

export const CalendarPage = () => {
    const { user } = useAuthStore();
    const eventStyleGetter = (event, start, end, isSelected) => {
        const isMyEvent =
            user.uid === event.user._id || user.uid === event.user.uid;

        const style = {
            backgroundColor: isMyEvent ? '#347CF7' : '#465660',
            borderRadius: '0px',
            opacity: 0.8,
            color: 'white',
        };

        return {
            style,
        };
    };
    const [lastView, setLastView] = useState(
        localStorage.getItem('lastView') || 'week'
    );
    const { events, setActiveEvent, starLoadingEvents } = useCalendarStore();
    const { openDateModal } = useUiStore();
    const onDoubleClick = (e) => {
        openDateModal();
        console.log({ DoubleClick: e });
    };
    const onSelect = (e) => {
        setActiveEvent(e);
    };
    const onViewChange = (e) => {
        localStorage.setItem('lastView', e);
        setLastView(e);
    };
    useEffect(() => {
        starLoadingEvents();
    }, []);

    return (
        <>
            <Navbar />
            <Calendar
                messages={getMessagesES()}
                eventPropGetter={eventStyleGetter}
                localizer={localizer}
                events={events}
                startAccessor='start'
                endAccessor='end'
                style={{ height: 'calc(100vh - 80px )' }}
                components={{
                    event: CalendarEvent,
                }}
                onDoubleClickEvent={onDoubleClick}
                onSelectEvent={onSelect}
                onView={onViewChange}
                defaultView={lastView}
            />
            <CalendarModal />
            <FabAddNew></FabAddNew>
            <FabDelete></FabDelete>
        </>
    );
};
