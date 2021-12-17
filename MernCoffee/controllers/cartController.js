// Get model
const Product = require('../models/productModel');
const User = require('../models/userModel');
const Bill = require('../models/billModel');
const Promotion = require('../models/promotionModel');

exports.addProduct = function (req, res) {
  const slug = req.params.product;

  Product.findOne({ slug: slug }, async function (err, p) {
    const user = await User.findById(req.user);
    const cart = user.cart;

    let i;
    for (i = 0; i < cart.length; i++) {
      if (cart[i]._id.toString() == p._id.toString()) {
        break;
      }
    }

    if (i < cart.length) {
      user.cart[i].quantity++;
    } else {
      const product = { '_id': p._id, 'quantity': 1 };
      user.cart.push(product);
    }

    user.quantity++;
    await user.save();

    req.flash('success', 'Product added!');
    res.redirect('back');
  });
}

exports.getCart = async function (req, res) {
  const user = await User.findById(req.user);
  const promoValue = 0;
  const ship = 20000;
  products = [];
  const code = '';
  let total = 0;
  let subtotal = 0;

  for (let i = 0; i < user.cart.length; i++) {
    let product = await Product.findById(user.cart[i]._id);
    product['quantity'] = user.cart[i].quantity;
    products.push(product);
    subtotal += user.cart[i].quantity * product.price;
  }

  total = Math.max(subtotal - promoValue + ship, 0);

  res.render('checkout', {
    title: 'Checkout',
    cart: products,
    user: user,
    code: code,
    promoValue: promoValue,
    ship: ship,
    subtotal: subtotal,
    total: total,
  });
}

exports.updateProduct = async function (req, res) {
  const user = await User.findById(req.user);

  var slug = req.params.product;
  var cart = [];
  for (let i = 0; i < user.cart.length; i++) {
    let product = await Product.findById(user.cart[i]._id);
    product['quantity'] = user.cart[i].quantity;
    cart.push(product);
  }
  var action = req.query.action;

  for (var i = 0; i < cart.length; i++) {
    if (cart[i].slug == slug) {
      switch (action) {
        case "add":
          (user.cart)[i].quantity++;
          user.quantity++;
          break;
        case "remove":
          (user.cart)[i].quantity--;
          if ((user.cart)[i].quantity < 1)
            user.cart.splice(i, 1);
          user.quantity--;
          if (user.quantity < 0)
            user.quantity = 0;
          break;
        case "clear":
          user.quantity -= user.cart[i].quantity;
          if (user.quantity < 0)
            user.quantity = 0;
          user.cart.splice(i, 1);
          if (user.cart.length == 0)
            user.cart = [];
          break;
        default:
          console.log('update problem');
          break;
      }
      break;
    }
  }

  // user.cart = cart;
  await user.save();

  req.flash('success', 'Cart updated!');
  res.redirect('/cart');
}

exports.cleanCart = async function (req, res) {
  const user = await User.findById(req.user);

  user.quantity = 0;
  user.cart = [];
  await user.save();

  req.flash('success', 'Cart cleared!');
  res.redirect('/cart');
}

exports.buynow = async function (req, res) {
  const user = await User.findById(req.user);
  const cart = user.cart;
  const ship = 20000;
  const code = req.body.code;
  var promotion = {
    code: '',
    value: 0
  }

  if (code != '') {
    promotion = await Promotion.findOne({
      code: code
    });
  }

  if (promotion == undefined) {
    promotion = {
      code: '',
      value: 0
    }
  }

  if (cart.length == 0) {
    res.status(400).json({
      status: 'fail',
      message: 'Cart is empty!'
    });
    return;
  }

  let bill = {};
  let total = 0;
  bill.userId = user._id;
  bill.name = user.name;
  bill.products = [];

  for (let i = 0; i < cart.length; i++) {
    let temp = await Product.findById(cart[i]._id);

    let product = {};
    product._id = temp._id;
    product.title = temp.title;
    product.slug = temp.slug;
    product.desc = temp.desc;
    product.category = temp.category;
    product.price = temp.price;
    product.image = temp.image;
    product.quantity = cart[i].quantity;
    total += cart[i].quantity * temp.price;

    bill.products.push(product);
  }

  bill.promoValue = promotion.value;
  bill.subtotal = total;
  bill.total = Math.max(total - promotion.value + ship, 0);
  bill.address = req.body.address;
  bill.phone = req.body.phone;
  bill = await Bill.create(bill);

  user.cart = [];
  user.quantity = 0;
  await user.save();

  res.render('bill', {
    title: 'Billing',
    address: bill.address,
    name: user.name,
    email: user.email,
    phone: bill.phone,
    billid: bill._id,
    products: bill.products,
    code: code,
    promoValue: promotion.value,
    ship: ship,
    subtotal: bill.subtotal,
    total: bill.total
  });
}

exports.applyPromotion = async (req, res) => {
  const user = await User.findById(req.user);
  let promotion = await Promotion.findOne({
    code: req.body.code
  });
  if (promotion == undefined) {
    promotion = { value: 0 }
  }
  const ship = 20000;
  products = [];
  let total = 0;
  let subtotal = 0;

  for (let i = 0; i < user.cart.length; i++) {
    let product = await Product.findById(user.cart[i]._id);
    product['quantity'] = user.cart[i].quantity;
    products.push(product);
    subtotal += user.cart[i].quantity * product.price;
  }

  total = Math.max(subtotal - promotion.value + ship, 0);

  res.render('checkout', {
    title: 'Checkout',
    cart: products,
    user: user,
    code: req.body.code,
    promoValue: promotion.value,
    ship: ship,
    subtotal: subtotal,
    total: total,
  });
}
