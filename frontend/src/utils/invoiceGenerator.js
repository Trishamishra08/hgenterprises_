import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export const generateInvoice = (order, logoUrl = null) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    const primaryColor = [139, 67, 86]; // #8B4356

    const addHeads = () => {
        // Logo Placeholder or Image
        if (logoUrl) {
            try {
                doc.addImage(logoUrl, 'JPEG', 15, 15, 25, 25);
            } catch (e) {
                console.warn("Logo failed to load", e);
            }
        } else {
            // Fallback Typographic Logo
            doc.setFontSize(24);
            doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
            doc.setFont('serif', 'bold');
            doc.text('HG', 15, 28);
        }

        // Company Name & Info
        doc.setFontSize(18);
        doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
        doc.setFont('serif', 'bold');
        doc.text('HG ENTERPRISES', logoUrl ? 45 : 15, 25);

        doc.setFontSize(9);
        doc.setTextColor(120);
        doc.setFont('helvetica', 'normal');
        doc.text('Premium Jewelry & Manufacturing Hub', logoUrl ? 45 : 15, 32);
        doc.text('GSTIN: 27AABCH1234F1Z1 (Sample)', logoUrl ? 45 : 15, 37);

        // Header Right - Invoice Label
        doc.setFontSize(30);
        doc.setTextColor(240, 240, 240);
        doc.setFont('helvetica', 'bold');
        doc.text('INVOICE', pageWidth - 15, 30, { align: 'right' });
    };

    addHeads();

    // Horizontal Divider
    doc.setDrawColor(240);
    doc.line(15, 45, pageWidth - 15, 45);

    // Metadata Section
    doc.setTextColor(0);
    doc.setFontSize(10);

    // Left: Order Info
    doc.setFont('helvetica', 'bold');
    doc.text('ORDER SUMMARY', 15, 55);
    doc.setFont('helvetica', 'normal');
    doc.text('Order ID:', 15, 62);
    doc.setFont('helvetica', 'bold');
    doc.text(`#${(order.orderId || order.id || '').replace('ORD-', '')}`, 35, 62);

    doc.setFont('helvetica', 'normal');
    doc.text('Order Date:', 15, 68);
    const orderDate = new Date(order.date || order.createdAt);
    doc.setFont('helvetica', 'bold');
    doc.text(`${orderDate.toLocaleDateString()} at ${orderDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`, 35, 68);

    doc.setFont('helvetica', 'normal');
    doc.text('Payment:', 15, 74);
    doc.setFont('helvetica', 'bold');
    doc.text(order.paymentMethod?.toUpperCase() || 'ONLINE', 35, 74);

    // Right: Billing Address
    const address = order.shippingAddress || order.address || {};
    doc.setFont('helvetica', 'bold');
    doc.text('BILL TO', pageWidth - 80, 55);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text(address.fullName || address.name || 'Valued Patron', pageWidth - 80, 62);

    doc.setFontSize(9);
    doc.setTextColor(100);
    const addrLines = doc.splitTextToSize(`${address.address || address.flatNo || ''} ${address.area || ''}, ${address.city || ''}, ${address.state || ''} - ${address.pincode || ''}`, 65);
    doc.text(addrLines, pageWidth - 80, 68);

    // Items Table
    const tableColumn = ["Item Description", "Unit Price", "Qty", "Total"];
    const tableRows = (order.items || []).map(item => [
        item.name,
        `INR ${item.price.toLocaleString()}`,
        item.quantity || item.qty || 1,
        `INR ${(item.price * (item.quantity || item.qty || 1)).toLocaleString()}`
    ]);

    autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: 90,
        theme: 'grid',
        headStyles: {
            fillColor: primaryColor,
            textColor: 255,
            fontStyle: 'bold',
            halign: 'center'
        },
        columnStyles: {
            0: { cellWidth: 'auto' },
            1: { halign: 'right', cellWidth: 35 },
            2: { halign: 'center', cellWidth: 20 },
            3: { halign: 'right', cellWidth: 35 }
        },
        styles: { font: 'helvetica', fontSize: 9 },
        alternateRowStyles: { fillColor: [250, 245, 246] },
        margin: { left: 15, right: 15 }
    });

    // Summary Section
    const finalY = doc.lastAutoTable.finalY + 10;
    const summaryX = pageWidth - 90;

    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.setFont('helvetica', 'normal');

    const subtotal = order.subtotal || (order.items?.reduce((acc, i) => acc + (i.price * (i.quantity || i.qty || 1)), 0)) || 0;
    const shipping = order.shippingAmount || order.shipping || 0;
    const gst = order.gstAmount || 0;
    const total = order.total || order.amount || 0;

    doc.text('Consignment Subtotal:', summaryX, finalY);
    doc.text(`INR ${subtotal.toLocaleString()}`, pageWidth - 15, finalY, { align: 'right' });

    if (gst > 0) {
        doc.text('GST (Included):', summaryX, finalY + 7);
        doc.text(`INR ${gst.toLocaleString()}`, pageWidth - 15, finalY + 7, { align: 'right' });
    }

    doc.text('Conveyance Fees:', summaryX, finalY + (gst > 0 ? 14 : 7));
    doc.text(shipping === 0 ? 'FREE' : `INR ${shipping.toLocaleString()}`, pageWidth - 15, finalY + (gst > 0 ? 14 : 7), { align: 'right' });

    // Grand Total Box
    const totalY = finalY + (gst > 0 ? 25 : 18);
    doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.rect(summaryX - 5, totalY - 7, pageWidth - (summaryX - 5) - 15, 12, 'F');

    doc.setFontSize(12);
    doc.setTextColor(255);
    doc.setFont('helvetica', 'bold');
    doc.text('FINAL REMITTANCE', summaryX, totalY);
    doc.text(`INR ${total.toLocaleString()}`, pageWidth - 20, totalY, { align: 'right' });

    // Authorized Signatory
    const bottomY = totalY + 30;
    doc.setTextColor(0);
    doc.setFontSize(10);
    doc.text('Authorized Signatory', pageWidth - 15, bottomY, { align: 'right' });
    doc.setDrawColor(200);
    doc.line(pageWidth - 70, bottomY - 5, pageWidth - 15, bottomY - 5);
    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.text('HG Enterprises Hub', pageWidth - 15, bottomY + 5, { align: 'right' });

    // Footer
    doc.setFontSize(8);
    doc.setTextColor(180);
    doc.setFont('helvetica', 'italic');
    const footerText = "Thank you for choosing HG Enterprises. Certified Authentic Premium Manifest.";
    doc.text(footerText, pageWidth / 2, doc.internal.pageSize.height - 15, { align: 'center' });

    return doc;
};
