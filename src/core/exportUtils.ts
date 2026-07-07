export const exportOrdersToCSV = (orders: any[]) => {
  const headers = ['رقم الطلب', 'تاريخ الطلب', 'اسم العميل', 'رقم الهاتف', 'العنوان', 'طريقة الدفع', 'المبلغ الإجمالي', 'العملة', 'حالة الطلب', 'المنتجات'];
  
  const csvContent = [
    headers.join(','),
    ...orders.map(order => {
      const products = order.items.map((item: any) => `${item.product?.name || ''} (الكمية: ${item.quantity})`).join(' | ');
      return [
        order.id,
        order.date,
        `"${order.customerName}"`,
        `"${order.phone}"`,
        `"${order.address}"`,
        `"${order.paymentMethod}"`,
        order.totalPrice,
        order.currency || 'SAR',
        order.status,
        `"${products}"`
      ].join(',');
    })
  ].join('\n');

  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `orders_export_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
export const printOrder = (order: any, siteName: string) => {
  const printWindow = window.open('', '_blank');
  if (!printWindow) return;
  const productsRows = order.items.map((item: any) => `
    <tr>
      <td style="border: 1px solid #ddd; padding: 8px;">${item.product?.name || ''}</td>
      <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">${item.quantity}</td>
      <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">${item.product?.price || 0}</td>
      <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">${(item.product?.price || 0) * item.quantity}</td>
    </tr>
  `).join('');

  printWindow.document.write(`
    <html dir="rtl" lang="ar">
      <head>
        <title>فاتورة طلب ${order.id}</title>
        <style>
          body { font-family: Tahoma, Arial, sans-serif; padding: 20px; color: #333; }
          .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 10px; margin-bottom: 20px; }
          .header h1 { margin: 0; font-size: 24px; }
          .order-details { margin-bottom: 20px; }
          .order-details p { margin: 5px 0; font-size: 14px; }
          table { w-full; border-collapse: collapse; margin-bottom: 20px; width: 100%; }
          th { background-color: #f2f2f2; border: 1px solid #ddd; padding: 8px; text-align: center; }
          td { font-size: 14px; }
          .total { text-align: left; font-size: 18px; font-weight: bold; }
          @media print {
            body { -webkit-print-color-adjust: exact; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>${siteName || 'فاتورة طلب'}</h1>
          <p>رقم الفاتورة: ${order.id}</p>
        </div>
        
        <div class="order-details">
          <p><strong>التاريخ:</strong> ${order.date}</p>
          <p><strong>اسم العميل:</strong> ${order.customerName}</p>
          <p><strong>رقم الهاتف:</strong> ${order.phone}</p>
          <p><strong>العنوان:</strong> ${order.address}</p>
          <p><strong>طريقة الدفع:</strong> ${order.paymentMethod}</p>
        </div>

        <table>
          <thead>
            <tr>
              <th>المنتج</th>
              <th>الكمية</th>
              <th>سعر الوحدة</th>
              <th>المجموع</th>
            </tr>
          </thead>
          <tbody>
            ${productsRows}
          </tbody>
        </table>

        <div class="total">
          الإجمالي: ${order.totalPrice} ${order.currency || 'SAR'}
        </div>

        <script>
          window.onload = function() {
            window.print();
            setTimeout(function() { window.close(); }, 500);
          }
        </script>
      </body>
    </html>
  `);
  printWindow.document.close();
};
