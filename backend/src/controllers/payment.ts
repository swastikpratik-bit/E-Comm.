import { stripe } from "../app.js";
import { TryCatch } from "../middlewares/error.js";
import { Coupon } from "../models/coupon.js";
import ErrorHandler from "../utils/utility-class.js";



export const createPaymentIntent = TryCatch(async (req, res, next) => {
    const { amount } = req.body;
  
    if (!amount)
      return next(new ErrorHandler("Please enter amount", 400));
  
    const paymentIntent = await stripe.paymentIntents.create({
        amount : Number(amount) * 100   ,
        currency : "inr",
    })
  
    return res.status(201).json({
        success: true,
        clientSecret : paymentIntent.client_secret,
    });
  });
export const createCoupon = TryCatch(async (req, res, next) => {
    const { coupon, amount } = req.body;
  
    if (!coupon || !amount)
      return next(new ErrorHandler("Please enter both coupon and amount", 400));
  
    await Coupon.create({ code : coupon, amount });
  
    return res.status(201).json({
      success: true,
      message: `Coupon ${coupon} Created Successfully`,
    });
  });


export const applyDis = TryCatch(async (req, res, next) =>{
    const { coupon } = req.query;

    const discount = await Coupon.findOne({code : coupon})  

    if(!discount){
        return next(new ErrorHandler("Invalid Code" , 400));
    }

    return res.status(200).json({
        success : true, 
        discount : discount.amount
    });
});

export const allCoupons = TryCatch(async(req, res, next) =>{
    const coupons = await Coupon.find({});
    return res.status(200).json({
        success : true , 
        coupons,
    })
});

export const deleteCoupons = TryCatch(async(req, res, next) =>{
    const {id }  = req.params;
    const coupon = await Coupon.findById(id);
    
    if(!coupon)return next(new ErrorHandler("Invalid id" , 400));

    await coupon.deleteOne();

    return res.status(200).json({
        success : true ,
        message : "Copon Deleted Successfully !" 
        
    })
});