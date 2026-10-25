import React, { useState } from 'react';
import { Boxes, Plus, DollarSign, Calendar, ShieldCheck } from 'lucide-react';

export default function AssetsView({ assets, onCreateAsset }) {
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [purchaseDate, setPurchaseDate] = useState(new Date().toISOString().split('T')[0]);
  const [purchasePrice, setPurchasePrice] = useState('');
  const [usefulLife, setUsefulLife] = useState('3');
  const [salvageValue, setSalvageValue] = useState('0');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !purchasePrice) return;
    onCreateAsset({
      name,
      description,
      purchase_date: purchaseDate,
      purchase_price: parseFloat(purchasePrice),
      useful_life_years: parseInt(usefulLife, 10),
      salvage_value: parseFloat(salvageValue || '0'),
    });
    setShowModal(false);
    setName('');
    setDescription('');
    setPurchasePrice('');
  };

  const totalAssetValue = assets.reduce((sum, a) => sum + (a.current_value || a.purchase_price), 0);

  return (
    <div>
      <div className="stats-grid" style={{ marginBottom: '24px' }}>
        <div className="stat-card" style={{ '--card-accent': '#ec4899' }}>
          <div>
            <div className="stat-label">Total Current Asset Value</div>
            <div className="stat-value">₹{totalAssetValue.toLocaleString('en-IN')}</div>
          </div>
          <div className="stat-icon-wrapper" style={{ '--icon-bg': 'rgba(236, 72, 153, 0.12)', '--icon-color': '#ec4899' }}>
            <Boxes size={24} />
          </div>
        </div>

        <div className="stat-card" style={{ '--card-accent': '#4f46e5' }}>
          <div>
            <div className="stat-label">Total Registered Assets</div>
            <div className="stat-value">{assets.length}</div>
          </div>
          <div className="stat-icon-wrapper" style={{ '--icon-bg': 'rgba(79, 70, 229, 0.12)', '--icon-color': '#4f46e5' }}>
            <ShieldCheck size={24} />
          </div>
        </div>
      </div>

      <div className="content-card">
        <div className="content-header">
          <div>
            <h2 className="section-title">Hardware & Corporate Assets Inventory</h2>
            <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)' }}>
              Depreciation, salvage value, and allocation status
            </p>
          </div>
          <button
            className="btn btn-primary"
            id="btn-open-add-asset"
            onClick={() => setShowModal(true)}
          >
            <Plus size={16} />
            <span>Register Asset</span>
          </button>
        </div>

        <div className="table-responsive">
          <table className="modern-table">
            <thead>
              <tr>
                <th>Asset Name</th>
                <th>Purchase Date</th>
                <th>Purchase Price</th>
                <th>Useful Life</th>
                <th>Salvage Value</th>
                <th>Current Valuation</th>
              </tr>
            </thead>
            <tbody>
              {assets.length > 0 ? (
                assets.map((a) => (
                  <tr key={a.id}>
                    <td>
                      <strong style={{ color: 'var(--text-primary)' }}>{a.name}</strong>
                      {a.description && (
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                          {a.description}
                        </div>
                      )}
                    </td>
                    <td>{a.purchase_date}</td>
                    <td>₹{a.purchase_price?.toLocaleString('en-IN')}</td>
                    <td>{a.useful_life_years} Years</td>
                    <td>₹{a.salvage_value?.toLocaleString('en-IN')}</td>
                    <td>
                      <strong style={{ color: 'var(--success)' }}>
                        ₹{a.current_value?.toLocaleString('en-IN')}
                      </strong>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '32px', color: 'var(--text-muted)' }}>
                    No assets recorded. Click "Register Asset" to add workstations or equipment.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title">Register Corporate Asset</h3>
              <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Asset Name</label>
                <input
                  type="text"
                  className="form-control"
                  required
                  placeholder="e.g. MacBook Pro M3 16-inch"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Description / Serial No.</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Dev Machine #12 - Asset ID A-0492"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Purchase Date</label>
                <input
                  type="date"
                  className="form-control"
                  required
                  value={purchaseDate}
                  onChange={(e) => setPurchaseDate(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Purchase Price (₹)</label>
                <input
                  type="number"
                  step="0.01"
                  className="form-control"
                  required
                  placeholder="e.g. 195000"
                  value={purchasePrice}
                  onChange={(e) => setPurchasePrice(e.target.value)}
                />
              </div>

              <div className="two-col-grid">
                <div className="form-group">
                  <label className="form-label">Useful Life (Years)</label>
                  <input
                    type="number"
                    min="1"
                    className="form-control"
                    value={usefulLife}
                    onChange={(e) => setUsefulLife(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Salvage Value (₹)</label>
                  <input
                    type="number"
                    step="0.01"
                    className="form-control"
                    value={salvageValue}
                    onChange={(e) => setSalvageValue(e.target.value)}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '24px' }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Asset
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
