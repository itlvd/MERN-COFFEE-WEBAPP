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

exports.getAllPromotionsCustomer = async (req, res) => {
    const { count, promos } = await promotionService.getPromotions();
    res.render("news_promotion", {
        title: "Customer Promotion",
        count: count,
        promotions: promos,
    })
};

exports.getAllPromotions = async (req, res) => {
    const { count, promos } = await promotionService.getPromotions();
    res.render("admin/news_promo", {
        title: "Admin Promotion",
        count: count,
        promotions: promos,
    })
};


exports.add_promotion = (req, res) => {
    let error = req.query.message || undefined;
    if (error) {
        error = req.query.message;
    }

    res.render('admin/add_promotion', {
        title: "Add promotion",
        error: error,
    });
}

exports.postAddPromotion = (req, res) => {
    const form = formidable({});
    form.parse(req, async (err, fields, files) => {
        var pro = fields;
        if (pro.title == "" || pro.code == "" || pro.value == "" || pro.quantity === "" || pro.expiryDate == "") {
            res.redirect('/admin/promotions/add-promotion?message=please enter full information');
        } else if (files.image.originalFilename.indexOf('jpg') === -1 && files.image.originalFilename.indexOf('png') === -1 && files.image.originalFilename.indexOf('jpeg') === -1  &&
                    files.image.originalFilename.indexOf('JPG') === -1 && files.image.originalFilename.indexOf('PNG') === -1 && files.image.originalFilename.indexOf('JPEG') === -1 ) {
          res.redirect('/admin/promotions/add-promotion?message=please upload png/jpg/jpeg image');
  
        } else {
            pro.slug = pro.slug + "";
            pro["slug"] = pro.title.replace(/\s+/g, '-').toLowerCase();

            const promo = await promotionService.findPromoWithSlug(pro.slug);
            if (promo) {
                //req.flash('danger', 'Promotion title exists, choose another.');
                res.redirect('/admin/promotions/add-promotion?message=Promotion title exists, choose another.');
            } else {
                const newPromo = await promotionService.createNewPromotion(pro);

                let newLink;
                if (files.image.originalFilename) {
                    await cloudinary.uploader.upload(files.image.filepath, { public_id: `mern/propotion/${pro._id}/${files.image.newFilename}`, width: 479, height: 340, crop: "scale", fetch_format: "jpg" }, function (error, result) {
                        //await promotionService.updateImage(result.url, newPromo._id);
                        newLink = result.url;
                    });

                    await promotionService.updateImage(newLink, newPromo._id);
                    res.redirect('/admin/promotions');
                }   
                else {
                    res.redirect('/admin/promotions');  
                } 
            }
        }
    })
};