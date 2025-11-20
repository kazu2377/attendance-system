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
                    color: event.userId ? '#06C755' : '#28a745'
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

    const handleEventDrop = async (dropInfo: any) => {
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
        <div className='p-4 bg-white rounded-2xl shadow-sm border border-slate-100'>
            <style jsx global>{`
                .fc {
                    font-family: 'Inter', sans-serif;
                }
                .fc-button-primary {
                    background-color: #06C755 !important;
                    border-color: #06C755 !important;
                    font-weight: 600;
                }
                .fc-button-primary:hover {
                    background-color: #05b34d !important;
                    border-color: #05b34d !important;
                }
                .fc-button-active {
                    background-color: #049c43 !important;
                    border-color: #049c43 !important;
                }
                .fc-daygrid-day.fc-day-today, .fc-timegrid-col.fc-day-today {
                    background-color: #f0fdf4 !important; /* Very light green */
                }
                .fc-col-header-cell {
                    background-color: #F2F4F5;
                    padding: 10px 0;
                    color: #111111;
                    font-weight: 600;
                }
                .fc-timegrid-slot-label {
                    font-size: 0.75rem;
                    color: #888;
                }
                /* Custom Event Styling */
                .fc-event {
                    border: none !important;
                    background-color: transparent !important;
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
                    border-radius: 6px;
                    padding: 0;
                }
                .fc-event-main {
                    padding: 0;
                    height: 100%;
                }
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
                eventResize={handleEventDrop} // Reuse handleEventDrop as it updates start/end
                height="auto"
                eventContent={(eventInfo) => {
                    const color = eventInfo.event.backgroundColor || '#06C755';
                    const isAttendance = eventInfo.event.id.startsWith('attendance-');

                    return (
                        <div style={{
                            height: '100%',
                            backgroundColor: isAttendance ? '#fff' : `${color}`,
                            borderLeft: isAttendance ? `4px solid ${color}` : 'none',
                            padding: '4px 6px',
                            borderRadius: '6px',
                            overflow: 'hidden',
                            color: isAttendance ? '#333' : '#fff',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center'
                        }}>
                            <div className="font-bold text-xs truncate">
                                {eventInfo.timeText}
                            </div>
                            <div className="font-bold text-sm truncate leading-tight">
                                {eventInfo.event.title}
                            </div>
                            {eventInfo.event.extendedProps.description && (
                                <div className="text-xs truncate opacity-90 mt-1">
                                    {eventInfo.event.extendedProps.description}
                                </div>
                            )}
                        </div>
                    );
                }}
            />
        </div>
    );
}
