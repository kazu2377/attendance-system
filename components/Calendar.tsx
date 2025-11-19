'use client';

import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { EventInput, DateSelectArg, EventClickArg, EventDropArg } from '@fullcalendar/core';

export default function Calendar() {
    const [events, setEvents] = useState<EventInput[]>([]);

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            const response = await fetch('/api/events');
            if (response.ok) {
                const data = await response.json();
                // Map data to FullCalendar format if necessary
                // Assuming API returns data compatible or we map it here
                const formattedEvents = data.map((event: any) => ({
                    id: event.id.toString(),
                    title: event.title,
                    start: event.start,
                    end: event.end,
                    allDay: event.allDay,
                    description: event.description,
                    // Distinguish between attendance and manual events if mixed
                    color: event.userId ? '#3788d8' : '#28a745'
                }));

                // Also fetch attendance records to display?
                // For now let's just fetch events. 
                // If we want attendance, we should fetch that too.
                const attendanceResponse = await fetch('/api/attendance');
                let attendanceEvents: EventInput[] = [];
                if (attendanceResponse.ok) {
                    const attendanceData = await attendanceResponse.json();
                    attendanceEvents = attendanceData.map((record: any) => ({
                        id: `attendance-${record.id}`,
                        title: `Attendance: ${record.status}`,
                        start: record.startTime,
                        end: record.endTime || record.startTime, // If no end time, just show start
                        color: record.status === 'Working' ? '#ffc107' : '#28a745',
                        editable: false // Attendance records shouldn't be moved manually here
                    }));
                }

                setEvents([...formattedEvents, ...attendanceEvents]);
            }
        } catch (error) {
            console.error('Failed to fetch events', error);
        }
    };

    const handleDateSelect = async (selectInfo: DateSelectArg) => {
        const title = prompt('Please enter a new title for your event');
        const calendarApi = selectInfo.view.calendar;

        calendarApi.unselect(); // clear date selection

        if (title) {
            const newEvent = {
                title,
                start: selectInfo.startStr,
                end: selectInfo.endStr,
                allDay: selectInfo.allDay,
                userId: 'user-1', // Hardcoded for MVP
            };

            try {
                const response = await fetch('/api/events', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(newEvent),
                });

                if (response.ok) {
                    const savedEvent = await response.json();
                    setEvents([...events, {
                        ...savedEvent,
                        id: savedEvent.id.toString()
                    }]);
                }
            } catch (error) {
                console.error('Failed to create event', error);
            }
        }
    };

    const handleEventClick = async (clickInfo: EventClickArg) => {
        if (confirm(`Are you sure you want to delete the event '${clickInfo.event.title}'?`)) {
            try {
                const response = await fetch(`/api/events/${clickInfo.event.id}`, {
                    method: 'DELETE',
                });

                if (response.ok) {
                    clickInfo.event.remove();
                }
            } catch (error) {
                console.error('Failed to delete event', error);
            }
        }
    };

    const handleEventDrop = async (dropInfo: EventDropArg) => {
        const { event } = dropInfo;
        try {
            await fetch(`/api/events/${event.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    title: event.title,
                    start: event.start,
                    end: event.end,
                    allDay: event.allDay,
                }),
            });
        } catch (error) {
            console.error('Failed to update event', error);
            dropInfo.revert();
        }
    };

    return (
        <div className='p-4 bg-white rounded-lg shadow'>
            <FullCalendar
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                headerToolbar={{
                    left: 'prev,next today',
                    center: 'title',
                    right: 'dayGridMonth,timeGridWeek,timeGridDay'
                }}
                initialView='dayGridMonth'
                editable={true}
                selectable={true}
                selectMirror={true}
                dayMaxEvents={true}
                events={events}
                select={handleDateSelect}
                eventClick={handleEventClick}
                eventDrop={handleEventDrop}
            />
        </div>
    );
}
