const Bill = require('../../models/billModel');

exports.findBillById = async(id) => {
  return await Bill.findById(id);
}
