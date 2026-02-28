import React, { useState } from 'react';
import { Calendar, Clock, MapPin, BookOpen } from 'lucide-react';

const TimetablePage = () => {
  const [selectedDay, setSelectedDay] = useState('Monday');
  
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  
  const weeklySchedule = {
    Monday: [
      { time: '08:30 - 10:00', subject: 'Mathematics', teacher: 'Dr. Smith', room: '302', type: 'lecture' },
      { time: '10:30 - 12:00', subject: 'English Literature', teacher: 'Ms. Higgins', room: '105', type: 'lecture' },
      { time: '01:00 - 02:30', subject: 'Physics Lab', teacher: 'Mr. Brown', room: 'Lab A', type: 'lab' },
      { time: '03:00 - 04:30', subject: 'History', teacher: 'Mrs. Davis', room: '201', type: 'lecture' }
    ],
    Tuesday: [
      { time: '08:30 - 10:00', subject: 'Chemistry', teacher: 'Dr. Wilson', room: 'Lab B', type: 'lab' },
      { time: '10:30 - 12:00', subject: 'Mathematics', teacher: 'Dr. Smith', room: '302', type: 'lecture' },
      { time: '01:00 - 02:30', subject: 'Physical Education', teacher: 'Coach Johnson', room: 'Gym', type: 'practical' },
      { time: '03:00 - 04:30', subject: 'Computer Science', teacher: 'Mr. Tech', room: 'IT Lab', type: 'practical' }
    ],
    Wednesday: [
      { time: '08:30 - 10:00', subject: 'Biology', teacher: 'Dr. Green', room: '204', type: 'lecture' },
      { time: '10:30 - 12:00', subject: 'English Grammar', teacher: 'Ms. Higgins', room: '105', type: 'lecture' },
      { time: '01:00 - 02:30', subject: 'Art & Design', teacher: 'Ms. Creative', room: 'Art Studio', type: 'practical' },
      { time: '03:00 - 04:30', subject: 'Study Hall', teacher: 'Self Study', room: 'Library', type: 'study' }
    ],
    Thursday: [
      { time: '08:30 - 10:00', subject: 'Physics Theory', teacher: 'Mr. Brown', room: '301', type: 'lecture' },
      { time: '10:30 - 12:00', subject: 'Geography', teacher: 'Mrs. World', room: '203', type: 'lecture' },
      { time: '01:00 - 02:30', subject: 'Chemistry Lab', teacher: 'Dr. Wilson', room: 'Lab B', type: 'lab' },
      { time: '03:00 - 04:30', subject: 'Music', teacher: 'Mr. Melody', room: 'Music Room', type: 'practical' }
    ],
    Friday: [
      { time: '08:30 - 10:00', subject: 'Mathematics Review', teacher: 'Dr. Smith', room: '302', type: 'review' },
      { time: '10:30 - 12:00', subject: 'Science Project', teacher: 'Team Teaching', room: 'Lab C', type: 'project' },
      { time: '01:00 - 02:30', subject: 'Language Lab', teacher: 'Ms. Linguist', room: 'Language Lab', type: 'practical' },
      { time: '03:00 - 04:30', subject: 'Sports & Games', teacher: 'Coach Johnson', room: 'Sports Field', type: 'practical' }
    ]
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'lecture': return '#6366f1';
      case 'lab': return '#22c55e';
      case 'practical': return '#f59e0b';
      case 'study': return '#8b5cf6';
      case 'review': return '#06b6d4';
      case 'project': return '#ec4899';
      default: return 'var(--primary)';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'lecture': return '📚';
      case 'lab': return '🧪';
      case 'practical': return '⚡';
      case 'study': return '📖';
      case 'review': return '🔄';
      case 'project': return '🎯';
      default: return '📝';
    }
  };

  return (
    <div className="animate-fade-in">
      <header style={{ marginBottom: '40px' }}>
        <h1 style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Calendar size={32} color="var(--primary)" />
          Weekly Timetable
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          Class schedules and room assignments • Currently viewing: <span style={{ color: 'var(--primary)', fontWeight: 'bold' }}>{selectedDay}</span>
        </p>
      </header>

      {/* Day Selection Tabs */}
      <div style={{ display: 'flex', gap: '15px', marginBottom: '30px', overflowX: 'auto', paddingBottom: '10px' }}>
        {days.map(day => (
          <button 
            key={day} 
            onClick={() => setSelectedDay(day)}
            className="glass" 
            style={{
              padding: '12px 24px',
              border: selectedDay === day ? '2px solid var(--primary)' : '1px solid var(--border-color)',
              background: selectedDay === day ? 'rgba(99, 102, 241, 0.15)' : 'var(--glass-bg)',
              color: selectedDay === day ? 'var(--primary)' : 'white',
              fontWeight: selectedDay === day ? 'bold' : 'normal',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'all 0.3s ease',
              transform: selectedDay === day ? 'translateY(-2px)' : 'none',
              boxShadow: selectedDay === day ? '0 4px 12px rgba(99, 102, 241, 0.3)' : 'none'
            }}
          >
            {day}
          </button>
        ))}
      </div>

      {/* Schedule for Selected Day */}
      <div className="animate-fade-in" key={selectedDay}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '1.4rem', color: 'var(--primary)' }}>
            {selectedDay} Schedule
          </h2>
          <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            {weeklySchedule[selectedDay].length} classes today
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {weeklySchedule[selectedDay].map((item, idx) => (
            <div key={idx} className="glass" style={{ 
              padding: '24px', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '30px',
              borderLeft: `4px solid ${getTypeColor(item.type)}`,
              transition: 'transform 0.2s ease',
              cursor: 'pointer'
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'translateX(5px)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'translateX(0px)'}
            >
              {/* Time Section */}
              <div style={{ minWidth: '150px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: getTypeColor(item.type), marginBottom: '5px' }}>
                  <Clock size={16} />
                  <span style={{ fontSize: '0.9rem', fontWeight: '600' }}>{item.time}</span>
                </div>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Duration: 1.5h</p>
              </div>

              {/* Subject Section */}
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                  <span style={{ fontSize: '1.2rem' }}>{getTypeIcon(item.type)}</span>
                  <h3 style={{ fontSize: '1.2rem', margin: 0 }}>{item.subject}</h3>
                  <span style={{ 
                    fontSize: '0.7rem', 
                    padding: '2px 8px', 
                    borderRadius: '12px', 
                    background: getTypeColor(item.type) + '20',
                    color: getTypeColor(item.type),
                    textTransform: 'uppercase',
                    fontWeight: 'bold'
                  }}>
                    {item.type}
                  </span>
                </div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                  Instructor: {item.teacher}
                </p>
              </div>

              {/* Room Section */}
              <div className="glass" style={{ 
                padding: '12px 20px', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '8px', 
                background: 'var(--glass-bg)',
                border: `1px solid ${getTypeColor(item.type)}30`
              }}>
                <MapPin size={16} color={getTypeColor(item.type)} />
                <span style={{ fontWeight: '500' }}>{item.room}</span>
              </div>

              {/* Action Button */}
              <button 
                className="btn-primary" 
                style={{ 
                  padding: '8px 16px', 
                  fontSize: '0.8rem',
                  background: getTypeColor(item.type),
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <BookOpen size={14} />
                View Details
              </button>
            </div>
          ))}
        </div>

        {/* Day Summary */}
        <div className="glass" style={{ padding: '20px', marginTop: '30px', textAlign: 'center' }}>
          <h4 style={{ marginBottom: '10px', color: 'var(--primary)' }}>
            {selectedDay} Summary
          </h4>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '30px', fontSize: '0.9rem' }}>
            <span>📚 Lectures: {weeklySchedule[selectedDay].filter(c => c.type === 'lecture').length}</span>
            <span>🧪 Labs: {weeklySchedule[selectedDay].filter(c => c.type === 'lab').length}</span>
            <span>⚡ Practicals: {weeklySchedule[selectedDay].filter(c => c.type === 'practical').length}</span>
            <span>📖 Others: {weeklySchedule[selectedDay].filter(c => !['lecture', 'lab', 'practical'].includes(c.type)).length}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimetablePage;
