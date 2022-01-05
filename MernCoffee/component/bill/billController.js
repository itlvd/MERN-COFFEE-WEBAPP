const Bill = require('../../models/billModel');

const billService = require('./billService');

exports.getAllBills = async function(req, res, next) {
    const page = req.query.page || 1;
    const limit = req.query.limit * 1 || 16;
    const skip = (page - 1) * limit;
    const totalPage = Math.ceil(((await Bill.find({ userId: req.user._id })).length) / limit);
    const bills = await Bill.find({ userId: req.user._id }).sort('-createdAt').skip(skip).limit(limit);

    // res.status(200).json({
    //     status: 'success',
    //     result: bills.length,
    //     data: {
    //         bills,
    //         page,
    //         limit,
    //         totalPage
    //     }
    // });

    res.render("history_bill", {
        title: "Billing",
        bills,
        page,
        limit,
        totalPage
    });
}

exports.getBillByUser = async function(req, res, next) {
    const promo = 0;
    const ship = 20000;
    const bill = await Bill.findOne({
        _id: req.params.id,
        userId: req.user._id
    });

    if (!bill) {
        res.status(200).json({
            status: 'fail',
            message: 'Something is wrong!'
        });
    } else {
        res.render('bill', {
            title: 'Billing',
            address: bill.address,
            name: bill.name,
            email: req.user.email,
            phone: bill.phone,
            billid: bill._id,
            products: bill.products,
            promoValue: bill.promoValue,
            ship: ship,
            subtotal: bill.subtotal,
            total: bill.total
        });
    }
}

exports.getBillByEmployee = async function(req, res, next) {
    const bill = await billService.findBillById(req.params.id);

    res.status(200).json({
        status: 'success',
        data: {
            bill
        }
    });
}

exports.getAllBillUncompleted = async function(req, res, next) {
    const page = req.query.page || 1;
    const limit = req.query.limit * 1 || 16;
    const skip = (page - 1) * limit;
    const totalPage = Math.ceil((await Bill.find({ status: 'processing' })).length / limit);
    const bills = await Bill.find({ status: 'processing' }).sort('createdAt').skip(skip).limit(limit);

    res.render('admin/handleOrder', {
        title: 'Order list',
        bill: bills,
        page,
        totalPage,
    });
}