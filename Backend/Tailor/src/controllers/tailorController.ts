// tailorController.ts
import { NextFunction, Request, Response } from 'express';
import TailorModel, { Tailor } from '../models/Tailor';
import axios from 'axios';

export const TailorController = {
    //Get details of all tailors-shops
    getAllTailors: async (req: Request, res: Response) => {
        try {
            const tailors = await TailorModel.find();
            res.json(tailors);
        } catch (error) {
            res.status(500).send('Server error');
        }
    },

    //Get details of a single talor-shop
    getTailorById: async (req: Request, res: Response) => {
        const _id = req.params.tailorId;
        try {
            const tailor = await TailorModel.findById(_id);
            if (tailor) {
                res.json(tailor);
            } else {
                res.status(404).send('Tailor not found');
            }
        } catch (error) {
            res.status(500).send('Server error');
        }
    },

    //Register a shop-tailor
    createTailor: async (req: Request, res: Response) => {
        const tailorData: Partial<Tailor> = { ...req.body };
        try {
            const tailor = new TailorModel(tailorData);
            const newTailor = await tailor.save();
            res.status(201).json(newTailor);
        } catch (error) {
            res.status(400).send('Error creating tailor');
        }
    },

    //Updating the tailor-shop details
    updateTailor: async (req: Request, res: Response) => {
        const firebaseUid = req.params.firebaseUid;
        const updates = req.body;
        try {
            const updatedTailor = await TailorModel.findByIdAndUpdate(firebaseUid, updates, { new: true });
            if (updatedTailor) {
                res.json(updatedTailor);
            } else {
                res.status(404).send('Tailor not found');
            }
        } catch (error) {
            res.status(400).send('Error updating tailor');
        }
    },

    //Deleting a tailor-shop
    deleteTailor: async (req: Request, res: Response) => {
        const tailorId = req.params.tailorId;
        try {
            const deletedTailor = await TailorModel.findByIdAndDelete(tailorId);
            if (deletedTailor) {
                res.status(204).send();
            } else {
                res.status(404).send('Tailor not found');
            }
        } catch (error) {
            res.status(500).send('Server error');
        }
    },

    //Getting the reviews of a particular tailor-shop
    getReviews: async(req: Request, res: Response, next: NextFunction)=> {
        console.log(req.params.tailorId);
        try {
            const tailorId = req.params.tailorId;
            const reviewsServiceUrl = `http://localhost:5004/api/review/${tailorId}`;
            const response = await axios.get(reviewsServiceUrl);
            const reviews = response.data;

            res.status(200).json(reviews);
        } catch (error) {
            if(error){
                res.status(400).json({error: "Error fetching data of reviews"});
            }else {
                res.status(500).json({error: "Server error"});
            }
            
        }
    },

    getTailorsByDress: async (req: Request, res: Response) => {
        const dressName = req.params.dress;
        try {
            const tailors = await TailorModel.find({ 'dress.name': dressName });
            res.json(tailors);
        } catch (error) {
            console.error(error); // Log the error for debugging
            res.status(500).send('Internal Server Error');
        }
    },

    //get tailors by firebaseUid
    getByUid: async (req: Request, res: Response, next: NextFunction) => {
        const firebaseUid = req.params.firebaseUid;
        try {
            const tailors = await TailorModel.find({ firebaseUid:firebaseUid });
            res.json(tailors);
        } catch (error) {
            console.error(error); // Log the error for debugging
            res.status(500).send('Internal Server Error');
        }
    }
};
