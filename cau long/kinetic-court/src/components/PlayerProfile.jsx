import React from 'react';
import { ChevronLeft, Shield, Star, Award, MessageCircle, UserPlus, Zap, Rocket, History, Crosshair } from 'lucide-react';
import { ACHIEVEMENTS } from '../data/mockData';

const PlayerProfile = ({ player, onBack }) => {
  if (!player) return null;

  const progressPercent = (player.xp / player.maxXp) * 100;

  return (
    <div className="booking-overlay active">
      {/* Header - Fixed */}
      <div className="booking-header" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '15px' }}>
        <button onClick={onBack} className="icon-btn-transparent">
          <ChevronLeft size={24} color="white" />
        </button>
        <h2 style={{ margin: 0 }}>Hồ sơ cao thủ</h2>
      </div>

      {/* Scrollable Content */}
      <div className="screen-content" style={{ padding: '0 20px 100px', flex: 1, overflowY: 'auto' }}>
        <div className="profile-header mt-20">
          <div className="avatar-wrapper" style={{ position: 'relative' }}>
            <img 
              src={player.avatar} 
              style={{ width: 100, height: 100, borderRadius: '50%', border: '4px solid var(--primary)', boxShadow: '0 0 20px rgba(195, 255, 0, 0.3)' }} 
              alt={player.name} 
            />
            <div className="level-badge-float" style={{ 
              position: 'absolute', bottom: -5, left: '50%', transform: 'translateX(-50%)',
              background: 'var(--primary)', color: 'black',
              padding: '4px 12px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '900',
              boxShadow: '0 4px 10px rgba(0,0,0,0.5)', whiteSpace: 'nowrap'
            }}>
              LEVEL {Math.floor(player.xp / 100) + 5}
            </div>
          </div>
          <h2 style={{ fontSize: '2rem', marginTop: '20px', marginBottom: '5px' }}>{player.name}</h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary)', fontSize: '0.9rem', fontWeight: 'bold' }}>
            <Shield size={16} />
            <span>Level {player.level}</span>
          </div>
          <p className="muted" style={{ fontStyle: 'italic', marginTop: '10px' }}>"{player.bio}"</p>
        </div>

        {/* XP Progress Bar */}
        <div className="glass-card mt-20" style={{ padding: '15px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.8rem' }}>
            <span className="muted">Tiến trình Level</span>
            <span>{player.xp}/{player.maxXp} XP</span>
          </div>
          <div className="progress-bar-bg" style={{ height: '8px' }}>
            <div className="progress-bar-fill" style={{ width: `${progressPercent}%`, height: '100%' }}></div>
          </div>
        </div>

        <div className="stats-grid mt-20">
          <div className="glass-card stat-box">
            <p className="muted">Hạng</p>
            <div className="stat-value neon-text">#{player.rank}</div>
          </div>
          <div className="glass-card stat-box">
            <p className="muted">Tỷ lệ thắng</p>
            <div className="stat-value">{player.winRate}</div>
          </div>
          <div className="glass-card stat-box">
            <p className="muted">Trận đấu</p>
            <div className="stat-value">{player.matches}</div>
          </div>
        </div>

        <div className="section-title">
          <h3>Thông tin vợt & Lối chơi</h3>
        </div>
        <div className="glass-card" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
          <div>
            <p className="muted" style={{ fontSize: '0.7rem', marginBottom: '4px' }}>Lối chơi</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Zap size={16} color="var(--primary)" />
              <span style={{ fontWeight: 'bold' }}>{player.style}</span>
            </div>
          </div>
          <div>
            <p className="muted" style={{ fontSize: '0.7rem', marginBottom: '4px' }}>Vợt yêu thích</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Rocket size={16} color="var(--primary)" />
              <span style={{ fontWeight: 'bold', fontSize: '0.8rem' }}>{player.gear}</span>
            </div>
          </div>
        </div>

        <div className="section-title">
          <h3>Huy hiệu đạt được</h3>
        </div>
        <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '10px' }}>
          {player.unlockedAchievements.map(id => {
            const ach = ACHIEVEMENTS.find(a => a.id === id);
            return (
              <div key={id} className="glass-card" style={{ padding: '10px', minWidth: '80px', textAlign: 'center', flexShrink: 0 }}>
                <div style={{ fontSize: '1.8rem', marginBottom: '5px' }}>{ach.icon}</div>
                <div style={{ fontSize: '0.6rem', fontWeight: 'bold' }}>{ach.title}</div>
              </div>
            );
          })}
        </div>

        <div className="section-title">
          <h3>Trận đấu gần đây</h3>
        </div>
        <div className="history-list">
          {player.recentHistory.map(match => (
            <div key={match.id} className="glass-card" style={{ marginBottom: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ color: match.result === 'WIN' ? 'var(--primary)' : '#ff4444', fontWeight: 900, fontSize: '0.8rem' }}>
                  {match.result === 'WIN' ? 'CHIẾN THẮNG' : 'THẤT BẠI'}
                </span>
                <span className="muted" style={{ fontSize: '0.75rem' }}>{match.date}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h4 style={{ margin: 0, fontSize: '0.95rem' }}>vs {match.opponent}</h4>
                  <p className="muted" style={{ fontSize: '0.75rem', marginTop: '2px' }}>{match.location}</p>
                </div>
                <div style={{ fontSize: '1.2rem', fontWeight: 900, letterSpacing: '1px' }}>{match.score}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="action-row mt-30" style={{ display: 'flex', gap: '12px' }}>
          <button className="btn-primary" style={{ flex: 1.5, height: '50px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', fontSize: '1rem' }}>
            <UserPlus size={20} />
            Kết bạn
          </button>
          <button className="btn-slim-neon" style={{ flex: 1, height: '50px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', background: 'rgba(255,255,255,0.05)', color: 'white', border: '1px solid #333' }}>
            <MessageCircle size={20} />
            Nhắn tin
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlayerProfile;
