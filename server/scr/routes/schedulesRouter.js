const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const multer = require('multer');
const upload = multer();

const SchedulesController = require("../controllers/SchedulesController");
const adminMiddleware = require('../midlleware/adminMiddleware');


router.get('/', upload.none(), SchedulesController.getAll);
router.get('/:id', upload.none(), SchedulesController.getSchedulesId);

router.post('/create', 
    adminMiddleware, 
    upload.none(),
    [
        body('classes_time').isString().notEmpty(), // Пример валидации, измените согласно вашим требованиям
        upload.none(),
    ],
    SchedulesController.createSchedules);
router.post('/update/:id', 
    adminMiddleware, 
    upload.none(), 

    SchedulesController.updateSchedule);
router.post('/delete', adminMiddleware, upload.none(), SchedulesController.deleteSchedules)
router.post('/deleteId/:id?', adminMiddleware, upload.none(), SchedulesController.deleteSchedule);

router.post('/rentCreate/:scheduleId', adminMiddleware, upload.none(), SchedulesController.rentScheduleCreate);
router.post('/rentDelete/:scheduleId', adminMiddleware, upload.none(), SchedulesController.rentScheduleDelete);


module.exports = router;