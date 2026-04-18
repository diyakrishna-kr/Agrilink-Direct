from flask import Flask, render_template, request, redirect, url_for, flash
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.exc import IntegrityError
from datetime import datetime

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///farmercustomer.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = 'change_this_in_prod'

db = SQLAlchemy(app)

class Farmer(db.Model):
    farmer_id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    phone = db.Column(db.String(40))
    location = db.Column(db.String(120))
    bank_details = db.Column(db.String(255))
    products = db.relationship('Product', backref='farmer', lazy=True)

class Customer(db.Model):
    customer_id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    email = db.Column(db.String(120), unique=True)
    phone = db.Column(db.String(40))
    address = db.Column(db.String(255))
    orders = db.relationship('Order', backref='customer', lazy=True)

class Product(db.Model):
    product_id = db.Column(db.Integer, primary_key=True)
    farmer_id = db.Column(db.Integer, db.ForeignKey('farmer.farmer_id'), nullable=False)
    product_name = db.Column(db.String(120), nullable=False)
    category = db.Column(db.String(50), nullable=False)
    price_per_kg = db.Column(db.Float, nullable=False)
    available_quantity = db.Column(db.Float, nullable=False)
    order_details = db.relationship('OrderDetail', backref='product', lazy=True)

class Order(db.Model):
    order_id = db.Column(db.Integer, primary_key=True)
    customer_id = db.Column(db.Integer, db.ForeignKey('customer.customer_id'), nullable=False)
    order_date = db.Column(db.DateTime, default=datetime.utcnow)
    total_amount = db.Column(db.Float, nullable=False)
    order_status = db.Column(db.String(40), default='Placed')
    details = db.relationship('OrderDetail', backref='order', lazy=True)
    payment = db.relationship('Payment', backref='order', uselist=False)

class OrderDetail(db.Model):
    order_detail_id = db.Column(db.Integer, primary_key=True)
    order_id = db.Column(db.Integer, db.ForeignKey('order.order_id'), nullable=False)
    product_id = db.Column(db.Integer, db.ForeignKey('product.product_id'), nullable=False)
    quantity = db.Column(db.Float, nullable=False)
    price = db.Column(db.Float, nullable=False)

class Payment(db.Model):
    payment_id = db.Column(db.Integer, primary_key=True)
    order_id = db.Column(db.Integer, db.ForeignKey('order.order_id'), nullable=False)
    payment_mode = db.Column(db.String(50), nullable=False)
    payment_date = db.Column(db.DateTime, default=datetime.utcnow)
    payment_status = db.Column(db.String(40), nullable=False)

@app.before_first_request
def initialize_db():
    db.create_all()

@app.route('/')
def home():
    products = Product.query.all()
    return render_template('home.html', products=products)

@app.route('/farmer', methods=['GET', 'POST'])
def farmer():
    if request.method == 'POST':
        name = request.form['name']
        phone = request.form['phone']
        location = request.form['location']
        bank = request.form['bank_details']
        f = Farmer(name=name, phone=phone, location=location, bank_details=bank)
        db.session.add(f)
        db.session.commit()
        flash('Farmer added!', 'success')
        return redirect(url_for('farmer'))
    return render_template('farmer.html', farmers=Farmer.query.all())

@app.route('/product', methods=['GET', 'POST'])
def product():
    if request.method == 'POST':
        farmer_id = request.form['farmer_id']
        name = request.form['product_name']
        category = request.form['category']
        price = float(request.form['price_per_kg'])
        qty = float(request.form['available_quantity'])
        p = Product(farmer_id=farmer_id, product_name=name, category=category, price_per_kg=price, available_quantity=qty)
        db.session.add(p)
        db.session.commit()
        flash('Product added!', 'success')
        return redirect(url_for('product'))
    return render_template('product.html', farmers=Farmer.query.all(), products=Product.query.all())

@app.route('/customer', methods=['GET', 'POST'])
def customer():
    if request.method == 'POST':
        try:
            c = Customer(name=request.form['name'], email=request.form['email'], phone=request.form['phone'], address=request.form['address'])
            db.session.add(c)
            db.session.commit()
            flash('Customer added!', 'success')
        except IntegrityError:
            db.session.rollback(); flash('Email already exists', 'danger')
        return redirect(url_for('customer'))
    return render_template('customer.html', customers=Customer.query.all())

@app.route('/order', methods=['GET', 'POST'])
def order():
    if request.method == 'POST':
        customer_id = int(request.form['customer_id'])
        product_id = int(request.form['product_id'])
        quantity = float(request.form['quantity'])
        product = Product.query.get(product_id)
        if not product or product.available_quantity < quantity:
            flash('Not enough stock', 'danger')
            return redirect(url_for('order'))

        total_amount = product.price_per_kg * quantity
        product.available_quantity -= quantity
        o = Order(customer_id=customer_id, total_amount=total_amount)
        db.session.add(o)
        db.session.flush()
        od = OrderDetail(order_id=o.order_id, product_id=product_id, quantity=quantity, price=product.price_per_kg)
        db.session.add(od)
        pay = Payment(order=o, payment_mode=request.form['payment_mode'], payment_status='Success')
        db.session.add(pay)
        db.session.commit()
        flash('Order placed and payment recorded', 'success')
        return redirect(url_for('order'))

    return render_template('order.html', customers=Customer.query.all(), products=Product.query.all(), orders=Order.query.all())

if __name__ == '__main__':
    app.run(debug=True)
