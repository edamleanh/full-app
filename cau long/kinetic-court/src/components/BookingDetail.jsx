import React, { useState } from 'react';
import MatchCard from './MatchCard';
import { X, Clock, ChevronLeft, Calendar as CalendarIcon, CheckCircle } from 'lucide-react';

const BookingDetail = ({ court, relatedMatches, onBack, onConfirm, onJoinMatch, onSelectMatch, joinedIds }) => {
  const [selectedSlots, setSelectedSlots] = useState([]);
  const [bookingScale, setBookingScale] = useState(1); // To simulate "Loading"
  
  // Dynamic Date Generation (Next 7 days)
  const today = new Date();
  const dateList = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(today.getDate() + i);
    const dayNames = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
    return {
      dayStr: dayNames[d.getDay()],
      dateNum: d.getDate(),
      fullDate: d.toDateString() // unique key
    };
  });

  const [selectedDate, setSelectedDate] = useState(dateList[0].fullDate);

  const slots = [
    { id: 1, time: '06:00', price: 80 },
    { id: 2, time: '07:00', price: 80 },
    { id: 3, time: '08:00', price: 80 },
    { id: 4, time: '17:00', price: 120, peak: true },
    { id: 5, time: '18:00', price: 120, peak: true },
    { id: 6, time: '19:00', price: 120, peak: true },
    { id: 7, time: '20:00', price: 120, peak: true },
    { id: 8, time: '21:00', price: 100 },
  ];

  const toggleSlot = (slot) => {
    if (selectedSlots.find(s => s.id === slot.id)) {
      setSelectedSlots(selectedSlots.filter(s => s.id !== slot.id));
    } else {
      setSelectedSlots([...selectedSlots, slot]);
    }
  };

  const totalPrice = selectedSlots.reduce((sum, s) => sum + s.price, 0);

  const handleConfirm = () => {
    if (selectedSlots.length === 0) return;
    onConfirm(totalPrice, selectedSlots, selectedDate);
  };

  return (
    <div className="booking-overlay active">
      {/* Header - Fixed */}
      <div className="booking-header" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '15px', flexShrink: 0 }}>
        <button onClick={onBack} className="icon-btn-transparent">
          <ChevronLeft size={24} color="white" />
        </button>
        <h2 style={{ margin: 0 }}>Đặt sân</h2>
      </div>

      {/* Scrollable Content */}
      <div className="screen-content" style={{ padding: '0 20px 100px', flex: 1, overflowY: 'auto' }}>
        <div className="glass-card" style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
          <img src={court.image} style={{ width: 80, height: 80, borderRadius: 12, objectFit: 'cover' }} alt="court" />
          <div>
            <h3 style={{ margin: 0 }}>{court.name}</h3>
            <p className="muted" style={{ fontSize: '0.8rem' }}>{court.location}</p>
          </div>
        </div>

        <div className="section-title mt-20">
          <h3>Chọn ngày</h3>
        </div>
        <div className="calendar-strip">
          {dateList.map((d, index) => (
            <div 
              key={index} 
              className={`cal-day ${selectedDate === d.fullDate ? 'active' : ''}`}
              onClick={() => setSelectedDate(d.fullDate)}
            >
              <span>{d.dayStr}</span>
              <strong>{d.dateNum}</strong>
            </div>
          ))}
        </div>

        <div className="section-title mt-20">
          <h3>Khung giờ trống</h3>
          <span className="muted">Giờ cao điểm = 120k</span>
        </div>

        <div className="time-grid">
          {slots.map(slot => (
            <div 
              key={slot.id} 
              className={`time-slot ${selectedSlots.find(s => s.id === slot.id) ? 'active' : ''} ${slot.peak ? 'peak' : ''}`}
              onClick={() => toggleSlot(slot)}
            >
              <strong>{slot.time}</strong>
              <span>{slot.price}k</span>
            </div>
          ))}
        </div>

        {relatedMatches && relatedMatches.length > 0 && (
          <div style={{ marginTop: '30px' }}>
            <div className="section-title">
              <h3>Kèo đấu tại sân này</h3>
            </div>
            <div className="related-matches-list">
              {relatedMatches.map(match => (
                <MatchCard 
                  key={match.id}
                  match={match}
                  onJoin={onJoinMatch}
                  onSelect={onSelectMatch}
                  isJoined={joinedIds.includes(match.id)}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer - Fixed */}
      <div className="booking-footer" style={{ position: 'relative', flexShrink: 0 }}>
        <div className="checkout-info">
          <div>
            <span className="muted">{selectedSlots.length} chỗ đã chọn</span>
            <div className="total-val">{totalPrice}k VND</div>
          </div>
          <button 
            className={`btn-primary ${selectedSlots.length === 0 ? 'disabled' : ''}`}
            onClick={handleConfirm}
            style={{ padding: '15px 30px' }}
          >
            Xác nhận
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingDetail;
