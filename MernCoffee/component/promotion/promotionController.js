const cloudinary = require('cloudinary').v2;
const formidable = require('formidable');
const { check, validationResult } = require('express-validator');
const promotionService = require('./promotionService');


// config cloudinary
cloudinary.config({ 
    cloud_name: process.env.CLOUD_NAME, 
    api_key: process.env.API_KEY, 
    api_secret: process.env.API_SECRET,
    // secure: true
});


exports.getAllPromotions =  async (req, res) => {
    const {count, promos} = await promotionService.getPromotions();
    res.render("admin/news_promo", {
        title: "Admin Promotion",
        count: count,
        promotions: promos,
    })
};


exports.add_promotion = (req, res) => {
    res.render('admin/add_promotion', {
        title: "Add promotion",
    });
}

exports.postAddPromotion = (req, res) => {
    const form = formidable({});
    form.parse(req, async (err, fields, files) => {
        var pro = fields;      
        pro.slug = pro.slug + "";
        pro["slug"] = pro.title.replace(/\s+/g, '-').toLowerCase();
        
        const promo = await promotionService.findPromoWithSlug(pro.slug);
        if (promo) {
            //req.flash('danger', 'Promotion title exists, choose another.');
            res.redirect('/admin/add-promotions');
        } else {
            const newPromo = await promotionService.createNewPromotion(pro);
    
            let newLink;
            await cloudinary.uploader.upload(files.image.filepath, { public_id: `mern/propotion/${pro._id}/${newPromo.code}`,width: 479, height: 340, crop: "scale", fetch_format: "jpg"}, function(error, result) {
                //await promotionService.updateImage(result.url, newPromo._id);
               newLink = result.url;
            
            });
            
            await promotionService.updateImage(newLink, newPromo._id);
            res.redirect('/admin/promotions');
        }

        // Promotion.findOne({ slug: pro.slug }, (err, promotion) => {
        //     if (promotion) {
        //         req.flash('danger', 'Promotion title exists, choose another.');
        //         res.redirect('/admin/promotions');
        //     } else {
        //         promotion = new Promotion(pro);
        //         promotion.save()
        //         .then((result) => {
        //             cloudinary.uploader.upload(files.image.filepath, { public_id: `mern/propotion/${result._id}/${result.nameImage}`,width: 479, height: 340, crop: "scale"})
        //             res.redirect('/promotions');
        //         })
        //         .catch(err => console.log(err));
        //     }
        // });
    })
};