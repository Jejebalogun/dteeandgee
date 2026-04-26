"""
Email utility for D'Tee & Gee Kitchen
Handles sending order confirmation and notification emails
"""
import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from datetime import datetime

# Email configuration from environment variables
SMTP_SERVER = os.environ.get('SMTP_SERVER', 'smtp.gmail.com')
SMTP_PORT = int(os.environ.get('SMTP_PORT', 587))
SMTP_USERNAME = os.environ.get('SMTP_USERNAME', '')
SMTP_PASSWORD = os.environ.get('SMTP_PASSWORD', '')
FROM_EMAIL = os.environ.get('FROM_EMAIL', 'noreply@dteeandgee.com')
BUSINESS_NAME = "D'Tee & Gee Kitchen"


def send_email(to_email, subject, html_content, text_content=None):
    """
    Send an email using SMTP

    Args:
        to_email: Recipient email address
        subject: Email subject
        html_content: HTML content of the email
        text_content: Plain text fallback (optional)

    Returns:
        bool: True if email sent successfully, False otherwise
    """
    if not SMTP_USERNAME or not SMTP_PASSWORD:
        print("Email not configured - SMTP credentials missing")
        return False

    try:
        msg = MIMEMultipart('alternative')
        msg['Subject'] = subject
        msg['From'] = f"{BUSINESS_NAME} <{FROM_EMAIL}>"
        msg['To'] = to_email

        # Add plain text version
        if text_content:
            part1 = MIMEText(text_content, 'plain')
            msg.attach(part1)

        # Add HTML version
        part2 = MIMEText(html_content, 'html')
        msg.attach(part2)

        # Connect and send
        with smtplib.SMTP(SMTP_SERVER, SMTP_PORT) as server:
            server.starttls()
            server.login(SMTP_USERNAME, SMTP_PASSWORD)
            server.sendmail(FROM_EMAIL, to_email, msg.as_string())

        print(f"Email sent successfully to {to_email}")
        return True

    except Exception as e:
        print(f"Failed to send email: {str(e)}")
        return False


def format_currency(amount):
    """Format amount as Nigerian Naira"""
    return f"₦{amount:,.2f}"


