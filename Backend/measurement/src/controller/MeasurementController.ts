import { Request, Response } from 'express';
import Measurement from '../model/Measurement';

// Get measurement of order
export const getMeasurement = async (req: Request, res: Response) => {
    try {
        const measurements = await Measurement.find({orderId: req.params.orderId});
        res.json(measurements);
    } catch (err) {
        res.status(400).json({ error: "Cannot get the measurements" });
    }
};

// Add measurement of a user
export const addMeasurement = async (req: Request, res: Response) => {
    try {
        const measurement = new Measurement(req.body);
        await measurement.save();
        res.status(201).json(measurement);
    } catch (error) {
        res.status(400).json({ error: "Cannot create measurements" });
    }
};

// Update measurement of a user
export const updateMeasurement = async (req: Request, res: Response) => {
    const { custId } = req.params;
    try {
        const updatedMeasurement = await Measurement.findOneAndUpdate(
            { custId },
            req.body,
            { new: true, runValidators: true } // returns the updated document
        );

        if (!updatedMeasurement) {
            return res.status(404).json({ error: "Measurement not found" });
        }

        res.json(updatedMeasurement);
    } catch (error) {
        res.status(400).json({ error: "Cannot update measurements" });
    }
};
