const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.NOTIFY_EMAIL_USER,
    pass: process.env.NOTIFY_EMAIL_PASS,
  },
});

const baseStyle = `
  font-family: Arial, sans-serif;
  direction: rtl;
  text-align: right;
  color: #333;
  max-width: 600px;
  margin: 0 auto;
  padding: 24px;
`;

const headingStyle = `
  color: #FF6B00;
  font-size: 22px;
  margin-bottom: 16px;
`;

const tableStyle = `
  width: 100%;
  border-collapse: collapse;
  margin: 16px 0;
`;

const thStyle = `
  background-color: #FF6B00;
  color: #fff;
  padding: 8px 12px;
  text-align: right;
`;

const tdStyle = `
  padding: 8px 12px;
  border-bottom: 1px solid #eee;
  text-align: right;
`;

const totalStyle = `
  font-size: 18px;
  font-weight: bold;
  color: #FF6B00;
  margin-top: 12px;
`;

const dividerStyle = `
  border: none;
  border-top: 2px solid #FF6B00;
  margin: 20px 0;
`;

function buildItemsTable(items) {
  const rows = items
    .map(
      (item) => `
      <tr>
        <td style="${tdStyle}">${item.title}</td>
        <td style="${tdStyle}">${item.quantity}</td>
        <td style="${tdStyle}">₪${item.price}</td>
        <td style="${tdStyle}">₪${item.price * item.quantity}</td>
      </tr>`
    )
    .join('');

  return `
    <table style="${tableStyle}">
      <thead>
        <tr>
          <th style="${thStyle}">מוצר</th>
          <th style="${thStyle}">כמות</th>
          <th style="${thStyle}">מחיר יחידה</th>
          <th style="${thStyle}">סה"כ</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>`;
}

function buildOwnerHtml(order, customer) {
  return `
    <div style="${baseStyle}">
      <h2 style="${headingStyle}">🎉 הזמנה חדשה התקבלה!</h2>
      <hr style="${dividerStyle}" />

      <h3 style="color:#FF6B00;">פרטי לקוח</h3>
      <p><strong>שם:</strong> ${customer.name}</p>
      <p><strong>אימייל:</strong> ${customer.email}</p>
      <p><strong>טלפון:</strong> ${order.phoneNumber}</p>

      <h3 style="color:#FF6B00;">כתובת למשלוח</h3>
      <p>${order.address}, ${order.city}${order.postalCode ? ` ${order.postalCode}` : ''}</p>

      <h3 style="color:#FF6B00;">פריטים שהוזמנו</h3>
      ${buildItemsTable(order.items)}

      <p style="${totalStyle}">סה"כ לתשלום: ₪${order.totalPrice}</p>
      ${order.shippingCost > 0 ? `<p style="color:#555;">מתוכם משלוח: ₪${order.shippingCost}</p>` : '<p style="color:#555;">משלוח: חינם</p>'}
    </div>`;
}

function buildCustomerHtml(order, customer) {
  return `
    <div style="${baseStyle}">
      <h2 style="${headingStyle}">תודה על הזמנתך, ${customer.name}!</h2>
      <p style="font-size:16px;">ההזמנה שלך התקבלה ובדרך אליך 🚀</p>
      <hr style="${dividerStyle}" />

      <h3 style="color:#FF6B00;">פרטי ההזמנה</h3>
      ${buildItemsTable(order.items)}

      <p style="${totalStyle}">סה"כ: ₪${order.totalPrice}</p>
      ${order.shippingCost > 0 ? `<p style="color:#555;">מתוכם משלוח: ₪${order.shippingCost}</p>` : '<p style="color:#555;">משלוח: חינם</p>'}

      <hr style="${dividerStyle}" />
      <p style="color:#888; font-size:14px;">תודה שבחרת ב-LightGadget! נשמח לשמוע ממך אם יש שאלות. 💡</p>
    </div>`;
}

async function sendOrderEmails(order, customer) {
  try {
    await transporter.sendMail({
      from: `"LightGadget" <${process.env.NOTIFY_EMAIL_USER}>`,
      to: process.env.OWNER_EMAIL,
      subject: '🎉 הזמנה חדשה - LightGadget',
      html: buildOwnerHtml(order, customer),
    });
  } catch (err) {
    console.error('Owner email failed:', order._id, err.message);
  }

  try {
    await transporter.sendMail({
      from: `"LightGadget" <${process.env.NOTIFY_EMAIL_USER}>`,
      to: customer.email,
      subject: 'אישור הזמנה - LightGadget',
      html: buildCustomerHtml(order, customer),
    });
  } catch (err) {
    console.error('Customer email failed:', order._id, err.message);
  }
}

module.exports = { sendOrderEmails };