def send_order_confirmation(order, user_email, user_name=None):
    """
    Send order confirmation email

    Args:
        order: Order object with items
        user_email: Customer email address
        user_name: Customer name (optional)
    """
    customer_name = user_name or order.guest_name or "Valued Customer"

    # Build items HTML
    items_html = ""
    for item in order.items:
        product_name = item.product.name if item.product else "Product"
        items_html += f"""
        <tr>
            <td style="padding: 12px; border-bottom: 1px solid #eee;">{product_name}</td>
            <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: center;">{item.quantity}</td>
            <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: right;">{format_currency(item.unit_price)}</td>
            <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: right;">{format_currency(item.total_price)}</td>
        </tr>
        """

    # Payment method display
    payment_methods = {
        'paystack': 'Card Payment (Paystack)',
        'bank_transfer': 'Bank Transfer',
        'cash_on_delivery': 'Cash on Delivery'
    }
    payment_display = payment_methods.get(order.payment_method, order.payment_method)

    # Payment status badge
    payment_status_colors = {
        'paid': '#22c55e',
        'pending': '#f59e0b',
        'failed': '#ef4444'
    }
    payment_color = payment_status_colors.get(order.payment_status, '#6b7280')

    html_content = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f5f5;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <!-- Header -->
            <div style="background: linear-gradient(135deg, #D4AF37, #7FB3D3); padding: 30px; text-align: center; border-radius: 12px 12px 0 0;">
                <h1 style="color: white; margin: 0; font-size: 28px;">D'Tee & Gee Kitchen</h1>
                <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0;">Order Confirmation</p>
            </div>

            <!-- Content -->
            <div style="background: white; padding: 30px; border-radius: 0 0 12px 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                <p style="font-size: 16px; color: #333;">Hello {customer_name},</p>

                <p style="font-size: 16px; color: #333;">
                    Thank you for your order! We're excited to prepare your delicious meal.
                </p>

                <!-- Order Details Box -->
                <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
                    <h3 style="margin: 0 0 15px 0; color: #333;">Order Details</h3>
                    <p style="margin: 5px 0; color: #666;">
                        <strong>Order Number:</strong> #{order.order_number}
                    </p>
                    <p style="margin: 5px 0; color: #666;">
                        <strong>Date:</strong> {order.created_at.strftime('%B %d, %Y at %I:%M %p')}
                    </p>
                    <p style="margin: 5px 0; color: #666;">
                        <strong>Payment Method:</strong> {payment_display}
                    </p>
                    <p style="margin: 5px 0; color: #666;">
                        <strong>Payment Status:</strong>
                        <span style="color: {payment_color}; font-weight: bold;">{order.payment_status.upper()}</span>
                    </p>
                </div>

                <!-- Items Table -->
                <h3 style="margin: 25px 0 15px 0; color: #333;">Order Items</h3>
                <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
                    <thead>
                        <tr style="background: #D4AF37; color: white;">
                            <th style="padding: 12px; text-align: left;">Item</th>
                            <th style="padding: 12px; text-align: center;">Qty</th>
                            <th style="padding: 12px; text-align: right;">Price</th>
                            <th style="padding: 12px; text-align: right;">Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items_html}
                    </tbody>
                    <tfoot>
                        <tr style="background: #f8f9fa;">
                            <td colspan="3" style="padding: 12px; text-align: right; font-weight: bold;">Total:</td>
                            <td style="padding: 12px; text-align: right; font-weight: bold; color: #D4AF37; font-size: 18px;">
                                {format_currency(order.total_amount)}
                            </td>
                        </tr>
                    </tfoot>
                </table>

                <!-- Delivery Info -->
                <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
                    <h3 style="margin: 0 0 15px 0; color: #333;">Delivery Information</h3>
                    <p style="margin: 5px 0; color: #666;">
                        <strong>Address:</strong> {order.delivery_address}
                    </p>
                    <p style="margin: 5px 0; color: #666;">
                        <strong>Phone:</strong> {order.phone_number}
                    </p>
                    {f'<p style="margin: 5px 0; color: #666;"><strong>Notes:</strong> {order.notes}</p>' if order.notes else ''}
                </div>

                <!-- Bank Transfer Instructions -->
                {f'''
                <div style="background: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f59e0b;">
                    <h3 style="margin: 0 0 10px 0; color: #92400e;">Bank Transfer Instructions</h3>
                    <p style="margin: 5px 0; color: #78350f;">
                        Please transfer <strong>{format_currency(order.total_amount)}</strong> to:
                    </p>
                    <p style="margin: 10px 0 5px 0; color: #78350f;">
                        <strong>Bank:</strong> Access Bank<br>
                        <strong>Account Name:</strong> D'Tee & Gee Kitchen<br>
                        <strong>Account Number:</strong> 1234567890
                    </p>
                    <p style="margin: 10px 0 0 0; color: #78350f; font-size: 13px;">
                        Use your order number <strong>#{order.order_number}</strong> as payment reference.
                    </p>
                </div>
                ''' if order.payment_method == 'bank_transfer' else ''}

                <!-- Footer Message -->
                <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
                    <p style="color: #666; font-size: 14px;">
                        Questions about your order? Contact us at<br>
                        <a href="mailto:support@dteeandgee.com" style="color: #D4AF37;">support@dteeandgee.com</a>
                        or call <a href="tel:+2348012345678" style="color: #D4AF37;">+234 801 234 5678</a>
                    </p>
                    <p style="color: #999; font-size: 12px; margin-top: 20px;">
                        © {datetime.now().year} D'Tee & Gee Kitchen. All rights reserved.
                    </p>
                </div>
            </div>
        </div>
    </body>
    </html>
    """

    # Plain text version
    text_content = f"""
    D'Tee & Gee Kitchen - Order Confirmation

    Hello {customer_name},

    Thank you for your order!

    Order Number: #{order.order_number}
    Date: {order.created_at.strftime('%B %d, %Y at %I:%M %p')}
    Payment Method: {payment_display}
    Payment Status: {order.payment_status.upper()}

    Delivery Address: {order.delivery_address}
    Phone: {order.phone_number}

    Total: {format_currency(order.total_amount)}

    Questions? Contact us at support@dteeandgee.com

    © {datetime.now().year} D'Tee & Gee Kitchen
    """

    subject = f"Order Confirmation - #{order.order_number}"
    return send_email(user_email, subject, html_content, text_content)


def send_order_status_update(order, user_email, user_name=None):
    """
    Send order status update email

    Args:
        order: Order object
        user_email: Customer email address
        user_name: Customer name (optional)
    """
    customer_name = user_name or order.guest_name or "Valued Customer"

    status_messages = {
        'confirmed': ('Order Confirmed! 🎉', 'We have received your order and it has been confirmed. We will start preparing it soon.'),
        'preparing': ('Cooking in Progress! 👨‍🍳', 'Our chefs are now preparing your delicious order.'),
        'ready': ('Order Ready! 📦', 'Your order is ready and will be dispatched shortly.'),
        'delivered': ('Order Delivered! 🚚', 'Your order has been delivered. Enjoy your meal!'),
        'cancelled': ('Order Cancelled', 'Your order has been cancelled. If you did not request this, please contact us.')
    }

    title, message = status_messages.get(order.status, ('Order Update', 'Your order status has been updated.'))

    html_content = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f5f5;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #D4AF37, #7FB3D3); padding: 30px; text-align: center; border-radius: 12px 12px 0 0;">
                <h1 style="color: white; margin: 0;">D'Tee & Gee Kitchen</h1>
            </div>
            <div style="background: white; padding: 30px; border-radius: 0 0 12px 12px;">
                <h2 style="color: #333; text-align: center;">{title}</h2>
                <p style="color: #666; text-align: center; font-size: 16px;">{message}</p>
                <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center;">
                    <p style="margin: 0; color: #333;"><strong>Order:</strong> #{order.order_number}</p>
                    <p style="margin: 10px 0 0 0; color: #333;"><strong>Status:</strong> {order.status.upper()}</p>
                </div>
                <p style="color: #999; font-size: 12px; text-align: center; margin-top: 30px;">
                    © {datetime.now().year} D'Tee & Gee Kitchen
                </p>
            </div>
        </div>
    </body>
    </html>
    """

    subject = f"{title} - Order #{order.order_number}"
    return send_email(user_email, subject, html_content)


