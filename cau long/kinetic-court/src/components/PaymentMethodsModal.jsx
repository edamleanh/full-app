import React, { useState } from 'react';
import { X, Smartphone, CreditCard, ChevronRight, CheckCircle2, Loader2 } from 'lucide-react';

const PaymentMethodsModal = ({ onBack, onConfirm }) => {
  const [step, setStep] = useState('select'); // select, amount, processing, success
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [amount, setAmount] = useState(100000);

  const methods = [
    { id: 'momo', name: 'Momo', icon: 'M', color: '#ae2070', desc: 'Ví điện tử Momo' },
    { id: 'zalopay', name: 'ZaloPay', icon: 'Z', color: '#008fe5', desc: 'Ví điện tử ZaloPay' },
    { id: 'shopeepay', name: 'ShopeePay', icon: 'S', color: '#ee4d2d', desc: 'Ví điện tử ShopeePay' },
    { id: 'bank', name: 'Ngân hàng', icon: <CreditCard size={20} />, color: '#1a1a1a', desc: 'Chuyển khoản VietQR' },
  ];

  const handleConfirm = () => {
    setStep('processing');
    setTimeout(() => {
      setStep('success');
      setTimeout(() => {
        onConfirm(amount, selectedMethod.name);
      }, 1500);
    }, 2000);
  };

  const renderContent = () => {
    switch (step) {
      case 'select':
        return (
          <>
            <div className="section-title"><h3>Chọn phương thức</h3></div>
            <div className="payment-grid">
              {methods.map(m => (
                <div 
                  key={m.id} 
                  className={`payment-option ${selectedMethod?.id === m.id ? 'active' : ''}`}
                  onClick={() => setSelectedMethod(m)}
                >
                  <div className="payment-icon" style={{ background: m.color }}>{m.icon}</div>
                  <div className="payment-info">
                    <h4>{m.name}</h4>
                    <p className="muted">{m.desc}</p>
                  </div>
                  <ChevronRight size={20} className="muted" />
                </div>
              ))}
            </div>
            <button 
              className="btn-primary mt-20" 
              style={{ width: '100%', padding: '18px' }}
              disabled={!selectedMethod}
              onClick={() => setStep('amount')}
            >
              Tiếp tục
            </button>
          </>
        );
      case 'amount':
        return (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <div className="payment-icon large" style={{ background: selectedMethod.color, margin: '0 auto 20px' }}>
              {selectedMethod.icon}
            </div>
            <h3>Nhập số tiền nạp</h3>
            <div style={{ fontSize: '2.5rem', fontWeight: 'bold', margin: '20px 0', color: 'var(--primary)' }}>
              {amount.toLocaleString()}đ
            </div>
            <div className="amount-presets">
              {[50000, 100000, 200000, 500000].map(val => (
                <button 
                  key={val} 
                  className={`chip ${amount === val ? 'active' : ''}`}
                  onClick={() => setAmount(val)}
                >
                  {val / 1000}k
                </button>
              ))}
            </div>
            <button 
              className="btn-primary mt-30" 
              style={{ width: '100%', padding: '18px' }}
              onClick={handleConfirm}
            >
              Xác nhận nạp tiền
            </button>
          </div>
        );
      case 'processing':
        return (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <Loader2 className="spin" size={60} color="var(--primary)" style={{ margin: '0 auto 20px' }} />
            <h3>Đang xử lý giao dịch...</h3>
            <p className="muted">Vui lòng không thoát ứng dụng</p>
          </div>
        );
      case 'success':
        return (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'rgba(195, 255, 0, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
              <CheckCircle2 size={50} color="var(--primary)" />
            </div>
            <h2 style={{ color: 'var(--primary)' }}>Nạp tiền thành công!</h2>
            <p className="muted">Số dư của bạn đã được cập nhật</p>
          </div>
        );
      default: return null;
    }
  };

  return (
    <div className="booking-overlay active">
      <div className="booking-header" style={{ padding: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h2 style={{ margin: 0 }}>Nạp tiền ví nhóm</h2>
        {step === 'select' || step === 'amount' ? (
          <button onClick={onBack} className="icon-btn-transparent">
            <X size={24} color="white" />
          </button>
        ) : <div style={{width: 24}}></div>}
      </div>

      <div className="screen-content" style={{ padding: '0 20px 40px', flex: 1, overflowY: 'auto' }}>
        {renderContent()}
      </div>
    </div>
  );
};

export default PaymentMethodsModal;
