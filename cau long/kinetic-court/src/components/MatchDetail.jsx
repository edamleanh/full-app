import React from 'react';
import { ChevronLeft, MapPin, Calendar, Clock, Users, Shield, MessageCircle } from 'lucide-react';

const MatchDetail = ({ match, onBack, onJoin, onViewPlayer, isJoined, courts }) => {
  const court = courts?.find(c => c.id === match.courtId);
  const locationDisplay = court ? court.name : (match.location || "Đang cập nhật...");

  const participants = [
    { id: 1, name: "Hùng Cầu", avatar: "https://ui-avatars.com/api/?name=HC&background=random" },
    { id: 2, name: "Minh Anh", avatar: "https://ui-avatars.com/api/?name=MA&background=random" },
    { id: 3, name: "Tuyết Nhi", avatar: "https://ui-avatars.com/api/?name=TN&background=random" }
  ];

  return (
    <div className="booking-overlay active">
      {/* Header - Fixed */}
      <div className="booking-header" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '15px' }}>
        <button onClick={onBack} className="icon-btn-transparent">
          <ChevronLeft size={24} color="white" />
        </button>
        <h2 style={{ margin: 0 }}>Chi tiết trận đấu</h2>
      </div>

      {/* Scrollable Content */}
      <div className="screen-content" style={{ padding: '0 20px 100px', flex: 1, overflowY: 'auto' }}>
        <div className="glass-card" style={{ marginBottom: '20px' }}>
          <h2 style={{ margin: '0 0 10px', color: 'var(--primary)' }}>{match.title}</h2>
          <div className="match-details">
            <div className="detail-item">
              <MapPin size={18} color="var(--primary)" />
              <span>{locationDisplay}</span>
            </div>
            <div className="detail-item">
              <Calendar size={18} color="var(--primary)" />
              <span>{match.date}</span>
            </div>
            <div className="detail-item">
              <Clock size={18} color="var(--primary)" />
              <span>{match.time}</span>
            </div>
          </div>
        </div>

        <div className="section-title">
          <h3>Thành viên tham gia ({isJoined ? 4 : 3}/4)</h3>
        </div>
        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
          {participants.map(p => (
            <div 
              key={p.id} 
              style={{ textAlign: 'center', cursor: 'pointer' }}
              onClick={() => onViewPlayer(p.id)}
            >
              <img src={p.avatar} style={{ width: 50, height: 50, borderRadius: '50%', border: '2px solid var(--glass-border)' }} alt={p.name} />
              <p style={{ fontSize: '0.6rem', marginTop: '4px' }}>{p.name.split(' ')[0]}</p>
            </div>
          ))}
          {isJoined && (
            <div style={{ textAlign: 'center' }}>
               <img src="https://ui-avatars.com/api/?name=Me&background=c3ff00&color=000" style={{ width: 50, height: 50, borderRadius: '50%', border: '2px solid var(--primary)' }} alt="You" />
               <p style={{ fontSize: '0.6rem', marginTop: '4px', color: 'var(--primary)' }}>Bạn</p>
            </div>
          )}
          {[...Array(isJoined ? 0 : 1)].map((_, i) => (
            <div key={i} style={{ width: 50, height: 50, borderRadius: '50%', border: '2px dashed #444', display: 'flex', alignItems: 'center', justifycontent: 'center', color: '#444' }}>
              <Users size={20} />
            </div>
          ))}
        </div>

        <div className="section-title">
          <h3>Mô tả & Quy định</h3>
        </div>
        <div className="glass-card muted" style={{ fontSize: '0.85rem', lineHeight: '1.5' }}>
          - Trình độ: {match.level}<br/>
          - Chi phí: {match.price} (Chia đều sau trận)<br/>
          - Ghi chú: Giao lưu vui vẻ là chính, không quá đặt nặng thắng thua. Vui lòng có mặt đúng giờ!
        </div>

        <button className="btn-primary mt-20" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
           <MessageCircle size={20} />
           Chat với nhóm
        </button>
      </div>

      {/* Footer - Fixed */}
      <div className="booking-footer" style={{ position: 'relative' }}>
        <div className="checkout-info">
          <div>
            <span className="muted">Giá dự kiến</span>
            <div className="total-val">{match.price}</div>
          </div>
          <button 
            className={`btn-primary ${isJoined ? 'negative' : ''}`}
            style={{ padding: '15px 30px', background: isJoined ? '#ff4444' : 'var(--primary)', color: isJoined ? 'white' : 'black' }}
            onClick={() => onJoin(match)}
          >
            {isJoined ? 'Rút lui' : 'Tham gia ngay'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MatchDetail;
