import React from 'react';
import { Calendar, Clock, User as UserIcon, MapPin, ChevronRight } from 'lucide-react';

const MatchCard = ({ match, onJoin, onSelect, isJoined }) => {
  return (
    <div className="glass-card match-card" onClick={() => onSelect && onSelect(match)}>
      <div className="match-header">
        <div>
          <h3>{match.title}</h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <p className="muted" style={{ margin: 0 }}>{match.organizer}</p>
            {match.location && (
              <>
                <span className="muted">•</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <MapPin size={12} color="#888" />
                  <span className="muted" style={{ fontSize: '0.75rem' }}>{match.location}</span>
                </div>
              </>
            )}
          </div>
        </div>
        <div className="level-badge">{match.level}</div>
      </div>
      <div className="match-details">
        <div className="detail-item">
          <Calendar size={16} color="#c3ff00" />
          <span>{match.date}</span>
        </div>
        <div className="detail-item">
          <Clock size={16} color="#c3ff00" />
          <span>{match.time}</span>
        </div>
        <div className="detail-item">
          <UserIcon size={16} color="#c3ff00" />
          <span>{isJoined ? 4 : match.slots.split('/')[0]} / {match.slots.split('/')[1]} chỗ</span>
        </div>
      </div>
      <div className="match-footer" style={{ gap: '10px' }}>
        <span className="price" style={{ minWidth: '70px' }}>{match.price}</span>
        
        <div style={{ display: 'flex', gap: '10px' }}>
          <button 
            className="btn-secondary"
            onClick={(e) => { e.stopPropagation(); onSelect && onSelect(match); }}
            style={{ justifyContent: 'center', padding: '10px 16px', minWidth: '100px', fontSize: '0.9rem' }}
          >
            Chi tiết
          </button>

          <button 
            className={`btn-primary ${isJoined ? 'negative' : ''}`}
            onClick={(e) => { e.stopPropagation(); onJoin(match); }}
            style={{ 
              background: isJoined ? '#ff4444' : 'var(--primary)', 
              color: isJoined ? 'white' : 'black',
              padding: '10px 16px',
              minWidth: '100px',
              fontSize: '0.9rem'
            }}
          >
            {isJoined ? 'Rút lui' : 'Tham gia'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MatchCard;
