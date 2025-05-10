import {Request, Response} from 'express';
import Review from '../model/Review';

//Creating a new review
export const addReview = async (req: Request, res: Response) => {
    try{
        const review = new Review(req. body);
        await review.save();
        res.status(201).json(review);
    }catch(error){
        res.status(400).json({error: "Cannot create Review"});
    }
};

//Get all review for a shop
export const getReviews = async( req: Request, res: Response) => {
    try{
        const reviews = await Review.find(req.params);
        res.json(reviews);
    } catch(error){
        res.status(400).json({error: "Cannot find reviews"});
    }
};

//Get a positive review for a tailor
export const pReview = async (req: Request, res: Response) => {
    try{
        const review = await Review.findOne({tailorId: req.params.tailorId})
                                    .sort({rating: -1})
                                    .limit(1);
        res.json(review);
    }catch(error){
        res.status(400).json({error: "No Reviews available"})
    }
};

//Get a negative review for a tailor
export const nReview = async (req: Request, res: Response) => {
    try{
        const review = await Review.findOne({tailorId: req.params.tailorId})
                                    .sort({rating: 1})
                                    .limit(1);
        res.json(review);
    }catch(error){
        res.status(400).json({error: "No Reviews available"})
    }
};



