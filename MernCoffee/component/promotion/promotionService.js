const Promotion = require('../../models/promotionModel');

exports.getPromotions = async () => {
    const count = (await Promotion.find()).length;  
    const promos = await Promotion.find();
    return {count, promos};
}

exports.findPromoWithSlug = async (slug) => {
    const promo = await Promotion.findOne({slug: slug});

    return promo;
}

exports.createNewPromotion = async (pro) => {
    const promotion = await new Promotion(pro);
    
    await promotion.save();
    return promotion
}

exports.updateImage = async (newLink, id) => {
    const promotion = await Promotion.findOne({
        _id: id
    });
    if (promotion) {
        promotion.image = newLink;
        await promotion.save();
    }
}