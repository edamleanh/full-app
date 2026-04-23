import React, { useState } from 'react';
import { X, Users, Check, CreditCard, PieChart, Plus, Minus, Copy, Zap, Beer, ChevronRight } from 'lucide-react';
import { PLAYERS } from '../data/mockData';

const SplitBillModal = ({ tx, onBack, onConfirm }) => {
  const [selectedPlayers, setSelectedPlayers] = useState([]);
  const [step, setStep] = useState('select_members'); // select_members, calculate, success
  const [extraFee, setExtraFee] = useState(0);
  const [rounding, setRounding] = useState(1000);
  const [playerWeights, setPlayerWeights] = useState({}); // { playerID: weight }
  const [myWeight, setMyWeight] = useState(1);

  const txAmount = parseInt(tx.amount.replace(/[^0-9]/g, ''));
  const totalAmount = txAmount + (parseInt(extraFee) || 0);

  // My weight is now dynamic
  const sumWeights = myWeight + selectedPlayers.reduce((acc, p) => acc + (playerWeights[p.id] || 1), 0);
  const perUnit = totalAmount / (sumWeights || 1);

  const getSplitAmount = (weight = 1) => {
    let amount = perUnit * weight;
    if (rounding > 0) {
      amount = Math.ceil(amount / rounding) * rounding;
    }
    return Math.round(amount);
  };

  const copySummary = () => {
    const lines = [
      `🏸 TỔNG KẾT KÈO: ${tx.title}`,
      `💰 Tổng cộng: ${totalAmount.toLocaleString()}đ`,
      `---`,
      `👤 Bạn: ${getSplitAmount(myWeight).toLocaleString()}đ ${myWeight !== 1 ? `(Hệ số ${myWeight}x)` : ''}`,
    ];
    selectedPlayers.forEach(p => {
      const w = playerWeights[p.id] || 1;
      lines.push(`👤 ${p.name}: ${getSplitAmount(w).toLocaleString()}đ ${w !== 1 ? `(Hệ số ${w}x)` : ''}`);
    });
    navigator.clipboard.writeText(lines.join('\n'));
    alert('Đã sao chép tóm tắt!');
  };

  const togglePlayer = (p) => {
    if (selectedPlayers.find(sp => sp.id === p.id)) {
      setSelectedPlayers(selectedPlayers.filter(sp => sp.id !== p.id));
    } else {
      setSelectedPlayers([...selectedPlayers, p]);
    }
  };

  const updateWeight = (id, delta) => {
    const current = playerWeights[id] || 1;
    const next = Math.max(0, current + delta);
    setPlayerWeights({ ...playerWeights, [id]: next });
  };

  const handleConfirmSplit = () => {
    setStep('success');
    setTimeout(() => {
      onConfirm(tx, selectedPlayers, getSplitAmount(1), parseInt(extraFee) || 0);
    }, 1500);
  };

  const renderContent = () => {
    switch (step) {
      case 'select_members':
        return (
          <>
            <div className="section-title"><h3>Chọn người chia ({selectedPlayers.length})</h3></div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '15px', marginBottom: '20px' }}>
              {PLAYERS.map(p => (
                <div 
                  key={p.id} 
                  style={{ textAlign: 'center', cursor: 'pointer' }}
                  onClick={() => togglePlayer(p)}
                >
                  <div style={{ position: 'relative', width: 60, height: 60, margin: '0 auto 5px' }}>
                    <img src={p.avatar} style={{ width: 60, height: 60, borderRadius: '50%', border: selectedPlayers.find(sp => sp.id === p.id) ? '3px solid var(--primary)' : '2px solid transparent' }} alt={p.name} />
                    {selectedPlayers.find(sp => sp.id === p.id) && (
                      <div style={{ position: 'absolute', bottom: -5, right: -5, background: 'var(--primary)', borderRadius: '50%', padding: 2 }}>
                        <Check size={12} color="black" />
                      </div>
                    )}
                  </div>
                  <p style={{ fontSize: '0.7rem' }}>{p.name.split(' ')[0]}</p>
                </div>
              ))}
            </div>

            <button 
              className="btn-primary mt-30" 
              style={{ width: '100%', padding: '18px' }}
              disabled={selectedPlayers.length === 0}
              onClick={() => setStep('calculate')}
            >
              Tiếp tục
            </button>
          </>
        );
      case 'calculate':
        return (
          <div style={{ padding: '0' }}>
            <div className="glass-card neon-border" style={{ textAlign: 'center', marginBottom: '20px', padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginBottom: '10px' }}>
                <div>
                   <p className="muted" style={{ fontSize: '0.8rem' }}>Gốc</p>
                   <p style={{ fontWeight: 'bold' }}>{txAmount.toLocaleString()}</p>
                </div>
                <div style={{ padding: '0 10px', borderLeft: '1px solid var(--glass-border)', borderRight: '1px solid var(--glass-border)' }}>
                   <p className="muted" style={{ fontSize: '0.8rem' }}>Phí</p>
                   <p style={{ fontWeight: 'bold', color: 'var(--primary)' }}>+{extraFee.toLocaleString()}</p>
                </div>
                <div>
                   <p className="muted" style={{ fontSize: '0.8rem' }}>Tổng</p>
                   <p style={{ fontWeight: 'bold' }}>{totalAmount.toLocaleString()}</p>
                </div>
              </div>
              <h2 style={{ fontSize: '2.2rem', color: 'var(--primary)' }}>{totalAmount.toLocaleString()}đ</h2>
            </div>

            <div className="section-title"><h3>Tùy chỉnh chi phí</h3></div>
            <div className="mb-20" style={{ display: 'flex', gap: '10px' }}>
              <div style={{ flex: 1 }}>
                <label className="muted" style={{ display: 'block', marginBottom: '8px', fontSize: '0.8rem' }}>Phí phát sinh (Cầu/Nước)</label>
                <div className="search-input-wrapper" style={{ padding: '8px 12px' }}>
                  <Plus size={14} color="var(--primary)" />
                  <input 
                    type="number" 
                    placeholder="0"
                    value={extraFee}
                    onChange={(e) => setExtraFee(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="mb-20">
              <label className="muted" style={{ display: 'block', marginBottom: '8px', fontSize: '0.8rem' }}>Làm tròn đến</label>
              <div style={{ display: 'flex', gap: '8px' }}>
                {[0, 1000, 5000].map(val => (
                  <button 
                    key={val} 
                    className={`chip ${rounding === val ? 'active' : ''}`}
                    onClick={() => setRounding(val)}
                    style={{ flex: 1 }}
                  >
                    {val === 0 ? 'K.Tròn' : val.toLocaleString()}
                  </button>
                ))}
              </div>
            </div>

            <div className="section-title"><h3>Kết quả chia</h3></div>
            <div className="split-list mb-20">
              <div className="tx-item-container">
                <div className="tx-item">
                  <div className="avatar-small"><img src="https://ui-avatars.com/api/?name=Me&background=c3ff00&color=000" alt="ME" style={{borderRadius: '50%', width: 32}} /></div>
                  <div className="tx-info"><h4>Bạn</h4><p className="muted">Hệ số: {myWeight}x</p></div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: 'bold' }}>{getSplitAmount(myWeight).toLocaleString()}đ</div>
                    <div style={{ display: 'flex', gap: '8px', marginTop: '5px', justifyContent: 'flex-end' }}>
                       <button onClick={() => setMyWeight(prev => Math.max(0, prev - 0.5))} className="weight-btn"><Minus size={14} /></button>
                       <button onClick={() => setMyWeight(prev => prev + 0.5)} className="weight-btn"><Plus size={14} /></button>
                    </div>
                  </div>
                </div>
              </div>
              {selectedPlayers.map(p => (
                <div key={p.id} className="tx-item-container">
                  <div className="tx-item">
                    <div className="avatar-small"><img src={p.avatar} alt={p.name} style={{borderRadius: '50%', width: 32}} /></div>
                    <div className="tx-info"><h4>{p.name}</h4><p className="muted">Hệ số: {playerWeights[p.id] || 1}x</p></div>
                    <div style={{ textAlign: 'right' }}>
                       <div style={{ fontWeight: 'bold' }}>{getSplitAmount(playerWeights[p.id] || 1).toLocaleString()}đ</div>
                       <div style={{ display: 'flex', gap: '8px', marginTop: '5px', justifyContent: 'flex-end' }}>
                          <button onClick={() => updateWeight(p.id, -0.5)} className="weight-btn"><Minus size={14} /></button>
                          <button onClick={() => updateWeight(p.id, 0.5)} className="weight-btn"><Plus size={14} /></button>
                       </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button 
              className="btn-primary" 
              style={{ width: '100%', padding: '18px', marginBottom: '10px' }}
              onClick={handleConfirmSplit}
            >
              Gửi yêu cầu thanh toán
            </button>
            <button 
              className="chip" 
              style={{ width: '100%', padding: '12px', border: '1px dashed var(--glass-border)', color: 'var(--primary)' }}
              onClick={copySummary}
            >
              <Copy size={14} style={{ marginRight: '8px' }} /> Sao chép tóm tắt
            </button>
          </div>
        );
      case 'success':
        return (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'rgba(195, 255, 0, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                <Check size={50} color="var(--primary)" />
            </div>
            <h2 style={{ color: 'var(--primary)' }}>Đã gửi yêu cầu!</h2>
            <p className="muted">Phòng trà cầu lông sẽ sớm được thanh toán</p>
          </div>
        );
      default: return null;
    }
  };

  return (
    <div className="booking-overlay active">
      <div className="booking-header" style={{ padding: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h2 style={{ margin: 0 }}>Chia tiền sân 2.0</h2>
        {step !== 'success' ? (
          <button onClick={onBack} className="icon-btn-transparent">
            <X size={24} color="white" />
          </button>
        ) : <div style={{width: 24}}></div>}
      </div>

      <div className="screen-content" style={{ padding: '0 20px 40px', flex: 1, overflowY: 'auto' }}>
        <div className="glass-card" style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '15px' }}>
          <div className="tx-icon"><CreditCard color="var(--primary)" /></div>
          <div>
            <h4 style={{ margin: 0 }}>{tx.title}</h4>
            <p className="muted" style={{ fontSize: '0.8rem' }}>{tx.date} • {tx.amount} gốc</p>
          </div>
        </div>
        {renderContent()}
      </div>
    </div>
  );
};

export default SplitBillModal;