def send_password_reset_email(user_email, username, token):
    """
    Send password reset email with a reset link.

    Args:
        user_email: User's email address
        username: User's username
        token: Password reset token
    """
    import os
    base_url = os.environ.get('APP_BASE_URL', 'http://localhost:5000')
    reset_link = f"{base_url}/?reset_token={token}"

    html_content = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f5f5;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <!-- Header -->
            <div style="background: linear-gradient(135deg, #D4AF37, #7FB3D3); padding: 30px; text-align: center; border-radius: 12px 12px 0 0;">
                <h1 style="color: white; margin: 0; font-size: 28px;">D'Tee & Gee Kitchen</h1>
                <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0;">Password Reset</p>
            </div>

            <!-- Content -->
            <div style="background: white; padding: 30px; border-radius: 0 0 12px 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                <p style="font-size: 16px; color: #333;">Hello {username},</p>

                <p style="font-size: 16px; color: #333;">
                    We received a request to reset your password. Click the button below to set a new password:
                </p>

                <div style="text-align: center; margin: 30px 0;">
                    <a href="{reset_link}"
                       style="background: linear-gradient(135deg, #D4AF37, #c4a030);
                              color: white; padding: 14px 32px; text-decoration: none;
                              border-radius: 8px; font-size: 16px; font-weight: 600;
                              display: inline-block;">
                        Reset Password
                    </a>
                </div>

                <p style="font-size: 14px; color: #666;">
                    This link will expire in <strong>1 hour</strong>. If you didn't request a password reset, you can safely ignore this email.
                </p>

                <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 20px 0;">
                    <p style="margin: 0; font-size: 13px; color: #666;">
                        If the button doesn't work, copy and paste this link into your browser:<br>
                        <a href="{reset_link}" style="color: #D4AF37; word-break: break-all;">{reset_link}</a>
                    </p>
                </div>

                <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
                    <p style="color: #999; font-size: 12px; margin-top: 20px;">
                        &copy; {datetime.now().year} D'Tee & Gee Kitchen. All rights reserved.
                    </p>
                </div>
            </div>
        </div>
    </body>
    </html>
    """

    text_content = f"""
    D'Tee & Gee Kitchen - Password Reset

    Hello {username},

    We received a request to reset your password.
    Visit this link to reset your password: {reset_link}

    This link expires in 1 hour. If you didn't request this, ignore this email.

    &copy; {datetime.now().year} D'Tee & Gee Kitchen
    """

    subject = "Password Reset - D'Tee & Gee Kitchen"
    return send_email(user_email, subject, html_content, text_content)
