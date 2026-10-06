import React, { useState } from 'react';

const STEPS = {
    return: ['Pending', 'Approved', 'Picked Up', 'Received', 'Refunded'],
    exchange: ['Pending', 'Approved', 'Picked Up', 'Received', 'Replaced'],
};

const field = 'w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-gray-900 bg-white';
const label = 'block text-xs font-medium text-gray-600 mb-1';
const primary = 'w-full py-2.5 rounded-lg bg-gray-900 text-white text-sm font-medium hover:bg-black disabled:opacity-50';

/**
 * Admin workflow for a return / exchange. Pickup and shipping are booked by the admin outside the
 * system, so each step records the courier details the customer will see.
 *   Approved -> Picked Up -> Received (quality check) -> Refunded | Replaced
 */
const ReturnWorkflowPanel = ({ request, busy, onUpdate }) => {
    const isReturn = request.type === 'return';
    const steps = STEPS[isReturn ? 'return' : 'exchange'];
    const rejected = request.status === 'Rejected';
    const currentIndex = steps.indexOf(request.status);
    const isCod = request.orderPaymentMethod === 'cod';

    const [courier, setCourier] = useState({ partner: '', awb: '' });
    const [qcNote, setQcNote] = useState('');
    const [restock, setRestock] = useState(true);
    const [refundAmount, setRefundAmount] = useState(request.refundAmount ?? '');
    const [refundReference, setRefundReference] = useState('');
    const [replacement, setReplacement] = useState({ courierName: '', trackingId: '' });
    const [rejectReason, setRejectReason] = useState('');
    const [showReject, setShowReject] = useState(false);

    const canReject = ['Approved', 'Received'].includes(request.status);

    return (
        <div className="bg-white border border-gray-200 rounded-xl p-4 space-y-4">
            <h3 className="text-sm font-semibold text-gray-900">{isReturn ? 'Return' : 'Exchange'} progress</h3>

            <ol className="space-y-1.5">
                {steps.map((step, i) => {
                    const done = !rejected && i <= currentIndex;
                    return (
                        <li key={step} className="flex items-center gap-2 text-sm">
                            <span className={`w-2.5 h-2.5 rounded-full ${done ? 'bg-emerald-500' : 'bg-gray-300'}`} />
                            <span className={done ? 'text-gray-900' : 'text-gray-400'}>{step}</span>
                        </li>
                    );
                })}
                {rejected && <li className="flex items-center gap-2 text-sm text-red-600"><span className="w-2.5 h-2.5 rounded-full bg-red-500" /> Rejected</li>}
            </ol>

            {request.courier?.awb && (
                <p className="text-xs text-gray-600">Pickup: {request.courier.partner}, tracking {request.courier.awb}</p>
            )}
            {request.qcNote && <p className="text-xs text-gray-600">Quality check: {request.qcNote}</p>}
            {request.refundId && <p className="text-xs text-gray-600">Razorpay refund ID: {request.refundId}</p>}
            {request.refundReference && <p className="text-xs text-gray-600">Bank reference (UTR): {request.refundReference}</p>}
            {request.replacement?.trackingId && (
                <p className="text-xs text-gray-600">Replacement: {request.replacement.courierName}, tracking {request.replacement.trackingId}</p>
            )}

            {request.status === 'Approved' && (
                <div className="space-y-2 pt-2 border-t border-gray-100">
                    <p className="text-xs text-gray-500">Book the pickup with your courier, then enter the details. The customer is notified.</p>
                    <div><span className={label}>Courier name</span><input className={field} value={courier.partner} onChange={(e) => setCourier({ ...courier, partner: e.target.value })} placeholder="e.g. Blue Dart" /></div>
                    <div><span className={label}>Pickup tracking number</span><input className={field} value={courier.awb} onChange={(e) => setCourier({ ...courier, awb: e.target.value })} /></div>
                    <button className={primary} disabled={busy} onClick={() => onUpdate({ status: 'Picked Up', courier })}>Mark as picked up</button>
                </div>
            )}

            {request.status === 'Picked Up' && (
                <div className="space-y-2 pt-2 border-t border-gray-100">
                    <p className="text-xs text-gray-500">When the parcel reaches you, check the item and record the result.</p>
                    <div><span className={label}>Quality check note</span><textarea className={field} rows={2} value={qcNote} onChange={(e) => setQcNote(e.target.value)} placeholder="Condition of the item, tags/certificate present, etc." /></div>
                    <label className="flex items-center gap-2 text-sm text-gray-700">
                        <input type="checkbox" checked={restock} onChange={(e) => setRestock(e.target.checked)} />
                        Item is in good condition, add it back to stock
                    </label>
                    <button className={primary} disabled={busy} onClick={() => onUpdate({ status: 'Received', qcNote, restock })}>Mark as received</button>
                </div>
            )}

            {request.status === 'Received' && isReturn && (
                <div className="space-y-2 pt-2 border-t border-gray-100">
                    <p className="text-xs text-gray-500">
                        {isCod
                            ? 'Cash on Delivery order: pay the customer by bank transfer first, then enter the bank reference (UTR).'
                            : 'Online order: the refund goes back to the customer\'s original payment automatically through Razorpay.'}
                    </p>
                    <div><span className={label}>Refund amount (maximum ₹{request.refundAmount})</span><input type="number" className={field} value={refundAmount} onChange={(e) => setRefundAmount(e.target.value)} /></div>
                    {isCod && <div><span className={label}>Bank reference (UTR)</span><input className={field} value={refundReference} onChange={(e) => setRefundReference(e.target.value)} /></div>}
                    <button className={primary} disabled={busy} onClick={() => onUpdate({ status: 'Refunded', refundAmount: Number(refundAmount), refundReference })}>
                        {isCod ? 'Mark refund as paid' : 'Refund now'}
                    </button>
                </div>
            )}

            {request.status === 'Received' && !isReturn && (
                <div className="space-y-2 pt-2 border-t border-gray-100">
                    <p className="text-xs text-gray-500">Ship the replacement with your courier and enter its details. The customer is notified.</p>
                    <div><span className={label}>Courier name</span><input className={field} value={replacement.courierName} onChange={(e) => setReplacement({ ...replacement, courierName: e.target.value })} /></div>
                    <div><span className={label}>Tracking number</span><input className={field} value={replacement.trackingId} onChange={(e) => setReplacement({ ...replacement, trackingId: e.target.value })} /></div>
                    <button className={primary} disabled={busy} onClick={() => onUpdate({ status: 'Replaced', replacement })}>Mark replacement shipped</button>
                </div>
            )}

            {canReject && (
                <div className="pt-2 border-t border-gray-100">
                    {!showReject ? (
                        <button type="button" className="text-sm text-red-600 hover:underline" onClick={() => setShowReject(true)}>
                            {request.status === 'Received' ? 'Reject (failed quality check)' : 'Reject request'}
                        </button>
                    ) : (
                        <div className="space-y-2">
                            <span className={label}>Reason shown to the customer</span>
                            <textarea className={field} rows={2} value={rejectReason} onChange={(e) => setRejectReason(e.target.value)} />
                            <div className="flex gap-2">
                                <button type="button" className="flex-1 py-2 rounded-lg border border-gray-300 text-sm" onClick={() => setShowReject(false)}>Cancel</button>
                                <button type="button" className="flex-1 py-2 rounded-lg bg-red-600 text-white text-sm disabled:opacity-50" disabled={busy || !rejectReason.trim()} onClick={() => onUpdate({ status: 'Rejected', comment: rejectReason })}>Confirm reject</button>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default ReturnWorkflowPanel;
