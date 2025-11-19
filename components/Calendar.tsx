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
        <div className='p-6 bg-white rounded-2xl shadow-xl border border-slate-100'>
            <style jsx global>{`
                .fc-button-primary {
                    background-color: #3b82f6 !important;
                    border-color: #3b82f6 !important;
                }
                .fc-button-primary:hover {
                    background-color: #2563eb !important;
                    border-color: #2563eb !important;
                }
                .fc-button-active {
                    background-color: #1d4ed8 !important;
                    border-color: #1d4ed8 !important;
                }
                .fc-daygrid-day.fc-day-today, .fc-timegrid-col.fc-day-today {
                    background-color: #eff6ff !important;
                }
                .fc-col-header-cell {
                    background-color: #f8fafc;
                    padding: 8px 0;
                }
                /* Custom Event Styling */
                .fc-event {
                    border: none !important;
                    background-color: transparent !important;
                    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
                    border-radius: 4px;
                    padding: 2px;
                }
                .fc-event-main {
                    color: #1e293b; /* slate-800 */
                    padding: 4px;
                    font-size: 0.75rem;
                    font-weight: 500;
                    border-left: 4px solid;
                    height: 100%;
                    background-color: #f8fafc; /* Default light background */
                }
                /* Dynamic coloring based on event color prop is tricky with pure CSS classes if we override .fc-event background.
                   We will handle the specific colors in the render hook or by setting styles inline in eventContent if needed.
                   But FullCalendar applies 'backgroundColor' to the root element. 
                   We'll override this behavior to use the color for the border and a lighter version for the background.
                */
            `}</style>
            <FullCalendar
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                headerToolbar={{
                    left: 'prev,next today',
                    center: 'title',
                    right: 'dayGridMonth,timeGridWeek,timeGridDay'
                }}
                initialView='timeGridWeek'
                slotMinTime="08:00:00"
                slotMaxTime="22:00:00"
                allDaySlot={false}
                editable={true}
                selectable={true}
                selectMirror={true}
                dayMaxEvents={true}
                events={events}
                select={handleDateSelect}
                eventClick={handleEventClick}
                eventDrop={handleEventDrop}
                height="auto"
                eventContent={(eventInfo) => {
                    // Custom render to achieve the look
                    const color = eventInfo.event.backgroundColor || '#3b82f6';
                    // Generate a light version of the color for background (simple opacity approach)
                    // Note: This is a simplification. For perfect pastel matching we'd need color manipulation.
                    // We'll use a hardcoded map for MVP or just opacity.

                    return (
                        <div style={{
                            height: '100%',
                            backgroundColor: `${color}15`, // 15 is roughly 10% opacity hex
                            borderLeft: `4px solid ${color}`,
                            padding: '4px',
                            borderRadius: '0 4px 4px 0',
                            overflow: 'hidden',
                            color: '#334155'
                        }}>
                            <div className="font-bold text-xs truncate">{eventInfo.timeText}</div>
                            <div className="font-semibold text-sm truncate">{eventInfo.event.title}</div>
                            {eventInfo.event.extendedProps.description && (
                                <div className="text-xs truncate opacity-75">{eventInfo.event.extendedProps.description}</div>
                            )}
                        </div>
                    );
                }}
            />
        </div>
    );
}
